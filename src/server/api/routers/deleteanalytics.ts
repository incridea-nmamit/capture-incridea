import { db } from "~/server/db";

async function resetTable() {
  await db.webAnalytics.deleteMany();
  console.log("Table reset successfully!");
}

resetTable();
