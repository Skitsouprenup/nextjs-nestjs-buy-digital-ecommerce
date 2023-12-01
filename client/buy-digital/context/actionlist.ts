const userActions = [
  {
    name: 'LOGIN',
    action: (state: Record<string, unknown>, value: unknown) => {
      return { ...state, user: value } 
    }
  },
  {
    name: 'LOGOUT',
    /*eslint-disable-next-line no-unused-vars */
    action: (state: Record<string, unknown>, value: unknown) => 
      { return { ...state, user: value === null ? value : null } }
  },
  {
    name: 'UPDATE_USER',
    action: (state: Record<string, unknown>, value: unknown) => 
      { return { ...state, user: value } }
  },
]

const appToastActions = [
  {
    name: 'SHOW_APP_TOAST',
    action: (state: Record<string, unknown>, value: unknown) => 
    { 
      const data = value as {show: boolean, message: string}
      return { 
        ...state, 
        showAppToast: data.show,
        appToastMsg: data.message
      } 
    }
  },
]

export const actionList = [
  ...userActions,
  ...appToastActions
]