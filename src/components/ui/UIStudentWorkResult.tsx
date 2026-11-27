export type UIStudentWorkResultProps = {
	StudentName?: string
	WorkName: string
	Subject: string
	date: string
	startTime: string
	endTime: string
	Session: string
	Teacher: string
	result?: string
	OnClick: () => void
}

export const UIStudentWorkResult = ( {
	StudentName,
	WorkName,
	Subject,
	date,
	startTime,
	endTime,
	Session,
	Teacher,
	result,
	OnClick
}: UIStudentWorkResultProps ) => (
	<article className='flex flex-col gap-4 rounded-control border border-border-subtle bg-bg-surface p-4 font-nunito sm:flex-row sm:items-center sm:justify-between'>
		<div className='min-w-0 break-words text-small text-text-secondary'>
			<h3 className='mb-1 text-label text-text-primary'>
				{ StudentName ? `${ StudentName } · ${ WorkName }` : WorkName }
			</h3>
			<p>{ Subject }</p>
			<p>
				{ date } · { startTime }–{ endTime }
			</p>
			<p>Сеанс: { Session }</p>
			<p>Преподаватель: { Teacher }</p>
			<button
				type='button'
				className='mt-1 cursor-pointer text-caption text-action-primary hover:underline focus-visible:outline-border-focus'
				onClick={ OnClick }
			>
				Подробнее о попытке <span aria-hidden='true'>→</span>
			</button>
		</div>
		{ result && (
			<p
				className={ `shrink-0 self-end text-right text-subheading sm:self-auto ${
					result === 'Принято'
						? 'text-status-success'
						: result === 'Неявка'
							? 'text-status-danger'
							: 'text-action-primary'
				}` }
			>
				{ result }
			</p>
		) }
	</article>
)
