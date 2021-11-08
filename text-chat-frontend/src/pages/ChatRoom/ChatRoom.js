import React, { useContext, useEffect, useState } from 'react'
import {
  VStack,
  HStack,
  Box,
  Avatar,
  AvatarBadge,
  Text,
  Heading,
  Center,
  Flex,
  Spacer,
  Input,
  IconButton
} from '@chakra-ui/react'
import { ScaleFade } from '@chakra-ui/transition'
import { IoMdArrowBack, IoMdSend } from 'react-icons/io'
import Message from '../../components/Message'
import { UserContext } from '../../user'

function ChatRoom () {
  const { username, userId, chatRoom, updateChatRoom } = useContext(UserContext)
  const [ws, setWs] = useState()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const client = new WebSocket(`ws://${chatRoom.host}/chat`)
    client.onmessage = (message) => {
      setMessages(JSON.parse(message.data))
    }
    setWs(client)
  }, [])

  const sendMessage = () => {
    const fullMessage = {
      message,
      sender: {
        name: username,
        id: String(userId)
      },
      at: getDateTime()
    }

    ws.send(JSON.stringify(fullMessage))
    setMessage('')
  }

  const getDateTime = () => {
    return new Date().toLocaleString([], { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  const handleDisconnection = () => {
    ws.close()
    updateChatRoom(null)
  }

  return (
    <ScaleFade initialScale={0.9} in={true}>
      <Box p='5' borderWidth='1px' rounded='md' maxW='1000px' m='auto'>
        <Flex>
          <HStack spacing={8}>
            <Avatar size='lg' src={chatRoom.image} />
            <Heading>{chatRoom.title}</Heading>
          </HStack>
        </Flex>
        <br />
        <Flex>
          <Center cursor='pointer' onClick={handleDisconnection}>
            <IoMdArrowBack size='20px' />
            <Text ml='10px'>Back to Rooms</Text>
          </Center>
          <Spacer />
          <HStack spacing={8}>
            <Avatar src={`https://avatars.dicebear.com/api/bottts/${username}.svg`}>
              <AvatarBadge boxSize='1.25em' bg='green.500' />
            </Avatar>
            <Text>{username}<Text as='samp'>#{userId}</Text></Text>
          </HStack>
        </Flex>
        <VStack spacing={4} my='20px'>
          {
            messages.map((messagePacket, index) => (
              <Message key={index} sender={messagePacket.sender} message={messagePacket.message} time={messagePacket.at} />
            ))
          }
        </VStack>
        <HStack>
          <Input onKeyPress={({ key }) => { if (key === 'Enter') sendMessage() }} value={message} onChange={({ target }) => setMessage(target.value)} />
          <IconButton
            colorScheme='green'
            aria-label='Send message'
            onClick={sendMessage}
            icon={<IoMdSend />}
          />
        </HStack>
      </Box>
    </ScaleFade>
  )
}

export default ChatRoom
