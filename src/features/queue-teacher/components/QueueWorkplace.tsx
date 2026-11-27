import { UIAlert, UIAlertTone } from '../../../components/ui/UIAlert'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { UIInput } from '../../../components/ui/UIInput'
import type {
	ParticipantWork,
	StudentRecord
} from '../../../types/StudentRecord'

export type UIWorkPlaceProps = {
	Name?: string
	CurentStudent?: StudentRecord
	otherWorkplaces?: readonly { id: string; message: string }[]
	status: UIWorkPlaceStatus
	saveStatus: 'idle' | 'saving' | 'saved' | 'error'
	isPending?: boolean
	message?: string
	scores: Record< string, string >
	onScoreChange: ( workId: string, value: string ) => void
	SaveResult: () => void | Promise< void >
	CallNext: () => void | Promise< void >
	StartDefence: () => void | Promise< void >
	FinishDefence: () => void | Promise< void >
}

export enum UIWorkPlaceStatus {
	FREE = 'free',
	CALLING = 'calling',
	DEFENDING = 'defending'
}

type WorkScoreRowProps = {
	work: ParticipantWork
	disabled: boolean
	score: string
	onEdit: ( value: string ) => void
}

const WorkScoreRow = ( {
	work,
	score,
	disabled,
	onEdit
}: WorkScoreRowProps ) => {
	return (
		<div className='flex flex-wrap items-start gap-4'>
			<span className='w-40 text-label'>{ work.title }</span>
			<div className='w-full max-w-[344px]'>
				<UIInput
					label='Баллы'
					value={ score }
					placeholder='7,5'
					disabled={ disabled }
					onChange={ onEdit }
				/>
			</div>
			{ work.artifact_url && (
				<a
					className='text-small text-action-primary'
					href={ work.artifact_url }
					target='_blank'
					rel='noopener noreferrer'
				>
					Открыть артефакт →
				</a>
			) }
		</div>
	)
}

export const UIWorkPlace = ( {
	Name,
	CurentStudent: student,
	otherWorkplaces = [],
	status,
	saveStatus,
	isPending = false,
	message,
	scores,
	onScoreChange,
	CallNext,
	StartDefence,
	SaveResult,
	FinishDefence
}: UIWorkPlaceProps ) => {
	const isFree = status === UIWorkPlaceStatus.FREE

	return (
		<section
			aria-label={ Name ? `Рабочее место: ${ Name }` : 'Ваше рабочее место' }
			className='flex flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6 text-text-primary'
		>
			<h2 className='text-section'>Ваше рабочее место</h2>
			<div
				className='flex flex-wrap items-center gap-4'
				aria-live='polite'
			>
				<WorkplaceStatusBadge status={ status } />
				<span className='text-label'>
					{ isFree
						? 'Вы свободны'
						: student
							? [
									student.student_name,
									...student.works.map( work => work.title )
								].join( ' · ' )
							: 'Данные студента недоступны' }
				</span>
			</div>
			{ otherWorkplaces.length > 0 && (
				<ul
					className='flex flex-col gap-2 text-small text-text-secondary'
					aria-label='Рабочие места других преподавателей'
				>
					{ otherWorkplaces.map( workplace => (
						<li key={ workplace.id }>{ workplace.message }</li>
					) ) }
				</ul>
			) }
			{ message && (
				<UIAlert
					tone={ UIAlertTone.INFO }
					message={ message }
				/>
			) }

			{ status === UIWorkPlaceStatus.CALLING && (
				<p className='text-body'>
					Студент вызван. Дождитесь готовности к защите.
				</p>
			) }
			{ status === UIWorkPlaceStatus.DEFENDING ? (
				<>
					{ student?.works.map( work => (
						<WorkScoreRow
							key={ work.work_id }
							work={ work }
							disabled={
								isPending || saveStatus === 'saving' || saveStatus === 'saved'
							}
							score={ scores[ work.work_id ] ?? '' }
							onEdit={ value => onScoreChange( work.work_id, value ) }
						/>
					) ) }
					<div className='flex flex-wrap gap-4'>
						<div className='w-[264px] max-w-full'>
							<UIButton
								label='Сохранить результаты'
								tone={ UIButtonTone.PRIMARY }
								fullWidth
								loading={ saveStatus === 'saving' }
								disabled={
									isPending || saveStatus === 'saved' || ! student?.works.length
								}
								onClick={ SaveResult }
							/>
						</div>
						<div className='w-60 max-w-full'>
							<UIButton
								label='Завершить защиту'
								tone={ UIButtonTone.SECONDARY }
								fullWidth
								disabled={ isPending || saveStatus !== 'saved' }
								onClick={ FinishDefence }
							/>
						</div>
					</div>
					{ saveStatus === 'saved' && (
						<UIAlert
							tone={ UIAlertTone.SUCCESS }
							title='Результаты сохранены'
							message='Завершите защиту. Вызов следующего — отдельное действие.'
						/>
					) }
					{ saveStatus === 'error' && (
						<UIAlert
							tone={ UIAlertTone.ERROR }
							message='Не удалось сохранить результаты. Попробуйте ещё раз.'
						/>
					) }
				</>
			) : (
				<div className='w-64 max-w-full'>
					<UIButton
						label={ isFree ? 'Вызвать следующего' : 'Начать защиту' }
						tone={ UIButtonTone.PRIMARY }
						fullWidth
						loading={ isPending }
						disabled={ ! isFree && ! student }
						onClick={ isFree ? CallNext : StartDefence }
					/>
				</div>
			) }
		</section>
	)
}

export const WorkplaceStatusBadge = ( {
	status
}: {
	status: UIWorkPlaceStatus
} ) => {
	const isFree = status === UIWorkPlaceStatus.FREE
	const colors = isFree
		? 'bg-status-success-bg text-status-success'
		: 'bg-bg-selected text-action-primary'

	return (
		<span
			className={ `inline-flex h-9 w-52 max-w-full items-center justify-center rounded-full text-label ${ colors }` }
		>
			{ isFree ? 'Свободен' : 'Принимает' }
		</span>
	)
}
