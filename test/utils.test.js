const { isEmpty, matchIgnoreCase, concatNameWithLength } = require("../app");

describe("utility methods test", () => {
  describe("isEmpty()", () => {
    describe("testing parameters", () => {
      describe("when the given data is not an array", () => {
        test.each([null, undefined, "", false])(
          "given %p should throw an error",
          (arg) => {
            const t = () => {
              isEmpty(arg);
            };
            expect(t).toThrow(Error);
            expect(t).toThrow("not an array");
          }
        );
      });
    });

    describe("testing return value", () => {
      describe("when the array is empty", () => {
        it("should return true", () => {
          expect(isEmpty([])).toBeTruthy();
        });
      });

      describe("when the array is not empty", () => {
        it("should return true", () => {
          expect(isEmpty(["hello"])).toBeFalsy();
        });
      });
    });
  });

  describe("matchIgnoreCase()", () => {
    describe("when the strings do not match", () => {
      it("should not match", () => {
        expect(matchIgnoreCase("hello", "flo")).toBeFalsy();
      });
    });

    describe("when the strings match", () => {
      it("should not match", () => {
        expect(matchIgnoreCase("hello", "ell")).toBeTruthy();
        expect(matchIgnoreCase("hello", "")).toBeTruthy(); // it's weird but it true in javascript
      });
    });
  });

  describe("concatNameWithLength()", () => {
    it("should concatenante the key with the length of the value", () => {
      expect(concatNameWithLength("florian", [1, 2, 3, 4, 5])).toBe(
        "florian [5]"
      );
    });
  });
});
