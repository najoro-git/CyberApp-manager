import { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, Phone, Mail, DollarSign, Clock, X } from 'lucide-react';
import { clientsAPI } from '../../services/api';

function Clients() {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      // Données de démonstration
      setClients([
        { id: 1, nom: 'Rakoto', prenom: 'Jean', telephone: '034 12 345 67', email: 'jean@email.com', nombre_visites: 24, total_depense: 45000, date_derniere_visite: '2025-01-16' },
        { id: 2, nom: 'Rasoa', prenom: 'Marie', telephone: '033 98 765 43', email: 'marie@email.com', nombre_visites: 18, total_depense: 32000, date_derniere_visite: '2025-01-15' },
        { id: 3, nom: 'Andry', prenom: 'Paul', telephone: '032 55 444 33', email: 'paul@email.com', nombre_visites: 12, total_depense: 18000, date_derniere_visite: '2025-01-14' },
        { id: 4, nom: 'Feno', prenom: 'Sophie', telephone: '034 77 888 99', email: 'sophie@email.com', nombre_visites: 30, total_depense: 62000, date_derniere_visite: '2025-01-16' },
        { id: 5, nom: 'Rabe', prenom: 'Michel', telephone: '033 11 222 33', email: 'michel@email.com', nombre_visites: 8, total_depense: 12000, date_derniere_visite: '2025-01-13' },
      ]);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    `${client.nom} ${client.prenom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.telephone.includes(searchQuery)
  );

  const ClientModal = ({ client, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {client ? 'Modifier Client' : 'Nouveau Client'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
              <input
                type="text"
                defaultValue={client?.nom}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                placeholder="Nom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Prénom</label>
              <input
                type="text"
                defaultValue={client?.prenom}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                placeholder="Prénom"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
            <input
              type="tel"
              defaultValue={client?.telephone}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
              placeholder="034 XX XXX XX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email (Optionnel)</label>
            <input
              type="email"
              defaultValue={client?.email}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
              placeholder="email@example.com"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
            >
              {client ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Gestion des Clients
            </h1>
            <p className="text-gray-400 mt-2">Base de données complète de vos clients</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50"
          >
            <Plus className="w-5 h-5" />
            Nouveau Client
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, prénom ou téléphone..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Clients</p>
              <p className="text-3xl font-bold text-white mt-2">{clients.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Nouveaux ce Mois</p>
              <p className="text-3xl font-bold text-white mt-2">12</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Clients Fidèles</p>
              <p className="text-3xl font-bold text-white mt-2">8</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">CA Total</p>
              <p className="text-3xl font-bold text-cyan-400 mt-2">169k</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Visites</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Dépensé</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Dernière Visite</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {client.prenom[0]}{client.nom[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{client.prenom} {client.nom}</p>
                        <p className="text-gray-400 text-sm">ID: #{client.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-white text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {client.telephone}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {client.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-semibold">{client.nombre_visites}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-cyan-400 font-bold">{client.total_depense.toLocaleString()} Ar</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{new Date(client.date_derniere_visite).toLocaleDateString('fr-FR')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedClient(client)}
                        className="p-2 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 rounded-lg transition-all duration-300"
                      >
                        <Edit className="w-4 h-4 text-cyan-400" />
                      </button>
                      <button className="p-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-lg transition-all duration-300">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && <ClientModal onClose={() => setShowAddModal(false)} />}
      {selectedClient && <ClientModal client={selectedClient} onClose={() => setSelectedClient(null)} />}
    </div>
  );
}

export default Clients;