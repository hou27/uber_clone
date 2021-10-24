import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
// import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { Verification } from './users/entities/verification.entity';
import { MailModule } from './mail/mail.module';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { Category } from './restaurants/entities/cetegory.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { AuthModule } from './auth/auth.module';


@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true, // application 어디서나 config module에 접근 가능하도록.
			envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
			ignoreEnvFile: process.env.NODE_ENV === 'prod', // deploy할 때 env파일을 사용하지 않는 옵션
			validationSchema: Joi.object({
				NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
				DB_HOST: Joi.string().required(),
				DB_PORT: Joi.string().required(),
				DB_USERNAME: Joi.string().required(),
				DB_PW: Joi.string().required(),
				DB_NAME: Joi.string().required(),
				PRIVATE_KEY: Joi.string().required(),
				MAILGUN_API_KEY: Joi.string().required(),
				MAILGUN_DOMAIN_NAME: Joi.string().required(),
				MAILGUN_FROM_EMAIL: Joi.string().required(),
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
			logging: process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
			entities: [User, Verification, Restaurant, Category],
		}),
		GraphQLModule.forRoot({
			autoSchemaFile: true,
			context: async ({ req }) => ({ user: req['user'] }), // context is called each req.
		}),
		UsersModule,
		JwtModule.forRoot({
			privateKey: process.env.PRIVATE_KEY,
		}),
		MailModule.forRoot({
			apiKey: process.env.MAILGUN_API_KEY,
			domain: process.env.MAILGUN_DOMAIN_NAME,
			fromEmail: process.env.MAILGUN_FROM_EMAIL,
		}),
		UsersModule,
		RestaurantsModule,
		AuthModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(JwtMiddleware).forRoutes({ path: '/graphql', method: RequestMethod.POST });
	}
}