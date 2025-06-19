import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'click-spark'
import './lov-guard'

createRoot(document.getElementById('root')!).render(
  <App />
)
