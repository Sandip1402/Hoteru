import '@dotenvx/dotenvx/config'

export const assignHostRoleInAuth0 = async (auth0UserId) => {

    // Fetch Management API Access Token (fix : need to cache this token in production)
    const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
        method: POST,
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_MNGMNT_CLIENT_ID,
        client_secret: process.env.AUTH0_MNGMNT_CLIENT_SECRET,
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`
    });

    const managementToken = tokenResponse.data.access_token;
    const HOST_ROLE_ID = '' // fix : get the role id

    // assign the Host role to user in Auth0
    await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0UserId)}/roles`,
        { method:POST },
        { roles: [HOST_ROLE_ID] },
        { Headers: { Authorization: `Bearer ${managementToken}` } }
    );
}