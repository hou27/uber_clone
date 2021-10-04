import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext) {
		const gqlContext = GqlExecutionContext.create(context).getContext(); // graphql context는 http의 context와 다르기 때문에 변환이 필요함.
		console.log(gqlContext);
		const user = gqlContext['user'];
		if (!user) {
			return false;
		}
		return true;
	}
}

/**
 * CanActivate
 *
 * Return value indicates whether or not the current request is allowed to proceed.
 * canActivate() will return true or false depending on what is in context(in req).
 */