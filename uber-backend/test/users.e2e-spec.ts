import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserModule (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it.todo('can createAccount');
	it.todo('userProfile');
	it.todo('login');
	it.todo('me');
	it.todo('verifyEmail');
	it.todo('editProfile');
	// it('/ (GET)', () => {
	//   return request(app.getHttpServer())
	//     .get('/')
	//     .expect(200)
	//     .expect('Hello World!');
	// });
});