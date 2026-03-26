import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SupermemoryApi implements ICredentialType {
	name = 'supermemoryApi';
	displayName = 'Supermemory API';
	documentationUrl = 'https://docs.supermemory.ai';
	icon = { light: 'file:../nodes/Supermemory/supermemory.svg', dark: 'file:../nodes/Supermemory/supermemory.svg' } as const;
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.supermemory.ai',
			description: 'Base URL for the Supermemory API. Change this for self-hosted instances.',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v3/documents/processing',
			method: 'GET',
		},
	};
}
