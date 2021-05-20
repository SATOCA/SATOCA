import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Survey } from "./Survey";
import { Answer } from "./Answer";
import { FinishedQuestion } from "./FinishedQuestion";
import { SurveyProgress } from "./SurveyProgress";

@Entity()
export class Question extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number = 0;

   @Column()
   text: string = "";

   @Column()
   multiResponse: boolean = false;

   @ManyToOne(type => Survey, survey => survey.id)
   survey: Survey;

   @OneToMany(type => Answer, answer => answer.question)
   choices: Answer[];

   @OneToOne(type => FinishedQuestion, finishedQuestion => finishedQuestion.question)
   finishedQuestion: FinishedQuestion;

   @OneToOne(type => SurveyProgress, progress => progress.currentQuestion)
   progress: SurveyProgress;
}