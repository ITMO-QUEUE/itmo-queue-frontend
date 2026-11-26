import { apiClient } from '../../../libs/axios'
import type {
	GetStudentsParams,
	GetUsersParams,
	SessionOptions,
	StudentCreate,
	StudentList,
	StudentRead,
	StudentUpdate,
	TeacherOption,
	UserCreate,
	UserProfile,
	UserUpdate
} from './users.api.d'

// ============================================================================
// ОБЩИЕ ПОЛЬЗОВАТЕЛИ (АДМИНИСТРИРОВАНИЕ: СТУДЕНТЫ, ПРЕПОДАВАТЕЛИ, АДМИНЫ)
// ============================================================================

export const getUsers = async (
	params: GetUsersParams = { limit: 100, offset: 0 }
): Promise< UserProfile[] > => {
	// Получает список всех пользователей системы с пагинацией (совместим с UserProfile для UIUserRow)
	const { data } = await apiClient.get< UserProfile[] >( '/api/v1/users', {
		params
	} )
	return data
}

export const createUser = async (
	payload: UserCreate
): Promise< UserProfile > => {
	// Регистрирует нового пользователя с заданной ролью (student, teacher или admin)
	const { data } = await apiClient.post< UserProfile >(
		'/api/v1/auth/register',
		payload
	)
	return data
}

export const updateUserAccess = async (
	userId: string,
	payload: UserUpdate
): Promise< UserProfile > => {
	// Обновляет статус активности, право создавать очереди, поток или список дисциплин преподавателя
	const { data } = await apiClient.patch< UserProfile >(
		`/api/v1/users/${ userId }`,
		payload
	)
	return data
}

// ============================================================================
// СТУДЕНТЫ (УПРАВЛЕНИЕ КАРТОЧКАМИ СТУДЕНТОВ)
// ============================================================================

export const getStudents = async (
	params?: GetStudentsParams
): Promise< StudentList > => {
	// Получает пагинированный список студентов с поддержкой серверного поиска по имени, логину или ИСУ
	const { data } = await apiClient.get< StudentList >( '/api/v1/students', {
		params
	} )
	return data
}

export const getStudentById = async (
	studentId: string
): Promise< StudentRead > => {
	// Получает детальную информацию о конкретном студенте по его UUID
	const { data } = await apiClient.get< StudentRead >(
		`/api/v1/students/${ studentId }`
	)
	return data
}

export const createStudent = async (
	payload: StudentCreate
): Promise< StudentRead > => {
	// Создаёт учётную запись студента напрямую через раздел управления студентами
	const { data } = await apiClient.post< StudentRead >(
		'/api/v1/students',
		payload
	)
	return data
}

export const updateStudent = async (
	studentId: string,
	payload: StudentUpdate
): Promise< StudentRead > => {
	// Редактирует ФИО, логин, номер ИСУ или пароль существующего студента
	const { data } = await apiClient.patch< StudentRead >(
		`/api/v1/students/${ studentId }`,
		payload
	)
	return data
}

export const deleteStudent = async ( studentId: string ): Promise< void > => {
	// Удаляет учётную запись студента из системы
	await apiClient.delete( `/api/v1/students/${ studentId }` )
}

// ============================================================================
// ПРЕПОДАВАТЕЛИ (СПРАВОЧНИК И ПРИВЯЗКА ДИСЦИПЛИН)
// ============================================================================

export const getTeachersList = async (): Promise< TeacherOption[] > => {
	// Получает список преподавателей и привязанных к ним дисциплин из параметров создания сессии
	const { data } = await apiClient.get< SessionOptions >(
		'/api/v1/session-options'
	)
	return data.teachers
}

export const assignTeacherDisciplines = async (
	teacherId: string,
	disciplineIds: string[]
): Promise< UserProfile > => {
	// Назначает или обновляет список дисциплин, которые может вести указанный преподаватель
	return updateUserAccess( teacherId, { discipline_ids: disciplineIds } )
}
