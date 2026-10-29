import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends ComponentProps< 'input' > {
	/** Подсветить поле красным, если в нём ошибка */
	invalid?: boolean
}

export const Input = ( {
	invalid = false,
	className,
	...props
}: InputProps ) => {
	return (
		<input
			aria-invalid={ invalid }
			className={ cn(
				'h-11 w-full rounded-lg border bg-white px-3 text-sm text-c-text-ink outline-none transition placeholder:text-c-text-muted/70 focus:border-c-accent focus:ring-3 focus:ring-c-accent/15 disabled:opacity-60',
				invalid ? 'border-destructive' : 'border-c-border',
				className
			) }
			{ ...props }
		/>
	)
}
