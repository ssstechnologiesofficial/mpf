import { createContext, useContext, useState, useMemo } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    occupation: '',
    dob: '',
    age: '',
    gender: '',
    maritalStatus: '',
    dependents: ''
  })

  const value = useMemo(() => ({ basicInfo, setBasicInfo }), [basicInfo])
  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}

