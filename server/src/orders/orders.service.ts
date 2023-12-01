import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { checkoutDtoList } from './dto/checkout.dto';
import { OrderRepository } from 'src/shared/repositories/order.repository';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { STRIPE_CLIENT } from 'src/shared/utilities/constants';
import Stripe from 'stripe';
import config from 'config';
import { UserRoles } from 'src/shared/schema/users';
import { OrderStatus, PaymentStatus } from 'src/shared/schema/orders';
import {
  createOrderSuccessTemplate,
  initEmailTransport,
} from 'src/shared/utilities/mailhandler';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(OrderRepository) private readonly orderRepository: OrderRepository,
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
  ) {}

  async create(createOrderDto: Record<string, any>) {
    const orderExists = await this.orderRepository.findOne({
      checkoutSessionId: createOrderDto.checkoutSessionId,
    });
    if (orderExists) return orderExists;

    return await this.orderRepository.create(createOrderDto);
  }

  async stripeWebhook(rawBody: Buffer, sig: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        config.get('stripe.webhookSecret'),
      );
    } catch (err) {
      throw new BadRequestException('Webhook error: ' + err.message);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderData = await this.createOrderObject(session);
      const order = await this.create(orderData);

      //console.dir(orderData, { depth: null });
      if (
        session.payment_status === PaymentStatus.PAID &&
        order.orderStatus !== OrderStatus.COMPLETED
      ) {
        // Alternative and I think a better solution here is to
        // get the product licenses and then updated them here in
        // one go.
        for (const item of order.orderedItems) {
          const licenses = await this.updateProductLicenseList(
            order.orderId,
            item,
          );
          item.licenseKeys = licenses;
        }
      }

      const updatedOrder = await this.fulfillOrder(order.checkoutSessionId, {
        ...orderData,
        orderStatus: OrderStatus.COMPLETED,
        orderDelivered: true,
      });

      //console.dir(updatedOrder, { depth: null });
      this.sendOrderEmail(
        updatedOrder.customerEmail,
        updatedOrder.orderId,
        updatedOrder._id.toString(),
      );
    }
  }

  async findAll(status: string, userDetails: Record<string, any>) {
    const user = await this.userRepository.findOne({
      _id: userDetails._id.toString(),
    });
    if (!user) throw new BadRequestException('Invalid user');

    let query = {} as Record<string, any>;
    if (user.role === UserRoles.CUSTOMER) {
      query = {
        userId: user._id.toString(),
      };
    }
    if (status) query.orderStatus = status;

    const orders = await this.orderRepository.find(query);

    return {
      message: 'Orders fetched successfully',
      success: true,
      content: orders,
    };
  }

  async findOne(id: string) {
    const content = await this.orderRepository.findOne({ _id: id });
    if (!content) throw new BadRequestException('Invalid order.');

    return {
      message: 'Fetch successful!',
      success: true,
      content,
    };
  }

  async checkout(body: checkoutDtoList, user: Record<string, any>) {
    const lineItems = [];
    const cartItems = body.checkoutDetails;

    for (const item of cartItems) {
      const itemInStock = await this.productRepository.getProductLicenseList({
        productId: item.productId,
        productSku: item.skuId,
      });

      if (itemInStock.length > item.quantity)
        throw new Error('Insufficient stock for the requested quantity.');

      lineItems.push({
        price: item.skuPriceId,
        quantity: item.quantity,
        adjustable_quantity: {
          enabled: true,
          maximum: 5,
          minimum: 1,
        },
      });
    }

    if (!lineItems.length) throw new BadRequestException('No items in cart.');

    const session = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      metadata: {
        userId: user._id.toString(),
      },
      mode: 'payment',
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      customer_email: user.email,
      cancel_url: config.get('stripe.cancelledUrl'),
      success_url: config.get('stripe.successUrl'),
    });

    return {
      message: 'Payment checout session successfully created',
      success: true,
      content: { url: session.url },
    };
  }

  /* Utils */

  async updateProductLicenseList(orderId: string, item: Record<string, any>) {
    const product = await this.productRepository.findOne({
      _id: item.productId,
    });

    const skuDetails = product.skuDetails.find(
      (sku: { skuCode: string }) => sku.skuCode === item.skuCode,
    );

    const licenseList = await this.productRepository.getProductLicenseList(
      {
        productSku: skuDetails._id,
        isFold: false,
      },
      item.quantity,
    );

    const licenseIdList = licenseList.map((license) => license._id);

    await this.productRepository.updateLicenseMany(
      {
        _id: { $in: licenseIdList },
      },
      {
        isSold: true,
        orderId,
      },
    );

    return licenseList.map((license) => license.licenseKey);
  }

  async createOrderObject(session: Stripe.Checkout.Session) {
    const lineItems = await this.stripe.checkout.sessions.listLineItems(
      session.id,
    );
    const currentDate = new Date();

    //console.dir(lineItems.data, { depth: null });
    return {
      orderId: Math.floor(new Date().valueOf() * Math.random()).toString(),
      userId: session.metadata?.userId,
      customerAddress: session.customer_details.address,
      customerEmail: session.customer_email,
      customerPhoneNumber: session.customer_details.phone,
      paymentInfo: {
        paymentMethod: session.payment_method_types[0],
        paymentIntentId: session.payment_intent,
        paymentDate: currentDate,
        paymentAmount: session.amount_total,
        paymentStatus: session.payment_status,
      },
      orderDate: currentDate,
      checkoutSessionId: session.id,
      orderStatus: OrderStatus.PENDING,
      orderedItems: lineItems.data.map((item) => {
        item.price.metadata.quantity = item.quantity.toString();
        return item.price.metadata;
      }),
    };
  }

  async fulfillOrder(
    checkoutSessionId: string,
    updateOrderDto: Record<string, any>,
  ) {
    return await this.orderRepository.findOneAndUpdate(
      { checkoutSessionId },
      updateOrderDto,
      true,
    );
  }

  sendOrderEmail(email: string, orderId: string, updatedOrderId: string) {
    const mailOptions = {
      from: config.get('adminEmail') as string,
      to: email,
      subject: 'Buy Digital! Order Success!',
      html: createOrderSuccessTemplate(orderId, updatedOrderId),
    };

    initEmailTransport().sendMail(mailOptions);
  }
}
