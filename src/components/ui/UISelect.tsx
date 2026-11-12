import { useId } from 'react'
import ChevronDownIcon from '@/assets/icons/ChevronDown.svg'
import { tw } from '../../libs/utils'
import { getHelperId, UIFieldHelper, UIFieldLabel } from './UIField'

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
	hint?: string
	error?: string
	required?: boolean
	disabled?: boolean
	fullWidth?: boolean
}

const SELECT_CLASSES = tw(
	'h-11 appearance-none pl-3 pr-11',
	'w-full',
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

const CHEVRON_CLASSES = tw(
	'pointer-events-none absolute top-1/2 right-3',
	'size-icon -translate-y-1/2 select-none'
)

export const UISelect = ({
	label,
	value,
	onChange,
	options,
	placeholder = 'Выберите вариант',
	hint,
	error,
	required = false,
	disabled = false,
	fullWidth = false
}: UISelectProps) => {
	const id = useId()
	const helperId = getHelperId(id, error, hint)

	return (
		<div className={tw('flex flex-col gap-2', fullWidth ? 'w-full' : 'w-86')}>
			<UIFieldLabel
				htmlFor={id}
				label={label}
				required={required}
			/>

			<div className='relative'>
				<select
					id={id}
					value={value}
					onChange={event => onChange(event.currentTarget.value)}
					required={required}
					disabled={disabled}
					aria-invalid={Boolean(error)}
					aria-describedby={helperId}
					className={tw(
						SELECT_CLASSES,
						value === '' ? 'text-text-secondary' : 'text-text-primary',
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
					className={CHEVRON_CLASSES}
					draggable={false}
				/>
			</div>

			<UIFieldHelper
				id={`${id}-helper`}
				error={error}
				hint={hint}
			/>
		</div>
	)
}
