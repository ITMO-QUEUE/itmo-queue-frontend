import type { components } from '../../../types/schema'

export type HealthResponse = components[ 'schemas' ][ 'HealthResponse' ]

export type QueueStreamEventType =
	| 'snapshot'
	| 'queue.updated'
	| 'participant.status_changed'
	| 'queue.status_changed'
