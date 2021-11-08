import { object } from 'prop-types'
import React, { createContext, useEffect, useState } from 'react'

export const UserContext = createContext()

export function UserProvider ({ children }) {
  const [chatRoom, setChatRoom] = useState(null)
  const [username, setUsername] = useState(null)
  const [userId, setUserId] = useState()

  useEffect(() => {
    setUserId(sessionStorage.getItem('user-id'))
    setUsername(sessionStorage.getItem('user'))
  }, [])

  const randomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
  }

  const updateUsername = (user) => {
    const id = randomInteger(1000, 9999)

    sessionStorage.setItem('user-id', id)
    sessionStorage.setItem('user', user)

    setUserId(id)
    setUsername(user)
  }

  return (
    <UserContext.Provider value={{ username, updateUsername, userId, chatRoom, updateChatRoom: (room) => setChatRoom(room) }}>
      {children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: object
}
