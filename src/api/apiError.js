export default class ApiError extends Error {
  constructor({
    message,
    status,
    code,
    isNetwork = false,
    isCancel = false,
  }) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.isNetwork = isNetwork;
    this.isCancel = isCancel;
  }
}