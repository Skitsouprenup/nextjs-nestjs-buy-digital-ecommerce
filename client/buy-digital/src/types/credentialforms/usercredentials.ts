export interface UserInfo {
  name: string
  email: string
  role: string
  id: string
}

export interface UserDataPayload {
  user: UserInfo
  token: string
}