// import { removeDefaultProperty, trimToTokenLimit } from "./llmextract";
// const { encoding_for_model } = require("@dqbd/tiktoken");

jest.mock("@dqbd/tiktoken", () => ({
  encoding_for_model: jest.fn(),
}));

describe("removeDefaultProperty", () => {
  it("should remove the default property from a simple object", () => {
    const input = { default: "test", test: "test" };
    const expectedOutput = { test: "test" };
    expect(removeDefaultProperty(input)).toEqual(expectedOutput);
  });

  it("should remove the default property from a nested object", () => {
    const input = {
      default: "test",
      nested: { default: "nestedTest", test: "nestedTest" },
    };
    const expectedOutput = { nested: { test: "nestedTest" } };
    expect(removeDefaultProperty(input)).toEqual(expectedOutput);
  });

  it("should remove the default property from an array of objects", () => {
    const input = {
      array: [
        { default: "test1", test: "test1" },
        { default: "test2", test: "test2" },
      ],
    };
    const expectedOutput = { array: [{ test: "test1" }, { test: "test2" }] };
    expect(removeDefaultProperty(input)).toEqual(expectedOutput);
  });

  it("should handle objects without a default property", () => {
    const input = { test: "test" };
    const expectedOutput = { test: "test" };
    expect(removeDefaultProperty(input)).toEqual(expectedOutput);
  });

  it("should handle null and non-object inputs", () => {
    expect(removeDefaultProperty(null)).toBeNull();
    expect(removeDefaultProperty("string")).toBe("string");
    expect(removeDefaultProperty(123)).toBe(123);
  });
});

describe("trimToTokenLimit", () => {
  const mockEncode = jest.fn();
  const mockFree = jest.fn();
  const mockEncoder = {
    encode: mockEncode,
    free: mockFree,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    encoding_for_model.mockReturnValue(mockEncoder);
  });

  it("should return original text if within token limit", () => {
    const text = "This is a test text";
    mockEncode.mockReturnValue(new Array(5)); // Simulate 5 tokens

    const result = trimToTokenLimit(text, 10, "gpt-4o");

    expect(result).toEqual({
      text,
      numTokens: 5,
      warning: undefined,
    });
    expect(mockEncode).toHaveBeenCalledWith(text);
    expect(mockFree).toHaveBeenCalled();
  });

  it("should trim text and return warning when exceeding token limit", () => {
    const text = "This is a longer text that needs to be trimmed";
    mockEncode
      .mockReturnValueOnce(new Array(20)) // First call for full text
      .mockReturnValueOnce(new Array(8)); // Second call for trimmed text

    const result = trimToTokenLimit(text, 10, "gpt-4o");

    expect(result.text.length).toBeLessThan(text.length);
    expect(result.numTokens).toBe(8);
    expect(result.warning).toContain("automatically trimmed");
    expect(mockEncode).toHaveBeenCalledTimes(2);
    expect(mockFree).toHaveBeenCalled();
  });

  it("should append previous warning if provided", () => {
    const text = "This is a test text that is too long";
    const previousWarning = "Previous warning message";
    mockEncode
      .mockReturnValueOnce(new Array(15))
      .mockReturnValueOnce(new Array(8));

    const result = trimToTokenLimit(text, 10, "gpt-4o", previousWarning);

    expect(result.warning).toContain("automatically trimmed");
    expect(result.warning).toContain(previousWarning);
  });

  it("should use fallback approach when encoder throws error", () => {
    const text = "This is some text to test fallback";
    mockEncode.mockImplementation(() => {
      throw new Error("Encoder error");
    });

    const result = trimToTokenLimit(text, 10, "gpt-4o");

    expect(result.text.length).toBeLessThanOrEqual(30); // 10 tokens * 3 chars per token
    expect(result.numTokens).toBe(10);
    expect(result.warning).toContain("Failed to derive number of LLM tokens");
  });

  it("should handle empty text", () => {
    const text = "";
    mockEncode.mockReturnValue([]);

    const result = trimToTokenLimit(text, 10, "gpt-4o");

    expect(result).toEqual({
      text: "",
      numTokens: 0,
      warning: undefined,
    });
    expect(mockFree).toHaveBeenCalled();
  });

  it("should handle large token limits", () => {
    const text = "A".repeat(384000);
    mockEncode
      .mockReturnValueOnce(new Array(130000))
      .mockReturnValueOnce(new Array(127000));

    const result = trimToTokenLimit(text, 128000, "gpt-4o");

    expect(result.text.length).toBeLessThan(text.length);
    expect(result.numTokens).toBe(127000);
    expect(result.warning).toContain("automatically trimmed");
    expect(mockEncode).toHaveBeenCalledTimes(2);
    expect(mockFree).toHaveBeenCalled();
  });

  it("should handle encoding errors during trimming", () => {
    const text = "Sample text";
    mockEncode.mockImplementation(() => {
      throw new Error("Encoding failed");
    });

    const result = trimToTokenLimit(text, 10, "gpt-4o");

    expect(result.text.length).toBeLessThanOrEqual(30);
    expect(result.warning).toContain("Failed to derive number of LLM tokens");
    expect(mockFree).toHaveBeenCalled();
  });

  it("should handle very small token limits", () => {
    const text = "This is a test sentence that should be trimmed significantly";
    mockEncode
      .mockReturnValueOnce(new Array(20))
      .mockReturnValueOnce(new Array(3));

    const result = trimToTokenLimit(text, 3, "gpt-4o");

    expect(result.text.length).toBeLessThan(text.length);
    expect(result.numTokens).toBe(3);
    expect(result.warning).toContain("automatically trimmed");
    expect(mockFree).toHaveBeenCalled();
  });

  it("should handle unicode characters", () => {
    const text = "Hello 👋 World 🌍";
    mockEncode
      .mockReturnValueOnce(new Array(8))
      .mockReturnValueOnce(new Array(4));

    const result = trimToTokenLimit(text, 4, "gpt-4o");

    expect(result.text.length).toBeLessThan(text.length);
    expect(result.numTokens).toBe(4);
    expect(result.warning).toContain("automatically trimmed");
    expect(mockFree).toHaveBeenCalled();
  });

  it("should handle multiple trimming iterations", () => {
    const text = "A".repeat(1000);
    mockEncode
      .mockReturnValueOnce(new Array(300))
      .mockReturnValueOnce(new Array(200))
      .mockReturnValueOnce(new Array(100))
      .mockReturnValueOnce(new Array(50));

    const result = trimToTokenLimit(text, 50, "gpt-4o");

    expect(result.text.length).toBeLessThan(text.length);
    expect(result.numTokens).toBe(50);
    expect(result.warning).toContain("automatically trimmed");
    expect(mockEncode).toHaveBeenCalledTimes(4);
    expect(mockFree).toHaveBeenCalled();
  });
});
