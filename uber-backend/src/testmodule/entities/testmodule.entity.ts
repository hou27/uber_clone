import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Testmodule {	// Testmodule을 위한 objecttype을 하나 만들어줌.
	@Field(typeis => String)
	name: string;
	
	@Field(typeis => Boolean, { nullable: true })	// nullable(can be optional)
	isTrue?: boolean;
}