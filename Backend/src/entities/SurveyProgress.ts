import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne } from "typeorm";
import { Participant } from './Participant';

@Entity()
export class SurveyProgress extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number = 0;

   @Column()
   title: string = "";

   @Column()
   finished: boolean = false;

   @OneToOne(type => Participant, participant => participant.progress)
   participant!: Participant;
}