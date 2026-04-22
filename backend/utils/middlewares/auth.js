import { auth } from "express-oauth2-jwt-bearer";
import '@dotenvx/dotenvx/config'

// JWT validation middleware
const checkJwt = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: process.env.AUTH0_AUDIENCE,
});

export default checkJwt;