import { ErrorDto } from "./ErrorDto";

export interface CreateReportResponseDto {
  scoringReport: HistogramData[];
  responseTimeReport: HistogramData[];
  error: ErrorDto;
}

export interface HistogramData {
  bucketName: string;
  score: number;
}
