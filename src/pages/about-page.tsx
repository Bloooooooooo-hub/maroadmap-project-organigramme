// Anciennement app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-4">À propos de nous</h1>
      <p>
        Cette application est un exemple de conversion d'un projet Next.js en une application React standard
        (Single-Page Application). [^1]
      </p>
      <p className="mt-2">
        Nous utilisons `react-router-dom` pour la navigation et `useEffect` pour récupérer les données côté client.
      </p>
    </div>
  )
}
