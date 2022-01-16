import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Participant } from "./Participant";
import { Question } from "./Question";
import { Report } from "./Report";

@Entity()
export class Survey extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  title: string = "";

  @Column("real")
  itemSeverityBoundary: number = 0;

  @Column("real")
  privacyBudget: number = 0;

  @Column()
  isClosed: boolean = false;

  @OneToMany((type) => Participant, (participant) => participant.survey)
  participants: Participant[];

  @OneToMany((type) => Question, (question) => question.survey)
  questions: Question[];

  @Column()
  legalDisclaimer: string = "";

  @OneToOne((type) => Report, (report) => report.id)
  report: Report;
}
