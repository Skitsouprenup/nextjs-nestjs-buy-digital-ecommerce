import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  CategoryType,
  DeviceType,
  PlatformType,
  SkuDetails,
} from 'src/shared/schema/products';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  image: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(CategoryType)
  category: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PlatformType)
  platformType: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(DeviceType)
  deviceType: string;

  @IsString()
  @IsNotEmpty()
  productUrl: string;

  @IsString()
  @IsNotEmpty()
  downloadUrl: string;

  @IsOptional()
  @IsArray()
  skuDetails: SkuDetails[];

  @IsOptional()
  @IsArray()
  imageDetails: Record<string, any>;

  @IsNotEmpty()
  @IsArray()
  specification: Record<string, any>[];

  @IsNotEmpty()
  @IsArray()
  highlights: string[];

  @IsOptional()
  stripeProductId: string;
}
