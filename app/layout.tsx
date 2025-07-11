import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Ma RoadMap",
  description: "Organisez les étapes, structurez vos idées !",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body>
        {/* Navbar sticky */}
        <nav className="sticky-navbar">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">MaRoadMap</span>
          </div>
        </nav>
        {/* Conteneur central */}
        <main className="main-card flex flex-col items-center justify-center w-full mt-12 mb-8 min-h-[600px]">
          {children}
        </main>
      </body>
    </html>
  )
}