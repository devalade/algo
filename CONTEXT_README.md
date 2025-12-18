# Context System

A powerful TypeScript context management system for storing, indexing, and searching text-based context with support for namespaces, metadata filtering, and persistence.

## Features

- **Full-text search** with word-level indexing
- **Namespace isolation** for organizing different contexts
- **Metadata filtering** for precise queries
- **Relevance scoring** based on content match and recency
- **Import/Export** functionality for persistence
- **TypeScript support** with full type safety

## Quick Start

```typescript
import { ContextManager, MultiNamespaceContext } from './src/context-manager.js';

// Create a multi-namespace context manager
const multiContext = new MultiNamespaceContext();

// Get a specific namespace
const workContext = multiContext.getNamespace('work');

// Add context items
workContext.addContext('project1', 'Working on TypeScript application', {
  priority: 'high',
  tags: ['typescript', 'coding']
});

// Search within a namespace
const results = workContext.search('typescript', 5);

// Search across all namespaces
const allResults = multiContext.searchAll('project', 10);
```

## API Reference

### ContextManager

Manages context within a single namespace.

#### Methods

- `addContext(id: string, content: string, metadata?: Record<string, any>)` - Add a context item
- `search(query: string, limit?: number, filters?: Record<string, any>)` - Search context
- `removeContext(id: string)` - Remove a context item
- `clearNamespace()` - Clear all items in the namespace
- `getAllContext()` - Get all context items in the namespace

### MultiNamespaceContext

Manages multiple context namespaces.

#### Methods

- `getNamespace(name: string)` - Get or create a namespace
- `searchAll(query: string, limit?: number)` - Search across all namespaces
- `getAllNamespaces()` - Get list of all namespace names
- `exportAll()` - Export all contexts to JSON
- `importAll(jsonData: string)` - Import contexts from JSON

## Running the Demo

```bash
bun run demo.ts
```

This will demonstrate the core functionality with sample data across multiple namespaces.