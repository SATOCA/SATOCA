import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Participant } from "./Participant";

@Entity({ name: 'survey' })
export class Survey extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number = 0;

   @Column()
   title: string = "";

   @OneToMany(type => Participant, participants => participants.survey)
   participants!: Participant[];   
}