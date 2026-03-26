import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { memoryOperations, memoryFields } from './resources/memory';
import { documentOperations, documentFields } from './resources/document';
import { containerOperations, containerFields } from './resources/container';
import { searchOperations, searchFields } from './resources/search';
import { conversationOperations, conversationFields } from './resources/conversation';
import { profileOperations, profileFields } from './resources/profile';

export class Supermemory implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Supermemory',
		name: 'supermemory',
		icon: 'file:supermemory.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Supermemory API',
		defaults: {
			name: 'Supermemory',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'supermemoryApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Container', value: 'container' },
					{ name: 'Conversation', value: 'conversation' },
					{ name: 'Document', value: 'document' },
					{ name: 'Memory', value: 'memory' },
					{ name: 'Profile', value: 'profile' },
					{ name: 'Search', value: 'search' },
				],
				default: 'memory',
			},
			...memoryOperations,
			...memoryFields,
			...documentOperations,
			...documentFields,
			...containerOperations,
			...containerFields,
			...searchOperations,
			...searchFields,
			...conversationOperations,
			...conversationFields,
			...profileOperations,
			...profileFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('supermemoryApi');
		const baseUrl = (credentials.baseUrl as string) || 'https://api.supermemory.ai';

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				if (resource === 'memory') {
					responseData = await executeMemory.call(this, operation, baseUrl, i);
				} else if (resource === 'document') {
					responseData = await executeDocument.call(this, operation, baseUrl, i);
				} else if (resource === 'container') {
					responseData = await executeContainer.call(this, operation, baseUrl, i);
				} else if (resource === 'search') {
					responseData = await executeSearch.call(this, operation, baseUrl, i);
				} else if (resource === 'conversation') {
					responseData = await executeConversation.call(this, operation, baseUrl, i);
				} else if (resource === 'profile') {
					responseData = await executeProfile.call(this, operation, baseUrl, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, {
						itemIndex: i,
					});
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}

function parseJsonField(value: unknown): IDataObject | undefined {
	if (!value || value === '{}') return undefined;
	if (typeof value === 'string') return JSON.parse(value) as IDataObject;
	return value as IDataObject;
}

async function executeMemory(
	this: IExecuteFunctions,
	operation: string,
	baseUrl: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const containerTag = this.getNodeParameter('containerTag', i) as string;
		const content = this.getNodeParameter('content', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const memory: IDataObject = { content };
		if (additionalFields.isStatic !== undefined) memory.isStatic = additionalFields.isStatic;
		if (additionalFields.forgetAfter) memory.forgetAfter = additionalFields.forgetAfter;
		if (additionalFields.forgetReason) memory.forgetReason = additionalFields.forgetReason;

		const metadata = parseJsonField(additionalFields.metadata);
		if (metadata) memory.metadata = metadata;

		const temporalContext = parseJsonField(additionalFields.temporalContext);
		if (temporalContext) memory.temporalContext = temporalContext;

		const body: IDataObject = {
			containerTag,
			memories: [memory],
		};

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'POST',
			url: `${baseUrl}/v4/memories`,
			body,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'delete') {
		const containerTag = this.getNodeParameter('containerTag', i) as string;
		const identifyBy = this.getNodeParameter('identifyBy', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = { containerTag };
		if (identifyBy === 'id') {
			body.id = this.getNodeParameter('memoryId', i) as string;
		} else {
			body.content = this.getNodeParameter('content', i) as string;
		}
		if (additionalFields.reason) body.reason = additionalFields.reason;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'DELETE',
			url: `${baseUrl}/v4/memories`,
			body,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'getAll') {
		const containerTagsStr = this.getNodeParameter('containerTags', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			containerTags: containerTagsStr.split(',').map((t) => t.trim()),
		};

		if (additionalFields.page) body.page = additionalFields.page;
		if (additionalFields.limit) body.limit = additionalFields.limit;
		if (additionalFields.sort) body.sort = additionalFields.sort;
		if (additionalFields.order) body.order = additionalFields.order;

		const filters = parseJsonField(additionalFields.filters);
		if (filters) body.filters = filters;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'POST',
			url: `${baseUrl}/v4/memories/list`,
			body,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'search') {
		const query = this.getNodeParameter('query', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = { q: query };
		if (additionalFields.containerTag) body.containerTag = additionalFields.containerTag;
		if (additionalFields.threshold !== undefined) body.threshold = additionalFields.threshold;
		if (additionalFields.limit) body.limit = additionalFields.limit;
		if (additionalFields.searchMode) body.searchMode = additionalFields.searchMode;
		if (additionalFields.rerank !== undefined) body.rerank = additionalFields.rerank;
		if (additionalFields.rewriteQuery !== undefined)
			body.rewriteQuery = additionalFields.rewriteQuery;

		const filters = parseJsonField(additionalFields.filters);
		if (filters) body.filters = filters;

		// Build include object
		const include: IDataObject = {};
		if (additionalFields.includeDocuments) include.documents = true;
		if (additionalFields.includeSummaries) include.summaries = true;
		if (additionalFields.includeRelatedMemories) include.relatedMemories = true;
		if (additionalFields.includeForgottenMemories) include.forgottenMemories = true;
		if (Object.keys(include).length > 0) body.include = include;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'POST',
			url: `${baseUrl}/v4/search`,
			body,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'update') {
		const containerTag = this.getNodeParameter('containerTag', i) as string;
		const identifyBy = this.getNodeParameter('identifyBy', i) as string;
		const newContent = this.getNodeParameter('newContent', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = { containerTag, newContent };
		if (identifyBy === 'id') {
			body.id = this.getNodeParameter('memoryId', i) as string;
		} else {
			body.content = this.getNodeParameter('existingContent', i) as string;
		}
		if (additionalFields.forgetAfter) body.forgetAfter = additionalFields.forgetAfter;
		if (additionalFields.forgetReason) body.forgetReason = additionalFields.forgetReason;

		const metadata = parseJsonField(additionalFields.metadata);
		if (metadata) body.metadata = metadata;

		const temporalContext = parseJsonField(additionalFields.temporalContext);
		if (temporalContext) body.temporalContext = temporalContext;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'PATCH',
			url: `${baseUrl}/v4/memories`,
			body,
			json: true,
		})) as IDataObject;
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}

async function executeDocument(
	this: IExecuteFunctions,
	operation: string,
	baseUrl: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'add') {
		const content = this.getNodeParameter('content', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = { content };
		if (additionalFields.containerTag) body.containerTag = additionalFields.containerTag;
		if (additionalFields.customId) body.customId = additionalFields.customId;
		if (additionalFields.entityContext) body.entityContext = additionalFields.entityContext;

		const metadata = parseJsonField(additionalFields.metadata);
		if (metadata) body.metadata = metadata;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'POST',
			url: `${baseUrl}/v3/documents`,
			body,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'batchAdd') {
		const documentsJson = this.getNodeParameter('documents', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			documents: JSON.parse(documentsJson),
		};
		if (additionalFields.containerTag) body.containerTag = additionalFields.containerTag;

		const metadata = parseJsonField(additionalFields.metadata);
		if (metadata) body.metadata = metadata;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'POST',
			url: `${baseUrl}/v3/documents/batch`,
			body,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'bulkDelete') {
		const documentIdsStr = this.getNodeParameter('documentIds', i) as string;

		const body: IDataObject = {
			ids: documentIdsStr.split(',').map((id) => id.trim()),
		};

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'DELETE',
			url: `${baseUrl}/v3/documents/bulk`,
			body,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'delete') {
		const documentId = this.getNodeParameter('documentId', i) as string;

		try {
			await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
				method: 'DELETE',
				url: `${baseUrl}/v3/documents/${documentId}`,
				json: true,
				ignoreHttpStatusErrors: true,
			});
		} catch {
			// Ignore errors — 204 No Content causes JSON parse failures
		}
		return { deleted: true, documentId };
	}

	if (operation === 'get') {
		const documentId = this.getNodeParameter('documentId', i) as string;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'GET',
			url: `${baseUrl}/v3/documents/${documentId}`,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'getChunks') {
		const documentId = this.getNodeParameter('documentId', i) as string;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'GET',
			url: `${baseUrl}/v3/documents/${documentId}/chunks`,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'getAll') {
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {};
		if (additionalFields.containerTags) {
			body.containerTags = (additionalFields.containerTags as string)
				.split(',')
				.map((t) => t.trim());
		}
		if (additionalFields.page) body.page = additionalFields.page;
		if (additionalFields.limit) body.limit = additionalFields.limit;
		if (additionalFields.sort) body.sort = additionalFields.sort;
		if (additionalFields.order) body.order = additionalFields.order;
		if (additionalFields.includeContent !== undefined)
			body.includeContent = additionalFields.includeContent;

		const filters = parseJsonField(additionalFields.filters);
		if (filters) body.filters = filters;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'POST',
			url: `${baseUrl}/v3/documents/list`,
			body,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'getProcessing') {
		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'GET',
			url: `${baseUrl}/v3/documents/processing`,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'update') {
		const documentId = this.getNodeParameter('documentId', i) as string;
		const content = this.getNodeParameter('content', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = { content };
		if (additionalFields.containerTag) body.containerTag = additionalFields.containerTag;
		if (additionalFields.customId) body.customId = additionalFields.customId;
		if (additionalFields.entityContext) body.entityContext = additionalFields.entityContext;

		const metadata = parseJsonField(additionalFields.metadata);
		if (metadata) body.metadata = metadata;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'PATCH',
			url: `${baseUrl}/v3/documents/${documentId}`,
			body,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'uploadFile') {
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
		const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

		const boundary = `----n8nFormBoundary${Date.now()}`;
		const parts: Buffer[] = [];

		// File part
		parts.push(
			Buffer.from(
				`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${binaryData.fileName || 'file'}"\r\nContent-Type: ${binaryData.mimeType}\r\n\r\n`,
			),
		);
		parts.push(dataBuffer);
		parts.push(Buffer.from('\r\n'));

		// Additional form fields
		const formFields: Record<string, string> = {};
		if (additionalFields.containerTags) {
			formFields.containerTags = additionalFields.containerTags as string;
		}
		if (additionalFields.fileType) {
			formFields.fileType = additionalFields.fileType as string;
		}
		if (additionalFields.mimeType) {
			formFields.mimeType = additionalFields.mimeType as string;
		}
		if (additionalFields.metadata) {
			formFields.metadata = additionalFields.metadata as string;
		}

		for (const [key, value] of Object.entries(formFields)) {
			parts.push(
				Buffer.from(
					`--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`,
				),
			);
		}

		parts.push(Buffer.from(`--${boundary}--\r\n`));
		const bodyBuffer = Buffer.concat(parts);

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'POST',
			url: `${baseUrl}/v3/documents/file`,
			body: bodyBuffer,
			headers: {
				'Content-Type': `multipart/form-data; boundary=${boundary}`,
			},
			json: true,
		})) as IDataObject;
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}

async function executeContainer(
	this: IExecuteFunctions,
	operation: string,
	baseUrl: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'delete') {
		const containerTag = this.getNodeParameter('containerTag', i) as string;
		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'DELETE',
			url: `${baseUrl}/v3/container-tags/${containerTag}`,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'getSettings') {
		const containerTag = this.getNodeParameter('containerTag', i) as string;
		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'GET',
			url: `${baseUrl}/v3/container-tags/${containerTag}`,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'merge') {
		const sourceStr = this.getNodeParameter('sourceContainerTags', i) as string;
		const targetContainerTag = this.getNodeParameter('targetContainerTag', i) as string;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'POST',
			url: `${baseUrl}/v3/container-tags/merge`,
			body: {
				containerTags: sourceStr.split(',').map((t) => t.trim()),
				targetContainerTag,
			},
			json: true,
		})) as IDataObject;
	}

	if (operation === 'updateSettings') {
		const containerTag = this.getNodeParameter('containerTag', i) as string;
		const entityContext = this.getNodeParameter('entityContext', i) as string;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'PATCH',
			url: `${baseUrl}/v3/container-tags/${containerTag}`,
			body: { entityContext: entityContext || null },
			json: true,
		})) as IDataObject;
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}

async function executeSearch(
	this: IExecuteFunctions,
	operation: string,
	baseUrl: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	const query = this.getNodeParameter('query', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	if (operation === 'searchDocuments') {
		const body: IDataObject = { q: query };
		if (additionalFields.chunkThreshold !== undefined)
			body.chunkThreshold = additionalFields.chunkThreshold;
		if (additionalFields.containerTags) {
			body.containerTags = (additionalFields.containerTags as string)
				.split(',')
				.map((t) => t.trim());
		}
		if (additionalFields.docId) body.docId = additionalFields.docId;
		if (additionalFields.limit) body.limit = additionalFields.limit;
		if (additionalFields.includeFullDocs !== undefined)
			body.includeFullDocs = additionalFields.includeFullDocs;
		if (additionalFields.includeSummary !== undefined)
			body.includeSummary = additionalFields.includeSummary;
		if (additionalFields.onlyMatchingChunks !== undefined)
			body.onlyMatchingChunks = additionalFields.onlyMatchingChunks;
		if (additionalFields.rerank !== undefined) body.rerank = additionalFields.rerank;
		if (additionalFields.rewriteQuery !== undefined)
			body.rewriteQuery = additionalFields.rewriteQuery;

		const filters = parseJsonField(additionalFields.filters);
		if (filters) body.filters = filters;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'POST',
			url: `${baseUrl}/v3/search`,
			body,
			json: true,
		})) as IDataObject;
	}

	if (operation === 'searchMemories') {
		const body: IDataObject = { q: query };
		if (additionalFields.containerTag) body.containerTag = additionalFields.containerTag;
		if (additionalFields.threshold !== undefined) body.threshold = additionalFields.threshold;
		if (additionalFields.limit) body.limit = additionalFields.limit;
		if (additionalFields.searchMode) body.searchMode = additionalFields.searchMode;
		if (additionalFields.rerank !== undefined) body.rerank = additionalFields.rerank;
		if (additionalFields.rewriteQuery !== undefined)
			body.rewriteQuery = additionalFields.rewriteQuery;

		const filters = parseJsonField(additionalFields.filters);
		if (filters) body.filters = filters;

		// Build include object
		const include: IDataObject = {};
		if (additionalFields.includeDocuments) include.documents = true;
		if (additionalFields.includeSummaries) include.summaries = true;
		if (additionalFields.includeRelatedMemories) include.relatedMemories = true;
		if (additionalFields.includeForgottenMemories) include.forgottenMemories = true;
		if (Object.keys(include).length > 0) body.include = include;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'POST',
			url: `${baseUrl}/v4/search`,
			body,
			json: true,
		})) as IDataObject;
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}

async function executeConversation(
	this: IExecuteFunctions,
	operation: string,
	baseUrl: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'ingest') {
		const conversationId = this.getNodeParameter('conversationId', i) as string;
		const messagesJson = this.getNodeParameter('messages', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			conversationId,
			messages: JSON.parse(messagesJson),
		};
		if (additionalFields.containerTags) {
			body.containerTags = (additionalFields.containerTags as string)
				.split(',')
				.map((t) => t.trim());
		}

		const metadata = parseJsonField(additionalFields.metadata);
		if (metadata) body.metadata = metadata;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'POST',
			url: `${baseUrl}/v4/conversations`,
			body,
			json: true,
		})) as IDataObject;
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}

async function executeProfile(
	this: IExecuteFunctions,
	operation: string,
	baseUrl: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'get') {
		const containerTag = this.getNodeParameter('containerTag', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = { containerTag };
		if (additionalFields.q) body.q = additionalFields.q;
		if (additionalFields.threshold !== undefined) body.threshold = additionalFields.threshold;

		const filters = parseJsonField(additionalFields.filters);
		if (filters) body.filters = filters;

		return (await this.helpers.httpRequestWithAuthentication.call(this, 'supermemoryApi', {
			method: 'POST',
			url: `${baseUrl}/v4/profile`,
			body,
			json: true,
		})) as IDataObject;
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}
