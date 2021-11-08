import { ColorModeScript } from '@chakra-ui/react'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { UserProvider } from './user'

ReactDOM.render(
  <StrictMode>
    <ColorModeScript />
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
  document.getElementById('root')
)
