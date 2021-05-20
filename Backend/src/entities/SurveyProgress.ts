import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Participant } from './Participant';
import { FinishedQuestion } from "./FinishedQuestion";
import { Question } from "./Question";

@Entity()
export class SurveyProgress extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number = 0;
/*
   @Column()
   title: string = "";
*/
   @Column()
   finished: boolean = false;

   @OneToOne(type => Question, currentQuestion => currentQuestion.progress)
   @JoinColumn()
   currentQuestion: Question;

   @OneToOne(type => Participant, participant => participant.surveyProgress)
   participant: Participant;

   @OneToMany(type => FinishedQuestion, finishedQuestion => finishedQuestion.surveyProgress)
   finishedQuestion: FinishedQuestion[];
   
}