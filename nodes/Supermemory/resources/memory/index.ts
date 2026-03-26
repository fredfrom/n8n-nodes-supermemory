import type { INodeProperties } from 'n8n-workflow';

const resource = 'memory';

export const memoryOperations: INodeProperties[] = [
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
				name: 'Create',
				value: 'create',
				action: 'Create memories',
				description: 'Create one or more memory entries',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a memory',
				description: 'Forget a memory entry',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List memory entries',
				description: 'List memory entries with history',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search memory entries',
				description: 'Search across memory entries',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a memory',
				description: 'Update a memory entry (creates a new version)',
			},
		],
		default: 'create',
	},
];

export const memoryFields: INodeProperties[] = [
	// ----------------------------------
	//         memory:create
	// ----------------------------------
	{
		displayName: 'Container Tag',
		name: 'containerTag',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['create'] },
		},
		description: 'The space/container identifier (e.g. user ID, project ID)',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['create'] },
		},
		description: 'The memory text (1-10,000 characters). Should be entity-centric.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: [resource], operation: ['create'] },
		},
		options: [
			{
				displayName: 'Forget After',
				name: 'forgetAfter',
				type: 'dateTime',
				default: '',
				description: 'ISO 8601 datetime after which this memory will be auto-forgotten',
			},
			{
				displayName: 'Forget Reason',
				name: 'forgetReason',
				type: 'string',
				default: '',
				description: 'Reason for scheduling the memory to be forgotten',
			},
			{
				displayName: 'Is Static',
				name: 'isStatic',
				type: 'boolean',
				default: false,
				description: 'Whether this memory is a permanent trait that should not be overwritten',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Additional metadata as JSON key-value pairs',
			},
			{
				displayName: 'Temporal Context',
				name: 'temporalContext',
				type: 'json',
				default: '{}',
				description:
					'Temporal metadata as JSON (e.g. {"documentDate": "2024-01-01", "eventDate": "2024-06-15"})',
			},
		],
	},

	// ----------------------------------
	//         memory:delete
	// ----------------------------------
	{
		displayName: 'Container Tag',
		name: 'containerTag',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['delete'] },
		},
		description: 'The space/container identifier to scope the operation',
	},
	{
		displayName: 'Identify By',
		name: 'identifyBy',
		type: 'options',
		options: [
			{ name: 'Content Match', value: 'content' },
			{ name: 'Memory ID', value: 'id' },
		],
		default: 'id',
		displayOptions: {
			show: { resource: [resource], operation: ['delete'] },
		},
		description: 'How to identify the memory to delete',
	},
	{
		displayName: 'Memory ID',
		name: 'memoryId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['delete'], identifyBy: ['id'] },
		},
		description: 'The memory entry identifier (e.g. mem_abc123)',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: { rows: 2 },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['delete'], identifyBy: ['content'] },
		},
		description: 'Exact content match of the memory to delete',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: [resource], operation: ['delete'] },
		},
		options: [
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				description: 'Reason for forgetting the memory',
			},
		],
	},

	// ----------------------------------
	//         memory:getAll
	// ----------------------------------
	{
		displayName: 'Container Tags',
		name: 'containerTags',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['getAll'] },
		},
		description: 'Comma-separated container tags to filter by',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: [resource], operation: ['getAll'] },
		},
		options: [
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'json',
				default: '{}',
				description: 'Metadata filters as JSON (supports AND/OR logic)',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				default: 'desc',
				description: 'Sort order',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1,
				description: 'Page number for pagination',
			},
			{
				displayName: 'Sort By',
				name: 'sort',
				type: 'options',
				options: [
					{ name: 'Created At', value: 'createdAt' },
					{ name: 'Updated At', value: 'updatedAt' },
				],
				default: 'createdAt',
				description: 'Field to sort by',
			},
		],
	},

	// ----------------------------------
	//         memory:search
	// ----------------------------------
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		typeOptions: { rows: 2 },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['search'] },
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
			show: { resource: [resource], operation: ['search'] },
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
				description: 'Sensitivity for memory selection (0 = least sensitive, 1 = most sensitive)',
			},
		],
	},

	// ----------------------------------
	//         memory:update
	// ----------------------------------
	{
		displayName: 'Container Tag',
		name: 'containerTag',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['update'] },
		},
		description: 'The space/container identifier to scope the operation',
	},
	{
		displayName: 'Identify By',
		name: 'identifyBy',
		type: 'options',
		options: [
			{ name: 'Content Match', value: 'content' },
			{ name: 'Memory ID', value: 'id' },
		],
		default: 'id',
		displayOptions: {
			show: { resource: [resource], operation: ['update'] },
		},
		description: 'How to identify the memory to update',
	},
	{
		displayName: 'Memory ID',
		name: 'memoryId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['update'], identifyBy: ['id'] },
		},
		description: 'The memory entry identifier (e.g. mem_abc123)',
	},
	{
		displayName: 'Existing Content',
		name: 'existingContent',
		type: 'string',
		typeOptions: { rows: 2 },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['update'], identifyBy: ['content'] },
		},
		description: 'Exact content match of the existing memory',
	},
	{
		displayName: 'New Content',
		name: 'newContent',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['update'] },
		},
		description: 'The new content that will replace the existing memory',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: [resource], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Forget After',
				name: 'forgetAfter',
				type: 'dateTime',
				default: '',
				description: 'ISO 8601 datetime after which this memory will be auto-forgotten. Leave empty to clear.',
			},
			{
				displayName: 'Forget Reason',
				name: 'forgetReason',
				type: 'string',
				default: '',
				description: 'Reason for scheduling the memory to be forgotten',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Custom key-value pairs (inherits from previous version if omitted)',
			},
			{
				displayName: 'Temporal Context',
				name: 'temporalContext',
				type: 'json',
				default: '{}',
				description: 'Temporal metadata as JSON (e.g. {"documentDate": "2024-01-01"})',
			},
		],
	},
];
