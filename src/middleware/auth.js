const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Accès refusé. Privilèges administrateur requis.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la vérification des privilèges' });
    }
};

module.exports = { auth, isAdmin }; 