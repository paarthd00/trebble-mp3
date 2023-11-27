import Image from 'next/image'
import { auth, signOut } from "@/auth"
import DropFile from '../components/drop-file'
import { redirect } from 'next/navigation'

export default async function Home() {
      const session = await auth()
      if (!session?.user) {
            redirect('/api/auth/signin')
      }
      return (
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                  {
                        !session?.user
                        && <>user is logged out</>
                  }
                  <DropFile />
            </main>
      )
}
