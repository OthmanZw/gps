const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { AlertRule, AlertHistory } = require('../models/Alert');

// Obtenir toutes les règles d'alerte de l'utilisateur
router.get('/rules', auth, async (req, res) => {
  try {
    const rules = await AlertRule.find({ userId: req.user.userId });
    res.json(rules);
  } catch (err) {
    console.error('Erreur lors de la récupération des règles:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer une nouvelle règle d'alerte
router.post('/rules', auth, async (req, res) => {
  try {
    const newRule = new AlertRule({
      ...req.body,
      userId: req.user.userId
    });
    const rule = await newRule.save();
    res.status(201).json(rule);
  } catch (err) {
    console.error('Erreur lors de la création de la règle:', err);
    res.status(400).json({ message: 'Données invalides' });
  }
});

// Mettre à jour une règle d'alerte
router.put('/rules/:id', auth, async (req, res) => {
  try {
    const rule = await AlertRule.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!rule) return res.status(404).json({ message: 'Règle non trouvée' });
    res.json(rule);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la règle:', err);
    res.status(400).json({ message: 'Données invalides' });
  }
});

// Supprimer une règle d'alerte
router.delete('/rules/:id', auth, async (req, res) => {
  try {
    const rule = await AlertRule.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!rule) return res.status(404).json({ message: 'Règle non trouvée' });
    res.json({ message: 'Règle supprimée' });
  } catch (err) {
    console.error('Erreur lors de la suppression de la règle:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir l'historique des alertes
router.get('/history', auth, async (req, res) => {
  try {
    const alerts = await AlertHistory.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'historique:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Marquer une alerte comme lue
router.patch('/history/:id/read', auth, async (req, res) => {
  try {
    const alert = await AlertHistory.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { status: 'read' },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: 'Alerte non trouvée' });
    res.json(alert);
  } catch (err) {
    console.error('Erreur lors du marquage de l\'alerte comme lue:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router; 