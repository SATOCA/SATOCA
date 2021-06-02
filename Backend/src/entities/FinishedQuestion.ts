import { Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToOne } from "typeorm";
import { Question } from './Question';
import { Answer } from './Answer';
import { Participant } from "./Participant";

@Entity()
export class FinishedQuestion extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number = 0;

   @ManyToOne(type => Question, question => question.finishedQuestions)
   question: Question;

   @ManyToOne(type => Participant, participant => participant.finishedQuestions)
   participant: Participant;

   @OneToMany(type => Answer, answer => answer.finishedQuestion)
   givenAnswers: Answer[];


}