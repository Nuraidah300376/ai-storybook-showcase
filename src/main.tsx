import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/fraunces/500.css'
import '@fontsource/fraunces/700.css'
import '@fontsource/fraunces/500-italic.css'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import './index.css'
import App from './App'
import { LALUAN_RENDER, PentasEksport } from './components/tiktok/PentasEksport'

// `#render-tiktok` hanya digunakan oleh skrip eksport video (Chromium tanpa kepala).
const modRender = window.location.hash === LALUAN_RENDER

createRoot(document.getElementById('root')!).render(<StrictMode>{modRender ? <PentasEksport /> : <App />}</StrictMode>)
