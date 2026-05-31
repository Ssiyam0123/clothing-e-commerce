
# 🛡️ Express API Complete Master Audit Report
**Run Date:** 6/1/2026, 1:12:34 AM
**Tested As User:** audit-admin@example.com (SuperAdmin)
**Total Tests Conducted:** 55

## 📊 Summary
* 🟢 **Successful Operations (2xx/3xx):** 54
* 🟡 **Client-side warnings/Not Found (4xx):** 1
* 🔴 **Severe Server Crashes (5xx):** 0

---

## 📝 Detailed Logs
| Name | Method | Route Tested | Status | Time | Response Preview |
|---|---|---|---|---|---|
| Root ping | `GET` | `/` | 🟢 200 | `38ms` | `{"success":true,"message":"Vanguard System Engine is Active.","environment":"development"}` |
| Auth Register | `POST` | `/api/auth/register` | 🟢 201 | `789ms` | `{"message":"Registration successful! (Email verification skipped)","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMWM4ODIzZDZmNWI1NjU5NDJlN` |
| Auth Login | `POST` | `/api/auth/login` | 🟢 200 | `169ms` | `{"message":"Login successful","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMWM4ODIzZDZmNWI1NjU5NDJlN2RiNCIsImlhdCI6MTc4MDI1NDc1NSwiZXhwIj` |
| Auth Verify Email | `GET` | `/api/auth/verify-email?token=invalid_dummy_token` | 🟢 302 | `212ms` | `Found. Redirecting to http://localhost:3000/login?error=invalid_token` |
| Auth Forgot Password | `POST` | `/api/auth/forgot-password` | 🟢 200 | `249ms` | `{"message":"Password reset link generated (SMTP not configured). Check server console for the link.","devResetUrl":"http://localhost:3000/reset-passwo` |
| Auth Reset Password | `POST` | `/api/auth/reset-password?token=dummy_token` | 🟡 400 | `221ms` | `{"message":"Invalid or expired reset token"}` |
| Auth Get Me | `GET` | `/api/auth/me` | 🟢 200 | `186ms` | `{"_id":"6a1c84e6b34720ab924803fe","name":"Audit Admin Modified","email":"audit-admin@example.com","avatar":"","role":{"_id":"6a032c6419f8ce1b5ea5e283"` |
| User Get Me | `GET` | `/api/users/me` | 🟢 200 | `192ms` | `{"_id":"6a1c84e6b34720ab924803fe","name":"Audit Admin Modified","email":"audit-admin@example.com","avatar":"","role":{"_id":"6a032c6419f8ce1b5ea5e283"` |
| User Update Profile | `PUT` | `/api/users/profile` | 🟢 200 | `303ms` | `{"_id":"6a1c84e6b34720ab924803fe","name":"Audit Admin User Updated","email":"audit-admin@example.com","phone":"","bio":"","avatar":"","role":{"_id":"6` |
| User Change Password | `PUT` | `/api/users/change-password` | 🟢 200 | `319ms` | `{"message":"Password updated successfully"}` |
| Get All Users | `GET` | `/api/users` | 🟢 200 | `437ms` | `{"users":[{"_id":"6a1c8823d6f5b565942e7db4","name":"Temp Audit User","email":"audit-user-1780254754710@example.com","avatar":"","role":{"_id":"6a032c6` |
| Get User by ID | `GET` | `/api/users/6a1c84e6b34720ab924803fe` | 🟢 200 | `303ms` | `{"_id":"6a1c84e6b34720ab924803fe","name":"Audit Admin User Updated","email":"audit-admin@example.com","avatar":"","role":{"_id":"6a032c6419f8ce1b5ea5e` |
| Update User by ID | `PUT` | `/api/users/6a1c84e6b34720ab924803fe` | 🟢 200 | `388ms` | `{"_id":"6a1c84e6b34720ab924803fe","name":"Audit Admin Modified","email":"audit-admin@example.com","role":{"_id":"6a032c6419f8ce1b5ea5e283","name":"sup` |
| Admin Create Category | `POST` | `/api/admin/categories` | 🟢 201 | `349ms` | `{"name":"Audit Master Category 1780254758520","slug":"audit-master-cat-1780254758520","description":"Audit category","image":null,"_id":"6a1c8826d6f5b` |
| Get Categories List | `GET` | `/api/categories` | 🟢 200 | `55ms` | `[{"_id":"virtual-on-sale","name":"On Sale","slug":"on-sale","description":"Tactical valuations on premium artifacts.","image":null},{"_id":"69c78e0919` |
| Get Category by Slug | `GET` | `/api/categories/audit-master-cat-1780254758520` | 🟢 200 | `49ms` | `{"_id":"6a1c8826d6f5b565942e7e0b","name":"Audit Master Category 1780254758520","slug":"audit-master-cat-1780254758520","description":"Audit category",` |
| Admin Get Categories List | `GET` | `/api/admin/categories` | 🟢 200 | `378ms` | `{"categories":[{"_id":"69c78e0919bd3d5aa54fa55f","name":"Accessories","slug":"accessories","description":"Bags, belts, hats, scarves, and other access` |
| Admin Get Category by ID | `GET` | `/api/admin/categories/6a1c8826d6f5b565942e7e0b` | 🟢 200 | `334ms` | `{"_id":"6a1c8826d6f5b565942e7e0b","name":"Audit Master Category 1780254758520","slug":"audit-master-cat-1780254758520","description":"Audit category",` |
| Admin Update Category | `PUT` | `/api/admin/categories/6a1c8826d6f5b565942e7e0b` | 🟢 200 | `381ms` | `{"_id":"6a1c8826d6f5b565942e7e0b","name":"Updated Master Category","slug":"audit-master-cat-1780254758520","description":"Audit category","image":null` |
| Create Subcategory | `POST` | `/api/subcategories` | 🟢 201 | `203ms` | `{"name":"Audit Master Subcategory 1780254760067","slug":"audit-master-sub-1780254760067","category":"6a1c8826d6f5b565942e7e0b","description":"Audit su` |
| Get Subcategories List | `GET` | `/api/subcategories` | 🟢 200 | `150ms` | `{"subcategories":[{"_id":"69c7925619bd3d5aa54fa577","name":"Active Tops","slug":"active-tops","category":{"_id":"69c78e0919bd3d5aa54fa561","name":"Spo` |
| Get Subcategory by ID | `GET` | `/api/subcategories/6a1c8828d6f5b565942e7e28` | 🟢 200 | `102ms` | `{"_id":"6a1c8828d6f5b565942e7e28","name":"Audit Master Subcategory 1780254760067","slug":"audit-master-sub-1780254760067","category":{"_id":"6a1c8826d` |
| Update Subcategory | `PUT` | `/api/subcategories/6a1c8828d6f5b565942e7e28` | 🟢 200 | `214ms` | `{"_id":"6a1c8828d6f5b565942e7e28","name":"Updated Master Subcategory","slug":"audit-master-sub-1780254760067","category":"6a1c8826d6f5b565942e7e0b","d` |
| Create Size | `POST` | `/api/sizes` | 🟢 201 | `206ms` | `{"name":"SZ-0736","description":"Audit size","category":"6a1c8826d6f5b565942e7e0b","_id":"6a1c8828d6f5b565942e7e36","createdAt":"2026-05-31T19:12:40.8` |
| Get Sizes List | `GET` | `/api/sizes` | 🟢 200 | `148ms` | `{"sizes":[{"_id":"69c79515dd74230ef1720c6e","name":"XS","description":"Extra Small","category":{"_id":"69c78e0919bd3d5aa54fa55c","name":"Men","slug":"` |
| Get Size by ID | `GET` | `/api/sizes/6a1c8828d6f5b565942e7e36` | 🟢 200 | `93ms` | `{"_id":"6a1c8828d6f5b565942e7e36","name":"SZ-0736","description":"Audit size","category":{"_id":"6a1c8826d6f5b565942e7e0b","name":"Updated Master Cate` |
| Update Size | `PUT` | `/api/sizes/6a1c8828d6f5b565942e7e36` | 🟢 200 | `189ms` | `{"_id":"6a1c8828d6f5b565942e7e36","name":"SZ-U-1184","description":"Audit size","category":"6a1c8826d6f5b565942e7e0b","createdAt":"2026-05-31T19:12:40` |
| Admin Create Product | `POST` | `/api/admin/products` | 🟢 201 | `331ms` | `{"name":"Audit Master Product 1780254761373","slug":"audit-master-prod-1780254761373","description":"Product for audit testing","price":150,"discount"` |
| Get Products List | `GET` | `/api/products` | 🟢 200 | `82ms` | `{"success":true,"total":252,"pages":11,"currentPage":1,"products":[{"_id":"69c797f6dd74230ef1720c91","name":"Men's Oxford Button-Down Shirt 3","slug":` |
| Get Product by Slug | `GET` | `/api/products/details/audit-master-prod-1780254761373` | 🟢 200 | `51ms` | `{"_id":"6a1c8829d6f5b565942e7e47","name":"Audit Master Product 1780254761373","slug":"audit-master-prod-1780254761373","description":"Product for audi` |
| Get Product by ID Public | `GET` | `/api/products/6a1c8829d6f5b565942e7e47` | 🟢 200 | `99ms` | `{"_id":"6a1c8829d6f5b565942e7e47","name":"Audit Master Product 1780254761373","slug":"audit-master-prod-1780254761373","description":"Product for audi` |
| Admin Get Product by ID | `GET` | `/api/admin/products/6a1c8829d6f5b565942e7e47` | 🟢 200 | `377ms` | `{"_id":"6a1c8829d6f5b565942e7e47","name":"Audit Master Product 1780254761373","slug":"audit-master-prod-1780254761373","description":"Product for audi` |
| Admin Update Product | `PUT` | `/api/admin/products/6a1c8829d6f5b565942e7e47` | 🟢 200 | `390ms` | `{"seo":{"metaTitle":"","metaDescription":"","keywords":""},"_id":"6a1c8829d6f5b565942e7e47","name":"Updated Master Product","slug":"updated-master-pro` |
| Cart Add Item | `POST` | `/api/cart/add` | 🟢 200 | `496ms` | `{"_id":"6a1c84eab34720ab92480466","user":"6a1c84e6b34720ab924803fe","items":[{"product":{"_id":"6a1c8829d6f5b565942e7e47","name":"Updated Master Produ` |
| Get Cart | `GET` | `/api/cart` | 🟢 200 | `199ms` | `{"_id":"6a1c84eab34720ab92480466","user":"6a1c84e6b34720ab924803fe","items":[{"product":{"_id":"6a1c8829d6f5b565942e7e47","name":"Updated Master Produ` |
| Cart Update Item | `PUT` | `/api/cart/update` | 🟢 200 | `341ms` | `{"_id":"6a1c84eab34720ab92480466","user":"6a1c84e6b34720ab924803fe","items":[{"product":{"_id":"6a1c8829d6f5b565942e7e47","name":"Updated Master Produ` |
| Cart Remove Item | `DELETE` | `/api/cart/remove/6a1c8829d6f5b565942e7e47/6a1c8828d6f5b565942e7e36` | 🟢 200 | `192ms` | `{"_id":"6a1c84eab34720ab92480466","user":"6a1c84e6b34720ab924803fe","items":[],"createdAt":"2026-05-31T18:58:50.617Z","updatedAt":"2026-05-31T19:12:43` |
| Wishlist Add Item | `POST` | `/api/wishlist/add` | 🟢 200 | `341ms` | `{"_id":"6a1c84ebb34720ab92480471","user":"6a1c84e6b34720ab924803fe","products":[{"_id":"6a1c8829d6f5b565942e7e47","name":"Updated Master Product","slu` |
| Get Wishlist | `GET` | `/api/wishlist` | 🟢 200 | `235ms` | `{"_id":"6a1c84ebb34720ab92480471","user":"6a1c84e6b34720ab924803fe","products":[{"_id":"6a1c8829d6f5b565942e7e47","name":"Updated Master Product","slu` |
| Wishlist Remove Item | `DELETE` | `/api/wishlist/remove/6a1c8829d6f5b565942e7e47` | 🟢 200 | `192ms` | `{"_id":"6a1c84ebb34720ab92480471","user":"6a1c84e6b34720ab924803fe","products":[],"createdAt":"2026-05-31T18:58:51.056Z","updatedAt":"2026-05-31T19:12` |
| Create Product Review | `POST` | `/api/reviews` | 🟢 201 | `591ms` | `{"product":"6a1c8829d6f5b565942e7e47","user":{"_id":"6a1c84e6b34720ab924803fe","name":"Audit Admin Modified","avatar":""},"rating":5,"comment":"Except` |
| Get Reviews by Product ID | `GET` | `/api/reviews/product/6a1c8829d6f5b565942e7e47` | 🟢 200 | `575ms` | `{"reviews":[{"_id":"6a1c882cd6f5b565942e7e94","product":"6a1c8829d6f5b565942e7e47","user":{"_id":"6a1c84e6b34720ab924803fe","name":"Audit Admin Modifi` |
| Update Review | `PUT` | `/api/reviews/6a1c882cd6f5b565942e7e94` | 🟢 200 | `581ms` | `{"_id":"6a1c882cd6f5b565942e7e94","product":"6a1c8829d6f5b565942e7e47","user":{"_id":"6a1c84e6b34720ab924803fe","name":"Audit Admin Modified","avatar"` |
| Delete Review | `DELETE` | `/api/reviews/6a1c882cd6f5b565942e7e94` | 🟢 200 | `331ms` | `{"message":"Review removed"}` |
| Create Coupon | `POST` | `/api/coupons` | 🟢 201 | `239ms` | `{"code":"MASTER6783","discountType":"percentage","discountValue":20,"minOrderAmount":150,"usageLimit":30,"usedCount":0,"isActive":true,"applicableProd` |
| Get Coupons List | `GET` | `/api/coupons` | 🟢 200 | `287ms` | `{"coupons":[{"_id":"6a1c882ed6f5b565942e7eb4","code":"MASTER6783","discountType":"percentage","discountValue":20,"minOrderAmount":150,"usageLimit":30,` |
| Get Coupon by ID | `GET` | `/api/coupons/6a1c882ed6f5b565942e7eb4` | 🟢 200 | `837ms` | `{"_id":"6a1c882ed6f5b565942e7eb4","code":"MASTER6783","discountType":"percentage","discountValue":20,"minOrderAmount":150,"usageLimit":30,"usedCount":` |
| Update Coupon | `PUT` | `/api/coupons/6a1c882ed6f5b565942e7eb4` | 🟢 200 | `508ms` | `{"_id":"6a1c882ed6f5b565942e7eb4","code":"MASTER6783","discountType":"percentage","discountValue":25,"minOrderAmount":150,"usageLimit":30,"usedCount":` |
| Get Settings | `GET` | `/api/settings` | 🟢 200 | `415ms` | `{"branding":{"activeTheme":"executive","defaultTheme":"dark","defaultThemeColor":"Rose","defaultThemeFont":"Inter","defaultLanguage":"en","siteName":"` |
| Update Settings | `PUT` | `/api/settings` | 🟢 200 | `307ms` | `{"message":"Site protocol updated successfully.","settings":{"branding":{"activeTheme":"executive","defaultTheme":"dark","defaultThemeColor":"Rose","d` |
| Cleanup Coupon | `DELETE` | `/api/coupons/6a1c882ed6f5b565942e7eb4` | 🟢 200 | `242ms` | `{"message":"Coupon deleted"}` |
| Cleanup Product | `DELETE` | `/api/admin/products/6a1c8829d6f5b565942e7e47` | 🟢 200 | `565ms` | `{"message":"Product purged."}` |
| Cleanup Size | `DELETE` | `/api/sizes/6a1c8828d6f5b565942e7e36` | 🟢 200 | `378ms` | `{"message":"Size removed"}` |
| Cleanup Subcategory | `DELETE` | `/api/subcategories/6a1c8828d6f5b565942e7e28` | 🟢 200 | `240ms` | `{"message":"Subcategory removed"}` |
| Cleanup Category | `DELETE` | `/api/admin/categories/6a1c8826d6f5b565942e7e0b` | 🟢 200 | `529ms` | `{"message":"Category purged."}` |
