export interface ContextItem {
	id: string;
	content: string;
	metadata?: Record<string, any>;
	timestamp?: number;
}

export interface ContextQuery {
	text: string;
	filters?: Record<string, any>;
	limit?: number;
}

export interface ContextResult {
	items: ContextItem[];
	score: number;
	query: string;
}

export class ContextSystem {
	private items: Map<string, ContextItem> = new Map();
	private index: Map<string, Set<string>> = new Map();

	addItem(item: ContextItem): void {
		this.items.set(item.id, {
			...item,
			timestamp: item.timestamp || Date.now(),
		});

		this.updateIndex(item);
	}

	private updateIndex(item: ContextItem): void {
		const words = item.content.toLowerCase().split(/\s+/);

		for (const word of words) {
			if (word.length > 2) {
				if (!this.index.has(word)) {
					this.index.set(word, new Set());
				}
				this.index.get(word)!.add(item.id);
			}
		}
	}

	query(query: ContextQuery): ContextResult {
		const queryWords = query.text.toLowerCase().split(/\s+/);
		const matchingItemIds = new Set<string>();

		for (const word of queryWords) {
			if (word.length > 2 && this.index.has(word)) {
				const wordMatches = this.index.get(word)!;
				if (matchingItemIds.size === 0) {
					wordMatches.forEach((id) => matchingItemIds.add(id));
				} else {
					const currentMatches = new Set<string>();
					wordMatches.forEach((id) => {
						if (matchingItemIds.has(id)) {
							currentMatches.add(id);
						}
					});
					matchingItemIds.clear();
					currentMatches.forEach((id) => matchingItemIds.add(id));
				}
			}
		}

		const matchingItems = Array.from(matchingItemIds)
			.map((id) => this.items.get(id)!)
			.filter((item) => {
				if (!query.filters) return true;
				return this.matchesFilters(item, query.filters);
			});

		const sortedItems = matchingItems.sort((a, b) => {
			const scoreA = this.calculateScore(a, query.text);
			const scoreB = this.calculateScore(b, query.text);
			return scoreB - scoreA;
		});

		const limitedItems = sortedItems.slice(0, query.limit || 10);
		const totalScore = limitedItems.reduce(
			(sum, item) => sum + this.calculateScore(item, query.text),
			0,
		);

		return {
			items: limitedItems,
			score: totalScore,
			query: query.text,
		};
	}

	private calculateScore(item: ContextItem, query: string): number {
		const content = item.content.toLowerCase();
		const queryLower = query.toLowerCase();

		let score = 0;
		const queryWords = queryLower.split(/\s+/);

		for (const word of queryWords) {
			if (word.length > 2) {
				const wordCount = (content.match(new RegExp(word, "g")) || []).length;
				score += wordCount * 10;
			}
		}

		if (content.includes(queryLower)) {
			score += 50;
		}

		if (item.timestamp) {
			const ageInHours = (Date.now() - item.timestamp) / (1000 * 60 * 60);
			score += Math.max(0, 10 - ageInHours / 24);
		}

		return score;
	}

	private matchesFilters(
		item: ContextItem,
		filters: Record<string, any>,
	): boolean {
		if (!item.metadata) return false;

		for (const [key, value] of Object.entries(filters)) {
			if (item.metadata[key] !== value) {
				return false;
			}
		}
		return true;
	}

	removeItem(id: string): boolean {
		const item = this.items.get(id);
		if (!item) return false;

		this.items.delete(id);

		const words = item.content.toLowerCase().split(/\s+/);
		for (const word of words) {
			if (word.length > 2 && this.index.has(word)) {
				this.index.get(word)!.delete(id);
				if (this.index.get(word)!.size === 0) {
					this.index.delete(word);
				}
			}
		}

		return true;
	}

	clear(): void {
		this.items.clear();
		this.index.clear();
	}

	size(): number {
		return this.items.size;
	}

	getAll(): ContextItem[] {
		return Array.from(this.items.values());
	}

	export(): string {
		const data = {
			items: Array.from(this.items.values()),
			exportDate: new Date().toISOString(),
		};
		return JSON.stringify(data, null, 2);
	}

	import(jsonData: string): void {
		try {
			const data = JSON.parse(jsonData);
			if (data.items && Array.isArray(data.items)) {
				this.clear();
				data.items.forEach((item: ContextItem) => this.addItem(item));
			}
		} catch (error) {
			throw new Error("Invalid JSON data provided");
		}
	}
}
