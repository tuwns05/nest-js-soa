import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm";

@Entity({ name: 'SINHVIEN' })
export class SinhVien {
    @PrimaryColumn({ type: 'varchar', length: 20 })
    MaSv: string;
    @Column({ type: 'nvarchar', nullable: false })
    HoTen: string;
    @Column({ type: 'varchar' })
    Email: string;
    @Column({ type: 'nvarchar' })
    Lop: string;
    @Column({ type: 'varchar' })
    MatKhau: string;
}