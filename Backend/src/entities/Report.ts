import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { HistogramData } from "../routers/dto/CreateReportResponseDto";
import { JoinColumn } from "typeorm/browser";
import { Survey } from "./Survey";

@Entity()
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @OneToOne((type) => Survey, (Survey) => Survey.id)
  @JoinColumn()
  SurveyId: number = 0;

  @Column()
  scoringReport: HistogramData;

  @Column()
  responseTimeReport: HistogramData;
}
