import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD, // if you want to use guard everywhere in your app, then provide APP_GUARD.
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
