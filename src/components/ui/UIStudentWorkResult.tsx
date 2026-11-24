export type UIStudentWorkResultProps = {
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
	<article className='flex items-center justify-between gap-4 rounded-control border border-border-subtle bg-bg-surface p-4 font-nunito'>
		<div className='min-w-0 wrap-break-word text-small text-text-secondary'>
			<h3 className='mb-1 text-label text-text-primary'>
				{ WorkName } · { Subject }
			</h3>
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
				className={ `shrink-0 text-subheading ${
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
