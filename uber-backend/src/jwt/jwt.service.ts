import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from './jwt.constants';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
	constructor(
		@Inject(CONFIG_OPTIONS)
		private readonly options: JwtModuleOptions,
		private readonly config: ConfigService
	) {}

	sign(
		userId: number
		/*payload: object*/
	): string {
		return jwt.sign({ id: userId }, this.config.get('PRIVATE_KEY')/*this.options.privateKey*/);
	}

	verify(token: string) {
		return jwt.verify(token, this.options.privateKey);
	}
}