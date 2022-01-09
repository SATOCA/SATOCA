import { ErrorDto } from "./ErrorDto";

export interface CreateReportResponseDto {
    progress: number;
    error: ErrorDto;
}