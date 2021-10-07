import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne, BeforeInsert } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
	// one to one relationship
	@Column()
	@Field((type) => String)
	code: string;

	@OneToOne((type) => User, {onDelete:"CASCADE"}) // define what happens when the user is delete.
	@JoinColumn() // @JoinColumn which is required and must be set only on one side of the relation.
	// JoinColumn depences where you going to access your imformation.
	user: User;

	@BeforeInsert()
	createCode(): void {
		this.code = /* Math.random().toString(36).substring(2) */uuidv4();
	}
}

// 왜 이건 스키마에 안 올라갈까