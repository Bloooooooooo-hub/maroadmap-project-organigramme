import { HASURA_ENDPOINT, HASURA_SECRET, USER_PROJECTS } from "./constants"
import type { RoadmapNode, RoadmapEdge } from "./types"

// ⚠️ DANGER: Ces fonctions s'exécutent côté client et exposent votre HASURA_SECRET.
// Elles devraient être converties en Server Actions pour être sécurisées.

export const saveToDatabase = async (
  userEmail: string,
  nodes: RoadmapNode[],
  edges: RoadmapEdge[],
  selectedProject: string,
) => {
  try {
    console.log("🔄 Début de la sauvegarde pour:", userEmail)
    const getUserQuery = `
      query GetUser($email: String!) {
        users(where: {email: {_eq: $email}}) {
          id
          nom
          prenom
          email
        }
      }
    `
    const userResponse = await fetch(HASURA_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": HASURA_SECRET,
      },
      body: JSON.stringify({
        query: getUserQuery,
        variables: { email: userEmail },
      }),
    })
    const userData = await userResponse.json()
    console.log("👤 Réponse utilisateur:", userData)

    if (userData.errors) {
      throw new Error(`Erreur GraphQL: ${userData.errors[0].message}`)
    }
    if (!userData.data?.users?.length) {
      alert("❌ Utilisateur non trouvé. Veuillez vous inscrire d'abord.")
      return
    }

    const user = userData.data.users[0]
    console.log("✅ Utilisateur trouvé:", user)

    const totalSteps = nodes.length
    const completedSteps = nodes.filter((node) => node.data.completed).length
    const completionPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
    const projectName = selectedProject
      ? USER_PROJECTS.find((p) => p.id === selectedProject)?.name || "Roadmap personnalisée"
      : "Roadmap personnalisée"

    console.log("📊 Statistiques:", { totalSteps, completedSteps, completionPercentage })

    const insertRoadmapMutation = `
      mutation InsertRoadmap(
        $user_email: String!
        $project_name: String!
        $project_description: String
        $nodes_data: jsonb!
        $edges_data: jsonb!
        $total_steps: Int!
        $completed_steps: Int!
        $completion_percentage: Int!
        $status: String!
      ) {
        insert_roadmaps(
          objects: [{
            user_email: $user_email
            project_name: $project_name
            project_description: $project_description
            nodes_data: $nodes_data
            edges_data: $edges_data
            total_steps: $total_steps
            completed_steps: $completed_steps
            completion_percentage: $completion_percentage
            status: $status
          }]
          on_conflict: {
            constraint: roadmaps_user_email_project_name_key
            update_columns: [
              project_description
              nodes_data
              edges_data
              total_steps
              completed_steps
              completion_percentage
              status
              updated_at
            ]
          }
        ) {
          returning {
            id
            user_email
            project_name
            total_steps
            completed_steps
            completion_percentage
            created_at
            updated_at
          }
        }
      }
    `
    const roadmapResponse = await fetch(HASURA_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": HASURA_SECRET,
      },
      body: JSON.stringify({
        query: insertRoadmapMutation,
        variables: {
          user_email: userEmail,
          project_name: projectName,
          project_description: `Roadmap avec ${totalSteps} étapes créée le ${new Date().toLocaleDateString()}`,
          nodes_data: nodes,
          edges_data: edges,
          total_steps: totalSteps,
          completed_steps: completedSteps,
          completion_percentage: completionPercentage,
          status: "active",
        },
      }),
    })

    const roadmapResult = await roadmapResponse.json()
    console.log("💾 Réponse sauvegarde:", roadmapResult)

    if (roadmapResult.errors) {
      throw new Error(`Erreur GraphQL: ${roadmapResult.errors[0].message}`)
    }
    const savedRoadmap = roadmapResult.data?.insert_roadmaps?.returning?.[0]
    if (!savedRoadmap) {
      throw new Error("Aucune roadmap retournée après la sauvegarde")
    }

    const backupData = {
      nodes,
      edges,
      userEmail,
      savedAt: new Date().toISOString(),
      roadmapId: savedRoadmap.id,
    }
    const key = selectedProject ? `flow-${selectedProject}` : "flow-default"
    localStorage.setItem(key, JSON.stringify(backupData))
    alert(
      `✅ Roadmap sauvegardée avec succès pour ${user.prenom} ${user.nom}!\n📊 ${totalSteps} étapes enregistrées\n📈 ${completionPercentage}% complété\n🆔 ID: ${savedRoadmap.id}`,
    )
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde:", error)
    alert(`❌ Erreur lors de la sauvegarde: ${error.message}\nVos données sont sauvées localement en backup.`)
    const key = selectedProject ? `flow-${selectedProject}` : "flow-default"
    localStorage.setItem(
      key,
      JSON.stringify({
        nodes,
        edges,
        userEmail,
        savedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      }),
    )
  }
}

export const loadFromDatabase = async (userEmail: string) => {
  try {
    console.log("🔄 Début du chargement pour:", userEmail)
    const getUserRoadmapsQuery = `
      query GetUserRoadmaps($email: String!) {
        roadmaps(
          where: {user_email: {_eq: $email}}
          order_by: {updated_at: desc}
        ) {
          id
          user_email
          project_name
          project_description
          nodes_data
          edges_data
          total_steps
          completed_steps
          completion_percentage
          status
          created_at
          updated_at
        }
        users(where: {email: {_eq: $email}}) {
          id
          nom
          prenom
          email
        }
      }
    `
    const response = await fetch(HASURA_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": HASURA_SECRET,
      },
      body: JSON.stringify({
        query: getUserRoadmapsQuery,
        variables: { email: userEmail },
      }),
    })
    const result = await response.json()
    console.log("📂 Réponse chargement:", result)

    if (result.errors) {
      throw new Error(`Erreur GraphQL: ${result.errors[0].message}`)
    }
    if (!result.data?.users?.length) {
      alert("❌ Aucun utilisateur trouvé avec cet email")
      return null
    }
    if (!result.data?.roadmaps?.length) {
      alert("📂 Aucune roadmap trouvée pour cet utilisateur")
      return null
    }

    const user = result.data.users[0]
    const latestRoadmap = result.data.roadmaps[0]
    console.log("📊 Roadmap à charger:", latestRoadmap)

    alert(
      `📂 Roadmap "${latestRoadmap.project_name}" chargée avec succès pour ${user.prenom} ${user.nom}!\n📊 ${latestRoadmap.total_steps} étapes récupérées\n📈 ${latestRoadmap.completion_percentage}% complété\n🆔 ID: ${latestRoadmap.id}`,
    )
    return latestRoadmap
  } catch (error) {
    console.error("❌ Erreur lors du chargement:", error)
    alert(`❌ Erreur lors du chargement: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}
