import { tw } from '../../libs/utils'
import { UIButton, UIButtonTone } from './UIButton'

export const Scenario = {
	// biome-ignore lint/security/noSecrets: Public dialog scenario identifier, not a secret.
	CallOutOrder: 'CallOutOrder',
	FinsishDefense: 'FinsishDefense',
	ConnectionError: 'ConnectionError'
} as const

export type Scenario = ( typeof Scenario )[ keyof typeof Scenario ]

export type UIDialogProps = {
	loading?: boolean
	disabled?: boolean
} & (
	| {
			scenario: typeof Scenario.CallOutOrder
			studentName: string
			position: number
	  }
	| {
			scenario: typeof Scenario.FinsishDefense | typeof Scenario.ConnectionError
	  }
)

const SCENARIO_CONTENT = {
	[ Scenario.CallOutOrder ]: {
		title: 'Вызвать вне очереди?',
		description:
			'Студент будет вызван раньше участников перед ним. Порядок остальных участников сохраняется.',
		confirmLabel: 'Вызвать студента',
		confirmTone: UIButtonTone.PRIMARY
	},
	[ Scenario.FinsishDefense ]: {
		title: 'Завершить защиту?',
		description:
			'Проверьте результаты текущих студентов. Завершение защиты — ручное действие; время само по себе не закрывает сессию.',
		confirmLabel: 'Завершить защиту',
		confirmTone: UIButtonTone.DANGER
	},
	[ Scenario.ConnectionError ]: {
		title: 'Не удалось обновить очередь',
		description:
			'Проверьте соединение и повторите запрос. До ответа сервера показывайте последнюю подтверждённую позицию.',
		confirmLabel: 'Повторить',
		confirmTone: UIButtonTone.PRIMARY
	}
} as const

const BASE_CLASSES = tw(
	'w-[560px] max-w-[calc(100vw-32px)]',
	'rounded-dialog border border-border-subtle',
	'bg-bg-surface p-6 font-nunito text-text-primary'
)

const ACTIONS_CLASSES = tw(
	'mt-4 flex flex-col gap-3 sm:flex-row',
	'[&>button]:w-full sm:[&>button]:w-56 sm:[&>button]:max-w-full',
	'[&>button]:min-w-0'
)

export const UIDialog = ( props: UIDialogProps ) => {
	const { loading = false, disabled = false } = props
	const content = SCENARIO_CONTENT[ props.scenario ]
	const description =
		props.scenario === Scenario.CallOutOrder
			? `${ props.studentName } ${ props.position } место. ${ content.description }`
			: content.description

	return (
		<div className={ BASE_CLASSES }>
			<h2 className='text-section'>{ content.title }</h2>
			<p className='mt-4 text-body text-text-secondary'>{ description }</p>
			<div className={ ACTIONS_CLASSES }>
				<UIButton
					label={ content.confirmLabel }
					onClick={ () => { } }
					tone={ content.confirmTone }
					loading={ loading }
					disabled={ disabled }
				/>
				<UIButton
					label='Отмена'
					onClick={ () => { } }
					tone={ UIButtonTone.SECONDARY }
				/>
			</div>
		</div>
	)
}
