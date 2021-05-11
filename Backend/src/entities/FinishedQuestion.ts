import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne, JoinColumn} from "typeorm";
import { Question } from './Question';
import { Answer } from './Answer';

@Entity()
export class FinishedQuestion extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number = 0;

   @OneToOne(type => Question, question => question.finishedQuestion)
   @JoinColumn()
   question: Question;

   @OneToMany(type => Answer, answer => answer.finishedQuestion)
   givenAnswers: Answer[];
}