export class HttpError extends Error {
  public statusCode: number;
  public response: string | object;

  constructor(statusCode: number, responseText: string | object) {
    super(`HTTP Error: ${statusCode}`);
    this.statusCode = statusCode;
    this.response = responseText;
    // Set the prototype explicitly to preserve the correct instance type
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
