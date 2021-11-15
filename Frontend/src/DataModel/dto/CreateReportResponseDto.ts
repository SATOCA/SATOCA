import { ErrorDto } from "./ErrorDto";

export interface CreateReportResponseDto {
  report: Report;
  error: ErrorDto;
}

export interface Report {
  histogramData: HistogramData[];
}

interface HistogramData {
  bucketName: string;
  participantNumber: number;
}
