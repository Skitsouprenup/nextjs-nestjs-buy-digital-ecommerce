import { 
  LoginRequestPayload, 
  RegistrationRequestPayload 
} from "@/types/crud_payload/requestpayload"
import { ResponsePayload, requestMethods } from "./api"

export const userEndpoints = {
  activateAccount: async (email: string, otp: string): 
    Promise<ResponsePayload> => await requestMethods.get(`/users/activate/${otp}/${email}`),
  getUsers: async (type: string): 
    Promise<ResponsePayload> => await requestMethods.get(`/users?type=${type}`),
  getUser: async (id: string):
    Promise<ResponsePayload> => await requestMethods.get(`/users/${id}`),
  createUser: async (payload: RegistrationRequestPayload): 
    Promise<ResponsePayload> => await requestMethods.post('/users', payload),
  updateUser: async (
    id: string, 
    payload: Record<string, unknown>, 
    headers: Record<string, unknown>
  ): 
    Promise<ResponsePayload> => await requestMethods.put(`/users/${id}`,payload, headers),
  deleteUser: async (id: string, headers: Record<string, unknown>): 
    Promise<ResponsePayload> => await requestMethods.del(`/users/${id}`, headers),
  loginUser: async (payload: LoginRequestPayload): 
    Promise<ResponsePayload> => await requestMethods.post(`/users/login`,payload),
  logoutUser: async (): 
    Promise<ResponsePayload> => await requestMethods.get(`/users/logout`),
  resendOtp: async (email: string): 
    Promise<ResponsePayload> => 
      await requestMethods.get(`/users/otp/resend/${email}`),
  requestResetPassword: async (email: string): 
    Promise<ResponsePayload> => 
      await requestMethods.get(`/users/password/reset/${email}`),
  resetPassword: async (email: string, otp: string): 
    Promise<ResponsePayload> => 
      await requestMethods.patch(`/users/password/reset?email=${email}&otp=${otp}`),
  createReview: async (
    productId: string,
    payload: Record<string, unknown>, 
    headers: Record<string, unknown>
  ): Promise<ResponsePayload> =>
      await requestMethods.post(`/products/review/${productId}`, payload, headers) 
    
}