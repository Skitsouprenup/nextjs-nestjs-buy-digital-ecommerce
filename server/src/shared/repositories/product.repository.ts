import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Products } from '../schema/products';
import { Model } from 'mongoose';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { ParsedOptions } from 'qs-to-mongo/lib/query/options-to-mongo';
import { License } from '../schema/license';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Products.name) private readonly productModel: Model<Products>,
    @InjectModel(License.name) private readonly licenseModel: Model<License>,
  ) {}

  async updateLicenseMany(
    filter: Record<string, any>,
    queryUpdates: Record<string, any>,
  ) {
    return await this.licenseModel.updateMany(filter, queryUpdates);
  }

  /* Set new to false if you wanna get the old value of the updated data */
  async updateProductLicense(
    filter: Record<string, any>,
    queryUpdates: Record<string, any>,
  ) {
    return await this.licenseModel.findOneAndUpdate(filter, queryUpdates, {
      new: true,
    });
  }

  async getProductLicenseList(query: Record<string, any>, limit = 0) {
    return await this.licenseModel.find(query).limit(limit);
  }

  async removeProductLicense(licenseId: string) {
    return await this.licenseModel.findOneAndDelete({ _id: licenseId });
  }

  /* Add return type to avoid 
    'The inferred type of "X" cannot be named without a reference to "Y"' error

  */
  async removeAllLicense(productId: string, skuId: string): Promise<unknown> {
    /* 
      Remove all licenses of the selected product. Otherwise,
      Remove all licenses of the selected SKU.
    */
    if (productId) return await this.licenseModel.deleteMany({ productId });
    else return await this.licenseModel.deleteMany({ productSku: skuId });
  }

  async createLicense(productId: string, skuCode: string, licenseKey: string) {
    return await this.licenseModel.create({
      productId,
      productSku: skuCode,
      licenseKey,
    });
  }

  async find(criteria: { [x: string]: any }, options: ParsedOptions) {
    options.sort = options.sort || { _id: 1 };
    options.limit = options.limit || 12;
    options.skip = options.skip || 0;

    if (criteria?.search) {
      criteria.productName = new RegExp(criteria.search, 'i');
      delete criteria.search;
    }

    const products = await this.productModel.aggregate([
      {
        $match: criteria,
      },
      {
        $sort: options.sort,
      },
      {
        $skip: options.skip,
      },
      {
        $limit: options.limit,
      },
    ]);

    const productCount = await this.productModel.countDocuments(criteria);
    return { productCount, products };
  }

  async findProductGroupBy() {
    return await this.productModel.aggregate([
      {
        $facet: {
          latestProducts: [{ $sort: { createdAt: -1 } }, { $limit: 4 }],
          topRatedProducts: [{ $sort: { avgRating: -1 } }, { $limit: 8 }],
        },
      },
    ]);
  }

  async create(product: CreateProductDto) {
    return await this.productModel.create(product);
  }

  async findOne(query: Record<string, any>) {
    return await this.productModel.findOne(query);
  }

  async findOneAndUpdate(
    query: Record<string, any>,
    update: Record<string, any>,
  ) {
    //new: true settings will make this method returns the updated document.
    return await this.productModel.findOneAndUpdate(query, update, {
      new: true,
    });
  }

  async findOneAndDelete(id: string) {
    return await this.productModel.findByIdAndDelete({ _id: id });
  }
}
