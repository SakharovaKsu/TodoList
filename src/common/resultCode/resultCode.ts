export const resultCode = {
  success: 0,
  error: 1,
  captcha: 10,
} as const

type ResultCode = (typeof resultCode)[keyof typeof resultCode]
