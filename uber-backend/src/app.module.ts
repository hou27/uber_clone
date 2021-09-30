import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TestmoduleModule } from './testmodule/testmodule.module';

@Module({
	imports: [
		GraphQLModule.forRoot({
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
		}),
		TestmoduleModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}