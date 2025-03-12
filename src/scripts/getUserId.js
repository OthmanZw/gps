require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const findUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const user = await User.findOne({});
    if (user) {
      console.log('ID de l\'utilisateur:', user._id);
    } else {
      console.log('Aucun utilisateur trouvé');
    }
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  }
};

findUser(); 