export type FieldErrorType = {
  error: string
  field: string
}

export type BaseResponse<D = {}> = {
  resultCode: number
  messages: string[]
  fieldsErrors: FieldErrorType[]
  data: D
}
