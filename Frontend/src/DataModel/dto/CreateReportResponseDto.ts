import { ErrorDto } from "./ErrorDto";

export interface CreateReportResponseDto {
  report: Report;
  error: ErrorDto;
}

interface Report {
  histogramData: HistogramData[];
}

interface HistogramData {
  bucketName: string;
  participantNumber: number;
}
