import { tw } from '../../libs/utils'

interface UITabProps {
	label: string
	disabled?: boolean
	active?: boolean
	onClick?: () => void | Promise<void>
	className?: string
}

const BASE_CLASSES = tw(
	'inline-flex items-center justify-center',
	'h-12 w-50 px-6',
	'rounded-control',
	'bg-bg-surface',
	'text-label text-text-secondary',
	'cursor-pointer',
	'hover:bg-bg-selected',
	'focus-visible:outline-none',
	'focus-visible:ring-2 focus-visible:ring-border-focus',
	'focus-visible:ring-offset-2'
)

const ACTIVE_CLASSES = tw(
	'text-action-primary!',
	'border-b-3 border-border-focus'
)

const DISABLED_CLASSES = tw(
	'cursor-not-allowed!',
	'opacity-50',
	'hover:bg-bg-surface',
	'focus-visible:ring-0'
)

export const UITab = ({
	label,
	disabled = false,
	active = false,
	onClick,
	className
}: UITabProps) => {
	const classes = tw(
		BASE_CLASSES,
		active && ACTIVE_CLASSES,
		disabled && DISABLED_CLASSES,
		className
	)

	return (
		<button
			type='button'
			className={classes}
			disabled={disabled}
			onClick={onClick}
		>
			{label}
		</button>
	)
}
