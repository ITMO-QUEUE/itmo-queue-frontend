import { tw } from '../../libs/utils'

export enum UIAlertTone {
	ERROR = 'error',
	WARNING = 'warning',
	SUCCESS = 'success',
	INFO = 'info'
}

interface UIAlertProps {
	tone: UIAlertTone
	message: string
	title?: string
}

const BASE_CLASSES = tw('flex w-full flex-col gap-1', 'rounded-control px-4 py-3')

const TONE_CLASSES: Record<UIAlertTone, string> = {
	[UIAlertTone.ERROR]: 'bg-status-danger-bg',
	[UIAlertTone.WARNING]: 'bg-status-warning-bg',
	[UIAlertTone.SUCCESS]: 'bg-status-success-bg',
	[UIAlertTone.INFO]: 'bg-bg-selected'
}

const TITLE_CLASSES: Record<UIAlertTone, string> = {
	[UIAlertTone.ERROR]: 'text-status-danger',
	[UIAlertTone.WARNING]: 'text-status-warning',
	[UIAlertTone.SUCCESS]: 'text-status-success',
	[UIAlertTone.INFO]: 'text-action-primary'
}

export const UIAlert = ({ tone, message, title }: UIAlertProps) => {
	const isError = tone === UIAlertTone.ERROR

	return (
		<div
			role={isError ? 'alert' : 'status'}
			className={tw(BASE_CLASSES, TONE_CLASSES[tone])}
		>
			{title && (
				<p className={tw('text-label', TITLE_CLASSES[tone])}>{title}</p>
			)}
			<p className='text-small text-text-primary'>{message}</p>
		</div>
	)
}