import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly httpService: HttpService,
        private jwtService: JwtService
    ) { }
    async signIn(maSv: string, passWord: string) {
        const res = await firstValueFrom(
            this.httpService.get(`http://localhost:3001/user/${maSv}`),
        );
        const user = res.data
        if (!user || user?.MatKhau != passWord) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.MaSv, username: user.HoTen };
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }



}


