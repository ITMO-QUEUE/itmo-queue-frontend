import {
	Scenario,
	UIDialog,
	type UIDialogProps
} from '../../components/ui/UIDialog'

const SCENARIOS = [
	{
		scenario: Scenario.CallOutOrder,
		studentName: 'Алексей Смирнов',
		position: 5
	},
	{ scenario: Scenario.FinsishDefense },
	{ scenario: Scenario.ConnectionError }
] as const satisfies readonly UIDialogProps[]

export const TestDialogPage = () => {
	return (
		<main className='h-full w-full overflow-auto bg-bg-page p-4 md:p-10'>
			<div className='mx-auto flex max-w-3xl flex-col gap-8'>
				<header className='space-y-2'>
					<p className='text-small text-text-secondary'>
						Design System / Components
					</p>
					<h1 className='text-heading text-text-primary'>Dialog Playground</h1>
					<p className='text-body text-text-secondary'>
						Три варианта диалога. Кнопки используют заглушки действий.
					</p>
				</header>

				<div className='flex flex-col gap-6'>
					{ SCENARIOS.map( props => (
						<section
							key={ props.scenario }
							className='space-y-2'
							aria-label={ `Scenario=${ props.scenario }` }
						>
							<p className='text-small text-text-secondary'>
								Scenario={ props.scenario }
							</p>
							<UIDialog { ...props } />
						</section>
					) ) }
				</div>
			</div>
		</main>
	)
}
