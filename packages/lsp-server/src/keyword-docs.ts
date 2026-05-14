import { KEYWORDS } from "@devalade/algolang";

export type KeywordDoc = { detail: string; documentation: string };

/** Indexed by the canonical label from the keyword registry (uppercase keywords, lowercase built-ins). */
export const KEYWORD_DOCS: Record<string, KeywordDoc> = Object.fromEntries(
	Object.entries(KEYWORDS).map(([label, entry]) => [
		label,
		{ detail: entry.detail, documentation: entry.documentation },
	]),
);
