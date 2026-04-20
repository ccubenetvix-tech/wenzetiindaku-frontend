import { useTranslation } from "react-i18next";
import { Shield, FileText, Lock, Eye, UserCheck, AlertTriangle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";


const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">POLITIQUE DE CONFIDENTIALITÉ</h1>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
              WENZE TII NDAKU (WTN) – République Démocratique du Congo
            </p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-muted p-4 rounded-lg mb-8">
              <p className="text-sm text-muted-foreground">
                <strong>Dernière mise à jour :</strong> 10 février 2026
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Responsable du traitement :</strong> WENZE TII NDAKU, SARL<br />
                <strong>Email :</strong> wenzetiindaku@outlook.com<br />
                <strong>Téléphone :</strong> +32 495 84 68 66
              </p>
            </div>
            <div className="prose prose-lg max-w-none text-foreground mx-auto">
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <strong>Champ d’application</strong><br />
                  La présente politique s’applique à tous les utilisateurs de la plateforme.
                </li>
                <li>
                  <strong>Données collectées</strong><br />
                  Données d’identification : nom, prénom, téléphone, email, adresse.<br />
                  Données vendeurs : pièce d’identité, RCCM si applicable, coordonnées bancaires.<br />
                  Données transactionnelles : commandes, paiements, commissions.<br />
                  Données techniques : IP, appareil, navigation, cookies.
                </li>
                <li>
                  <strong>Finalités</strong><br />
                  Gestion des comptes, traitement des commandes, paiements, livraison, prévention de fraude, sécurité et conformité légale.
                </li>
                <li>
                  <strong>Base légale</strong><br />
                  Exécution contractuelle, consentement, intérêt légitime, obligations légales applicables.
                </li>
                <li>
                  <strong>Partage des données</strong><br />
                  Prestataires de paiement,<br />
                  Partenaires logistiques<br />
                  Prestatairestechniques,<br />
                  Autoritéslégales si requis.<br />
                  Aucune vente de données personnelles.
                </li>
                <li>
                  <strong>Transferts internationaux</strong><br />
                  Des données peuvent être hébergées hors RDC avec garanties de sécurité appropriées.
                </li>
                <li>
                  <strong>Sécurité</strong><br />
                  Mesurestechniques et organisationnellesincluant contrôle d’accès et protection contre fraude.
                </li>
                <li>
                  <strong>Conservation</strong><br />
                  Données conservées selon durée d’utilisation et obligations légales applicables.
                </li>
                <li>
                  <strong>Droits des utilisateurs</strong><br />
                  Accès, rectification, effacement, limitation, opposition, portabilité.<br />
                  Contact : wtn-customers@outlook.com
                </li>
                <li>
                  <strong>Cookies</strong><br />
                  Utilisation pour analyse, sécurité et amélioration de l’expérience utilisateur.
                </li>
                <li>
                  <strong>Données des mineurs</strong><br />
                  Non destiné aux moins de 18 ans sans autorisation parentale.
                </li>
                <li>
                  <strong>Responsabilité Marketplace</strong><br />
                  La plateforme agit comme intermédiaire entre vendeurs et acheteurs.
                </li>
                <li>
                  <strong>Modifications</strong><br />
                  La politique peut être modifiée à tout moment.
                </li>
                <li>
                  <strong>Acceptation</strong><br />
                  L’utilisation de la plateforme implique acceptation de la présente politique.
                </li>
                <li>
                  <strong>Contact officiel :</strong><br />
                  WENZE TII NDAKU, SARL<br />
                  Email: wenzetiindaku@outlook.com<br />
                  Téléphone: +32 495 84 68 66
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;