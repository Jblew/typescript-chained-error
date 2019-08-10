import * as cleanStack from "clean-stack--tmp-fork-by-jblew-browser-support";
import { CustomError as TsCustomError } from "ts-custom-error";

export default class ChainedError extends TsCustomError {
    public cause?: Error;

    public constructor(message?: string, cause?: Error, options: Options = Options.DEFAULT) {
        super(message);

        if (cause) {
            this.cause = cause;
            this.stack = (this.stack || "") + "\n Caused by: " + (cause.stack || cause);
        }

        function doCleanStack(stack: string) {
            return cleanStack(stack, { pretty: true });
        }

        if (this.stack && options.cleanStack) {
            this.stack = doCleanStack(this.stack);
        }
    }
}

export interface Options {
    cleanStack: boolean; // default true
}

export namespace Options {
    export const DEFAULT: Options = {
        cleanStack: true,
    };
}
