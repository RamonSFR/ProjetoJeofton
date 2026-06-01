import { prisma } from "../database/prisma";

const main = async () => {
  console.log("Deleting users...");
  await prisma.user.deleteMany();
  console.log("Done.");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error clearing users:", error);
    process.exit(1);
  });
