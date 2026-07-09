import { Metadata } from "next";
import Head from "next/head";
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary as getGlobalDictionary } from "@/lib/getDictionary";

// ==========================================
// 1. LOCAL DICTIONARY FALLBACK & TYPES
// ==========================================
// In production, this helper mimics your internal getDictionary utility.
// If you already have getDictionary imported globally, you can replace this mockup function.
async function getDictionary(locale: string) {
  const dictionaries: Record<string, any> = {
    en: {
      title: "The Ultimate Guide to Using a Crypto Chart Analyzer",
      intro:
        "Cryptocurrency markets move fast. To keep up, traders rely on technical analysis. Discover how a crypto chart analyzer can help you read candlestick patterns, spot hidden trends, and build a more secure trading strategy.",
      ctaViewCharts: "View Live Charts",
      ctaTrackPortfolio: "Track Your Portfolio",
      whatIsTitle: "What is a Crypto Chart Analyzer?",
      whatIsBody:
        "A crypto chart analyzer is a digital tool that visually represents the price history, trading volume, and market behavior of a specific cryptocurrency over time. Rather than looking at raw data feeds, traders use these visual charts to identify patterns and predict where the price of an asset like Bitcoin or Ethereum might head next.",
      howToTitle: "How to Read a Crypto Chart",
      howToBody:
        "For beginners, a chart can look like an intimidating mix of red and green lines. The core components include Candlesticks (which show the Open, High, Low, and Close prices for a specific timeline) and Trading Volume (which validates the strength of a price movement).",
      indicatorsTitle: "Essential Indicators in an Analyzer",
      benefitsTitle: "Benefits of Using Chart Analysis",
      mistakesTitle: "Common Mistakes to Avoid",
      summaryTitle: "Summary",
      summaryBody:
        "Mastering a crypto chart analyzer takes practice, but it is an indispensable skill for navigating the volatile cryptocurrency markets. Start with basics before overlaying complex data sets.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          question:
            "What is the best timeframe to use on a crypto chart analyzer?",
          answer:
            "It depends on your trading style. Day traders use 5-minute or 15-minute charts, while long-term investors prefer daily or weekly macro views.",
        },
        {
          question: "Can a chart analyzer guarantee profitable trades?",
          answer:
            "No. A crypto chart analyzer calculates historical probabilities, never definitive certainties. Always manage your risk parameters carefully.",
        },
      ],
      ctaSectionTitle: "Take Control of Your Crypto Strategy",
      ctaSectionDesc:
        "Ready to put your chart analysis into practice? Use Kryptonal's private tools to monitor your positions securely.",
    },
    tr: {
      title: "Kripto Grafik Analizörü Kullanım Rehberi",
      intro:
        "Kripto para piyasaları hızlı hareket eder. Bir kripto grafik analizörünün mum grafik formasyonlarını okumanıza ve daha güvenli bir strateji oluşturmanıza nasıl yardımcı olacağını keşfedin.",
      ctaViewCharts: "Canlı Grafikleri Görüntüle",
      ctaTrackPortfolio: "Portföyünüzü Takip Edin",
      whatIsTitle: "Kripto Grafik Analizörü Nedir?",
      whatIsBody:
        "Kripto grafik analizörü, belirli bir kripto paranın fiyat geçmişini, işlem hacmini ve piyasa davranışını zaman içinde görsel olarak temsil eden dijital bir araçtır.",
      howToTitle: "Kripto Grafiği Nasıl Okunur?",
      howToBody:
        "Yeni başlayanlar için bir grafik kırmızı ve yeşil çizgilerin korkutucu bir karışımı gibi görünebilir. Ana bileşenler Mum Grafikleri ve İşlem Hacmidir.",
      indicatorsTitle: "Analizördeki Temel Göstergeler",
      benefitsTitle: "Grafik Analizi Kullanmanın Faydaları",
      mistakesTitle: "Kaçınılması Gereken Yaygın Hatalar",
      summaryTitle: "Özet",
      summaryBody:
        "Kripto grafik analizöründe ustalaşmak zaman alır ancak değişken kripto piyasalarında gezinmek için vazgeçilmez bir beceridir.",
      faqTitle: "Sıkça Sorulan Sorular",
      faqs: [
        {
          question:
            "Kripto grafik analizöründe kullanılacak en iyi zaman dilimi hangisidir?",
          answer:
            "Ticaret tarzınıza bağlıdır. Günlük tüccarlar 5 veya 15 dakikalık grafikleri kullanırken, uzun vadeli yatırımcılar günlük veya haftalık makro görünümleri tercih eder.",
        },
        {
          question: "Grafik analizörü karlı işlemleri garanti edebilir mi?",
          answer: "No. Grafik analizörü kesin kazanç sağlamaz.",
        },
      ],
      ctaSectionTitle: "Kripto Stratejinizin Kontrolünü Elinize Alın",
      ctaSectionDesc:
        "Grafik analizinizi uygulamaya koymaya hazır mısınız? Pozisyonlarınızı güvenli bir şekilde izlemek için Kryptonal'ın özel araçlarını kullanın.",
    },
    pt: {
      title: "O Guia Definitivo para Usar um Analisador de Gráficos Cripto",
      intro:
        "Os mercados de criptomoedas movem-se rapidamente. Descubra como um analisador de gráficos cripto pode ajudá-lo a ler padrões de velas e construir uma estratégia mais segura.",
      ctaViewCharts: "Ver Gráficos ao Vivo",
      ctaTrackPortfolio: "Rastrear Seu Portfólio",
      whatIsTitle: "O que é um Analisador de Gráficos Cripto?",
      whatIsBody:
        "Um analisador de gráficos cripto é uma ferramenta digital que representa visualmente o histórico de preços, o volume de negociação e o comportamento do mercado de uma criptomoeda específica ao longo do tempo.",
      howToTitle: "Como Ler um Gráfico Cripto",
      howToBody:
        "Para iniciantes, um gráfico pode parecer uma mistura intimidante de linhas vermelhas e verdes. Os componentes principais incluem velas e volume de negociação.",
      indicatorsTitle: "Indicadores Essenciais em um Analisador",
      benefitsTitle: "Benefícios do Uso da Análise Gráfica",
      mistakesTitle: "Erros Comuns a Evitar",
      summaryTitle: "Resumo",
      summaryBody:
        "Dominar um analisador de gráficos cripto exige prática, mais é uma habilidade indispensável para navegar nos mercados voláteis de criptomoedas.",
      faqTitle: "Perguntas Frequentes",
      faqs: [
        {
          question:
            "Qual é o melhor período de tempo para usar em um analisador de gráficos?",
          answer:
            "Depende do seu estilo. Day traders usam gráficos de 5 ou 15 minutos, enquanto investidores de longo prazo preferem visões macro diárias ou semanais.",
        },
        {
          question:
            "Um analisador de gráficos pode garantir negociações lucrativas?",
          answer:
            "Não. Um analisador de gráficos calcula probabilidades históricas, nunca certezas definitivas.",
        },
      ],
      ctaSectionTitle: "Assuma o Controle da Sua Estratégia Cripto",
      ctaSectionDesc:
        "Pronto para colocar sua análise gráfica em prática? Use as ferramentas privadas da Kryptonal para monitorar suas posições com segurança.",
    },
    es: {
      title: "La Guía Definitiva para Usar un Analisador de Gráficos Cripto",
      intro:
        "Los mercados de criptomonedas se mueven rápido. Descubre cómo un analizador de gráficos puede ayudarte a leer patrones de velas y construir una estrategia más segura.",
      ctaViewCharts: "Ver Gráficos en Vivo",
      ctaTrackPortfolio: "Rastrear tu Portafolio",
      whatIsTitle: "¿Qué es un Analizador de Gráficos Cripto?",
      whatIsBody:
        "Un analizador de gráficos cripto es una herramienta digital que representa visualmente el historial de precios, el volumen de operaciones y el comportamiento del mercado de una criptomoneda específica.",
      howToTitle: "Cómo Leer un Gráfico Cripto",
      howToBody:
        "Para los principiantes, un gráfico puede parecer una mezcla intimidante de líneas rojas y verdes. Los componentes principales incluyen velas y volumen de operaciones.",
      indicatorsTitle: "Indicadores Esenciales en un Analizador",
      benefitsTitle: "Beneficios de Usar el Análisis de Gráficos",
      mistakesTitle: "Errores Comuns que se Deben Evitar",
      summaryTitle: "Resumen",
      summaryBody:
        "Dominar un analizador de gráficos cripto requiere práctica, pero es una habilidad indispensable para navegar en los volátiles mercados de criptomonedas.",
      faqTitle: "Preguntas Frecuentes",
      faqs: [
        {
          question:
            "¿Cuál es el mejor marco de tiempo para usar en un analizador?",
          answer:
            "Depende de tu estilo de trading. Los day traders usan gráficos de 5 o 15 minutos, mientras que los inversores a largo plazo prefieren vistas macro diarias o semanales.",
        },
        {
          question:
            "¿Puede un analizador de gráficos garantizar operaciones rentables?",
          answer:
            "No. Un analizador de gráficos calcula probabilidades históricas, nunca certezas definitivas.",
        },
      ],
      ctaSectionTitle: "Toma el Control de tu Estrategia Cripto",
      ctaSectionDesc:
        "¿Listo para poner en práctica tu análisis de gráficos? Utiliza las herramientas privadas de Kryptonal de forma segura.",
    },
    fr: {
      title: "Le Guide Ultime pour Utiliser un Analyseur de Graphiques Crypto",
      intro:
        "Les marchés des crypto-monnaies évoluent rapidement. Découvrez comment un analyseur de graphiques peut vous aider à lire les modèles de chandeliers et à construire une stratégie plus sûre.",
      ctaViewCharts: "Voir les Graphiques en Direct",
      ctaTrackPortfolio: "Suivre Votre Portefeuille",
      whatIsTitle: "Qu'est-ce qu'un Analyseur de Graphiques Crypto?",
      whatIsBody:
        "Un analyseur de graphiques crypto est un outil numérique qui représente visuellement l'historique des prix, le volume de transaction et le comportement du marché d'une crypto-monnaie spécifique.",
      howToTitle: "Comment Lire un Graphique Crypto",
      howToBody:
        "Pour les débutants, un graphique peut ressembler à un mélange intimidant de lignes rouges et vertes. Les composants essentiels incluent les chandeliers et le volume.",
      indicatorsTitle: "Indicateurs Essentiels dans un Analyseur",
      benefitsTitle: "Avantages de l'Analyse Graphique",
      mistakesTitle: "Erreurs Courantes à Éviter",
      summaryTitle: "Résumé",
      summaryBody:
        "Maîtriser un analyseur de graphiques crypto demande de la pratique, mais c'est une compétence indispensable pour naviguer sur les marchés volatiles.",
      faqTitle: "Foire Aux Questions",
      faqs: [
        {
          question:
            "Quel est le meilleur laps de temps à utiliser sur un analyseur ?",
          answer:
            "Cela dépend de votre style. Les day traders utilisent des graphiques de 5 ou 15 minutes, tandis que les investisseurs à long terme préfèrent les vues macro.",
        },
        {
          question:
            "Un analyseur de graphiques peut-il garantir des transactions profitables ?",
          answer:
            "Non. Un analyseur de graphiques calcule des probabilités historiques, jamais des certitudes absolues.",
        },
      ],
      ctaSectionTitle: "Prenez le Contrôle de Votre Stratégie Crypto",
      ctaSectionDesc:
        "Prêt à mettre en pratique votre analyse graphique ? Utilisez les outils privés de Kryptonal pour suivre vos positions en toute sécurité.",
    },
    de: {
      title:
        "Der ultimative Leitfaden zur Verwendung eines Krypto-Chart-Analysators",
      intro:
        "Kryptowährungsmärkte bewegen sich schnell. Entdecken Sie, wie ein Krypto-Chart-Analysator Ihnen helfen kann, Candlestick-Muster zu lesen und eine sicherere Strategie zu entwickeln.",
      ctaViewCharts: "Live-Charts ansehen",
      ctaTrackPortfolio: "Portfolio verfolgen",
      whatIsTitle: "Was ist ein Krypto-Chart-Analysator?",
      whatIsBody:
        "Ein Krypto-Chart-Analysator ist ein digitales Tool, das den Preisverlauf, das Handelsvolumen und das Marktverhalten einer bestimmten Kryptowährung im Laufe der Zeit visuell darstellt.",
      howToTitle: "Wie man einen Krypto-Chart liest",
      howToBody:
        "Für Anfänger kann ein Chart wie eine einschüchternde Mischung aus roten und grünen Linien aussehen. Die Kernkomponenten sind Candlesticks und das Handelsvolumen.",
      indicatorsTitle: "Wichtige Indikatoren in einem Analysator",
      benefitsTitle: "Vorteile der Chartanalyse",
      mistakesTitle: "Häufige Fehler, die Sie vermeiden sollten",
      summaryTitle: "Zusammenfassung",
      summaryBody:
        "Die Beherrschung eines Krypto-Chart-Analysators erfordert Übung, ist jedoch eine unverzichtbare Fähigkeit, um sich auf den volatilen Kryptomärkten zu bewegen.",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        {
          question:
            "Was ist der beste Zeitrahmen für einen Krypto-Chart-Analysator?",
          answer:
            "Es hängt von Ihrem Handelsstil ab. Daytrader nutzen 5- oder 15-Minuten-Charts, während langfristige Anleger makroökonomische Ansichten bevorzugen.",
        },
        {
          question: "Kann ein Chart-Analysator profitable Trades garantieren?",
          answer:
            "Nein. Ein Krypto-Chart-Analysator berechnet historische Wahrscheinlichkeiten.",
        },
      ],
      ctaSectionTitle:
        "Übernehmen Sie die Kontrolle über Ihre Krypto-Strategie",
      ctaSectionDesc:
        "Bereit, Ihre Chartanalyse in die Praxis umzusetzen? Nutzen Sie die privaten Tools von Kryptonal, um Ihre Positionen sicher zu überwachen.",
    },
  };

  return dictionaries[locale] || dictionaries.en;
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

// ==========================================
// 2. ASYNCHRONOUS METADATA ENGINE (Next.js 15 App Router Compatible)
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
      canonical: `https://www.kryptonal.com/${locale}/learn/crypto-chart-analyzer`,
      languages: {
        en: "https://www.kryptonal.com/en/learn/crypto-chart-analyzer",
        tr: "https://www.kryptonal.com/tr/learn/crypto-chart-analyzer",
        pt: "https://www.kryptonal.com/pt/learn/crypto-chart-analyzer",
        es: "https://www.kryptonal.com/es/learn/crypto-chart-analyzer",
        fr: "https://www.kryptonal.com/fr/learn/crypto-chart-analyzer",
        de: "https://www.kryptonal.com/de/learn/crypto-chart-analyzer",
      },
    },
    openGraph: {
      title: t.title,
      description: t.intro.substring(0, 150),
      url: `https://www.kryptonal.com/${locale}/learn/crypto-chart-analyzer`,
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
export default async function CryptoChartAnalyzerPage({ params }: PageProps) {
  // Asynchronously resolve parameters
  const { locale } = await params;

  // Fetch BOTH dictionaries
  const t = await getDictionary(locale); // Your local page content
  const globalT = await getGlobalDictionary(locale); // Your global Header/Footer content

  // Structural JSON-LD for rich snippets (uses local 't')
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
      {/* Pass globalT to Header */}
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
              ⚡ Kryptonal Learn
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              {t.title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
              {t.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-teal-500/20">
                {t.ctaViewCharts}
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0">
                {t.ctaTrackPortfolio}
              </button>
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

            {/* How to Section */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-2">
                {t.howToTitle}
              </h2>
              <p className="text-slate-400 leading-relaxed text-base sm:text-lg">
                {t.howToBody}
              </p>
            </div>

            {/* Responsive Market Indicators Data Table */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-2">
                {t.indicatorsTitle}
              </h2>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80">
                      <th className="p-4 font-semibold text-teal-400 text-sm">
                        Indicator
                      </th>
                      <th className="p-4 font-semibold text-teal-400 text-sm">
                        Primary Use-case
                      </th>
                      <th className="p-4 font-semibold text-teal-400 text-sm">
                        Signal Threshold
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 text-sm">
                    <tr className="hover:bg-slate-900/30">
                      <td className="p-4 font-medium text-white">
                        RSI (Relative Strength Index)
                      </td>
                      <td className="p-4">
                        Identifying overbought and oversold environments.
                      </td>
                      <td className="p-4 font-mono">
                        &gt;70 Overbought, &lt;30 Oversold
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/30">
                      <td className="p-4 font-medium text-white">
                        Moving Averages (MA/EMA)
                      </td>
                      <td className="p-4">
                        Tracking directional trends across filtered timelines.
                      </td>
                      <td className="p-4 font-mono">
                        Golden Cross / Death Cross
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/30">
                      <td className="p-4 font-medium text-white">MACD</td>
                      <td className="p-4">
                        Uncovering hidden momentum dynamic shifts.
                      </td>
                      <td className="p-4 font-mono">Signal Line Crossovers</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strategic Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="text-xl font-semibold text-white mb-3">
                  🛡️ {t.benefitsTitle}
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm list-disc pl-4">
                  <li>Enforces programmatic, objective decision matrices.</li>
                  <li>
                    Pinpoints entry levels relative to historic volume support.
                  </li>
                  <li>Automates stop-loss mitigation bounds.</li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="text-xl font-semibold text-white mb-3">
                  ⚠️ {t.mistakesTitle}
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm list-disc pl-4">
                  <li>
                    Overcomplicating layouts via excessive oscillator metrics.
                  </li>
                  <li>
                    Trading isolation metrics while overriding macro cycle
                    trends.
                  </li>
                  <li>Neglecting core operational volume metrics.</li>
                </ul>
              </div>
            </div>

            {/* Highlighted Alert/Summary Area */}
            <div className="p-5 rounded-xl border-l-4 border-teal-500 bg-teal-950/20 text-slate-300">
              <h3 className="text-lg font-semibold text-white mb-1">
                {t.summaryTitle}
              </h3>
              <p className="text-sm leading-relaxed">{t.summaryBody}</p>
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
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
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
              <button className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg text-sm transition-colors">
                {t.ctaTrackPortfolio}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Pass globalT to Footer */}
      <Footer locale={locale} t={globalT} />
    </>
  );
}
