import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from "typeorm";
import { Survey } from "./Survey";
import { Answer } from "./Answer";
import { FinishedQuestion } from "./FinishedQuestion";
import { Participant } from "./Participant";
import {TimeTracker} from "./TimeTracker";

@Entity()
export class Question extends BaseEntity {

   @PrimaryGeneratedColumn()
   id: number = 0;

   @Column()
   text: string = "";

   @Column()
   multiResponse: boolean = false;

   @Column()
   startSet: boolean = false;

   @Column("real")
   slope: number;

   @Column("real")
   difficulty: number;

   @ManyToOne(type => Survey, survey => survey.questions)
   survey: Survey;

   @OneToMany(type => Answer, answer => answer.question)
   choices: Answer[];

   @OneToMany(type => Participant, participant => participant.currentQuestion)
   participants: Participant[];

   @OneToMany(type => FinishedQuestion, finishedQuestion => finishedQuestion.question)
   finishedQuestions: FinishedQuestion[];

   @OneToMany((type) => TimeTracker, (tracker) => tracker.question)
   timeTrackers: TimeTracker[];
}
