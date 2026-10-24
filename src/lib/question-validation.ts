export function normalizeChoiceOptions(raw: unknown):
  | { options: string[]; serialized: string; error?: never }
  | { options?: never; serialized?: never; error: string } {
  if (typeof raw !== "string") {
    return { error: "Multiple choice questions need at least two options" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: "Answer options must be valid JSON" };
  }

  if (!Array.isArray(parsed) || parsed.some((option) => typeof option !== "string")) {
    return { error: "Answer options must be a list of text values" };
  }

  const options = [...new Set(parsed.map((option: string) => option.trim()).filter(Boolean))];
  if (options.length < 2) {
    return { error: "Multiple choice questions need at least two different options" };
  }

  return { options, serialized: JSON.stringify(options) };
}
