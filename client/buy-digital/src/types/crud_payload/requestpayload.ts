
export interface RegistrationRequestPayload {
  email: string
  name: string
  password: string
  role: string
}

export interface LoginRequestPayload {
  email: string
  password: string
}