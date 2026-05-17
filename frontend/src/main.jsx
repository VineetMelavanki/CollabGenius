import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {GoogleOAuthProvider} from "@react-oauth/google"
import {OAuthifyProvider} from "oauthify"
import { Meta } from 'react-router-dom'
const CLIENT_ID="659066824406-8clgik6i16ef14pa8i920svco5m2l6vb.apps.googleusercontent.com"
createRoot(document.getElementById('root')).render(
  <StrictMode>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
        <App />
        </GoogleOAuthProvider>
  </StrictMode>,
)
