import type { INodeProperties } from 'n8n-workflow';

const resource = 'conversation';

export const conversationOperations: INodeProperties[] = [
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
				name: 'Ingest',
				value: 'ingest',
				action: 'Ingest a conversation',
				description: 'Ingest or update a conversation for memory extraction',
			},
		],
		default: 'ingest',
	},
];

export const conversationFields: INodeProperties[] = [
	// ----------------------------------
	//         conversation:ingest
	// ----------------------------------
	{
		displayName: 'Conversation ID',
		name: 'conversationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['ingest'] },
		},
		description: 'Unique identifier for the conversation (max 255 chars)',
	},
	{
		displayName: 'Messages',
		name: 'messages',
		type: 'json',
		required: true,
		default:
			'[\n  { "role": "user", "content": "Hello" },\n  { "role": "assistant", "content": "Hi there!" }\n]',
		displayOptions: {
			show: { resource: [resource], operation: ['ingest'] },
		},
		description:
			'JSON array of message objects. Each must have "role" (user/assistant/system/tool) and "content" (string).',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: [resource], operation: ['ingest'] },
		},
		options: [
			{
				displayName: 'Container Tags',
				name: 'containerTags',
				type: 'string',
				default: '',
				description: 'Comma-separated container tags for the conversation',
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
];
