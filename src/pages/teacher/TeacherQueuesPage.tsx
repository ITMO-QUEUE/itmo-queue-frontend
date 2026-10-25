type QueueStudent = {
	Id: int
	Name: string
	task: string
	status: 'На защите' | 'Закончил' | 'Ожидает'
}
//прототип типа Queue для описания очереди
type Queue = {
	discipline: string
	name: string
	date: string
	place: string
}

// временная функция для реализации масштабируемой очереди
const getQueueStudents = (): QueueStudent[] => [
	{ Id: 111111, Name: 'Студент А.', task: 'ЛР № 2', status: 'Закончил' },
	{ Id: 122222, Name: 'Студент Б.', task: 'ЛР № 2', status: 'На защите' },
	{ Id: 111113, Name: 'Студент В.', task: 'ЛР № 3', status: 'Ожидает' },
	{ Id: 144444, Name: 'Студент Г.', task: 'ЛР № 3', status: 'Ожидает' }
]

// временная функция для реализации описания очереди
const getQueue = (): Queue => ({discipline: 'Программирование', name: 'ЛР № 3', date: 'сегодня, 14:00–15:30', place: 'аудитория 305'})

export const TeacherQueuesPage = () => {
	const students = getQueueStudents()
	const queue = getQueue()

	//блок реализации логики кнопок
	const handleCreateQueue = () => {
		// Заглушка: создание очереди будет подключено позже.
	}
	const handleFinishDefense = () => {
		// Заглушка: завершение защиты и вызов следующего участника.
	}
	const handlePauseQueue = () => {
		// Заглушка: приостановка очереди.
	}
	const handleChangeStudentCount = ( _change: number ) => {
		// Заглушка: изменение количества одновременно защищающихся студентов.
	}
	const handleChangeDuration = ( _change: number ) => {
		// Заглушка: изменение общего времени в минутах.
	}

	return (
		<div className='min-h-full bg-c-bg-primary px-4 pt-5 pb-14 font-nunito text-base text-c-text-ink sm:px-6'>
			<div className='mb-7 flex flex-wrap items-center justify-between gap-4'>
				<div>
					<h1 className='text-3xl leading-tight font-extrabold sm:text-[40px]'>
						{ queue.discipline }
					</h1>
					<p className='mt-3 text-c-text-muted'>
						{ queue.name } · { queue.date } · { queue.place }
					</p>
				</div>
				<button
					type='button'
					onClick={ handleCreateQueue }
					className='cursor-pointer rounded-lg px-4 py-3 font-bold transition-colors hover:bg-c-bg-foam focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-c-accent active:bg-c-border'
				>
					Создать очередь
				</button>
			</div>

			<div className='grid items-start gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
				<div className='min-w-0 rounded-[14px] border border-c-border bg-white p-5 sm:p-7'>
					<div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
						<h2 className='text-2xl font-extrabold'>Очередь · записей: { students.length }</h2>
						<span className='rounded-lg bg-c-bg-foam px-3 py-3 font-bold text-c-text-foam'>
							Запись открыта
						</span>
					</div>
					<div className='overflow-x-auto'>
						<table
							aria-label='Очередь студентов на защиту'
							className='w-full min-w-[480px] border-separate border-spacing-y-4 text-left'
						>
							<thead className='text-c-text-muted'>
								<tr>
									<th
										scope='col'
										className='w-[7%] px-2.5 pb-3 font-bold'
									>
										№
									</th>
									<th
										scope='col'
										className='w-[31%] px-2.5 pb-3 font-bold'
									>
										Студент
									</th>
									<th
										scope='col'
										className='w-[17%] px-2.5 pb-3 font-bold'
									>
										Работа
									</th>
									<th
										scope='col'
										className='px-2.5 pb-3 font-bold'
									>
										Статус
									</th>
								</tr>
							</thead>
							<tbody>
								{ students.map( ( student, index ) => (
									<tr
										key={ student.Id }
										className={ student.status === 'На защите' ? 'bg-c-bg-foam' : undefined }
									>
										<td className='px-2.5 py-2.5'>{ index + 1 }</td>
										<td className='px-2.5 py-2.5'>{ student.Name }</td>
										<td className='px-2.5 py-2.5'>{ student.task }</td>
										<td className='px-2.5 py-2.5'>{ student.status }</td>
									</tr>
								) ) }
							</tbody>
						</table>
					</div>
					<p className='mt-1 text-c-text-muted'>Все имена в схеме условные.</p>
				</div>

				<div className='min-w-0 rounded-[14px] border border-c-border bg-white p-5 sm:p-7'>
					<h2 className='text-base font-normal text-c-text-muted'>
						Текущая защита
					</h2>
					<p className='mt-5 text-2xl font-extrabold'>Студент А.</p>
					<p className='mt-4 text-xl'>Лабораторная № 2</p>
					<p className='mt-5 leading-6 text-c-text-muted'>
						После завершения будет вызван следующий участник.
					</p>
					<div className='mt-5 flex flex-col gap-[18px]'>
						<button
							type='button'
							onClick={ handleFinishDefense }
							className='min-h-[52px] cursor-pointer rounded-xl bg-c-accent px-3.5 py-3 text-left font-bold text-white transition-colors hover:bg-c-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-c-accent active:bg-c-accent/80'
						>
							Завершить и вызвать следующего
						</button>
						<button
							type='button'
							onClick={ handlePauseQueue }
							className='min-h-[52px] cursor-pointer rounded-xl bg-c-bg-primary px-3.5 py-3 text-left font-bold transition-colors hover:bg-c-bg-foam focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-c-accent active:bg-c-border'
						>
							Приостановить очередь
						</button>
						<div className='flex min-h-[52px] flex-wrap items-center gap-1 rounded-xl bg-c-bg-primary px-3.5 py-2 font-bold'>
							<span className='mr-1'>Студентов на защиту:</span>
							<button
								type='button'
								aria-label='Уменьшить количество студентов'
								onClick={ () => handleChangeStudentCount( -1 ) }
								className='h-9 w-8 cursor-pointer rounded-md hover:bg-c-bg-foam focus-visible:outline-2 focus-visible:outline-c-accent active:bg-c-border'
							>
								−
							</button>
							<span>1</span>
							<button
								type='button'
								aria-label='Увеличить количество студентов'
								onClick={ () => handleChangeStudentCount( 1 ) }
								className='h-9 w-8 cursor-pointer rounded-md hover:bg-c-bg-foam focus-visible:outline-2 focus-visible:outline-c-accent active:bg-c-border'
							>
								+
							</button>
						</div>
						<div className='flex min-h-[52px] flex-wrap items-center gap-1 rounded-xl bg-c-bg-primary px-3.5 py-2 font-bold'>
							<span className='mr-1'>Общее время:</span>
							<button
								type='button'
								aria-label='Уменьшить общее время'
								onClick={ () => handleChangeDuration( -5 ) }
								className='h-9 w-8 cursor-pointer rounded-md hover:bg-c-bg-foam focus-visible:outline-2 focus-visible:outline-c-accent active:bg-c-border'
							>
								−
							</button>
							<span>90 мин</span>
							<button
								type='button'
								aria-label='Увеличить общее время'
								onClick={ () => handleChangeDuration( 5 ) }
								className='h-9 w-8 cursor-pointer rounded-md hover:bg-c-bg-foam focus-visible:outline-2 focus-visible:outline-c-accent active:bg-c-border'
							>
								+
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className='mt-7 rounded-[14px] border border-c-border bg-white p-5 sm:p-7'>
				<h2 className='text-base font-bold text-c-text-foam'>
					Только живая очередь · обновление в реальном времени
				</h2>
				<p className='mt-5 text-c-text-muted'>
					Каждый участник может один раз уйти в конец очереди. После
					использования кнопка становится недоступной.
				</p>
			</div>
		</div>
	)
}
