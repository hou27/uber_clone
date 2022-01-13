import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailService } from './mail.service';
import got from 'got';
import * as FormData from 'form-data';

jest.mock('got'); // jest mock got
// jest.mock('got', () => {});
jest.mock('form-data');
// jest.mock('form-data', () => {
// 	return {
// 		append: jest.fn(),
// 	};
// });

const TEST_DOMAIN = 'test-domain';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'test-apiKey',
            domain: TEST_DOMAIN,
            fromEmail: 'test-fromEmail',
          },
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('should call sendEmail', () => {
      const sendVerificationEmailArgs = {
        email: 'email',
        code: 'code',
      };
      // service.sendEmail = jest.fn(); // do not mock sendEmail cuz we'll test it later.
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => true); // spy function(mock X)
      /** mockImplementation
       * mock every implementations in real func.
       * If sendEmail is called, inercept that call i can describe my own implementations.
       */
      service.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );
      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith(
        'Verify Your Email',
        'verify-email',
        [
          { key: 'code', value: sendVerificationEmailArgs.code },
          { key: 'username', value: sendVerificationEmailArgs.email },
        ],
      );
    });
  });

  describe('sendEmail', () => {
    it('send email', async () => {
      const result = await service.sendEmail('', '', [
        { key: 'one', value: 'test' },
      ]);
      // spying on FormData.prototype
      const formSpy = jest.spyOn(FormData.prototype, 'append');

      // expect(formSpy).toHaveBeenCalledTimes(5);
      expect(formSpy).toHaveBeenCalled();
      expect(got.post).toHaveBeenCalledTimes(1);
      expect(got.post).toHaveBeenCalledWith(
        `https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`,
        expect.any(Object),
      );
      expect(result).toBeTruthy /*toEqual(true)*/;
    });

    it('fails on error', async () => {
      jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error();
      });
      const result = await service.sendEmail('', '', []);
      expect(result).toBeFalsy /*toEqual(false)*/;
    });
  });
});
