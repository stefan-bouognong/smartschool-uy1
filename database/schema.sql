-- Création de la base
CREATE DATABASE IF NOT EXISTS smartschool;
USE smartschool;

-- ETABLISSEMENT
CREATE TABLE Etablissement (
    id_etablissement INT AUTO_INCREMENT PRIMARY KEY,
    nom_etablissement VARCHAR(255) NOT NULL,
    adresse TEXT,
    ville VARCHAR(100),
    telephone VARCHAR(20)
);

-- DEPARTEMENT
CREATE TABLE Departement (
    id_departement INT AUTO_INCREMENT PRIMARY KEY,
    nom_dept VARCHAR(100) NOT NULL,
    id_etablissement INT,
    FOREIGN KEY (id_etablissement) REFERENCES Etablissement(id_etablissement)
);

-- NIVEAU
CREATE TABLE Niveau (
    id_niveau INT AUTO_INCREMENT PRIMARY KEY,
    libelle_niveau VARCHAR(50) NOT NULL,
    id_departement INT,
    FOREIGN KEY (id_departement) REFERENCES Departement(id_departement)
);

-- ANNEE ACADEMIQUE
CREATE TABLE Annee_Academique (
    id_annee INT AUTO_INCREMENT PRIMARY KEY,
    libelle_annee VARCHAR(20) NOT NULL
);

-- ENSEIGNANT
CREATE TABLE Enseignant (
    id_enseignant INT AUTO_INCREMENT PRIMARY KEY,
    nom_ens VARCHAR(100),
    prenom_ens VARCHAR(100),
    specialite VARCHAR(100),
    email VARCHAR(150),
    telephone VARCHAR(20)
);

-- UE
CREATE TABLE UE (
    id_UE INT AUTO_INCREMENT PRIMARY KEY,
    code_UE VARCHAR(20),
    libelle_UE VARCHAR(100),
    credits_ECTS INT,
    id_niveau INT,
    FOREIGN KEY (id_niveau) REFERENCES Niveau(id_niveau)
);

-- ETUDIANT
CREATE TABLE Etudiant (
    id_etudiant INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(50),
    nom_etud VARCHAR(100),
    prenom_etud VARCHAR(100),
    date_naissance DATE,
    sexe VARCHAR(10),
    adresse TEXT,
    email VARCHAR(150)
);

-- INSCRIPTION (TABLE CENTRALE)
CREATE TABLE Inscription (
    id_inscription INT AUTO_INCREMENT PRIMARY KEY,
    date_inscription DATE,
    statut_paiement BOOLEAN DEFAULT FALSE,
    id_etudiant INT,
    id_annee INT,
    id_niveau INT,
    FOREIGN KEY (id_etudiant) REFERENCES Etudiant(id_etudiant),
    FOREIGN KEY (id_annee) REFERENCES Annee_Academique(id_annee),
    FOREIGN KEY (id_niveau) REFERENCES Niveau(id_niveau)
);

-- NOTE
CREATE TABLE Note (
    id_note INT AUTO_INCREMENT PRIMARY KEY,
    valeur_note FLOAT,
    session VARCHAR(50),
    date_examen DATE,
    id_inscription INT,
    id_UE INT,
    id_enseignant INT,
    FOREIGN KEY (id_inscription) REFERENCES Inscription(id_inscription),
    FOREIGN KEY (id_UE) REFERENCES UE(id_UE),
    FOREIGN KEY (id_enseignant) REFERENCES Enseignant(id_enseignant)
);

-- TRANCHE
CREATE TABLE Tranche (
    id_tranche INT AUTO_INCREMENT PRIMARY KEY,
    libelle_tranche VARCHAR(100),
    montant_exigible FLOAT,
    date_limite DATE
);

-- PAIEMENT
CREATE TABLE Payer_Tranche (
    id_inscription INT,
    id_tranche INT,
    date_paiement DATE,
    montant_verse FLOAT,
    mode_paiement VARCHAR(50),
    PRIMARY KEY (id_inscription, id_tranche),
    FOREIGN KEY (id_inscription) REFERENCES Inscription(id_inscription),
    FOREIGN KEY (id_tranche) REFERENCES Tranche(id_tranche)
);

-- AUTHENTIFICATION
CREATE TABLE Utilisateur (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    mot_de_passe VARCHAR(255),
    role ENUM('ADMIN', 'ENSEIGNANT') NOT NULL,
    id_enseignant INT NULL,
    FOREIGN KEY (id_enseignant) REFERENCES Enseignant(id_enseignant)
);