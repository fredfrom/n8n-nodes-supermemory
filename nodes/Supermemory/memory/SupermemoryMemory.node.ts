import type {
	IDataObject,
	IHttpRequestOptions,
	INodeTypeDescription,
	ISupplyDataFunctions,
	SupplyData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

type HttpHelper = (options: IHttpRequestOptions) => Promise<IDataObject>;

function createMemoryInstance(opts: {
	httpHelper: HttpHelper;
	baseUrl: string;
	containerTag: string;
	sessionId: string;
}): IDataObject {
	const { httpHelper, baseUrl, containerTag, sessionId } = opts;

	return {
		get memoryKeys() {
			return ['chat_history'];
		},

		async loadMemoryVariables(): Promise<IDataObject> {
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			const langchainMessages = require(['@langchain', 'core', 'messages'].join('/'));
			const { SystemMessage } = langchainMessages;

			const profile = await httpHelper({
				method: 'POST',
				url: `${baseUrl}/v4/profile`,
				body: { containerTag },
				json: true,
			});

			const messages: unknown[] = [];
			const profileData = profile.profile as IDataObject | undefined;

			if (profileData) {
				const parts: string[] = [];
				const staticMemories = profileData.static as string[] | undefined;
				const dynamicMemories = profileData.dynamic as string[] | undefined;

				if (staticMemories && staticMemories.length > 0) {
					parts.push('Known facts about the user:\n- ' + staticMemories.join('\n- '));
				}
				if (dynamicMemories && dynamicMemories.length > 0) {
					parts.push('Recent context:\n- ' + dynamicMemories.join('\n- '));
				}
				if (parts.length > 0) {
					messages.push(new SystemMessage(parts.join('\n\n')));
				}
			}

			return { chat_history: messages } as unknown as IDataObject;
		},

		async saveContext(inputValues: IDataObject, outputValues: IDataObject): Promise<void> {
			const input = inputValues.input as string;
			const output = outputValues.output as string;

			if (!input && !output) return;

			const messages: IDataObject[] = [];
			if (input) messages.push({ role: 'user', content: input });
			if (output) messages.push({ role: 'assistant', content: output });

			try {
				await httpHelper({
					method: 'POST',
					url: `${baseUrl}/v4/conversations`,
					body: {
						conversationId: sessionId,
						messages,
						containerTags: [containerTag],
					},
					json: true,
				});
			} catch {
				// Don't fail the agent if memory save fails
			}
		},
	} as unknown as IDataObject;
}

export class SupermemoryMemory {
	description: INodeTypeDescription = {
		displayName: 'Supermemory Memory',
		name: 'supermemoryMemory',
		icon: 'file:../supermemory.svg',
		group: ['transform'],
		version: 1,
		description:
			'Use Supermemory as memory for AI agents — stores conversations and retrieves semantic user context',
		defaults: {
			name: 'Supermemory Memory',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Memory'],
				Memory: ['Other memories'],
			},
		},
		inputs: [],
		outputs: [NodeConnectionTypes.AiMemory],
		outputNames: ['Memory'],
		credentials: [
			{
				name: 'supermemoryApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Container Tag',
				name: 'containerTag',
				type: 'string',
				required: true,
				default: '',
				description:
					'The user/space identifier for scoping memories (e.g. user ID, session scope)',
			},
			{
				displayName: 'Session ID',
				name: 'sessionId',
				type: 'string',
				default: '={{ $execution.id }}',
				description:
					'Unique conversation/session identifier. Defaults to the workflow execution ID.',
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const credentials = await this.getCredentials('supermemoryApi');
		const baseUrl = (credentials.baseUrl as string) || 'https://api.supermemory.ai';
		const containerTag = this.getNodeParameter('containerTag', itemIndex) as string;
		const sessionId = this.getNodeParameter('sessionId', itemIndex) as string;

		const helpers = this.helpers;
		const httpHelper: HttpHelper = async (options: IHttpRequestOptions) => {
			return (await helpers.httpRequestWithAuthentication.call(
				this,
				'supermemoryApi',
				options,
			)) as IDataObject;
		};

		const memory = createMemoryInstance({
			httpHelper,
			baseUrl,
			containerTag,
			sessionId,
		});

		return { response: memory };
	}
}
