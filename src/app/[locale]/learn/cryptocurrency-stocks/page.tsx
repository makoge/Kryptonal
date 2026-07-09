import { Metadata } from "next";
import Head from "next/head";
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary as getGlobalDictionary } from "@/lib/getDictionary";
import Link from "next/link";

// ==========================================
// 1. LOCAL DICTIONARY FALLBACK & TYPES
// ==========================================
async function getDictionary(locale: string) {
  const dictionaries: Record<string, any> = {
    en: {
      title: "Cryptocurrency Stocks: Investing in the Crypto Stock Market",
      intro:
        "Bridging the gap between traditional equities and digital assets. Discover how crypto stocks, blockchain technology stocks, and public market vehicles allow you to gain exposure to the crypto asset class safely.",
      ctaStart: "Explore Market Tools",
      ctaPrices: "View Crypto Prices",
      whatIsTitle: "Stocks and Crypto: Understanding the Convergence",
      whatIsBody:
        "The intersection of stocks crypto has birthed a brand new sector: the crypto stock market. For investors who want exposure to digital asset price movements without managing private keys or Web3 wallets, investing in cryptocurrency stocks offers a regulated alternative. These financial instruments trade on traditional exchanges like the NASDAQ and NYSE, tracking both operational corporate success and underlying digital asset performance.",
      truthTitle: "The Truth About Binance Stock and FTX Stock",
      truthBody:
        "A common misconception in the cryptocurrency stock market is the availability of certain corporate equities. Many traders search for binance stock price or ftx stock updates. To be accurate, Binance remains a privately held company and has never issued public shares. FTX, on the other hand, collapsed entirely in 2022, meaning any legacy tokenized equities are non-existent. Instead of searching for non-existent equities, investors look toward regulated public vehicles like Coinbase ($COIN) or MicroStrategy ($MSTR).",
      benefitsTitle: "Why Look at Blockchain Technology Stocks?",
      mistakesTitle: "Risks of the Cryptocurrency Stock Market",
      summaryTitle: "Market Summary",
      summaryBody:
        "Navigating cryptocurrency stocks requires an understanding of how traditional equities correlate with highly volatile digital asset benchmarks. Diversifying into infrastructure companies and mining firms is an excellent way to capture macro industry upside.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          question: "Can I buy Binance stock on regular brokerages?",
          answer:
            "No. There is no official Binance stock available on any public exchange as the company is private.",
        },
        {
          question: "What dictates a crypto stock price?",
          answer:
            "A crypto stock price is influenced by both traditional equity metrics (earnings reports, management) and the real-time spot prices of major cryptocurrencies like Bitcoin.",
        },
        {
          question: "Is it safer to buy stocks or crypto directly?",
          answer:
            "Stocks offer strict regulatory frameworks and standard investor protections. Direct crypto investments give you pure asset ownership but require personal custody responsibility.",
        },
      ],
      ctaSectionTitle: "Master Both Equity and Asset Performance",
      ctaSectionDesc:
        "Compare traditional market trends with real-time digital asset valuations. Track accurate metrics across the entire ecosystem with Kryptonal.",
    },
    tr: {
      title: "Kripto Para Hisseleri: Kripto Hisse Senedi Piyasası Rehberi",
      intro:
        "Geleneksel hisse senetleri ile dijital varlıklar arasındaki köprüyü kurun. Kripto hisseleri, blokzincir teknolojisi hisseleri ve halka açık yatırım araçlarını keşfedin.",
      ctaStart: "Araçları Keşfet",
      ctaPrices: "Kripto Fiyatlarını Gör",
      whatIsTitle: "Hisseler ve Kripto: Yakınlaşmayı Anlamak",
      whatIsBody:
        "Hisse senetleri ve kripto dünyasının kesişimi, yepyeni bir sektör doğurdu: kripto hisse senedi piyasası. Doğrudan dijital varlık tutmak istemeyen yatırımcılar için kripto para hisseleri düzenlenmiş bir alternatif sunar.",
      truthTitle: "Binance Hissesi ve FTX Hissesi Hakkındaki Gerçekler",
      truthBody:
        "Kripto para borsası hisseleriyle ilgili yaygın bir yanlış anlaşılma mevcuttur. Birçok yatırımcı binance hissesi veya ftx hisse senedi aramaktadır. Gerçek şu ki, Binance özel bir şirkettir ve hisseleri borsada işlem görmez. FTX ise 2022'de tamamen çökmüştür.",
      benefitsTitle: "Neden Blokzincir Teknolojisi Hisselerine Bakmalısınız?",
      mistakesTitle: "Kripto Hisse Senedi Piyasasının Riskleri",
      summaryTitle: "Piyasa Özeti",
      summaryBody:
        "Kripto para hisselerinde gezinmek, geleneksel hisse senetlerinin yüksek volatiliteye sahip dijital varlıklarla nasıl korelasyon kurduğunu anlamayı gerektirir.",
      faqTitle: "Sıkça Sorulan Sorular",
      faqs: [
        {
          question: "Binance hissesi satın alabilir miyim?",
          answer:
            "Hayır. Binance özel bir şirket olduğundan halka açık bir hissesi yoktur.",
        },
        {
          question: "Kripto hisse fiyatlarını ne belirler?",
          answer:
            "Kripto hisse senedi fiyatı, hem şirketin kazanç raporlarından hem de Bitcoin gibi varlıkların canlı fiyatından etkilenir.",
        },
        {
          question:
            "Hisse senedi mi yoksa doğrudan kripto mu almak daha güvenli?",
          answer:
            "Hisse senetleri yasal koruma sunar. Doğrudan kripto ise varlık üzerinde tam kontrol sağlar ancak cüzdan güvenliği sorumluluğu size aittir.",
        },
      ],
      ctaSectionTitle: "Hisse ve Varlık Performansına Hakim Olun",
      ctaSectionDesc:
        "Geleneksel piyasa trendlerini gerçek zamanlı dijital varlık değerlemeleriyle karşılaştırın. Tüm ekosistemi Kryptonal ile takip edin.",
    },
    pt: {
      title: "Ações de Criptomoedas: Investindo no Mercado de Ações Cripto",
      intro:
        "Explore a ponte entre ações tradicionais e ativos digitais. Descubra como ações de cripto e ações de tecnologia blockchain permitem exposição ao ecossistema de forma regulada.",
      ctaStart: "Explorar Ferramentas",
      ctaPrices: "Ver Preços de Cripto",
      whatIsTitle: "Ações e Cripto: Entendendo a Convergência",
      whatIsBody:
        "A interseção entre ações e cripto deu origem a um novo setor: o mercado de ações cripto. Para investidores que desejam exposição sem gerenciar chaves privadas, as ações de criptomoedas oferecem uma alternativa.",
      truthTitle: "A Verdade sobre as Ações da Binance e FTX",
      truthBody:
        "Muitos traders buscam pelo preço das ações da binance ou atualizações da ftx. Para ser preciso, a Binance continua sendo uma empresa privada e nunca emitiu ações públicas. A FTX faliu completamente em 2022.",
      benefitsTitle: "Por Que Olhar para Ações de Tecnologia Blockchain?",
      mistakesTitle: "Riscos do Mercado de Ações de Criptomoedas",
      summaryTitle: "Resumo do Mercado",
      summaryBody:
        "Investir em ações de criptomoedas exige entender como as ações tradicionais se correlacionam com os benchmarks altamente voláteis dos ativos digitais.",
      faqTitle: "Perguntas Frequentes",
      faqs: [
        {
          question: "Posso comprar ações da Binance?",
          answer:
            "Não. A Binance é uma empresa privada e não possui ações listadas em bolsas públicas.",
        },
        {
          question: "O que dita o preço de uma ação cripto?",
          answer:
            "O preço é influenciado pelas métricas corporativas tradicionais e pelo preço spot do Bitcoin.",
        },
        {
          question: "É mais seguro comprar ações ou cripto direto?",
          answer:
            "As ações oferecem proteção regulatória padrão. Cripto direto exige responsabilidade de custódia pessoal.",
        },
      ],
      ctaSectionTitle: "Domine o Desempenho de Ações e Ativos",
      ctaSectionDesc:
        "Compare tendências de mercados tradicionais com valuations digitais em tempo real usando a Kryptonal.",
    },
    es: {
      title: "Acciones de Criptomonedas: El Mercado de Acciones Cripto",
      intro:
        "Conecta el mercado de valores tradicional con los activos digitales. Descubre cómo las acciones de criptomonedas y de tecnología blockchain ofrecen exposición regulada.",
      ctaStart: "Explorar Herramientas",
      ctaPrices: "Ver Precios Cripto",
      whatIsTitle: "Acciones y Cripto: Entendiendo la Convergencia",
      whatIsBody:
        "La intersección de las acciones y el cripto ha dado origen al mercado de acciones cripto. Estas acciones de criptomonedas cotizan en bolsas tradicionales como NASDAQ, siguiendo el rendimiento corporativo y de los activos cripto.",
      truthTitle: "La Realidad sobre las Acciones de Binance y FTX",
      truthBody:
        "Existe una confusión común sobre las acciones de binance o de ftx. Para ser exactos, Binance es una empresa privada y no cotiza en bolsa. Por su parte, FTX colapsó por completo en 2022.",
      benefitsTitle: "¿Por Qué Buscar Acciones de Tecnología Blockchain?",
      mistakesTitle: "Riesgos del Mercado de Acciones de Criptomonedas",
      summaryTitle: "Resumen del Mercado",
      summaryBody:
        "Navegar por las acciones de criptomonedas requiere comprender cómo las acciones tradicionales se correlacionan con la volatilidad de los activos digitales subyacentes.",
      faqTitle: "Preguntas Frecuentes",
      faqs: [
        {
          question: "¿Puedo comprar acciones de Binance?",
          answer:
            "No. Binance es una empresa privada y no tiene acciones públicas en ningún mercado.",
        },
        {
          question: "¿Qué determina el precio de una acción cripto?",
          answer:
            "Se determina por el rendimiento financiero de la empresa y la cotización en tiempo real de Bitcoin.",
        },
        {
          question: "¿Es más seguro invertir en acciones o en cripto directo?",
          answer:
            "Las acciones cuentan con un marco regulatorio estricto. El cripto directo te da propiedad absoluta pero requiere custodia propia.",
        },
      ],
      ctaSectionTitle: "Domina el Rendimiento de Acciones y Activos",
      ctaSectionDesc:
        "Compara las tendencias tradicionales con las valoraciones digitales en tiempo real a través de Kryptonal.",
    },
    fr: {
      title: "Actions Crypto : Investir dans le Marché Boursier Cripto",
      intro:
        "Faites le pont entre les actions traditionnelles et les actifs numériques. Découvrez comment les actions de crypto-monnaies et de technologie blockchain s'intègrent en bourse.",
      ctaStart: "Explorer les Outils",
      ctaPrices: "Voir les Prix Crypto",
      whatIsTitle: "Actions et Crypto : Comprendre la Convergence",
      whatIsBody:
        "L'intersection des actions et de la crypto a donné naissance au marché boursier crypto. Pour les investisseurs qui recherchent une exposition réglementée, les actions crypto représentent une excellente alternative.",
      truthTitle: "La Vérité sur les Actions Binance et FTX",
      truthBody:
        "Beaucoup d'investisseurs recherchent l'action binance ou ftx en bourse. En réalité, Binance est une société privée non cotée. FTX, quant à elle, a totalement fait faillite en 2022.",
      benefitsTitle:
        "Pourquoi S'intéresser aux Actions de Technologie Blockchain ?",
      mistakesTitle: "Risques du Marché Boursier Crypto",
      summaryTitle: "Résumé du Marché",
      summaryBody:
        "Investir dans des actions crypto nécessite de comprendre la corrélation entre les actions d'entreprises traditionnelles et les actifs numériques sous-jacents.",
      faqTitle: "Questions Fréquentes",
      faqs: [
        {
          question: "Puis-je acheter des actions Binance ?",
          answer:
            "Non. L'action Binance n'existe pas sur les marchés publics car l'entreprise est privée.",
        },
        {
          question: "Qu'est-ce qui détermine le prix d'une action crypto ?",
          answer:
            "Son cours dépend de la santé financière de l'entreprise et des fluctuations du cours du Bitcoin.",
        },
        {
          question:
            "Est-il plus sûr d'acheter des actions ou de la crypto en direct ?",
          answer:
            "Les actions offrent un cadre réglementé protecteur. La crypto en direct vous donne la pleine propriété mais exige une sécurité personnelle.",
        },
      ],
      ctaSectionTitle: "Maîtrisez les Performances des Actions et des Actifs",
      ctaSectionDesc:
        "Comparez les tendances des marchés traditionnels avec les valorisations crypto en temps réel sur Kryptonal.",
    },
    de: {
      title: "Krypto-Aktien: Investieren in den Krypto-Aktienmarkt",
      intro:
        "Schlagen Sie die Brücke zwischen traditionellen Aktien und digitalen Vermögenswerten. Erfahren Sie, wie Krypto-Aktien und Blockchain-Technologie-Aktien funktionieren.",
      ctaStart: "Tools erkunden",
      ctaPrices: "Krypto-Preise anzeigen",
      whatIsTitle: "Aktien und Krypto: Die Konvergenz verstehen",
      whatIsBody:
        "Die Überschneidung von Aktien und Krypto hat einen neuen Sektor geschaffen: den Krypto-Aktienmarkt. Krypto-Aktien bieten eine regulierte Alternative für Anleger.",
      truthTitle: "Die Wahrheit über Binance-Aktien und FTX-Aktien",
      truthBody:
        "Es gibt oft Missverständnisse bezüglich der Verfügbarkeit von Binance-Aktien oder FTX-Aktien. Binance ist ein privates Unternehmen und nicht an der Börse gelistet. FTX ist 2022 vollständig kollabiert.",
      benefitsTitle: "Warum in Blockchain-Technologie-Aktien investieren?",
      mistakesTitle: "Risiken des Krypto-Aktienmarktes",
      summaryTitle: "Marktzusammenfassung",
      summaryBody:
        "Das Investieren in Krypto-Aktien erfordert ein tiefes Verständnis der Korrelation zwischen traditionellen Unternehmenswerten und volatilen Kryptomärkten.",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Kann ich Binance-Aktien kaufen?",
          answer:
            "Nein. Binance ist ein privates Unternehmen und bietet keine öffentlich handelbaren Aktien an.",
        },
        {
          question: "Was bestimmt den Kurs einer Krypto-Aktie?",
          answer:
            "Der Kurs wird von den Finanzberichten des Unternehmens und dem Live-Bitcoin-Preis beeinflusst.",
        },
        {
          question: "Sind Aktien oder direkte Krypto-Käufe sicherer?",
          answer:
            "Aktien bieten einen strengen regulatorischen Rahmen. Direkte Krypto-Käufe bieten echten Besitz, erfordern jedoch Eigenverantwortung bei der Verwahrung.",
        },
      ],
      ctaSectionTitle: "Meistern Sie die Performance von Aktien und Krypto",
      ctaSectionDesc:
        "Vergleichen Sie traditionelle Markttrends mit digitalen Echtzeit-Bewertungen auf Kryptonal.",
    },
  };

  return dictionaries[locale] || dictionaries.en;
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

// ==========================================
// 2. ASYNCHRONOUS METADATA ENGINE
// ==========================================
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getDictionary(locale);

  return {
    title: `${t.title} | Kryptonal`,
    description: t.intro.substring(0, 155),
    alternates: {
      canonical: `https://www.kryptonal.com/${locale}/learn/cryptocurrency-stocks`,
      languages: {
        en: "https://www.kryptonal.com/en/learn/cryptocurrency-stocks",
        tr: "https://www.kryptonal.com/tr/learn/cryptocurrency-stocks",
        pt: "https://www.kryptonal.com/pt/learn/cryptocurrency-stocks",
        es: "https://www.kryptonal.com/es/learn/cryptocurrency-stocks",
        fr: "https://www.kryptonal.com/fr/learn/cryptocurrency-stocks",
        de: "https://www.kryptonal.com/de/learn/cryptocurrency-stocks",
      },
    },
    openGraph: {
      title: t.title,
      description: t.intro.substring(0, 150),
      url: `https://www.kryptonal.com/${locale}/learn/cryptocurrency-stocks`,
      siteName: "Kryptonal",
      locale: locale === "en" ? "en_US" : locale,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.intro.substring(0, 150),
    },
  };
}

// ==========================================
// 3. ASYNCHRONOUS MAIN PAGE COMPONENT
// ==========================================
export default async function CryptocurrencyStocksPage({ params }: PageProps) {
  const { locale } = await params;

  // Fetch BOTH dictionaries
  const t = await getDictionary(locale);
  const globalT = await getGlobalDictionary(locale);

  // Structural JSON-LD for rich snippets
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: t.title,
        description: t.intro.substring(0, 155),
        author: { "@type": "Organization", name: "Kryptonal" },
        inLanguage: locale,
      },
      {
        "@type": "FAQPage",
        mainEntity: t.faqs.map((f: any) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <>
      <Header locale={locale} t={globalT} />

      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <main className="w-full min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal-500/10 text-teal-400 mb-6 border border-teal-500/20">
              📊 Equities & Digital Correlative Assets
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              {t.title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
              {t.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/tools"
                className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-xl transition-all duration-200 text-center transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-teal-500/20 no-underline"
              >
                {t.ctaStart}
              </Link>
              <Link
                href="https://kryptonal.com/en/crypto-prices"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl transition-all duration-200 text-center transform hover:-translate-y-0.5 active:translate-y-0 no-underline"
              >
                {t.ctaPrices}
              </Link>
            </div>
          </div>
        </section>

        {/* ARTICLE CONTENT SECTION */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <article className="prose prose-invert prose-teal max-w-none space-y-12">
            {/* Stocks and Crypto Section */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-2">
                {t.whatIsTitle}
              </h2>
              <p className="text-slate-400 leading-relaxed text-base sm:text-lg">
                {t.whatIsBody}
              </p>
            </div>

            {/* Crucial Accuracy Correction Section (EEAT Verification) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-teal-400 m-0">
                {t.truthTitle}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed m-0">
                {t.truthBody}
              </p>
            </div>

            {/* Structural Market Sectors Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-2">
                Sectors Within the Crypto Stock Market
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Asset Brokering & Exchanges
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Companies that facilitate buying, selling, and custody
                    tracking of tokens under strictly monitored legal
                    landscapes.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Corporate Asset Treasuries
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Public corporations utilizing their balances to hoard spot
                    Bitcoin as a macro reserve strategy metric instrument.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Industrial Mining Entities
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Public computational facilities running massive computing
                    architecture rigs to secure layer-1 proof-of-work protocols.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Infrastructure Protocols
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Enterprise companies engineering foundational chips, node
                    servers, or hardware systems used universally across Web3
                    ecosystems.
                  </p>
                </div>
              </div>
            </div>

            {/* LIVE MARKET PRICE ACTION NAVIGATION CALLOUT */}
            <div className="my-10 p-8 rounded-2xl bg-gradient-to-r from-teal-900/40 to-slate-900 border border-teal-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <svg
                  width="100"
                  height="100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-3 mt-0">
                  {t.pricesLinkTitle}
                </h3>
                <p className="text-slate-300 mb-6 max-w-2xl">
                  {t.pricesLinkBody}
                </p>
                <Link
                  href="https://kryptonal.com/en/crypto-prices"
                  className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold transition-colors group no-underline"
                >
                  {t.ctaPrices}
                  <span className="transform transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Strategic Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="text-xl font-semibold text-white mb-3 mt-0">
                  ✅ {t.benefitsTitle}
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm list-disc pl-4">
                  <li>Regulated asset protection tracking structures.</li>
                  <li>
                    Eliminates seed phrase and self-custody operational risks.
                  </li>
                  <li>
                    Eligible for integration into traditional retirement
                    accounts.
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="text-xl font-semibold text-white mb-3 mt-0">
                  ⚠️ {t.mistakesTitle}
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm list-disc pl-4">
                  <li>
                    High operational exposure to underlying digital currency
                    volatility.
                  </li>
                  <li>
                    Traditional market closures (cannot trade over weekend
                    fluctuations).
                  </li>
                  <li>
                    Premium and discount gaps relative to spot net asset values.
                  </li>
                </ul>
              </div>
            </div>

            {/* Highlighted Summary Area */}
            <div className="p-5 rounded-xl border-l-4 border-teal-500 bg-teal-950/20 text-slate-300">
              <h3 className="text-lg font-semibold text-white mb-1 mt-0">
                {t.summaryTitle}
              </h3>
              <p className="text-sm leading-relaxed mb-0">{t.summaryBody}</p>
            </div>
          </article>
        </section>

        {/* FAQs AREA */}
        <section className="bg-slate-900/40 border-t border-b border-slate-800 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-10">
              {t.faqTitle}
            </h2>
            <div className="space-y-6">
              {t.faqs.map((faq: any, idx: number) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-slate-900/80 border border-slate-800"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 mt-0">
                    {faq.question}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-0">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ACTION DRIVEN CONVERSION FOOTER (CTA) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-t from-slate-950 to-slate-900">
          <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              {t.ctaSectionTitle}
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
              {t.ctaSectionDesc}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="https://kryptonal.com/en/crypto-prices"
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg text-sm transition-colors no-underline"
              >
                {t.ctaPrices}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} t={globalT} />
    </>
  );
}
