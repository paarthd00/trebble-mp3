"use client"
import React, { useState } from "react"
import Image from "next/image";
import { getSignedURL } from "../actions";
import axios from "axios"
export default function DropFile() {
      const [audioFile, setAudioFile] = useState<File | undefined>();
      const [coverImage, setCoverImage] = useState<File | undefined>();
      const [loading, setLoading] = useState<boolean>(false);
      const [message, setMessage] = useState<string>("");
      const [genre, setGenre] = useState<string | undefined>("HipHop");
      enum Genre {
            HipHop = 'HipHop',
            RnB = 'RnB',
            Rock = 'Rock',
            Metal = 'Metal',
            Bollywood = 'Bollywood',
            Kpop = 'Kpop',
            Pop = 'Pop'
      }

      const computeSHA256 = async (file: File) => {
            const buffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray
                  .map((b) => b.toString(16).padStart(2, "0"))
                  .join("");
            return hashHex;
      };
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!audioFile || !coverImage) {
                  return;
            }

            setLoading(true);
            setMessage("uploading");
            try {
                  const hash = await computeSHA256(audioFile);
                  let genstring: Genre = Genre[genre as keyof typeof Genre];
                  const signedUrlResult = await getSignedURL(
                        {
                              imageFileType: coverImage.type,
                              songFileType: audioFile.type,
                              imageSize: coverImage.size,
                              songSize: audioFile.size,
                              songName: audioFile.name,
                              checksum: hash,
                              genre: genstring
                        }
                  )

                  if (signedUrlResult.success) {
                        const songUrl: string = signedUrlResult?.success?.songUrl;
                        const imageUrl: string = signedUrlResult.success.imageUrl;


                        await axios.put(songUrl, audioFile)
                              .then(async () => {
                                    await axios.put(imageUrl, coverImage)
                              }).then(() => {
                                    setLoading(false)
                                    setMessage("")
                                    setAudioFile(undefined)
                                    setCoverImage(undefined)
                              })
                              .catch((err) => {
                                    setMessage("There was an error uploading the image")
                                    console.error(err);
                              })
                  }

            } catch (err) {
                  setMessage("There was an error")
                  setLoading(false);
                  console.error("There was an error")
            }

      }

      return (<>
            {
                  loading &&
                  <p>{message}</p>
            }
            {
                  coverImage && !loading &&
                  <Image src={URL.createObjectURL(coverImage)} width={150} height={150}
                        alt="coverImage" />
            }

            {
                  audioFile && !loading &&
                  <audio
                        controls
                        src={URL.createObjectURL(audioFile)}>
                        Your browser does not support the
                        <code>audio</code> element.
                  </audio>
            }{
                  !loading &&
                  <form className="flex flex-col" onSubmit={handleSubmit}>
                        <div className="flex items-center gap-4 mb-4">
                              <svg
                                    className="w-6 h-6 text-gray-500 dark:text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                              >
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                              </svg>

                              <div className="flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">JPEG, PNG, gif,webp (MAX. 10mb)</p>
                                          </div>
                                          <input id="dropzone-file" onChange={(e) => {
                                                if (e.target.files) {
                                                      setCoverImage(e.target.files?.[0])
                                                }
                                          }} type="file" className="hidden" accept='image/jpeg, image/png,image/gif,image/webp' />
                                    </label>
                              </div>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                              <svg
                                    className="w-6 h-6 text-gray-500 dark:text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                              >
                                    <path d="M9 18V5l12-2v13" />
                                    <circle cx="6" cy="18" r="3" />
                                    <circle cx="18" cy="16" r="3" />
                              </svg>

                              <div className="flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-audio" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Any audio file like mp3 (MAX. 10mb)</p>
                                          </div>
                                          <input id="dropzone-audio" onChange={(e) => {
                                                if (e.target.files) {
                                                      setAudioFile(e.target.files?.[0])
                                                }
                                          }} type="file" className="hidden" accept="audio/*" />
                                    </label>
                              </div>
                        </div>

                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
                              upload
                        </button>
                  </form>
            }
      </>
      )
}