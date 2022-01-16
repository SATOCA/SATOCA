import { ErrorDto } from "./ErrorDto";

export interface CreateReportResponseDto {
  report: Report;
  error: ErrorDto;
}

export interface Report {
  histogramData: HistogramData[];
}

export interface HistogramData {
  bucketName: string;
  score: number;
}
