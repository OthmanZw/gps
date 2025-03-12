import { DataTable } from '@/components/DataTable';
import { Form } from '@/components/Form';

const columns = [
  { key: 'firstName', label: 'Prénom' },
  { key: 'lastName', label: 'Nom' },
  { key: 'position', label: 'Position' },
  { key: 'number', label: 'Numéro' },
  { key: 'team', label: 'Équipe', render: (team: any) => team?.name || 'Non assigné' },
];

const formFields = [
  { name: 'firstName', label: 'Prénom', type: 'text' as const, required: true },
  { name: 'lastName', label: 'Nom', type: 'text' as const, required: true },
  { name: 'position', label: 'Position', type: 'select' as const, required: true, 
    options: [
      { value: 'GOALKEEPER', label: 'Gardien' },
      { value: 'DEFENDER', label: 'Défenseur' },
      { value: 'MIDFIELDER', label: 'Milieu' },
      { value: 'FORWARD', label: 'Attaquant' },
    ]
  },
  { name: 'number', label: 'Numéro', type: 'number' as const, required: true },
  { name: 'birthDate', label: 'Date de naissance', type: 'date' as const, required: true },
  { name: 'nationality', label: 'Nationalité', type: 'text' as const, required: true },
];

export default function PlayersPage() {
  // Note: Ces données seront remplacées par des appels API réels
  const players = [
    { 
      id: 1, 
      firstName: 'Kylian', 
      lastName: 'Mbappé', 
      position: 'FORWARD',
      number: 7,
      team: { name: 'PSG' }
    },
    { 
      id: 2, 
      firstName: 'Antoine', 
      lastName: 'Griezmann', 
      position: 'FORWARD',
      number: 7,
      team: { name: 'Marseille' }
    },
  ];

  const handleSubmit = async (data: any) => {
    console.log('Nouveau joueur:', data);
    // TODO: Implémenter l'appel API pour créer un joueur
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Gestion des joueurs</h1>
        <button
          className="px-4 py-2 bg-accent text-white rounded-md hover:bg-primary"
          onClick={() => {/* TODO: Ouvrir le modal d'ajout */}}
        >
          Ajouter un joueur
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Liste des joueurs</h2>
        <DataTable
          columns={columns}
          data={players}
          onRowClick={(player) => {/* TODO: Navigation vers la page de détails */}}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Ajouter un joueur</h2>
        <Form
          fields={formFields}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
} 