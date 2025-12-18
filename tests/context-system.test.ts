import { test, expect } from "bun:test";
import { ContextSystem } from "../src/context-system";
import type { ContextItem, ContextQuery } from "../src/context-system";

test("ContextSystem - Add and retrieve items", () => {
  const contextSystem = new ContextSystem();
  
  const item: ContextItem = {
    id: "test1",
    content: "This is a test content about programming",
    metadata: { category: "programming" }
  };
  
  contextSystem.addItem(item);
  
  const allItems = contextSystem.getAll();
  expect(allItems).toHaveLength(1);
  expect(allItems[0].id).toBe("test1");
  expect(allItems[0].content).toBe("This is a test content about programming");
  expect(allItems[0].metadata?.category).toBe("programming");
  expect(allItems[0].timestamp).toBeDefined();
});

test("ContextSystem - Query with exact match", () => {
  const contextSystem = new ContextSystem();
  
  contextSystem.addItem({
    id: "item1",
    content: "JavaScript programming language",
    metadata: { type: "tutorial" }
  });
  
  contextSystem.addItem({
    id: "item2",
    content: "Python programming guide",
    metadata: { type: "tutorial" }
  });
  
  const query: ContextQuery = {
    text: "JavaScript programming",
    limit: 10
  };
  
  const result = contextSystem.query(query);
  
  expect(result.items).toHaveLength(1);
  expect(result.items[0].id).toBe("item1");
  expect(result.query).toBe("JavaScript programming");
});

test("ContextSystem - Query with partial matches", () => {
  const contextSystem = new ContextSystem();
  
  contextSystem.addItem({
    id: "item1",
    content: "JavaScript programming language tutorial",
    metadata: { type: "tutorial" }
  });
  
  contextSystem.addItem({
    id: "item2",
    content: "Python programming guide",
    metadata: { type: "guide" }
  });
  
  contextSystem.addItem({
    id: "item3",
    content: "TypeScript programming",
    metadata: { type: "tutorial" }
  });
  
  const query: ContextQuery = {
    text: "programming",
    limit: 10
  };
  
  const result = contextSystem.query(query);
  
  expect(result.items.length).toBe(3);
  expect(result.items.every(item => item.content.includes("programming"))).toBe(true);
});

test("ContextSystem - Query with filters", () => {
  const contextSystem = new ContextSystem();
  
  contextSystem.addItem({
    id: "item1",
    content: "JavaScript programming language",
    metadata: { type: "tutorial", difficulty: "beginner" }
  });
  
  contextSystem.addItem({
    id: "item2",
    content: "Python programming guide",
    metadata: { type: "guide", difficulty: "intermediate" }
  });
  
  contextSystem.addItem({
    id: "item3",
    content: "TypeScript programming",
    metadata: { type: "tutorial", difficulty: "advanced" }
  });
  
  const query: ContextQuery = {
    text: "programming",
    limit: 10,
    filters: { type: "tutorial" }
  };
  
  const result = contextSystem.query(query);
  
  expect(result.items).toHaveLength(2);
  expect(result.items.every(item => item.metadata?.type === "tutorial")).toBe(true);
});

test("ContextSystem - Query with limit", () => {
  const contextSystem = new ContextSystem();
  
  for (let i = 1; i <= 5; i++) {
    contextSystem.addItem({
      id: `item${i}`,
      content: `Content about programming ${i}`,
      metadata: { order: i }
    });
  }
  
  const query: ContextQuery = {
    text: "programming",
    limit: 3
  };
  
  const result = contextSystem.query(query);
  
  expect(result.items).toHaveLength(3);
});

test("ContextSystem - Remove items", () => {
  const contextSystem = new ContextSystem();
  
  contextSystem.addItem({
    id: "item1",
    content: "Content to remove"
  });
  
  contextSystem.addItem({
    id: "item2",
    content: "Content to keep"
  });
  
  expect(contextSystem.getAll()).toHaveLength(2);
  
  const removed = contextSystem.removeItem("item1");
  expect(removed).toBe(true);
  
  const remainingItems = contextSystem.getAll();
  expect(remainingItems).toHaveLength(1);
  expect(remainingItems[0].id).toBe("item2");
  
  // Try to remove non-existent item
  const notRemoved = contextSystem.removeItem("nonexistent");
  expect(notRemoved).toBe(false);
});

test("ContextSystem - Clear all items", () => {
  const contextSystem = new ContextSystem();
  
  contextSystem.addItem({ id: "item1", content: "Content 1" });
  contextSystem.addItem({ id: "item2", content: "Content 2" });
  contextSystem.addItem({ id: "item3", content: "Content 3" });
  
  expect(contextSystem.getAll()).toHaveLength(3);
  
  contextSystem.clear();
  
  expect(contextSystem.getAll()).toHaveLength(0);
  expect(contextSystem.size()).toBe(0);
});

test("ContextSystem - Size tracking", () => {
  const contextSystem = new ContextSystem();
  
  expect(contextSystem.size()).toBe(0);
  
  contextSystem.addItem({ id: "item1", content: "Content 1" });
  expect(contextSystem.size()).toBe(1);
  
  contextSystem.addItem({ id: "item2", content: "Content 2" });
  expect(contextSystem.size()).toBe(2);
  
  contextSystem.removeItem("item1");
  expect(contextSystem.size()).toBe(1);
  
  contextSystem.clear();
  expect(contextSystem.size()).toBe(0);
});

test("ContextSystem - Query scoring", () => {
  const contextSystem = new ContextSystem();
  
  contextSystem.addItem({
    id: "exact",
    content: "JavaScript programming language",
    timestamp: Date.now()
  });
  
  contextSystem.addItem({
    id: "partial",
    content: "JavaScript tutorial",
    timestamp: Date.now() - 1000000 // Older
  });
  
  contextSystem.addItem({
    id: "multiple",
    content: "JavaScript programming tutorial",
    timestamp: Date.now()
  });
  
  const query: ContextQuery = {
    text: "JavaScript programming",
    limit: 10
  };
  
  const result = contextSystem.query(query);
  
  // Items with more matches should come first
  expect(result.items[0].id).toBe("multiple"); // Contains both "JavaScript" and "programming"
  expect(result.items[1].id).toBe("exact"); // Contains both words as phrase
  expect(result.items[2].id).toBe("partial"); // Contains only "JavaScript"
});

test("ContextSystem - Export and import", () => {
  const contextSystem = new ContextSystem();
  
  contextSystem.addItem({
    id: "item1",
    content: "Test content 1",
    metadata: { category: "test" }
  });
  
  contextSystem.addItem({
    id: "item2",
    content: "Test content 2",
    metadata: { category: "test" }
  });
  
  const exported = contextSystem.export();
  expect(exported).toBeDefined();
  
  const parsed = JSON.parse(exported);
  expect(parsed.items).toHaveLength(2);
  expect(parsed.exportDate).toBeDefined();
  
  // Create new system and import
  const newSystem = new ContextSystem();
  newSystem.import(exported);
  
  expect(newSystem.getAll()).toHaveLength(2);
  expect(newSystem.getAll()[0].content).toBe("Test content 1");
  expect(newSystem.getAll()[1].content).toBe("Test content 2");
});

test("ContextSystem - Import invalid JSON", () => {
  const contextSystem = new ContextSystem();
  
  expect(() => contextSystem.import("invalid json")).toThrow("Invalid JSON data provided");
});

test("ContextSystem - Word indexing", () => {
  const contextSystem = new ContextSystem();
  
  contextSystem.addItem({
    id: "item1",
    content: "The quick brown fox jumps over the lazy dog"
  });
  
  contextSystem.addItem({
    id: "item2",
    content: "A quick test case"
  });
  
  // Query for words that should match
  const query1: ContextQuery = {
    text: "quick",
    limit: 10
  };
  
  const result1 = contextSystem.query(query1);
  expect(result1.items).toHaveLength(2); // Both contain "quick"
  
  // Query for word that appears only in one
  const query2: ContextQuery = {
    text: "brown",
    limit: 10
  };
  
  const result2 = contextSystem.query(query2);
  expect(result2.items).toHaveLength(1);
  expect(result2.items[0].id).toBe("item1");
  
  // Query for multiple words
  const query3: ContextQuery = {
    text: "quick test",
    limit: 10
  };
  
  const result3 = contextSystem.query(query3);
  expect(result3.items).toHaveLength(1); // Only item2 has both words
  expect(result3.items[0].id).toBe("item2");
});

test("ContextSystem - Ignore short words in index", () => {
  const contextSystem = new ContextSystem();
  
  contextSystem.addItem({
    id: "item1",
    content: "A test of the indexing system"
  });
  
  // Query with very short words should still work on content match
  const query: ContextQuery = {
    text: "A of the",
    limit: 10
  };
  
  const result = contextSystem.query(query);
  expect(result.items).toHaveLength(1); // Should match content directly
});

test("ContextSystem - Timestamp influence on scoring", () => {
  const contextSystem = new ContextSystem();
  const oldTime = Date.now() - (1000 * 60 * 60 * 24); // 24 hours ago
  const newTime = Date.now();
  
  contextSystem.addItem({
    id: "old",
    content: "JavaScript programming",
    timestamp: oldTime
  });
  
  contextSystem.addItem({
    id: "new",
    content: "JavaScript programming",
    timestamp: newTime
  });
  
  const query: ContextQuery = {
    text: "JavaScript programming",
    limit: 10
  };
  
  const result = contextSystem.query(query);
  
  // Newer item should come first due to timestamp bonus
  expect(result.items[0].id).toBe("new");
  expect(result.items[1].id).toBe("old");
});

test("ContextSystem - Empty query results", () => {
  const contextSystem = new ContextSystem();
  
  contextSystem.addItem({
    id: "item1",
    content: "Test content"
  });
  
  const query: ContextQuery = {
    text: "nonexistent content",
    limit: 10
  };
  
  const result = contextSystem.query(query);
  
  expect(result.items).toHaveLength(0);
  expect(result.score).toBe(0);
});

test("ContextSystem - Query with no filters", () => {
  const contextSystem = new ContextSystem();
  
  contextSystem.addItem({
    id: "item1",
    content: "Content with metadata",
    metadata: { type: "tutorial" }
  });
  
  const query: ContextQuery = {
    text: "content",
    limit: 10
  };
  
  const result = contextSystem.query(query);
  
  expect(result.items).toHaveLength(1);
});

test("ContextSystem - Items without metadata", () => {
  const contextSystem = new ContextSystem();
  
  contextSystem.addItem({
    id: "item1",
    content: "Content without metadata"
  });
  
  const query: ContextQuery = {
    text: "content",
    limit: 10
  };
  
  const result = contextSystem.query(query);
  
  expect(result.items).toHaveLength(1);
});

test("ContextSystem - Query with filters on item without metadata", () => {
  const contextSystem = new ContextSystem();
  
  contextSystem.addItem({
    id: "item1",
    content: "Content without metadata"
  });
  
  const query: ContextQuery = {
    text: "content",
    limit: 10,
    filters: { type: "tutorial" }
  };
  
  const result = contextSystem.query(query);
  
  expect(result.items).toHaveLength(0); // Should be filtered out
});