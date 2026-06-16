-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "apartment" TEXT,
    "floor" TEXT,
    "entrance" TEXT,
    "intercom" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "image" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "composition" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "calories" INTEGER NOT NULL,
    "protein" REAL NOT NULL,
    "fat" REAL NOT NULL,
    "carbs" REAL NOT NULL,
    "cooking_time" INTEGER NOT NULL,
    "rating" REAL NOT NULL DEFAULT 5.0,
    "reviews_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "is_new" BOOLEAN NOT NULL DEFAULT false,
    "is_hit" BOOLEAN NOT NULL DEFAULT false,
    "is_vegan" BOOLEAN NOT NULL DEFAULT false,
    "is_spicy" BOOLEAN NOT NULL DEFAULT false,
    "is_gluten_free" BOOLEAN NOT NULL DEFAULT false,
    "allergens" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_modifiers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "product_modifiers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "session_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cart_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "modifiers" TEXT,
    "price" INTEGER NOT NULL,
    CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "promo_codes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "min_order_amount" INTEGER NOT NULL DEFAULT 0,
    "max_discount" INTEGER,
    "valid_from" DATETIME NOT NULL,
    "valid_until" DATETIME NOT NULL,
    "usage_limit" INTEGER,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "total_amount" INTEGER NOT NULL,
    "delivery_fee" INTEGER NOT NULL DEFAULT 0,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "final_amount" INTEGER NOT NULL,
    "delivery_address" TEXT NOT NULL,
    "delivery_time" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "payment_status" TEXT NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "promo_code_id" TEXT,
    "courier_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "orders_promo_code_id_fkey" FOREIGN KEY ("promo_code_id") REFERENCES "promo_codes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "modifiers" TEXT,
    CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "order_id" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "images" TEXT,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "carts_session_id_key" ON "carts"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "promo_codes_code_key" ON "promo_codes"("code");
