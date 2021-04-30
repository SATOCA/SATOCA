import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne } from "typeorm";
import { Question } from './Question';
import { Answer } from './Answer';

@Entity()
export class FinishedQuestion extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number = 0;

   // @OneToOne(type => Question, participants => participants.survey)
   // question!: Question;

   // @OneToMany(type => Answer, answer => answer.question)
   // givenAnswers!: Answer[];   
}