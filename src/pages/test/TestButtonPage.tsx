import { useState } from 'react'
import { UIButton, UIButtonTone } from '../../components/ui/UIButton'

const TONES = [
	{ tone: UIButtonTone.PRIMARY, label: 'Primary' },
	{ tone: UIButtonTone.SECONDARY, label: 'Secondary' },
	{ tone: UIButtonTone.GHOST, label: 'Ghost' },
	{ tone: UIButtonTone.DANGER, label: 'Danger' }
] as const

const STATES = [
	{ key: 'default', label: 'Default' },
	{ key: 'disabled', label: 'Disabled' },
	{ key: 'loading', label: 'Loading' }
] as const

export const TestButtonPage = () => {
	const [clickCount, setClickCount] = useState(0)
	const [lastClicked, setLastClicked] = useState<string | null>(null)

	const handleClick = (tone: UIButtonTone) => {
		setClickCount(prev => prev + 1)
		setLastClicked(tone)
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
							Button Playground
						</h1>

						<p className='text-body text-text-secondary'>
							Visual testing of button variants and interaction states.
						</p>
					</div>

					<div className='rounded-card border border-border-subtle bg-bg-surface px-5 py-3'>
						<p className='text-small text-text-secondary'>Click events</p>

						<p className='text-section text-text-primary'>{clickCount}</p>

						<p className='text-caption text-text-secondary'>
							Last: {lastClicked ?? 'None'}
						</p>
					</div>
				</header>

				<section className='overflow-hidden rounded-card border border-border-subtle bg-bg-surface'>
					<div className='border-b border-border-subtle px-6 py-5'>
						<h2 className='text-subheading text-text-primary'>
							Button variants
						</h2>

						<p className='mt-1 text-small text-text-secondary'>
							Compare visual styles across component states.
						</p>
					</div>

					<div className='overflow-x-auto'>
						<table className='w-full border-collapse text-left'>
							<thead>
								<tr className='bg-bg-page'>
									<th className='min-w-32 px-6 py-4 text-small text-text-secondary'>
										Variant
									</th>

									{STATES.map(state => (
										<th
											key={state.key}
											className='min-w-64 px-6 py-4 text-small text-text-secondary'
										>
											{state.label}
										</th>
									))}
								</tr>
							</thead>

							<tbody>
								{TONES.map(({ tone, label }) => (
									<tr
										key={tone}
										className='border-t border-border-subtle'
									>
										<th className='px-6 py-6 text-label text-text-primary'>
											{label}
										</th>

										<td className='px-6 py-6'>
											<UIButton
												label='Button'
												tone={tone}
												onClick={() => handleClick(tone)}
											/>
										</td>

										<td className='px-6 py-6'>
											<UIButton
												label='Button'
												tone={tone}
												onClick={() => handleClick(tone)}
												disabled
											/>
										</td>

										<td className='px-6 py-6'>
											<UIButton
												label='Loading...'
												tone={tone}
												onClick={() => handleClick(tone)}
												loading
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				<section className='rounded-card border border-border-subtle bg-bg-surface p-6'>
					<h2 className='text-subheading text-text-primary'>
						Interactive states
					</h2>

					<p className='mt-2 text-small text-text-secondary'>
						Hover over a button, hold it to inspect the active state, or use Tab
						to check keyboard focus.
					</p>

					<div className='mt-6 flex flex-wrap gap-5'>
						{TONES.map(({ tone, label }) => (
							<UIButton
								key={tone}
								label={label}
								tone={tone}
								onClick={() => handleClick(tone)}
							/>
						))}
					</div>
				</section>

				<footer className='text-caption text-text-secondary'>
					UIButton · 4 variants · 3 static states · Interactive testing
				</footer>
			</div>
		</main>
	)
}
