import React, { useContext } from 'react'
import {
  ChakraProvider,
  Box,
  Grid,
  theme
} from '@chakra-ui/react'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import RoomsList from './pages/RoomsList'
import ChatRoom from './pages/ChatRoom'
import UserLoginModal from './components/UserLoginModal/UserLoginModal'
import { UserContext } from './user'

function App () {
  const { username, updateUsername, chatRoom } = useContext(UserContext)

  return (
    <ChakraProvider theme={theme}>
      <Box fontSize='xl'>
        <Grid minH='100vh' p={3}>
          <ColorModeSwitcher justifySelf='flex-end' />
          <UserLoginModal isOpen={username === null} loginUser={(user) => updateUsername(user)} />
          {
            chatRoom === null ? <RoomsList /> : <ChatRoom />
          }
        </Grid>
      </Box>
    </ChakraProvider>
  )
}

export default App
