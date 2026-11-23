import { apiClient } from '../../../libs/axios'
import type { components } from '../../../types/schema'

export type UserCreate = components[ 'schemas' ][ 'UserCreate' ]
export type UserProfile = components[ 'schemas' ][ 'UserProfile' ]

export const createUser = async (
	payload: UserCreate
): Promise< UserProfile > => {
	const { data } = await apiClient.post< UserProfile >(
		'/api/v1/auth/register',
		payload
	)
	return data
}
