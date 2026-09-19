import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, Shield } from 'lucide-react';
import { useTranslation } from "react-i18next";

import { formatDate } from "@/lib/format";
const VendorTerms = () => {
  const { t } = useTranslation();
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('pages.vendorTerms.contratDeVendeur')}</h1>
              <p className="text-gray-600 dark:text-gray-400">{t('pages.vendorTerms.conditionsGNRalesPourLes')}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            {t('pages.vendorTerms.lastUpdatedValue', { value: formatDate(new Date()) })}
          </Badge>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>{t('pages.vendorTerms.contratDeVendeur')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 dark:text-gray-300">
                {t('pages.vendorTerms.ceContratDeVendeurAccordEst')}
              </p>

              <div className="space-y-4">
                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('pages.vendorTerms.n1ChampDApplicationDeL')}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{t('pages.vendorTerms.cetAccordRGitLesConditions')}</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('pages.vendorTerms.n2ObligationsDuVendeur')}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{t('pages.vendorTerms.leVendeurSEngageExposerUniquement')}</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('pages.vendorTerms.n3ProduitsEtComportementsInterdits')}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{t('pages.vendorTerms.toutProduitOuActivitLiE')}</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('pages.vendorTerms.n4DFautsDeProduitEt')}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{t('pages.vendorTerms.leVendeurAssumeLEntiRe')}</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('pages.vendorTerms.n5CotisationsAdhSionEtCommission')}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{t('pages.vendorTerms.leVendeurAccepteDePayerUne')}</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('pages.vendorTerms.n6PaiementsDesRevenus')}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{t('pages.vendorTerms.lesRevenusDuVendeurDoiventTre')}</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('pages.vendorTerms.n7SuspensionEtRSiliation')}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{t('pages.vendorTerms.laPlateformeSeRServeLe')}</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('pages.vendorTerms.n8PropriTIntellectuelle')}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{t('pages.vendorTerms.leVendeurConserveLaPropriT')}</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('pages.vendorTerms.n9LimitationDeResponsabilit')}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{t('pages.vendorTerms.laPlateformeAgitUniquementEnTant')}</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('pages.vendorTerms.n10DroitEtJurisdiction')}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{t('pages.vendorTerms.lePrSentAccordEstR')}</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('pages.vendorTerms.n11Acceptation')}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{t('pages.vendorTerms.enSInscrivantSurLaPlateforme')}</p>
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
