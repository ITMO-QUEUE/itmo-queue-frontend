import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { JSX } from 'react/jsx-runtime'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './providers/AuthProvider'
import { router } from './router'

const queryClient = new QueryClient()

export function App(): JSX.Element {
	return (
		<QueryClientProvider client={ queryClient }>
			<AuthProvider>
				<RouterProvider router={ router } />
			</AuthProvider>
		</QueryClientProvider>
	)
}
