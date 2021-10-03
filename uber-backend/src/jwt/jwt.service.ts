import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtService {
	hi() {
		console.log('hi');
	}
}
