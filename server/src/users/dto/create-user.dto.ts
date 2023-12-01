import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';
import { UserRoles } from '../../shared/schema/users';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([UserRoles.ADMIN, UserRoles.CUSTOMER])
  role: string;

  @IsString()
  @IsOptional()
  roleToken?: string;

  isVerified?: boolean;
}
