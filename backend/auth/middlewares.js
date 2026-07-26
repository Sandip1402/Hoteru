import { auth } from "express-oauth2-jwt-bearer";
import '@dotenvx/dotenvx/config'


// JWT validation middleware
export const checkJwt = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: process.env.AUTH0_AUDIENCE,
});


// middleware to attach user payload to request
export const attachUserPayload = async (req, res, next) => {
  const namespace = 'https://hoteru-dummy.com';

  // req brings accesstoken, create the user object from it
  const auth0Id = req.auth?.sub;
  if (!auth0Id) {
    return res.status(401).json({ message: "Missing auth subject" });
  }

  // fix : maybe use other api protocol to fetch only the user id not whole user object
  try{
    const user = await prisma.users.findUnique({
      where: { auth0Id }
    });
    
    if(!user) {
      return res.status(401).json({message: "User not found"});
    }
  }catch(err){
    next(err);
  }

  req.user = {
    id: user.userId, // auth0 user id -> database user id
    roles: req.auth.payload[`${namespace}/roles`] || []
  }
  // fix : maybe after getting id, roles accesstoken why not remove if from payload,
  // then need to carry less info

  next();
}


// attach current user info to request object
// export async function attachCurrentUser(req, res, next) {
//   try {
//     const auth0Id = req.auth?.sub;
//     if (!auth0Id) {
//       return res.status(401).json({ message: "Missing auth subject" });
//     }

//     const user = await prisma.users.findUnique({
//       where: { auth0Id }
//     });

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user;

//     next();
//   } catch (err) {
//     next(err);
//   }
// }


// role validation middleware
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const hasRole = req.user.roles.some(role => allowedRoles.includes(role));

    // required role not found
    if (!hasRole) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permission' });
    }

    next();
  }
}