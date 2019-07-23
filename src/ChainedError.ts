import { CustomError as TsCustomError } from "ts-custom-error";

export default class ChainedError extends TsCustomError {
    public cause?: Error;

    public constructor(message?: string, cause?: Error) {
        super(message);

        if (cause) {
            this.cause = cause;
            this.stack = (this.stack || "") + "\n Caused by: " + (cause.stack || cause);
        }
    }
}
