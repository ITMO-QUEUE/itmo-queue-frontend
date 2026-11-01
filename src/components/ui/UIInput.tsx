import { useId, useState } from 'react'
import EyeIcon from '@/assets/icons/Eye.svg'
import EyeOffIcon from '@/assets/icons/EyeOff.svg'
import { tw } from '../../libs/utils'

interface UIInputProps {
	label: string
	value: string
	onChange: (value: string) => void
	placeholder?: string
	type?: 'text' | 'password'
	error?: string
	disabled?: boolean
}

const LABEL_CLASSES = tw('text-label text-text-primary')

const INPUT_CLASSES = tw(
	'h-11 w-full px-3',
	'font-nunito text-body text-text-primary',
	'rounded-control border border-border-control bg-bg-surface',
	'placeholder:text-text-secondary',
	'focus:outline-none focus:border-border-focus',
	'focus:ring-2 focus:ring-border-focus/20',
	'disabled:cursor-not-allowed',
	'disabled:bg-disabled-bg disabled:text-disabled-text'
)

const ERROR_INPUT_CLASSES = tw(
	'border-status-danger',
	'focus:border-status-danger focus:ring-status-danger/20'
)

const ERROR_TEXT_CLASSES = tw('text-caption text-status-danger')

const EYE_BUTTON_CLASSES = tw(
	'absolute inset-y-0 right-0 flex w-11 items-center justify-center',
	'cursor-pointer disabled:cursor-not-allowed'
)

export const UIInput = ({
	label,
	value,
	onChange,
	placeholder,
	type = 'text',
	error,
	disabled = false
}: UIInputProps) => {
	const id = useId()
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	const isPassword = type === 'password'
	const inputType = isPassword && !isPasswordVisible ? 'password' : 'text'

	return (
		<div className='flex w-full flex-col gap-1.5'>
			<label
				htmlFor={id}
				className={LABEL_CLASSES}
			>
				{label}
			</label>

			<div className='relative'>
				<input
					id={id}
					type={inputType}
					value={value}
					onChange={event => onChange(event.currentTarget.value)}
					placeholder={placeholder}
					disabled={disabled}
					aria-invalid={Boolean(error)}
					aria-describedby={error ? `${id}-error` : undefined}
					className={tw(
						INPUT_CLASSES,
						isPassword ? 'pr-11' : '',
						error ? ERROR_INPUT_CLASSES : ''
					)}
				/>

				{isPassword && (
					<button
						type='button'
						onClick={() => setIsPasswordVisible(visible => !visible)}
						disabled={disabled}
						aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
						className={EYE_BUTTON_CLASSES}
					>
						<img
							src={isPasswordVisible ? EyeOffIcon : EyeIcon}
							alt=''
							aria-hidden='true'
							className='size-icon shrink-0 select-none'
							draggable={false}
						/>
					</button>
				)}
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