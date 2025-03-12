import { DataTable } from '@/components/DataTable';
import { Form } from '@/components/Form';

const userColumns = [
  { key: 'email', label: 'Email' },
  { key: 'name', label: 'Nom' },
  { key: 'role', label: 'Rôle' },
  { 
    key: 'createdAt', 
    label: 'Date de création',
    render: (date: string) => new Date(date).toLocaleDateString('fr-FR')
  },
];

const userFormFields = [
  { name: 'email', label: 'Email', type: 'email' as const, required: true },
  { name: 'name', label: 'Nom', type: 'text' as const, required: true },
  { name: 'password', label: 'Mot de passe', type: 'password' as const, required: true },
  { 
    name: 'role', 
    label: 'Rôle', 
    type: 'select' as const, 
    required: true,
    options: [
      { value: 'USER', label: 'Utilisateur' },
      { value: 'ADMIN', label: 'Administrateur' },
      { value: 'MANAGER', label: 'Manager' },
    ]
  },
];

export default function AdminPage() {
  // Note: Ces données seront remplacées par des appels API réels
  const users = [
    {
      id: 1,
      email: 'admin@example.com',
      name: 'Admin',
      role: 'ADMIN',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      email: 'manager@example.com',
      name: 'Manager',
      role: 'MANAGER',
      createdAt: '2024-01-15'
    },
  ];

  const handleUserSubmit = async (data: any) => {
    console.log('Nouvel utilisateur:', data);
    // TODO: Implémenter l'appel API pour créer un utilisateur
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-primary">Administration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Statistiques */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Équipes</p>
              <p className="text-2xl font-bold text-primary">12</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Joueurs</p>
              <p className="text-2xl font-bold text-primary">264</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Matchs Joués</p>
              <p className="text-2xl font-bold text-primary">45</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-primary">8</p>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-primary">
              Exporter les données
            </button>
            <button className="w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-primary">
              Sauvegarder la base de données
            </button>
            <button className="w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-primary">
              Générer des rapports
            </button>
          </div>
        </div>
      </div>

      {/* Gestion des utilisateurs */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Gestion des utilisateurs</h2>
        <DataTable
          columns={userColumns}
          data={users}
          onRowClick={(user) => {/* TODO: Ouvrir le modal d'édition */}}
        />
      </div>

      {/* Ajouter un utilisateur */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Ajouter un utilisateur</h2>
        <Form
          fields={userFormFields}
          onSubmit={handleUserSubmit}
        />
      </div>
    </div>
  );
} 