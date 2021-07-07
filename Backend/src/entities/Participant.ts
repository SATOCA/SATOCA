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

@Entity()
export class Participant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ unique: true })
  uuid: string = "";

  @Column()
  finished: boolean = false;

  @ManyToOne((type) => Survey, (survey) => survey.participants)
  survey: Survey;

  @ManyToOne((type) => Question, (question) => question.participants)
  currentQuestion: Question;

  @OneToMany(
    (type) => FinishedQuestion,
    (finishedQuestion) => finishedQuestion.participant
  )
  finishedQuestions: FinishedQuestion[];
}
