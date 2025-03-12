import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Football Manager',
  description: 'Système de gestion de football professionnel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <nav className="bg-primary text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-bold">Football Manager</a>
            <div className="space-x-4">
              <a href="/teams" className="hover:text-accent">Équipes</a>
              <a href="/players" className="hover:text-accent">Joueurs</a>
              <a href="/matches" className="hover:text-accent">Matches</a>
              <a href="/competitions" className="hover:text-accent">Compétitions</a>
              <a href="/referees" className="hover:text-accent">Arbitres</a>
              <a href="/admin" className="hover:text-accent">Admin</a>
            </div>
          </div>
        </nav>
        <main className="container mx-auto py-8">
          {children}
        </main>
        <footer className="bg-secondary text-white p-4 mt-8">
          <div className="container mx-auto text-center">
            <p>&copy; 2024 Football Manager. Tous droits réservés.</p>
          </div>
        </footer>
      </body>
    </html>
  )
} 