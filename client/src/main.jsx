import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RoleSesion } from './services/RoleContext.jsx'
import { ConnectionProvider } from './context/connectionContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <ConnectionProvider>
    <RoleSesion>
      <App />
    </RoleSesion>
  </ConnectionProvider>
  // </StrictMode>
)
