import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

enum UserRole {
	Client,
	Owner,
	Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' }); // for graphql

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
	@Field((type) => String)
	@Column()
	email: string;

	@Field((type) => String)
	@Column()
	password: string;

	@Field((type) => UserRole)
	@Column({ type: 'enum', enum: UserRole })
	role: UserRole;

	@BeforeInsert() //	Entity Listener
	async hashPassword(): Promise<void> {
		try {
			this.password = await bcrypt.hash(this.password, 10/* saltOrRounds */);	// hash
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException();
		}
	}
}