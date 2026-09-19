import { useTranslation } from "react-i18next";
import { FileText, Shield, AlertTriangle, Users, DollarSign, CreditCard, Gavel, Scale, Ban, Building } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";


const TermsOfService = () => {
  const { t } = useTranslation();
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
                {t('pages.termsOfService.conditionsGeneralesWenzeTiiNdaku')}
              </h1>
              <div className="h-1 w-24 bg-blue-400 rounded-full mb-6"></div>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-blue-100 font-light">
              {t('pages.termsOfService.ceContratDeVendeurAccordEst')}
            </p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-12">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                {t('pages.termsOfService.derniReMiseJour2026')}
              </span>
            </div>
            <div className="prose prose-lg max-w-none text-foreground mx-auto">
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <strong>{t('pages.termsOfService.champDApplicationDeLAccord')}</strong><br />
                  {t('pages.termsOfService.cetAccordRGitLesConditions')}
                </li>
                <li>
                  <strong>{t('pages.termsOfService.obligationsDuVendeur')}</strong><br />
                  {t('pages.termsOfService.leVendeurSEngageExposerUniquement')}
                </li>
                <li>
                  <strong>{t('pages.termsOfService.produitsEtComportementsInterdits')}</strong><br />
                  {t('pages.termsOfService.toutProduitOuActivitLiE')}
                </li>
                <li>
                  <strong>{t('pages.termsOfService.dFautsDeProduitEtRemboursements')}</strong><br />
                  {t('pages.termsOfService.leVendeurAssumeLEntiRe')}
                </li>
                <li>
                  <strong>{t('pages.termsOfService.cotisationsAdhSionEtCommission')}</strong><br />
                  {t('pages.termsOfService.leVendeurAccepteDePayerUne')}
                </li>
                <li>
                  <strong>{t('pages.termsOfService.paiementsDesRevenus')}</strong><br />
                  {t('pages.termsOfService.lesRevenusDuVendeurDoiventTre')}
                </li>
                <li>
                  <strong>{t('pages.termsOfService.suspensionEtRSiliation')}</strong><br />
                  {t('pages.termsOfService.laPlateformeSeRServeLe')}
                </li>
                <li>
                  <strong>{t('pages.termsOfService.propriTIntellectuelle')}</strong><br />
                  {t('pages.termsOfService.leVendeurConserveLaPropriT')}
                </li>
                <li>
                  <strong>{t('pages.termsOfService.limitationDeResponsabilit')}</strong><br />
                  {t('pages.termsOfService.laPlateformeAgitUniquementEnTant')}
                </li>
                <li>
                  <strong>{t('pages.termsOfService.droitEtJurisdiction')}</strong><br />
                  {t('pages.termsOfService.lePrSentAccordEstR')}
                </li>
                <li>
                  <strong>{t('pages.termsOfService.limitationDAge')}</strong><br />
                  {t('pages.termsOfService.laPlateformeEstStrictementRServ')}<br />
                  {t('pages.termsOfService.touteInscriptionAccSOuUtilisation')}<br />
                  {t('pages.termsOfService.enCasDUtilisationDeLa')}<br />
                  {t('pages.termsOfService.laPlateformeSeRServeLe2')}
                  <ul className="list-disc pl-8 mt-2">
                    <li>{t('pages.termsOfService.deProcDerTouteVRification')}</li>
                    <li>{t('pages.termsOfService.dExigerLaFournitureDUne')}</li>
                    <li>{t('pages.termsOfService.deSuspendreOuSupprimerLeCompte')}</li>
                  </ul>
                  {t('pages.termsOfService.touteFausseDClarationRelativeL')}
                </li>
                <li>
                  <strong>{t('pages.termsOfService.acceptation')}</strong><br />
                  {t('pages.termsOfService.enSInscrivantSurLaPlateforme')}
                </li>
              </ol>
            </div>
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">
                {t('pages.termsOfService.uneQuestionSurNosConditions')}
              </p>
              <a
                href="mailto:wenzetiindaku@outlook.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm"
              >
                {t('pages.termsOfService.contacterLeSupportLGal')}
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