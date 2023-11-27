"use client"
import React, { useState } from "react";
import { uploadFromYouTube } from "../actions";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default function YoutubeUpload() {

      const [thumbnailUrl, setThumbnailUrl] = useState('');
      const [songUrl, setSongUrl] = useState('');
      const [youtubeUrl, setYoutubeUrl] = useState('');

      const [loading, setLoading] = useState(false);
      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            const session = await auth()
            if (!session?.user) {
                  redirect('/api/auth/signin')
            }
            if (!youtubeUrl) {
                  return;
            }
            setLoading(true);
            try {
                  const res = await uploadFromYouTube({ youtubeUrl: youtubeUrl });
                  if (res.failure) {
                        console.error(res.failure);
                        setLoading(false);
                        return;
                  }
                  setLoading(false);
                  setThumbnailUrl(res.thumbnailUrl);
                  setSongUrl(res.url!);

            } catch (err) {
                  console.error(err);
            }
      }

      return (
            <>
                  {
                        !loading &&

                        <form onSubmit={handleSubmit}>
                              <input
                                    name="youtubeUrl"
                                    placeholder="Enter YouTube URL"
                                    className="w-full h-10 px-3 mb-2 text-base text-black transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-100 focus:border-gray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"
                                    onChange={(event) => { setYoutubeUrl(event.target.value) }}

                                    type="text" />
                              <input
                                    className="w-full h-10 px-3 mb-2 text-base text-black transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-100 focus:border-gray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"
                                    type="submit" value="upload from youtube" />
                        </form>
                  }
                  {
                        loading &&
                        <div className="animate-pulse bg-muted h-[4rem] w-[4rem] rounded-lg">
                              <p>
                                    uploading...
                              </p>

                        </div>
                  }
                  {
                        thumbnailUrl &&
                        <Image src={thumbnailUrl} alt="thumbnail"
                              width={500}
                              height={500}
                        />
                  }
                  {
                        songUrl &&
                        <audio controls src={songUrl}>
                        </audio>
                  }
            </>
      )
}
