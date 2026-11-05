import { useState } from 'react'
import { UINumberField } from '../../components/ui/UINumberField'

const EXAMPLES = [
	{ key: 'default', label: 'Default', value: 10 },
	{ key: 'disabled', label: 'Disabled', value: 10, disabled: true }
]

export const TestNumberfieldPage = () => {
	const [ values, setValues ] = useState< Record< string, number > >( () =>
		Object.fromEntries(
			EXAMPLES.map( example => [ example.key, example.value ] )
		)
	)
	const [ changeCount, setChangeCount ] = useState( 0 )
	const [ lastChanged, setLastChanged ] = useState< string | null >( null )

	const recordChange = ( label: string, value: number ) => {
		setChangeCount( prev => prev + 1 )
		setLastChanged( `${ label }: ${ value }` )
	}

	return (
		<main className='h-full w-full overflow-auto bg-bg-page p-6 md:p-10'>
			<div className='mx-auto flex max-w-6xl flex-col gap-8'>
				<header className='flex flex-wrap items-end justify-between gap-4'>
					<div className='space-y-2'>
						<p className='text-small text-text-secondary'>
							Design System / Components
						</p>
						<h1 className='text-heading text-text-primary'>
							Number Field Playground
						</h1>
						<p className='text-body text-text-secondary'>
							Visual testing of number field states, validation and
							interactions.
						</p>
					</div>
					<div className='rounded-card border border-border-subtle bg-bg-surface px-5 py-3'>
						<p className='text-small text-text-secondary'>Change events</p>
						<p className='text-section text-text-primary'>{ changeCount }</p>
						<p className='text-caption text-text-secondary'>
							Last: { lastChanged ?? 'None' }
						</p>
					</div>
				</header>

				<section className='overflow-hidden rounded-card border border-border-subtle bg-bg-surface'>
					<div className='border-b border-border-subtle px-6 py-5'>
						<h2 className='text-subheading text-text-primary'>
							Number field states
						</h2>
						<p className='mt-1 text-small text-text-secondary'>
							Compare default and disabled states. Each field is independent.
						</p>
					</div>
					<div className='overflow-x-auto'>
						<table className='w-full border-collapse text-left'>
							<thead>
								<tr className='bg-bg-page'>
									{ [ 'State', 'Number field', 'Current value' ].map( label => (
										<th
											key={ label }
											scope='col'
											className='min-w-32 px-6 py-4 text-small text-text-secondary'
										>
											{ label }
										</th>
									) ) }
								</tr>
							</thead>
							<tbody>
								{ EXAMPLES.map( example => (
									<tr
										key={ example.key }
										className='border-t border-border-subtle'
									>
										<th
											scope='row'
											className='px-6 py-6 text-label text-text-primary'
										>
											{ example.label }
										</th>
										<td className='min-w-80 px-6 py-6'>
											<UINumberField
												label={ example.label }
												value={ values[ example.key ] }
												onChange={ value => {
													setValues( prev => ( {
														...prev,
														[ example.key ]: value
													} ) )
													recordChange( example.label, value )
												} }
												disabled={ example.disabled }
											/>
										</td>
										<td className='px-6 py-6 text-body text-text-primary'>
											{ values[ example.key ] }
										</td>
									</tr>
								) ) }
							</tbody>
						</table>
					</div>
				</section>

				<footer className='text-caption text-text-secondary'>
					UINumberField · 2 states · Interactive testing
				</footer>
			</div>
		</main>
	)
}
