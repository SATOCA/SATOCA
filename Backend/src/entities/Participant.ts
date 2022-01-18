import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Survey } from "./Survey";
import { FinishedQuestion } from "./FinishedQuestion";
import { Question } from "./Question";
import {TimeTracker} from "./TimeTracker";

@Entity()
export class Participant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ unique: true })
  uuid: string = "";

  @Column()
  finished: boolean = false;

  @Column("real")
  scoring: number = 0;

  @ManyToOne((type) => Survey, (survey) => survey.participants)
  survey: Survey;

  @ManyToOne((type) => Question, (question) => question.participants)
  currentQuestion: Question;

  @OneToMany(
    (type) => FinishedQuestion,
    (finishedQuestion) => finishedQuestion.participant
  )
  finishedQuestions: FinishedQuestion[];

  @Column()
  legalDisclaimerAccepted: boolean = false;

  @OneToMany((type) => TimeTracker, (tracker) => tracker.participant)
  timeTrackers: TimeTracker[];
}
