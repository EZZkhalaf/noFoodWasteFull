

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter , HashRouter } from 'react-router-dom'
import { AuthProvider } from './Context/AuthContext.jsx'
import 'react-toastify/dist/ReactToastify.css';



createRoot(document.getElementById('root')).render(
  <StrictMode>
      {/* <BrowserRouter> */}
      <HashRouter >
        <AuthProvider>
          <App />
        
        </AuthProvider>
      </HashRouter>
      {/* </BrowserRouter>      */}
  </StrictMode>
)