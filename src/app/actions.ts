"use server";

import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
const ytdl = require('ytdl-core');

import {
      S3Client,
      PutObjectCommand,
      DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { coverArts } from "@/db/schema/cover-art";
import { songs } from "@/db/schema/song";
import { db } from "@/db";

import { revalidatePath } from "next/cache";

const s3 = new S3Client({
      region: process.env.BUCKET_REGION!,
      credentials: {
            accessKeyId: process.env.AWS_KEY!,
            secretAccessKey: process.env.AWS_SEC_KEY!,
      },
});
enum Genre {
      HipHop = "HipHop",
      RnB = "RnB",
      Rock = "Rock",
      Metal = "Metal",
      Bollywood = "Bollywood",
      Kpop = "Kpop",
      Pop = "Pop",
}

export async function getSignedURL({
      imageFileType,
      songFileType,
      imageSize,
      songSize,
      songName,
      checksum,
      genre,
}: {
      imageFileType: string;
      songFileType: string;
      imageSize: number;
      songSize: number;
      songName: string;
      checksum: string;
      genre: "HipHop" | "RnB" | "Rock" | "Metal" | "Bollywood" | "Kpop" | "Pop";
}) {
      const acceptedImageFileTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
      ];

      const acceptedSongFileTypes = ["audio/mpeg", "audio/*"];
      const session = await auth();

      if (!acceptedImageFileTypes.includes(imageFileType)) {
            return { failure: "Invalid File Type" };
      }

      const maxFileSize = 1024 * 1024 * 10; // 10MB

      if (imageSize > maxFileSize || songSize > maxFileSize) {
            return { failure: "File Too Large" };
      }


      if (!session) {
            return { failure: "Not Authenticated" };
      }

      const imagePutObjectCommand = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: crypto.randomBytes(32).toString("hex"),
            ContentType: imageFileType,
            ContentLength: imageSize,
            ChecksumSHA256: checksum,
            Metadata: {
                  userId: session.user.id,
            },
      });

      const imageSignedUrl = await getSignedUrl(s3, imagePutObjectCommand, {
            expiresIn: 60,
      });

      const coverArtId = await db
            .insert(coverArts)
            .values({
                  userId: session.user.id,
                  url: imageSignedUrl.split("?")[0],
                  size: imageSize,
                  checksum: checksum,
                  createdAt: new Date(),
            })
            .returning({ id: coverArts.id })
            .then((res) => res[0].id);

      const songPutObjectCommand = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: crypto.randomBytes(32).toString("hex"),
            ContentType: songFileType,
            ContentLength: songSize,
            ChecksumSHA256: checksum,
            Metadata: {
                  userId: session.user.id,
            },
      });

      const songSignedUrl = await getSignedUrl(s3, songPutObjectCommand, {
            expiresIn: 60,
      });

      let genstring: Genre = Genre[genre as keyof typeof Genre];
      const songId = await db
            .insert(songs)
            .values({
                  userId: session.user.id,
                  genre: genstring,
                  coverArtId: coverArtId,
                  songUrl: songSignedUrl.split("?")[0],
                  songName: songName,
            })
            .returning({ id: songs.id })
            .then((res) => res[0].id);

      revalidatePath("/");
      return {
            success: {
                  imageUrl: imageSignedUrl,
                  songUrl: songSignedUrl,
                  coverArtId: coverArtId,
                  songId: songId,
            },
      };
}

export async function deleteSong({
      coverArtId,
      songId,
}: {
      coverArtId: number,
      songId: number,
}) {
      const session = await auth();

      if (!session) {
            return { failure: "user not logged in" }
      }

      let songObject = await db.select()
            .from(songs)
            .where(and(eq(songs.id, songId), eq(songs.userId, session.user.id)))
            .then((res) => res[0])


      if (!songObject) {
            throw new Error("No Song Found")
      }

      if (songObject.userId !== session.user.id) {
            throw new Error("Song does not belong to the user")
      }

      const deleteSongObjectCommand = new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: songObject.songUrl.split("/").pop()!,
      });

      let imgObject = await db.select()
            .from(coverArts)
            .where(eq(coverArts.id, coverArtId))
            .then((res) => res[0])

      if (!imgObject) {
            throw new Error("No Cover Image Found")
      }

      const deleteImageObjectCommand = new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: imgObject.url.split("/").pop()!,
      });

      await db.delete(songs).where(eq(songs.id, songId))
      await s3.send(deleteSongObjectCommand)
      await db.delete(coverArts).where(eq(coverArts.id, coverArtId))
      await s3.send(deleteImageObjectCommand);
      revalidatePath("/")
      return { success: "Successfully deleted the song" }
}


export async function uploadFromYouTube({
      youtubeUrl
}: {
      youtubeUrl: string
}) {
      const session = await auth();
      if (!session) {
            return { failure: "Not Authenticated" };
      }
      const videoInfo = await ytdl.getInfo(youtubeUrl);

      const thumbnailUrl = videoInfo.videoDetails.thumbnails[0].url;

      const audioStream = ytdl(youtubeUrl, { filter: 'audioonly' });

      const chunks = [];

      for await (const chunk of audioStream) {
            chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);

      const key = crypto.randomBytes(32).toString("hex");

      const data = await s3.send(new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: "audio/mpeg",
            ContentLength: buffer.length,
            Metadata: {
                  userId: session.user.id,
            },
      }));

      const url = `https://${process.env.BUCKET_NAME!}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;

      const coverArtId = await db
            .insert(coverArts)
            .values({
                  userId: session.user.id,
                  url: thumbnailUrl,
                  size: 0,
                  checksum: "",
                  createdAt: new Date(),
            }).returning({ id: coverArts.id }).then((res) => res[0].id);


      const songId = await db
            .insert(songs)
            .values({
                  userId: session.user.id,
                  genre: Genre.Rock,
                  coverArtId: coverArtId,
                  songUrl: url,
                  songName: videoInfo.videoDetails.title,
            })
            .returning({ id: songs.id })
            .then((res) => res[0].id);

      return { url, songId, coverArtId, thumbnailUrl };
}
