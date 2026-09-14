import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ProgressProvider } from './lib/state.jsx'
import { applyTheme, readTheme } from './lib/theme.js'
import './styles.css'

// Det gemte tema sættes, før noget tegnes, så siden ikke blinker hvid først.
applyTheme(readTheme())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </StrictMode>,
)
