import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from './role.decorator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}
	canActivate(context: ExecutionContext) {
		const roles = this.reflector.get<AllowedRoles>( // guard checks the 'metadata' of the req to see if there's a role.
      'roles',
      context.getHandler(),
    );
    if (!roles) { // It means that i didn't set any metadata.
      return true;
    }
		const gqlContext = GqlExecutionContext.create(context).getContext(); // graphql context는 http의 context와 다르기 때문에 변환이 필요함.
		const user:User = gqlContext['user'];
		if (!user) {
			return false; // block req
		}
    return roles.includes('Any') || roles.includes(user.role); // continue req
	}
}

/**
 * CanActivate
 *
 * Return value indicates whether or not the current request is allowed to proceed.
 * canActivate() will return true or false depending on what is in context(in req).
 */