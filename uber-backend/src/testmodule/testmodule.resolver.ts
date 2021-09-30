import {  Args, Query, Resolver } from '@nestjs/graphql';
import { Testmodule } from './entities/testmodule.entity';

@Resolver((of) => Testmodule)
export class TestmoduleResolver {
	@Query(/*()*/ returns => Testmodule) // for graphql( returns means nothing. same as _ )
	isTest() {
		return true;
	}

	@Query(returns => [Testmodule])
	returnArray(@Args('houOnly') houOnly: boolean): Testmodule[] {
		return [];
	}
}