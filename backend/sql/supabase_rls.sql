create or replace function public.current_user_id()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select "userId"
  from public."Users"
  where "auth0Id" = auth.jwt()->>'sub'
  limit 1;
$$;

alter table public."Users" enable row level security;
alter table public."Bookings" enable row level security;
alter table public."Rooms" enable row level security;
alter table public."RoomImage" enable row level security;
alter table public."Address" enable row level security;
alter table public."Services" enable row level security;
alter table public."Reviews" enable row level security;
alter table public."Likes" enable row level security;

create policy "Users can view own profile"
on public."Users"
for select
to authenticated
using ("auth0Id" = auth.jwt()->>'sub');

create policy "Users can insert own profile"
on public."Users"
for insert
to authenticated
with check ("auth0Id" = auth.jwt()->>'sub');

create policy "Users can update own profile"
on public."Users"
for update
to authenticated
using ("auth0Id" = auth.jwt()->>'sub')
with check ("auth0Id" = auth.jwt()->>'sub');

create policy "Users can delete own profile"
on public."Users"
for delete
to authenticated
using ("auth0Id" = auth.jwt()->>'sub');

create policy "Anyone can read rooms"
on public."Rooms"
for select
to anon, authenticated
using (true);

create policy "Anyone can read addresses"
on public."Address"
for select
to anon, authenticated
using (true);

create policy "Anyone can read room images"
on public."RoomImage"
for select
to anon, authenticated
using (true);

create policy "Anyone can read services"
on public."Services"
for select
to anon, authenticated
using (true);

create policy "Users can view own bookings"
on public."Bookings"
for select
to authenticated
using ("userId" = public.current_user_id());

create policy "Users can create own bookings"
on public."Bookings"
for insert
to authenticated
with check ("userId" = public.current_user_id());

create policy "Users can update own bookings"
on public."Bookings"
for update
to authenticated
using ("userId" = public.current_user_id())
with check ("userId" = public.current_user_id());

create policy "Users can delete own bookings"
on public."Bookings"
for delete
to authenticated
using ("userId" = public.current_user_id());

create policy "Anyone can read reviews"
on public."Reviews"
for select
to anon, authenticated
using (true);

create policy "Users can create own reviews"
on public."Reviews"
for insert
to authenticated
with check ("userId" = public.current_user_id());

create policy "Users can update own reviews"
on public."Reviews"
for update
to authenticated
using ("userId" = public.current_user_id())
with check ("userId" = public.current_user_id());

create policy "Users can delete own reviews"
on public."Reviews"
for delete
to authenticated
using ("userId" = public.current_user_id());

create policy "Anyone can read likes"
on public."Likes"
for select
to anon, authenticated
using (true);

create policy "Users can create own likes"
on public."Likes"
for insert
to authenticated
with check ("userId" = public.current_user_id());

create policy "Users can delete own likes"
on public."Likes"
for delete
to authenticated
using ("userId" = public.current_user_id());