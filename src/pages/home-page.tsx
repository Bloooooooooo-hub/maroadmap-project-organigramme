"use client"

import { useState, useEffect } from "react"

// Simule une donnée qui serait récupérée depuis une API
interface Post {
  id: number
  title: string
}

// Anciennement app/page.tsx
export default function HomePage() {
  // 3. Remplacer la récupération de données côté serveur par une récupération côté client
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Dans une vraie app, l'URL serait vers votre API (ex: 'https://api.example.com/posts')
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données")
        }
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, []) // Le tableau vide signifie que l'effet ne s'exécute qu'une fois, au montage du composant

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-4">Articles Récents</h1>
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.id} className="p-3 bg-gray-100 rounded">
              {post.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
