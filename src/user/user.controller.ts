import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service.js';
import { Public } from '../auth/decorators/public.decorator.js';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Public()
    @Get(':maSv')
    async findOne(@Param('maSv') maSv: string) {
        const sv = await this.userService.findSV(maSv);
        if (!sv) throw new NotFoundException('Không thấy sinh viên ');
        return sv;
    }
}
