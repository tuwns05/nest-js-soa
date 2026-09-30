import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SinhVien } from './user.entity.js';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';

@Module({
    imports: [TypeOrmModule.forFeature([SinhVien])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule { }
