import { Fragment, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Content lives in src/locales/<lang>.json under `legalDocs.<doc>`, generated from
// scripts/legal/<lang>/<doc>.md by `npm run legal:build`.
type Block = { p: string } | { ul: string[] } | { ol: string[] } | { note: string };

interface LegalContent {
  title: string;
  meta: string[];
  intro?: Block[];
  sections: { heading: string; blocks: Block[] }[];
  footer: string[];
}

export type LegalDoc = "terms" | "vendorTerms" | "privacy" | "returns" | "faq" | "cookies";

// Renders **bold** spans inside a line of text.
const inline = (text: string): ReactNode =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  );

const renderBlock = (block: Block, key: number) => {
  if ("ul" in block)
    return (
      <ul key={key} className="list-disc pl-6 space-y-1.5">
        {block.ul.map((item, i) => <li key={i}>{inline(item)}</li>)}
      </ul>
    );
  if ("ol" in block)
    return (
      <ol key={key} className="list-decimal pl-6 space-y-1.5">
        {block.ol.map((item, i) => <li key={i}>{inline(item)}</li>)}
      </ol>
    );
  if ("note" in block)
    return (
      <p key={key} className="border-l-4 border-primary/60 bg-primary/5 px-4 py-3 rounded-r">
        {inline(block.note)}
      </p>
    );
  return (
    <p key={key}>
      {block.p.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {inline(line)}
        </Fragment>
      ))}
    </p>
  );
};

export const LegalDocument = ({ doc, icon: Icon }: { doc: LegalDoc; icon: LucideIcon }) => {
  const { t } = useTranslation();
  const content = t(`legalDocs.${doc}`, { returnObjects: true }) as LegalContent;
  const [subtitle, ...meta] = content.meta;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      <main className="flex-1">
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-90"></div>
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <div className="flex flex-col items-center justify-center">
              <div className="p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                <Icon className="h-12 w-12 text-blue-200" />
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">{content.title}</h1>
              <div className="h-1 w-24 bg-blue-400 rounded-full mb-6"></div>
              <p className="text-lg md:text-xl text-blue-100 font-light">{subtitle}</p>
            </div>
          </div>
        </section>
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            {meta.length > 0 && (
              <div className="flex justify-center mb-10">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800 text-center">
                  {meta.join(" · ")}
                </span>
              </div>
            )}
            <div className="space-y-10 text-foreground leading-relaxed">
              {content.intro && <div className="space-y-4 text-lg">{content.intro.map(renderBlock)}</div>}
              {content.sections.map((section, i) => (
                <section key={i} className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white border-b border-border pb-2">
                    {section.heading}
                  </h2>
                  {section.blocks.map(renderBlock)}
                </section>
              ))}
            </div>
            <div className="mt-16 pt-6 border-t border-border text-center text-sm text-muted-foreground italic space-y-1">
              {content.footer.map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
