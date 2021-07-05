import { getConnection } from "typeorm";
import { Trustee } from "../entities/Trustee";
import { ErrorDto } from "../routers/dto/ErrorDto";
import { TrusteeResponseDto } from "../routers/dto/TrusteeResponseDto";
import { TrusteeDto } from "../routers/dto/TrusteeDto";
import { LoginTrusteeResponseDto } from "../routers/dto/LoginTrusteeResponseDto";

export class TrusteeController {
  async getTrustees() {
    const query = await getConnection().getRepository(Trustee).find();

    const err: ErrorDto = {
      message: query ? "" : "todo: error message",
      hasError: !query,
    };
    const result: TrusteeResponseDto = {
      error: err,
      trustees: query,
    };
    return result;
  }

  async postTrustee(body: TrusteeDto) {
    let obj = new Trustee();
    obj.login = body.login;
    obj.password = body.password;
    let result: ErrorDto = {
      message: "",
      hasError: false,
    };

    await getConnection()
      .getRepository(Trustee)
      .save(obj)
      .then(() => {
        result.hasError = false;
      })
      .catch((e) => {
        result.hasError = true;
        result.message = e;
      });
    return result;
  }

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

