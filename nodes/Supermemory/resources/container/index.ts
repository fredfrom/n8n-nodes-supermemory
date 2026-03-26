import type { INodeProperties } from 'n8n-workflow';

const resource = 'container';

export const containerOperations: INodeProperties[] = [
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
				name: 'Delete',
				value: 'delete',
				action: 'Delete a container',
				description: 'Delete a container tag and all its contents',
			},
			{
				name: 'Get Settings',
				value: 'getSettings',
				action: 'Get container settings',
				description: 'Get settings for a container tag',
			},
			{
				name: 'Merge',
				value: 'merge',
				action: 'Merge container tags',
				description: 'Merge two container tags into a target',
			},
			{
				name: 'Update Settings',
				value: 'updateSettings',
				action: 'Update container settings',
				description: 'Update settings for a container tag',
			},
		],
		default: 'getSettings',
	},
];

export const containerFields: INodeProperties[] = [
	// ----------------------------------
	//         container:delete
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
		description: 'The container tag identifier to delete',
	},

	// ----------------------------------
	//         container:getSettings
	// ----------------------------------
	{
		displayName: 'Container Tag',
		name: 'containerTag',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['getSettings'] },
		},
		description: 'The container tag identifier to get settings for',
	},

	// ----------------------------------
	//         container:merge
	// ----------------------------------
	{
		displayName: 'Source Container Tags',
		name: 'sourceContainerTags',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['merge'] },
		},
		description: 'Comma-separated container tags to merge (exactly 2)',
	},
	{
		displayName: 'Target Container Tag',
		name: 'targetContainerTag',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['merge'] },
		},
		description: 'The target container tag to merge into',
	},

	// ----------------------------------
	//         container:updateSettings
	// ----------------------------------
	{
		displayName: 'Container Tag',
		name: 'containerTag',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['updateSettings'] },
		},
		description: 'The container tag identifier to update',
	},
	{
		displayName: 'Entity Context',
		name: 'entityContext',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['updateSettings'] },
		},
		description:
			'Custom context prompt for this container tag. Used to provide additional context when processing documents. Max 1500 characters. Set empty to clear.',
	},
];
