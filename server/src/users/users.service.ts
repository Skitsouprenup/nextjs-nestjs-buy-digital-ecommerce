import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from '../shared/schema/users';
import config from 'config';
import { UserRepository } from '../shared/repositories/user.repository';
import {
  encryptPassword,
  comparePassword,
} from '../shared/utilities/passwordmanager';
import {
  initEmailTransport,
  createVerifyUserEmailTemplate,
  createForgotPassEmailTemplate,
} from '../shared/utilities/mailhandler';
import { generateAuthToken } from '../shared/utilities/tokenmanager';
import { generateOtp } from '../shared/utilities/otpmanager';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await encryptPassword(createUserDto.password);

      if (
        createUserDto.role === UserRoles.ADMIN &&
        createUserDto?.roleToken !== config.get('adminRoleSecretKey')
      ) {
        throw new Error('Client not authorize to create admin account');
      }

      if (createUserDto.role === UserRoles.ADMIN)
        createUserDto.isVerified = true;

      const user = await this.userRepository.findOne({
        email: createUserDto.email,
      });

      if (user) {
        throw new Error('User already Exists!');
      }

      const newOtp = generateOtp();

      const newUser = await this.userRepository.create({
        ...createUserDto,
        otp: newOtp.otp,
        otpExpireTime: newOtp.otpExpireTime,
      });

      if (newUser.role !== UserRoles.ADMIN) {
        const mailOptions = {
          from: config.get('adminEmail') as string,
          to: newUser.email,
          subject: 'Buy Digital! User Verification',
          html: createVerifyUserEmailTemplate(newOtp.otp.toString()),
        };

        initEmailTransport().sendMail(mailOptions);
      }

      return {
        success: true,
        message: `${
          newUser.role === UserRoles.ADMIN ? 'Admin' : 'User'
        } has been created! 
        ${
          newUser.role !== UserRoles.ADMIN
            ? "Please check the verification email that we've sent to your email."
            : ''
        }`,
        content: { email: newUser.email },
      };
    } catch (error) {
      console.error('Error occured in create method in users.service');
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userRepository.findOne({
        email,
      });

      if (!user)
        throw new Error(
          'Incorrect credentials. Please check your username or password.',
        );

      if (!user.isVerified)
        throw new Error('This account requires to be verified.');

      const isPasswordMatched = await comparePassword(password, user.password);
      if (!isPasswordMatched)
        throw new Error(
          'Incorrect credentials. Please check your username or password.',
        );

      const token = generateAuthToken(user._id);

      return {
        success: true,
        message: 'Login Success!',
        content: {
          user: {
            name: user.name,
            email: user.email,
            role: user.role,
            id: user._id.toString(),
          },
          token,
        },
      };
    } catch (error) {
      console.error('Error occured in login method in users.service');
      throw error;
    }
  }

  async activateAccount(otp: string, email: string) {
    try {
      const user = await this.userRepository.findOne({
        email,
      });

      if (!user)
        throw new Error(
          'Incorrect credentials. Please check your username or password.',
        );

      if (user.otp !== otp) throw new Error('Invalid OTP.');

      if (user.otpExpireTime.getTime() < new Date().getTime())
        throw new Error('OTP expired.');

      user.isVerified = true;

      await this.userRepository.activateUser(email, true);

      return {
        success: true,
        message: 'Account activated successfully.',
      };
    } catch (error) {
      console.error('Error occured in activateAccount method in users.service');
      throw error;
    }
  }

  async resendOtp(email: string, checkVerify: boolean = true) {
    const user = await this.userRepository.findOne({
      email,
    });

    if (!user) throw new Error("User doesn't exist");

    if (checkVerify && user.isVerified)
      throw new Error('User already activated');

    const newOtp = generateOtp();

    await this.userRepository.updateOne(
      {
        email,
      },
      {
        otp: newOtp.otp,
        otpExpireTime: newOtp.otpExpireTime,
      },
    );

    const mailOptions = {
      from: config.get('adminEmail') as string,
      to: user.email,
      subject: 'Buy Digital! Resend OTP Request',
      html: createVerifyUserEmailTemplate(newOtp.otp.toString()),
    };

    initEmailTransport().sendMail(mailOptions);

    return {
      success: true,
      message: 'New OTP has been sent to your email!',
    };
  }

  async requestResetPassword(email: string) {
    return await this.resendOtp(email, false);
  }

  async resetPassword(email: string, otp: string) {
    const user = await this.userRepository.findOne({
      email,
    });

    if (!user) throw new Error("User doesn't exist");

    if (user.otp !== otp) throw new Error('Invalid OTP.');

    if (user.otpExpireTime.getTime() < new Date().getTime())
      throw new Error('OTP expired.');

    const newPassword = Math.random().toString(36).substring(2, 8);

    const mailOptions = {
      from: config.get('adminEmail') as string,
      to: user.email,
      subject: 'Buy Digital! Reset Password',
      html: createForgotPassEmailTemplate(newPassword),
    };

    initEmailTransport().sendMail(mailOptions);

    await this.userRepository.updateOne(
      {
        email,
      },
      {
        password: await encryptPassword(newPassword),
      },
    );

    return {
      success: true,
      message: 'New password has been sent',
    };
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({ _id: id });

    if (!user) throw new Error("User doesn't exist.");

    return {
      success: true,
      message: '',
      content: {
        user: {
          name: user.name,
          email: user.email,
        },
      },
    };
  }

  async findAll(type: string) {
    if (type !== 'all') return await this.userRepository.find({ role: type });
    else return await this.userRepository.find({});
  }

  async updateUserDetails(id: string, updateUserDto: UpdateUserDto) {
    const { oldPassword, newPassword, name } = updateUserDto;

    if (!oldPassword && !newPassword) throw new Error('invalid credentials.');

    const user = await this.userRepository.findOne({
      _id: id,
    });

    if (!user) throw new Error("User doesn't exist");

    const passwordMatch = await comparePassword(oldPassword, user.password);

    if (!passwordMatch) throw new Error('Invalid current password');

    const updatedUser = await this.userRepository.findOneAndUpdate(
      {
        _id: id,
      },
      {
        password: await encryptPassword(newPassword),
        name: name,
      },
    );

    return {
      success: true,
      message: 'Credentials updated successfully',
      content: {
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          id: updatedUser._id.toString(),
        },
      },
    };
  }

  /*
  async updateName(id: string, updateUserDto: UpdateUserDto) {
    const { name } = updateUserDto;

    const user = await this.userRepository.findOne({
      _id: id,
    });

    if (!user) throw new Error("User doesn't exist");

    user.isNew = false;
    user.name = name;
    const updatedUser = await user.save();

    return {
      success: true,
      message: 'Name updated successfully',
      content: {
        name: updatedUser.name,
      },
    };
  }
  */

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
