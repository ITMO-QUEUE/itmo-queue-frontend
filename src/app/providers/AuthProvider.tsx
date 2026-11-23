import { useQuery } from '@tanstack/react-query'
import { type PropsWithChildren, useEffect } from 'react'
import { getMyProfile } from '../../features/auth/api/authApi'
import { useAuthStore } from '../../stores/useAuthStore'

export const AuthProvider = ( { children }: PropsWithChildren ) => {
	const user = useAuthStore( state => state.user )
	const login = useAuthStore( state => state.login )
	const logout = useAuthStore( state => state.logout )

	const { data, isError, isSuccess } = useQuery( {
		queryKey: [ 'me' ],
		queryFn: getMyProfile,
		enabled: ! user,
		retry: false,
		staleTime: 5 * 60 * 1000
	} )

	useEffect( () => {
		if ( isSuccess && data ) {
			if ( data.is_active ) {
				login( data )
			} else {
				logout()
			}
		}
	}, [ isSuccess, data, login, logout ] )

	useEffect( () => {
		if ( isError ) {
			logout()
		}
	}, [ isError, logout ] )

	return <>{ children }</>
}
