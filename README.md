# Typescript chained error

[![npm](https://img.shields.io/npm/v/typescript-chained-error.svg?style=flat-square)](https://www.npmjs.com/package/typescript-chained-error) [![build](https://travis-ci.com/Jblew/typescript-chained-error.svg?branch=master)](https://travis-ci.com/Jblew/typescript-chained-error) [![License](https://img.shields.io/github/license/wise-team/steem-content-renderer.svg?style=flat-square)](https://github.com/wise-team/steem-content-renderer/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)



### Highlights

- Allows stacking errors with "Caused by: " keyword in stack
- Preserves error class name in trace (uses [ts-custom-error](https://www.npmjs.com/package/ts-custom-error) for that)
- Automatically cleans up stack using clean-stack](https://github.com/sindresorhus/clean-stack)



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



---

Extends the brilliant [ts-custom-error](https://www.npmjs.com/package/ts-custom-error). Uses [clean-stack](https://github.com/sindresorhus/clean-stack) by @sindresorhus for pretty output. | Made with ❤️ by [Jędrzej Lewandowski](https://jedrzej.lewandowski.doctor/).
