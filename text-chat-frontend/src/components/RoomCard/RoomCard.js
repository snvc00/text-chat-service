import React from 'react'
import {
  Box,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Text,
  Tag,
  TagLabel,
  TagLeftIcon,
  Image
} from '@chakra-ui/react'
import { FaUser } from 'react-icons/fa'
import { string, number, func } from 'prop-types'

function RoomCard ({ title, usersCount, image, description, onClick }) {
  return (
    <LinkBox as='article' w='xl' p='5' borderWidth='1px' rounded='md' cursor='pointer'>
      <LinkOverlay onClick={onClick}>
        <Box>
          <Tag size='lg' variant='outline' colorScheme='green'>
            <TagLeftIcon as={FaUser} />
            <TagLabel>{usersCount}</TagLabel>
          </Tag>
        </Box>
        <Heading size='md' my='6'>{title}</Heading>
        <HStack spacing={8}>
          <Image boxSize='80px' src={image} alt={title} />
          <Text>{description}</Text>
        </HStack>
      </LinkOverlay>
    </LinkBox>
  )
}

RoomCard.propTypes = {
  title: string,
  usersCount: number,
  image: string,
  description: string,
  onClick: func
}

export default RoomCard
