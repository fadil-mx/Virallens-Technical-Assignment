import React, { createContext, useEffect, useState } from 'react'

type AuthContextType = {
  token: string | null
  settoken: React.Dispatch<React.SetStateAction<string | null>>
  url: string
}

export const AuthContext = createContext<AuthContextType | null>(null)

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, settoken] = useState<string | null>(null)
  const url = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  useEffect(() => {
    async function loaddata() {
      if (localStorage.getItem('token')) {
        settoken(localStorage.getItem('token'))
      }
    }
    loaddata()
  }, [])

  return (
    <AuthContext.Provider value={{ token, settoken, url }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
