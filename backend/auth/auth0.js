import { env } from "../config.js";
import AppError from "../utils/app-error.js";

export const assignHostRoleInAuth0 = async (auth0UserId) => {

    // Fetch Management API Access Token (fix : need to cache this token in production)
    const tokenResponse = await fetch(`https://${env.AUTH0_DOMAIN}/oauth/token`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            grant_type: 'client_credentials',
            client_id: env.AUTH0_APP_CLIENT_ID,
            client_secret: env.AUTH0_APP_CLIENT_SECRET,
            audience: `https://${env.AUTH0_DOMAIN}/api/v2/`
        }),
    });

    if (!tokenResponse.ok) {
        throw new AppError(400, "Error fetching new token");
    }

    const tokenData = await tokenResponse.json();

    const MGMT_API_ACCESS_TOKEN = tokenData.access_token;
    const HOST_ROLE_ID = env.HOST_ROLE_ID;

    // assign the Host role to user in Auth0
    const roleResponse = await fetch(`https://${env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0UserId)}/roles`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${MGMT_API_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
            roles: [HOST_ROLE_ID],
        }),
    });

    if (!roleResponse.ok) {
        throw new AppError(400, "Error assiging role.");
    }
}