import { useState } from 'react'
import { UIInput } from '../../../components/ui/UIInput'
import { UICheckbox } from '../../../components/ui/UICheckbox'

export interface AvailableQueueWork {
	id: string
	label: string
	linkRequired?: boolean
}

export const DEFAULT_QUEUE_WORKS: AvailableQueueWork[] = [
	{ id: 'lab-3', label: 'ЛР № 3', linkRequired: true },
	{ id: 'lab-4', label: 'ЛР № 4', linkRequired: true }
]

export interface TeacherQueueCreateValues {
	subject: string
	name: string
	date: string
	startTime: string
	endTime: string
	location: string
	teachers: string
	description: string
	works: Record< string, { selected: boolean; priority: string } >
	minutesPerStudent: string
	quota: string
}

export interface TeacherQueueCreateData
	extends Omit<
		TeacherQueueCreateValues,
		'works' | 'minutesPerStudent' | 'quota'
	> {
	works: Array< AvailableQueueWork & { priority: number } >
	minutesPerStudent: number
	quota: number
}

export interface TeacherQueueCreateProps {
	accountName?: string
	availableWorks?: AvailableQueueWork[]
	initialValues?: Partial< TeacherQueueCreateValues >
	onChange?: ( values: TeacherQueueCreateValues ) => void
	onSubmit?: ( data: TeacherQueueCreateData ) => void | Promise< void >
}

type Errors = Record< string, string >
const validTime = ( value: string ) => /^([01]\d|2[0-3]):[0-5]\d$/.test( value )
const positiveInteger = ( value: string ) =>
	/^\d+$/.test( value ) &&
	Number.isSafeInteger( Number( value ) ) &&
	Number( value ) >= 1

export function validateTeacherQueueCreate(
	values: TeacherQueueCreateValues,
	works: AvailableQueueWork[]
): Errors {
	const errors: Errors = {}
	const required = [
		'subject',
		'name',
		'date',
		'startTime',
		'endTime',
		'location',
		'teachers'
	] as const
	for ( const field of required ) {
		if ( ! values[ field ].trim() ) errors[ field ] = 'Обязательное поле'
	}
	if ( values.date ) {
		const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec( values.date )
		if ( ! match ) errors.date = 'Введите дату в формате ДД.ММ.ГГГГ'
		else {
			const [ , day, month, year ] = match.map( Number )
			const date = new Date( 0 )
			date.setFullYear( year, month - 1, day )
			if (
				year < 1 ||
				date.getFullYear() !== year ||
				date.getMonth() !== month - 1 ||
				date.getDate() !== day
			)
				errors.date = 'Укажите существующую дату'
		}
	}
	for ( const field of [ 'startTime', 'endTime' ] as const ) {
		if ( values[ field ] && ! validTime( values[ field ] ) )
			errors[ field ] = 'Введите время ЧЧ:ММ (00:00–23:59)'
	}
	if (
		validTime( values.startTime ) &&
		validTime( values.endTime ) &&
		values.endTime < values.startTime
	)
		errors.endTime = 'Окончание не может быть раньше начала'
	for ( const field of [ 'minutesPerStudent', 'quota' ] as const ) {
		if ( ! positiveInteger( values[ field ] ) )
			errors[ field ] = 'Введите целое число не менее 1'
	}
	for ( const work of works ) {
		const selection = values.works[ work.id ]
		if ( selection?.selected && ! positiveInteger( selection.priority ) )
			errors[ `work:${ work.id }` ] = 'Приоритет — целое число не менее 1'
	}
	return errors
}

export const TeacherQueueCreate = ( {
	accountName = 'Елена Ивановна',
	availableWorks = DEFAULT_QUEUE_WORKS,
	initialValues,
	onChange,
	onSubmit
}: TeacherQueueCreateProps ) => {
	const [ values, setValues ] = useState< TeacherQueueCreateValues >( () => ( {
		subject: '',
		name: '',
		date: '',
		startTime: '',
		endTime: '',
		location: '',
		teachers: accountName,
		description: '',
		works: {},
		minutesPerStudent: '10',
		quota: '12',
		...initialValues
	} ) )
	const [ touched, setTouched ] = useState< Record< string, boolean > >( {} )
	const [ submitted, setSubmitted ] = useState( false )
	const [ pending, setPending ] = useState( false )
	const [ submitError, setSubmitError ] = useState( '' )
	const errors = validateTeacherQueueCreate( values, availableWorks )
	const update = ( next: TeacherQueueCreateValues ) => {
		setValues( next )
		setSubmitError( '' )
		onChange?.( next )
	}
	const field = (
		key: Exclude< keyof TeacherQueueCreateValues, 'works' >,
		label: string,
		placeholder?: string
	) => (
		<div
			onBlur={ () =>
				setTouched( current => ( { ...current, [ key ]: true } ) )
			}
		>
			<UIInput
				label={ label }
				value={ values[ key ] }
				placeholder={ placeholder }
				disabled={ pending }
				onChange={ value => update( { ...values, [ key ]: value } ) }
				error={ submitted || touched[ key ] ? errors[ key ] : undefined }
			/>
		</div>
	)

	return (
		<form
			className='flex w-full flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6 font-nunito text-text-primary'
			noValidate
			onSubmit={ async event => {
				event.preventDefault()
				setSubmitted( true )
				if ( pending || Object.keys( errors ).length || ! onSubmit ) return
				setPending( true )
				setSubmitError( '' )
				try {
					await onSubmit( {
						...values,
						minutesPerStudent: Number( values.minutesPerStudent ),
						quota: Number( values.quota ),
						works: availableWorks
							.filter( work => values.works[ work.id ]?.selected )
							.map( work => ( {
								...work,
								priority: Number( values.works[ work.id ].priority )
							} ) )
					} )
				} catch {
					setSubmitError( 'Не удалось создать очередь. Попробуйте ещё раз.' )
				} finally {
					setPending( false )
				}
			} }
		>
			<div className='grid gap-4 md:grid-cols-2'>
				{ field( 'subject', 'Дисциплина', 'Программирование' ) }
				{ field( 'name', 'Название', 'Защита лабораторных работ' ) }
			</div>
			<div className='grid gap-4 md:grid-cols-3'>
				{ field( 'date', 'Дата', 'ДД.ММ.ГГГГ' ) }
				{ field( 'startTime', 'Начало', 'ЧЧ:ММ' ) }
				{ field( 'endTime', 'Плановое окончание', 'ЧЧ:ММ' ) }
			</div>
			{ field( 'location', 'Место или ссылка', 'Аудитория 305' ) }
			{ field( 'teachers', 'Преподаватели' ) }
			{ field( 'description', 'Описание' ) }
			<section
				className='flex flex-col gap-4 rounded-card border border-border-subtle p-4'
				aria-label='Работы и приоритеты'
			>
				<h2 className='text-subheading font-bold'>Работы и приоритеты</h2>
				{ availableWorks.map( work => {
					const selection = values.works[ work.id ] ?? {
						selected: false,
						priority: '1'
					}
					return (
						<div
							key={ work.id }
							className='grid items-start gap-4 md:grid-cols-[1fr_1.4fr_1.8fr]'
						>
							<div className='pt-2 md:justify-self-center'>
								<UICheckbox
									label={ work.label }
									checked={ selection.selected }
									disabled={ pending }
									onChange={ selected =>
										update( {
											...values,
											works: {
												...values.works,
												[ work.id ]: { ...selection, selected }
											}
										} )
									}
								/>
							</div>
							<div
								onBlur={ () =>
									setTouched( current => ( {
										...current,
										[ `work:${ work.id }` ]: true
									} ) )
								}
							>
								<UIInput
									label='Приоритет'
									value={ selection.priority }
									disabled={ pending || ! selection.selected }
									onChange={ priority =>
										update( {
											...values,
											works: {
												...values.works,
												[ work.id ]: { ...selection, priority }
											}
										} )
									}
									error={
										submitted || touched[ `work:${ work.id }` ]
											? errors[ `work:${ work.id }` ]
											: undefined
									}
								/>
							</div>
							{ work.linkRequired && (
								<p className='pt-2 text-small text-text-secondary'>
									Ссылка обязательна при записи
								</p>
							) }
						</div>
					)
				} ) }
				{ availableWorks.length === 0 && (
					<p className='text-small text-text-secondary'>Нет доступных работ</p>
				) }
			</section>
			<div className='grid gap-4 md:grid-cols-2'>
				{ field( 'minutesPerStudent', 'Время на студента, мин' ) }
				{ field( 'quota', 'Квота сеанса' ) }
			</div>
			{ submitError && (
				<p
					role='alert'
					className='text-small text-status-danger'
				>
					{ submitError }
				</p>
			) }
			{ onSubmit && (
				<button
					type='submit'
					disabled={ pending }
					className='h-11 self-start rounded-control bg-action-primary px-6 text-label text-text-inverse disabled:opacity-50'
				>
					{ pending ? 'Создание…' : 'Создать очередь' }
				</button>
			) }
		</form>
	)
}
