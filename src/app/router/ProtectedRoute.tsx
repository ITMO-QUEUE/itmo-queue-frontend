import { Navigate, Outlet, useLocation } from 'react-router'
import { type UserRole, useAuthStore } from '../../stores/useAuthStore'

export const ROLE_HOME_ROUTES: Record< UserRole, string > = {
	student: '/student/me/queues',
	teacher: '/teacher/queues',
	admin: '/admin/users'
}

interface ProtectedRouteProps {
	allowedRoles?: UserRole[]
}

export const ProtectedRoute = ( { allowedRoles }: ProtectedRouteProps ) => {
	const location = useLocation()
	const user = useAuthStore( state => state.user )
	const isAuthenticated = useAuthStore( state => state.isAuthenticated )
	const isInitialized = useAuthStore( state => state.isInitialized )

	if ( ! isInitialized ) {
		return (
			<div className='flex h-screen w-full items-center justify-center text-sm text-neutral-500'>
				Проверка сессии...
			</div>
		)
	}

	if ( ! isAuthenticated || ! user ) {
		return (
			<Navigate
				to='/auth'
				state={ { from: location } }
				replace
			/>
		)
	}

	if ( allowedRoles && ! allowedRoles.includes( user.role ) ) {
		return (
			<Navigate
				to={ ROLE_HOME_ROUTES[ user.role ] }
				replace
			/>
		)
	}

	return <Outlet />
}

export const GuestOnlyRoute = () => {
	const user = useAuthStore( state => state.user )
	const isAuthenticated = useAuthStore( state => state.isAuthenticated )
	const isInitialized = useAuthStore( state => state.isInitialized )

	if ( ! isInitialized ) {
		return (
			<div className='flex h-screen w-full items-center justify-center text-sm text-neutral-500'>
				Проверка сессии...
			</div>
		)
	}

	if ( isAuthenticated && user ) {
		return (
			<Navigate
				to={ ROLE_HOME_ROUTES[ user.role ] }
				replace
			/>
		)
	}

	return <Outlet />
}
