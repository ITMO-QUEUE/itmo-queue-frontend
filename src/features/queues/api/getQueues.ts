import { apiClient } from '../../../libs/axios'
import type { operations } from '../../../types/schema'

type ListQueues = operations[ 'listQueues' ]

export type QueueFilters = NonNullable< ListQueues[ 'parameters' ][ 'query' ] >

export type QueueList = ListQueues[ 'responses' ][ 200 ][ 'content' ][
	'application/json'
]

export const getQueues = async (
	filters: QueueFilters = {},
	signal?: AbortSignal
): Promise< QueueList > => {
	const { data } = await apiClient.get< QueueList >( '/api/v1/queues', {
		params: filters,
		signal
	} )

	return data
}
const getStageQueues = async (
	filters: QueueFilters,
	stage: 'preliminary' | 'active',
	signal?: AbortSignal,
	offset = 0
): Promise< QueueList > => {
	const limit = 20

	const page = await getQueues(
		{
			...filters,
			stage,
			limit,
			offset
		},
		signal
	)

	if ( page.length < limit ) {
		return page
	}

	const remaining = await getStageQueues(
		filters,
		stage,
		signal,
		offset + page.length
	)

	return [ ...page, ...remaining ]
}

export const getAvailableQueues = async (
	filters: QueueFilters = {},
	signal?: AbortSignal
): Promise< QueueList > => {
	const stages: Array< 'preliminary' | 'active' > =
		filters.stage === 'preliminary' || filters.stage === 'active'
			? [ filters.stage ]
			: [ 'preliminary', 'active' ]

	const results = await Promise.all(
		stages.map( stage => getStageQueues( filters, stage, signal ) )
	)

	return results
		.flat()
		.sort(
			( first, second ) =>
				new Date( first.planned_start ).getTime() -
				new Date( second.planned_start ).getTime()
		)
}
