# Product image storage (Supabase Storage)

The Staff Console now uploads product photos directly from your computer
instead of needing an image URL. This uses **Supabase Storage** — free up to
1GB on the Free tier, which is plenty for product photos.

## 1. Create the storage bucket
1. In Supabase, go to **Storage** (left sidebar)
2. Click **New bucket**
3. Name it exactly: `product-images`
4. Toggle **Public bucket** to **ON** — this lets customers' browsers load the
   images without needing to be logged in (like any normal e-commerce image)
5. Click **Create bucket**

## 2. Add access policies
Public bucket lets anyone *read* files, but by default no one can *upload*.
Go to **SQL Editor → New query** and run:

```sql
-- Anyone can view product images (needed for the storefront to display them)
create policy "Public read access for product images"
on storage.objects for select
using (bucket_id = 'product-images');

-- Only staff can upload new product images
create policy "Staff can upload product images"
on storage.objects for insert
with check (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.profiles where id = auth.uid() and role = 'staff'
  )
);

-- Only staff can delete product images
create policy "Staff can delete product images"
on storage.objects for delete
using (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.profiles where id = auth.uid() and role = 'staff'
  )
);
```

## 3. Try it
1. Go to your site → **Staff Console → Manage Products**
2. Under "Add new build" (or when editing an existing product), click
   **Choose photo from PC**
3. Pick a JPG/PNG under 5MB
4. It uploads, shows a preview, and fills in the image automatically — no
   URL needed
5. Save the product and check it shows up correctly on the storefront

## Notes
- Images are stored under `products/<timestamp>-<random>.<ext>` inside the
  bucket, so filenames never collide even if two staff members upload
  `photo.jpg` at the same time.
- The 5MB limit is enforced in the upload component
  (`components/ImageUploader.tsx`) — raise `MAX_SIZE_MB` there if you need
  larger files, but bigger images will slow down page loads for customers.
- Deleting a product does **not** currently delete its stored image file —
  harmless (just uses a little storage space), but worth knowing.
