import { useState } from 'react'
import { UIInput } from '../../components/ui/UIInput'
import { UINumberField } from '../../components/ui/UINumberField'
import {
	UITeacherParameters,
	type UITeacherParametersProps
} from '../../components/ui/UITeacherParameters'

type Parameters = Pick<
	UITeacherParametersProps,
	'startTime' | 'studentsToDefend' | 'duration'
>

const SCENARIOS: { key: string; label: string; props: Parameters }[] = [
	{
		key: 'minimum',
		label: 'Minimum values',
		props: { startTime: '09:00', studentsToDefend: 1, duration: 1 }
	},
	{
		key: 'group',
		label: 'Group defense',
		props: { startTime: '18:30', studentsToDefend: 12, duration: 120 }
	},
	{
		key: 'long-text',
		label: 'Long start time text',
		props: {
			startTime: 'Начало после завершения предыдущей защиты',
			studentsToDefend: 100,
			duration: 1440
		}
	}
]

export const TestTeacherParametersPage = () => {
	const [ startTime, setStartTime ] = useState( '14:00' )
	const [ studentsToDefend, setStudentsToDefend ] = useState( 1 )
	const [ duration, setDuration ] = useState( 90 )
	const [ clickCount, setClickCount ] = useState( 0 )
	const [ lastAction, setLastAction ] = useState< string | null >( null )

	const handleAction = ( action: string, scenario: string ) => {
		setClickCount( prev => prev + 1 )
		setLastAction( `${ action }: ${ scenario }` )
	}

	const actionProps = ( scenario: string ) => ( {
		onOpenRegistration: () => handleAction( 'Открыть запись', scenario ),
		onCloseRegistration: () => handleAction( 'Закрыть запись', scenario ),
		onStartDefense: () => handleAction( 'Начать защиту', scenario ),
		onFinishDefense: () => handleAction( 'Завершить защиту', scenario )
	} )

	return (
		<main className='h-full w-full overflow-auto bg-bg-page p-6 md:p-10'>
			<div className='mx-auto flex max-w-7xl flex-col gap-8'>
				<header className='flex flex-wrap items-end justify-between gap-4'>
					<div className='space-y-2'>
						<p className='text-small text-text-secondary'>
							Design System / Components
						</p>
						<h1 className='text-heading text-text-primary'>
							Teacher Parameters Playground
						</h1>
						<p className='text-body text-text-secondary'>
							Visual testing of defense parameters and button interactions.
						</p>
					</div>
					<div
						aria-live='polite'
						className='min-w-52 rounded-card border border-border-subtle bg-bg-surface px-5 py-3'
					>
						<p className='text-small text-text-secondary'>Click events</p>
						<p className='text-section text-text-primary'>{ clickCount }</p>
						<p className='text-caption text-text-secondary'>
							Last: { lastAction ?? 'None' }
						</p>
					</div>
				</header>

				<section className='flex flex-col gap-5 rounded-card border border-border-subtle bg-bg-surface p-6'>
					<div>
						<h2 className='text-subheading text-text-primary'>
							Interactive example
						</h2>
						<p className='mt-1 text-small text-text-secondary'>
							Edit the values to update the preview. Click any action to record
							its event. Resize the window to check the responsive layout.
						</p>
					</div>
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						<UIInput
							label='Начало защиты'
							value={ startTime }
							onChange={ setStartTime }
						/>
						<UINumberField
							label='Студентов на одну защиту'
							value={ studentsToDefend }
							onChange={ setStudentsToDefend }
						/>
						<UINumberField
							label='Длительность в минутах'
							value={ duration }
							onChange={ setDuration }
						/>
					</div>
					<UITeacherParameters
						startTime={ startTime }
						studentsToDefend={ studentsToDefend }
						duration={ duration }
						{ ...actionProps( 'Interactive' ) }
					/>
				</section>

				<footer className='text-caption text-text-secondary'>
					UITeacherParameters · 3 parameters · 4 actions · Interactive testing
				</footer>
			</div>
		</main>
	)
}
