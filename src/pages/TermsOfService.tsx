import { useTranslation } from "react-i18next";
import { FileText, Shield, AlertTriangle, Users, DollarSign, CreditCard, Gavel, Scale, Ban, Building } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";


const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      <main className="flex-1">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                <Gavel className="h-12 w-12 text-blue-200" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                CONDITIONS GENERALES – WENZE TII NDAKU
              </h1>
              <div className="h-1 w-24 bg-blue-400 rounded-full mb-6"></div>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-blue-100 font-light">
              Ce Contrat de Vendeur (« Accord ») est conclu entre WENZE TII NDAKU (la « Plateforme ») et le vendeur enregistré (« Vendeur »). En s'enregistrant et en opérant sur la Plateforme, le vendeur accepte d'être légalement lié par ce Contrat.
            </p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-12">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                Dernière mise à jour : 2026
              </span>
            </div>
            <div className="prose prose-lg max-w-none text-foreground mx-auto">
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <strong>Champ d'application de l'accord.</strong><br />
                  Cet accord régit les conditions sous lesquelles le vendeur est autorisé à inscrire et vendre des produits sur la plateforme WENZE TII NDAKU.
                </li>
                <li>
                  <strong>Obligations du vendeur.</strong><br />
                  Le vendeur s'engage à exposer uniquement des produits légaux, authentiques et de qualité, et à se conformer à toutes les lois et réglementations applicables.
                </li>
                <li>
                  <strong>Produits et comportements interdits.</strong><br />
                  Tout produit ou activité liée à la drogue, au crime, au terrorisme, à la pédophilie, à la traite des êtres humains, aux armes ou à d'autres activités illégales est strictement interdit et soumis à une résiliation immédiate, un signalement aux autorités et des poursuites.
                </li>
                <li>
                  <strong>Défauts de produit et remboursements.</strong><br />
                  Le vendeur assume l'entière responsabilité des produits défectueux, endommagés ou non conformes et s'engage à rembourser intégralement les acheteurs.
                </li>
                <li>
                  <strong>Cotisations, adhésion et commission.</strong><br />
                  Le vendeur accepte de payer une cotisation mensuelle de 10 USD et une commission de 10 % sur le volume total des ventes mensuelles réalisées sur la plateforme.
                </li>
                <li>
                  <strong>Paiements des revenus.</strong><br />
                  Les revenus du vendeur doivent être versés une fois à la fin de chaque mois civil, après déduction des frais et commissions applicables.
                </li>
                <li>
                  <strong>Suspension et résiliation.</strong><br />
                  La Plateforme se réserve le droit de suspendre ou de résilier immédiatement le compte vendeur en cas de comportement suspect ou inacceptable.
                </li>
                <li>
                  <strong>Propriété intellectuelle.</strong><br />
                  Le vendeur conserve la propriété du contenu produit mais accorde à la plateforme un droit non exclusif d'utiliser ce contenu.
                </li>
                <li>
                  <strong>Limitation de responsabilité.</strong><br />
                  La plateforme agit uniquement en tant que marché intermédiaire et n'est pas responsable des fautes commises par le vendeur.
                </li>
                <li>
                  <strong>Droit et jurisdiction.</strong><br />
                  Le présent Accord est régi par les lois commerciales applicables relevant de la compétence légale de la Plateforme.
                </li>
                <li>
                  <strong>Limitation d’age.</strong><br />
                  La plateforme est strictement réservée aux personnes âgées de dix-huit (18) ans révolus au minimum.<br />
                  Toute inscription, accès ou utilisation par une personne mineure est formellement interdite.<br />
                  En cas d’utilisation de la plateforme par un mineur, la responsabilité incombe exclusivement aux parents, tuteurs légaux ou responsables du mineur concerné.<br />
                  La plateforme se réserve le droit :
                  <ul className="list-disc pl-8 mt-2">
                    <li>De procéder à toute vérification nécessaire en cas de doute ou de suspicion quant à l’âge réel d’un utilisateur ;</li>
                    <li>D’exiger la fourniture d’une pièce d’identité officielle valide afin de confirmer l’âge déclaré ;</li>
                    <li>De suspendre ou supprimer le compte de tout utilisateur ne respectant pas cette condition ou refusant de coopérer dans le cadre des vérifications.</li>
                  </ul>
                  Toute fausse déclaration relative à l’âge constitue une violation des conditions générales d’utilisation et peut entraîner des sanctions appropriées
                </li>
                <li>
                  <strong>Acceptation.</strong><br />
                  En s'inscrivant sur la Plateforme, le vendeur confirme l'acceptation complète de cet Accord.
                </li>
              </ol>
            </div>
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">
                Une question sur nos conditions ?
              </p>
              <a
                href="mailto:wenzetiindaku@outlook.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm"
              >
                Contacter le support légal
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;