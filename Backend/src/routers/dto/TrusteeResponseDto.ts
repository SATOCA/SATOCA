import { ErrorDto } from "./ErrorDto";
import {Trustee} from "../../entities/Trustee";

export interface TrusteeResponseDto {
   error: ErrorDto;
   trustees: Trustee[];
}
