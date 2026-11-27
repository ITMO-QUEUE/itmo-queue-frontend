import { useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import {
	callNextStudent,
	changeStudentStatus,
	evaluateStudent,
	getQueueById
} from '../../../app/api/queues/queues.api'
import type {
	Participant,
	QueueDetail
} from '../../../app/api/queues/queues.api.d'
import type {
	ParticipantStatus,
	StudentRecord
} from '../../../types/StudentRecord'
import { getQueueErrorMessage } from '../utils/queueError'
import { DialogAbsent } from './DialogAbsent'
import {
	UIWorkPlace,
	type UIWorkPlaceProps,
	UIWorkPlaceStatus
} from './QueueWorkplace'

type TeacherWorkplaceProps = {
	queue: QueueDetail
	teacherId?: string
	name?: string
}

const SCORE_PATTERN = /^\d+(?:\.\d+)?$/

const isReceiving = ( student: Participant ) =>
	student.status === 'called' || student.status === 'in_defense'

const getTeacherStudent = ( queue: QueueDetail, teacherId?: string ) => {
	if ( ! teacherId ) return undefined
	const teacher = queue.teachers.find( item => item.id === teacherId )
	return queue.students.find(
		student =>
			isReceiving( student ) &&
			( student.id === teacher?.entry_id || student.teacher_id === teacherId )
	)
}

const toStudentRecord = ( student: Participant ): StudentRecord => ( {
	...student,
	status: student.status as ParticipantStatus
} )

const getOtherWorkplaces = ( queue: QueueDetail, teacherId?: string ) =>
	queue.teachers
		.filter( teacher => teacher.id !== teacherId )
		.map( teacher => {
			const student = getTeacherStudent( queue, teacher.id )
			const message = student
				? `${ teacher.name } ${ student.status === 'called' ? 'вызывает' : 'принимает' } ${ student.student_name }.`
				: `${ teacher.name } ${ teacher.is_busy ? 'принимает студента' : teacher.is_active ? 'свободен' : 'неактивен' }.`
			return { id: teacher.id, message }
		} )

export const TeacherWorkplace = ( {
	queue,
	teacherId,
	name
}: TeacherWorkplaceProps ) => {
	const queryClient = useQueryClient()
	const queryKey = [ 'queue', queue.id ]
	const actionLock = useRef( false )
	// Сохраняем ключ при потере ответа: повтор не должен вызвать нового студента.
	const callKey = useRef< string | null >( null )
	const [ isPending, setIsPending ] = useState( false )
	const [ message, setMessage ] = useState< string >()
	const [ savedStudent, setSavedStudent ] = useState< Participant >()
	const [ absentAttemptId, setAbsentAttemptId ] = useState< string | null >(
		null
	)
	const [ draft, setDraft ] = useState< {
		attemptId?: string | null
		scores: Record< string, string >
		saveStatus: UIWorkPlaceProps[ 'saveStatus' ]
	} >( { scores: {}, saveStatus: 'idle' } )
	const student = savedStudent ?? getTeacherStudent( queue, teacherId )
	const scores = student?.attempt_id === draft.attemptId ? draft.scores : {}
	const saveStatus =
		student?.attempt_id === draft.attemptId ? draft.saveStatus : 'idle'
	const status =
		savedStudent || student?.status === 'in_defense'
			? UIWorkPlaceStatus.DEFENDING
			: student
				? UIWorkPlaceStatus.CALLING
				: UIWorkPlaceStatus.FREE

	const refreshQueue = () =>
		queryClient.invalidateQueries( { queryKey, exact: true } )
	const updateStudent = ( updated: Participant ) => {
		queryClient.setQueryData< QueueDetail >( queryKey, previous =>
			previous
				? {
						...previous,
						students: previous.students.map( item =>
							item.id === updated.id ? updated : item
						)
					}
				: previous
		)
	}
	const runAction = async ( action: () => Promise< void > ) => {
		if ( actionLock.current ) return
		actionLock.current = true
		setIsPending( true )
		setMessage( undefined )
		try {
			await action()
		} catch ( error ) {
			setMessage( getQueueErrorMessage( error ) )
		} finally {
			actionLock.current = false
			setIsPending( false )
		}
	}
	const callNext = () =>
		runAction( async () => {
			callKey.current ??= crypto.randomUUID()
			// call-next сам назначает преподавателя и устанавливает статус called.
			await callNextStudent( queue.id, callKey.current )
			const freshQueue = await getQueueById( queue.id )
			await queryClient.cancelQueries( { queryKey, exact: true } )
			queryClient.setQueryData( queryKey, freshQueue )
			callKey.current = null
		} )
	const startDefence = () =>
		runAction( async () => {
			if ( ! student?.attempt_id ) return
			const updated = await changeStudentStatus(
				queue.id,
				student.student_id,
				{
					status: 'in_defense',
					attempt_id: student.attempt_id,
					confirm_out_of_order: false
				},
				student.attempt_id
			)
			updateStudent( updated )
			await refreshQueue()
		} )
	const saveResults = () =>
		runAction( async () => {
			if ( ! student?.attempt_id || savedStudent ) return
			const results = student.works.map( work => {
				const score = ( scores[ work.work_id ] ?? '' )
					.trim()
					.replace( ',', '.' )
				if (
					! SCORE_PATTERN.test( score ) ||
					! Number.isFinite( Number( score ) )
				) {
					throw new Error(
						`Укажите корректные баллы для работы «${ work.title }».`
					)
				}
				return { work_id: work.work_id, kind: 'score' as const, score }
			} )
			setDraft( {
				attemptId: student.attempt_id,
				scores,
				saveStatus: 'saving'
			} )
			try {
				await evaluateStudent( queue.id, student.student_id, {
					attempt_id: student.attempt_id,
					status: 'accepted',
					results
				} )
			} catch ( error ) {
				setDraft( {
					attemptId: student.attempt_id,
					scores,
					saveStatus: 'error'
				} )
				throw error
			}
			// evaluate завершает попытку на сервере; оставляем результаты до подтверждения.
			setSavedStudent( student )
			setDraft( { attemptId: student.attempt_id, scores, saveStatus: 'saved' } )
			updateStudent( { ...student, status: 'completed' } )
			void queryClient.invalidateQueries( {
				queryKey: [ ...queryKey, 'history' ]
			} )
			await refreshQueue()
		} )
	const finishDefence = () => {
		if ( actionLock.current || saveStatus !== 'saved' ) return
		setSavedStudent( undefined )
		setDraft( { scores: {}, saveStatus: 'idle' } )
		setMessage( undefined )
		callKey.current = null
	}
	const markAbsent = () =>
		runAction( async () => {
			if (
				! student?.attempt_id ||
				absentAttemptId !== student.attempt_id ||
				status !== UIWorkPlaceStatus.CALLING
			)
				return
			await evaluateStudent( queue.id, student.student_id, {
				attempt_id: student.attempt_id,
				status: 'absent',
				results: []
			} )
			setAbsentAttemptId( null )
			setDraft( { scores: {}, saveStatus: 'idle' } )
			callKey.current = null
			// Сервер возвращает запись в ожидание и переносит её в конец очереди.
			await Promise.all( [
				refreshQueue(),
				queryClient.invalidateQueries( {
					queryKey: [ ...queryKey, 'history' ]
				} )
			] )
		} )

	return (
		<>
			<UIWorkPlace
				Name={ name }
				CurentStudent={ student ? toStudentRecord( student ) : undefined }
				otherWorkplaces={ getOtherWorkplaces( queue, teacherId ) }
				status={ status }
				saveStatus={ saveStatus }
				isPending={ isPending }
				message={ message }
				scores={ scores }
				onScoreChange={ ( workId, value ) => {
					if ( isPending || savedStudent ) return
					setDraft( previous => ( {
						attemptId: student?.attempt_id,
						scores: {
							...( previous.attemptId === student?.attempt_id
								? previous.scores
								: {} ),
							[ workId ]: value
						},
						saveStatus: 'idle'
					} ) )
				} }
				CallNext={ callNext }
				StartDefence={ startDefence }
				OpenAbsent={ () => {
					if (
						! actionLock.current &&
						status === UIWorkPlaceStatus.CALLING &&
						student?.attempt_id
					) {
						setMessage( undefined )
						setAbsentAttemptId( student.attempt_id )
					}
				} }
				SaveResult={ saveResults }
				FinishDefence={ finishDefence }
			/>
			{ status === UIWorkPlaceStatus.CALLING &&
				student &&
				absentAttemptId !== null &&
				absentAttemptId === student.attempt_id && (
					<DialogAbsent
						name={ student.student_name }
						works={ student.works.map( work => work.title ) }
						MarkAbsent={ markAbsent }
						isPending={ isPending }
						message={ message }
						cancel={ () => {
							if ( ! actionLock.current ) setAbsentAttemptId( null )
						} }
					/>
				) }
		</>
	)
}
