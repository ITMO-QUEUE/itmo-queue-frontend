import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { JSX } from 'react/jsx-runtime'
import { RouterProvider } from 'react-router'
import { router } from './router'

const queryClient = new QueryClient()

export function App(): JSX.Element {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	)
}
