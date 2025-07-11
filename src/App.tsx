import { Outlet, Link } from "react-router-dom"

// Ce composant remplace le layout.tsx de Next.js
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Mon App React
          </Link>
          <div className="flex gap-4">
            {/* 2. Remplacer <Link> de Next.js par celui de react-router-dom */}
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Accueil
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              À propos
            </Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4">
        {/* Outlet rendra le composant de la route active (HomePage ou AboutPage) */}
        <Outlet />
      </main>
    </div>
  )
}
