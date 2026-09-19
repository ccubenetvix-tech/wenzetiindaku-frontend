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
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('pages.returns.politiqueDeRetourEtDeRemboursement')}</h1>
            <p className="text-xl mb-2 max-w-2xl mx-auto">{t('pages.returns.wenzeTiiNdakuWtn')}</p>
            <p className="text-md">{t('pages.returns.derniReMiseJour25F')}</p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto prose prose-lg text-foreground">
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>{t('pages.returns.prAmbule')}</strong><br />
                {t('pages.returns.laPrSentePolitiqueDeRetour')}<br />
                {t('pages.returns.wtnAgitExclusivementEnQualitDe')}
              </li>
              <li>
                <strong>{t('pages.returns.dLaiDeRClamation')}</strong><br />
                {t('pages.returns.leClientDisposeDUnD')}<br />
                {t('pages.returns.touteDemandeEffectuEAuDel')}
              </li>
              <li>
                <strong>{t('pages.returns.conditionsDLigibilit')}</strong><br />
                {t('pages.returns.unProduitPeutTreRetournUniquement')}<br />
                {t('pages.returns.produitEndommagLaLivraison')}<br />
                {t('pages.returns.produitNonConformeLaDescriptionPubli')}<br />
                {t('pages.returns.dFautDeFabricationAvR')}<br />
                {t('pages.returns.erreurManifesteDansLaCommande')}<br />
                {t('pages.returns.leProduitDoitTreNonUtilis')}
              </li>
              <li>
                <strong>{t('pages.returns.produitsNonLigibles')}</strong><br />
                {t('pages.returns.saufDFautAvRLes')}<br />
                {t('pages.returns.produitsCosmTiquesOuvertsOuUtilis')}<br />
                {t('pages.returns.sousVTementsEtArticlesIntimes')}<br />
                {t('pages.returns.produitsNumRiquesTLChargeables')}<br />
                {t('pages.returns.articlesPersonnalisSOuSurMesure')}<br />
                {t('pages.returns.produitsAlimentaires')}<br />
                {t('pages.returns.articlesEnPromotionOuLiquidation')}
              </li>
              <li>
                <strong>{t('pages.returns.procDureDeRetour')}</strong><br />
                {t('pages.returns.n1EnvoyezUnMailWtnCustomers')}<br />
                {t('pages.returns.n2LeMailDoitContenirLe')}<br />
                {t('pages.returns.n3LaCopieDeLaConfirmation')}<br />
                {t('pages.returns.n4DCrivezLeMotifDu')}<br />
                {t('pages.returns.n5JoignezDesPhotosJustificativesSi')}<br />
                {t('pages.returns.laDemandeSeraExaminEPar')}
              </li>
              <li>
                <strong>{t('pages.returns.validationEtRemboursement')}</strong><br />
                {t('pages.returns.aprSValidationDuRetour')}<br />
                {t('pages.returns.leRemboursementSeraEffectuViaLe')}<br />
                {t('pages.returns.leDLaiDeRemboursementPeut')}<br />
                {t('pages.returns.unRemplacementUnAvoirOuUn')}
              </li>
              <li>
                <strong>{t('pages.returns.fraisDeRetour')}</strong><br />
                {t('pages.returns.laChargeDuVendeurSiLe')}<br />
                {t('pages.returns.laChargeDuClientSiLe')}
              </li>
              <li>
                <strong>{t('pages.returns.responsabilit')}</strong><br />
                {t('pages.returns.wtnAgitEnQualitDInterm')}<br />
                {t('pages.returns.wtnSeRServeLeDroit')}
              </li>
              <li>
                <strong>{t('pages.returns.litiges')}</strong><br />
                {t('pages.returns.enCasDeDSaccordWtn')}<br />
                {t('pages.returns.dFautDAccordLeLitige')}
              </li>
              <li>
                <strong>{t('pages.returns.contact')}</strong><br />
                {t('pages.returns.wenzeTiiNdakuSarl')}<br />
                {t('pages.returns.emailWenzetiindakuOutlookCom')}<br />
                {t('pages.returns.tLPhone3249584')}
              </li>
              <li>
                <strong>{t('pages.returns.modification')}</strong><br />
                {t('pages.returns.wtnSeRServeLeDroit2')}
              </li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
