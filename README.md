## 🔐 Authentication (Auth)
supabase.auth.signUp()
User ko email + password ke sath register krta hai.
supabase.auth.signInWithPassword()
Registered user ko login krta hai (email + password)
supabase.auth.getSession()
Currently logged-in user ki active session return krta hai.
supabase.auth.onAuthStateChange()
Login/logout/signup events ko realtime me sunta hai.
session.user
Logged-in user ka object jisme email, id waghera hota hai.

## 🗄️ Database (CRUD)
supabase.from('table')
Kis table me CRUD operation perform krna hai.

.select('*')
Table se rows fetch krta hai.

.order('column', { ascending })
Data ko sort krne ke liye use hota hai.

.insert()
Table me new row add krta hai.

.update()
Existing row update krta hai.

.delete()
Row delete krta hai.

.eq('column', value)
WHERE condition lagane ke liye (exact match).

.maybeSingle()
Insert/update ke baad single row return krne ki koshish krta hai, warna null.

## 🖼️ Storage (Images, Files)
supabase.storage.from('bucket')
Konse bucket me file upload ya download krni hai.

.upload(path, file)
Storage bucket me file upload krta hai.

.getPublicUrl(path)
Uploaded file ka public URL return krta hai jise React component me directly use kr sakte ho.

## 🔄 Realtime Subscriptions
supabase.channel('channel-name')
Realtime channel create krne ke liye.

.on('postgres_changes', filter, callback)
Database ke kuch events ko listen krta hai.
Filter me pass hota hai:
event: 'INSERT' | 'UPDATE' | 'DELETE'
schema: 'public'
table: 'your_table_name'

supabase.removeChannel(channel)
Realtime listener ko cleanup krne ke liye.

## 🧰 Useful React Patterns (Supabase Projects me use hotay hain)
useEffect()
Initial fetch + listeners add krne ke liye.

useState()
Form data, session, tasks waghera ko manage krne ke liye.

## 🎯 CRUD Flow Summary
1. Create
insert() + image upload (optional)

2. Read
select() + order()

3. Update
update() + eq(id)

4. Delete
delete() + eq(id)

5. Realtime
.on('postgres_changes') to auto-update UI.

## 🧩 Authentication Flow Summary
1. Register
auth.signUp()

2. Login
auth.signInWithPassword()

3. Get Session
auth.getSession()

4. Listen for Auth Events
auth.onAuthStateChange()

## ☁️ Storage Flow Summary
1. Upload File
storage.from(bucket).upload(path, file)

2. Get public URL
storage.from(bucket).getPublicUrl(path)