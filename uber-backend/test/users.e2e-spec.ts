import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserModule (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		// fix err 'Jest did not exit one second after the test run has completed.'
		app.close();
	});

	it.todo('can createAccount');
	it.todo('userProfile');
	it.todo('login');
	it.todo('me');
	it.todo('verifyEmail');
	it.todo('editProfile');
});