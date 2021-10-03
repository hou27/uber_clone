import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MutationOutput {
	@Field((type) => Boolean)
	ok: boolean;

	@Field((type) => String, { nullable: true })
	error?: string;
}