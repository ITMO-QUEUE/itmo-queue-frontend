import { apiClient } from '../../../libs/axios'
import type { CurrentUser } from '../../../stores/useAuthStore'
import type { components } from '../../../types/schema'

export type LoginRequest = components[ 'schemas' ][ 'LoginRequest' ]

export const loginAndFetchProfile = async (
	credentials: LoginRequest
): Promise< CurrentUser > => {
	await apiClient.post( '/api/v1/auth/login', credentials )

	const { data } = await apiClient.get< CurrentUser >( '/api/v1/me' )

	return data
}

export const getMyProfile = async (): Promise< CurrentUser > => {
	const { data } = await apiClient.get< CurrentUser >( '/api/v1/me' )
	return data
}

export const logout = async(): Promise<void> => {
	await apiClient.post('/api/v1/auth/logout')
}
