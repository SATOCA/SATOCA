import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
@Entity()
export class Trustee extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column()
    login: string = "";

    @Column()
    password: string = "";
}