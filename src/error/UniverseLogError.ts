import { CustomError } from "./CustomError";

export class UniverseLogError extends CustomError {
    public constructor(message?: string, cause?: Error) {
        super(message, cause);
    }
}
