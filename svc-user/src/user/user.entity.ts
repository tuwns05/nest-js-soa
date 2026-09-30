import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'SinhVien' })
export class SinhVien {
    @PrimaryGeneratedColumn()
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