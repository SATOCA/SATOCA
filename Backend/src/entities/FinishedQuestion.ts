import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Question } from './Question';
import { Answer } from './Answer';
import { SurveyProgress } from "./SurveyProgress";

@Entity()
export class FinishedQuestion extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number = 0;

   @OneToOne(type => Question, question => question.finishedQuestion)
   @JoinColumn()
   question: Question;

   @ManyToOne(type => SurveyProgress, progress => progress.finishedQuestion)
   surveyProgress: SurveyProgress;

   @OneToMany(type => Answer, answer => answer.finishedQuestion)
   givenAnswers: Answer[];


}