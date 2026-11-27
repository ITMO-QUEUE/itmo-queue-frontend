import QueueIcon from '../../../assets/icons/Queue.svg'

export const EmptyQueue = () => (
	<section
		className='flex min-h-80 w-full min-w-0 flex-col items-center rounded-card border border-border-subtle bg-bg-surface p-8 text-center'
		aria-labelledby='empty-queue-title'
	>
		<img
			src={ QueueIcon }
			alt=''
			aria-hidden='true'
			className='size-6'
		/>
		<div className='mt-16 flex flex-col gap-3'>
			<h2
				id='empty-queue-title'
				className='text-section text-text-primary'
			>
				Очередь пуста
			</h2>
			<p className='text-small text-text-secondary'>
				Результаты попыток останутся в истории сеанса.
			</p>
		</div>
	</section>
)
