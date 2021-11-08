import React from 'react'
import { render } from '@testing-library/react'
import { ChakraProvider, theme } from '@chakra-ui/react'
import { object } from 'prop-types'

const AllProviders = ({ children }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
)

AllProviders.propTypes = {
  children: object
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllProviders, ...options })

export { customRender as render }
