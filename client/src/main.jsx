import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RoleSesion } from './services/RoleContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoleSesion>
      <App />
    </RoleSesion>
  </StrictMode>
)
