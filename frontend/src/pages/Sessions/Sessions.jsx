import { useState, useEffect } from 'react';
import { Clock, Play, Pause, DollarSign, User, Monitor, Plus, X } from 'lucide-react';
import { sessionsAPI, postesAPI, clientsAPI, tarifsAPI } from '../../services/api';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [postes, setPostes] = useState([]);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Ces appels échoueront pour l'instant car le backend n'est pas encore créé
      // const [sessionsRes, postesRes] = await Promise.all([
      //   sessionsAPI.getActive(),
      //   postesAPI.getAll()
      // ]);
      // setSessions(sessionsRes.data);
      // setPostes(postesRes.data);
      
      // Données de démonstration
      setSessions([
        { id: 1, poste_id: 3, client_nom: 'Jean Rakoto', heure_debut: '2025-01-16T08:30:00', duree_minutes: 135, montant_calcule: 2250, statut: 'en_cours' },
        { id: 2, poste_id: 5, client_nom: 'Marie Rasoa', heure_debut: '2025-01-16T09:15:00', duree_minutes: 78, montant_calcule: 1300, statut: 'en_cours' },
        { id: 3, poste_id: 7, client_nom: 'Paul Andry', heure_debut: '2025-01-16T10:00:00', duree_minutes: 45, montant_calcule: 750, statut: 'en_cours' },
      ]);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000 / 60); // minutes
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  const SessionCard = ({ session }) => (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Poste {session.poste_id}</h3>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <User className="w-4 h-4" />
              {session.client_nom}
            </p>
          </div>
        </div>
        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/50">
          En cours
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Durée
          </span>
          <span className="text-white font-semibold">{calculateDuration(session.heure_debut)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Montant
          </span>
          <span className="text-cyan-400 font-bold">{session.montant_calcule} Ar</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Début</span>
          <span className="text-white">{new Date(session.heure_debut).toLocaleTimeString('fr-FR')}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
        <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
          <Pause className="w-4 h-4" />
          Pause
        </button>
        <button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
          <DollarSign className="w-4 h-4" />
          Terminer
        </button>
      </div>
    </div>
  );

  const NewSessionModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Nouvelle Session</h2>
          <button
            onClick={() => setShowNewSessionModal(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Client</label>
            <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50">
              <option>Sélectionner un client</option>
              <option>Jean Rakoto</option>
              <option>Marie Rasoa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Poste</label>
            <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50">
              <option>Sélectionner un poste</option>
              <option>Poste 1</option>
              <option>Poste 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tarif</label>
            <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50">
              <option>Tarif Normal - 500 Ar/h</option>
              <option>Forfait 2h - 900 Ar</option>
              <option>Forfait 5h - 2000 Ar</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowNewSessionModal(false)}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
            >
              Démarrer
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Gestion des Sessions
            </h1>
            <p className="text-gray-400 mt-2">Suivi en temps réel de toutes les sessions actives</p>
          </div>
          <button
            onClick={() => setShowNewSessionModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Session
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Sessions Actives</p>
              <p className="text-3xl font-bold text-white mt-2">{sessions.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Durée Moyenne</p>
              <p className="text-3xl font-bold text-white mt-2">1h 26m</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total à Encaisser</p>
              <p className="text-3xl font-bold text-cyan-400 mt-2">4,300 Ar</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Chargement...</div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
          <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Aucune session active</p>
          <button
            onClick={() => setShowNewSessionModal(true)}
            className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2 px-6 rounded-xl"
          >
            Démarrer une session
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showNewSessionModal && <NewSessionModal />}
    </div>
  );
}

export default Sessions;