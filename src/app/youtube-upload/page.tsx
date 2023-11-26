"use client"
import React, { useState } from "react";
import { uploadFromYouTube } from "../actions";
import Image from "next/image";

export default function YoutubeUpload() {
      const [thumbnailUrl, setThumbnailUrl] = useState('');
      const [songUrl, setSongUrl] = useState('');
      const [youtubeUrl, setYoutubeUrl] = useState('');
      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            if (!youtubeUrl) {
                  return;
            }
            const res = await uploadFromYouTube({ youtubeUrl: youtubeUrl });
            console.log(res);
            setThumbnailUrl(res.thumbnailUrl);
            setSongUrl(res.url!);
      }

      return (
            <>
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
