// tslint:disable no-unused-expression
import { expect } from "./_test/test_environment";
import { ChainedErrorFactory } from "./ChainedErrorFactory";
import { Options } from "./Options";

describe("ChainedErrorFactory", function() {
    it("Creates error that is instanceof Error", () => {
        const someError = new Error("some error");
        const chainedError = ChainedErrorFactory.make(someError, new Error("Cause"));
        expect(chainedError instanceof Error).to.be.true;
    });

    it("Creates error that is instanceof supplied error", () => {
        const someError = new TypeError("some type error");
        const chainedError = ChainedErrorFactory.make(someError, new Error("Cause"), {}, Options.DEFAULT);
        expect(chainedError instanceof TypeError).to.be.true;
    });

    it("Creates error that has 'Caused by' clause in stack if cause specified", () => {
        const someError = new TypeError("some type error");
        const chainedError = ChainedErrorFactory.make(someError, new TypeError("Cause"));
        expect(chainedError.stack).to.match(/Caused by: TypeError/);
    });

    it("Creates error that does not have 'Caused by' clause if cause not specified", () => {
        const someError = new TypeError("some type error");
        const chainedError = ChainedErrorFactory.make(someError);
        expect(chainedError.stack).to.not.match(/Caused by/);
    });

    it("Creates error that has cause property if cause specified", () => {
        const causeError = new Error("Cause error");
        const someError = new TypeError("some type error");
        const chainedError = ChainedErrorFactory.make(someError, causeError);
        expect(chainedError)
            .to.haveOwnProperty("cause")
            .that.equals(causeError);
    });

    it("Creates error that does not have cause property if cause not specified", () => {
        const someError = new TypeError("some type error");
        const chainedError = ChainedErrorFactory.make(someError);
        expect(chainedError).to.not.haveOwnProperty("cause");
    });

    it("Appends specified appends own properties to created error", () => {
        const requiredProps = {
            a: { c: 1, d: [] },
            b: { f: "a" },
        };
        Object.setPrototypeOf(requiredProps, { c: "c" });

        const someError = new TypeError("some type error");
        const chainedError = ChainedErrorFactory.make(someError, undefined, requiredProps);
        expect(chainedError.a).to.deep.equal(requiredProps.a);
        expect(chainedError.b).to.deep.equal(requiredProps.b);
        expect((chainedError as any).c).to.be.undefined;
    });
});
