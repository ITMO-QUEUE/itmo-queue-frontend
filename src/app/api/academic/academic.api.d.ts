import type { components, paths } from '../../../types/schema'

// Схемы уведомлений, истории и очередей
export type NotificationRead = components[ 'schemas' ][ 'NotificationRead' ]
export type HistoryItem = components[ 'schemas' ][ 'HistoryItem' ]
export type QueueDetail = components[ 'schemas' ][ 'QueueDetail' ]

// Типы параметров запросов
export type ListNotificationsParams = paths[ '/api/v1/me/notifications' ][
	'get'
][ 'parameters' ][ 'query' ]
export type GetMyHistoryParams = paths[ '/api/v1/me/history' ][ 'get' ][
	'parameters'
][ 'query' ]
export type GetStudentHistoryParams = paths[
	'/api/v1/students/{student_id}/history'
][ 'get' ][ 'parameters' ][ 'query' ]
export type GetStudentQueuesParams = paths[
	'/api/v1/students/{student_id}/queues'
][ 'get' ][ 'parameters' ][ 'query' ]
