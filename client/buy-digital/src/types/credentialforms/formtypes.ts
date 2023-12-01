
export type LoginFormData = {
  [index: string]: string
}

export interface RegisterFormData {
  email: string
  fullname: string
  password: string
  confirmPass: string
}

export interface AccountDetailsProperties {
  id: string
  email: string
  name: string
  oldPass: string
  newPass: string
  confirmNewPass: string
}