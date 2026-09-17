import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service.js';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService
    ) { }
    async Login(maSv: string, passWord: string): Promise<{ accessToken: string }> {
        const user = await this.userService.findSV(maSv)
        if (user?.MatKhau != passWord) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.MaSv }
        return {
            accessToken: 
        }
    }

    async generateJwtToken()

}


