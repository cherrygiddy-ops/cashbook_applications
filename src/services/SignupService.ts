import type SignupPayload from "../entities/SignupPayload";
import type SignupResponse from "../entities/SignupResponse";
import ApiClient from "./ApiClient";

class SignupService extends ApiClient<SignupPayload, SignupResponse> {
  constructor() {
    super("/users");
  }

  signUp = (payload: SignupPayload) => this.create(payload);
}

export default new SignupService();
