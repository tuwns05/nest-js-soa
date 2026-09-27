import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }
    async signIn(maSv: string, passWord: string): Promise<{ access_token: string }> {
        const user = await this.userService.findSV(maSv)
        if (user?.MatKhau != passWord) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.MaSv, username: user.HoTen };
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }



}


