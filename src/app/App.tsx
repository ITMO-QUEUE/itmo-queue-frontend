import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { JSX } from 'react/jsx-runtime'

const queryClient = new QueryClient()

export function App(): JSX.Element {
	return (
		<QueryClientProvider client={queryClient}>
			<p className='text-3xl font-bold text-sky-500'>Hello World!</p>
		</QueryClientProvider>
	)
}
