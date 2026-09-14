import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ProgressProvider } from './lib/state.jsx'
import { applyCourse, readCourse } from './lib/course.js'
import { applyTheme, readTheme } from './lib/theme.js'
import './styles.css'

// Tema og kursusfarve sættes, før noget tegnes, så siden ikke blinker først.
applyTheme(readTheme())
applyCourse(readCourse())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </StrictMode>,
)
