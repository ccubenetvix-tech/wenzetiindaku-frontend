import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Faq = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('pages.faq.foireAuxQuestionsFaq')}</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">{t('pages.faq.wenzeTiiNdakuWtn')}</p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto prose prose-lg text-foreground">
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>{t('pages.faq.questionsGNRales')}</strong>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    <strong>{t('pages.faq.quEstCeQueWenzeTii')}</strong><br />
                    {t('pages.faq.wenzeTiiNdakuWtnEstUne')}
                  </li>
                  <li>
                    <strong>{t('pages.faq.oOpReWtn')}</strong><br />
                    {t('pages.faq.wtnOpRePrincipalementEnR')}
                  </li>
                  <li>
                    <strong>{t('pages.faq.wtnVendIlDirectementLesProduits')}</strong><br />
                    {t('pages.faq.nonWtnEstUnePlateformeInterm')}
                  </li>
                </ol>
              </li>
              <li>
                <strong>{t('pages.faq.pourLesAcheteurs')}</strong>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    <strong>{t('pages.faq.commentCrErUnCompte')}</strong><br />
                    {t('pages.faq.n1CliquezSurSInscrire')}<br />
                    {t('pages.faq.n2EntrezVosInformationsNomEmail')}<br />
                    {t('pages.faq.n3ConfirmezVotreCompteAvecUn')}<br />
                    {t('pages.faq.n4CommencezAcheter')}
                  </li>
                  <li>
                    <strong>{t('pages.faq.commentPasserUneCommande')}</strong><br />
                    {t('pages.faq.n1ChoisissezVotreProduit')}<br />
                    {t('pages.faq.n2AjoutezAuPanier')}<br />
                    {t('pages.faq.n3ProcDezAuPaiement')}<br />
                    {t('pages.faq.n4ConfirmezLaCommande')}<br />
                    {t('pages.faq.vousRecevrezUneConfirmationParEmail')}
                  </li>
                  <li>
                    <strong>{t('pages.faq.quelsMoyensDePaiementSontAccept')}</strong><br />
                    {t('pages.faq.wtnAccepte')}<br />
                    {t('pages.faq.mobileMoney')}<br />
                    {t('pages.faq.carteBancaireViaPasserelleSCuris')}<br />
                    {t('pages.faq.paiementLaLivraisonPourCertainsArticles')}
                  </li>
                  <li>
                    <strong>{t('pages.faq.lePaiementEstIlSCuris')}</strong><br />
                    {t('pages.faq.ouiLesTransactionsSontProtG')}
                  </li>
                  <li>
                    <strong>{t('pages.faq.combienDeTempsPrendLaLivraison')}</strong><br />
                    {t('pages.faq.leDLaiDPendDu')}
                  </li>
                  <li>
                    <strong>{t('pages.faq.puisJeRetournerUnProduit')}</strong><br />
                    {t('pages.faq.ouiSiLeProduitEstEndommag')}
                  </li>
                </ol>
              </li>
              <li>
                <strong>{t('pages.faq.pourLesVendeurs')}</strong>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    <strong>{t('pages.faq.commentDevenirVendeurSurWtn')}</strong><br />
                    {t('pages.faq.n1CrErUnCompteVendeur')}<br />
                    {t('pages.faq.n2FournirLesDocumentsRequis')}<br />
                    {t('pages.faq.n3AttendreValidation')}<br />
                    {t('pages.faq.n4PublierVosProduits')}
                  </li>
                  <li>
                    <strong>{t('pages.faq.yATIlDesFrais')}</strong><br />
                    {t('pages.faq.wtnAppliqueDesFraisDUtilisation')}
                  </li>
                  <li>
                    <strong>{t('pages.faq.quandSuisJePay')}</strong><br />
                    {t('pages.faq.lesPaiementsSontLibRS')}
                  </li>
                  <li>
                    <strong>{t('pages.faq.quelsProduitsSontInterdits')}</strong><br />
                    {t('pages.faq.ilEstInterditDeVendreDes')}
                  </li>
                </ol>
              </li>
              <li>
                <strong>{t('pages.faq.sCuritConfiance')}</strong>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    <strong>{t('pages.faq.commentWtnProtGeMesDonn')}</strong><br />
                    {t('pages.faq.vosDonnEsPersonnellesSontProt')}
                  </li>
                  <li>
                    <strong>{t('pages.faq.queFaireEnCasDeProbl')}</strong><br />
                    {t('pages.faq.rendezVousDansMonCompteMes')}
                  </li>
                  <li>
                    <strong>{t('pages.faq.monComptePeutIlTreSuspendu')}</strong><br />
                    {t('pages.faq.ouiEnCasDeFraudeNon')}
                  </li>
                </ol>
              </li>
              <li>
                <strong>{t('pages.faq.supportContact')}</strong><br />
                {t('pages.faq.wenzeTiiNdakuSarl')}<br />
                {t('pages.faq.emailWenzetiindakuOutlookCom')}<br />
                {t('pages.faq.tLPhone3249584')}
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
