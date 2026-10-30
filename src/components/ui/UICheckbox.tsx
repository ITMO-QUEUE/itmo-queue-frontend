import { tw } from '../../libs/utils'

interface UICheckboxProps {
	label: string
	checked: boolean
	onChange: ( checked: boolean ) => void
	disabled?: boolean
}

const BASE_CLASSES = tw(
	'inline-flex items-center gap-3',
	'font-nunito text-small text-text-primary',
	'cursor-pointer',
	'has-disabled:cursor-not-allowed has-disabled:text-disabled-text'
)

const INPUT_CLASSES = tw(
	'size-5 shrink-0 appearance-none rounded-control',
	'border border-border-control bg-bg-surface',
	'checked:bg-action-primary',
	'focus:outline-none focus:border-border-focus',
	'checked:focus-visible:outline-2 checked:focus-visible:outline-offset-2',
	'checked:focus-visible:outline-border-focus',
	'cursor-pointer disabled:cursor-not-allowed',
	'disabled:checked:bg-disabled-bg'
)

export const UICheckbox = ( {
	label,
	checked,
	onChange,
	disabled = false
}: UICheckboxProps ) => {
	return (
		<label className={ BASE_CLASSES }>
			<input
				type='checkbox'
				checked={ checked }
				onChange={ event => onChange( event.currentTarget.checked ) }
				disabled={ disabled }
				className={ INPUT_CLASSES }
			/>
			<span>{ label }</span>
		</label>
	)
}
