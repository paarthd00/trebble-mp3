import Image from "next/image";
import { auth, signOut } from "@/auth";
import DropFile from "../components/drop-file";

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {!session?.user && <>user is logged out</>}
      <DropFile />
    </main>
  );
}
