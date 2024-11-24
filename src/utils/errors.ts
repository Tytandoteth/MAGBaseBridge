export class BridgeError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'BridgeError';
    Object.setPrototypeOf(this, BridgeError.prototype);
  }

  static isBridgeError(error: unknown): error is BridgeError {
    return error instanceof BridgeError;
  }
}