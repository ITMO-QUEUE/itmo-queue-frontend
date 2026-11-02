import { UIButton, UIButtonTone } from './UIButton'
import { UIParameterBlock } from './UIParameterBlock'

export type UITeacherParametersProps = {
	startTime: string
	/** Положительное целое количество студентов на одну защиту. */
	studentsToDefend: number
	/** Продолжительность защиты в минутах, положительное целое число. */
	duration: number
	onOpenRegistration: () => void
	onCloseRegistration: () => void
	onStartDefense: () => void
	onFinishDefense: () => void
}

export const UITeacherParameters = ( {
	startTime,
	studentsToDefend,
	duration,
	onOpenRegistration,
	onCloseRegistration,
	onStartDefense,
	onFinishDefense
}: UITeacherParametersProps ) => (
	<div className='flex w-full flex-col gap-5 font-nunito'>
		<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
			<UIParameterBlock
				title='Начало защиты'
				value={ startTime }
				description='Плановое время, не автоматический запуск'
			/>
			<UIParameterBlock
				title='Студентов на одну защиту'
				value={ studentsToDefend }
				description='Положительное целое число'
			/>
			<UIParameterBlock
				title='Общая длительность'
				value={ `${ duration } мин` }
				description='Предупреждение при истечении, без автозакрытия'
			/>
		</div>
		<div className='flex flex-wrap gap-4'>
			<UIButton
				label='Открыть запись'
				tone={ UIButtonTone.SECONDARY }
				onClick={ onOpenRegistration }
			/>
			<UIButton
				label='Закрыть запись'
				tone={ UIButtonTone.SECONDARY }
				onClick={ onCloseRegistration }
			/>
			<UIButton
				label='Начать защиту'
				tone={ UIButtonTone.SECONDARY }
				onClick={ onStartDefense }
			/>
			<UIButton
				label='Завершить защиту'
				tone={ UIButtonTone.DANGER }
				onClick={ onFinishDefense }
			/>
		</div>
	</div>
)
