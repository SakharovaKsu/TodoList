type fieldsErrors = {
  error: string
  field: string
}

export type BaseResponse<D = {}> = {
  resultCode: number
  messages: Array<string>
  data: D
  fieldsErrors?: fieldsErrors[]
}
