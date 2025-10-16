// Formater les montants en Ariary
export const formatCurrency = (amount) => {
  return `${amount.toLocaleString('fr-FR')} Ar`;
};

// Formater les dates
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Formater l'heure
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Formater la durée en minutes
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}min`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}min`;
  }
};

// Calculer la durée entre deux dates
export const calculateDuration = (startDate, endDate = new Date()) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  const diffMins = Math.floor(diffMs / 1000 / 60);
  return formatDuration(diffMins);
};

// Calculer le pourcentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Formater le numéro de téléphone
export const formatPhone = (phone) => {
  // Format: 034 12 345 67
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
};

// Obtenir les initiales d'un nom
export const getInitials = (firstName, lastName) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Couleur aléatoire pour les avatars
export const getRandomColor = () => {
  const colors = [
    'from-cyan-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-orange-500 to-red-600',
    'from-emerald-500 to-teal-600',
    'from-yellow-500 to-orange-600',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Statut de session en couleur
export const getSessionStatusColor = (status) => {
  switch (status) {
    case 'en_cours':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'terminée':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'annulée':
      return 'bg-red-500/20 text-red-400 border-red-500/50';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

// Statut de poste en couleur
export const getPosteStatusColor = (status) => {
  switch (status) {
    case 'libre':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    case 'occupé':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'maintenance':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    case 'hors_service':
      return 'bg-red-500/20 text-red-400 border-red-500/50';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

export default {
  formatCurrency,
  formatDate,
  formatTime,
  formatDuration,
  calculateDuration,
  calculatePercentage,
  formatPhone,
  getInitials,
  getRandomColor,
  getSessionStatusColor,
  getPosteStatusColor,
};