export const mapAuth0User = (authUser) => ({
  auth0Id: authUser.sub,
  email: authUser.email,
  firstname: authUser.given_name ?? authUser.nickname ?? "",
  lastname: authUser.family_name ?? "",
});