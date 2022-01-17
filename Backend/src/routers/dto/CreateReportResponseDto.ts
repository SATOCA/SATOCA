import { ErrorDto } from "./ErrorDto";

export interface CreateReportResponseDto {
  scoringReport: Report;
  responseTimeReport: Report;
  error: ErrorDto;
}

export interface Report {
  histogramData: HistogramData[];
}

export interface HistogramData {
  bucketName: string;
  score: number;
}
