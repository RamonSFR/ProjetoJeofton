import { prisma } from "../database/prisma";

const main = async () => {
  console.log("Deleting order items (order_items)...");
  await prisma.orderItem.deleteMany();

  console.log("Deleting orders (orders)...");
  await prisma.order.deleteMany();

  console.log("Deleting read model items (order_items_read)...");
  // OrderItemRead model may be named orderItemRead in Prisma client
  try {
    // @ts-ignore
    await prisma.orderItemRead.deleteMany();
  } catch (e) {
    console.warn(
      "orderItemRead model not present or delete failed:",
      (e as Error).message,
    );
  }

  console.log("Deleting read model orders (orders_read)...");
  try {
    // @ts-ignore
    await prisma.orderRead.deleteMany();
  } catch (e) {
    console.warn(
      "orderRead model not present or delete failed:",
      (e as Error).message,
    );
  }

  console.log("Deleting processed events (processed_events)...");
  try {
    // @ts-ignore
    await prisma.processedEvent.deleteMany();
  } catch (e) {
    console.warn(
      "processedEvent model not present or delete failed:",
      (e as Error).message,
    );
  }

  console.log("Done.");
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error clearing orders:", err);
    process.exit(1);
  });
