export const resultCode = {
  success: 0,
  error: 1,
  captcha: 10,
} as const

type ResultCodeType = (typeof resultCode)[keyof typeof resultCode]
