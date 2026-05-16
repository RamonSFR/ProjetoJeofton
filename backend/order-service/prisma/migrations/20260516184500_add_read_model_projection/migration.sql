-- CreateTable
CREATE TABLE "orders_read" (
    "order_id" INTEGER NOT NULL,
    "restaurant_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "delivery_address_snapshot" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_read_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "order_items_read" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "product_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_items_read_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processed_events" (
    "event_id" TEXT NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed_events_pkey" PRIMARY KEY ("event_id")
);

-- CreateIndex
CREATE INDEX "order_items_read_order_id_idx" ON "order_items_read"("order_id");

-- AddForeignKey
ALTER TABLE "order_items_read" ADD CONSTRAINT "order_items_read_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders_read"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;