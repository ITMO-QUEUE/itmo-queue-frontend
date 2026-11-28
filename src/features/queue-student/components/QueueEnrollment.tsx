import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { enrollInQueue, getAllWorks } from '../../../app/api/queues/queues.api'
import type {
	QueueDetail,
	WorkRead
} from '../../../app/api/queues/queues.api.d'
import { UIAlert, UIAlertTone } from '../../../components/ui/UIAlert'
import { StudentEntryCard } from './StudentEntryCard'

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
		<div className='grid items-start gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]'>
			<label className='flex cursor-pointer items-start gap-2 py-2 text-small'>
				<input
					type='checkbox'
					className='mt-0.5 size-4 shrink-0 accent-action-primary'
					checked={ selected }
					disabled={ disabled }
					onChange={ event => onToggle( event.target.checked ) }
				/>
				{ work.title } · приоритет { priority }
			</label>
			{ selected && (
				<div className='flex flex-col gap-2'>
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
			{ registrationOpen && quota !== null && mainCount >= quota && (
				<UIAlert
					tone={ UIAlertTone.WARNING }
					title='Основная группа заполнена'
					message={ `Квота: ${ quota }. Новая запись попадёт в резерв. Участие не гарантировано.` }
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
			<button
				type='submit'
				disabled={
					! registrationOpen || enrollment.isPending || selectedCount === 0
				}
				className='min-h-11 self-start rounded-control bg-action-primary px-5 py-2 text-label text-text-inverse enabled:cursor-pointer enabled:hover:bg-action-hover disabled:bg-disabled-bg disabled:text-disabled-text'
			>
				{ enrollment.isPending ? (
					<span>Отправляем…</span>
				) : selectedCount ? (
					`Записаться · выбрано работ: ${ selectedCount }`
				) : (
					'Записаться на защиту'
				) }
			</button>
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
			<h2 className='text-section'>Запись на защиту</h2>
			<p className='text-small text-text-secondary'>
				Выберите работы и добавьте ссылку на артефакт для каждой.
			</p>
			{ isPending && <p>Загрузка работ…</p> }
			{ isError && (
				<button
					type='button'
					onClick={ () => refetch() }
				>
					Не удалось загрузить работы. Повторить
				</button>
			) }
			{ data && works.length === 0 && <p>Нет доступных работ.</p> }
			{ ! registrationOpen && (
				<UIAlert
					tone={ UIAlertTone.WARNING }
					title='Запись закрыта'
					message='На эту защиту больше нельзя записаться.'
				/>
			) }
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
