import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../schema/users';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    /*
      getAllAndOverride() checks if leftmost array element
      role is a valid value(not undefined or null). if so,
      take that element and disregard the preceeding elements.
    */
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    //This route doesn't specify a role. This means that
    //any type of users can access this route
    if (!requiredRoles) return true;

    /* 
       Check auth.ts if this user variable is undefined
       or check if your route of interest has assigned role
       then check if the module of the route runs the auth middleware
    */
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
