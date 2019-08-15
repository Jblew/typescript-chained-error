/* tslint:disable:max-classes-per-file no-unused-expression */
import { expect } from "./_test/test_environment";
import ChainedError from "./ChainedError";

describe("ChainedError", () => {
    class AChainedError extends ChainedError {
        public constructor(msg: string, cause?: Error) {
            super(msg, cause);
        }
    }

    class BChainedError extends ChainedError {
        public constructor(msg: string, cause?: Error) {
            super(msg, cause);
        }
    }

    class CChainedError extends ChainedError {
        public constructor(msg: string, cause?: Error) {
            super(msg, cause);
        }
    }

    it("is instanceof Error", () => {
        const chainedError = new AChainedError("m");
        expect(chainedError instanceof Error).to.be.true;
    });

    it("is instanceof ChainedError", () => {
        const chainedError = new AChainedError("m");
        expect(chainedError instanceof ChainedError).to.be.true;
    });

    describe("with single cause", () => {
        function thrower() {
            throw new AChainedError("Error in thrower");
        }

        function rethrower() {
            try {
                thrower();
            } catch (error) {
                throw new BChainedError("Error in rethrower", error);
            }
        }

        it("cause is instance of specified error", () => {
            expect(rethrower)
                .to.throw(BChainedError)
                .with.property("cause");
        });

        it("stack contains cause with it's stack", () => {
            expect(rethrower)
                .to.throw(BChainedError)
                .with.property("stack")
                .that.include("Caused by: AChainedError");
        });
    });

    describe("with stacked causes", () => {
        function thrower() {
            throw new AChainedError("Error in thrower");
        }

        function rethrower1() {
            try {
                thrower();
            } catch (error) {
                throw new BChainedError("Error in rethrower1", error);
            }
        }

        function rethrower2() {
            try {
                rethrower1();
            } catch (error) {
                throw new CChainedError("Error in rethrower2", error);
            }
        }

        it("stack contains two causes with it's stack", () => {
            expect(rethrower2)
                .to.throw(CChainedError)
                .with.property("stack")
                .that.include("Caused by: AChainedError")
                .and.include("Caused by: BChainedError");
        });
    });

    describe("stack cleaning", () => {
        class CleanStackError extends ChainedError {
            public constructor(msg: string) {
                const causeErr = new Error("Err");
                causeErr.stack += "\n at processImmediate (internal/timers.js:439:21)";
                super(msg, causeErr, { cleanStack: true });
            }
        }

        class DirtyStackError extends ChainedError {
            public constructor(msg: string, cause?: Error) {
                const causeErr = new Error("Err");
                causeErr.stack += "\n at processImmediate (internal/timers.js:439:21)";
                super(msg, causeErr, { cleanStack: false });
            }
        }

        function cleanThrower() {
            throw new CleanStackError("Error in thrower");
        }

        function dirtyThrower() {
            throw new DirtyStackError("Error in thrower");
        }

        it("Cleans stack when Options.cleanStack", () => {
            expect(cleanThrower)
                .to.throw(CleanStackError)
                .with.property("stack")
                .that.does.not.include("processImmediate");
        });

        it("Does not clean stack when Options.cleanStack", () => {
            expect(dirtyThrower)
                .to.throw(DirtyStackError)
                .with.property("stack")
                .that.includes("processImmediate");
        });
    });
});
