import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
	createWork,
	getAllWorks,
	updateQueueSession
} from '../../../app/api/queues/queues.api'
import type {
	QueueDetail,
	WorkRead
} from '../../../app/api/queues/queues.api.d'
import MinusIcon from '../../../assets/icons/Minus.svg'
import PenIcon from '../../../assets/icons/Pen.svg'
import { UIAlert, UIAlertTone } from '../../../components/ui/UIAlert'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { UIInput } from '../../../components/ui/UIInput'
import { getQueueErrorMessage } from '../utils/queueError'
import {
	createQueueSettingsDraft,
	type QueueSettingsDraft,
	toQueueSettingsPayload
} from '../utils/queueSettingsDraft'

const noop = () => {
	// Поля только для чтения не изменяют черновик.
}
const iconButtonClasses =
	'flex h-11 min-w-0 items-center justify-center rounded-control cursor-pointer hover:bg-action-subtle-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

const QueueWorkRow = ( {
	title,
	priority,
	disabled,
	onPriorityChange,
	onTitleChange,
	onRemove,
	isNew
}: {
	title: string
	priority: string
	disabled: boolean
	onPriorityChange: ( value: string ) => void
	onTitleChange: ( value: string ) => void
	onRemove: () => void
	isNew: boolean
} ) => {
	const [ isEditing, setIsEditing ] = useState( isNew )

	return (
		<div className='flex w-full min-w-0 flex-row flex-nowrap items-end gap-3'>
			<div
				className='min-w-0'
				style={ { flex: '14 1 0' } }
			>
				<UIInput
					label='Название работы'
					value={ title }
					placeholder='Введите название работы'
					onChange={ onTitleChange }
					readOnly={ ! isNew || ! isEditing || disabled }
				/>
			</div>
			<div
				className='min-w-0'
				style={ { flex: '4 1 0' } }
			>
				<UIInput
					label='Приоритет'
					naturalNumber
					value={ priority }
					onChange={ onPriorityChange }
					readOnly={ ! isEditing || disabled }
				/>
			</div>
			<button
				type='button'
				aria-label={ `${ isEditing ? 'Зафиксировать приоритет работы' : 'Редактировать приоритет работы' }: ${ title }` }
				aria-pressed={ isEditing }
				disabled={ disabled }
				onClick={ () => setIsEditing( editing => ! editing ) }
				className={ iconButtonClasses }
				style={ { flex: '1 1 0' } }
			>
				<img
					src={ PenIcon }
					alt=''
					aria-hidden='true'
					className='size-icon'
				/>
			</button>
			<button
				type='button'
				aria-label={ `Удалить работу: ${ title }` }
				disabled={ disabled }
				onClick={ onRemove }
				className={ iconButtonClasses }
				style={ { flex: '1 1 0' } }
			>
				<img
					src={ MinusIcon }
					alt=''
					aria-hidden='true'
					className='size-icon'
				/>
			</button>
		</div>
	)
}

export const QueueSettings = ( {
	queue,
	settingsDraft,
	onDraftChange
}: {
	queue: QueueDetail
	settingsDraft: QueueSettingsDraft
	onDraftChange: ( draft: QueueSettingsDraft ) => void
} ) => {
	const queryClient = useQueryClient()
	const [ validationError, setValidationError ] = useState( '' )
	const save = useMutation( {
		mutationFn: async ( draft: QueueSettingsDraft ) => {
			const payload = toQueueSettingsPayload(
				draft,
				queue.planned_start,
				workTitles
			)
			if ( draft.works.some( work => ! work.work_id ) && ! catalog ) {
				throw new Error(
					'Не удалось загрузить справочник работ. Дождитесь загрузки или повторите попытку.'
				)
			}
			let resolvedDraft = draft
			let position = Math.max(
				0,
				...( catalog ?? [] )
					.filter( work => work.discipline_id === queue.discipline_id )
					.map( work => work.position_no )
			)
			for ( const work of draft.works ) {
				if ( work.work_id ) continue
				const created = await createWork( {
					discipline_id: queue.discipline_id,
					title: work.title!.trim(),
					position_no: ++position,
					is_active: true
				} )
				resolvedDraft = {
					...resolvedDraft,
					works: resolvedDraft.works.map( item =>
						item.id === work.id
							? { ...item, work_id: created.id, title: created.title }
							: item
					)
				}
				onDraftChange( resolvedDraft )
				queryClient.setQueryData< WorkRead[] >(
					[ 'teacher', 'works' ],
					previous => [ ...( previous ?? [] ), created ]
				)
			}
			return updateQueueSession( queue.id, {
				...payload,
				works: resolvedDraft.works.map( work => ( {
					work_id: work.work_id,
					priority: Number( work.priority )
				} ) )
			} )
		},
		onSuccess: async session => {
			const queryKey = [ 'queue', queue.id ]
			await queryClient.cancelQueries( { queryKey, exact: true } )
			queryClient.setQueryData< QueueDetail >( queryKey, previous =>
				previous ? { ...previous, ...session } : previous
			)
			onDraftChange( createQueueSettingsDraft( session ) )
			await Promise.all( [
				queryClient.invalidateQueries( { queryKey, exact: true } ),
				queryClient.invalidateQueries( {
					queryKey: [ 'teacher', 'my-queues' ]
				} )
			] )
		}
	} )
	const disabled = queue.stage === 'finished' || save.isPending
	const saveChanges = () => {
		if ( disabled ) return
		setValidationError( '' )
		save.reset()
		try {
			toQueueSettingsPayload( settingsDraft, queue.planned_start, workTitles )
			save.mutate( settingsDraft )
		} catch ( error ) {
			setValidationError( getQueueErrorMessage( error ) )
		}
	}
	const updateDraft = ( changes: Partial< QueueSettingsDraft > ) => {
		if ( disabled ) return
		onDraftChange( { ...settingsDraft, ...changes } )
		setValidationError( '' )
		save.reset()
	}

	const { data: catalog, isPending } = useQuery( {
		queryKey: [ 'teacher', 'works' ],
		queryFn: getAllWorks
	} )
	const workTitles = new Map( catalog?.map( work => [ work.id, work.title ] ) )
	for ( const student of queue.students ) {
		for ( const work of student.works ) {
			if ( ! workTitles.has( work.work_id ) )
				workTitles.set( work.work_id, work.title )
		}
	}
	const works = settingsDraft.works

	return (
		<section className='flex min-w-0 flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6'>
			<h2 className='text-section text-text-primary'>Настройки сеанса</h2>
			<p className='text-small text-text-secondary'>
				Изменения доступны всем преподавателям незавершённого сеанса.
			</p>
			<UIInput
				label='Дисциплина'
				value={ queue.discipline_name }
				onChange={ noop }
				disabled
			/>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
				<UIInput
					label='Время на студента, мин'
					value={ settingsDraft.minutesPerStudent }
					placeholder='Не задано'
					onChange={ value => updateDraft( { minutesPerStudent: value } ) }
					disabled={ disabled }
				/>
				<UIInput
					label='Квота сеанса'
					value={ settingsDraft.quota }
					placeholder='Без ограничения'
					onChange={ value => updateDraft( { quota: value } ) }
					disabled={ disabled }
				/>
				<UIInput
					label='Плановое окончание'
					value={ settingsDraft.endTime }
					onChange={ value => updateDraft( { endTime: value } ) }
					disabled={ disabled }
				/>
			</div>
			<div className='flex min-w-0 flex-col gap-4 rounded-card border border-border-subtle p-4'>
				<h3 className='text-subheading text-text-primary'>
					Работы и приоритеты
				</h3>
				<p className='text-small text-text-secondary'>
					Артефакт обязателен для каждой выбранной работы. Студент добавляет
					ссылку при записи.
				</p>
				<div
					className='mt-6 flex w-full min-w-0 flex-col'
					style={ { rowGap: '3rem' } }
				>
					{ works.map( work => {
						const title =
							work.title ??
							workTitles.get( work.work_id ) ??
							( ! work.work_id
								? ''
								: isPending
									? 'Загрузка названия…'
									: 'Название недоступно' )
						return (
							<QueueWorkRow
								key={ work.id }
								title={ title }
								isNew={ ! work.work_id }
								onTitleChange={ value =>
									updateDraft( {
										works: works.map( item =>
											item.id === work.id ? { ...item, title: value } : item
										)
									} )
								}
								onRemove={ () =>
									updateDraft( {
										works: works.filter( item => item.id !== work.id )
									} )
								}
								priority={ work.priority }
								disabled={ disabled }
								onPriorityChange={ value =>
									updateDraft( {
										works: works.map( item =>
											item.id === work.id ? { ...item, priority: value } : item
										)
									} )
								}
							/>
						)
					} ) }
					{ works.length === 0 && (
						<p className='text-small text-text-secondary'>Работы не выбраны.</p>
					) }
				</div>
				<div className='w-60 max-w-full'>
					<UIButton
						label='+ Добавить работу'
						tone={ UIButtonTone.SECONDARY }
						disabled={ disabled }
						onClick={ () =>
							updateDraft( {
								works: [
									...works,
									{
										id: crypto.randomUUID(),
										work_id: '',
										title: '',
										priority: ''
									}
								]
							} )
						}
						fullWidth
					/>
				</div>
			</div>
			<UIAlert
				tone={ UIAlertTone.INFO }
				title='Квота не удаляет участников'
				message='При уменьшении квоты участники остаются в очереди. Открытая запись сохраняется, превышение показывается резервом.'
			/>
			<div className='w-[264px] max-w-full'>
				<UIButton
					label='Сохранить изменения'
					tone={ UIButtonTone.PRIMARY }
					onClick={ saveChanges }
					loading={ save.isPending }
					disabled={ disabled }
					fullWidth
				/>
			</div>
			{ ( validationError || save.isError ) && (
				<UIAlert
					tone={ UIAlertTone.ERROR }
					message={
						validationError ||
						getQueueErrorMessage(
							save.error,
							'Не удалось сохранить изменения.'
						)
					}
				/>
			) }
			{ save.isSuccess && (
				<UIAlert
					tone={ UIAlertTone.SUCCESS }
					message='Изменения сохранены.'
				/>
			) }
		</section>
	)
}
