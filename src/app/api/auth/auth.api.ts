import { apiClient } from '../../../libs/axios'
import type { CurrentUser } from '../../../stores/useAuthStore'
import type { AuthSessionUser, LoginRequest, UserProfile } from './auth.api.d'
// Схемы авторизации и профиля из OpenAPI

// ============================================================================
// АВТОРИЗАЦИЯ И УПРАВЛЕНИЕ СЕССИЕЙ
// ============================================================================

export const login = async (
	credentials: LoginRequest
): Promise< AuthSessionUser > => {
	// Выполняет вход по логину или ИСУ и паролю, устанавливая HttpOnly cookie sessionId
	const { data } = await apiClient.post< AuthSessionUser >(
		'/api/v1/auth/login',
		credentials
	)
	return data
}

export const logout = async (): Promise< void > => {
	// Завершает текущую сессию пользователя на сервере и инвалидирует cookie sessionId
	await apiClient.post( '/api/v1/auth/logout' )
}

// ============================================================================
// ПОЛУЧЕНИЕ ПРОФИЛЯ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
// ============================================================================

export const getCurrentAuthUser = async (): Promise< AuthSessionUser > => {
	// Проверяет активность сессии и получает базовые данные авторизованного пользователя (id, name, login, role)
	const { data } = await apiClient.get< AuthSessionUser >( '/api/v1/auth/me' )
	return data
}

export const getMyProfile = async (): Promise< CurrentUser > => {
	// Получает полный профиль текущего пользователя (включая isu, is_active, can_create_queues и stream_id)
	const { data } = await apiClient.get< CurrentUser >( '/api/v1/me' )
	return data
}

export const loginAndFetchProfile = async (
	credentials: LoginRequest
): Promise< CurrentUser > => {
	// Выполняет вход в систему и сразу запрашивает полный профиль пользователя для сохранения в useAuthStore
	await login( credentials )
	return getMyProfile()
}
