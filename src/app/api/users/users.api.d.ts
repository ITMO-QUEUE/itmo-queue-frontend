// Схемы общих пользователей (админы, преподаватели, студенты)
export type UserCreate = components[ 'schemas' ][ 'UserCreate' ]
export type UserProfile = components[ 'schemas' ][ 'UserProfile' ]
export type UserUpdate = components[ 'schemas' ][ 'UserUpdate' ]
export type UserRole = components[ 'schemas' ][ 'UserRole' ]

// Схемы студентов
export type StudentCreate = components[ 'schemas' ][ 'StudentCreate' ]
export type StudentRead = components[ 'schemas' ][ 'StudentRead' ]
export type StudentUpdate = components[ 'schemas' ][ 'StudentUpdate' ]
export type StudentList = components[ 'schemas' ][ 'StudentList' ]

// Схемы преподавателей и справочников
export type TeacherOption = components[ 'schemas' ][ 'TeacherOption' ]
export type SessionOptions = components[ 'schemas' ][ 'SessionOptions' ]

// Типы параметров запросов
export interface GetUsersParams {
	limit?: number
	offset?: number
}

export type GetStudentsParams = paths[ '/api/v1/students' ][ 'get' ][
	'parameters'
][ 'query' ]
