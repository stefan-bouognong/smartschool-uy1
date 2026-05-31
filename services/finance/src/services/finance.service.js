const { Tranche, PayerTranche } = require('../database/models');
const studentClient = require('../clients/studentClient');
const axios = require('axios');
const config = require('../config/env');

// ─── CAMPAY MOBILE MONEY INTEGRATION ────────────────────────────────────────

/**
 * Crée une collecte de paiement via l'API Campay Mobile Money
 */
const campayCollect = async (amount, customerPhone) => {
  try {
    const response = await axios.post(
      `${config.campay.apiUrl}/collect/`,
      {
        amount: String(amount),
        from: customerPhone,
        description: 'Paiement pension SmartSchool UY1',
        external_reference: `SS-${Date.now()}`
      },
      {
        headers: {
          Authorization: `Token ${config.campay.username}`,
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Erreur Campay Collect:', error.response?.data || error.message);
    throw new Error('Échec de l\'initiation du paiement Campay Mobile Money.');
  }
};

/**
 * Vérifie le statut d'une transaction Campay
 */
const campayStatus = async (reference) => {
  try {
    const response = await axios.get(
      `${config.campay.apiUrl}/transaction/${reference}`,
      {
        headers: {
          Authorization: `Token ${config.campay.username}`,
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Erreur Campay Status:', error.response?.data || error.message);
    throw new Error('Impossible de vérifier le statut de la transaction.');
  }
};

// ─── CRUD DES TRANCHES DE PENSION ───────────────────────────────────────────

exports.creerTranche = async (data) => {
  return Tranche.create({
    libelle_tranche: data.libelle_tranche,
    montant_exigible: data.montant_exigible,
    date_limite: data.date_limite
  });
};

exports.getAllTranches = async () => {
  return Tranche.findAll({
    order: [['date_limite', 'ASC']]
  });
};

exports.getTrancheById = async (id) => {
  return Tranche.findByPk(id);
};

// ─── PAIEMENT D'UNE TRANCHE ────────────────────────────────────────────────

exports.payerTranche = async (data) => {
  const { id_inscription, id_tranche, montant_verse, mode_paiement, telephone } = data;

  // 1. Vérifier que la tranche existe
  const tranche = await Tranche.findByPk(id_tranche);
  if (!tranche) {
    throw new Error('Tranche introuvable');
  }

  // 2. Vérifier le doublon
  const existant = await PayerTranche.findOne({
    where: { id_inscription, id_tranche }
  });
  if (existant) {
    throw new Error('Cette tranche a déjà été payée pour cette inscription.');
  }

  // 3. Initier le paiement Mobile Money Campay (si le mode est Mobile Money)
  let campayRef = null;
  if (mode_paiement === 'Mobile Money' && telephone) {
    const result = await campayCollect(montant_verse, telephone);
    campayRef = result.reference || result.ref || null;
  }

  // 4. Enregistrer le paiement
  const paiement = await PayerTranche.create({
    id_inscription,
    id_tranche,
    date_paiement: new Date(),
    montant_verse,
    mode_paiement: mode_paiement || 'Espèces'
  });

  // 5. Appel synchrone vers Student Service pour mettre à jour le statut de paiement
  try {
    await studentClient.put(
      `/api/scolarite/internal/inscriptions/${id_inscription}/paiement`,
      { statut: true }
    );
    console.log(`✅ Statut de paiement mis à jour pour l'inscription ${id_inscription}`);
  } catch (err) {
    console.error('⚠️ Mise à jour du statut de paiement échouée (Student Service injoignable):', err.message);
  }

  return {
    paiement,
    campay_reference: campayRef,
    tranche: tranche.libelle_tranche,
    montant_exigible: tranche.montant_exigible
  };
};

// ─── HISTORIQUE DE PAIEMENTS POUR UNE INSCRIPTION ───────────────────────────

exports.getPaiementsParInscription = async (id_inscription) => {
  return PayerTranche.findAll({
    where: { id_inscription },
    include: [Tranche]
  });
};

// ─── VÉRIFICATION DU STATUT CAMPAY ──────────────────────────────────────────

exports.verifierStatutCampay = async (reference) => {
  return campayStatus(reference);
};

// ─── ÉLIGIBILITÉ FINANCIÈRE (ENDPOINT INTERNE POUR REPORTING) ───────────────

exports.getEligibiliteFinanciere = async (id_inscription) => {
  const paiements = await PayerTranche.findAll({
    where: { id_inscription },
    include: [Tranche]
  });

  const totalVerse = paiements.reduce((acc, p) => acc + Number(p.montant_verse), 0);
  const totalExigible = paiements.reduce((acc, p) => acc + Number(p.Tranche.montant_exigible), 0);

  const allTranches = await Tranche.findAll();
  const totalGlobal = allTranches.reduce((acc, t) => acc + Number(t.montant_exigible), 0);

  return {
    id_inscription,
    total_verse: totalVerse,
    total_exigible: totalGlobal,
    nombre_tranches_payees: paiements.length,
    nombre_tranches_total: allTranches.length,
    pourcentage: totalGlobal > 0 ? Math.round((totalVerse / totalGlobal) * 100) : 0,
    est_eligible: totalVerse >= totalGlobal
  };
};
