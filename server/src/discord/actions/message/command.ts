const snowflakeRegex = /^(\d+)$/;

export const basePhrase = "!kimi";

export const parameterTypes = {
  integer: {
    name: "整数",
    converter: (value: string) => {
      const num = parseInt(value);
      if (isNaN(num)) return;
      return num;
    }
  } as const,
  float: {
    name: "実数",
    converter: (value: string) => {
      const num = parseFloat(value);
      if (isNaN(num)) return;
      return num;
    }
  } as const,
  string: {
    name: "文字列",
    converter: (value: string) => {
      return value;
    }
  } as const,
  userId: {
    name: "ユーザーID",
    converter: (value: string) => {
      const match = value.match(snowflakeRegex);
      if (!match) return;
      return match[1];
    }
  } as const
} as const;
