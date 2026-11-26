import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { JSX } from 'react/jsx-runtime'
import { RouterProvider } from 'react-router'
import { ModalHost } from '../components/modals/ModalHost'
import { AuthProvider } from './providers/AuthProvider'
import { router } from './router'

const queryClient = new QueryClient()

export function App(): JSX.Element {
	return (
		<QueryClientProvider client={ queryClient }>
			<AuthProvider>
				<RouterProvider router={ router } />
				<ModalHost />
			</AuthProvider>
		</QueryClientProvider>
	)
}
