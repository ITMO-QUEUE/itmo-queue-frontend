import { useState } from 'react'
import { UITab } from '../../components/ui/UITab'

const STATES = [
	{ key: 'default', label: 'Default' },
	{ key: 'hover', label: 'Hover' },
	{ key: 'active', label: 'Active' },
	{ key: 'disabled', label: 'Disabled' }
] as const

const TABS = [
	{ id: 'queue', label: 'Очередь' },
	{ id: 'history', label: 'История' },
	{ id: 'settings', label: 'Настройки' }
] as const

export const TestTabPage = () => {
	const [activeTab, setActiveTab] = useState<string>('queue')
	const [clickCount, setClickCount] = useState(0)
	const [lastClicked, setLastClicked] = useState<string | null>(null)

	const handleClick = (id: string) => {
		setActiveTab(id)
		setClickCount(prev => prev + 1)
		setLastClicked(id)
	}

	return (
		<main className='h-full w-full overflow-auto bg-bg-page p-6 md:p-10'>
			<div className='mx-auto flex max-w-6xl flex-col gap-8'>
				{/* Header */}
				<header className='flex flex-wrap items-end justify-between gap-4'>
					<div className='space-y-2'>
						<p className='text-small text-text-secondary'>
							Design System / Components
						</p>

						<h1 className='text-heading text-text-primary'>Tab Playground</h1>

						<p className='text-body text-text-secondary'>
							Visual testing of tab variants and interaction states.
						</p>
					</div>

					<div className='min-w-48 rounded-card border border-border-subtle bg-bg-surface px-5 py-3'>
						<p className='text-small text-text-secondary'>Click events</p>

						<p className='text-section text-text-primary'>{clickCount}</p>

						<p className='text-caption text-text-secondary'>
							Last: {lastClicked ?? 'None'}
						</p>
					</div>
				</header>

				{/* Static states */}
				<section className='overflow-hidden rounded-card border border-border-subtle bg-bg-surface'>
					<div className='border-b border-border-subtle px-6 py-5'>
						<h2 className='text-subheading text-text-primary'>Tab states</h2>

						<p className='mt-1 text-small text-text-secondary'>
							Compare visual styles across component states.
						</p>
					</div>

					<div className='overflow-x-auto'>
						<table className='w-full border-collapse text-left'>
							<thead>
								<tr className='bg-bg-page'>
									<th className='min-w-32 px-6 py-4 text-small text-text-secondary'>
										Component
									</th>

									{STATES.map(state => (
										<th
											key={state.key}
											className='min-w-56 px-6 py-4 text-small text-text-secondary'
										>
											{state.label}
										</th>
									))}
								</tr>
							</thead>

							<tbody>
								<tr className='border-t border-border-subtle'>
									<th className='px-6 py-8 text-label text-text-primary'>
										Tab
									</th>

									{/* Default */}
									<td className='px-6 py-8'>
										<UITab label='Очередь' />
									</td>

									{/* Hover */}
									<td className='px-6 py-8'>
										<div className='[&>button]:bg-bg-selected'>
											<UITab label='Очередь' />
										</div>
									</td>

									{/* Active */}
									<td className='px-6 py-8'>
										<UITab
											label='Очередь'
											active
										/>
									</td>

									{/* Disabled */}
									<td className='px-6 py-8'>
										<UITab
											label='Очередь'
											disabled
										/>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				{/* Interactive example */}
				<section className='rounded-card border border-border-subtle bg-bg-surface p-6'>
					<div>
						<h2 className='text-subheading text-text-primary'>
							Interactive tabs
						</h2>

						<p className='mt-2 text-small text-text-secondary'>
							Switch between tabs and inspect their active state.
						</p>
					</div>

					<div className='mt-6 flex flex-wrap gap-2'>
						{TABS.map(tab => (
							<UITab
								key={tab.id}
								label={tab.label}
								active={activeTab === tab.id}
								onClick={() => handleClick(tab.id)}
							/>
						))}

						<UITab
							label='Недоступно'
							disabled
						/>
					</div>

					<div className='mt-6 rounded-control border border-border-subtle bg-bg-page p-6'>
						<p className='text-caption text-text-secondary'>ACTIVE TAB</p>

						<h3 className='mt-2 text-section text-text-primary'>
							{TABS.find(tab => tab.id === activeTab)?.label}
						</h3>

						<p className='mt-2 text-small text-text-secondary'>
							Selected ID: {activeTab}
						</p>
					</div>

					<div className='mt-5 flex flex-wrap gap-3'>
						<button
							type='button'
							className='rounded-control border border-border-subtle px-4 py-2 text-label text-text-primary hover:bg-bg-selected'
							onClick={() => setActiveTab('queue')}
						>
							Reset selection
						</button>

						<button
							type='button'
							className='rounded-control border border-border-subtle px-4 py-2 text-label text-text-primary hover:bg-bg-selected'
							onClick={() => {
								setClickCount(0)
								setLastClicked(null)
							}}
						>
							Reset events
						</button>
					</div>
				</section>

				{/* Custom className */}
				<section className='rounded-card border border-border-subtle bg-bg-surface p-6'>
					<h2 className='text-subheading text-text-primary'>
						Custom className
					</h2>

					<p className='mt-2 text-small text-text-secondary'>
						Check how additional styles can be applied externally.
					</p>

					<div className='mt-6 flex flex-wrap gap-3'>
						<UITab
							label='Custom width'
							className='w-64'
						/>

						<UITab
							label='Compact'
							className='h-10 w-auto px-4'
						/>

						<UITab
							label='Custom active'
							active
							className='bg-bg-selected'
						/>
					</div>
				</section>

				<footer className='text-caption text-text-secondary'>
					UITab · 4 visual states · Interactive testing · Custom styles
				</footer>
			</div>
		</main>
	)
}
