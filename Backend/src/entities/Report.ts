import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { Survey } from "./Survey";
import { HistogramData } from "../routers/dto/CreateReportResponseDto";

@Entity()
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @OneToOne((type) => Survey, (Survey) => Survey.id)
  @JoinColumn()
  SurveyId: number = 0;

  @Column({ type: "json" })
  scoringReport: HistogramData;

  @Column({ type: "json" })
  responseTimeReport: HistogramData;
}
