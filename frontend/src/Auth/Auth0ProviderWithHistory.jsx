import { Auth0Provider } from '@auth0/auth0-react';
import { Router } from '../Router';

const Auth0ProviderWithHistory = ({ children }) => {

    const onRedirectCallback = (appState) => {
        Router.navigate(appState?.returnTo || "/", { replace: true });
    };

    return (
        <Auth0Provider
            domain={import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID}
            authorizationParams={{
                redirect_uri: window.location.origin,
                // audience: import.meta.env.VITE_REACT_APP_AUTH0_AUDIENCE
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>

    )
}

export default Auth0ProviderWithHistory