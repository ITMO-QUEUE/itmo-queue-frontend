import { useState } from 'react'
import { UIAlert, UIAlertTone } from '../../../components/ui/UIAlert'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { UICheckbox } from '../../../components/ui/UICheckbox'
import { UIInput } from '../../../components/ui/UIInput'
import { QueueStatus as QueueStatusEnum } from '../../../components/ui/UIQueueStatus'
import type { fullQueue, QueueChanges } from '../types/queue'

export const QueueSettings = ( {
	queue,
	onSave
}: {
	queue: fullQueue
	onSave: ( changes: QueueChanges ) => void
} ) => {
	const [ minutes, setMinutes ] = useState( String( queue.minutesPerStudent ) )
	const [ quota, setQuota ] = useState(
		queue.studentsMax === null ? '' : String( queue.studentsMax )
	)
	const [ endTime, setEndTime ] = useState(
		() =>
			`${ String( queue.endsAt.getHours() ).padStart( 2, '0' ) }:${ String( queue.endsAt.getMinutes() ).padStart( 2, '0' ) }`
	)
	const [ requireArtifact, setRequireArtifact ] = useState(
		queue.requireArtifact
	)
	const [ works, setWorks ] = useState( () =>
		queue.works.map( ( work, index ) => ( {
			...work,
			enabled: work.enabled ?? true,
			priority: String( work.priority ?? index + 1 )
		} ) )
	)
	const [ message, setMessage ] = useState( '' )
	const [ error, setError ] = useState( '' )
	const disabled = queue.status === QueueStatusEnum.COMPLETED
	const positiveInteger = ( value: string ) =>
		/^\d+$/.test( value ) &&
		Number.isSafeInteger( Number( value ) ) &&
		Number( value ) > 0
	const save = () => {
		if ( disabled ) return
		setMessage( '' )
		setError( '' )
		if (
			! positiveInteger( minutes ) ||
			( quota !== '' && ! positiveInteger( quota ) )
		) {
			setError(
				'Время на студента и квота должны быть положительными целыми числами. Пустая квота означает отсутствие ограничения.'
			)
			return
		}
		if ( ! /^([01]\d|2[0-3]):[0-5]\d$/.test( endTime ) ) {
			setError( 'Укажите время окончания в формате ЧЧ:ММ.' )
			return
		}
		const endsAt = new Date( queue.endsAt )
		const [ hours, minutesPart ] = endTime.split( ':' ).map( Number )
		endsAt.setHours( hours, minutesPart, 0, 0 )
		if ( endsAt <= queue.startsAt ) {
			setError( 'Окончание сеанса должно быть позже его начала.' )
			return
		}
		if (
			! works.some( work => work.enabled ) ||
			works.some( work => ! positiveInteger( work.priority ) )
		) {
			setError(
				'Выберите хотя бы одну работу и задайте положительные целые приоритеты.'
			)
			return
		}
		onSave( {
			minutesPerStudent: Number( minutes ),
			studentsMax: quota === '' ? null : Number( quota ),
			endsAt,
			requireArtifact,
			works: works.map( work => ( {
				...work,
				priority: Number( work.priority )
			} ) )
		} )
		setMessage( 'Изменения сохранены.' )
	}

	return (
		<section className='flex flex-col gap-6 rounded-card border border-border-subtle bg-bg-surface p-6'>
			<h2 className='text-subheading text-text-primary'>Настройки сеанса</h2>
			<p className='text-small text-text-secondary'>
				Изменения доступны всем преподавателям незавершённого сеанса.
			</p>
			<UIInput
				label='Дисциплина'
				value={ queue.subject }
				onChange={ () => {} }
				disabled
			/>
			<fieldset
				disabled={ disabled }
				className='flex min-w-0 flex-col gap-6'
				onChange={ () => {
					setMessage( '' )
					setError( '' )
				} }
			>
				<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
					<UIInput
						label='Время на студента, мин'
						value={ minutes }
						onChange={ setMinutes }
						disabled={ disabled }
					/>
					<UIInput
						label='Квота сеанса'
						value={ quota }
						onChange={ setQuota }
						placeholder='Без ограничения'
						disabled={ disabled }
					/>
					<UIInput
						label='Плановое окончание'
						value={ endTime }
						onChange={ setEndTime }
						placeholder='ЧЧ:ММ'
						disabled={ disabled }
					/>
				</div>
				<div className='flex flex-col gap-6 rounded-card border border-border-subtle p-4'>
					<h3 className='text-subheading text-text-primary'>
						Работы и приоритеты
					</h3>
					<UICheckbox
						label='Требовать артефакт при записи'
						checked={ requireArtifact }
						onChange={ setRequireArtifact }
						disabled={ disabled }
					/>
					{ works.map( ( work, index ) => (
						<div
							key={ `${ work.type }-${ work.number }` }
							className='flex flex-wrap items-end gap-6 sm:pl-16'
						>
							<div className='flex h-11 items-center'>
								<UICheckbox
									label={ `ЛР № ${ work.number }` }
									checked={ work.enabled }
									disabled={ disabled }
									onChange={ enabled =>
										setWorks( current =>
											current.map( ( item, i ) =>
												i === index ? { ...item, enabled } : item
											)
										)
									}
								/>
							</div>
							<div className='w-48'>
								<UIInput
									label='Приоритет'
									value={ work.priority }
									disabled={ disabled || ! work.enabled }
									onChange={ priority =>
										setWorks( current =>
											current.map( ( item, i ) =>
												i === index ? { ...item, priority } : item
											)
										)
									}
								/>
							</div>
						</div>
					) ) }
				</div>
				{ error && (
					<p
						role='alert'
						className='text-small text-status-danger'
					>
						{ error }
					</p>
				) }
				<UIAlert
					tone={ UIAlertTone.INFO }
					title='Квота не удаляет участников'
					message='При уменьшении квоты участники остаются в очереди. Открытая запись сохраняется, превышение показывается резервом.'
				/>
				<div className='w-full max-w-72'>
					<UIButton
						label='Сохранить изменения'
						tone={ UIButtonTone.PRIMARY }
						fullWidth
						disabled={ disabled }
						onClick={ save }
					/>
				</div>
			</fieldset>
			{ message && (
				<p
					role='status'
					className='text-small text-status-success'
				>
					{ message }
				</p>
			) }
		</section>
	)
}
