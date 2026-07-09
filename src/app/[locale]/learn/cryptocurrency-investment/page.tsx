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
      title: "Cryptocurrency Investment Guide: How to Start Investing Safely",
      intro:
        "Navigate the digital asset market with confidence. Learn the fundamentals of cryptocurrency investment, how to build a diversified portfolio, and the essential strategies to mitigate risk in a volatile market.",
      ctaStart: "Start Investing Journey",
      ctaPrices: "View Live Crypto Prices",
      whatIsTitle: "What is Cryptocurrency Investment?",
      whatIsBody:
        "Cryptocurrency investment involves purchasing digital assets like Bitcoin, Ethereum, or altcoins with the expectation that they will increase in value over time. Unlike traditional stocks which represent company ownership, crypto assets often represent utility within a decentralized network or act as a digital store of value. Due to their decentralized nature and nascent technology, these investments offer high potential returns but carry significantly higher volatility compared to traditional markets.",
      curriculumTitle: "Key Investment Strategies",
      pricesLinkTitle: "Track Your Investments with Real-Time Data",
      pricesLinkBody:
        "Successful investing requires accurate, up-to-the-minute market data. Stop guessing market movements and start tracking actual valuations. Use Kryptonal to monitor live price action, market capitalization, and historical performance across thousands of digital assets.",
      benefitsTitle: "Why Invest in Crypto?",
      mistakesTitle: "Critical Investment Risks",
      summaryTitle: "Investment Summary",
      summaryBody:
        "Cryptocurrency should be approached as a high-risk, high-reward component of a broader investment portfolio. Never invest more than you can afford to lose, always prioritize self-custody of your assets, and rely on fundamental analysis rather than social media hype.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          question: "How much money do I need to start investing in crypto?",
          answer:
            "You can start with very little. Most major exchanges allow you to purchase fractional amounts of cryptocurrencies, meaning you can buy $10 or $20 worth of Bitcoin to start learning.",
        },
        {
          question: "What is DCA (Dollar-Cost Averaging)?",
          answer:
            "DCA is an investment strategy where you invest a fixed amount of money at regular intervals (e.g., $50 every week) regardless of the asset's price. This helps reduce the impact of volatility over time.",
        },
        {
          question: "Where can I check the current value of my investments?",
          answer:
            "You can monitor live, accurate market data and historical price trends directly on Kryptonal's Crypto Prices page.",
        },
      ],
      ctaSectionTitle: "Ready to Build Your Crypto Portfolio?",
      ctaSectionDesc:
        "Equip yourself with the best market intelligence before making your first trade. Explore live prices and market caps on Kryptonal today.",
    },
    tr: {
      title: "Kripto Para Yatırım Rehberi: Güvenle Yatırıma Nasıl Başlanır",
      intro:
        "Dijital varlık piyasasında güvenle gezinin. Kripto para yatırımının temellerini, çeşitlendirilmiş bir portföyün nasıl oluşturulacağını ve riskleri azaltmak için temel stratejileri öğrenin.",
      ctaStart: "Yatırım Yolculuğuna Başla",
      ctaPrices: "Canlı Kripto Fiyatlarını Görüntüle",
      whatIsTitle: "Kripto Para Yatırımı Nedir?",
      whatIsBody:
        "Kripto para yatırımı, zamanla değer kazanacakları beklentisiyle Bitcoin, Ethereum veya altcoinler gibi dijital varlıkları satın almayı içerir. Geleneksel pazarlara kıyasla yüksek getiri potansiyeli sunar ancak önemli ölçüde daha yüksek volatilite taşır.",
      curriculumTitle: "Temel Yatırım Stratejileri",
      pricesLinkTitle: "Yatırımlarınızı Gerçek Zamanlı Verilerle Takip Edin",
      pricesLinkBody:
        "Başarılı yatırım, doğru ve güncel piyasa verileri gerektirir. Piyasa hareketlerini tahmin etmeyi bırakın. Binlerce dijital varlık genelinde canlı fiyat hareketlerini izlemek için Kryptonal'ı kullanın.",
      benefitsTitle: "Neden Kriptoya Yatırım Yapmalısınız?",
      mistakesTitle: "Kritik Yatırım Riskleri",
      summaryTitle: "Yatırım Özeti",
      summaryBody:
        "Kripto paraya, daha geniş bir yatırım portföyünün yüksek riskli, yüksek ödüllü bir bileşeni olarak yaklaşılmalıdır. Kaybetmeyi göze alabileceğinizden fazlasını asla yatırım yapmayın.",
      faqTitle: "Sıkça Sorulan Sorular",
      faqs: [
        {
          question:
            "Kriptoya yatırım yapmaya başlamak için ne kadar paraya ihtiyacım var?",
          answer:
            "Çok az bir miktarla başlayabilirsiniz. Çoğu borsa kesirli miktarlarda alım yapmanıza izin verir.",
        },
        {
          question: "DCA (Dolar Maliyet Ortalaması) nedir?",
          answer:
            "Fiyattan bağımsız olarak düzenli aralıklarla sabit miktarda yatırım yaptığınız bir stratejidir.",
        },
        {
          question:
            "Yatırımlarımın güncel değerini nereden kontrol edebilirim?",
          answer:
            "Canlı piyasa verilerini doğrudan Kryptonal Kripto Fiyatları sayfasından izleyebilirsiniz.",
        },
      ],
      ctaSectionTitle: "Kripto Portföyünüzü Oluşturmaya Hazır mısınız?",
      ctaSectionDesc:
        "İlk işleminizi yapmadan önce kendinizi en iyi piyasa istihbaratıyla donatın. Kryptonal'daki canlı fiyatları bugün keşfedin.",
    },
    pt: {
      title: "Guia de Investimento em Criptomoedas: Como Começar com Segurança",
      intro:
        "Navegue no mercado de ativos digitais com confiança. Aprenda os fundamentos do investimento em cripto, como construir um portfólio diversificado e estratégias essenciais de risco.",
      ctaStart: "Iniciar Jornada de Investimento",
      ctaPrices: "Ver Preços de Cripto ao Vivo",
      whatIsTitle: "O Que é Investimento em Criptomoedas?",
      whatIsBody:
        "O investimento em criptomoedas envolve a compra de ativos digitais com a expectativa de que eles aumentem de valor ao longo do tempo. Esses investimentos oferecem altos retornos potenciais, mas carregam volatilidade significativamente maior em comparação aos mercados tradicionais.",
      curriculumTitle: "Principais Estratégias de Investimento",
      pricesLinkTitle: "Acompanhe Seus Investimentos com Dados em Tempo Real",
      pricesLinkBody:
        "Um investimento bem-sucedido requer dados de mercado precisos. Use a Kryptonal para monitorar a ação do preço ao vivo e a capitalização de mercado em milhares de ativos digitais.",
      benefitsTitle: "Por Que Investir em Cripto?",
      mistakesTitle: "Riscos Críticos de Investimento",
      summaryTitle: "Resumo do Investimento",
      summaryBody:
        "Criptomoedas devem ser abordadas como um componente de alto risco de um portfólio. Nunca invista mais do que pode perder e priorize a autocustódia.",
      faqTitle: "Perguntas Frequentes",
      faqs: [
        {
          question: "Quanto dinheiro preciso para começar?",
          answer:
            "Você pode começar com muito pouco, pois as bolsas permitem compras fracionadas.",
        },
        {
          question: "O que é DCA (Dollar-Cost Averaging)?",
          answer:
            "É uma estratégia onde você investe um valor fixo em intervalos regulares, independentemente do preço do ativo.",
        },
        {
          question:
            "Onde posso verificar o valor atual dos meus investimentos?",
          answer:
            "Você pode monitorar dados ao vivo diretamente na página de Preços de Criptomoedas da Kryptonal.",
        },
      ],
      ctaSectionTitle: "Pronto para Construir Seu Portfólio Cripto?",
      ctaSectionDesc:
        "Equipe-se com a melhor inteligência de mercado antes de fazer sua primeira negociação. Explore preços ao vivo na Kryptonal hoje.",
    },
    es: {
      title: "Guía de Inversión en Criptomonedas: Cómo Empezar de Forma Segura",
      intro:
        "Navega por el mercado de activos digitales con confianza. Aprende los fundamentos de la inversión en criptomonedas, cómo crear una cartera diversificada y estrategias de riesgo.",
      ctaStart: "Comenzar Viaje de Inversión",
      ctaPrices: "Ver Precios Cripto en Vivo",
      whatIsTitle: "¿Qué es la Inversión en Criptomonedas?",
      whatIsBody:
        "La inversión en criptomonedas implica la compra de activos digitales con la expectativa de que aumenten de valor con el tiempo. Estas inversiones ofrecen altos rendimientos potenciales pero conllevan una volatilidad significativamente mayor en comparación con los mercados tradicionales.",
      curriculumTitle: "Estrategias de Inversión Clave",
      pricesLinkTitle: "Rastrea tus Inversiones con Datos en Tiempo Real",
      pricesLinkBody:
        "La inversión exitosa requiere datos de mercado precisos. Usa Kryptonal para monitorear la acción del precio en vivo y la capitalización de mercado en miles de activos digitales.",
      benefitsTitle: "¿Por Qué Invertir en Cripto?",
      mistakesTitle: "Riesgos Críticos de Inversión",
      summaryTitle: "Resumen de Inversión",
      summaryBody:
        "Las criptomonedas deben abordarse como un componente de alto riesgo de una cartera más amplia. Nunca inviertas más de lo que puedas permitirte perder.",
      faqTitle: "Preguntas Frecuentes",
      faqs: [
        {
          question: "¿Cuánto dinero necesito para empezar a invertir?",
          answer:
            "Puedes empezar con muy poco. La mayoría de los intercambios te permiten comprar cantidades fraccionarias.",
        },
        {
          question: "¿Qué es DCA (Dollar-Cost Averaging)?",
          answer:
            "Es una estrategia en la que inviertes una cantidad fija de dinero a intervalos regulares, independientemente del precio del activo.",
        },
        {
          question: "¿Dónde puedo comprobar el valor de mis inversiones?",
          answer:
            "Puedes monitorear datos en vivo directamente en la página de Precios de Criptomonedas de Kryptonal.",
        },
      ],
      ctaSectionTitle: "¿Listo para Construir tu Cartera Cripto?",
      ctaSectionDesc:
        "Equípate con la mejor inteligencia de mercado antes de realizar tu primera operación. Explora precios en vivo en Kryptonal hoy.",
    },
    fr: {
      title:
        "Guide d'Investissement Crypto : Comment Débuter en Toute Sécurité",
      intro:
        "Naviguez sur le marché des actifs numériques avec confiance. Apprenez les bases de l'investissement crypto, comment construire un portefeuille diversifié et les stratégies de risque essentielles.",
      ctaStart: "Commencer à Investir",
      ctaPrices: "Voir les Prix Crypto en Direct",
      whatIsTitle: "Qu'est-ce que l'Investissement en Crypto-monnaies ?",
      whatIsBody:
        "L'investissement en crypto-monnaies consiste à acheter des actifs numériques dans l'espoir que leur valeur augmente avec le temps. Ces investissements offrent des rendements potentiels élevés mais comportent une volatilité considérablement plus grande par rapport aux marchés traditionnels.",
      curriculumTitle: "Stratégies d'Investissement Clés",
      pricesLinkTitle:
        "Suivez Vos Investissements avec des Données en Temps Réel",
      pricesLinkBody:
        "Un investissement réussi nécessite des données de marché précises. Utilisez Kryptonal pour suivre l'évolution des prix en direct et la capitalisation boursière.",
      benefitsTitle: "Pourquoi Investir dans la Crypto ?",
      mistakesTitle: "Risques d'Investissement Critiques",
      summaryTitle: "Résumé de l'Investissement",
      summaryBody:
        "La crypto doit être considérée comme une composante à haut risque d'un portefeuille plus large. N'investissez jamais plus que ce que vous pouvez vous permettre de perdre.",
      faqTitle: "Questions Fréquentes",
      faqs: [
        {
          question: "De combien d'argent ai-je besoin pour commencer ?",
          answer:
            "Vous pouvez commencer avec très peu, car les échanges permettent d'acheter des fractions de cryptos.",
        },
        {
          question: "Qu'est-ce que le DCA (Dollar-Cost Averaging) ?",
          answer:
            "C'est une stratégie où vous investissez un montant fixe à des intervalles réguliers, quel que soit le prix de l'actif.",
        },
        {
          question: "Où puis-je vérifier la valeur de mes investissements ?",
          answer:
            "Vous pouvez surveiller les données en direct directement sur la page des Prix Crypto de Kryptonal.",
        },
      ],
      ctaSectionTitle: "Prêt à Construire Votre Portefeuille Crypto ?",
      ctaSectionDesc:
        "Équipez-vous des meilleures informations du marché. Explorez les prix en direct sur Kryptonal aujourd'hui.",
    },
    de: {
      title: "Kryptowährungs-Investment-Guide: Sicher investieren lernen",
      intro:
        "Navigieren Sie selbstbewusst durch den Markt für digitale Vermögenswerte. Erlernen Sie die Grundlagen von Krypto-Investitionen und Strategien zur Risikominderung.",
      ctaStart: "Investment-Reise beginnen",
      ctaPrices: "Live-Krypto-Preise ansehen",
      whatIsTitle: "Was ist ein Kryptowährungs-Investment?",
      whatIsBody:
        "Krypto-Investitionen beinhalten den Kauf digitaler Vermögenswerte in der Erwartung, dass diese im Laufe der Zeit an Wert gewinnen. Diese Anlagen bieten hohe potenzielle Renditen, bergen jedoch eine höhere Volatilität im Vergleich zu traditionellen Märkten.",
      curriculumTitle: "Wichtige Investment-Strategien",
      pricesLinkTitle: "Verfolgen Sie Ihre Investitionen mit Echtzeitdaten",
      pricesLinkBody:
        "Erfolgreiches Investieren erfordert genaue Marktdaten. Nutzen Sie Kryptonal, um Live-Preisbewegungen und die Marktkapitalisierung zu überwachen.",
      benefitsTitle: "Warum in Krypto investieren?",
      mistakesTitle: "Kritische Investitionsrisiken",
      summaryTitle: "Investitionszusammenfassung",
      summaryBody:
        "Krypto sollte als hochriskante Komponente eines Portfolios betrachtet werden. Investieren Sie niemals mehr, als Sie sich leisten können zu verlieren.",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Wie viel Geld benötige ich für den Anfang?",
          answer:
            "Sie können mit sehr wenig beginnen, da Börsen den Kauf von Bruchteilen ermöglichen.",
        },
        {
          question: "Was ist DCA (Dollar-Cost Averaging)?",
          answer:
            "Eine Strategie, bei der Sie in regelmäßigen Abständen einen festen Betrag investieren, unabhängig vom Preis.",
        },
        {
          question: "Wo kann ich den Wert meiner Investitionen überprüfen?",
          answer:
            "Sie können Live-Daten direkt auf der Krypto-Preise-Seite von Kryptonal überwachen.",
        },
      ],
      ctaSectionTitle: "Bereit, Ihr Krypto-Portfolio aufzubauen?",
      ctaSectionDesc:
        "Rüsten Sie sich mit den besten Marktinformationen aus. Entdecken Sie noch heute Live-Preise auf Kryptonal.",
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
      canonical: `https://www.kryptonal.com/${locale}/learn/cryptocurrency-investment`,
      languages: {
        en: "https://www.kryptonal.com/en/learn/cryptocurrency-investment",
        tr: "https://www.kryptonal.com/tr/learn/cryptocurrency-investment",
        pt: "https://www.kryptonal.com/pt/learn/cryptocurrency-investment",
        es: "https://www.kryptonal.com/es/learn/cryptocurrency-investment",
        fr: "https://www.kryptonal.com/fr/learn/cryptocurrency-investment",
        de: "https://www.kryptonal.com/de/learn/cryptocurrency-investment",
      },
    },
    openGraph: {
      title: t.title,
      description: t.intro.substring(0, 150),
      url: `https://www.kryptonal.com/${locale}/learn/cryptocurrency-investment`,
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
export default async function CryptocurrencyInvestmentPage({
  params,
}: PageProps) {
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
              💼 Asset Management
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              {t.title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
              {t.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-teal-500/20">
                {t.ctaStart}
              </button>
              {/* Note: Linking directly to the prices page as requested */}
              <Link
                href="https://kryptonal.com/en/crypto-prices"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl transition-all duration-200 text-center transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {t.ctaPrices}
              </Link>
            </div>
          </div>
        </section>

        {/* ARTICLE CONTENT SECTION */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <article className="prose prose-invert prose-teal max-w-none space-y-12">
            {/* What is Section */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-2">
                {t.whatIsTitle}
              </h2>
              <p className="text-slate-400 leading-relaxed text-base sm:text-lg">
                {t.whatIsBody}
              </p>
            </div>

            {/* Structured Curriculum Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-2">
                {t.curriculumTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Dollar-Cost Averaging (DCA)
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Consistently investing fixed amounts over time to smooth out
                    market volatility.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Portfolio Diversification
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Spreading capital across large-caps (BTC, ETH) and varied
                    sectors like DeFi and Layer 2s.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Fundamental Analysis
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Evaluating project tokenomics, developer activity, use
                    cases, and market capitalization.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Secure Self-Custody
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Moving investments off centralized exchanges and into
                    hardware wallets for long-term holds.
                  </p>
                </div>
              </div>
            </div>

            {/* DEDICATED PRICES INTERNAL LINK SECTION (Required by Prompt) */}
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
                  View Live Market Prices
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
                  <li>
                    Exposure to the fastest-growing technology sector globally.
                  </li>
                  <li>
                    Protection against traditional fiat currency inflation.
                  </li>
                  <li>
                    Complete control over your personal wealth (self-custody).
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="text-xl font-semibold text-white mb-3 mt-0">
                  ⚠️ {t.mistakesTitle}
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm list-disc pl-4">
                  <li>
                    Investing heavily in unverified, micro-cap tokens
                    (memecoins).
                  </li>
                  <li>Leaving large investments on centralized exchanges.</li>
                  <li>Panic selling during standard market corrections.</li>
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
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg text-sm transition-colors"
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
