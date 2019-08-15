import { CustomError as TsCustomError } from "ts-custom-error";

import { ChainedErrorFactory } from "./ChainedErrorFactory";
import { Options } from "./Options";

export default class ChainedError extends TsCustomError {
    public cause?: Error;

    public constructor(message?: string, cause?: Error, options: Options = Options.DEFAULT) {
        super(message) /* istanbul ignore next (treats super call as testable) */;

        this.cause = cause;
        this.stack = ChainedErrorFactory.appendToStack(this.stack, cause, options);
    }
}

export { ChainedErrorFactory } from "./ChainedErrorFactory";
export { Options } from "./Options";
