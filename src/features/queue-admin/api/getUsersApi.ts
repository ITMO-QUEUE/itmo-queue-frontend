import type { UserItem } from '../../../components/ui/UIUserRow'
import { apiClient } from '../../../libs/axios'

export interface GetUsersParams {
	limit?: number
	offset?: number
}

export const getUsers = async (
	params: GetUsersParams = { limit: 100, offset: 0 }
): Promise< UserItem[] > => {
	const { data } = await apiClient.get< UserItem[] >( '/api/v1/users', {
		params
	} )
	return data
}
