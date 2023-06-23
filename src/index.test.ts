import { helloWorld } from ".";

describe("@tnezdev/actions", () => {
  describe("helloWorld", () => {
    it('should return "Hello World!"', () => {
      const result = helloWorld();
      expect(result).toBe("Hello World!");
    });
  });
});
