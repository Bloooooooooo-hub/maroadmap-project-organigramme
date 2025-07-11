// Configuration Hasura
export const HASURA_ENDPOINT = "https://hasura-preprod.maroadmap.com/v1/graphql"
// ⚠️ DANGER: Cette clé ne devrait pas être ici. Utilisez une variable d'environnement côté serveur.
export const HASURA_SECRET = "newpassword"

export const USER_PROJECTS = [
  { id: "1", name: "🧪 Mon Projet Vitamine" },
  { id: "2", name: "🚗 Mon Projet Transport" },
  { id: "3", name: "🛒 Mon Projet E-commerce" },
  { id: "4", name: "👤 Mon Projet Personnel" },
]

export const STATUS_OPTIONS = [
  { value: "initial", label: "📋 Prévu", class: "status-pending", emoji: "📋", nodeStatus: "initial" },
  { value: "loading", label: "🔄 En cours", class: "status-progress", emoji: "🔄", nodeStatus: "loading" },
  { value: "success", label: "✅ Fait", class: "status-done", emoji: "✅", nodeStatus: "success" },
]

export const CONNECTION_TYPES = [
  { value: "default", label: "🌊 Courbe douce", color: "#6B7280" },
  { value: "animated", label: "⚡ Courbe animée", color: "#3B82F6" },
  { value: "dashed", label: "📐 Courbe pointillée", color: "#8B5CF6" },
  { value: "thick", label: "🔗 Courbe épaisse", color: "#10B981" },
]
