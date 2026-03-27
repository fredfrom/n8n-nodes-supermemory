# n8n-nodes-supermemory

[![npm version](https://img.shields.io/npm/v/n8n-nodes-supermemory.svg)](https://www.npmjs.com/package/n8n-nodes-supermemory)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![n8n community node](https://img.shields.io/badge/n8n-community%20node-ff6d5a)](https://docs.n8n.io/integrations/community-nodes/)
[![Supermemory](https://img.shields.io/badge/Supermemory-API-6C5CE7)](https://supermemory.ai)

This is an [n8n](https://n8n.io/) community node that integrates the [Supermemory](https://supermemory.ai) API into your workflows. Supermemory provides AI-powered memory, knowledge management, and semantic search — enabling your automations to remember user context, ingest documents, search across knowledge bases, and build user profiles.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

**22 operations** across 6 resources, plus an **AI Agent Memory** node for semantic memory-backed agents.

## Installation

Follow the [n8n community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

In your n8n instance:

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-supermemory`
4. Agree to the risks and select **Install**

## Credentials

1. Sign up for a free API key at [console.supermemory.ai](https://console.supermemory.ai)
2. In n8n, go to **Credentials > New Credential**
3. Search for **Supermemory API**
4. Enter your API key
5. (Optional) Change the **Base URL** if you are running a self-hosted Supermemory instance

## Resources

The Supermemory node supports the following resources and operations:

### Memory

Manage AI-extracted memory entries (semantic understanding of user context).

| Operation | Description |
|-----------|-------------|
| Create | Create memory entries with optional static flag, expiry, and temporal context |
| Delete | Forget a memory entry by ID or content match |
| Get Many | List memory entries with pagination, sorting, and filters |
| Search | Search memories with threshold, search mode (memories/hybrid/documents), reranking |
| Update | Update a memory (creates a new version with full history) |

**Example — Store a user preference:**
1. Add a **Supermemory** node
2. Set Resource to **Memory**, Operation to **Create**
3. Set Container Tag to a user identifier (e.g., `user-123`)
4. Set Content to `"User prefers dark mode and metric units"`
5. Optionally mark as **Is Static** for permanent traits

### Document

Add, retrieve, and manage documents (URLs, text, PDFs, files).

| Operation | Description |
|-----------|-------------|
| Add | Add content by URL or text |
| Batch Add | Add up to 600 documents at once |
| Bulk Delete | Delete multiple documents by IDs |
| Delete | Delete a single document by ID |
| Get | Retrieve a document by ID |
| Get Chunks | Get processed chunks of a document |
| Get Many | List documents with pagination, sorting, content inclusion, and filters |
| Get Processing | Get documents currently being processed |
| Update | Update an existing document |
| Upload File | Upload and process a binary file |

**Example — Index a webpage:**
1. Add a **Supermemory** node
2. Set Resource to **Document**, Operation to **Add**
3. Set Content to a URL like `https://example.com/article`
4. Add a Container Tag in Additional Fields to organize it

### Container

Manage container tags (spaces/user scopes).

| Operation | Description |
|-----------|-------------|
| Delete | Delete a container tag and all its contents |
| Get Settings | Get settings for a container tag |
| Merge | Merge two container tags into a target |
| Update Settings | Update the entity context prompt for a container |

**Example — Set processing context:**
1. Add a **Supermemory** node
2. Set Resource to **Container**, Operation to **Update Settings**
3. Set Container Tag to `project-alpha`
4. Set Entity Context to `"This container holds technical documentation for Project Alpha"`

### Search

Search across documents and memories with full control over results.

| Operation | Description |
|-----------|-------------|
| Search Documents | Semantic search (RAG) with chunk threshold, reranking, query rewriting |
| Search Memories | Search memory entries with search mode, include options, and threshold |

**Example — Semantic search:**
1. Add a **Supermemory** node
2. Set Resource to **Search**, Operation to **Search Documents**
3. Set Query to `"How do I configure authentication?"`
4. Optionally enable **Rerank** and **Include Summary** in Additional Fields

### Conversation

Ingest conversations for automatic memory extraction.

| Operation | Description |
|-----------|-------------|
| Ingest | Send a conversation (messages array) for memory extraction |

**Example — Ingest a chat:**
1. Add a **Supermemory** node
2. Set Resource to **Conversation**, Operation to **Ingest**
3. Set Conversation ID to a unique identifier
4. Set Messages to a JSON array of `{ "role": "user", "content": "..." }` objects
5. Add Container Tags to associate the conversation with a user

### Profile

Get compiled user profiles from memories.

| Operation | Description |
|-----------|-------------|
| Get | Get a user profile with static/dynamic memories and optional search |

**Example — Retrieve a user profile:**
1. Add a **Supermemory** node
2. Set Resource to **Profile**, Operation to **Get**
3. Set Container Tag to the user identifier
4. Optionally add a Query in Additional Fields to include relevant search results

### AI Agent Memory

This package also includes a **Supermemory Memory** node that plugs into n8n's AI Agent as a memory backend.

Unlike simple buffer memory, Supermemory extracts semantic memories from conversations — the agent gets a summarized user profile (static facts + dynamic context) rather than raw chat history.

**Setup:**
1. Add an **AI Agent** node to your workflow
2. Connect a **Supermemory Memory** node to the Agent's **Memory** input
3. Set the **Container Tag** to a user identifier
4. The agent will automatically store conversations and recall relevant context

## Compatibility

- Requires n8n version 1.0 or later
- Tested with Supermemory API v3/v4

## License

[MIT](LICENSE.md)
