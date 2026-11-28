import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useId, useState } from 'react'
import CheckIcon from '@/assets/icons/Check.svg'
import { enrollInQueue, getAllWorks } from '../../../app/api/queues/queues.api'
import type {
	QueueDetail,
	WorkRead
} from '../../../app/api/queues/queues.api.d'
import { UIAlert, UIAlertTone } from '../../../components/ui/UIAlert'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { UICheckbox } from '../../../components/ui/UICheckbox'
import { StudentEntryCard } from './StudentEntryCard'

const LAB_PREFIX = /^Лабораторная работа №\s*/iu
const workPluralRules = new Intl.PluralRules( 'ru-RU' )
const workLabels = {
	one: 'работа',
	few: 'работы',
	many: 'работ',
	other: 'работ',
	zero: 'работ',
	two: 'работ'
}

interface EnrollmentProps {
	queue: QueueDetail
}

interface EnrollmentFormProps extends EnrollmentProps {
	works: WorkRead[]
}

interface WorkFieldsProps {
	work: WorkRead
	priority: number
	selected: boolean
	url: string
	disabled: boolean
	onToggle: ( checked: boolean ) => void
	onUrlChange: ( value: string ) => void
}

export const WorkFields = ( {
	work,
	priority,
	selected,
	url,
	disabled,
	onToggle,
	onUrlChange
}: WorkFieldsProps ) => {
	const urlId = useId()

	return (
		<div className='grid w-full max-w-[46rem] items-start gap-3 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4'>
			<div className='relative flex min-h-6 items-center sm:mt-1'>
				<UICheckbox
					label={ `${ work.title.replace( LAB_PREFIX, 'ЛР № ' ) } · приоритет ${ priority }` }
					checked={ selected }
					disabled={ disabled }
					onChange={ onToggle }
				/>
				{ selected && (
					<img
						src={ CheckIcon }
						alt=''
						aria-hidden='true'
						className='pointer-events-none absolute left-0 size-5 brightness-0 invert'
					/>
				) }
			</div>
			{ selected && (
				<div className='flex min-w-0 flex-col gap-1.5'>
					<label
						htmlFor={ urlId }
						className='text-label'
					>
						Ссылка на код / артефакт *
					</label>
					<input
						id={ urlId }
						type='url'
						value={ url }
						required
						disabled={ disabled }
						onChange={ event => onUrlChange( event.target.value ) }
						placeholder='https://github.com/...'
						aria-describedby={ `${ urlId }-hint` }
						className='h-11 w-full rounded-control border border-border-control px-3 text-small'
					/>
					<p
						id={ `${ urlId }-hint` }
						className='text-caption text-text-secondary'
					>
						Ссылка обязательна для каждой выбранной работы.
					</p>
				</div>
			) }
		</div>
	)
}

const RegistrationClosedAlert = () => (
	<UIAlert
		tone={ UIAlertTone.WARNING }
		title='Запись закрыта'
		message='На эту защиту больше нельзя записаться.'
	/>
)

const EnrollmentForm = ( { queue, works }: EnrollmentFormProps ) => {
	const [ artifacts, setArtifacts ] = useState< Record< string, string > >( {} )
	const queryClient = useQueryClient()
	const selectedCount = Object.keys( artifacts ).length
	const registrationOpen = queue.registration_open && queue.stage !== 'finished'
	const quota = queue.quota
	const mainCount = queue.students.filter(
		participant => participant.position !== null && ! participant.is_reserve
	).length

	const enrollment = useMutation( {
		mutationFn: () =>
			enrollInQueue( queue.id, {
				works: Object.entries( artifacts ).map( ( [ work_id, url ] ) => ( {
					work_id,
					artifact_url: url.trim()
				} ) )
			} ),
		onSuccess: async () => {
			await queryClient.invalidateQueries( {
				queryKey: [ 'queue', queue.id ]
			} )
		}
	} )

	const toggleWork = ( id: string, checked: boolean ) => {
		setArtifacts( previous => {
			const next = { ...previous }
			if ( checked ) {
				next[ id ] = ''
			} else {
				delete next[ id ]
			}
			return next
		} )
	}

	return (
		<form
			className='flex flex-col gap-4'
			onSubmit={ event => {
				event.preventDefault()
				if ( registrationOpen && selectedCount > 0 && ! enrollment.isPending ) {
					enrollment.mutate()
				}
			} }
		>
			{ works.map( work => (
				<WorkFields
					key={ work.id }
					work={ work }
					priority={
						queue.works.find( item => item.work_id === work.id )?.priority ?? 0
					}
					selected={ Object.hasOwn( artifacts, work.id ) }
					url={ artifacts[ work.id ] ?? '' }
					disabled={ ! registrationOpen || enrollment.isPending }
					onToggle={ checked => toggleWork( work.id, checked ) }
					onUrlChange={ value =>
						setArtifacts( previous => ( { ...previous, [ work.id ]: value } ) )
					}
				/>
			) ) }
			{ ! registrationOpen && <RegistrationClosedAlert /> }
			{ registrationOpen && quota !== null && mainCount >= quota && (
				<UIAlert
					tone={ UIAlertTone.WARNING }
					title='Основная группа заполнена'
					message={ `Квота ${ quota }, уже записаны ${ mainCount } студентов. Вы попадёте в резерв; участие не гарантировано.` }
				/>
			) }
			{ registrationOpen && enrollment.isError && (
				<p
					role='alert'
					className='text-small text-status-danger'
				>
					Не удалось записаться. Возможно, запись уже закрыта или вы уже
					записаны. Обновите страницу и повторите попытку.
				</p>
			) }
			<div className='self-start'>
				<UIButton
					label={
						selectedCount
							? `Записаться · ${ selectedCount } ${ workLabels[ workPluralRules.select( selectedCount ) ] }`
							: 'Записаться на защиту'
					}
					tone={ UIButtonTone.PRIMARY }
					type='submit'
					disabled={ ! registrationOpen || selectedCount === 0 }
					loading={ enrollment.isPending }
				/>
			</div>
			{ selectedCount > 0 && (
				<p className='text-caption font-bold text-text-secondary'>
					{ selectedCount }{ ' ' }
					{ workLabels[ workPluralRules.select( selectedCount ) ] } выбрано для
					защиты
				</p>
			) }
		</form>
	)
}

export const QueueEnrollment = ( { queue }: EnrollmentProps ) => {
	const { data, isPending, isError, refetch } = useQuery( {
		queryKey: [ 'works' ],
		queryFn: getAllWorks,
		enabled: ! queue.my_entry
	} )

	if ( queue.my_entry ) {
		return <StudentEntryCard queue={ queue } />
	}

	const registrationOpen = queue.registration_open && queue.stage !== 'finished'

	const works = ( data ?? [] )
		.filter(
			work =>
				work.is_active && queue.works.some( item => item.work_id === work.id )
		)
		.sort( ( first, second ) => {
			const priority = ( id: string ) =>
				queue.works.find( item => item.work_id === id )?.priority ?? 0
			return priority( first.id ) - priority( second.id )
		} )

	return (
		<section className='flex flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6'>
			<h2 className='text-section font-semibold text-text-primary'>
				Запись на защиту
			</h2>
			<p className='text-small text-text-secondary'>
				Выберите работы и добавьте ссылку на артефакт для каждой.
			</p>
			{ isPending && <p>Загрузка работ…</p> }
			{ isError && (
				<UIButton
					label='Повторить загрузку работ'
					tone={ UIButtonTone.GHOST }
					onClick={ () => {
						void refetch()
					} }
					compact
				/>
			) }
			{ data && works.length === 0 && <p>Нет доступных работ.</p> }
			{ ( works.length > 0 || ! registrationOpen ) && (
				<EnrollmentForm
					key={ queue.id }
					queue={ queue }
					works={ works }
				/>
			) }
		</section>
	)
}
