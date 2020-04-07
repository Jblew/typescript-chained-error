import * as cleanStack from "clean-stack";
import * as deepmerge from "deepmerge";

import ChainedError from "./ChainedError";
import { Options } from "./Options";

export namespace ChainedErrorFactory {
    export function make<T extends Error, A extends { [x: string]: any }>(
        error: T,
        cause?: Error,
        appendToError?: A,
        options: Options = Options.DEFAULT,
    ): ChainedError & T & A {
        const chainedError: ChainedError & T = error;
        if (cause) {
            chainedError.cause = cause;
        }

        chainedError.stack = appendToStack(chainedError.stack, cause, options);

        if (appendToError) {
            appendOwnProps(chainedError, appendToError);
        }
        return chainedError as ChainedError & T & A;
    }

    export function appendToStack(stack: string | undefined, cause: Error | undefined, options: Options): string {
        let newStack = stack || /* istanbul ignore next */ "";
        if (cause) {
            newStack += "\n Caused by: " + (cause.stack || /* istanbul ignore next */ cause);
        }

        function doCleanStack(stackToClean: string) {
            return cleanStack(stackToClean, { pretty: true });
        }

        if (options && options.cleanStack) {
            newStack = doCleanStack(newStack);
        }
        return newStack;
    }

    function appendOwnProps(toObj: object & { [x: string]: any }, props: object & { [x: string]: any }) {
        for (const prop in props) {
            if (props.hasOwnProperty(prop)) {
                const shouldMerge = toObj.hasOwnProperty(prop) && typeof toObj[prop] === "object";
                toObj[prop] = shouldMerge ? deepmerge(toObj[prop], props[prop]) : props[prop];
            }
        }
    }
}
