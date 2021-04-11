import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity({ name: 'participant' })
export class Participant extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number;

   @Column({ unique: true })
   uuid: string;

   @Column({ nullable: true })
   session: string;
}