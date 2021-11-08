import React, { useRef, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks'
import { bool, func } from 'prop-types'

function UserLoginModal ({ isOpen, loginUser }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const initialRef = useRef()
  const { onClose } = useDisclosure()

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onKeyPress={({ key }) => console.log(key)}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>To continue, please login</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>User</FormLabel>
            <Input ref={initialRef} placeholder='User' value={username} onChange={({ target }) => setUsername(target.value)} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Password</FormLabel>
            <Input placeholder='Password' value={password} onChange={({ target }) => setPassword(target.value)} type='password' />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={() => loginUser(username)}>
            Login
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

UserLoginModal.propTypes = {
  isOpen: bool,
  loginUser: func
}

export default UserLoginModal
