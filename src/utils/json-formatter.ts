export interface JsonResult {
  valid: boolean;
  formatted?: string;
  minified?: string;
  error?: string;
}

export function parseJson(input: string): JsonResult {
  if (!input.trim()) {
    return { valid: false };
  }
  try {
    const parsed: unknown = JSON.parse(input);
    return {
      valid: true,
      formatted: JSON.stringify(parsed, null, 2),
      minified: JSON.stringify(parsed),
    };
  } catch (e) {
    return {
      valid: false,
      error: e instanceof Error ? e.message : "Invalid JSON",
    };
  }
}
