export class InternalServerError extends Error {
  constructor({ cause }) {
    super("An unexpected internal error occurred", { cause });
    this.name = "InternalServerError";
    this.action =
      "Please try again later or contact support if the problem persists.";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
