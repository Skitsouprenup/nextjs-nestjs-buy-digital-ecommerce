import { CreateUserDto } from '../users/dto/create-user.dto';

export interface CreateUserData extends CreateUserDto {
  otp: number;
  otpExpireTime: Date;
}
