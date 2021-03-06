import { ErrorDto } from "./ErrorDto";
import { Participant } from "../../entities/Participant";

export interface ParticipantResponseDto {
   error: ErrorDto;
   participants: Participant[];
}
