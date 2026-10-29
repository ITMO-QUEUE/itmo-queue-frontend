import Spinner from '@/assets/icons/Spinner.svg'
import { tw } from '../../libs/utils'

interface UIButtonProps {
	label: string
	onClick: () => void
	tone: UIButtonTone
	loading?: boolean
	disabled?: boolean
}

export enum UIButtonTone {
	PRIMARY = 'primary',
	SECONDARY = 'secondary',
	GHOST = 'ghost',
	DANGER = 'danger'
}

const BASE_CLASSES = tw(
	'inline-flex items-center justify-center gap-2',
	'text-label px-3 py-2 h-11 w-56',
	'rounded-control',
	'focus:outline-2 focus:outline-offset-2',
	'focus:outline-border-focus focus:border-0.5 focus:border-white',
	'disabled:cursor-not-allowed',
	'disabled:bg-disabled-bg disabled:text-disabled-text'
)

const TONE_CLASSES: Record<UIButtonTone, string> = {
	[UIButtonTone.PRIMARY]: tw(
		'text-text-inverse bg-action-primary',
		'enabled:hover:bg-action-hover',
		'enabled:active:bg-action-pressed'
	),

	[UIButtonTone.SECONDARY]: tw(
		'text-text-primary border border-border-control',
		'bg-bg-selected',
		'enabled:hover:bg-action-subtle-hover',
		'enabled:active:bg-action-subtle-pressed',
		'focus:bg-bg-selected'
	),

	[UIButtonTone.GHOST]: tw(
		'text-text-primary bg-transparent',
		'enabled:hover:bg-action-subtle-hover',
		'enabled:active:bg-action-subtle-pressed',
		'focus:bg-bg-surface'
	),

	[UIButtonTone.DANGER]: tw(
		'text-text-inverse bg-status-danger',
		'enabled:hover:bg-status-danger-hover',
		'enabled:active:bg-status-danger-pressed'
	)
}

export const UIButton = ({
	label,
	onClick,
	tone,
	disabled = false,
	loading = false
}: UIButtonProps) => {
	const isDisabled = disabled || loading

	return (
		<button
			type='button'
			onClick={onClick}
			disabled={isDisabled}
			aria-busy={loading}
			className={tw(BASE_CLASSES, TONE_CLASSES[tone])}
		>
			{loading && (
				<span
					aria-hidden='true'
					className='inline-flex shrink-0'
				>
					{loading && (
						<img
							src={Spinner}
							alt=''
							aria-hidden='true'
							className='size-5 shrink-0 animate-spin'
						/>
					)}
				</span>
			)}
			<span>{label}</span>
		</button>
	)
}
