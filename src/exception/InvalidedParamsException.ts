export default class InvalidedParamsException extends Error {
  constructor(message: string) {
    super(`Invalided parameters, please check, ${message}`);
  }
}
