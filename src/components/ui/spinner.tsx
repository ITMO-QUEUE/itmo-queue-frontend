import { cn } from '@/lib/utils'

interface SpinnerProps {
	className?: string
}

export const Spinner = ( { className }: SpinnerProps ) => {
	return (
		<span
			aria-hidden='true'
			className={ cn(
				'size-4 animate-spin rounded-full border-2 border-current border-t-transparent',
				className
			) }
		/>
	)
}
