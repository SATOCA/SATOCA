import { getConnection } from "typeorm";
import { Trustee } from "../entities/Trustee";
import { ErrorDto } from "../routers/dto/ErrorDto";
import { TrusteeDto } from "../routers/dto/TrusteeDto";
import { LoginTrusteeResponseDto } from "../routers/dto/LoginTrusteeResponseDto";

export class TrusteeController {
  async loginTrustee(body: TrusteeDto) {
    const query = await getConnection()
      .getRepository(Trustee)
      .createQueryBuilder("trustee")
      .where("trustee.login = :login", { login: body.login })
      .andWhere("trustee.password = :password", { password: body.password })
      .getCount();

    const err: ErrorDto = {
      message: "",
      hasError: false,
    };
    const result: LoginTrusteeResponseDto = {
      error: err,
      success: query === 1,
    };
    return result;
  }
}
