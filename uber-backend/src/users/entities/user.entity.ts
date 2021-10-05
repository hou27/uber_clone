import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum } from 'class-validator';

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
	@IsEmail()
	email: string;

	@Field((type) => String)
	@Column()
	password: string;

	@Field((type) => UserRole)
	@Column({ type: 'enum', enum: UserRole })
	@IsEnum(UserRole)
	role: UserRole;

	@Column({ default: false })
	@Field((type) => Boolean)
	verified: boolean;

	@BeforeInsert() // Entity Listener
	@BeforeUpdate() // password need to hashed before save.
	async hashPassword(): Promise<void> {
		try {
			this.password = await bcrypt.hash(this.password, 10 /* saltOrRounds */); // hash
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException();
		}
	}

	async checkPassword(plainPassword: string): Promise<boolean> {
		try {
			const ok = await bcrypt.compare(plainPassword, this.password);
			return ok;
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException();
		}
	}
}