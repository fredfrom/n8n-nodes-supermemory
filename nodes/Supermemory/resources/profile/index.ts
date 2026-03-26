import type { INodeProperties } from 'n8n-workflow';

const resource = 'profile';

export const profileOperations: INodeProperties[] = [
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
				name: 'Get',
				value: 'get',
				action: 'Get user profile',
				description: 'Get a user profile with static and dynamic memories',
			},
		],
		default: 'get',
	},
];

export const profileFields: INodeProperties[] = [
	// ----------------------------------
	//         profile:get
	// ----------------------------------
	{
		displayName: 'Container Tag',
		name: 'containerTag',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: [resource], operation: ['get'] },
		},
		description: 'The user/container identifier to get the profile for',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: [resource], operation: ['get'] },
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
				displayName: 'Query',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Optional search query to include search results in the response',
			},
			{
				displayName: 'Threshold',
				name: 'threshold',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 },
				default: 0.5,
				description: 'Score threshold for search results (0-1)',
			},
		],
	},
];
