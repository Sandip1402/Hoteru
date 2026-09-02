[x] - updated and migrated/commited, [o] - updated only, [] - upcoming updates, [Y] - okay

1. Send confirmation message to mail & phone no.
2. Add redis for caching
3. Add FAQ's in Footer
4. bring same tailwind classes under css using @apply (https://medium.com/full-stack-forge/stop-using-tailwind-like-a-beginner-heres-how-pros-do-it-4d2b6c712fa7)
5. For production ready need to add CORS if going for separate domain for frontend and backend
    avoid CORS when deploying. Increases performance, cookie management and configuration overhead.
    Ref - https://docs.google.com/document/d/1CA3V5v1UejtOBO0EQNGfy5s6yVsph9kPuIZ2IeJbIFg/edit?pli=1&tab=t.0
6. Need to replace developer keys in auth0 before deployment, get it form google cloud console
7. Will store temporal values in session storage, like, checkin, checkout, guests etc.
8. Need to apply skeleton loading, add errorboundaries
9. Add password strength checker

## Process Updates
    - [x] Fetch listing images with separate api call
    - [x] Need to update router state data transfer for booking data from roomDetails page to payment page
    - [x] Navbar login options are getting lost when refreshing, maybe state issue
    - [x] Tokens are exposed in request header in network tab - completely fine, encrypted if it is https
    - [ ] Fix abort controllers for api calls - need to work with idempotent keys to handle transactions
    - [ ] Redirecting Issue still there
    - [ ] Currently If a process(booking) can't be done, it's showing error code to client instead of proper message
    - [ ] For check in operation, there should be option for cash and online mode for unpaid amounts
    - [ ] What should happen if someone cancels a payment, currently that particual payment data is staying with status as processing
    - [ ] Add cache for form values
    - [ ] Protected route currentUser roles problem
    - [ ] Check !isAuthenticated state in CreateListing form
    - [ ] Access token is visible in network tab through getAccessTokenSilently api call i.g,

Pros :
1. auth0-react sdk uses state paramets which helps against CSRF attacks, (https://auth0.com/docs/secure/attack-protection/state-parameters)