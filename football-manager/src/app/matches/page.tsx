import { DataTable } from '@/components/DataTable';
import { Form } from '@/components/Form';

const columns = [
  { 
    key: 'date', 
    label: 'Date', 
    render: (date: string) => new Date(date).toLocaleDateString('fr-FR')
  },
  { key: 'homeTeam', label: 'Équipe domicile', render: (team: any) => team.name },
  { key: 'awayTeam', label: 'Équipe extérieur', render: (team: any) => team.name },
  { 
    key: 'score', 
    label: 'Score',
    render: (_, match: any) => 
      match.homeScore !== null && match.awayScore !== null
        ? `${match.homeScore} - ${match.awayScore}`
        : 'Non joué'
  },
  { key: 'competition', label: 'Compétition', render: (comp: any) => comp.name },
  { key: 'referee', label: 'Arbitre', render: (ref: any) => `${ref.firstName} ${ref.lastName}` },
];

const formFields = [
  { name: 'date', label: 'Date du match', type: 'date' as const, required: true },
  { 
    name: 'homeTeamId', 
    label: 'Équipe domicile', 
    type: 'select' as const, 
    required: true,
    options: [
      { value: '1', label: 'PSG' },
      { value: '2', label: 'Marseille' },
      { value: '3', label: 'Lyon' },
    ]
  },
  { 
    name: 'awayTeamId', 
    label: 'Équipe extérieur', 
    type: 'select' as const, 
    required: true,
    options: [
      { value: '1', label: 'PSG' },
      { value: '2', label: 'Marseille' },
      { value: '3', label: 'Lyon' },
    ]
  },
  { 
    name: 'competitionId', 
    label: 'Compétition', 
    type: 'select' as const, 
    required: true,
    options: [
      { value: '1', label: 'Ligue 1' },
      { value: '2', label: 'Coupe de France' },
    ]
  },
  { 
    name: 'refereeId', 
    label: 'Arbitre', 
    type: 'select' as const, 
    required: true,
    options: [
      { value: '1', label: 'Pierre Dupont' },
      { value: '2', label: 'Marie Martin' },
    ]
  },
];

export default function MatchesPage() {
  // Note: Ces données seront remplacées par des appels API réels
  const matches = [
    {
      id: 1,
      date: '2024-03-15',
      homeTeam: { name: 'PSG' },
      awayTeam: { name: 'Marseille' },
      homeScore: 3,
      awayScore: 1,
      competition: { name: 'Ligue 1' },
      referee: { firstName: 'Pierre', lastName: 'Dupont' }
    },
    {
      id: 2,
      date: '2024-03-22',
      homeTeam: { name: 'Lyon' },
      awayTeam: { name: 'PSG' },
      homeScore: null,
      awayScore: null,
      competition: { name: 'Coupe de France' },
      referee: { firstName: 'Marie', lastName: 'Martin' }
    },
  ];

  const handleSubmit = async (data: any) => {
    console.log('Nouveau match:', data);
    // TODO: Implémenter l'appel API pour créer un match
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Gestion des matchs</h1>
        <button
          className="px-4 py-2 bg-accent text-white rounded-md hover:bg-primary"
          onClick={() => {/* TODO: Ouvrir le modal d'ajout */}}
        >
          Programmer un match
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Liste des matchs</h2>
        <DataTable
          columns={columns}
          data={matches}
          onRowClick={(match) => {/* TODO: Navigation vers la page de détails */}}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Programmer un match</h2>
        <Form
          fields={formFields}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
} 