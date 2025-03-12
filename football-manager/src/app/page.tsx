import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="hero bg-primary text-white py-16 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Bienvenue sur Football Manager</h1>
          <p className="text-xl mb-8">Gérez vos équipes, joueurs et compétitions en un seul endroit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="card bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">Équipes</h2>
          <p className="text-gray-600 mb-4">Gérez vos équipes, leurs effectifs et leurs performances</p>
          <a href="/teams" className="text-accent hover:text-primary">Voir les équipes →</a>
        </div>

        <div className="card bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">Joueurs</h2>
          <p className="text-gray-600 mb-4">Suivez les statistiques et les informations de vos joueurs</p>
          <a href="/players" className="text-accent hover:text-primary">Voir les joueurs →</a>
        </div>

        <div className="card bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">Compétitions</h2>
          <p className="text-gray-600 mb-4">Organisez et suivez vos compétitions et matchs</p>
          <a href="/competitions" className="text-accent hover:text-primary">Voir les compétitions →</a>
        </div>
      </div>

      <div className="bg-secondary text-white py-12 mb-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Fonctionnalités principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Gestion des équipes</h3>
              <p>Créez et gérez vos équipes facilement</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Suivi des joueurs</h3>
              <p>Gardez un œil sur les performances</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Organisation des matchs</h3>
              <p>Planifiez et gérez vos rencontres</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Statistiques détaillées</h3>
              <p>Analysez les données en temps réel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 