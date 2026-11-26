import { useState } from 'react'
import { UIButton, UIButtonTone } from '@/components/ui/UIButton'
import { UICheckbox } from '@/components/ui/UICheckbox'
import { UIInput } from '@/components/ui/UIInput'
import type { UISelectOption } from '@/components/ui/UISelect'
import { UISelect } from '@/components/ui/UISelect'
import { useAuthStore } from '../../../stores/useAuthStore'

// ============================================================================
// ТИПЫ ДАННЫХ И ПРОПСЫ
// ============================================================================

interface DisciplineOption extends UISelectOption {
	value: string // discipline_id
	label: string // discipline title
}

interface TeacherOption extends UISelectOption {
	value: string // teacher_id
	label: string // teacher name
}

interface CreateDefenseSessionModalProps {
	teachers: { id: string; name: string; discipline_ids: string[] }[]
	disciplines: { id: string; name: string }[]
	onClose: () => void
	onSubmit: ( payload: CreateDefenseSessionPayload ) => Promise< void >
}

export interface CreateDefenseSessionPayload {
	title: string
	description: string

	planned_start: string
	planned_end: string

	auditorium?: string
	onlineLink?: string

	avg_duration_min: number
	quota: number

	registration_open?: boolean

	discipline_id: string
	teacher_ids: string[]
	works: {
		title: string
		priority: number
	}[]
}

interface TeacherRow {
	name: string
	id: string
	position_no: number
}

interface WorkRow {
	localId: string // локальный ключ для React-списка (в payload не уходит)
	title: string
	priority: string
}

interface FormErrors {
	discipline?: string
	title?: string
	description?: string
	date?: string
	startTime?: string
	endTime?: string
	auditorium?: string
	onlineLink?: string
	avgDuration?: string
	quota?: string
	teachers?: string
	works?: string
}

// ============================================================================
// ВАЛИДАЦИЯ И МАСКИ
// ============================================================================

const formatDateInput = ( value: string ) => {
	const digits = value.replace( /\D/g, '' ).slice( 0, 8 )

	if ( digits.length <= 2 ) {
		return digits
	}

	if ( digits.length <= 4 ) {
		return `${ digits.slice( 0, 2 ) }.${ digits.slice( 2 ) }`
	}

	return `${ digits.slice( 0, 2 ) }.${ digits.slice( 2, 4 ) }.${ digits.slice( 4 ) }`
}

const formatTimeInput = ( value: string ) => {
	const digits = value.replace( /\D/g, '' ).slice( 0, 4 )

	if ( digits.length <= 2 ) {
		return digits
	}

	return `${ digits.slice( 0, 2 ) }:${ digits.slice( 2 ) }`
}

const isValidDate = ( value: string ) => {
	if ( ! /^\d{2}\.\d{2}\.\d{4}$/.test( value ) ) {
		return false
	}

	const [ day, month, year ] = value.split( '.' ).map( Number )
	const date = new Date( year, month - 1, day )

	return (
		date.getFullYear() === year &&
		date.getMonth() === month - 1 &&
		date.getDate() === day
	)
}

const isValidTime = ( value: string ) => {
	if ( ! /^\d{2}:\d{2}$/.test( value ) ) {
		return false
	}

	const [ hours, minutes ] = value.split( ':' ).map( Number )

	return hours <= 23 && minutes <= 59
}

const isValidUrl = ( value: string ) => {
	try {
		const url = new URL( value )
		return url.protocol === 'http:' || url.protocol === 'https:'
	} catch {
		return false
	}
}

const validatePositiveInteger = ( value: string ) =>
	/^[1-9]\d*$/.test( value ) && Number.isSafeInteger( Number( value ) )

const toISOString = ( date: string, time: string ) => {
	const [ day, month, year ] = date.split( '.' ).map( Number )
	const [ hours, minutes ] = time.split( ':' ).map( Number )

	return new Date( year, month - 1, day, hours, minutes ).toISOString()
}

const MAX_TEXT_LENGTH = 100

// ============================================================================
// РЕАЛИЗАЦИЯ КОМПОНЕНТА
// ============================================================================

export const CreateDefenseSessionModal = ( {
	teachers,
	disciplines,
	onClose,
	onSubmit
}: CreateDefenseSessionModalProps ) => {
	const user = useAuthStore( state => state.user )

	const [ disciplineId, setDisciplineId ] = useState( '' )
	const [ title, setTitle ] = useState( '' )
	const [ description, setDescription ] = useState( '' )
	const [ date, setDate ] = useState( '' )
	const [ startTime, setStartTime ] = useState( '' )
	const [ endTime, setEndTime ] = useState( '' )
	const [ auditorium, setAuditorium ] = useState( '' )
	const [ onlineLink, setOnlineLink ] = useState( '' )
	const [ avgDuration, setAvgDuration ] = useState( '10' )
	const [ quota, setQuota ] = useState( '12' )
	const [ isOnline, setIsOnline ] = useState( false )

	const [ teacherRows, setTeacherRows ] = useState< TeacherRow[] >( () =>
		user ? [ { id: user.id, name: user.name, position_no: 1 } ] : []
	)

	const [ workRows, setWorkRows ] = useState< WorkRow[] >( [] )
	const [ errors, setErrors ] = useState< FormErrors >( {} )
	const [ loading, setLoading ] = useState( false )

	if ( ! user ) {
		return null
	}

	// Преобразование списков в формат для UISelect
	const disciplineOptions: DisciplineOption[] = disciplines.map( d => ( {
		value: d.id,
		label: d.name
	} ) )

	const filteredTeachers = disciplineId
		? teachers.filter( teacher =>
				teacher.discipline_ids.includes( disciplineId )
			)
		: teachers

	const teacherOptions: TeacherOption[] = filteredTeachers.map( t => ( {
		value: t.id,
		label: t.name
	} ) )

	// Обеспечиваем наличие имени текущего пользователя в options,
	// даже если выбранная дисциплина не указана в его списке
	const creatorOptions: TeacherOption[] = teacherOptions.some(
		opt => opt.value === user.id
	)
		? teacherOptions
		: [ { value: user.id, label: user.name }, ...teacherOptions ]

	const updateDiscipline = ( value: string ) => {
		setDisciplineId( value )

		setTeacherRows( [
			{
				id: user.id,
				name: user.name,
				position_no: 1
			}
		] )

		setErrors( current => ( {
			...current,
			discipline: undefined,
			teachers: undefined
		} ) )
	}

	const addTeacher = () => {
		setTeacherRows( current => [
			...current,
			{
				id: '',
				name: '',
				position_no: current.length + 1
			}
		] )
	}

	const removeTeacher = ( positionNo: number ) => {
		setTeacherRows( current =>
			current
				.filter( teacher => teacher.position_no !== positionNo )
				.map( ( teacher, index ) => ( {
					...teacher,
					position_no: index + 1
				} ) )
		)
	}

	const updateTeacher = ( positionNo: number, selectedTeacherId: string ) => {
		const selectedTeacher = teachers.find( t => t.id === selectedTeacherId )

		setTeacherRows( current =>
			current.map( teacher =>
				teacher.position_no === positionNo
					? {
							...teacher,
							id: selectedTeacherId,
							name: selectedTeacher?.name ?? ''
						}
					: teacher
			)
		)
	}

	const addWork = () => {
		setWorkRows( current => [
			...current,
			{
				localId: crypto.randomUUID(),
				title: '',
				priority: String( current.length + 1 )
			}
		] )
	}

	const removeWork = ( localId: string ) => {
		setWorkRows( current => current.filter( work => work.localId !== localId ) )
	}

	const updateWork = (
		localId: string,
		field: 'title' | 'priority',
		value: string
	) => {
		setWorkRows( current =>
			current.map( work =>
				work.localId === localId ? { ...work, [ field ]: value } : work
			)
		)
	}

	const validate = (): FormErrors => {
		const nextErrors: FormErrors = {}

		if ( ! disciplineId ) {
			nextErrors.discipline = 'Выберите дисциплину'
		}

		if ( ! title.trim() ) {
			nextErrors.title = 'Введите название'
		} else if ( title.length > MAX_TEXT_LENGTH ) {
			nextErrors.title = 'Максимум 100 символов'
		}

		if ( description.length > MAX_TEXT_LENGTH ) {
			nextErrors.description = 'Максимум 100 символов'
		}

		if ( ! isValidDate( date ) ) {
			nextErrors.date = 'Введите дату в формате ДД.ММ.ГГГГ'
		}

		if ( ! isValidTime( startTime ) ) {
			nextErrors.startTime = 'Введите время в формате ЧЧ:ММ'
		}

		if ( ! isValidTime( endTime ) ) {
			nextErrors.endTime = 'Введите время в формате ЧЧ:ММ'
		}
		if ( isOnline ) {
			const trimmedOnlineLink = onlineLink.trim()
			if ( ! trimmedOnlineLink ) {
				nextErrors.onlineLink = 'Введите ссылку на онлайн-встречу'
			} else if ( ! isValidUrl( trimmedOnlineLink ) ) {
				nextErrors.onlineLink =
					'Введите корректную ссылку (http:// или https://)'
			}
		} else {
			const trimmedAuditorium = auditorium.trim()
			if ( ! trimmedAuditorium ) {
				nextErrors.auditorium = 'Введите номер аудитории'
			} else if ( ! validatePositiveInteger( trimmedAuditorium ) ) {
				nextErrors.auditorium =
					'Введите номер аудитории (целое положительное число)'
			}
		}

		if ( ! validatePositiveInteger( avgDuration ) ) {
			nextErrors.avgDuration = 'Введите положительное целое число'
		}

		if ( ! validatePositiveInteger( quota ) ) {
			nextErrors.quota = 'Введите положительное целое число'
		}

		const teacherIds = teacherRows.map( teacher => teacher.id )

		if ( teacherIds.some( id => ! id ) ) {
			nextErrors.teachers = 'Выберите преподавателя'
		} else if ( new Set( teacherIds ).size !== teacherIds.length ) {
			nextErrors.teachers = 'Преподаватель уже добавлен'
		}

		if ( workRows.length === 0 ) {
			nextErrors.works = 'Добавьте хотя бы одну работу'
		} else if ( workRows.some( work => ! work.title.trim() ) ) {
			nextErrors.works = 'Введите название каждой работы'
		} else if ( workRows.some( work => work.title.length > MAX_TEXT_LENGTH ) ) {
			nextErrors.works = 'Название работы не может превышать 100 символов'
		} else if (
			workRows.some( work => ! validatePositiveInteger( work.priority ) )
		) {
			nextErrors.works = 'Приоритет должен быть положительным целым числом'
		} else {
			const priorities = workRows.map( work => work.priority )
			if ( new Set( priorities ).size !== priorities.length ) {
				nextErrors.works = 'Приоритеты работ должны быть уникальными'
			}
		}

		return nextErrors
	}

	const handleSubmit = async () => {
		const nextErrors = validate()
		setErrors( nextErrors )

		if ( Object.keys( nextErrors ).length > 0 ) {
			return
		}

		const trimmedAuditorium = auditorium.trim()
		const trimmedOnlineLink = onlineLink.trim()

		const payload: CreateDefenseSessionPayload = {
			discipline_id: disciplineId,
			title: title.trim(),
			description: description.trim(),
			planned_start: toISOString( date, startTime ),
			planned_end: toISOString( date, endTime ),
			...( isOnline
				? { onlineLink: onlineLink.trim() }
				: { auditorium: auditorium.trim() } ),
			avg_duration_min: Number( avgDuration ),
			quota: Number( quota ),
			registration_open: true,
			teacher_ids: teacherRows.map( teacher => teacher.id ),
			works: workRows.map( work => ( {
				title: work.title.trim(),
				priority: Number( work.priority )
			} ) )
		}

		setLoading( true )

		try {
			await onSubmit( payload )
			onClose()
		} finally {
			setLoading( false )
		}
	}

	const renderTextField = (
		label: string,
		value: string,
		onChange: ( value: string ) => void,
		error?: string,
		placeholder?: string
	) => (
		<UIInput
			label={ label }
			value={ value }
			onChange={ onChange }
			placeholder={ placeholder }
			error={ error }
		/>
	)

	return (
		<div
			role='dialog'
			aria-modal='true'
			aria-labelledby='create-session-title'
			className='w-full max-w-6xl rounded-dialog bg-bg-surface font-nunito text-text-primary'
		>
			<form
				className='flex max-h-[90vh] flex-col'
				onSubmit={ event => {
					event.preventDefault()
					void handleSubmit()
				} }
			>
				<div className='overflow-y-auto p-6'>
					<h2
						id='create-session-title'
						className='text-section'
					>
						Новый сеанс защиты
					</h2>

					<p className='mt-2 text-body text-text-secondary'>
						После создания откроется предварительная запись
					</p>

					<div className='mt-8 grid grid-cols-1 gap-4 md:grid-cols-2'>
						<UISelect
							label='Дисциплина'
							value={ disciplineId }
							onChange={ updateDiscipline }
							options={ disciplineOptions }
							placeholder='Выберите дисциплину'
							error={ errors.discipline }
							required
							fullWidth
						/>

						{ renderTextField(
							'Название',
							title,
							value => setTitle( value.slice( 0, MAX_TEXT_LENGTH ) ),
							errors.title
						) }
					</div>

					<div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
						{ renderTextField(
							'Дата',
							date,
							value => setDate( formatDateInput( value ) ),
							errors.date,
							'ДД.ММ.ГГГГ'
						) }

						{ renderTextField(
							'Начало',
							startTime,
							value => setStartTime( formatTimeInput( value ) ),
							errors.startTime,
							'ЧЧ:ММ'
						) }

						{ renderTextField(
							'Плановое окончание',
							endTime,
							value => setEndTime( formatTimeInput( value ) ),
							errors.endTime,
							'ЧЧ:ММ'
						) }
					</div>

					<div className='mt-4 flex flex-col gap-3'>
						<UICheckbox
							label='Онлайн'
							checked={ isOnline }
							onChange={ checked => {
								setIsOnline( checked )
								setErrors( current => ( {
									...current,
									auditorium: undefined,
									onlineLink: undefined
								} ) )
							} }
						/>

						{ isOnline
							? renderTextField(
									'Ссылка на онлайн-встречу',
									onlineLink,
									value => setOnlineLink( value.trim() ),
									errors.onlineLink,
									'https://...'
								)
							: renderTextField(
									'Аудитория',
									auditorium,
									value =>
										setAuditorium(
											value.replace( /\D/g, '' ).replace( /^0+/, '' )
										),
									errors.auditorium,
									'Например: 412'
								) }
					</div>

					<div className='mt-4'>
						{ renderTextField(
							'Описание',
							description,
							value => setDescription( value.slice( 0, MAX_TEXT_LENGTH ) ),
							errors.description
						) }
					</div>

					<section className='mt-4 rounded-control border border-border-subtle p-4'>
						<h3 className='text-section'>Преподаватели</h3>

						<p className='mt-2 text-body text-text-secondary'>
							Преподаватель, создающий очередь, закреплён первым.
						</p>

						<div className='mt-4 flex flex-col gap-4'>
							{ teacherRows.map( ( teacher, index ) => (
								<div
									key={ teacher.position_no }
									className='flex items-end gap-3'
								>
									<div className='min-w-0 flex-1'>
										<UISelect
											label='Преподаватель'
											value={ teacher.id }
											onChange={ value =>
												updateTeacher( teacher.position_no, value )
											}
											options={ index === 0 ? creatorOptions : teacherOptions }
											placeholder='Выберите преподавателя'
											disabled={ index === 0 }
											error={ errors.teachers }
											fullWidth
										/>
									</div>

									{ index > 0 && (
										<button
											type='button'
											aria-label='Удалить преподавателя'
											onClick={ () => removeTeacher( teacher.position_no ) }
											className='mb-1 flex size-10 shrink-0 items-center justify-center rounded-control text-text-secondary hover:bg-bg-selected'
										>
											−
										</button>
									) }
								</div>
							) ) }
						</div>

						<div className='mt-4'>
							<UIButton
								label='+ Добавить преподавателя'
								tone={ UIButtonTone.SECONDARY }
								onClick={ addTeacher }
							/>
						</div>
					</section>

					<section className='mt-4 rounded-control border border-border-subtle p-4'>
						<h3 className='text-section'>Работы и приоритеты</h3>

						<p className='mt-2 text-body text-text-secondary'>
							Укажите названия работ и порядок их приоритета при записи.
						</p>

						<div className='mt-4 flex flex-col gap-4'>
							{ workRows.map( work => (
								<div
									key={ work.localId }
									className='flex items-end gap-3'
								>
									<div className='min-w-0 flex-1'>
										{ renderTextField(
											'Название работы',
											work.title,
											value =>
												updateWork(
													work.localId,
													'title',
													value.slice( 0, MAX_TEXT_LENGTH )
												),
											errors.works
										) }
									</div>

									<div className='w-32 shrink-0'>
										{ renderTextField(
											'Приоритет',
											work.priority,
											value =>
												updateWork(
													work.localId,
													'priority',
													value.replace( /\D/g, '' ).replace( /^0+/, '' )
												),
											errors.works
										) }
									</div>

									<button
										type='button'
										aria-label='Удалить работу'
										onClick={ () => removeWork( work.localId ) }
										className='mb-1 flex size-10 shrink-0 items-center justify-center rounded-control text-text-secondary hover:bg-bg-selected'
									>
										−
									</button>
								</div>
							) ) }
						</div>

						<div className='mt-4'>
							<UIButton
								label='+ Добавить работу'
								tone={ UIButtonTone.SECONDARY }
								onClick={ addWork }
							/>
						</div>
					</section>

					<div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
						{ renderTextField(
							'Время на студента, мин',
							avgDuration,
							value =>
								setAvgDuration(
									value.replace( /\D/g, '' ).replace( /^0+/, '' )
								),
							errors.avgDuration
						) }

						{ renderTextField(
							'Квота сеанса',
							quota,
							value =>
								setQuota( value.replace( /\D/g, '' ).replace( /^0+/, '' ) ),
							errors.quota
						) }
					</div>

					<p className='mt-4 text-caption text-text-secondary'>
						Плановое время не запускает и не завершает защиту автоматически.
					</p>
				</div>

				<footer className='flex justify-end gap-3 border-t border-border-subtle p-6'>
					<UIButton
						label='Создать и открыть запись'
						tone={ UIButtonTone.PRIMARY }
						onClick={ () => void handleSubmit() }
						loading={ loading }
						disabled={ loading }
					/>

					<UIButton
						label='Отмена'
						tone={ UIButtonTone.SECONDARY }
						onClick={ onClose }
						disabled={ loading }
					/>
				</footer>
			</form>
		</div>
	)
}
