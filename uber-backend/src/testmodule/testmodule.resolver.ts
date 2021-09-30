import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class TestmoduleResolver {
	@Query(/*()*/returns => Boolean)	// for graphql( returns means nothing. same as _ )
	isPizzaGood(): Boolean /* for typescript */{
		return true;
	}
}