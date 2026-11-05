import { useId, useState } from 'react'
import { tw } from '../../libs/utils'

export interface UINumberFieldProps {
	label: string
	value: number
	onChange: ( value: number ) => void
	disabled?: boolean
	helperText?: string
	error?: string
	id?: string
	name?: string
}

const BASE_CLASSES = tw(
	'flex h-11 w-full items-center rounded-control border px-1',
	'bg-bg-surface text-text-primary'
)

const BUTTON_CLASSES = tw(
	'flex size-8 shrink-0 items-center justify-center rounded-control',
	'cursor-pointer enabled:hover:bg-action-subtle-hover',
	'focus-visible:outline-2 focus-visible:outline-border-focus',
	'disabled:cursor-not-allowed'
)

const INPUT_CLASSES = tw(
	'min-w-8 max-w-full bg-transparent text-center text-small',
	'focus:outline-none disabled:cursor-not-allowed'
)

const STATE_CLASSES = {
	default: 'border-border-control focus-within:border-border-focus',
	error: 'border-status-danger',
	disabled: 'border-border-control bg-disabled-bg text-disabled-text'
}

const INTEGER_PATTERN = /^\d+$/

const isValidValue = ( value: number ) =>
	Number.isSafeInteger( value ) && value >= 1

export const UINumberField = ( {
	label,
	value,
	onChange,
	disabled = false,
	helperText = 'Точное значение редактируется с клавиатуры',
	error,
	id,
	name
}: UINumberFieldProps ) => {
	const generatedId = useId()
	const inputId = id ?? generatedId
	const descriptionId = `${ inputId }-description`
	const [ isEmpty, setIsEmpty ] = useState( false )
	const [ hasInputError, setHasInputError ] = useState( false )
	const validValue = isValidValue( value )
	const currentValue = validValue ? value : 1
	const errorMessage =
		error ||
		( hasInputError || ! validValue ? 'Введите положительное целое число' : '' )
	const displayValue = isEmpty ? '' : String( currentValue )

	const updateValue = ( nextValue: number ) => {
		if ( disabled ) return
		if ( ! isValidValue( nextValue ) ) {
			setHasInputError( true )
			return
		}
		setIsEmpty( false )
		setHasInputError( false )
		onChange( nextValue )
	}

	const handleInput = ( text: string ) => {
		if ( disabled ) return
		if ( text === '' ) {
			setIsEmpty( true )
			setHasInputError( true )
			return
		}
		if ( ! INTEGER_PATTERN.test( text ) ) {
			setHasInputError( true )
			return
		}
		updateValue( Number( text ) )
	}

	return (
		<div className='flex w-full flex-col gap-2 font-nunito'>
			<label
				htmlFor={ inputId }
				className='text-label text-text-primary'
			>
				{ label }
			</label>
			<div
				className={ tw(
					BASE_CLASSES,
					disabled
						? STATE_CLASSES.disabled
						: STATE_CLASSES[ errorMessage ? 'error' : 'default' ]
				) }
			>
				<button
					type='button'
					aria-label={ `Уменьшить: ${ label }` }
					aria-controls={ inputId }
					disabled={ disabled }
					onClick={ () => updateValue( currentValue - 1 ) }
					className={ BUTTON_CLASSES }
				>
					−
				</button>
				<input
					id={ inputId }
					name={ name }
					type='text'
					inputMode='numeric'
					pattern='[0-9]*'
					value={ displayValue }
					disabled={ disabled }
					aria-invalid={ Boolean( errorMessage ) }
					aria-describedby={ descriptionId }
					onChange={ event => handleInput( event.currentTarget.value ) }
					onBlur={ () => setIsEmpty( false ) }
					onKeyDown={ event => {
						if ( event.key === 'ArrowUp' || event.key === 'ArrowDown' ) {
							event.preventDefault()
							updateValue( currentValue + ( event.key === 'ArrowUp' ? 1 : -1 ) )
						}
					} }
					className={ INPUT_CLASSES }
					style={ { width: `${ Math.max( 2, displayValue.length + 1 ) }ch` } }
				/>
				<button
					type='button'
					aria-label={ `Увеличить: ${ label }` }
					aria-controls={ inputId }
					disabled={ disabled }
					onClick={ () => updateValue( currentValue + 1 ) }
					className={ BUTTON_CLASSES }
				>
					+
				</button>
			</div>
			<p
				id={ descriptionId }
				aria-live='polite'
				className={ tw(
					'text-caption',
					errorMessage ? 'text-status-danger' : 'text-text-secondary'
				) }
			>
				{ errorMessage || helperText }
			</p>
		</div>
	)
}
