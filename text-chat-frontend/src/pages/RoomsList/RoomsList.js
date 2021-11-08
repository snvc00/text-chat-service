import React, { useContext, useEffect, useState } from 'react'
import {
  Heading,
  VStack,
  Text,
  Skeleton
} from '@chakra-ui/react'
import RoomCard from '../../components/RoomCard/RoomCard'
import { useToast } from '@chakra-ui/toast'
import { UserContext } from '../../user'

function RoomsList () {
  const [availableRooms, setAvailableRooms] = useState([])
  const { username, userId, updateChatRoom } = useContext(UserContext)
  const toast = useToast()

  useEffect(() => {
    fetch(process.env.REACT_APP_CHATROOM_DISCOVERY_MICROSERVICE_ENDPOINT)
      .then((response) => response.json())
      .then((data) => {
        setAvailableRooms(data)
        toast({
          title: 'Fetch complete.',
          description: 'Pst, pst. Check out Apex Legends, it is pretty cool ;)',
          status: 'info',
          isClosable: true
        })
      })
      .catch((error) => {
        console.error(error)
        toast({
          title: 'Application error.',
          description: 'We\'ve failed trying to fetch the available chat rooms.',
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      })
  }, [])

  return (
    <React.Fragment>
      <VStack spacing={8}>
        <Heading>Text Chat Service</Heading>
        <Skeleton startColor='blue.500' endColor='green.500' minH='400px' borderRadius='md' fadeDuration={1} isLoaded={username !== null && availableRooms.length > 0}>
          <VStack spacing={8}>
            <Text>Hi {username}<Text as='samp'>#{userId}</Text>! Welcome back, please join any of the available chat rooms.</Text>
            {
              availableRooms.map((room) => (
                <RoomCard key={room.title} {...room} onClick={() => updateChatRoom(room)} />
              ))
            }
          </VStack>
        </Skeleton>
      </VStack>
    </React.Fragment>
  )
}

export default RoomsList
