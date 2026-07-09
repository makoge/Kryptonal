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
      title: "Learn About the Blockchain: The Ultimate Beginner's Guide",
      intro:
        "Demystify the technology powering the future of digital assets. Discover how blockchain works, why it is secure, and how decentralized networks are reshaping the global economy.",
      ctaStart: "Start Learning",
      ctaBlog: "Explore Our Blog",
      whatIsTitle: "What Exactly is a Blockchain?",
      whatIsBody:
        "At its core, a blockchain is a decentralized, immutable ledger that records transactions across a peer-to-peer network. Instead of relying on a central authority like a bank or government, validation is handled collectively by nodes using cryptographic consensus rules. Once data is written into a block and chained to the previous one, changing it becomes computationally impossible.",
      curriculumTitle: "Core Elements of Blockchain Technology",
      blogLinkTitle: "Stay Ahead of the Curve with the Kryptonal Blog",
      blogLinkBody:
        "Understanding core blockchain theory is just the first step. The Web3 landscape shifts rapidly with new protocol upgrades, consensus innovations, and market changes. To transition from basic theory to real-world applications, make sure to regularly read the Kryptonal Blog.",
      benefitsTitle: "Why Blockchain Matters",
      mistakesTitle: "Common Misconceptions",
      summaryTitle: "Educational Summary",
      summaryBody:
        "Blockchain is far more than just the underlying foundation for cryptocurrencies. It represents a fundamental paradigm shift in how trust, ownership, and data integrity are handled globally without relying on central intermediaries.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          question: "Is blockchain the same thing as Bitcoin?",
          answer:
            "No. Bitcoin is a digital currency, whereas blockchain is the foundational database technology that enables Bitcoin to operate securely without a central party.",
        },
        {
          question: "Can a blockchain be hacked or altered?",
          answer:
            "Altering an established, highly decentralized public blockchain (like Bitcoin or Ethereum) is practically impossible because it requires controlling more than 50% of the network's computing power or staked assets simultaneously.",
        },
        {
          question: "Where can I read daily updates and ecosystem analysis?",
          answer:
            "You can find regular, breakdown analysis of new blockchain updates, layer-2 solutions, and industry trends directly on the Kryptonal Blog.",
        },
      ],
      ctaSectionTitle: "Ready to Deepen Your Web3 Knowledge?",
      ctaSectionDesc:
        "Combine architectural theory with real-time market insights. Explore Kryptonal's specialized analysis and resources today.",
    },
    tr: {
      title: "Blokzinciri Hakkında Bilgi Edinin: Tam Başlangıç Rehberi",
      intro:
        "Dijital varlıkların geleceğine güç veren teknolojiyi anlamlandırın. Blokzincirinin nasıl çalıştığını, neden güvenli olduğunu ve merkeziyetsiz ağların küresel ekonomiyi nasıl yeniden şekillendirdiğini keşfedin.",
      ctaStart: "Öğrenmeye Başla",
      ctaBlog: "Blogumuzu Keşfedin",
      whatIsTitle: "Blokzinciri Tam Olarak Nedir?",
      whatIsBody:
        "Temel olarak, bir blokzinciri, işlemleri eşler arası bir ağda kaydeden merkeziyetsiz ve değiştirilemez bir defterdir. Banka veya hükümet gibi merkezi bir otoriteye güvenmek yerine, doğrulama işlemi kriptografik konsensüs kuralları kullanan düğümler tarafından toplu olarak gerçekleştirilir.",
      curriculumTitle: "Blokzinciri Teknolojisinin Temel Unsurları",
      blogLinkTitle: "Kryptonal Blog ile Gelişmeleri Yakından Takip Edin",
      blogLinkBody:
        "Temel blokzinciri teorisini anlamak sadece ilk adımdır. Web3 dünyası yeni protokol güncellemeleriyle hızla değişiyor. Teoriden gerçek dünya uygulamalarına geçmek için Kryptonal Blog'u düzenli olarak okuduğunuzdan emin olun.",
      benefitsTitle: "Blokzinciri Neden Önemlidir?",
      mistakesTitle: "Sık Yapılan Yanlış Anlaşılmalar",
      summaryTitle: "Eğitim Özeti",
      summaryBody:
        "Blokzinciri, kripto paraların temel yapısı olmanın çok ötesindedir. Merkezi aracılara ihtiyaç duymadan küresel ölçekte güven, sahiplik ve veri bütünlüğünün nasıl yönetildiğine dair temel bir zihniyet değişimini temsil eder.",
      faqTitle: "Sıkça Sorulan Sorular",
      faqs: [
        {
          question: "Blokzinciri Bitcoin ile aynı şey mi?",
          answer:
            "Hayır. Bitcoin bir dijital para birimidir, blokzinciri ise Bitcoin'in merkezi bir taraf olmadan güvenli bir şekilde çalışmasını sağlayan temel veritabanı teknolojisidir.",
        },
        {
          question: "Bir blokzinciri hacklenebilir mi?",
          answer:
            "Bitcoin veya Ethereum gibi köklü ve son derece merkeziyetsiz bir halkaçık ağı değiştirmek, ağın işlem gücünün %50'sinden fazlasını kontrol etmeyi gerektirdiğinden pratikte imkansızdır.",
        },
        {
          question: "Günlük ekosistem analizlerini nereden okuyabilirim?",
          answer:
            "Yeni blokzinciri güncellemelerinin ve sektör trendlerinin düzenli analizlerini doğrudan Kryptonal Blog'da bulabilirsiniz.",
        },
      ],
      ctaSectionTitle: "Web3 Bilginizi Derinleştirmeye Hazır mısınız?",
      ctaSectionDesc:
        "Mimari teoriyi gerçek zamanlı piyasa içgörüleriyle birleştirin. Kryptonal'ın özel analizlerini bugün keşfedin.",
    },
    pt: {
      title: "Aprenda Sobre Blockchain: O Guia Definitivo para Iniciantes",
      intro:
        "Desmistifique a tecnologia que alimenta o futuro dos ativos digitais. Descubra como o blockchain funciona, por que é seguro e como redes descentralizadas moldam a economia.",
      ctaStart: "Começar a Aprender",
      ctaBlog: "Explore Nosso Blog",
      whatIsTitle: "O Que é Exatamente um Blockchain?",
      whatIsBody:
        "Em sua essência, um blockchain é um registro descentralizado e imutável que registra transações em uma rede ponto a ponto, validado coletivamente por nós usando regras de consenso criptográfico.",
      curriculumTitle: "Elementos Centrais da Tecnologia Blockchain",
      blogLinkTitle: "Fique à Frente da Curva com o Blog da Kryptonal",
      blogLinkBody:
        "Compreender a teoria central do blockchain é apenas o primeiro passo. Para acompanhar atualizações de protocolos e inovações de mercado, acompanhe regularmente o Blog da Kryptonal.",
      benefitsTitle: "Por Que o Blockchain Importa",
      mistakesTitle: "Equívocos Comuns",
      summaryTitle: "Resumo Educacional",
      summaryBody:
        "O blockchain representa uma mudança fundamental de paradigma na forma como a confiança, a propriedade e a integridade dos dados são tratadas globalmente.",
      faqTitle: "Perguntas Frequentes",
      faqs: [
        {
          question: "Blockchain é a mesma coisa que Bitcoin?",
          answer:
            "Não. O Bitcoin é uma moeda digital, enquanto o blockchain é a tecnologia de banco de dados subjacente.",
        },
        {
          question: "O blockchain pode ser alterado?",
          answer:
            "Alterar um blockchain público altamente descentralizado é praticamente impossível porque exigiria o controle de mais de 50% da rede.",
        },
        {
          question: "Onde encontro análises atualizadas?",
          answer:
            "Você pode encontrar análises regulares diretamente no Blog da Kryptonal.",
        },
      ],
      ctaSectionTitle: "Pronto para Aprofundar Seu Conhecimento Web3?",
      ctaSectionDesc:
        "Combine teoria estrutural com insights em tempo real. Explore os recursos da Kryptonal hoje.",
    },
    es: {
      title: "Aprende Sobre Blockchain: La Guía Definitiva para Principiantes",
      intro:
        "Desmitifica la tecnología que impulsa el futuro de los activos digitales. Descubre cómo funciona blockchain, por qué es seguro y cómo las redes descentralizadas transforman la economía.",
      ctaStart: "Empezar a Aprender",
      ctaBlog: "Explorar Nuestro Blog",
      whatIsTitle: "¿Qué es Exactamente una Blockchain?",
      whatIsBody:
        "En su esencia, una blockchain es un libro de contabilidad descentralizado e inmutable que registra transacciones en una red de igual a igual, validada colectivamente por nodos mediante reglas criptográficas.",
      curriculumTitle: "Elementos Centrales de la Tecnología Blockchain",
      blogLinkTitle: "Mantente a la Vanguardia con el Blog de Kryptonal",
      blogLinkBody:
        "Comprender la teoría central de la blockchain es solo el primer paso. Para pasar de la teoría a las aplicaciones del mundo real, asegúrate de leer regularmente el Blog de Kryptonal.",
      benefitsTitle: "Por Qué Importa la Blockchain",
      mistakesTitle: "Conceptos Erróneos Comunes",
      summaryTitle: "Resumen Educativo",
      summaryBody:
        "Blockchain representa un cambio de paradigma fundamental en la forma en que se manejan la confianza, la propiedad y la integridad de los datos a nivel mundial.",
      faqTitle: "Preguntas Frecuentes",
      faqs: [
        {
          question: "¿Es blockchain lo mismo que Bitcoin?",
          answer:
            "No. Bitcoin es una moneda digital, mientras que blockchain es la tecnología de base de datos subyacente.",
        },
        {
          question: "¿Se puede hackear una blockchain?",
          answer:
            "Modificar una blockchain pública altamente descentralizada es prácticamente imposible porque requiere controlar más del 50% del poder de cómputo de la red.",
        },
        {
          question: "¿Dónde puedo leer actualizaciones diarias?",
          answer:
            "Puedes encontrar análisis periódicos sobre soluciones de capa 2 y tendencias directamente en el Blog de Kryptonal.",
        },
      ],
      ctaSectionTitle: "¿Listo para Profundizar tu Conocimiento de Web3?",
      ctaSectionDesc:
        "Combina la teoría arquitectónica con información del mercado en tiempo real. Explora los recursos de Kryptonal hoy mismo.",
    },
    fr: {
      title: "Tout Savoir sur la Blockchain : Le Guide Ultime",
      intro:
        "Démystifiez la technologie qui propulse l'avenir des actifs numériques. Découvrez le fonctionnement de la blockchain, sa sécurité et l'impact des réseaux décentralisés.",
      ctaStart: "Commencer à Apprendre",
      ctaBlog: "Explorer Notre Blog",
      whatIsTitle: "Qu'est-ce qu'une Blockchain Exactement ?",
      whatIsBody:
        "À la base, une blockchain est un registre décentralisé et immuable qui enregistre les transactions sur un réseau de pair à pair, validé collectivement par des nœuds grâce à la cryptographie.",
      curriculumTitle: "Éléments Clés de la Technologie Blockchain",
      blogLinkTitle: "Restez Informé Grâce au Blog Kryptonal",
      blogLinkBody:
        "Comprendre la théorie de la blockchain n'est que la première étape. Pour suivre l'évolution rapide de l'écosystème Web3, lisez régulièrement le Blog Kryptonal.",
      benefitsTitle: "Pourquoi la Blockchain est Importante",
      mistakesTitle: "Idées Reçues Courantes",
      summaryTitle: "Résumé Éducatif",
      summaryBody:
        "La blockchain représente un changement de paradigme fondamental dans la gestion de la confiance, de la propriété et de l'intégrité des données à l'échelle mondiale.",
      faqTitle: "Questions Fréquentes",
      faqs: [
        {
          question: "La blockchain est-elle identique au Bitcoin ?",
          answer:
            "Non. Le Bitcoin est une monnaie numérique, tandis que la blockchain est la technologie de base de données sous-jacente.",
        },
        {
          question: "Une blockchain peut-elle être piratée ?",
          answer:
            "Modifier une blockchain publique hautement décentralisée est pratiquement impossible car cela nécessiterait le contrôle de plus de 50 % du réseau.",
        },
        {
          question: "Où trouver des analyses quotidiennes ?",
          answer:
            "Vous pouvez trouver des analyses régulières directement sur le Blog Kryptonal.",
        },
      ],
      ctaSectionTitle: "Prêt à Approfondir Vos Connaissances Web3 ?",
      ctaSectionDesc:
        "Combinez théorie structurelle et analyses de marché en temps réel. Explorez les ressources de Kryptonal dès aujourd'hui.",
    },
    de: {
      title: "Blockchain lernen: Der ultimative Leitfaden für Anfänger",
      intro:
        "Entmystifizieren Sie die Technologie, die die Zukunft digitaler Vermögenswerte sichert. Erfahren Sie, wie Blockchains funktionieren und warum dezentrale Netzwerke wichtig sind.",
      ctaStart: "Mit dem Lernen beginnen",
      ctaBlog: "Unseren Blog erkunden",
      whatIsTitle: "Was genau ist eine Blockchain?",
      whatIsBody:
        "Im Kern ist eine Blockchain ein dezentrales, unveränderliches Buchungssystem, das Transaktionen über ein Peer-to-Peer-Netzwerk aufzeichnet und kryptografisch validiert.",
      curriculumTitle: "Kernelemente der Blockchain-Technologie",
      blogLinkTitle: "Bleiben Sie auf dem Laufenden mit dem Kryptonal Blog",
      blogLinkBody:
        "Die Blockchain-Theorie zu verstehen, ist erst der Anfang. Um von der grauen Theorie zu realen Anwendungen überzugehen, sollten Sie regelmäßig den Kryptonal Blog lesen.",
      benefitsTitle: "Warum Blockchain wichtig ist",
      mistakesTitle: "Häufige Missverständnisse",
      summaryTitle: "Pädagogische Zusammenfassung",
      summaryBody:
        "Blockchain stellt einen grundlegenden Paradigmenwechsel dar, wie Vertrauen, Eigentum und Datenintegrität weltweit ohne zentrale Vermittler verwaltet werden.",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Ist Blockchain dasselbe wie Bitcoin?",
          answer:
            "Nein. Bitcoin ist eine digitale Währung, während Blockchain die zugrunde liegende Datenbanktechnologie ist.",
        },
        {
          question: "Kann eine Blockchain manipuliert werden?",
          answer:
            "Die Änderung einer etablierten, dezentralen Blockchain ist praktisch unmöglich, da man über 50 % der Netzwerkkontrolle bräuchte.",
        },
        {
          question: "Wo finde ich regelmäßige Updates?",
          answer:
            "Regelmäßige Analysen zu neuen Blockchain-Updates und Layer-2-Lösungen finden Sie direkt auf dem Kryptonal Blog.",
        },
      ],
      ctaSectionTitle: "Bereit, Ihr Web3-Wissen zu vertiefen?",
      ctaSectionDesc:
        "Verbinden Sie architektonische Theorie mit Echtzeit-Marktdaten. Entdecken Sie noch heute die Ressourcen von Kryptonal.",
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
      canonical: `https://www.kryptonal.com/${locale}/learn/blockchain`,
      languages: {
        en: "https://www.kryptonal.com/en/learn/blockchain",
        tr: "https://www.kryptonal.com/tr/learn/blockchain",
        pt: "https://www.kryptonal.com/pt/learn/blockchain",
        es: "https://www.kryptonal.com/es/learn/blockchain",
        fr: "https://www.kryptonal.com/fr/learn/blockchain",
        de: "https://www.kryptonal.com/de/learn/blockchain",
      },
    },
    openGraph: {
      title: t.title,
      description: t.intro.substring(0, 150),
      url: `https://www.kryptonal.com/${locale}/learn/blockchain`,
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
export default async function LearnBlockchainPage({ params }: PageProps) {
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
              🔗 Decentralized Architecture
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
                href="https://kryptonal.com/en/blog"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl transition-all duration-200 text-center transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {t.ctaBlog}
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

            {/* Structured Architecture Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-2">
                {t.curriculumTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Distributed Ledgers
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Data copies are stored across thousands of globally
                    distributed nodes, removing single points of failure.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Cryptographic Hashing
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Each block contains a unique hash of the previous block,
                    building an unbreakable mathematical chain.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Consensus Protocols
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Algorithms like Proof of Work (PoW) and Proof of Stake (PoS)
                    enforce network rules rules without intermediaries.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Smart Contracts
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Self-executing code logic stored on-chain that fires
                    automatically when conditions are met.
                  </p>
                </div>
              </div>
            </div>

            {/* REQ BLOG LINK BLOCK */}
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
                  {t.blogLinkTitle}
                </h3>
                <p className="text-slate-300 mb-6 max-w-2xl">
                  {t.blogLinkBody}
                </p>
                <Link
                  href="https://kryptonal.com/en/blog"
                  className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold transition-colors group no-underline"
                >
                  Visit the Kryptonal Blog
                  <span className="transform transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Benefits vs Misconceptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="text-xl font-semibold text-white mb-3 mt-0">
                  ✅ {t.benefitsTitle}
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm list-disc pl-4">
                  <li>
                    Absolute transparency via publicly auditable transaction
                    records.
                  </li>
                  <li>
                    Tamper-proof data structures ensure historical accuracy.
                  </li>
                  <li>
                    Direct transactions significantly lower platform transaction
                    costs.
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="text-xl font-semibold text-white mb-3 mt-0">
                  ⚠️ {t.mistakesTitle}
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm list-disc pl-4">
                  <li>
                    Believing that blockchains can easily modify data histories.
                  </li>
                  <li>
                    Confusing any private database setup with decentralized
                    public ledgers.
                  </li>
                  <li>
                    Assuming blockchain ecosystems only support financial
                    assets.
                  </li>
                </ul>
              </div>
            </div>

            {/* Contextual Summary Callout */}
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
                href="https://kryptonal.com/en/blog"
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg text-sm transition-colors"
              >
                {t.ctaBlog}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} t={globalT} />
    </>
  );
}
