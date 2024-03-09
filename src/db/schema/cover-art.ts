import { pgTable, timestamp, text, integer, serial } from "drizzle-orm/pg-core";

import { users } from "./user";

export const coverArts = pgTable("coverArts", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  size: integer("size").notNull(),
  checksum: text("checksum").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
});

export type coverArtType = typeof coverArts.$inferSelect;
