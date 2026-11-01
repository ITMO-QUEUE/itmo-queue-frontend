import { useId } from 'react'
import ChevronDownIcon from '@/assets/icons/ChevronDown.svg'
import { tw } from '../../libs/utils'

export interface UISelectOption {
	value: string
	label: string
}

interface UISelectProps {
	label: string
	value: string
	onChange: (value: string) => void
	options: UISelectOption[]
	placeholder?: string
	error?: string
	disabled?: boolean
}

const LABEL_CLASSES = tw('text-label text-text-primary')

const SELECT_CLASSES = tw(
	'h-11 w-full appearance-none pl-3 pr-11',
	'font-nunito text-body',
	'rounded-control border border-border-control bg-bg-surface',
	'cursor-pointer',
	'focus:outline-none focus:border-border-focus',
	'focus:ring-2 focus:ring-border-focus/20',
	'disabled:cursor-not-allowed',
	'disabled:bg-disabled-bg disabled:text-disabled-text'
)

const ERROR_SELECT_CLASSES = tw(
	'border-status-danger',
	'focus:border-status-danger focus:ring-status-danger/20'
)

const ERROR_TEXT_CLASSES = tw('text-caption text-status-danger')

export const UISelect = ({
	label,
	value,
	onChange,
	options,
	placeholder = 'Выберите вариант',
	error,
	disabled = false
}: UISelectProps) => {
	const id = useId()
	const isEmpty = value === ''

	return (
		<div className='flex w-full flex-col gap-1.5'>
			<label
				htmlFor={id}
				className={LABEL_CLASSES}
			>
				{label}
			</label>

			<div className='relative'>
				<select
					id={id}
					value={value}
					onChange={event => onChange(event.currentTarget.value)}
					disabled={disabled}
					aria-invalid={Boolean(error)}
					aria-describedby={error ? `${id}-error` : undefined}
					className={tw(
						SELECT_CLASSES,
						isEmpty ? 'text-text-secondary' : 'text-text-primary',
						error ? ERROR_SELECT_CLASSES : ''
					)}
				>
					<option
						value=''
						disabled
					>
						{placeholder}
					</option>

					{options.map(option => (
						<option
							key={option.value}
							value={option.value}
						>
							{option.label}
						</option>
					))}
				</select>

				<img
					src={ChevronDownIcon}
					alt=''
					aria-hidden='true'
					className='pointer-events-none absolute top-1/2 right-3 size-icon -translate-y-1/2 select-none'
					draggable={false}
				/>
			</div>

			{error && (
				<p
					id={`${id}-error`}
					className={ERROR_TEXT_CLASSES}
				>
					{error}
				</p>
			)}
		</div>
	)
}