# 🖥️ CyberApp - Système de Gestion de Cybercafé

Une application web moderne et futuriste pour gérer efficacement un cybercafé avec suivi en temps réel des sessions, gestion des clients et analyse des performances.

## ✨ Fonctionnalités

### 🎯 Tableau de Bord
- Vue d'ensemble en temps réel de tous les postes
- Statistiques de revenus et d'utilisation
- Monitoring de l'état réseau des machines
- Activités récentes et notifications

### 👥 Gestion des Clients
- Enregistrement et suivi des clients
- Historique des visites et dépenses
- Recherche et filtrage avancés
- Identification des clients fidèles

### ⏱️ Gestion des Sessions
- Démarrage et arrêt de sessions
- Timer en temps réel
- Calcul automatique des coûts
- Support de multiples tarifs (horaire, forfaits)

### 📊 Rapports et Statistiques
- Graphiques de revenus
- Analyse d'utilisation des postes
- Top clients fidèles
- Export de rapports (PDF, Excel)

### 💼 Services Additionnels
- Impression (N&B, couleur)
- Scanning
- Vente de consommables (clés USB, CD/DVD)
- Facturation complète

## 🚀 Technologies Utilisées

### Frontend
- **React 19** - Framework UI
- **TailwindCSS 3** - Framework CSS utilitaire
- **React Router 6** - Navigation
- **Axios** - Requêtes HTTP
- **Recharts** - Graphiques et visualisations
- **Lucide React** - Icônes modernes

### Backend
- **Node.js** - Environnement d'exécution
- **Express** - Framework web
- **SQLite3** - Base de données
- **CORS** - Gestion des requêtes cross-origin

## 📦 Installation

### Prérequis
- Node.js 20+ 
- npm ou yarn

### Installation du Backend

```bash
cd backend
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Installation du Frontend

```bash
cd frontend
npm install
npm start
```

L'application démarre sur `http://localhost:3000`

## 🗂️ Structure du Projet

```
cyberApp/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (DB, etc.)
│   │   ├── controllers/     # Logique métier
│   │   ├── models/          # Modèles de données
│   │   ├── routes/          # Routes API
│   │   ├── middleware/      # Middlewares
│   │   ├── utils/           # Utilitaires
│   │   └── server.js        # Point d'entrée
│   ├── package.json
│   └── cyberapp.db          # Base de données SQLite
│
└── frontend/
    ├── src/
    │   ├── components/      # Composants React
    │   │   ├── common/      # Composants réutilisables
    │   │   ├── dashboard/   # Composants du dashboard
    │   │   └── sessions/    # Composants des sessions
    │   ├── pages/           # Pages de l'application
    │   │   ├── Dashboard/
    │   │   ├── Sessions/
    │   │   ├── Clients/
    │   │   └── Reports/
    │   ├── services/        # Services API
    │   ├── hooks/           # Hooks personnalisés
    │   ├── utils/           # Fonctions utilitaires
    │   ├── App.js           # Composant principal
    │   └── index.css        # Styles globaux
    ├── public/
    ├── package.json
    └── tailwind.config.js
```

## 🎨 Design & UI/UX

L'application utilise un design **futuriste et moderne** avec :
- **Glassmorphism** - Effets de verre et transparence
- **Gradients animés** - Dégradés de couleurs dynamiques
- **Animations fluides** - Transitions et micro-interactions
- **Dark mode** - Interface sombre élégante
- **Responsive design** - Adaptatif sur tous les écrans

## 🔌 API Endpoints

### Postes
- `GET /api/postes` - Liste tous les postes
- `GET /api/postes/:id` - Détails d'un poste
- `POST /api/postes` - Créer un poste
- `PUT /api/postes/:id` - Modifier un poste
- `DELETE /api/postes/:id` - Supprimer un poste

### Clients
- `GET /api/clients` - Liste tous les clients
- `GET /api/clients/:id` - Détails d'un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/:id` - Modifier un client
- `GET /api/clients/search