import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory.jsx';
import { HoteruAuthProvider } from "./auth/HoteruAuthProvider.jsx";


createRoot(document.getElementById('root')).render(
        <StrictMode>
                <Auth0ProviderWithHistory>
                        <HoteruAuthProvider>
                                <App />
                        </HoteruAuthProvider>
                </Auth0ProviderWithHistory>
        </StrictMode>
)
