import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'



export const metadata: Metadata = {
  icons: {
    icon: '/book.svg',
  },
  title: 'Noiseless ORG',
  description: 'Bookz is a book review site.',

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body >

        <Navbar />

        <main>
          {children}
        </main>

        <Footer />

      </body>

    </html>
  )
}
