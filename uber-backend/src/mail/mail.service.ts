import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
	constructor(@Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions) {
		this.sendEmail('testing', 'test');
	}

	private async sendEmail(subject: string, content: string) {
		const form = new FormData();
		form.append('from', `Excited User <mailgun@${this.options.domain}>`);
		form.append('to', `starjhjh@naver.com`);
		form.append('subject', subject);
		form.append('text', content);
		const response = await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
			method: 'POST',
			headers: {
				/**
				 * curl -s --user 'api:YOUR_API_KEY' \ <-- basic authorization(need username, pw)
					https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages \
					-F from='Excited User <mailgun@YOUR_DOMAIN_NAME>' \
					-F to=YOU@YOUR_DOMAIN_NAME \
					-F to=bar@example.com \
					-F subject='Hello' \
					-F text='Testing some Mailgun awesomeness!'
				 *
				 * api:YOUR_API_KEY <-- we have to change and encode the format of this string(into base64)
				 * ex)
				 > Buffer.from('api:YOUR_API_KEY')
				 <Buffer 61 70 69 3a 59 4f 55 52 5f 41 50 49 5f 4b 45 59>
				 > Buffer.from('api:YOUR_API_KEY').toString()
				 'api:YOUR_API_KEY'
				 > Buffer.from('api:YOUR_API_KEY').toString('base64')
				 'YXBpOllPVVJfQVBJX0tFWQ=='
				 >
				 */
				Authorization: `Basic ${Buffer.from(`api:${this.options.apiKey}`).toString(
					'base64'
				)}`,
			},
			body: form,
		});
		console.log(response.body);
	}
}

/*
@Injectable()
export class MailService {
	constructor(@Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions) {
		console.log(options);
		this.sendEmail('testing', 'test');
	}

	private async sendEmail(subject: string, content: string) {
		const response = await fetch(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
			method: 'POST',
			headers: {
				Authentication: `Basic ${Buffer.from(`api:${this.options.apiKey}`).toString(
					'base64'
				)}`,
			},
			body: JSON.stringify({
				from: this.options.fromEmail,
				to: 'nico@nomadcoders.co',
				subject: subject,
				text: content,
			}),
		});
		const json = await response.json();
		console.log(json);
	}
}
*/