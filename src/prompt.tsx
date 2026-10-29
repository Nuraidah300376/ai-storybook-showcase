import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/fraunces/700.css'
import '@fontsource/fraunces/500-italic.css'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import './index.css'
import { HalamanMasterPrompt } from './components/HalamanMasterPrompt'

// Halaman ringan berasingan (prompt/index.html) untuk penonton yang mengimbas kod QR.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HalamanMasterPrompt pautanUtama="../" />
  </StrictMode>,
)
