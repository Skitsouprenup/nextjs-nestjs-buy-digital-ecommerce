import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { STRIPE_CLIENT } from 'src/shared/utilities/constants';
import { GetProductQueryDto } from './dto/get-product-query-dto';
import { unlinkSync } from 'fs';

import qs2m from 'qs-to-mongo';
import Stripe from 'stripe';
import cloudinary from 'cloudinary';
import config from 'config';
import { ProductSkuDto, ProductSkuDtoList } from './dto/product-sku-dto';
import { OrderRepository } from 'src/shared/repositories/order.repository';
import { Feedbacks } from 'src/shared/schema/products';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
    @Inject(OrderRepository)
    private readonly orderRepository: OrderRepository,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
  ) {
    cloudinary.v2.config({
      cloud_name: config.get('cloudinary.cloudName'),
      api_key: config.get('cloudinary.apiKey'),
      api_secret: config.get('cloudinary.apiSecret'),
    });
  }

  setProductPrice = (
    price: number,
    stripeProductId: string,
    skuCode: string,
    lifetime: string,
    productId: string,
    name: string,
    image: string,
  ) => {
    return {
      unit_amount: price,
      currency: 'usd',
      product: stripeProductId,
      metadata: {
        skuCode,
        lifetime,
        productId,
        price,
        productName: name,
        productImage: image,
      },
    };
  };

  async deleteProductReview(productId: string, reviewId: string) {
    const product = await this.productRepository.findOne({ _id: productId });
    if (!product) throw new Error("Product Doesn't Exist!");

    const existingReview = product.feedbacks.find(
      (review) => review._id.toString() === reviewId,
    );
    if (!existingReview) throw new BadRequestException("Review doesn't exists");

    const avgRating = this.calculateProductAverageRating(
      product.feedbacks,
      reviewId,
    );

    const content = await this.productRepository.findOneAndUpdate(
      { _id: productId },
      {
        $set: { ratingAvg: avgRating },
        $pull: { feedbacks: { _id: reviewId } },
      },
    );

    return {
      message: 'Product review deleted successfully',
      success: true,
      content,
    };
  }

  async addProductReview(
    productId: string,
    rating: number,
    review: string,
    userDetails: Record<string, any>,
  ) {
    const product = await this.productRepository.findOne({ _id: productId });
    if (!product) throw new Error("Product Doesn't Exist!");

    const userExistingReview = product.feedbacks.find(
      (feedback: { customerId: string }) =>
        feedback.customerId === userDetails._id.toString(),
    );

    if (userExistingReview)
      throw new BadRequestException('You already reviewed this product.');

    const order = await this.orderRepository.findOne({
      userId: userDetails._id,
      'orderedItems.productId': productId,
    });

    if (!order)
      throw new BadRequestException('You have not purchased this product');

    const reviewDetails = {
      rating,
      message: review,
      customerId: userDetails._id.toString(),
      name: userDetails.name,
    };

    let avgRating = this.calculateProductAverageRating(product.feedbacks);
    if (!avgRating) avgRating = rating;

    const content = await this.productRepository.findOneAndUpdate(
      { _id: productId },
      { $set: { ratingAvg: avgRating }, $push: { feedbacks: reviewDetails } },
    );

    return {
      message: 'Product review added successfully',
      success: true,
      content,
    };
  }

  async updateProductLicense(
    productId: string,
    skuCode: string,
    licenseId: string,
    licenseKey: string,
  ) {
    const product = await this.productRepository.findOne({ _id: productId });
    if (!product) throw new Error("Product Doesn't Exist!");

    const sku = product.skuDetails.find(
      (sku) => sku._id.toString() === skuCode,
    );
    if (!sku) throw new Error("SKU Doesn't Exist!");

    const result = await this.productRepository.updateProductLicense(
      { _id: licenseId },
      { licenseKey },
    );

    return {
      message: 'License has been updated successfully!',
      success: true,
      content: result,
    };
  }

  async getProductLicenseList(
    productId: string,
    skuId: string,
    isSold: boolean,
  ) {
    const product = await this.productRepository.findOne({ _id: productId });
    if (!product) throw new Error("Product Doesn't Exist!");

    const sku = product.skuDetails.find((sku) => sku._id.toString() === skuId);
    if (!sku) throw new Error("SKU Doesn't Exist!");

    const result = await this.productRepository.getProductLicenseList({
      productId,
      productSku: skuId,
      isSold,
    });

    return {
      message: 'License List has been fetched successfully!',
      success: true,
      content: result,
    };
  }

  async removeProductLicense(licenseId: string) {
    const result = await this.productRepository.removeProductLicense(licenseId);

    return {
      message: 'License has been removed successfully!',
      success: true,
      content: result,
    };
  }

  async addProductLicense(
    productId: string,
    skuCode: string,
    licenseKey: string,
  ) {
    const product = await this.productRepository.findOne({ _id: productId });
    if (!product) throw new Error("Product Doesn't Exist!");

    const sku = product.skuDetails.find(
      (sku) => sku._id.toString() === skuCode,
    );
    if (!sku) throw new Error("SKU Doesn't Exist!");

    const result = await this.productRepository.createLicense(
      productId,
      skuCode,
      licenseKey,
    );

    return {
      message: 'License added successfully!',
      success: true,
      content: result,
    };
  }

  async updateProductSkuById(
    productId: string,
    skuId: string,
    productSkuDto: ProductSkuDto,
  ) {
    const product = await this.productRepository.findOne({ _id: productId });
    if (!product) throw new Error("Product Doesn't Exist!");

    const sku = product.skuDetails.find((sku) => sku._id.toString() === skuId);
    if (!sku) throw new Error("SKU Doesn't Exist!");

    /* 
       Create new price if the price in the selected sku in the database
       doesn't match the price in the request payload. Old prices are subjected
       to archiving. Thus, we don't delete old price.
    */
    if (productSkuDto.price !== sku.price) {
      const priceDetails = await this.stripe.prices.create(
        this.setProductPrice(
          productSkuDto.price,
          product.stripeProductId,
          skuId,
          productSkuDto.lifetime.toString(),
          productId,
          product.productName,
          product.image,
        ),
      );
      productSkuDto.stripePriceId = priceDetails.id;
    }

    const updatePayload = {};
    for (const key in productSkuDto) {
      if (productSkuDto.hasOwnProperty(key))
        updatePayload[`skuDetails.$.${key}`] = productSkuDto[key];
    }

    //console.log(updatePayload);
    await this.productRepository.findOneAndUpdate(
      { _id: productId, 'skuDetails._id': skuId },
      { $set: updatePayload },
    );

    return {
      message: 'Product sku updated successfully!',
      success: true,
      content: null,
    };
  }

  async createProductSku(
    productId: string,
    productSkuDtoList: ProductSkuDtoList,
  ) {
    const product = await this.productRepository.findOne({ _id: productId });
    if (!product) throw new Error("Product Doesn't Exist!");

    const skuCode = Math.random().toString(36).substring(2, 5) + Date.now();
    for (let i = 0; i < productSkuDtoList.skuList.length; i++) {
      if (!productSkuDtoList.skuList[i].stripePriceId) {
        const stripePriceDetails = await this.stripe.prices.create(
          this.setProductPrice(
            productSkuDtoList.skuList[i].price,
            product.stripeProductId,
            skuCode,
            productSkuDtoList.skuList[i].lifetime.toString(),
            productId,
            product.productName,
            product.image,
          ),
        );
        productSkuDtoList.skuList[i].stripePriceId = stripePriceDetails.id;
      }
      productSkuDtoList.skuList[i].skuCode = skuCode;
    }

    /* 
      This update add new elements in the skuDetails array and doesn't
      replace the existing content of skuDetails
    */
    await this.productRepository.findOneAndUpdate(
      { _id: productId },
      { $push: { skuDetails: { $each: [...productSkuDtoList.skuList] } } },
    );

    return {
      message: 'Product sku created successfully!',
      success: true,
      content: null,
    };
  }

  async uploadProductImage(id: string, file: Express.Multer.File) {
    const product = await this.productRepository.findOne({ _id: id });
    if (!product) throw new Error("Product Doesn't Exist!");

    //Destroy/Delete existing image first before assigning a new one.
    if (product.imageDetails?.public_id) {
      await cloudinary.v2.uploader.destroy(product.imageDetails.public_id, {
        invalidate: true,
      });
    }

    const cloudinaryResponse = await cloudinary.v2.uploader.upload(file.path, {
      folder: config.get('cloudinary.folderPath'),
      public_id: `${config.get(
        'cloudinary.generatedProductPublicIdPrefix',
      )}${Date.now()}`,
      transformation: [
        {
          width: config.get('cloudinary.imageSizeBig').toString().split('x')[0],
          height: config
            .get('cloudinary.imageSizeBig')
            .toString()
            .split('x')[1],
          crop: 'fill',
        },
        { quality: 'auto' },
      ],
    });
    unlinkSync(file.path);

    await this.productRepository.findOneAndUpdate(
      {
        _id: id,
      },
      {
        imageDetails: cloudinaryResponse,
        image: cloudinaryResponse.secure_url,
      },
    );

    await this.stripe.products.update(product.stripeProductId, {
      images: [cloudinaryResponse.secure_url],
    });

    return {
      success: true,
      message: 'Product image has been uploaded!',
      content: cloudinaryResponse.secure_url,
    };
  }

  async create(createProductDto: CreateProductDto) {
    if (!createProductDto.stripeProductId) {
      const createProductInStripe = await this.stripe.products.create({
        name: createProductDto.productName,
        description: createProductDto.description,
      });

      createProductDto.stripeProductId = createProductInStripe.id;
    }

    const createProductInDb = await this.productRepository.create(
      createProductDto,
    );
    return {
      success: true,
      message: 'Product Created Successfully',
      content: createProductInDb,
    };
  }

  async findAll(query: GetProductQueryDto) {
    let callHomePage = false;
    if (query.homepage) {
      callHomePage = true;
      delete query.homepage;
    }

    const { criteria, options, links } = qs2m(query);
    if (callHomePage) {
      const products = await this.productRepository.findProductGroupBy();

      return {
        success: true,
        message: '',
        content: products,
      };
    }

    const { productCount, products } = await this.productRepository.find(
      criteria,
      options,
    );
    return {
      success: true,
      message: products.length ? '' : 'No products found!',
      content: {
        metadata: {
          skip: options.skip || 0,
          limit: options.limit || 10,
          pageCount: options.limit
            ? Math.ceil(productCount / options.limit)
            : 1,
          links: links('/', productCount),
          productCount,
        },
        products,
      },
    };
  }

  async findOneProduct(id: string) {
    const product = await this.productRepository.findOne({ _id: id });
    if (!product) throw new Error("Product Doesn't Exist!");

    const relatedProducts = await this.productRepository.find(
      {
        category: product.category,
        _id: { $ne: id },
      },
      {
        limit: 4,
        projection: {},
        sort: { productName: 1 },
        skip: 0,
      },
    );

    return {
      success: true,
      message: '',
      content: { product, relatedProducts: relatedProducts?.products },
    };
  }

  async update(id: string, updateProductDto: CreateProductDto) {
    const product = await this.productRepository.findOne({ _id: id });

    if (!product) throw new Error("Product Doesn't Exist!");

    const updatedProduct = await this.productRepository.findOneAndUpdate(
      {
        _id: id,
      },
      updateProductDto,
    );

    if (!updateProductDto.stripeProductId)
      await this.stripe.products.update(product.stripeProductId, {
        name: updateProductDto.productName,
        description: updateProductDto.description,
      });

    return {
      success: true,
      message: 'product successfully updated!',
      content: updatedProduct,
    };
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({ _id: id });

    if (!product) throw new Error("Product Doesn't Exist!");

    await this.productRepository.findOneAndDelete(id);
    await this.stripe.products.del(product.stripeProductId);

    return {
      message: 'Product Deleted Successfully!',
      success: true,
      content: null,
    };
  }

  async removeSku(productId: string, skuId: string) {
    const productDetails = await this.productRepository.findOne({
      _id: productId,
    });

    const skuDetails = productDetails.skuDetails.find(
      (item) => item._id.toString() === skuId,
    );

    /* Delete price from stripe */
    await this.stripe.prices.update(skuDetails.stripePriceId, {
      active: false,
    });

    /* Delete sku from db */
    await this.productRepository.findOneAndUpdate(
      { _id: productId },
      { $pull: { skuDetails: { _id: skuId } } },
    );

    /* Remove all licenses of the selected SKU */
    await this.productRepository.removeAllLicense(null, skuId);

    return {
      message: 'Product sku removed successfully!',
      success: true,
      content: null,
    };
  }

  /* Utils */

  calculateProductAverageRating = (
    feedbacks: Feedbacks[],
    reviewToDelete = '',
  ) => {
    /*Get product ratings */
    const ratings = [];
    feedbacks.forEach((feedback) => {
      if (reviewToDelete && reviewToDelete !== feedback._id.toString())
        ratings.push(feedback.rating);

      if (!reviewToDelete) ratings.push(feedback.rating);
    });

    /*Compute average rating */
    let avgRating = 0;
    if (ratings.length)
      avgRating = Number(
        (
          ratings.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
          ) / ratings.length
        ).toFixed(2),
      );

    return avgRating;
  };
}
