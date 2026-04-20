import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  RotateCcw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  Truck, 
  CreditCard,
  AlertTriangle,
  Info,
  Calendar,
  Shield
} from "lucide-react";


export default function Returns() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">POLITIQUE DE RETOUR ET DE REMBOURSEMENT</h1>
            <p className="text-xl mb-2 max-w-2xl mx-auto">WENZE TII NDAKU (WTN)</p>
            <p className="text-md">Dernière mise à jour : 25 février 2026</p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto prose prose-lg text-foreground">
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>PRÉAMBULE</strong><br />
                La présente Politique de Retour et de Remboursement régit les conditions applicables aux produits achetés sur la plateforme WENZE TII NDAKU (WTN).<br />
                WTN agit exclusivement en qualité de plateforme intermédiaire (marketplace) mettant en relation des vendeurs indépendants et des acheteurs. Les produits commercialisés sont proposés et expédiés par des vendeurs tiers enregistrés sur la plateforme.
              </li>
              <li>
                <strong>DÉLAI DE RÉCLAMATION</strong><br />
                Le client dispose d’un délai de sept (7) jours calendaires à compter de la date de réception du produit pour soumettre une demande de retour via son compte utilisateur.<br />
                Toute demande effectuée au-delà de ce délai pourra être refusée, sauf cas exceptionnel justifié.
              </li>
              <li>
                <strong>CONDITIONS D’ÉLIGIBILITÉ</strong><br />
                Un produit peut être retourné uniquement dans les cas suivants :<br />
                - Produit endommagé à la livraison<br />
                - Produit non conforme à la description publiée<br />
                - Défaut de fabrication avéré<br />
                - Erreur manifeste dans la commande<br />
                Le produit doit être non utilisé, dans son état d’origine, retourné avec son emballage d’origine et accompagné de la preuve d’achat.
              </li>
              <li>
                <strong>PRODUITS NON ÉLIGIBLES</strong><br />
                Sauf défaut avéré, les produits suivants ne peuvent être retournés :<br />
                - Produits cosmétiques ouverts ou utilisés<br />
                - Sous-vêtements et articles intimes<br />
                - Produits numériques téléchargeables<br />
                - Articles personnalisés ou sur mesure<br />
                - Produits alimentaires<br />
                - Articles en promotion ou liquidation
              </li>
              <li>
                <strong>PROCÉDURE DE RETOUR</strong><br />
                1. Envoyez un mail à wtn-customers@outlook.com<br />
                2. Le mail doit contenir le nom du client enregistré et pièce d’identité.<br />
                3. La copie de la confirmation de la commande.<br />
                4. Décrivez le motif du retour de façon claire et détaillée.<br />
                5. Joignez des photos justificatives si nécessaire.<br />
                La demande sera examinée par l’équipe WTN en collaboration avec le vendeur concerné.
              </li>
              <li>
                <strong>VALIDATION ET REMBOURSEMENT</strong><br />
                Après validation du retour :<br />
                - Le remboursement sera effectué via le mode de paiement initial lorsque possible.<br />
                - Le délai de remboursement peut varier entre 5 et 14 jours ouvrables.<br />
                Un remplacement, un avoir ou un remboursement partiel peut être proposé selon le cas.
              </li>
              <li>
                <strong>FRAIS DE RETOUR</strong><br />
                - À la charge du vendeur si le produit est défectueux ou incorrect.<br />
                - À la charge du client si le retour est motivé par un changement d’avis (si accepté).
              </li>
              <li>
                <strong>RESPONSABILITÉ</strong><br />
                WTN agit en qualité d’intermédiaire technique. La responsabilité concernant la qualité et la conformité des produits incombe au vendeur.<br />
                WTN se réserve le droit de suspendre un vendeur en cas d’abus répétés ou de refuser des demandes manifestement abusives.
              </li>
              <li>
                <strong>LITIGES</strong><br />
                En cas de désaccord, WTN mettra en œuvre une procédure de médiation interne.<br />
                À défaut d’accord, le litige pourra être soumis aux juridictions compétentes conformément aux lois applicables en République Démocratique du Congo.
              </li>
              <li>
                <strong>CONTACT</strong><br />
                WENZE TII NDAKU, SARL<br />
                Email: wenzetiindaku@outlook.com<br />
                Téléphone: +32 495 84 68 66
              </li>
              <li>
                <strong>MODIFICATION</strong><br />
                WTN se réserve le droit de modifier la présente politique à tout moment afin d’assurer la conformité légale et le bon fonctionnement de la plateforme.
              </li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
