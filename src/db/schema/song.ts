import {
      pgTable,
      text,
      serial,
      integer,
      pgEnum
} from "drizzle-orm/pg-core";

import { users } from "./user"
import { coverArts} from "./cover-art"
export const songEnum = pgEnum('genre', ['HipHop', 'RnB', 'Rock', 'Metal', 'Bollywood', 'Kpop', 'Pop']);

export const songs = pgTable("songs", {
      id: serial("id").primaryKey(),
      userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
      genre: songEnum('genre'),
      coverArtId: integer("coverArtId").references(() => coverArts.id),
      songUrl: text('songUrl').notNull(),
      songName: text("songName").notNull(),
});

export type songType = typeof songs.$inferSelect;