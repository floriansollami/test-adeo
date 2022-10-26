const { filter } = require("../app");
const data = require("../data");

describe("filter test", () => {
  describe("testing parameters", () => {
    describe("when the given data is empty", () => {
      it("should have length equals to 0", () => {
        expect(filter([], "test")).toHaveLength(0);
      });
    });

    describe("when the given search string is not defined nor a string", () => {
      test.each([null, undefined, "", false])(
        "given %p should throw an error",
        (arg) => {
          const t = () => {
            filter([]);
          };
          expect(t).toThrow(Error);
          expect(t).toThrow("search string should be defined");
        }
      );
    });
    describe("when the given search string is an empty string", () => {
      it("should throw an error", () => {
        const t = () => {
          filter([], "");
        };
        expect(t).toThrow(Error);
        expect(t).toThrow("search string should be defined");
      });
    });
  });

  describe("testing filtering", () => {
    describe("when the partial name is linked to 2 animals", () => {
      it("should show the animals matching with the ry string pattern", () => {
        expect(filter(data, "ry")).toMatchInlineSnapshot(`
[
  {
    "name": "Uzuzozne",
    "people": [
      {
        "animals": [
          {
            "name": "John Dory",
          },
        ],
        "name": "Lillie Abbott",
      },
    ],
  },
  {
    "name": "Satanwi",
    "people": [
      {
        "animals": [
          {
            "name": "Oryx",
          },
        ],
        "name": "Anthony Bruno",
      },
    ],
  },
]
`);
      });
    });

    describe("when the partial name is not linked to an animal", () => {
      it("should return an empty array due to no matching", () => {
        expect(filter(data, "zu")).toEqual([]);
      });
    });
  });
});
