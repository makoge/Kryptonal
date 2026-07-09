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
      title: "Top Free Cryptocurrency Courses: Learn Crypto from Scratch",
      intro:
        "Dive into the world of blockchain, DeFi, and digital assets without spending a dime. Discover the best free cryptocurrency courses to build your knowledge and trade with confidence.",
      ctaStart: "Start Learning",
      ctaBlog: "Read Our Blog",
      whatIsTitle: "Why Take a Free Cryptocurrency Course?",
      whatIsBody:
        "The cryptocurrency market is highly volatile and technologically complex. Jumping in without foundational knowledge is the most common reason new investors lose capital. Free cryptocurrency courses offer a risk-free environment to understand how blockchains operate, what gives digital assets value, and how to secure your private keys before you ever risk real money.",
      curriculumTitle: "What You Will Learn",
      blogLinkTitle: "Supplement Your Learning with the Kryptonal Blog",
      blogLinkBody:
        "While courses provide an excellent structured foundation, the crypto space evolves daily. To stay updated on live market trends, security alerts, and new token narratives, bookmark the Kryptonal Blog. It's the perfect companion to your free crypto education.",
      benefitsTitle: "Core Benefits of Free Education",
      mistakesTitle: "What to Watch Out For",
      summaryTitle: "Educational Summary",
      summaryBody:
        "Your best defense against market volatility and scams is education. Start with free foundational courses, master the basics of self-custody and blockchain mechanics, and continue reading daily market updates to refine your strategy.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          question: "Can I actually learn crypto trading for free?",
          answer:
            "Yes. Many reputable platforms and exchanges offer comprehensive free academies. However, remember that trading involves high risk; use free paper-trading tools alongside your courses before using real money.",
        },
        {
          question:
            "Do I need programming skills to learn about cryptocurrency?",
          answer:
            "Not at all. While developers need to know coding (like Solidity) to build smart contracts, everyday investors and users only need to understand the fundamental concepts of how these networks function.",
        },
        {
          question: "Where can I find daily updates after finishing my course?",
          answer:
            "The Kryptonal Blog is regularly updated with market analysis, security guides, and beginner-friendly tutorials to keep your knowledge sharp.",
        },
      ],
      ctaSectionTitle: "Ready to Master the Markets?",
      ctaSectionDesc:
        "Combine structured learning with real-time market data. Explore Kryptonal's free educational resources and live analytics today.",
    },
    tr: {
      title: "En İyi Ücretsiz Kripto Para Kursları: Sıfırdan Kripto Öğrenin",
      intro:
        "Tek kuruş harcamadan blokzinciri, DeFi ve dijital varlıklar dünyasına dalın. Bilginizi artırmak ve güvenle işlem yapmak için en iyi ücretsiz kripto para kurslarını keşfedin.",
      ctaStart: "Öğrenmeye Başla",
      ctaBlog: "Blogumuzu Oku",
      whatIsTitle: "Neden Ücretsiz Bir Kripto Para Kursu Almalısınız?",
      whatIsBody:
        "Kripto para piyasası oldukça değişkendir ve teknolojik olarak karmaşıktır. Temel bilgi olmadan piyasaya girmek, yeni yatırımcıların sermaye kaybetmesinin en yaygın nedenidir. Ücretsiz kurslar, gerçek parayı riske atmadan önce blokzincirlerin nasıl çalıştığını ve özel anahtarlarınızı nasıl güvence altına alacağınızı anlamanız için risksiz bir ortam sunar.",
      curriculumTitle: "Neler Öğreneceksiniz?",
      blogLinkTitle: "Öğreniminizi Kryptonal Blog ile Destekleyin",
      blogLinkBody:
        "Kurslar mükemmel bir yapılandırılmış temel sağlasa da, kripto dünyası her gün gelişmektedir. Canlı piyasa trendleri, güvenlik uyarıları ve yeni token anlatılarından haberdar olmak için Kryptonal Blog'u takip edin.",
      benefitsTitle: "Ücretsiz Eğitimin Temel Faydaları",
      mistakesTitle: "Dikkat Edilmesi Gerekenler",
      summaryTitle: "Eğitim Özeti",
      summaryBody:
        "Piyasa dalgalanmalarına ve dolandırıcılıklara karşı en iyi savunmanız eğitimdir. Ücretsiz temel kurslarla başlayın, blokzinciri mekaniğinin temellerini öğrenin ve stratejinizi geliştirmek için günlük piyasa güncellemelerini okumaya devam edin.",
      faqTitle: "Sıkça Sorulan Sorular",
      faqs: [
        {
          question: "Kripto ticaretini gerçekten ücretsiz öğrenebilir miyim?",
          answer:
            "Evet. Birçok saygın platform kapsamlı ücretsiz akademiler sunar. Ancak, ticaretin yüksek risk içerdiğini unutmayın.",
        },
        {
          question:
            "Kripto para öğrenmek için programlama becerilerine ihtiyacım var mı?",
          answer:
            "Kesinlikle hayır. Geliştiricilerin kodlamayı bilmesi gerekirken, günlük yatırımcıların sadece bu ağların nasıl çalıştığına dair temel kavramları anlaması yeterlidir.",
        },
        {
          question:
            "Kursumu bitirdikten sonra günlük güncellemeleri nerede bulabilirim?",
          answer:
            "Kryptonal Blog, bilginizi canlı tutmak için piyasa analizi, güvenlik rehberleri ve yeni başlayanlar dostu eğitimlerle düzenli olarak güncellenmektedir.",
        },
      ],
      ctaSectionTitle: "Piyasalara Hakim Olmaya Hazır mısınız?",
      ctaSectionDesc:
        "Yapılandırılmış öğrenimi gerçek zamanlı piyasa verileriyle birleştirin. Kryptonal'ın ücretsiz eğitim kaynaklarını bugün keşfedin.",
    },
    pt: {
      title: "Melhores Cursos Gratuitos de Criptomoedas: Aprenda do Zero",
      intro:
        "Mergulhe no mundo do blockchain, DeFi e ativos digitais sem gastar um centavo. Descubra os melhores cursos gratuitos para construir seu conhecimento e negociar com confiança.",
      ctaStart: "Comece a Aprender",
      ctaBlog: "Leia Nosso Blog",
      whatIsTitle: "Por Que Fazer um Curso de Criptomoedas Gratuito?",
      whatIsBody:
        "O mercado de criptomoedas é altamente volátil e tecnologicamente complexo. Entrar sem conhecimento básico é o principal motivo pelo qual novos investidores perdem capital. Cursos gratuitos oferecem um ambiente sem riscos para entender o blockchain e a segurança das carteiras.",
      curriculumTitle: "O Que Você Vai Aprender",
      blogLinkTitle: "Complemente Seu Aprendizado com o Blog da Kryptonal",
      blogLinkBody:
        "Enquanto os cursos fornecem uma base excelente, o espaço cripto evolui diariamente. Para se manter atualizado sobre tendências, alertas de segurança e novas narrativas, adicione o Blog da Kryptonal aos favoritos.",
      benefitsTitle: "Principais Benefícios",
      mistakesTitle: "O Que Observar",
      summaryTitle: "Resumo Educacional",
      summaryBody:
        "Sua melhor defesa contra golpes é a educação. Comece com cursos básicos gratuitos, domine a autocustódia e continue lendo atualizações de mercado para refinar sua estratégia.",
      faqTitle: "Perguntas Frequentes",
      faqs: [
        {
          question:
            "Posso realmente aprender a negociar criptomoedas de graça?",
          answer:
            "Sim. Muitas plataformas oferecem academias gratuitas abrangentes. Lembre-se, porém, que negociar envolve alto risco.",
        },
        {
          question: "Preciso de habilidades de programação?",
          answer:
            "De forma alguma. Investidores comuns só precisam entender os conceitos fundamentais de como essas redes funcionam.",
        },
        {
          question: "Onde encontro atualizações diárias?",
          answer:
            "O Blog da Kryptonal é atualizado regularmente com análises de mercado e guias de segurança.",
        },
      ],
      ctaSectionTitle: "Pronto para Dominar os Mercados?",
      ctaSectionDesc:
        "Combine aprendizado com dados de mercado em tempo real. Explore os recursos gratuitos da Kryptonal hoje.",
    },
    es: {
      title: "Mejores Cursos Gratuitos de Criptomonedas: Aprende desde Cero",
      intro:
        "Sumérgete en el mundo de blockchain, DeFi y los activos digitales sin gastar un centavo. Descubre los mejores cursos gratuitos para construir tu conocimiento y operar con confianza.",
      ctaStart: "Empezar a Aprender",
      ctaBlog: "Leer Nuestro Blog",
      whatIsTitle: "¿Por qué Tomar un Curso Gratuito de Criptomonedas?",
      whatIsBody:
        "El mercado de las criptomonedas es altamente volátil y tecnológicamente complejo. Entrar sin conocimientos fundamentales es la razón principal por la que los nuevos inversores pierden capital. Los cursos gratuitos ofrecen un entorno sin riesgos para entender cómo operan las blockchains.",
      curriculumTitle: "Lo Que Aprenderás",
      blogLinkTitle: "Complementa tu Aprendizaje con el Blog de Kryptonal",
      blogLinkBody:
        "Aunque los cursos proporcionan una base excelente, el espacio cripto evoluciona a diario. Para mantenerte actualizado sobre las tendencias del mercado, alertas de seguridad y nuevas narrativas, marca como favorito el Blog de Kryptonal.",
      benefitsTitle: "Beneficios Principales",
      mistakesTitle: "De Qué Debes Cuidarte",
      summaryTitle: "Resumen Educativo",
      summaryBody:
        "Tu mejor defensa contra la volatilidad y las estafas es la educación. Comienza con cursos básicos gratuitos, domina la autocustodia y continúa leyendo actualizaciones diarias.",
      faqTitle: "Preguntas Frecuentes",
      faqs: [
        {
          question: "¿Puedo aprender a operar con criptomonedas gratis?",
          answer:
            "Sí. Muchas plataformas ofrecen academias gratuitas completas. Sin embargo, recuerda que operar implica un alto riesgo.",
        },
        {
          question:
            "¿Necesito saber programar para aprender sobre criptomonedas?",
          answer:
            "En absoluto. Los inversores cotidianos solo necesitan comprender los conceptos fundamentales de cómo funcionan las redes.",
        },
        {
          question: "¿Dónde puedo encontrar actualizaciones diarias?",
          answer:
            "El Blog de Kryptonal se actualiza regularmente con análisis de mercado y tutoriales para principiantes.",
        },
      ],
      ctaSectionTitle: "¿Listo para Dominar los Mercados?",
      ctaSectionDesc:
        "Combina el aprendizaje estructurado con datos de mercado en tiempo real. Explora los recursos de Kryptonal hoy mismo.",
    },
    fr: {
      title: "Meilleurs Cours Gratuits sur les Crypto-monnaies",
      intro:
        "Plongez dans le monde de la blockchain, de la DeFi et des actifs numériques sans dépenser un centime. Découvrez les meilleurs cours pour développer vos connaissances.",
      ctaStart: "Commencer à Apprendre",
      ctaBlog: "Lire Notre Blog",
      whatIsTitle: "Pourquoi Suivre un Cours Gratuit sur les Cryptos ?",
      whatIsBody:
        "Le marché des crypto-monnaies est très volatil et complexe. Se lancer sans connaissances de base est la principale raison pour laquelle les nouveaux investisseurs perdent du capital. Les cours gratuits offrent un environnement sans risque pour comprendre le fonctionnement des blockchains.",
      curriculumTitle: "Ce Que Vous Allez Apprendre",
      blogLinkTitle: "Complétez Votre Apprentissage avec le Blog Kryptonal",
      blogLinkBody:
        "Bien que les cours fournissent une excellente base, l'espace crypto évolue tous les jours. Pour rester informé des tendances du marché et des alertes de sécurité, ajoutez le Blog Kryptonal à vos favoris.",
      benefitsTitle: "Principaux Avantages",
      mistakesTitle: "Ce Qu'il Faut Surveiller",
      summaryTitle: "Résumé Éducatif",
      summaryBody:
        "Votre meilleure défense contre la volatilité est l'éducation. Commencez par des cours de base gratuits, maîtrisez l'auto-garde et continuez à lire les mises à jour quotidiennes du marché.",
      faqTitle: "Questions Fréquentes",
      faqs: [
        {
          question:
            "Puis-je vraiment apprendre le trading de cryptos gratuitement ?",
          answer:
            "Oui. De nombreuses plateformes réputées proposent des académies gratuites. N'oubliez pas que le trading comporte des risques élevés.",
        },
        {
          question: "Ai-je besoin de compétences en programmation ?",
          answer:
            "Pas du tout. Les investisseurs ont seulement besoin de comprendre les concepts fondamentaux du fonctionnement de ces réseaux.",
        },
        {
          question: "Où puis-je trouver des mises à jour quotidiennes ?",
          answer:
            "Le Blog Kryptonal est régulièrement mis à jour avec des analyses de marché et des guides de sécurité.",
        },
      ],
      ctaSectionTitle: "Prêt à Maîtriser les Marchés ?",
      ctaSectionDesc:
        "Combinez un apprentissage structuré avec des données de marché en temps réel. Explorez les ressources de Kryptonal dès aujourd'hui.",
    },
    de: {
      title:
        "Die besten kostenlosen Kryptowährungs-Kurse: Krypto von Grund auf lernen",
      intro:
        "Tauchen Sie in die Welt von Blockchain, DeFi und digitalen Vermögenswerten ein, ohne einen Cent auszugeben. Entdecken Sie die besten kostenlosen Kurse, um Ihr Wissen zu erweitern.",
      ctaStart: "Mit dem Lernen beginnen",
      ctaBlog: "Unseren Blog lesen",
      whatIsTitle: "Warum einen kostenlosen Kryptowährungs-Kurs belegen?",
      whatIsBody:
        "Der Kryptowährungsmarkt ist hochgradig volatil und technologisch komplex. Ohne grundlegendes Wissen einzusteigen, ist der häufigste Grund für Kapitalverluste bei neuen Investoren. Kostenlose Kurse bieten eine risikofreie Umgebung, um zu verstehen, wie Blockchains funktionieren.",
      curriculumTitle: "Was Sie lernen werden",
      blogLinkTitle: "Ergänzen Sie Ihr Lernen mit dem Kryptonal Blog",
      blogLinkBody:
        "Während Kurse eine hervorragende Struktur bieten, entwickelt sich der Krypto-Raum täglich weiter. Um über Live-Markttrends, Sicherheitswarnungen und neue Token-Narrative auf dem Laufenden zu bleiben, setzen Sie ein Lesezeichen für den Kryptonal Blog.",
      benefitsTitle: "Kernvorteile der kostenlosen Bildung",
      mistakesTitle: "Worauf Sie achten sollten",
      summaryTitle: "Pädagogische Zusammenfassung",
      summaryBody:
        "Ihre beste Verteidigung gegen Marktvolatilität und Betrug ist Bildung. Beginnen Sie mit kostenlosen Grundkursen, meistern Sie die Grundlagen der Selbstverwahrung und lesen Sie täglich Marktupdates.",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Kann ich Krypto-Trading wirklich kostenlos lernen?",
          answer:
            "Ja. Viele renommierte Plattformen bieten umfassende kostenlose Akademien an. Denken Sie jedoch daran, dass der Handel mit hohen Risiken verbunden ist.",
        },
        {
          question: "Brauche ich Programmierkenntnisse?",
          answer:
            "Überhaupt nicht. Normale Investoren müssen nur die grundlegenden Konzepte verstehen, wie diese Netzwerke funktionieren.",
        },
        {
          question:
            "Wo finde ich nach Abschluss meines Kurses tägliche Updates?",
          answer:
            "Der Kryptonal Blog wird regelmäßig mit Marktanalysen, Sicherheitsleitfäden und anfängerfreundlichen Tutorials aktualisiert.",
        },
      ],
      ctaSectionTitle: "Bereit, die Märkte zu meistern?",
      ctaSectionDesc:
        "Kombinieren Sie strukturiertes Lernen mit Echtzeit-Marktdaten. Entdecken Sie noch heute die kostenlosen Bildungsressourcen von Kryptonal.",
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
      canonical: `https://www.kryptonal.com/${locale}/learn/free-cryptocurrency-courses`,
      languages: {
        en: "https://www.kryptonal.com/en/learn/free-cryptocurrency-courses",
        tr: "https://www.kryptonal.com/tr/learn/free-cryptocurrency-courses",
        pt: "https://www.kryptonal.com/pt/learn/free-cryptocurrency-courses",
        es: "https://www.kryptonal.com/es/learn/free-cryptocurrency-courses",
        fr: "https://www.kryptonal.com/fr/learn/free-cryptocurrency-courses",
        de: "https://www.kryptonal.com/de/learn/free-cryptocurrency-courses",
      },
    },
    openGraph: {
      title: t.title,
      description: t.intro.substring(0, 150),
      url: `https://www.kryptonal.com/${locale}/learn/free-cryptocurrency-courses`,
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
export default async function FreeCryptoCoursesPage({ params }: PageProps) {
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
              📚 Web3 Education
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
              {/* Note: Linking directly to the blog as requested */}
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

            {/* Structured Curriculum Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-2">
                {t.curriculumTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Blockchain Basics
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Understand distributed ledgers, nodes, consensus mechanisms
                    (PoW vs PoS), and decentralized networks.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Wallet Security
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Learn the critical difference between hot and cold wallets,
                    seed phrases, and self-custody best practices.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    DeFi Mechanics
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Explore Decentralized Finance, liquidity pools, staking,
                    yield farming, and decentralized exchanges (DEXs).
                  </p>
                </div>
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <h3 className="text-teal-400 font-semibold mb-2 mt-0">
                    Trading Fundamentals
                  </h3>
                  <p className="text-sm text-slate-400 m-0">
                    Grasp basic technical analysis, reading candlesticks, market
                    cycles, and crucial risk management strategies.
                  </p>
                </div>
              </div>
            </div>

            {/* DEDICATED BLOG INTERNAL LINK SECTION (Required by Prompt) */}
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

            {/* Strategic Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="text-xl font-semibold text-white mb-3 mt-0">
                  ✅ {t.benefitsTitle}
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm list-disc pl-4">
                  <li>Zero financial risk while learning complex mechanics.</li>
                  <li>
                    Builds emotional discipline needed for volatile markets.
                  </li>
                  <li>
                    Teaches how to identify legitimate projects vs. scams.
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="text-xl font-semibold text-white mb-3 mt-0">
                  ⚠️ {t.mistakesTitle}
                </h3>
                <ul className="space-y-2 text-slate-400 text-sm list-disc pl-4">
                  <li>
                    "Free" courses that demand you sign up to a specific paid
                    exchange.
                  </li>
                  <li>
                    Courses promising guaranteed returns or "trading secrets".
                  </li>
                  <li>
                    Outdated curriculum (crypto tech moves in months, not
                    years).
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
