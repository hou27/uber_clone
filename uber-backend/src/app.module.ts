import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { Restaurant } from './restaurants/entities/restaurant.entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true, // application 어디서나 config module에 접근 가능하도록.
			envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
			ignoreEnvFile: process.env.NODE_ENV === 'prod', // deploy할 때 env파일을 사용하지 않는 옵션
			validationSchema: Joi.object({
				NODE_ENV: Joi.string().valid('dev', 'prod').required(),
				DB_HOST: Joi.string().required(),
				DB_PORT: Joi.string().required(),
				DB_USERNAME: Joi.string().required(),
				DB_PW: Joi.string().required(),
				DB_NAME: Joi.string().required(),
			}),
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: +process.env.DB_PORT,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PW,
			database: process.env.DB_NAME,
			synchronize: process.env.NODE_ENV !== 'prod',
			logging: true,
			entities: [Restaurant],
		}),
		GraphQLModule.forRoot({
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
		}),
		RestaurantsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}