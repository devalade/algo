import { test, expect } from "bun:test";
import { ContextManager, MultiNamespaceContext } from "../src/context-manager";

test("ContextManager - Add and search context", () => {
  const contextManager = new ContextManager("test");
  
  contextManager.addContext("item1", "Test content about programming", { category: "tutorial" });
  contextManager.addContext("item2", "JavaScript programming guide", { category: "guide" });
  
  const results = contextManager.search("programming", 10);
  
  expect(results.items).toHaveLength(2);
  expect(results.items.every(item => item.content.includes("programming"))).toBe(true);
  expect(results.items.every(item => item.id.startsWith("test:"))).toBe(true);
});

test("ContextManager - Remove context", () => {
  const contextManager = new ContextManager("test");
  
  contextManager.addContext("item1", "Content to remove");
  contextManager.addContext("item2", "Content to keep");
  
  expect(contextManager.getAllContext()).toHaveLength(2);
  
  const removed = contextManager.removeContext("item1");
  expect(removed).toBe(true);
  
  const remaining = contextManager.getAllContext();
  expect(remaining).toHaveLength(1);
  expect(remaining[0].id).toBe("test:item2");
});

test("ContextManager - Clear namespace", () => {
  const contextManager = new ContextManager("test");
  
  contextManager.addContext("item1", "Content 1");
  contextManager.addContext("item2", "Content 2");
  
  expect(contextManager.getAllContext()).toHaveLength(2);
  
  contextManager.clearNamespace();
  
  expect(contextManager.getAllContext()).toHaveLength(0);
});

test("ContextManager - Get context by ID", () => {
  const contextManager = new ContextManager("test");
  
  contextManager.addContext("item1", "Test content", { version: 1 });
  
  const retrieved = contextManager.getContextById("item1");
  
  expect(retrieved).toBeDefined();
  expect(retrieved?.id).toBe("test:item1");
  expect(retrieved?.content).toBe("Test content");
  expect(retrieved?.metadata?.version).toBe(1);
  
  const notFound = contextManager.getContextById("nonexistent");
  expect(notFound).toBeUndefined();
});

test("ContextManager - Search with filters", () => {
  const contextManager = new ContextManager("test");
  
  contextManager.addContext("item1", "JavaScript tutorial", { type: "tutorial", difficulty: "beginner" });
  contextManager.addContext("item2", "Python tutorial", { type: "tutorial", difficulty: "advanced" });
  contextManager.addContext("item3", "JavaScript guide", { type: "guide", difficulty: "intermediate" });
  
  const tutorialResults = contextManager.search("JavaScript", 10, { type: "tutorial" });
  
  expect(tutorialResults.items).toHaveLength(1);
  expect(tutorialResults.items[0].id).toBe("test:item1");
  
  const guideResults = contextManager.search("JavaScript", 10, { type: "guide" });
  
  expect(guideResults.items).toHaveLength(1);
  expect(guideResults.items[0].id).toBe("test:item3");
});

test("ContextManager - Export and import", () => {
  const contextManager1 = new ContextManager("test");
  
  contextManager1.addContext("item1", "Content 1", { version: 1 });
  contextManager1.addContext("item2", "Content 2", { version: 2 });
  
  const exported = contextManager1.export();
  expect(exported).toBeDefined();
  
  const contextManager2 = new ContextManager("test");
  contextManager2.import(exported);
  
  const importedItems = contextManager2.getAllContext();
  expect(importedItems).toHaveLength(2);
  expect(importedItems[0].content).toBe("Content 1");
  expect(importedItems[1].content).toBe("Content 2");
});

test("MultiNamespaceContext - Get and create namespaces", () => {
  const multiContext = new MultiNamespaceContext();
  
  const namespace1 = multiContext.getNamespace("tutorial");
  const namespace2 = multiContext.getNamespace("guide");
  const namespace1Again = multiContext.getNamespace("tutorial");
  
  expect(namespace1).toBeDefined();
  expect(namespace2).toBeDefined();
  expect(namespace1Again).toBe(namespace1); // Should be the same instance
  expect(namespace1Again).not.toBe(namespace2); // Different instances
});

test("MultiNamespaceContext - Add context to multiple namespaces", () => {
  const multiContext = new MultiNamespaceContext();
  
  const tutorialNamespace = multiContext.getNamespace("tutorial");
  const guideNamespace = multiContext.getNamespace("guide");
  
  tutorialNamespace.addContext("item1", "JavaScript tutorial", { level: "beginner" });
  guideNamespace.addContext("item1", "JavaScript guide", { level: "advanced" });
  
  const tutorialItems = tutorialNamespace.getAllContext();
  const guideItems = guideNamespace.getAllContext();
  
  expect(tutorialItems).toHaveLength(1);
  expect(guideItems).toHaveLength(1);
  expect(tutorialItems[0].id).toBe("tutorial:item1");
  expect(guideItems[0].id).toBe("guide:item1");
});

test("MultiNamespaceContext - Search across all namespaces", () => {
  const multiContext = new MultiNamespaceContext();
  
  const tutorialNamespace = multiContext.getNamespace("tutorial");
  const guideNamespace = multiContext.getNamespace("guide");
  
  tutorialNamespace.addContext("item1", "JavaScript tutorial basics");
  tutorialNamespace.addContext("item2", "Python tutorial basics");
  guideNamespace.addContext("item1", "JavaScript guide advanced");
  guideNamespace.addContext("item3", "JavaScript reference");
  
  const results = multiContext.searchAll("JavaScript", 10);
  
  expect(results.items).toHaveLength(3); // Should find all JavaScript-related items
  expect(results.totalFound).toBe(3);
  expect(results.query).toBe("JavaScript");
  
  // Check that items are from different namespaces
  const namespaces = results.items.map(item => item.id.split(':')[0]);
  expect(namespaces).toContain("tutorial");
  expect(namespaces).toContain("guide");
});

test("MultiNamespaceContext - Search with limit", () => {
  const multiContext = new MultiNamespaceContext();
  
  const tutorialNamespace = multiContext.getNamespace("tutorial");
  const guideNamespace = multiContext.getNamespace("guide");
  
  tutorialNamespace.addContext("item1", "JavaScript tutorial");
  tutorialNamespace.addContext("item2", "Python tutorial");
  guideNamespace.addContext("item1", "JavaScript guide");
  guideNamespace.addContext("item3", "JavaScript reference");
  
  const limitedResults = multiContext.searchAll("JavaScript", 2);
  
  expect(limitedResults.items).toHaveLength(2);
  expect(limitedResults.totalFound).toBe(3); // Total found should still be 3
});

test("MultiNamespaceContext - Relevance scoring", () => {
  const multiContext = new MultiNamespaceContext();
  
  const tutorialNamespace = multiContext.getNamespace("tutorial");
  
  // Add items with different relevance to "JavaScript programming"
  tutorialNamespace.addContext("exact", "JavaScript programming tutorial");
  tutorialNamespace.addContext("partial", "JavaScript programming guide");
  tutorialNamespace.addContext("multiple", "JavaScript programming reference");
  
  const results = multiContext.searchAll("JavaScript programming", 10);
  
  expect(results.items).toHaveLength(3);
  
  // Items with more complete matches should come first
  expect((results.items[0] as any).id).toBe("tutorial:exact"); // Exact phrase match
  expect((results.items[1] as any).id).toBe("tutorial:multiple"); // Both words
  expect(results.items[2].id).toBe("tutorial:partial"); // Only one word
});

test("MultiNamespaceContext - Get all namespaces", () => {
  const multiContext = new MultiNamespaceContext();
  
  expect(multiContext.getAllNamespaces()).toHaveLength(0);
  
  multiContext.getNamespace("tutorial");
  multiContext.getNamespace("guide");
  multiContext.getNamespace("reference");
  
  const namespaces = multiContext.getAllNamespaces();
  expect(namespaces).toHaveLength(3);
  expect(namespaces).toContain("tutorial");
  expect(namespaces).toContain("guide");
  expect(namespaces).toContain("reference");
});

test("MultiNamespaceContext - Export all namespaces", () => {
  const multiContext = new MultiNamespaceContext();
  
  const tutorialNamespace = multiContext.getNamespace("tutorial");
  const guideNamespace = multiContext.getNamespace("guide");
  
  tutorialNamespace.addContext("item1", "Tutorial content", { version: 1 });
  guideNamespace.addContext("item1", "Guide content", { version: 2 });
  
  const exported = multiContext.exportAll();
  const parsed = JSON.parse(exported);
  
  expect(parsed.namespaces).toBeDefined();
  expect(parsed.namespaces.tutorial).toBeDefined();
  expect(parsed.namespaces.guide).toBeDefined();
  expect(parsed.exportDate).toBeDefined();
  
  expect(parsed.namespaces.tutorial.items).toHaveLength(1);
  expect(parsed.namespaces.guide.items).toHaveLength(1);
});

test("MultiNamespaceContext - Import all namespaces", () => {
  const multiContext1 = new MultiNamespaceContext();
  
  const tutorialNamespace = multiContext1.getNamespace("tutorial");
  const guideNamespace = multiContext1.getNamespace("guide");
  
  tutorialNamespace.addContext("item1", "Tutorial content");
  guideNamespace.addContext("item1", "Guide content");
  
  const exported = multiContext1.exportAll();
  
  const multiContext2 = new MultiNamespaceContext();
  multiContext2.importAll(exported);
  
  expect(multiContext2.getAllNamespaces()).toHaveLength(2);
  expect(multiContext2.getAllNamespaces()).toContain("tutorial");
  expect(multiContext2.getAllNamespaces()).toContain("guide");
  
  const importedTutorial = multiContext2.getNamespace("tutorial");
  const importedGuide = multiContext2.getNamespace("guide");
  
  expect(importedTutorial.getAllContext()).toHaveLength(1);
  expect(importedGuide.getAllContext()).toHaveLength(1);
  expect(importedTutorial.getAllContext()[0].content).toBe("Tutorial content");
  expect(importedGuide.getAllContext()[0].content).toBe("Guide content");
});

test("MultiNamespaceContext - Import invalid JSON", () => {
  const multiContext = new MultiNamespaceContext();
  
  expect(() => multiContext.importAll("invalid json")).toThrow("Invalid JSON data provided");
});

test("MultiNamespaceContext - Import JSON without namespaces", () => {
  const multiContext = new MultiNamespaceContext();
  
  const invalidData = JSON.stringify({ exportDate: new Date().toISOString() });
  
  // Should not throw, but should not create any namespaces
  multiContext.importAll(invalidData);
  expect(multiContext.getAllNamespaces()).toHaveLength(0);
});

test("ContextManager - Namespace isolation", () => {
  const manager1 = new ContextManager("namespace1");
  const manager2 = new ContextManager("namespace2");
  
  manager1.addContext("item1", "Content in namespace 1");
  manager2.addContext("item1", "Content in namespace 2");
  
  const results1 = manager1.search("Content", 10);
  const results2 = manager2.search("Content", 10);
  
  expect(results1.items).toHaveLength(1);
  expect(results2.items).toHaveLength(1);
  expect(results1.items[0].id).toBe("namespace1:item1");
  expect(results2.items[0].id).toBe("namespace2:item1");
  
  expect(results1.items[0].content).toBe("Content in namespace 1");
  expect(results2.items[0].content).toBe("Content in namespace 2");
});

test("ContextManager - Search with limit and filters", () => {
  const contextManager = new ContextManager("test");
  
  contextManager.addContext("item1", "JavaScript tutorial", { type: "tutorial", level: "beginner" });
  contextManager.addContext("item2", "JavaScript guide", { type: "guide", level: "intermediate" });
  contextManager.addContext("item3", "JavaScript tutorial", { type: "tutorial", level: "advanced" });
  
  const results = contextManager.search("JavaScript", 2, { type: "tutorial" });
  
  expect(results.items).toHaveLength(2);
  expect(results.items.every(item => item.metadata?.type === "tutorial")).toBe(true);
  expect(results.items.every(item => item.content.includes("JavaScript"))).toBe(true);
});