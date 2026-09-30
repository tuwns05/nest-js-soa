import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SinhVien } from './user.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(SinhVien)
        private readonly svRepoSitory: Repository<SinhVien>,
    ) { }

    findSV(maSv: string) {
        return this.svRepoSitory.findOne({ where: { MaSv: maSv } })
    }
}
