import { apiClient } from '../../../libs/axios'
import type {
	AttemptRead,
	BanRead,
	Enrollment,
	Evaluation,
	HistoryItem,
	ListQueuesParams,
	PaginationParams,
	Participant,
	ParticipantAction,
	QueueDetail,
	SessionCreate,
	SessionOptions,
	SessionRead,
	SessionUpdate,
	SwapRead,
	WorkRead
} from './queues.api.d'

// ============================================================================
// ОБЩИЕ ЗАПРОСЫ (ЧТЕНИЕ ОЧЕРЕДЕЙ ДЛЯ ВСЕХ РОЛЕЙ)
// ============================================================================

export const getQueues = async (
	params?: ListQueuesParams
): Promise< QueueDetail[] > => {
	// Получает общий список очередей с фильтрацией по дисциплине, стадии, потоку и открытости регистрации
	const { data } = await apiClient.get< QueueDetail[] >( '/api/v1/queues', {
		params
	} )
	return data
}

export const getAllWorks = async (): Promise< WorkRead[] > => {
	const limit = 100
	const works: WorkRead[] = []
	while ( true ) {
		const { data } = await apiClient.get< WorkRead[] >( '/api/v1/works', {
			params: { limit, offset: works.length }
		} )
		works.push( ...data )
		if ( data.length < limit ) return works
	}
}

export const getMyQueues = async (
	params?: PaginationParams
): Promise< QueueDetail[] > => {
	// Получает список очередей, в которых участвует или которыми управляет текущий пользователь
	const { data } = await apiClient.get< QueueDetail[] >( '/api/v1/me/queues', {
		params
	} )
	return data
}

export const getQueueById = async (
	queueId: string
): Promise< QueueDetail > => {
	// Получает детальную информацию о конкретной очереди, включая список участников, статус ожидания и запись текущего студента
	const { data } = await apiClient.get< QueueDetail >(
		`/api/v1/queues/${ queueId }`
	)
	return data
}

export const getQueueHistory = async (
	queueId: string,
	params?: PaginationParams
): Promise< HistoryItem[] > => {
	// Получает историю попыток сдачи и оценок в рамках конкретной очереди
	const { data } = await apiClient.get< HistoryItem[] >(
		`/api/v1/queues/${ queueId }/history`,
		{
			params
		}
	)
	return data
}

// ============================================================================
// ЗАПРОСЫ СО СТОРОНЫ СТУДЕНТА
// ============================================================================

export const enrollInQueue = async (
	queueId: string,
	payload: Enrollment
): Promise< Participant > => {
	// Записывает текущего студента в очередь с указанием списка работ и ссылок на артефакты
	const { data } = await apiClient.post< Participant >(
		`/api/v1/queues/${ queueId }/entries`,
		payload
	)
	return data
}

export const cancelMyQueueEntry = async (
	queueId: string
): Promise< void > => {
	// Отменяет запись текущего студента и удаляет его из очереди
	await apiClient.delete( `/api/v1/queues/${ queueId }/entries/me` )
}

export const moveMyEntryToEnd = async (
	queueId: string
): Promise< Participant > => {
	// Перемещает текущего студента в самый конец активной очереди
	const { data } = await apiClient.post< Participant >(
		`/api/v1/queues/${ queueId }/entries/me/move-to-end`
	)
	return data
}

export const proposePositionSwitch = async (
	queueId: string,
	queueNumber: number
): Promise< SwapRead > => {
	// Предлагает обмен местами студенту на указанной позиции (доступно начиная с 4-го места в очереди)
	const { data } = await apiClient.post< SwapRead >(
		`/api/v1/queues/${ queueId }/entries/me/switch/${ queueNumber }`
	)
	return data
}

export const createSwapOffer = async (
	queueId: string,
	fromEntryId: string,
	toEntryId: string
): Promise< SwapRead > => {
	// Создаёт предложение обмена местами между двумя конкретными записями в очереди
	const { data } = await apiClient.post< SwapRead >(
		`/api/v1/queues/${ queueId }/swaps`,
		null,
		{
			params: {
				from_entry_id: fromEntryId,
				to_entry_id: toEntryId
			}
		}
	)
	return data
}

export const getMyQueueSwaps = async (
	queueId: string
): Promise< SwapRead[] > => {
	// Получает список входящих и исходящих предложений обмена местами для текущего студента в очереди
	const { data } = await apiClient.get< SwapRead[] >(
		`/api/v1/queues/${ queueId }/swaps`
	)
	return data
}

export const acceptSwapOffer = async (
	queueId: string,
	swapId: string
): Promise< SwapRead > => {
	// Принимает входящее предложение обмена местами в очереди
	const { data } = await apiClient.post< SwapRead >(
		`/api/v1/queues/${ queueId }/swaps/${ swapId }/accept`
	)
	return data
}

export const declineSwapOffer = async (
	queueId: string,
	swapId: string
): Promise< SwapRead > => {
	// Отклоняет входящее предложение обмена местами в очереди
	const { data } = await apiClient.post< SwapRead >(
		`/api/v1/queues/${ queueId }/swaps/${ swapId }/decline`
	)
	return data
}

export const cancelSwapOffer = async (
	queueId: string,
	swapId: string
): Promise< SwapRead > => {
	// Отзывает ранее отправленное текущим студентом предложение обмена местами
	const { data } = await apiClient.post< SwapRead >(
		`/api/v1/queues/${ queueId }/swaps/${ swapId }/cancel`
	)
	return data
}

// ============================================================================
// ЗАПРОСЫ СО СТОРОНЫ ПРЕПОДАВАТЕЛЯ (И АДМИНИСТРАТОРА)
// ============================================================================

export const getSessionOptions = async (): Promise< SessionOptions > => {
	// Получает дисциплины, преподавателей и идентификатор потока для формы создания сессии
	const { data } = await apiClient.get< SessionOptions >(
		'/api/v1/session-options'
	)
	return data
}

export const createQueueSession = async (
	payload: SessionCreate
): Promise< SessionRead > => {
	// Создаёт новую предварительную сессию очереди на защиту работ
	const { data } = await apiClient.post< SessionRead >(
		'/api/v1/queues',
		payload
	)
	return data
}

export const updateQueueSession = async (
	queueId: string,
	payload: SessionUpdate
): Promise< SessionRead > => {
	// Редактирует параметры незавершённой сессии очереди (название, время, аудиторию, квоту, список работ и преподавателей)
	const { data } = await apiClient.patch< SessionRead >(
		`/api/v1/queues/${ queueId }`,
		payload
	)
	return data
}

export const setQueueRegistration = async (
	queueId: string,
	open: boolean
): Promise< SessionRead > => {
	// Открывает или закрывает запись студентов в очередь
	const { data } = await apiClient.post< SessionRead >(
		`/api/v1/queues/${ queueId }/registration`,
		{ open }
	)
	return data
}

export const activateQueueSession = async (
	queueId: string
): Promise< SessionRead > => {
	// Вручную переводит сессию очереди в активный статус и начинает приём работ
	const { data } = await apiClient.post< SessionRead >(
		`/api/v1/queues/${ queueId }/activate`
	)
	return data
}

export const finishQueueSession = async (
	queueId: string,
	reason?: string
): Promise< SessionRead > => {
	// Вручную завершает сессию очереди с опциональным указанием причины
	const { data } = await apiClient.post< SessionRead >(
		`/api/v1/queues/${ queueId }/finish`,
		reason ? { reason } : null
	)
	return data
}

export const callNextStudent = async (
	queueId: string,
	idempotencyKey?: string
): Promise< AttemptRead > => {
	// Вызывает на защиту следующего по порядку студента из очереди
	const { data } = await apiClient.post< AttemptRead >(
		`/api/v1/queues/${ queueId }/call-next`,
		null,
		{
			headers: idempotencyKey
				? { 'Idempotency-Key': idempotencyKey }
				: undefined
		}
	)
	return data
}

export const changeStudentStatus = async (
	queueId: string,
	studentId: string,
	payload: ParticipantAction,
	idempotencyKey?: string
): Promise< Participant > => {
	// Меняет статус студента в очереди (например, вызывает вне очереди с confirm_out_of_order, начинает защиту или возвращает в ожидание)
	const { data } = await apiClient.patch< Participant >(
		`/api/v1/queues/${ queueId }/students/${ studentId }`,
		payload,
		{
			headers: idempotencyKey
				? { 'Idempotency-Key': idempotencyKey }
				: undefined
		}
	)
	return data
}

export const evaluateStudent = async (
	queueId: string,
	studentId: string,
	payload: Evaluation
): Promise< AttemptRead > => {
	// Выставляет оценки или зачёты по работам студента либо фиксирует его неявку (absent)
	const { data } = await apiClient.post< AttemptRead >(
		`/api/v1/queues/${ queueId }/students/${ studentId }/evaluate`,
		payload
	)
	return data
}

export const moveStudentEntryToEnd = async (
	queueId: string,
	entryId: string
): Promise< Participant > => {
	// Переносит запись конкретного студента в конец очереди от имени преподавателя
	const { data } = await apiClient.post< Participant >(
		`/api/v1/queues/${ queueId }/entries/${ entryId }/move-to-end`
	)
	return data
}

export const cancelStudentEntryById = async (
	queueId: string,
	entryId: string
): Promise< void > => {
	// Отменяет конкретную запись студента в очереди по идентификатору записи
	await apiClient.delete( `/api/v1/queues/${ queueId }/entries/${ entryId }` )
}

export const removeStudentFromQueue = async (
	queueId: string,
	studentId: string,
	reason: string
): Promise< void > => {
	// Удаляет студента из очереди с обязательным указанием причины
	await apiClient.delete(
		`/api/v1/queues/${ queueId }/students/${ studentId }`,
		{
			data: { reason }
		}
	)
}

export const getQueueBans = async ( queueId: string ): Promise< BanRead[] > => {
	// Получает список студентов, которым заблокирована запись в данную очередь
	const { data } = await apiClient.get< BanRead[] >(
		`/api/v1/queues/${ queueId }/bans`
	)
	return data
}

export const liftStudentBan = async (
	queueId: string,
	studentId: string
): Promise< void > => {
	// Снимает блокировку на запись в очередь с указанного студента
	await apiClient.delete(
		`/api/v1/queues/${ queueId }/students/${ studentId }/ban`
	)
}
