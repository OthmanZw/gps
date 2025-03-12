import { DataTable } from '@/components/DataTable';
import { Form } from '@/components/Form';

const columns = [
  { key: 'name', label: 'Nom' },
  { key: 'city', label: 'Ville' },
  { key: 'players', label: 'Joueurs', render: (players: any[]) => players?.length || 0 },
];

const formFields = [
  { name: 'name', label: 'Nom de l\'équipe', type: 'text' as const, required: true },
  { name: 'city', label: 'Ville', type: 'text' as const, required: true },
  { name: 'logo', label: 'URL du logo', type: 'text' as const },
];

export default function TeamsPage() {
  // Note: Ces données seront remplacées par des appels API réels
  const teams = [
    { id: 1, name: 'PSG', city: 'Paris', players: [] },
    { id: 2, name: 'Marseille', city: 'Marseille', players: [] },
    { id: 3, name: 'Lyon', city: 'Lyon', players: [] },
  ];

  const handleSubmit = async (data: any) => {
    console.log('Nouvelle équipe:', data);
    // TODO: Implémenter l'appel API pour créer une équipe
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Gestion des équipes</h1>
        <button
          className="px-4 py-2 bg-accent text-white rounded-md hover:bg-primary"
          onClick={() => {/* TODO: Ouvrir le modal d'ajout */}}
        >
          Ajouter une équipe
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Liste des équipes</h2>
        <DataTable
          columns={columns}
          data={teams}
          onRowClick={(team) => {/* TODO: Navigation vers la page de détails */}}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Ajouter une équipe</h2>
        <Form
          fields={formFields}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
} 