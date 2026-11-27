import { apiClient } from '../../../libs/axios'
import type { components } from '../../../types/schema'

type NamedItem = components['schemas']['NamedRead']

export interface QueueFilterOptions {
	disciplines: NamedItem[]
	streams: NamedItem[]
}

export const getQueueFilterOptions = async (
	signal?: AbortSignal
): Promise<QueueFilterOptions> => {
	const [disciplinesResponse, streamsResponse] = await Promise.all([
		apiClient.get<NamedItem[]>('/api/v1/disciplines', { signal }),
		apiClient.get<NamedItem[]>('/api/v1/streams', { signal })
	])

	return {
		disciplines: disciplinesResponse.data,
		streams: streamsResponse.data
	}
}