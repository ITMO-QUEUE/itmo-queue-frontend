import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from './spinner'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ComponentProps< 'button' > {
	variant?: ButtonVariant
	isLoading?: boolean
}

const variantClasses: Record< ButtonVariant, string > = {
	primary: 'bg-c-accent text-white hover:bg-c-accent/90',
	secondary:
		'border border-c-border bg-c-bg-foam text-c-text-foam hover:bg-c-bg-foam/70'
}

export const Button = ( {
	variant = 'primary',
	isLoading = false,
	disabled,
	className,
	children,
	type = 'button',
	...props
}: ButtonProps ) => {
	return (
		<button
			type={ type }
			disabled={ disabled || isLoading }
			className={ cn(
				'flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-70',
				variantClasses[ variant ],
				className
			) }
			{ ...props }
		>
			{ isLoading && <Spinner /> }
			{ children }
		</button>
	)
}
