# n8n-nodes-supermemory

[![npm version](https://img.shields.io/npm/v/n8n-nodes-supermemory.svg)](https://www.npmjs.com/package/n8n-nodes-supermemory)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![n8n community node](https://img.shields.io/badge/n8n-community%20node-ff6d5a)](https://docs.n8n.io/integrations/community-nodes/)
[![Supermemory](https://img.shields.io/badge/Supermemory-API-6C5CE7)](https://supermemory.ai)

Give your n8n AI agents **persistent, semantic memory** with [Supermemory](https://supermemory.ai). This package includes two nodes:

- **Supermemory Memory** — plugs into an AI Agent's memory slot so it remembers users across conversations
- **Supermemory** — 22 workflow operations for memories, documents, search, containers, conversations, and profiles (also usable as an AI Agent tool)

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [n8n community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-supermemory`
4. Agree to the risks and select **Install**

## Credentials

1. Get a free API key at [console.supermemory.ai](https://console.supermemory.ai)
2. In n8n, go to **Credentials > New Credential**
3. Search for **Supermemory API**
4. Enter your API key
5. (Optional) Change the **Base URL** for self-hosted instances

---

## AI Agent Memory

The **Supermemory Memory** node gives any n8n AI Agent long-term, semantic memory. Unlike buffer memory that stores raw chat history, Supermemory automatically extracts and organizes what matters — the agent gets a compiled user profile with permanent facts and recent context.

**How it works:**
- **On each turn:** the conversation is sent to Supermemory, which extracts memories automatically
- **Before each response:** the agent receives the user's profile (static facts like name/preferences + dynamic context like recent topics)
- **Across sessions:** memories persist — the agent remembers the user next time

**Setup:**
1. Add an **AI Agent** node
2. Connect a **Supermemory Memory** node to its **Memory** input
3. Set **Container Tag** to a user identifier (e.g., `{{ $json.userId }}`)
4. Set **Session ID** to a conversation identifier (defaults to execution ID)

That's it. The agent now has persistent memory.

## AI Agent Tool

The main **Supermemory** node is also marked as `usableAsTool`, meaning you can connect it to an AI Agent's **Tool** input. This lets the agent explicitly decide when to store memories, search knowledge, or look up a user profile — useful when you want the agent to have more control over when and how it uses memory.

---

## Workflow Node Operations

The **Supermemory** node can also be used as a regular workflow node with 22 operations:

### Memory

| Operation | Description |
|-----------|-------------|
| Create | Create memory entries with optional static flag, expiry, and temporal context |
| Delete | Forget a memory entry by ID or content match |
| Get Many | List memory entries with pagination, sorting, and filters |
| Search | Search memories with threshold, search mode (memories/hybrid/documents), reranking |
| Update | Update a memory (creates a new version with full history) |

**Example — Store a user preference:**
1. Set Resource to **Memory**, Operation to **Create**
2. Set Container Tag to `user-123`
3. Set Content to `"User prefers dark mode and metric units"`

### Document

| Operation | Description |
|-----------|-------------|
| Add | Add content by URL or text |
| Batch Add | Add up to 600 documents at once |
| Bulk Delete | Delete multiple documents by IDs |
| Delete | Delete a single document by ID |
| Get | Retrieve a document by ID |
| Get Chunks | Get processed chunks of a document |
| Get Many | List documents with pagination, sorting, and filters |
| Get Processing | Get documents currently being processed |
| Update | Update an existing document |
| Upload File | Upload and process a binary file |

**Example — Index a webpage:**
1. Set Resource to **Document**, Operation to **Add**
2. Set Content to `https://example.com/article`

### Container

| Operation | Description |
|-----------|-------------|
| Delete | Delete a container tag and all its contents |
| Get Settings | Get settings for a container tag |
| Merge | Merge two container tags into a target |
| Update Settings | Update the entity context prompt |

### Search

| Operation | Description |
|-----------|-------------|
| Search Documents | Semantic search (RAG) with chunk threshold, reranking, query rewriting |
| Search Memories | Search memory entries with mode, threshold, and include options |

### Conversation

| Operation | Description |
|-----------|-------------|
| Ingest | Send a conversation for automatic memory extraction |

### Profile

| Operation | Description |
|-----------|-------------|
| Get | Get a compiled user profile with static and dynamic memories |

## Compatibility

- Requires n8n version 1.0 or later
- Tested with Supermemory API v3/v4

## License

[MIT](LICENSE.md)
