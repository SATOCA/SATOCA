import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { Question } from './Question'
import { FinishedQuestion } from "./FinishedQuestion";

@Entity()
export class Answer extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number = 0;

   @Column()
   text: string = "";

   @Column()
   correct: boolean = false;

   @ManyToOne(type => Question, question => question.choices)
   question: Question;

   @ManyToOne(type => FinishedQuestion, finishedQuestion => finishedQuestion.givenAnswers)
   finishedQuestion: FinishedQuestion;
}