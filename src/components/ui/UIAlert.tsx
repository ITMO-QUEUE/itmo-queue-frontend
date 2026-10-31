import AchtungIcon from '@/assets/icons/Achtung.svg'
import BellIcon from '@/assets/icons/Bell.svg'
import CheckIcon from '@/assets/icons/Check.svg'
import CrossIcon from '@/assets/icons/Cross.svg'
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

const BASE_CLASSES = tw(
	'flex w-full items-start gap-3',
	'rounded-control border px-4 py-3'
)

const TONE_CLASSES: Record<UIAlertTone, string> = {
	[UIAlertTone.ERROR]: tw('border-status-danger/30 bg-status-danger-bg'),
	[UIAlertTone.WARNING]: tw('border-status-warning/30 bg-status-warning-bg'),
	[UIAlertTone.SUCCESS]: tw('border-status-success/30 bg-status-success-bg'),
	[UIAlertTone.INFO]: tw('border-action-primary/30 bg-bg-selected')
}

const TITLE_CLASSES: Record<UIAlertTone, string> = {
	[UIAlertTone.ERROR]: 'text-status-danger',
	[UIAlertTone.WARNING]: 'text-status-warning',
	[UIAlertTone.SUCCESS]: 'text-status-success',
	[UIAlertTone.INFO]: 'text-action-primary'
}

const TONE_ICONS: Record<UIAlertTone, string> = {
	[UIAlertTone.ERROR]: CrossIcon,
	[UIAlertTone.WARNING]: AchtungIcon,
	[UIAlertTone.SUCCESS]: CheckIcon,
	[UIAlertTone.INFO]: BellIcon
}

export const UIAlert = ({ tone, message, title }: UIAlertProps) => {
	const isError = tone === UIAlertTone.ERROR

	return (
		<div
			role={isError ? 'alert' : 'status'}
			className={tw(BASE_CLASSES, TONE_CLASSES[tone])}
		>
			<img
				src={TONE_ICONS[tone]}
				alt=''
				aria-hidden='true'
				className='mt-0.5 size-icon shrink-0 select-none'
				draggable={false}
			/>

			<div className='flex flex-col gap-0.5'>
				{title && (
					<p className={tw('text-label', TITLE_CLASSES[tone])}>{title}</p>
				)}
				<p className='text-small text-text-primary'>{message}</p>
			</div>
		</div>
	)
}