import {
  Injectable,
  Inject,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { decodeAuthToken } from '../utilities/tokenmanager';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

Injectable();
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async use(req: Request | any, res: Response, next: NextFunction) {
    const token = req.header('authorization').split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid token.');

    const decodedToken = decodeAuthToken(token) as JwtPayload;

    const user = await this.userRepository.findOne({ _id: decodedToken.id });

    if (!user) throw new UnauthorizedException('User not found.');

    req.user = user;
    next();
  }
}
