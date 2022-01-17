import { ErrorDto } from "./ErrorDto";

export interface CreateReportResponseDto {
  scoringReport: Report;
  responseTimeReport: Report;
  error: ErrorDto;
}

export interface Report {
  histogramData: HistogramData[];
}

interface HistogramData {
  bucketName: string;
  score: number;
}
