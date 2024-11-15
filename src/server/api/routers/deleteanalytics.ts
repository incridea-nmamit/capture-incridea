import { db } from "~/server/db";

async function resetTable() {
  await db.webAnalytics.deleteMany(); // Deletes all rows
  console.log("Table reset successfully!");
}

resetTable();
