[x] - updated and migrated/commited, [o] - updated only, [] - upcoming updates, [Y] - okay

## Database Updates
    - [x] Updated Listing models checkInTime, checkOutTime to DateTime with @db.Time to store time only 
    - [x] Removed Like model, added WishList with relationship to listing and user
    - [x] Added displayOrder, createdAt, isCover in listingImage and roomImage model
    - [x] Add amenities in Listing, two types of amenities room and listing, specific to their own
    - [x] Remove approvedAt and change it with reviewedAt for listing approval by admin
    - [x] update submit listing service

## Process Updates
    - [] Need to update search/suggestions route logic
    - [] carefull where two transaction operations happening sequentially
    - [] make sure in frontend, login request includes scope=openid profile email in x-www-form-urlencoded
    - [] after a user is upgraded to host, we need to tell them to re-log. Already assigned accesstokens won't have the host role in it

    - [o] update routes RESTfuly
	- [o] Fetch ownerId also in getRooms, host api, update verifyRoomOwnerShip
	- [o] delete listing image not deleting from cloudinary, only from db
	- [o] from api, host was able to send status="REJECTED", the request got successful, but data didn't changed, it should have told, unauthorized
            basically means protect specific fields of models
    - [o] if user select pay_now at booking only then after payement, paymentStatus in booking model should be updated to PAID, otherwise it shuold be pending
    - [Y] is the trimmed enum approach okay?

    - [] V2 : create the updation fields of model data from values, don't just do create(where:{}, data);
    - [] V2 : updating specific fields of a Listing should put it in PENDING stage for admin review