import { Resolver, Query } from '@nestjs/graphql';
import { Testmodule } from './entities/testmodule.entity';

@Resolver(of => Testmodule)
export class TestmoduleResolver {
	@Query(/*()*/returns => Testmodule)	// for graphql( returns means nothing. same as _ )
	isTest() /* for typescript */{
		return true;
	}
}