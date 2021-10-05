import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
	// one to one relationship
	@Column()
	@Field((type) => String)
	code: string;

	@OneToOne((type) => User)
	@JoinColumn() // @JoinColumn which is required and must be set only on one side of the relation.
	// JoinColumn depences where you going to access your imformation.
	user: User;
}