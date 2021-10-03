import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
// import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';

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
				PRIVATE_KEY: Joi.string().required(),
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
			logging: process.env.NODE_ENV !== 'prod',
			entities: [User],
		}),
		GraphQLModule.forRoot({
			autoSchemaFile: true,
			context: async ({ req }) => ({ user: req['user'] }),	// context is called each req.
		}),
		UsersModule,
		CommonModule,
		JwtModule.forRoot({
			privateKey: process.env.PRIVATE_KEY,
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(JwtMiddleware).forRoutes({ path: '/graphql', method: RequestMethod.ALL });
	}
}