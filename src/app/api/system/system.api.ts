import { apiClient } from '../../../libs/axios'
import type { HealthResponse } from './system.api.d'

// ============================================================================
// ИНФРАСТРУКТУРА И SSE-ПОТОК ОЧЕРЕДИ В РЕАЛЬНОМ ВРЕМЕНИ
// ============================================================================

export const getHealth = async (): Promise< HealthResponse > => {
	// Проверяет HTTP-доступность бэкенд-приложения без обращения к БД и кешу
	const { data } = await apiClient.get< HealthResponse >( '/health' )
	return data
}

export const createQueueEventSource = (
	queueId: string,
	afterEventId?: number
): EventSource => {
	// Создаёт SSE-подключение (EventSource) к потоку обновлений очереди в реальном времени с передачей cookie сессии
	const baseUrl = apiClient.defaults.baseURL ?? ''
	const url = new URL(
		`/api/v1/queues/${ queueId }/stream`,
		baseUrl || window.location.origin
	)

	if ( afterEventId !== undefined ) {
		url.searchParams.set( 'after', String( afterEventId ) )
	}

	return new EventSource( url.toString(), { withCredentials: true } )
}
