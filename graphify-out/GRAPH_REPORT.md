# Graph Report - .  (2026-05-08)

## Corpus Check
- Large corpus: 313 files · ~224,554 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 996 nodes · 1423 edges · 137 communities (102 shown, 35 thin omitted)
- Extraction: 79% EXTRACTED · 21% INFERRED · 0% AMBIGUOUS · INFERRED: 296 edges (avg confidence: 0.8)
- Token cost: 1,000 input · 200 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin & Flash Sale UI|Admin & Flash Sale UI]]
- [[_COMMUNITY_Orders, Coupons & Payment|Orders, Coupons & Payment]]
- [[_COMMUNITY_Cart, Wishlist & Product Models|Cart, Wishlist & Product Models]]
- [[_COMMUNITY_Home & Layout Infrastructure|Home & Layout Infrastructure]]
- [[_COMMUNITY_Shadcn UI Components|Shadcn UI Components]]
- [[_COMMUNITY_Validators & Subcategory Logic|Validators & Subcategory Logic]]
- [[_COMMUNITY_Skeleton Components & Grid|Skeleton Components & Grid]]
- [[_COMMUNITY_Category & Size Forms|Category & Size Forms]]
- [[_COMMUNITY_User Profile & Auth Flows|User Profile & Auth Flows]]
- [[_COMMUNITY_Real-time Chat & Sockets|Real-time Chat & Sockets]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 115|Community 115]]
- [[_COMMUNITY_Community 117|Community 117]]
- [[_COMMUNITY_Community 118|Community 118]]
- [[_COMMUNITY_Community 119|Community 119]]
- [[_COMMUNITY_Community 120|Community 120]]
- [[_COMMUNITY_Community 121|Community 121]]
- [[_COMMUNITY_Community 122|Community 122]]
- [[_COMMUNITY_Community 123|Community 123]]
- [[_COMMUNITY_Community 124|Community 124]]
- [[_COMMUNITY_Community 125|Community 125]]
- [[_COMMUNITY_Community 126|Community 126]]
- [[_COMMUNITY_Community 133|Community 133]]
- [[_COMMUNITY_Community 135|Community 135]]
- [[_COMMUNITY_Community 136|Community 136]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 136 edges
2. `useAuthStore` - 29 edges
3. `useAppStore` - 19 edges
4. `getImageUrl()` - 19 edges
5. `asyncHandler()` - 18 edges
6. `admin()` - 18 edges
7. `register()` - 18 edges
8. `protect()` - 16 edges
9. `useCategories()` - 12 edges
10. `uploadImage()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `CategoryForm()` --calls--> `register()`  [INFERRED]
  web/src/app/admin/categories/[id]/page.js → backend/src/modules/auth/auth.controller.js
- `FlashSaleForm()` --calls--> `register()`  [INFERRED]
  web/src/app/admin/flash-sales/[id]/page.js → backend/src/modules/auth/auth.controller.js
- `ProductForm()` --calls--> `register()`  [INFERRED]
  web/src/app/admin/products/[id]/page.js → backend/src/modules/auth/auth.controller.js
- `AdminProfile()` --calls--> `register()`  [INFERRED]
  web/src/app/admin/profile/page.js → backend/src/modules/auth/auth.controller.js
- `SizeForm()` --calls--> `register()`  [INFERRED]
  web/src/app/admin/sizes/[id]/page.js → backend/src/modules/auth/auth.controller.js

## Communities (137 total, 35 thin omitted)

### Community 0 - "Admin & Flash Sale UI"
Cohesion: 0.05
Nodes (22): AdminProductsContent(), DICTIONARY, FilterBar(), DICTIONARY, FlashSaleClient(), metadata, AdminFlashSales(), HomeClient() (+14 more)

### Community 1 - "Orders, Coupons & Payment"
Cohesion: 0.09
Nodes (23): couponSchema, bkashSuccess, getMyOrders, getOrderById, getOrders, initPayment, ipn, paymentCancel (+15 more)

### Community 2 - "Cart, Wishlist & Product Models"
Cohesion: 0.1
Nodes (21): addToCart, bulkAddCart(), clearCart, getCart, removeFromCart, updateCartItem, cartItemSchema, cartSchema (+13 more)

### Community 3 - "Home & Layout Infrastructure"
Cohesion: 0.07
Nodes (15): HeroSection(), useApiKeys(), useSettings(), StandardLayout(), FOOTER_SECTIONS, LayoutResolver(), registry, NAV_LINKS (+7 more)

### Community 4 - "Shadcn UI Components"
Cohesion: 0.12
Nodes (22): cn(), Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Card(), CardAction(), CardContent() (+14 more)

### Community 5 - "Validators & Subcategory Logic"
Cohesion: 0.13
Nodes (18): validate(), validateObjectId(), createSize, deleteSize, getSizeById, getSizes, updateSize, router (+10 more)

### Community 6 - "Skeleton Components & Grid"
Cohesion: 0.08
Nodes (3): GridSkeleton(), HeroSkeleton(), sectionVariants

### Community 7 - "Category & Size Forms"
Cohesion: 0.12
Nodes (10): CategoryMasterControl(), useCategories(), useSizes(), useSubcategories(), CategoryForm(), ProductForm(), SizeForm(), SubcategoryForm() (+2 more)

### Community 8 - "User Profile & Auth Flows"
Cohesion: 0.12
Nodes (11): UnifiedSettlementContent(), CouponArchive(), ForgotPasswordPage(), useChat(), useCoupons(), useOrders(), OrderDetailsDialog(), ProfileContent() (+3 more)

### Community 9 - "Real-time Chat & Sockets"
Cohesion: 0.16
Nodes (12): getAllConversations, getChatHistory, getConversationMessages, getMyConversation, Conversation, conversationSchema, messageSchema, router (+4 more)

### Community 10 - "Community 10"
Cohesion: 0.17
Nodes (8): ApiKey, apiKeySchema, getAreas, getCities, getStores, getZones, router, PathaoService

### Community 11 - "Community 11"
Cohesion: 0.18
Nodes (10): getDashboardData, router, router, admin(), optionalAuth(), protect(), sendFacebookEvent(), finalUserData (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (10): SupportChat(), MONTHS, RevenueChart(), useAuth(), useReviews(), ClientInitialization(), ClientWrapper(), initialState (+2 more)

### Community 13 - "Community 13"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (9): DataTable(), ImageCell(), OptimizedImage(), ProductCard(), OrderDetailsPage(), Navbar(), ProductImageGallery(), ProfileHeader() (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.21
Nodes (12): createFlashSale, deleteFlashSale, getActiveFlashSales, getAllFlashSales, getFlashSaleById, getFlashSaleBySlug, getFlashSaleProducts, populatedProductsConfig (+4 more)

### Community 16 - "Community 16"
Cohesion: 0.21
Nodes (10): createProduct, deleteProduct, getProductById, getProductBySlug, getProducts, updateProduct, router, createProductSchema (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.14
Nodes (6): SizeSelectionModal(), WishlistButtonClient(), initialState, useProductStore, QuickSelectModal(), SuccessContent()

### Community 18 - "Community 18"
Cohesion: 0.23
Nodes (9): createCampaign, deleteCampaign, getActiveCampaign, getAllCampaigns, toggleActive, updateCampaign, bannerCampaignSchema, slideSchema (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.15
Nodes (7): FormInput(), FormSelect(), ImageUpload(), register(), CouponForm(), ProfileIdentity(), ProfileSecurity()

### Community 20 - "Community 20"
Cohesion: 0.27
Nodes (10): forgotPassword(), generateToken(), getMe(), login(), resetPassword(), verifyEmail(), router, sendPasswordResetEmail() (+2 more)

### Community 21 - "Community 21"
Cohesion: 0.26
Nodes (7): getApiKeys, updateApiKeys, router, asyncHandler(), getSettings, updateSettings, router

### Community 22 - "Community 22"
Cohesion: 0.2
Nodes (6): handleFileError(), errorHandler(), allowedOrigins, app, __dirname, __filename

### Community 23 - "Community 23"
Cohesion: 0.23
Nodes (7): createReview, deleteReview, getProductReviews, updateReview, reviewImageSchema, reviewSchema, router

### Community 24 - "Community 24"
Cohesion: 0.17
Nodes (4): BlogDetailsClient(), FlashSaleDetailsClient(), DICTIONARY, generateMetadata()

### Community 25 - "Community 25"
Cohesion: 0.17
Nodes (7): DICTIONARY, ProductActionsClient(), getFacebookCookies(), useTrackingStore, getCookie(), DICTIONARY, WishlistPage()

### Community 26 - "Community 26"
Cohesion: 0.17
Nodes (7): generateMetadata(), inter, viewport, ThemeProvider(), IDENTITY_THEMES, useTheme(), Toaster()

### Community 27 - "Community 27"
Cohesion: 0.31
Nodes (8): createCategory, deleteCategory, getCategories, getCategoryById, updateCategory, router, createCategorySchema, updateCategorySchema

### Community 28 - "Community 28"
Cohesion: 0.18
Nodes (6): SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 29 - "Community 29"
Cohesion: 0.18
Nodes (6): DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogTitle()

### Community 30 - "Community 30"
Cohesion: 0.18
Nodes (8): SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger()

### Community 31 - "Community 31"
Cohesion: 0.18
Nodes (5): AdminProductFilter(), OrderEditModal(), useAdminProducts(), ProductManagement(), AdminProductsContent()

### Community 32 - "Community 32"
Cohesion: 0.24
Nodes (9): ALLOWED_EXTS, ALLOWED_FILES, extractFiles(), fs, getFileTree(), IGNORE_DIRS, IGNORE_FILES, path (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.36
Nodes (8): changePassword, deleteUser, getAllUsers, getMe, getUserById, updateProfile, updateUser, router

### Community 34 - "Community 34"
Cohesion: 0.31
Nodes (7): createPost, deletePost, getPostBySlug, getPosts, updatePost, blogSchema, router

### Community 35 - "Community 35"
Cohesion: 0.29
Nodes (8): LoginPage(), getSwalConfig(), Modal, swalConfirm(), swalError(), swalSuccess(), swalToast(), Toast

### Community 36 - "Community 36"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 37 - "Community 37"
Cohesion: 0.27
Nodes (6): ChatContext, ChatProvider(), useChat(), ChatContent(), ActiveChatPage(), ChatMessage()

### Community 38 - "Community 38"
Cohesion: 0.22
Nodes (6): ALLOWED_EXTENSIONS, ALLOWED_MIMETYPES, __dirname, __filename, storage, upload

### Community 39 - "Community 39"
Cohesion: 0.31
Nodes (8): deleteImage(), __dirname, __filename, saveToLocal(), storageType, uploadImage(), uploadMultipleImages(), uploadToCloudinary()

### Community 40 - "Community 40"
Cohesion: 0.39
Nodes (7): createCoupon, deleteCoupon, getCouponById, getCoupons, updateCoupon, validateCoupon, router

### Community 42 - "Community 42"
Cohesion: 0.22
Nodes (4): AdminBlogDashboard(), CreateBlog(), useBlogs(), EditBlog()

### Community 43 - "Community 43"
Cohesion: 0.22
Nodes (8): Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader(), TableRow()

### Community 44 - "Community 44"
Cohesion: 0.28
Nodes (8): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea()

### Community 45 - "Community 45"
Cohesion: 0.22
Nodes (5): useUsers(), UserForm(), api, guestId, Users()

### Community 46 - "Community 46"
Cohesion: 0.25
Nodes (3): ProtectedRoute(), Loader(), DICTIONARY

### Community 47 - "Community 47"
Cohesion: 0.25
Nodes (6): Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink(), PaginationNext(), PaginationPrevious()

### Community 48 - "Community 48"
Cohesion: 0.25
Nodes (4): PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle()

### Community 49 - "Community 49"
Cohesion: 0.25
Nodes (6): CategoryPie, Dashboard(), InventoryAlerts, RecentOrders, RevenueChart, useAdminDashboard()

### Community 50 - "Community 50"
Cohesion: 0.29
Nodes (5): cities, finalData, products, statuses, users

### Community 52 - "Community 52"
Cohesion: 0.38
Nodes (3): getCategories(), getInitialProducts(), ProductsPage()

### Community 53 - "Community 53"
Cohesion: 0.29
Nodes (6): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage()

### Community 54 - "Community 54"
Cohesion: 0.29
Nodes (3): DICTIONARY, PaymentMethodItem(), SummaryRow()

### Community 55 - "Community 55"
Cohesion: 0.33
Nodes (5): bkashSchema, metaSchema, pathaoSchema, sslCommerzSchema, updateApiKeysSchema

### Community 56 - "Community 56"
Cohesion: 0.4
Nodes (5): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants

### Community 57 - "Community 57"
Cohesion: 0.4
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 58 - "Community 58"
Cohesion: 0.33
Nodes (3): AdminBannerCampaigns(), useAdminBannerCampaigns(), BannerCampaignForm()

### Community 59 - "Community 59"
Cohesion: 0.33
Nodes (3): useCart(), useWishlist(), getGuestId()

### Community 60 - "Community 60"
Cohesion: 0.4
Nodes (3): __dirname, __filename, userSchema

### Community 61 - "Community 61"
Cohesion: 0.5
Nodes (4): firstNames, generateFakeUsers(), lastNames, seedUsers()

### Community 63 - "Community 63"
Cohesion: 0.4
Nodes (3): CountdownTimer(), DICTIONARY, FlashSaleBanner()

### Community 64 - "Community 64"
Cohesion: 0.5
Nodes (3): addressSchema, createUserSchema, updateUserSchema

## Knowledge Gaps
- **140 isolated node(s):** `fs`, `path`, `IGNORE_DIRS`, `ALLOWED_EXTS`, `ALLOWED_FILES` (+135 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `register()` connect `Community 19` to `Admin & Flash Sale UI`, `Community 67`, `Category & Size Forms`, `Community 45`, `Community 20`, `Community 31`?**
  _High betweenness centrality (0.331) - this node is a cross-community bridge._
- **Why does `cn()` connect `Shadcn UI Components` to `Admin & Flash Sale UI`, `Home & Layout Infrastructure`, `Skeleton Components & Grid`, `Community 13`, `Community 14`, `Community 17`, `Community 24`, `Community 28`, `Community 29`, `Community 30`, `Community 31`, `Community 36`, `Community 37`, `Community 43`, `Community 44`, `Community 46`, `Community 47`, `Community 48`, `Community 53`, `Community 54`, `Community 56`, `Community 57`, `Community 62`, `Community 63`, `Community 67`, `Community 73`, `Community 74`, `Community 75`, `Community 76`, `Community 77`, `Community 78`, `Community 117`, `Community 118`, `Community 119`, `Community 120`, `Community 121`, `Community 122`, `Community 123`, `Community 124`, `Community 125`, `Community 126`?**
  _High betweenness centrality (0.285) - this node is a cross-community bridge._
- **Why does `useAuthStore` connect `User Profile & Auth Flows` to `Community 67`, `Community 35`, `Community 37`, `Community 74`, `Community 12`, `Community 46`, `Community 14`, `Community 17`, `Community 25`, `Community 59`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Are the 135 inferred relationships involving `cn()` (e.g. with `AdminLayout()` and `ChatContent()`) actually correct?**
  _`cn()` has 135 INFERRED edges - model-reasoned connections that need verification._
- **Are the 28 inferred relationships involving `useAuthStore` (e.g. with `ForgotPasswordPage()` and `LoginPage()`) actually correct?**
  _`useAuthStore` has 28 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `useAppStore` (e.g. with `AdminLayout()` and `UnifiedSettlementContent()`) actually correct?**
  _`useAppStore` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `getImageUrl()` (e.g. with `generateMetadata()` and `AdminLayout()`) actually correct?**
  _`getImageUrl()` has 18 INFERRED edges - model-reasoned connections that need verification._