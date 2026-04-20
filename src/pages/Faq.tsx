import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Faq = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">FOIRE AUX QUESTIONS (FAQ)</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">WENZE TII NDAKU (WTN)</p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto prose prose-lg text-foreground">
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>QUESTIONS GÉNÉRALES</strong>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    <strong>Qu’est-ce que WENZE TII NDAKU ?</strong><br />
                    WENZE TII NDAKU (WTN) est une marketplace digitale congolaise qui connecte vendeurs et acheteurs sur une seule plateforme sécurisée. Vous pouvez y acheter des produits de beauté, vêtements, accessoires, produits technologiques et bien plus encore.
                  </li>
                  <li>
                    <strong>Où opère WTN ?</strong><br />
                    WTN opère principalement en République Démocratique du Congo (RDC) à Kinshasa et Lubumbashi avec une vision d’expansion panafricaine et internationale.
                  </li>
                  <li>
                    <strong>WTN vend-il directement les produits ?</strong><br />
                    Non. WTN est une plateforme intermédiaire. Les produits sont vendus par des vendeurs indépendants enregistrés sur la plateforme. WTN ne gère que les transactions sur la plateforme et les opérations de livraison.
                  </li>
                </ol>
              </li>
              <li>
                <strong>POUR LES ACHETEURS</strong>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    <strong>Comment créer un compte ?</strong><br />
                    1. Cliquez sur “S’inscrire”<br />
                    2. Entrez vos informations (nom, email, téléphone)<br />
                    3. Confirmez votre compte avec un code reçu par mail.<br />
                    4. Commencez à acheter.
                  </li>
                  <li>
                    <strong>Comment passer une commande ?</strong><br />
                    1. Choisissez votre produit<br />
                    2. Ajoutez au panier<br />
                    3. Procédez au paiement<br />
                    4. Confirmez la commande<br />
                    Vous recevrez une confirmation par email ou SMS.
                  </li>
                  <li>
                    <strong>Quels moyens de paiement sont acceptés ?</strong><br />
                    WTN accepte :<br />
                    - Mobile Money<br />
                    - Carte bancaire (via passerelle sécurisée)<br />
                    - Paiement à la livraison pour certains articles.
                  </li>
                  <li>
                    <strong>Le paiement est-il sécurisé ?</strong><br />
                    Oui. Les transactions sont protégées par des systèmes de cryptage conformes aux standards internationaux.
                  </li>
                  <li>
                    <strong>Combien de temps prend la livraison ?</strong><br />
                    Le délai dépend du vendeur, de la disponibilité du produit et de la ville de livraison. Nous essayons toutefois de garantir les livraisons en moins de 5 jours.
                  </li>
                  <li>
                    <strong>Puis-je retourner un produit ?</strong><br />
                    Oui, si le produit est endommagé, ne correspond pas à la description ou si le vendeur accepte les retours. Les conditions sont précisées sur chaque fiche produit.
                  </li>
                </ol>
              </li>
              <li>
                <strong>POUR LES VENDEURS</strong>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    <strong>Comment devenir vendeur sur WTN ?</strong><br />
                    1. Créer un compte vendeur<br />
                    2. Fournir les documents requis<br />
                    3. Attendre validation<br />
                    4. Publier vos produits
                  </li>
                  <li>
                    <strong>Y a-t-il des frais pour vendre ?</strong><br />
                    WTN applique des frais d’utilisation de la plateforme et une commission sur le volume de vente par mois ou des frais promotionnels optionnels. Les conditions sont précisées dans le contrat vendeur.
                  </li>
                  <li>
                    <strong>Quand suis-je payé ?</strong><br />
                    Les paiements sont libérés après confirmation de livraison et expiration du délai de réclamation. Les versements sont mensuels selon la politique interne.
                  </li>
                  <li>
                    <strong>Quels produits sont interdits ?</strong><br />
                    Il est interdit de vendre des produits illégaux, contrefaçons, produits expirés ou dangereux. WTN se réserve le droit de suspendre tout compte en violation.
                  </li>
                </ol>
              </li>
              <li>
                <strong>SÉCURITÉ & CONFIANCE</strong>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    <strong>Comment WTN protège mes données ?</strong><br />
                    Vos données personnelles sont protégées conformément aux normes internationales de sécurité numérique.
                  </li>
                  <li>
                    <strong>Que faire en cas de problème avec une commande ?</strong><br />
                    Rendez-vous dans : Mon Compte → Mes Commandes → Signaler un problème. L’équipe WTN analysera la situation et proposera une solution.
                  </li>
                  <li>
                    <strong>Mon compte peut-il être suspendu ?</strong><br />
                    Oui, en cas de fraude, non-respect des conditions générales ou comportement abusif.
                  </li>
                </ol>
              </li>
              <li>
                <strong>SUPPORT & CONTACT</strong><br />
                WENZE TII NDAKU, SARL<br />
                Email: wenzetiindaku@outlook.com<br />
                Téléphone: +32 495 84 68 66
              </li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Faq;
