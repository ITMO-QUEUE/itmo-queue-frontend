import type { components, paths } from '../../../types/schema'

// Базовые типы из сгенерированной OpenAPI-схемы
export type QueueDetail = components[ 'schemas' ][ 'QueueDetail' ]
export type SessionRead = components[ 'schemas' ][ 'SessionRead' ]
export type SessionCreate = components[ 'schemas' ][ 'SessionCreate' ]
export type SessionUpdate = components[ 'schemas' ][ 'SessionUpdate' ]
export type SessionOptions = components[ 'schemas' ][ 'SessionOptions' ]
export type Enrollment = components[ 'schemas' ][ 'Enrollment' ]
export type Participant = components[ 'schemas' ][ 'Participant' ]
export type ParticipantAction = components[ 'schemas' ][ 'ParticipantAction' ]
export type SwapRead = components[ 'schemas' ][ 'SwapRead' ]
export type AttemptRead = components[ 'schemas' ][ 'AttemptRead' ]
export type Evaluation = components[ 'schemas' ][ 'Evaluation' ]
export type BanRead = components[ 'schemas' ][ 'BanRead' ]
export type HistoryItem = components[ 'schemas' ][ 'HistoryItem' ]

// Типы query-параметров
export type ListQueuesParams = paths[ '/api/v1/queues' ][ 'get' ][
	'parameters'
][ 'query' ]
export type PaginationParams = paths[ '/api/v1/me/queues' ][ 'get' ][
	'parameters'
][ 'query' ]
