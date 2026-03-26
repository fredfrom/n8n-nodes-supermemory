import type { INodeProperties } from 'n8n-workflow';

const resource = 'search';

export const searchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: [resource] },
		},
		options: [
			{
				name: 'Search Documents',
				value: 'searchDocuments',
				action: 'Search documents',
				description: 'Search across documents (RAG)',
			},
			{
				name: 'Search Memories',
				value: 'searchMemories',
				action: 'Search memory entries',
				description: 'Search across memory entries',
			},
		],
		default: 'searchDocuments',
	},
];

export const searchFields: INodeProperties[] = [
	// ----------------------------------
	//         search:searchDocuments
	// ----------------------------------
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		typeOptions: { rows: 2 },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['searchDocuments'] },
		},
		description: 'The search query text',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: [resource], operation: ['searchDocuments'] },
		},
		options: [
			{
				displayName: 'Chunk Threshold',
				name: 'chunkThreshold',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 },
				default: 0.5,
				description:
					'Sensitivity for chunk selection (0 = least sensitive/more results, 1 = most sensitive)',
			},
			{
				displayName: 'Container Tags',
				name: 'containerTags',
				type: 'string',
				default: '',
				description: 'Comma-separated container tags to filter by',
			},
			{
				displayName: 'Document ID',
				name: 'docId',
				type: 'string',
				default: '',
				description: 'Search within a specific document',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'json',
				default: '{}',
				description: 'Metadata filters as JSON (supports AND/OR logic)',
			},
			{
				displayName: 'Include Full Documents',
				name: 'includeFullDocs',
				type: 'boolean',
				default: false,
				description: 'Whether to include full document content in results',
			},
			{
				displayName: 'Include Summary',
				name: 'includeSummary',
				type: 'boolean',
				default: false,
				description: 'Whether to include document summaries in results',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 100 },
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Only Matching Chunks',
				name: 'onlyMatchingChunks',
				type: 'boolean',
				default: true,
				description:
					'Whether to only return matching chunks (false = include surrounding context)',
			},
			{
				displayName: 'Rerank',
				name: 'rerank',
				type: 'boolean',
				default: false,
				description: 'Whether to rerank results by relevance',
			},
			{
				displayName: 'Rewrite Query',
				name: 'rewriteQuery',
				type: 'boolean',
				default: false,
				description: 'Whether to rewrite query for better matching (adds ~400ms latency)',
			},
		],
	},

	// ----------------------------------
	//         search:searchMemories
	// ----------------------------------
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		typeOptions: { rows: 2 },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['searchMemories'] },
		},
		description: 'The search query text',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: [resource], operation: ['searchMemories'] },
		},
		options: [
			{
				displayName: 'Container Tag',
				name: 'containerTag',
				type: 'string',
				default: '',
				description: 'Optional container tag to scope the search',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'json',
				default: '{}',
				description: 'Metadata filters as JSON (supports AND/OR logic)',
			},
			{
				displayName: 'Include Documents',
				name: 'includeDocuments',
				type: 'boolean',
				default: false,
				description: 'Whether to include associated documents in results',
			},
			{
				displayName: 'Include Forgotten Memories',
				name: 'includeForgottenMemories',
				type: 'boolean',
				default: false,
				description: 'Whether to include forgotten memories in results',
			},
			{
				displayName: 'Include Related Memories',
				name: 'includeRelatedMemories',
				type: 'boolean',
				default: false,
				description: 'Whether to include related memories for context',
			},
			{
				displayName: 'Include Summaries',
				name: 'includeSummaries',
				type: 'boolean',
				default: false,
				description: 'Whether to include document summaries in results',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 100 },
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Rerank',
				name: 'rerank',
				type: 'boolean',
				default: false,
				description: 'Whether to rerank results by relevance',
			},
			{
				displayName: 'Rewrite Query',
				name: 'rewriteQuery',
				type: 'boolean',
				default: false,
				description: 'Whether to rewrite query for better matching (adds ~400ms latency)',
			},
			{
				displayName: 'Search Mode',
				name: 'searchMode',
				type: 'options',
				options: [
					{ name: 'Documents', value: 'documents' },
					{ name: 'Hybrid', value: 'hybrid' },
					{ name: 'Memories', value: 'memories' },
				],
				default: 'memories',
				description: 'Search scope — memories only, documents only, or hybrid',
			},
			{
				displayName: 'Threshold',
				name: 'threshold',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 },
				default: 0.6,
				description:
					'Sensitivity for memory selection (0 = least sensitive/more results, 1 = most sensitive)',
			},
		],
	},
];
