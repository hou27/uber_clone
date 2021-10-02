import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Schema must contain uniquely named types(Second way to fix err)
@InputType({ isAbstract: true })	// isAbstract : do not add to Schema
@ObjectType()
@Entity()
export class Restaurant {
	@PrimaryGeneratedColumn()
	@Field((type) => Number)
	id: number;

	@Field((type) => String)
	@Column()
	@IsString()
	@Length(5)
	name: string;

	@Field((type) => Boolean)
	@Column()
	@IsBoolean()
	isVegan: boolean;

	@Field((type) => String)
	@Column()
	@IsString()
	address: string;

	@Field((type) => String)
	@Column()
	@IsString()
	ownersName: string;

	@Field((type) => String)
	@Column()
	@IsString()
	categoryName: string;
}