import type { Metadata } from 'next'
import './globals.css'



export const metadata: Metadata = {
  icons: {
    icon: '/book.svg',
  },
  title: 'Bookz',
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

        <main>
          {children}
        </main>


      </body>

    </html>
  )
}
