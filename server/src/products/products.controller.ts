import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from 'src/shared/decorators/role.decorator';
import { UserRoles } from 'src/shared/schema/users';
import { GetProductQueryDto } from './dto/get-product-query-dto';
import { FileInterceptor } from '@nestjs/platform-express';

import config from 'config';
import { ProductSkuDto, ProductSkuDtoList } from './dto/product-sku-dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(UserRoles.ADMIN)
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Post('/:id/image')
  @Roles(UserRoles.ADMIN)
  @UseInterceptors(
    FileInterceptor('productimage', {
      dest: config.get('productImageStoragePath'),
      limits: {
        fileSize: 3000000, //bytes
      },
    }),
  )
  async uploadProductImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.productsService.uploadProductImage(id, file);
  }

  //@Query means query string in the url
  @Get()
  async findAll(@Query() query: GetProductQueryDto) {
    return await this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOneProduct(id);
  }

  @Put(':id')
  @Roles(UserRoles.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post('/sku/:productId')
  @Roles(UserRoles.ADMIN)
  async createProductSku(
    @Param('productId') productId: string,
    @Body() productSkuDtoList: ProductSkuDtoList,
  ) {
    return await this.productsService.createProductSku(
      productId,
      productSkuDtoList,
    );
  }

  @Put('/:productId/sku/:skuCode')
  @Roles(UserRoles.ADMIN)
  async updateProductSku(
    @Param('productId') productId: string,
    @Param('skuCode') skuCode: string,
    @Body() productSkuDtoList: ProductSkuDto,
  ) {
    return await this.productsService.updateProductSkuById(
      productId,
      skuCode,
      productSkuDtoList,
    );
  }

  @Post('/:productId/sku/:skuCode/license')
  @Roles(UserRoles.ADMIN)
  async addProductLicence(
    @Param('productId') productId: string,
    @Param('skuCode') skuCode: string,
    @Body('licenseKey') licenseKey: string,
  ) {
    return await this.productsService.addProductLicense(
      productId,
      skuCode,
      licenseKey,
    );
  }

  @Delete('/license/:licenseId')
  @Roles(UserRoles.ADMIN)
  async removeProductLicense(@Param('licenseId') licenseId: string) {
    return await this.productsService.removeProductLicense(licenseId);
  }

  @Get('/:productId/sku/:skuCode/license')
  @Roles(UserRoles.ADMIN)
  async getProductLicenseList(
    @Param('productId') productId: string,
    @Param('skuCode') skuCode: string,
    @Query('isSold') isSold: boolean,
  ) {
    return await this.productsService.getProductLicenseList(
      productId,
      skuCode,
      isSold,
    );
  }

  @Put('/:productId/sku/:skuCode/license/:licenseId')
  @Roles(UserRoles.ADMIN)
  async updateProductLicense(
    @Param('productId') productId: string,
    @Param('skuCode') skuCode: string,
    @Param('licenseId') licenseId: string,
    @Body('licenseKey') licenseKey: string,
  ) {
    return await this.productsService.updateProductLicense(
      productId,
      skuCode,
      licenseId,
      licenseKey,
    );
  }

  @Post('/review/:productId')
  //@Roles(UserRoles.CUSTOMER)
  async addProductReview(
    @Param('productId') productId: string,
    @Body('rating') rating: number,
    @Body('review') review: string,
    @Req() request: Request | any,
  ) {
    return this.productsService.addProductReview(
      productId,
      rating,
      review,
      request.user,
    );
  }

  @Delete('/review/:productId/:reviewId')
  async deleteProductReview(
    @Param('productId') productId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return await this.productsService.deleteProductReview(productId, reviewId);
  }

  @Delete('/:productId/sku/:skuCode')
  async deleteProduckSku(
    @Param('productId') productId: string,
    @Param('skuCode') skuCode: string,
  ) {
    return await this.productsService.removeSku(productId, skuCode);
  }
}
