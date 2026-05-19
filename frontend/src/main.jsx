import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Auth0ProviderWithHistory from './Auth/Auth0ProviderWithHistory.jsx';



createRoot(document.getElementById('root')).render(
        <StrictMode>
                <Auth0ProviderWithHistory>
                        <App />
                </Auth0ProviderWithHistory>
        </StrictMode>
)
