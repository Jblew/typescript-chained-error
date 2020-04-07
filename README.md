# Typescript chained error

[![npm](https://img.shields.io/npm/v/typescript-chained-error.svg?style=flat-square)](https://www.npmjs.com/package/typescript-chained-error) [![build](https://travis-ci.com/Jblew/typescript-chained-error.svg?branch=master)](https://travis-ci.com/Jblew/typescript-chained-error) [![Code coverage](https://img.shields.io/codecov/c/gh/jblew/typescript-chained-error?style=flat-square)](https://codecov.io/gh/jblew/typescript-chained-error) [![License](https://img.shields.io/github/license/jblew/typescript-chained-error.svg?style=flat-square)](https://github.com/jblew/typescript-chained-error/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

### Highlights

-   Allows stacking errors with "Caused by: " keyword in stack
-   Preserves error class name in trace (uses [ts-custom-error](https://www.npmjs.com/package/ts-custom-error) for that)
-   Automatically cleans up stack using clean-stack](https://github.com/sindresorhus/clean-stack)
-   Has a `ChainedErrorFactory` that can extend any already existing error with `Caused by` clause additional properties and
-   100% test coverage. Used in healthcare-grade solutions

### Installation

```bash
$ npm install --save typescript-chained-error
```

### Usage

1. Define custom error class with a constructor that has a cause as a second parameter
2. Throw your custom error passing the causing error as a second parameter
3. Error causes can be stacked (there may be many causes that are finally leading to the printed error)

```typescript
import ChainedCustomError from "typescript-chained-error";

class CannotPerformCalculationsError extends ChainedCustomError {
    public constructor(msg?: string, cause?: Error) {
        super(msg, cause);
    }
}

// function that may throw
function buildArray(desiredLength: number) {
    try {
        return new Array(desiredLength);
    } catch (error) {
        throw new CannotPerformCalculationsError("Cannot build array", error);
    }
}

// call function with illegal parameter
buildArray(-5);
```

The output:

```
CannotPerformCalculationsError: Cannot build array
    at buildArray (/typescript-chained-error/src/test.ts:14:15)
    at Object.<anonymous> (/typescript-chained-error/src/test.ts:18:1)
    (...)
 Caused by: RangeError: Invalid array length
    at buildArray (/typescript-chained-error/src/test.ts:12:16)
    at Object.<anonymous> (/typescript-chained-error/src/test.ts:18:1)
    (...)

```

### Options

```typescript
interface Options {
    cleanStack: boolean; // default: true
}

// Pass options in constructor
public constructor(msg?: string, cause?: Error) {
    super(msg, cause, { cleanStack: false });
}
```

### Using ChainedErrorFactory

Example with firebase-functions https error (which is the only error that is thrown at the call site).

```typescript
import { ChainedErrorFactory } from "typescript-chained-error";
import * as functions from "firebase-functions";

throw ChainedErrorFactory.make(
    // primary error that will be extended (this error is preserved in the prototype chain):
    functions.https.HttpsError("resource-exhausted", "Message"),
    // Causing error:
    new TypeError("Cause error"),
    // (optional) Additional fields that will be assigned to the returned error object
    // e.g.: functions.https.HttpsError allow to add a details field to the error. That field will be reconstructed at the call site.
    /* optional: */ { details: { additional: "properties" } },
    // (optional) Options. Specified above.
);
```

---

Extends the brilliant [ts-custom-error](https://www.npmjs.com/package/ts-custom-error). Uses [clean-stack](https://github.com/sindresorhus/clean-stack) by @sindresorhus for pretty output. | Made with ❤️ by [Jędrzej Lewandowski](https://jedrzej.lewandowski.doctor/).
