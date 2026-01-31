import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, Shield } from 'lucide-react';

const VendorTerms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Store className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contrat de Vendeur</h1>
              <p className="text-gray-600 dark:text-gray-400">Conditions générales pour les vendeurs sur WENZE TII NDAKU</p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </Badge>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Contrat de Vendeur</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 dark:text-gray-300">
                Ce Contrat de Vendeur (« Accord ») est conclu entre WENZE TII NDAKU (la « Plateforme »)
                et le vendeur enregistré (« Vendeur »). En s'enregistrant et en opérant sur la Plateforme,
                le vendeur accepte d'être légalement lié par ce Contrat.
              </p>

              <div className="space-y-4">
                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">1. Champ d'application de l'accord.</h3>
                  <p className="text-gray-700 dark:text-gray-300">Cet accord régit les conditions sous lesquelles le vendeur est autorisé à inscrire et vendre des produits sur la plateforme WENZE TII NDAKU.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">2. Obligations du vendeur.</h3>
                  <p className="text-gray-700 dark:text-gray-300">Le vendeur s'engage à exposer uniquement des produits légaux, authentiques et de qualité, et à se conformer à toutes les lois et réglementations applicables.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">3. Produits et comportements interdits.</h3>
                  <p className="text-gray-700 dark:text-gray-300">Tout produit ou activité liée à la drogue, au crime, au terrorisme, à la pédophilie, à la traite des êtres humains, aux armes ou à d'autres activités illégales est strictement interdit et soumis à une résiliation immédiate et des poursuites.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">4. Défauts de produit et remboursements.</h3>
                  <p className="text-gray-700 dark:text-gray-300">Le vendeur assume l'entière responsabilité des produits défectueux, endommagés ou non conformes et s'engage à rembourser intégralement les acheteurs.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">5. Cotisations, adhésion et commission.</h3>
                  <p className="text-gray-700 dark:text-gray-300">Le vendeur accepte de payer une cotisation mensuelle de 10 USD et une commission de 10 % sur le volume total des ventes mensuelles réalisées sur la plateforme.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">6. Paiements des revenus.</h3>
                  <p className="text-gray-700 dark:text-gray-300">Les revenus du vendeur doivent être versés une fois à la fin de chaque mois civil, après déduction des frais et commissions applicables.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">7. Suspension et résiliation.</h3>
                  <p className="text-gray-700 dark:text-gray-300">La Plateforme se réserve le droit de suspendre ou de résilier immédiatement le compte vendeur en cas de comportement suspect ou inacceptable.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">8. Propriété intellectuelle.</h3>
                  <p className="text-gray-700 dark:text-gray-300">Le vendeur conserve la propriété du contenu produit mais accorde à la plateforme un droit non exclusif d'utiliser ce contenu.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">9. Limitation de responsabilité.</h3>
                  <p className="text-gray-700 dark:text-gray-300">La plateforme agit uniquement en tant que marché intermédiaire et n'est pas responsable des fautes commises par le vendeur.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">10. Droit et jurisdiction.</h3>
                  <p className="text-gray-700 dark:text-gray-300">Le présent Accord est régi par les lois commerciales applicables relevant de la compétence légale de la Plateforme.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">11. Acceptation.</h3>
                  <p className="text-gray-700 dark:text-gray-300">En s'inscrivant sur la Plateforme, le vendeur confirme l'acceptation complète de cet Accord</p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorTerms;
