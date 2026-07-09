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
      title: "Comprehensive Crypto Trading Course: Master the Markets",
      intro:
        "Elevate your trading strategy from guesswork to data-driven precision. Our comprehensive crypto trading course covers technical analysis, risk management, and market psychology to help you trade confidently.",
      ctaStart: "Start the Course",
      ctaTools: "Explore Trading Tools",
      whatIsTitle: "Why Take a Crypto Trading Course?",
      whatIsBody:
        "The cryptocurrency market is open 24/7 and moves faster than any traditional financial market. Without a solid understanding of market mechanics, order flow, and technical indicators, you are at a significant disadvantage. A structured trading course provides the blueprint to consistently identify high-probability setups and protect your capital.",
      curriculumTitle: "Course Curriculum",
      toolsLinkTitle: "Apply Your Knowledge with Kryptonal Tools",
      toolsLinkBody:
        "A course teaches you the theory; our tools help you execute. Once you understand technical analysis and portfolio management, use our specialized crypto tracker and cycle comparison tools to put your strategies to the test in real-time.",
      benefitsTitle: "What You Will Achieve",
      mistakesTitle: "Common Trading Pitfalls Addressed",
      summaryTitle: "Course Summary",
      summaryBody:
        "Trading is not about being right 100% of the time; it is about managing risk and maximizing wins. This course provides the structural foundation required to approach the crypto markets professionally rather than emotionally.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          question: "Do I need prior trading experience?",
          answer:
            "No. This course is designed to take you from absolute beginner to confident trader. We start with basic concepts like reading candlesticks before moving on to complex strategies.",
        },
        {
          question: "What tools do I need for this course?",
          answer:
            "You only need an internet connection and a free account on a charting platform (like TradingView). We also recommend using Kryptonal's free market tools to track live data.",
        },
        {
          question: "How long does it take to learn crypto trading?",
          answer:
            "While you can learn the basics in a few weeks, mastering trading takes months or even years of practice and market experience.",
        },
      ],
      ctaSectionTitle: "Ready to Become a Better Trader?",
      ctaSectionDesc:
        "Stop relying on luck and start relying on strategy. Access our course and live analytical tools today.",
    },
    tr: {
      title: "Kapsamlı Kripto Ticaret Kursu: Piyasalara Hakim Olun",
      intro:
        "Ticaret stratejinizi tahminlerden veriye dayalı hassasiyete yükseltin. Kapsamlı kripto ticaret kursumuz, güvenle ticaret yapmanıza yardımcı olmak için teknik analiz, risk yönetimi ve piyasa psikolojisini kapsar.",
      ctaStart: "Kursa Başla",
      ctaTools: "Ticaret Araçlarını Keşfet",
      whatIsTitle: "Neden Kripto Ticaret Kursu Almalısınız?",
      whatIsBody:
        "Kripto para piyasası 7/24 açıktır ve geleneksel finansal piyasalardan daha hızlı hareket eder. Piyasa mekaniği, emir akışı ve teknik göstergeler hakkında sağlam bir anlayış olmadan dezavantajlı durumdasınız. Yapılandırılmış bir ticaret kursu, yüksek olasılıklı kurulumları tutarlı bir şekilde belirlemek ve sermayenizi korumak için bir plan sunar.",
      curriculumTitle: "Kurs Müfredatı",
      toolsLinkTitle: "Bilginizi Kryptonal Araçlarıyla Uygulayın",
      toolsLinkBody:
        "Bir kurs size teoriyi öğretir; araçlarımız ise uygulamanıza yardımcı olur. Teknik analiz ve portföy yönetimini anladıktan sonra, stratejilerinizi gerçek zamanlı olarak test etmek için özel kripto izleyici ve döngü karşılaştırma araçlarımızı kullanın.",
      benefitsTitle: "Neler Başaracaksınız",
      mistakesTitle: "Ele Alınan Yaygın Ticaret Hataları",
      summaryTitle: "Kurs Özeti",
      summaryBody:
        "Ticaret, %100 haklı olmakla ilgili değildir; riski yönetmek ve kazançları en üst düzeye çıkarmakla ilgilidir. Bu kurs, kripto piyasalarına duygusal değil, profesyonelce yaklaşmak için gereken yapısal temeli sağlar.",
      faqTitle: "Sıkça Sorulan Sorular",
      faqs: [
        {
          question: "Önceden ticaret deneyimine ihtiyacım var mı?",
          answer:
            "Hayır. Bu kurs sizi mutlak başlangıç seviyesinden güvenli bir tüccar seviyesine taşımak için tasarlanmıştır.",
        },
        {
          question: "Bu kurs için hangi araçlara ihtiyacım var?",
          answer:
            "Sadece bir internet bağlantısına ve bir grafik platformunda ücretsiz bir hesaba ihtiyacınız var.",
        },
        {
          question: "Kripto ticaretini öğrenmek ne kadar sürer?",
          answer:
            "Temelleri birkaç hafta içinde öğrenebilseniz de, ticarette ustalaşmak aylar hatta yıllar süren pratik gerektirir.",
        },
      ],
      ctaSectionTitle: "Daha İyi Bir Tüccar Olmaya Hazır mısınız?",
      ctaSectionDesc:
        "Şansa güvenmeyi bırakın ve stratejiye güvenmeye başlayın. Kursumuza ve canlı analiz araçlarımıza bugün erişin.",
    },
    pt: {
      title: "Curso Completo de Trading de Cripto: Domine os Mercados",
      intro:
        "Eleve sua estratégia de negociação de suposições para precisão baseada em dados. Nosso curso abrangente cobre análise técnica, gestão de risco e psicologia de mercado.",
      ctaStart: "Iniciar o Curso",
      ctaTools: "Explorar Ferramentas",
      whatIsTitle: "Por Que Fazer um Curso de Trading de Criptomoedas?",
      whatIsBody:
        "O mercado cripto funciona 24/7 e se move muito rápido. Sem um entendimento sólido de mecânica de mercado e indicadores técnicos, você está em desvantagem. Um curso estruturado fornece o roteiro para identificar oportunidades de alta probabilidade de forma consistente.",
      curriculumTitle: "Currículo do Curso",
      toolsLinkTitle: "Aplique Seu Conhecimento com as Ferramentas Kryptonal",
      toolsLinkBody:
        "Um curso ensina a teoria; nossas ferramentas ajudam você a executar. Depois de entender a análise técnica, use nosso rastreador de portfólio para colocar suas estratégias à prova em tempo real.",
      benefitsTitle: "O Que Você Vai Alcançar",
      mistakesTitle: "Erros Comuns Abordados",
      summaryTitle: "Resumo do Curso",
      summaryBody:
        "Negociar não é estar certo 100% das vezes; é sobre gerenciar riscos. Este curso fornece a base estrutural necessária para abordar os mercados de forma profissional.",
      faqTitle: "Perguntas Frequentes",
      faqs: [
        {
          question: "Preciso de experiência prévia?",
          answer:
            "Não. Este curso é projetado para levá-lo de iniciante a trader confiante.",
        },
        {
          question: "De quais ferramentas eu preciso?",
          answer:
            "Você só precisa de uma conexão à internet e uma conta gratuita em uma plataforma de gráficos.",
        },
        {
          question: "Quanto tempo leva para aprender?",
          answer:
            "Embora você possa aprender o básico em algumas semanas, dominar o trading leva meses ou anos de prática.",
        },
      ],
      ctaSectionTitle: "Pronto para se Tornar um Trader Melhor?",
      ctaSectionDesc:
        "Pare de depender da sorte e comece a depender da estratégia. Acesse nosso curso hoje.",
    },
    es: {
      title: "Curso Completo de Trading de Cripto: Domina los Mercados",
      intro:
        "Eleva tu estrategia de trading de las conjeturas a la precisión basada en datos. Nuestro curso integral cubre análisis técnico, gestión de riesgos y psicología del mercado.",
      ctaStart: "Comenzar el Curso",
      ctaTools: "Explorar Herramientas",
      whatIsTitle: "¿Por Qué Tomar un Curso de Trading de Criptomonedas?",
      whatIsBody:
        "El mercado de criptomonedas opera 24/7 y se mueve rápidamente. Sin una comprensión sólida de la mecánica del mercado y los indicadores técnicos, estás en desventaja. Un curso estructurado proporciona el plan para identificar configuraciones de alta probabilidad de manera consistente.",
      curriculumTitle: "Plan de Estudios del Curso",
      toolsLinkTitle:
        "Aplica tu Conocimiento con las Herramientas de Kryptonal",
      toolsLinkBody:
        "Un curso te enseña la teoría; nuestras herramientas te ayudan a ejecutar. Una vez que comprendas el análisis técnico, utiliza nuestro rastreador de cartera para poner a prueba tus estrategias en tiempo real.",
      benefitsTitle: "Lo Que Lograrás",
      mistakesTitle: "Errores Comunes Abordados",
      summaryTitle: "Resumen del Curso",
      summaryBody:
        "Hacer trading no se trata de tener razón el 100% de las veces; se trata de gestionar el riesgo. Este curso proporciona la base estructural necesaria para abordar los mercados de manera profesional.",
      faqTitle: "Preguntas Frecuentes",
      faqs: [
        {
          question: "¿Necesito experiencia previa?",
          answer:
            "No. Este curso está diseñado para llevarte de principiante a trader seguro.",
        },
        {
          question: "¿Qué herramientas necesito?",
          answer:
            "Solo necesitas conexión a internet y una cuenta gratuita en una plataforma de gráficos.",
        },
        {
          question: "¿Cuánto tiempo se tarda en aprender?",
          answer:
            "Aunque puedes aprender los conceptos básicos en unas pocas semanas, dominar el trading lleva meses o años de práctica.",
        },
      ],
      ctaSectionTitle: "¿Listo para Convertirte en un Mejor Trader?",
      ctaSectionDesc:
        "Deja de depender de la suerte y comienza a depender de la estrategia. Accede a nuestro curso hoy.",
    },
    fr: {
      title: "Cours Complet de Trading Crypto : Maîtrisez les Marchés",
      intro:
        "Élevez votre stratégie de trading des simples devinettes à une précision basée sur les données. Notre cours complet couvre l'analyse technique, la gestion des risques et la psychologie du marché.",
      ctaStart: "Commencer le Cours",
      ctaTools: "Explorer les Outils",
      whatIsTitle: "Pourquoi Suivre un Cours de Trading Crypto ?",
      whatIsBody:
        "Le marché des crypto-monnaies est ouvert 24h/24 et évolue rapidement. Sans une solide compréhension de la mécanique du marché et des indicateurs techniques, vous êtes désavantagé. Un cours structuré fournit le plan pour identifier de manière cohérente les configurations à forte probabilité.",
      curriculumTitle: "Programme du Cours",
      toolsLinkTitle: "Appliquez Vos Connaissances avec les Outils Kryptonal",
      toolsLinkBody:
        "Un cours vous enseigne la théorie ; nos outils vous aident à l'exécuter. Une fois que vous maîtrisez l'analyse technique, utilisez notre outil de suivi de portefeuille pour tester vos stratégies en temps réel.",
      benefitsTitle: "Ce Que Vous Allez Accomplir",
      mistakesTitle: "Erreurs Courantes Abordées",
      summaryTitle: "Résumé du Cours",
      summaryBody:
        "Le trading ne consiste pas à avoir raison à 100 % ; il s'agit de gérer les risques. Ce cours fournit la base structurelle nécessaire pour aborder les marchés de manière professionnelle.",
      faqTitle: "Questions Fréquentes",
      faqs: [
        {
          question: "Ai-je besoin d'une expérience préalable ?",
          answer:
            "Non. Ce cours est conçu pour vous amener de débutant absolu à trader confiant.",
        },
        {
          question: "De quels outils ai-je besoin ?",
          answer:
            "Vous n'avez besoin que d'une connexion Internet et d'un compte gratuit sur une plateforme graphique.",
        },
        {
          question: "Combien de temps faut-il pour apprendre ?",
          answer:
            "Bien que vous puissiez apprendre les bases en quelques semaines, maîtriser le trading prend des mois, voire des années de pratique.",
        },
      ],
      ctaSectionTitle: "Prêt à Devenir un Meilleur Trader ?",
      ctaSectionDesc:
        "Arrêtez de compter sur la chance et commencez à compter sur la stratégie. Accédez à notre cours dès aujourd'hui.",
    },
    de: {
      title: "Umfassender Krypto-Trading-Kurs: Meistern Sie die Märkte",
      intro:
        "Heben Sie Ihre Handelsstrategie von Rätselraten zu datengesteuerter Präzision. Unser umfassender Kurs deckt technische Analysen, Risikomanagement und Marktpsychologie ab.",
      ctaStart: "Kurs beginnen",
      ctaTools: "Tools erkunden",
      whatIsTitle: "Warum einen Krypto-Trading-Kurs belegen?",
      whatIsBody:
        "Der Kryptowährungsmarkt ist rund um die Uhr geöffnet und bewegt sich schnell. Ohne ein solides Verständnis der Marktmechanik und technischer Indikatoren sind Sie im Nachteil. Ein strukturierter Kurs bietet den Plan, um Setup-Möglichkeiten mit hoher Wahrscheinlichkeit konsistent zu identifizieren.",
      curriculumTitle: "Kurslehrplan",
      toolsLinkTitle: "Wenden Sie Ihr Wissen mit Kryptonal Tools an",
      toolsLinkBody:
        "Ein Kurs vermittelt Ihnen die Theorie; unsere Tools helfen Ihnen bei der Umsetzung. Nutzen Sie unseren Portfolio-Tracker, um Ihre Strategien in Echtzeit zu testen.",
      benefitsTitle: "Was Sie erreichen werden",
      mistakesTitle: "Häufige Trading-Fehler behoben",
      summaryTitle: "Kurszusammenfassung",
      summaryBody:
        "Beim Trading geht es nicht darum, immer zu 100 % Recht zu haben. Es geht um Risikomanagement. Dieser Kurs bietet die strukturelle Grundlage für professionelles Trading.",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Brauche ich Vorkenntnisse im Trading?",
          answer:
            "Nein. Dieser Kurs ist so konzipiert, dass er Sie vom absoluten Anfänger zum selbstbewussten Trader macht.",
        },
        {
          question: "Welche Tools benötige ich?",
          answer:
            "Sie benötigen lediglich eine Internetverbindung und ein kostenloses Konto auf einer Charting-Plattform.",
        },
        {
          question: "Wie lange dauert es, Krypto-Trading zu lernen?",
          answer:
            "Während Sie die Grundlagen in wenigen Wochen erlernen können, erfordert die Meisterung des Tradings Monate oder Jahre der Übung.",
        },
      ],
      ctaSectionTitle: "Bereit, ein besserer Trader zu werden?",
      ctaSectionDesc:
        "Hören Sie auf, sich auf Ihr Glück zu verlassen, und verlassen Sie sich auf eine Strategie. Greifen Sie noch heute auf unseren Kurs zu.",
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
      canonical: `https://www.kryptonal.com/${locale}/learn/crypto-trading-course`,
      languages: {
        en: "https://www.kryptonal.com/en/learn/crypto-trading-course",
        tr: "https://www.kryptonal.com/tr/learn/crypto-trading-course",
        pt: "https://www.kryptonal.com/pt/learn/crypto-trading-course",
        es: "https://www.kryptonal.com/es/learn/crypto-trading-course",
        fr: "https://www.kryptonal.com/fr/learn/crypto-trading-course",
        de: "https://www.kryptonal.com/de/learn/crypto-trading-course",
      },
    },
    openGraph: {
      title: t.title,
      description: t.intro.substring(0, 150),
      url: `https://www.kryptonal.com/${locale}/learn/crypto-trading-course`,
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
export default async function CryptoTradingCoursePage({ params }: PageProps) {
  const { locale } = await params;

  // Fetch BOTH dictionaries
  const t = await getDictionary(locale);
  const globalT = await getGlobalDictionary(locale);

  // Structural JSON-LD for rich snippets
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        name: t.title,
        description: t.intro.substring(0, 155),
        provider: { "@type": "Organization", name: "Kryptonal" },
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
              📈 Pro Trading
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
              <Link
                href="/tools"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl transition-all duration-200 text-center transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {t.ctaTools}
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
                    Module 1: Market Fundamentals
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Order books, liquidity, spreads, and how centralized and
                    decentralized exchanges function.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Module 2: Technical Analysis Core
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Reading candlestick patterns, drawing support/resistance,
                    and understanding trendlines.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Module 3: Advanced Indicators
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Mastering RSI, MACD, Moving Averages (EMA/SMA), and
                    Fibonacci retracement levels.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Module 4: Risk Management
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Calculating position sizing, setting strict stop-losses, and
                    managing Risk-to-Reward (R:R) ratios.
                  </p>
                </div>
              </div>
            </div>

            {/* DEDICATED TOOLS INTERNAL LINK SECTION */}
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
                  {t.toolsLinkTitle}
                </h3>
                <p className="text-slate-300 mb-6 max-w-2xl">
                  {t.toolsLinkBody}
                </p>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold transition-colors group no-underline"
                >
                  Explore Kryptonal Tools
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
                    Formulate a personalized, rule-based trading strategy.
                  </li>
                  <li>
                    Identify profitable entry and exit points objectively.
                  </li>
                  <li>Control emotions during extreme market volatility.</li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="text-xl font-semibold text-white mb-3 mt-0">
                  ⚠️ {t.mistakesTitle}
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm list-disc pl-4">
                  <li>Revenge trading after a significant loss.</li>
                  <li>Ignoring macro-economic factors and news cycles.</li>
                  <li>
                    Over-leveraging capital on high-risk futures positions.
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
              <button className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg text-sm transition-colors">
                {t.ctaStart}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} t={globalT} />
    </>
  );
}
