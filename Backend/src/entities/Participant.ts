import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { Survey } from "./Survey";

@Entity({ name: 'participant' })
export class Participant extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number = 0;

   @Column({ unique: true })
   uuid: string = "";

   @ManyToOne(type => Survey, survey => survey.participants)
   survey!: Survey;   
}