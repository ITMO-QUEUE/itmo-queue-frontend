import { apiClient } from '../../../libs/axios'
import type {
	GetMyHistoryParams,
	GetStudentHistoryParams,
	GetStudentQueuesParams,
	HistoryItem,
	ListNotificationsParams,
	NotificationRead,
	QueueDetail
} from './academic.api.d'

// ============================================================================
// УВЕДОМЛЕНИЯ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ (NOTIFICATIONS)
// ============================================================================

export const getMyNotifications = async (
	params?: ListNotificationsParams
): Promise< NotificationRead[] > => {
	// Получает список уведомлений текущего пользователя с пагинацией
	const { data } = await apiClient.get< NotificationRead[] >(
		'/api/v1/me/notifications',
		{ params }
	)
	return data
}

export const markNotificationAsRead = async (
	notificationId: string
): Promise< NotificationRead > => {
	// Отмечает конкретное уведомление пользователя как прочитанное
	const { data } = await apiClient.post< NotificationRead >(
		`/api/v1/me/notifications/${ notificationId }/read`
	)
	return data
}

// ============================================================================
// ИСТОРИЯ СДАЧ И ПРОСМОТР ОЧЕРЕДЕЙ СТУДЕНТА
// ============================================================================

export const getMyHistory = async (
	params?: GetMyHistoryParams
): Promise< HistoryItem[] > => {
	// Получает историю попыток сдачи и результатов текущего пользователя с фильтрацией по дате, дисциплине и работе
	const { data } = await apiClient.get< HistoryItem[] >( '/api/v1/me/history', {
		params
	} )
	return data
}

export const getStudentHistory = async (
	studentId: string,
	params?: GetStudentHistoryParams
): Promise< HistoryItem[] > => {
	// Получает историю попыток сдачи и оценок выбранного студента (для преподавателя и администратора)
	const { data } = await apiClient.get< HistoryItem[] >(
		`/api/v1/students/${ studentId }/history`,
		{ params }
	)
	return data
}

export const getStudentQueues = async (
	studentId: string,
	params?: GetStudentQueuesParams
): Promise< QueueDetail[] > => {
	// Получает список очередей, в которых участвует указанный студент
	const { data } = await apiClient.get< QueueDetail[] >(
		`/api/v1/students/${ studentId }/queues`,
		{ params }
	)
	return data
}
