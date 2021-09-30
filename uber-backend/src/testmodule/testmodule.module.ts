import { Module } from '@nestjs/common';
import { TestmoduleResolver } from './testmodule.resolver'

@Module({
	providers: [TestmoduleResolver]
})
export class TestmoduleModule {}
