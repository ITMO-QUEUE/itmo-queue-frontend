export type UIWorkPlaceProps = {
	Name: string
    CurentStudent?: []
    SaveResult: () => void | Promise<void>
    CallNext: () => void | Promise<void>
    StartDefence: () => void | Promise<void>
}

export enum UIWorkPlaceStatus {
	FREE = 'free',
    CALLING = 'calling'
    DEFENDING = 'defending'
}