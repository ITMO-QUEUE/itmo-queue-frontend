import { create } from 'zustand'
import type { components } from '../types/schema'

export type UserRole = components[ 'schemas' ][ 'UserRole' ]
export type CurrentUser = components[ 'schemas' ][ 'UserProfile' ]

interface AuthState {
	user: CurrentUser | null
	isAuthenticated: boolean
	isInitialized: boolean

	login: ( user: CurrentUser ) => void
	logout: () => void
	setInitialized: () => void
}

export const useAuthStore = create< AuthState >( set => ( {
	user: null,
	isAuthenticated: false,
	isInitialized: false,

	login: user =>
		set( {
			user,
			isAuthenticated: true,
			isInitialized: true
		} ),

	logout: () =>
		set( {
			user: null,
			isAuthenticated: false,
			isInitialized: true
		} ),

	setInitialized: () => set( { isInitialized: true } )
} ) )
