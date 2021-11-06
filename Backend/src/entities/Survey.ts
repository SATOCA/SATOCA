import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Participant } from "./Participant";
import { Question } from "./Question";

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

  @OneToMany((type) => Participant, (participant) => participant.survey)
  participants: Participant[];

  @OneToMany((type) => Question, (question) => question.survey)
  questions: Question[];
}
