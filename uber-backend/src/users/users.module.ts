import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './users.resolver';
import { UserService } from './users.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
	imports: [TypeOrmModule.forFeature([User]), JwtService],
	providers: [UserResolver, UserService],
})
export class UsersModule {}
