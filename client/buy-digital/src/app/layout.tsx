import 'bootstrap/dist/css/bootstrap.min.css'
import 'src/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Provider } from 'context'

import Header from 'src/components/header/Header'
import Footer from 'src/components/Footer'
import AppToast from '@/components/AppToast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Buy Digital!',
  description: 'Selling Digital products/license',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Provider>
        <body className={inter.className}>
            <AppToast />
            <Header />
              <main>
                {children}
              </main>
            <Footer />
        </body>
      </Provider>
    </html>
  )
}
