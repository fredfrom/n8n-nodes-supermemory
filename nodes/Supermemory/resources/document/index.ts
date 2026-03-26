import type { INodeProperties } from 'n8n-workflow';

const resource = 'document';

export const documentOperations: INodeProperties[] = [
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
				name: 'Add',
				value: 'add',
				action: 'Add a document',
				description: 'Add content by URL or text',
			},
			{
				name: 'Batch Add',
				value: 'batchAdd',
				action: 'Batch add documents',
				description: 'Add multiple documents at once (up to 600)',
			},
			{
				name: 'Bulk Delete',
				value: 'bulkDelete',
				action: 'Bulk delete documents',
				description: 'Delete multiple documents by IDs',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a document',
				description: 'Delete a document by ID or custom ID',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a document',
				description: 'Retrieve a document by ID',
			},
			{
				name: 'Get Chunks',
				value: 'getChunks',
				action: 'Get document chunks',
				description: 'Get the chunks of a processed document',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List documents',
				description: 'List documents with pagination',
			},
			{
				name: 'Get Processing',
				value: 'getProcessing',
				action: 'Get processing documents',
				description: 'Get documents currently being processed',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a document',
				description: 'Update an existing document',
			},
			{
				name: 'Upload File',
				value: 'uploadFile',
				action: 'Upload a file',
				description: 'Upload and process a file',
			},
		],
		default: 'add',
	},
];

export const documentFields: INodeProperties[] = [
	// ----------------------------------
	//         document:add
	// ----------------------------------
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['add'] },
		},
		description: 'The content to process — can be a URL, text, or any supported content type',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: [resource], operation: ['add'] },
		},
		options: [
			{
				displayName: 'Container Tag',
				name: 'containerTag',
				type: 'string',
				default: '',
				description: 'Classification tag for the document (max 100 chars)',
			},
			{
				displayName: 'Custom ID',
				name: 'customId',
				type: 'string',
				default: '',
				description: 'Custom identifier for the document (max 100 chars)',
			},
			{
				displayName: 'Entity Context',
				name: 'entityContext',
				type: 'string',
				typeOptions: { rows: 2 },
				default: '',
				description: 'Processing guidance for the document (max 1500 chars)',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Additional metadata as JSON key-value pairs',
			},
		],
	},

	// ----------------------------------
	//         document:batchAdd
	// ----------------------------------
	{
		displayName: 'Documents',
		name: 'documents',
		type: 'json',
		required: true,
		default: '[\n  { "content": "https://example.com" },\n  { "content": "Some text content" }\n]',
		displayOptions: {
			show: { resource: [resource], operation: ['batchAdd'] },
		},
		description:
			'JSON array of document objects (1-600). Each must have "content" and can optionally include "containerTag", "customId", and "metadata".',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: [resource], operation: ['batchAdd'] },
		},
		options: [
			{
				displayName: 'Container Tag',
				name: 'containerTag',
				type: 'string',
				default: '',
				description: 'Default container tag for all documents in the batch',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Default metadata for all documents in the batch',
			},
		],
	},

	// ----------------------------------
	//         document:bulkDelete
	// ----------------------------------
	{
		displayName: 'Document IDs',
		name: 'documentIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['bulkDelete'] },
		},
		description: 'Comma-separated document IDs to delete (max 100)',
	},

	// ----------------------------------
	//         document:delete
	// ----------------------------------
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['delete'] },
		},
		description: 'The document identifier or custom ID to delete',
	},

	// ----------------------------------
	//         document:get
	// ----------------------------------
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['get'] },
		},
		description: 'The document identifier to retrieve',
	},

	// ----------------------------------
	//         document:getChunks
	// ----------------------------------
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['getChunks'] },
		},
		description: 'The document identifier to get chunks for',
	},

	// ----------------------------------
	//         document:getAll
	// ----------------------------------
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
				displayName: 'Container Tags',
				name: 'containerTags',
				type: 'string',
				default: '',
				description: 'Comma-separated container tags to filter by',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'json',
				default: '{}',
				description: 'Metadata filters as JSON (supports AND/OR logic)',
			},
			{
				displayName: 'Include Content',
				name: 'includeContent',
				type: 'boolean',
				default: false,
				description: 'Whether to include document content in the response',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 1100 },
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
	//         document:update
	// ----------------------------------
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['update'] },
		},
		description: 'The document identifier to update',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['update'] },
		},
		description: 'The updated content for the document',
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
				displayName: 'Container Tag',
				name: 'containerTag',
				type: 'string',
				default: '',
				description: 'Classification tag for the document',
			},
			{
				displayName: 'Custom ID',
				name: 'customId',
				type: 'string',
				default: '',
				description: 'Custom identifier for the document',
			},
			{
				displayName: 'Entity Context',
				name: 'entityContext',
				type: 'string',
				typeOptions: { rows: 2 },
				default: '',
				description: 'Processing guidance for the document',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Additional metadata as JSON key-value pairs',
			},
		],
	},

	// ----------------------------------
	//         document:uploadFile
	// ----------------------------------
	{
		displayName: 'Input Data Field Name',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: {
			show: { resource: [resource], operation: ['uploadFile'] },
		},
		description: 'The name of the incoming field containing the binary file data',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: [resource], operation: ['uploadFile'] },
		},
		options: [
			{
				displayName: 'Container Tags',
				name: 'containerTags',
				type: 'string',
				default: '',
				description: 'Comma-separated container tags for the uploaded file',
			},
			{
				displayName: 'File Type',
				name: 'fileType',
				type: 'options',
				options: [
					{ name: 'Audio', value: 'audio' },
					{ name: 'Auto Detect', value: '' },
					{ name: 'Image', value: 'image' },
					{ name: 'PDF', value: 'pdf' },
					{ name: 'Text', value: 'text' },
					{ name: 'Video', value: 'video' },
					{ name: 'Webpage', value: 'webpage' },
				],
				default: '',
				description: 'The type of the uploaded file',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Additional metadata as JSON',
			},
			{
				displayName: 'MIME Type',
				name: 'mimeType',
				type: 'string',
				default: '',
				description: 'Required for image/video types',
			},
		],
	},
];
