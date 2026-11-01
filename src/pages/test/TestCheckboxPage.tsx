import { useState } from 'react'
import { UICheckbox } from '../../components/ui/UICheckbox'

export const TestCheckboxPage = () => {
	const [ checked, setChecked ] = useState( false )
	const [ disabledChecked, setDisabledChecked ] = useState( false )
	const [ changeCount, setChangeCount ] = useState( 0 )

	const handleChange = ( nextChecked: boolean ) => {
		setChecked( nextChecked )
		setChangeCount( prev => prev + 1 )
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
							Checkbox Playground
						</h1>
						<p className='text-body text-text-secondary'>
							Visual testing of checkbox interaction states.
						</p>
					</div>
					<div className='rounded-card border border-border-subtle bg-bg-surface px-5 py-3'>
						<p className='text-small text-text-secondary'>Change events</p>
						<p className='text-section text-text-primary'>{ changeCount }</p>
						<p
							className='text-caption text-text-secondary'
							aria-live='polite'
						>
							State: { checked ? 'On' : 'Off' }
						</p>
					</div>
				</header>

				<section className='overflow-hidden rounded-card border border-border-subtle bg-bg-surface'>
					<div className='border-b border-border-subtle px-6 py-5'>
						<h2 className='text-subheading text-text-primary'>
							Checkbox states
						</h2>
						<p className='mt-1 text-small text-text-secondary'>
							Compare the interactive and disabled checkboxes.
						</p>
					</div>
					<div className='grid gap-8 p-6 md:grid-cols-2'>
						<div className='space-y-4'>
							<h3 className='text-label text-text-primary'>State </h3>
							<UICheckbox
								label='Лабораторная № 3'
								checked={ checked }
								onChange={ handleChange }
							/>
						</div>
						<div className='space-y-4'>
							<h3 className='text-label text-text-primary'>Disabled</h3>
							<UICheckbox
								label='Лабораторная № 3'
								checked={ disabledChecked }
								onChange={ setDisabledChecked }
								disabled
							/>
						</div>
					</div>
				</section>

				<footer className='text-caption text-text-secondary'>
					UICheckbox · Default and disabled states · Interactive testing
				</footer>
			</div>
		</main>
	)
}
