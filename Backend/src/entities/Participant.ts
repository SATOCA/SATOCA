import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Survey } from "./Survey";
import { SurveyProgress } from "./SurveyProgress";

@Entity()
export class Participant extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number = 0;

   @Column({ unique: true })
   uuid: string = "";

   @OneToOne(type => SurveyProgress, progress => progress.participant)
   @JoinColumn()
   surveyProgress: SurveyProgress;

   @ManyToOne(type => Survey, survey => survey.participants)
   survey: Survey;


}