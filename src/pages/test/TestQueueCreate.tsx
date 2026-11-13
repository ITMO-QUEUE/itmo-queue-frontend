import { useState } from 'react'
import {
	TeacherQueueCreate,
	type TeacherQueueCreateData
} from '../../features/queue-teacher/components/TeacherQueueCreate'

export const TestQueueCreate = () => {
	const [ submittedData, setSubmittedData ] =
		useState< TeacherQueueCreateData | null >( null )

	return (
		<main className='h-full w-full overflow-auto bg-bg-page p-4 md:p-10'>
			<div className='mx-auto flex max-w-6xl flex-col gap-6'>
				<h1 className='text-heading text-text-primary'>Создание очереди</h1>
				<TeacherQueueCreate onSubmit={ data => setSubmittedData( data ) } />
				{ submittedData && (
					<section className='rounded-card bg-bg-surface p-6'>
						<h2 className='text-subheading'>
							Данные формы (без отправки на сервер)
						</h2>
						<pre className='mt-4 overflow-auto text-small'>
							{ JSON.stringify( submittedData, null, 2 ) }
						</pre>
					</section>
				) }
			</div>
		</main>
	)
}
