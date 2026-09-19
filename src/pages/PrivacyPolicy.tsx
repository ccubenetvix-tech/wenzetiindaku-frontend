import { useTranslation } from "react-i18next";
import { Shield, FileText, Lock, Eye, UserCheck, AlertTriangle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";


const PrivacyPolicy = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">{t('pages.privacyPolicy.politiqueDeConfidentialit')}</h1>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
              {t('pages.privacyPolicy.wenzeTiiNdakuWtnRPublique')}
            </p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-muted p-4 rounded-lg mb-8">
              <p className="text-sm text-muted-foreground">
                <strong>{t('pages.privacyPolicy.derniReMiseJour')}</strong> {t('pages.privacyPolicy.n10FVrier2026')}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>{t('pages.privacyPolicy.responsableDuTraitement')}</strong> {t('pages.privacyPolicy.wenzeTiiNdakuSarl')}<br />
                <strong>{t('pages.privacyPolicy.email')}</strong> wenzetiindaku@outlook.com<br />
                <strong>{t('pages.privacyPolicy.tLPhone')}</strong> +32 495 84 68 66
              </p>
            </div>
            <div className="prose prose-lg max-w-none text-foreground mx-auto">
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <strong>{t('pages.privacyPolicy.champDApplication')}</strong><br />
                  {t('pages.privacyPolicy.laPrSentePolitiqueSApplique')}
                </li>
                <li>
                  <strong>{t('pages.privacyPolicy.donnEsCollectEs')}</strong><br />
                  {t('pages.privacyPolicy.donnEsDIdentificationNomPr')}<br />
                  {t('pages.privacyPolicy.donnEsVendeursPiCeD')}<br />
                  {t('pages.privacyPolicy.donnEsTransactionnellesCommandesPaiementsCommissions')}<br />
                  {t('pages.privacyPolicy.donnEsTechniquesIpAppareilNavigation')}
                </li>
                <li>
                  <strong>{t('pages.privacyPolicy.finalitS')}</strong><br />
                  {t('pages.privacyPolicy.gestionDesComptesTraitementDesCommandes')}
                </li>
                <li>
                  <strong>{t('pages.privacyPolicy.baseLGale')}</strong><br />
                  {t('pages.privacyPolicy.exCutionContractuelleConsentementIntR')}
                </li>
                <li>
                  <strong>{t('pages.privacyPolicy.partageDesDonnEs')}</strong><br />
                  {t('pages.privacyPolicy.prestatairesDePaiement')}<br />
                  {t('pages.privacyPolicy.partenairesLogistiques')}<br />
                  {t('pages.privacyPolicy.prestatairestechniques')}<br />
                  {t('pages.privacyPolicy.autoritSlGalesSiRequis')}<br />
                  {t('pages.privacyPolicy.aucuneVenteDeDonnEsPersonnelles')}
                </li>
                <li>
                  <strong>{t('pages.privacyPolicy.transfertsInternationaux')}</strong><br />
                  {t('pages.privacyPolicy.desDonnEsPeuventTreH')}
                </li>
                <li>
                  <strong>{t('pages.privacyPolicy.sCurit')}</strong><br />
                  {t('pages.privacyPolicy.mesurestechniquesEtOrganisationnellesincluantContrLeD')}
                </li>
                <li>
                  <strong>{t('pages.privacyPolicy.conservation')}</strong><br />
                  {t('pages.privacyPolicy.donnEsConservEsSelonDur')}
                </li>
                <li>
                  <strong>{t('pages.privacyPolicy.droitsDesUtilisateurs')}</strong><br />
                  {t('pages.privacyPolicy.accSRectificationEffacementLimitationOpposition')}<br />
                  {t('pages.privacyPolicy.contactWtnCustomersOutlookCom')}
                </li>
                <li>
                  <strong>{t('pages.privacyPolicy.cookies')}</strong><br />
                  {t('pages.privacyPolicy.utilisationPourAnalyseSCuritEt')}
                </li>
                <li>
                  <strong>{t('pages.privacyPolicy.donnEsDesMineurs')}</strong><br />
                  {t('pages.privacyPolicy.nonDestinAuxMoinsDe18')}
                </li>
                <li>
                  <strong>{t('pages.privacyPolicy.responsabilitMarketplace')}</strong><br />
                  {t('pages.privacyPolicy.laPlateformeAgitCommeIntermDiaire')}
                </li>
                <li>
                  <strong>{t('pages.privacyPolicy.modifications')}</strong><br />
                  {t('pages.privacyPolicy.laPolitiquePeutTreModifiE')}
                </li>
                <li>
                  <strong>{t('pages.privacyPolicy.acceptation')}</strong><br />
                  {t('pages.privacyPolicy.lUtilisationDeLaPlateformeImplique')}
                </li>
                <li>
                  <strong>{t('pages.privacyPolicy.contactOfficiel')}</strong><br />
                  {t('pages.privacyPolicy.wenzeTiiNdakuSarl')}<br />
                  {t('pages.privacyPolicy.emailWenzetiindakuOutlookCom')}<br />
                  {t('pages.privacyPolicy.tLPhone3249584')}
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