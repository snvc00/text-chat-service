import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Avatar,
  AvatarBadge,
  Text
} from '@chakra-ui/react'
import { IoIosDoneAll } from 'react-icons/io'
import { object, string } from 'prop-types'

function Message ({ sender, message, time }) {
  return (
    <Box borderWidth={1} borderRadius='md' p='2' alignSelf='end' width='50%'>
      <VStack>
        <Box alignSelf='start'>
          <HStack>
            <Avatar size='xs' src={`https://avatars.dicebear.com/api/bottts/${sender.name}.svg`}>
              <AvatarBadge boxSize='1.25em' bg='green.500' />
            </Avatar>
            <Text fontSize='md'>{sender.name}<Text as='samp'>#{sender.id}</Text></Text>
          </HStack>
        </Box>
        <Box alignSelf='end' p='2'>
          <Text fontSize='lg'>{message}</Text>
        </Box>
        <Box alignSelf='end'>
          <HStack>
            <Text fontSize='sm' color='green.500'>{time}</Text>
            <IoIosDoneAll color='green' />
          </HStack>
        </Box>
      </VStack>
    </Box>
  )
}

Message.propTypes = {
  sender: object,
  message: string,
  time: string
}

export default Message
