export default class NotFoundException extends Error {
  constructor(message: string) {
    super(`Not found resource, ${message}`);
  }
}
