import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";

type Locale = "en" | "tr" | "pt" | "es" | "fr" | "de";
type PageProps = { params: Promise<{ locale: string }> };
type LegalSectionItem = readonly [string, string];

const validLocales: Locale[] = ["en", "tr", "pt", "es", "fr", "de"];

function getLocale(locale: string): Locale {
  return validLocales.includes(locale as Locale) ? (locale as Locale) : "en";
}

const content = {
  en: {
    title: "Privacy Policy",
    metaTitle: "Privacy Policy | Kryptonal",
    description:
      "Learn how Kryptonal handles privacy, security, cookies, and user information.",
    badge: "Legal Center",
    lastUpdated: "Last Updated: June 24, 2026",
    notice:
      "Kryptonal currently does not intentionally collect personal information beyond basic technical website operation.",
    toc: "On this page",
    sections: [
      [
        "Introduction",
        "Kryptonal is a cryptocurrency, blockchain, Web3 education, market intelligence, and research platform.",
      ],
      [
        "Information We Collect",
        "Kryptonal does not intentionally collect personal information at this stage. Basic technical server logs may exist for website operation, security, debugging, uptime monitoring, and performance protection.",
      ],
      [
        "Cookies and Analytics",
        "Basic cookies may be used for website functionality. Analytics tools may be introduced in the future, and consent will be requested where required.",
      ],
      [
        "Future Services",
        "Kryptonal may later introduce user accounts, watchlists, portfolios, newsletters, alerts, subscriptions, AI tools, premium services, and personalized dashboards. Consent will be requested before collecting additional personal information.",
      ],
      [
        "How Information May Be Used",
        "Future information may be used to improve services, personalize experience, support security, provide customer support, improve products, and send requested communications.",
      ],
      [
        "Third-Party Services",
        "Kryptonal may use services such as CoinGecko, DefiLlama, news APIs, analytics platforms, hosting providers, and security tools.",
      ],
      [
        "Security",
        "Kryptonal aims to use reasonable security practices including HTTPS, access controls, data minimization, secure infrastructure, and limited retention. No online service can guarantee absolute security.",
      ],
      [
        "User Rights",
        "Depending on your location, including under GDPR where applicable, you may have rights to access, correct, delete, restrict, export, or withdraw consent for your personal information.",
      ],
      [
        "International Users",
        "Kryptonal may be accessed globally. Technical information may be processed in countries different from your own depending on hosting and service providers.",
      ],
      [
        "Children’s Privacy",
        "Kryptonal is not designed for children and does not knowingly collect personal information from children.",
      ],
      [
        "Contact Information",
        "For privacy questions, contact Kryptonal through the official contact channel provided on the website.",
      ],
      [
        "Updates to This Policy",
        "Kryptonal may update this Privacy Policy as services evolve. The latest version will be posted on this page.",
      ],
      [
        "Crypto Disclaimer",
        "Blockchain, cryptocurrency, Web3, and digital assets involve market, technical, regulatory, smart contract, liquidity, and loss risks. Kryptonal does not provide financial advice.",
      ],
    ] as const,
  },

  tr: {
    title: "Gizlilik Politikası",
    metaTitle: "Gizlilik Politikası | Kryptonal",
    description:
      "Kryptonal’ın gizlilik, güvenlik, çerezler ve kullanıcı bilgilerini nasıl ele aldığını öğrenin.",
    badge: "Hukuk Merkezi",
    lastUpdated: "Son Güncelleme: 24 Haziran 2026",
    notice:
      "Kryptonal şu anda temel teknik web sitesi işleyişi dışında kasıtlı olarak kişisel bilgi toplamaz.",
    toc: "Bu sayfada",
    sections: [
      [
        "Giriş",
        "Kryptonal; kripto para, blockchain, Web3 eğitimi, piyasa zekâsı ve araştırma platformudur.",
      ],
      [
        "Topladığımız Bilgiler",
        "Kryptonal bu aşamada kasıtlı olarak kişisel bilgi toplamaz. Web sitesi çalışması, güvenlik, hata ayıklama, çalışma süresi takibi ve performans koruması için temel teknik sunucu kayıtları oluşabilir.",
      ],
      [
        "Çerezler ve Analitik",
        "Temel çerezler web sitesi işlevselliği için kullanılabilir. Analitik araçları gelecekte eklenebilir ve gerekli yerlerde onay istenecektir.",
      ],
      [
        "Gelecek Hizmetler",
        "Kryptonal ileride kullanıcı hesapları, izleme listeleri, portföyler, bültenler, uyarılar, abonelikler, yapay zekâ araçları, premium hizmetler ve kişiselleştirilmiş paneller sunabilir. Ek kişisel bilgi toplamadan önce onay istenecektir.",
      ],
      [
        "Bilgiler Nasıl Kullanılabilir",
        "Gelecekte bilgiler hizmetleri geliştirmek, deneyimi kişiselleştirmek, güvenliği desteklemek, müşteri desteği sağlamak, ürünleri iyileştirmek ve talep edilen iletişimleri göndermek için kullanılabilir.",
      ],
      [
        "Üçüncü Taraf Hizmetler",
        "Kryptonal CoinGecko, DefiLlama, haber API’leri, analitik platformları, barındırma sağlayıcıları ve güvenlik araçları gibi hizmetler kullanabilir.",
      ],
      [
        "Güvenlik",
        "Kryptonal HTTPS, erişim kontrolleri, veri minimizasyonu, güvenli altyapı ve sınırlı saklama gibi makul güvenlik uygulamalarını hedefler. Hiçbir çevrimiçi hizmet mutlak güvenlik garanti edemez.",
      ],
      [
        "Kullanıcı Hakları",
        "Konumunuza bağlı olarak ve GDPR geçerli olduğunda, kişisel bilgilerinize erişme, düzeltme, silme, kısıtlama, dışa aktarma veya onayı geri çekme haklarınız olabilir.",
      ],
      [
        "Uluslararası Kullanıcılar",
        "Kryptonal küresel olarak erişilebilir. Teknik bilgiler, barındırma ve hizmet sağlayıcılarına bağlı olarak kendi ülkenizden farklı ülkelerde işlenebilir.",
      ],
      [
        "Çocukların Gizliliği",
        "Kryptonal çocuklar için tasarlanmamıştır ve çocuklardan bilerek kişisel bilgi toplamaz.",
      ],
      [
        "İletişim Bilgileri",
        "Gizlilik soruları için web sitesinde sağlanan resmi iletişim kanalı üzerinden Kryptonal ile iletişime geçin.",
      ],
      [
        "Politika Güncellemeleri",
        "Kryptonal hizmetleri geliştikçe bu Gizlilik Politikasını güncelleyebilir. En güncel sürüm bu sayfada yayınlanacaktır.",
      ],
      [
        "Kripto Feragatnamesi",
        "Blockchain, kripto para, Web3 ve dijital varlıklar piyasa, teknik, düzenleyici, akıllı sözleşme, likidite ve kayıp riskleri içerir. Kryptonal finansal tavsiye vermez.",
      ],
    ] as const,
  },

  pt: {
    title: "Política de Privacidade",
    metaTitle: "Política de Privacidade | Kryptonal",
    description:
      "Saiba como a Kryptonal lida com privacidade, segurança, cookies e informações do usuário.",
    badge: "Centro Legal",
    lastUpdated: "Última atualização: 24 de junho de 2026",
    notice:
      "Atualmente, a Kryptonal não coleta intencionalmente informações pessoais além da operação técnica básica do site.",
    toc: "Nesta página",
    sections: [
      [
        "Introdução",
        "A Kryptonal é uma plataforma de educação sobre criptomoedas, blockchain, Web3, inteligência de mercado e pesquisa.",
      ],
      [
        "Informações que Coletamos",
        "Nesta fase, a Kryptonal não coleta intencionalmente informações pessoais. Registros técnicos básicos do servidor podem existir para operação, segurança, depuração, monitoramento e desempenho do site.",
      ],
      [
        "Cookies e Analytics",
        "Cookies básicos podem ser usados para funcionalidade do site. Ferramentas de analytics podem ser introduzidas no futuro, com consentimento quando exigido.",
      ],
      [
        "Serviços Futuros",
        "A Kryptonal pode introduzir contas de usuário, watchlists, portfólios, newsletters, alertas, assinaturas, ferramentas de IA, serviços premium e painéis personalizados. O consentimento será solicitado antes da coleta de informações pessoais adicionais.",
      ],
      [
        "Como as Informações Podem Ser Usadas",
        "Informações futuras podem ser usadas para melhorar serviços, personalizar a experiência, apoiar segurança, oferecer suporte ao cliente, melhorar produtos e enviar comunicações solicitadas.",
      ],
      [
        "Serviços de Terceiros",
        "A Kryptonal pode usar serviços como CoinGecko, DefiLlama, APIs de notícias, plataformas de analytics, provedores de hospedagem e ferramentas de segurança.",
      ],
      [
        "Segurança",
        "A Kryptonal busca usar práticas razoáveis de segurança, incluindo HTTPS, controles de acesso, minimização de dados, infraestrutura segura e retenção limitada. Nenhum serviço online pode garantir segurança absoluta.",
      ],
      [
        "Direitos do Usuário",
        "Dependendo da sua localização, incluindo quando o GDPR for aplicável, você pode ter direitos de acesso, correção, exclusão, restrição, exportação ou retirada de consentimento.",
      ],
      [
        "Usuários Internacionais",
        "A Kryptonal pode ser acessada globalmente. Informações técnicas podem ser processadas em países diferentes do seu, dependendo dos provedores de hospedagem e serviços.",
      ],
      [
        "Privacidade das Crianças",
        "A Kryptonal não é destinada a crianças e não coleta intencionalmente informações pessoais de crianças.",
      ],
      [
        "Contato",
        "Para dúvidas sobre privacidade, entre em contato com a Kryptonal pelo canal oficial indicado no site.",
      ],
      [
        "Atualizações desta Política",
        "A Kryptonal pode atualizar esta Política de Privacidade conforme os serviços evoluem. A versão mais recente será publicada nesta página.",
      ],
      [
        "Aviso sobre Cripto",
        "Blockchain, criptomoedas, Web3 e ativos digitais envolvem riscos de mercado, técnicos, regulatórios, contratos inteligentes, liquidez e perdas. A Kryptonal não fornece aconselhamento financeiro.",
      ],
    ] as const,
  },

  es: {
    title: "Política de Privacidad",
    metaTitle: "Política de Privacidad | Kryptonal",
    description:
      "Conoce cómo Kryptonal gestiona la privacidad, la seguridad, las cookies y la información del usuario.",
    badge: "Centro Legal",
    lastUpdated: "Última actualización: 24 de junio de 2026",
    notice:
      "Actualmente, Kryptonal no recopila intencionalmente información personal más allá de la operación técnica básica del sitio.",
    toc: "En esta página",
    sections: [
      [
        "Introducción",
        "Kryptonal es una plataforma de educación sobre criptomonedas, blockchain, Web3, inteligencia de mercado e investigación.",
      ],
      [
        "Información que Recopilamos",
        "En esta etapa, Kryptonal no recopila intencionalmente información personal. Pueden existir registros técnicos básicos del servidor para operación, seguridad, depuración, monitoreo y rendimiento.",
      ],
      [
        "Cookies y Analítica",
        "Se pueden usar cookies básicas para la funcionalidad del sitio. En el futuro se podrán introducir herramientas de analítica, solicitando consentimiento cuando sea necesario.",
      ],
      [
        "Servicios Futuros",
        "Kryptonal puede introducir cuentas de usuario, listas de seguimiento, portafolios, newsletters, alertas, suscripciones, herramientas de IA, servicios premium y paneles personalizados. Se solicitará consentimiento antes de recopilar información personal adicional.",
      ],
      [
        "Cómo Puede Usarse la Información",
        "La información futura puede usarse para mejorar servicios, personalizar la experiencia, apoyar la seguridad, ofrecer soporte, mejorar productos y enviar comunicaciones solicitadas.",
      ],
      [
        "Servicios de Terceros",
        "Kryptonal puede usar servicios como CoinGecko, DefiLlama, APIs de noticias, plataformas de analítica, proveedores de hosting y herramientas de seguridad.",
      ],
      [
        "Seguridad",
        "Kryptonal busca usar prácticas razonables de seguridad, incluyendo HTTPS, controles de acceso, minimización de datos, infraestructura segura y retención limitada. Ningún servicio online puede garantizar seguridad absoluta.",
      ],
      [
        "Derechos del Usuario",
        "Dependiendo de tu ubicación, incluso bajo GDPR cuando corresponda, puedes tener derechos de acceso, corrección, eliminación, restricción, exportación o retirada del consentimiento.",
      ],
      [
        "Usuarios Internacionales",
        "Kryptonal puede ser accedido globalmente. La información técnica puede procesarse en países distintos al tuyo dependiendo de los proveedores de hosting y servicios.",
      ],
      [
        "Privacidad de Menores",
        "Kryptonal no está diseñado para niños y no recopila intencionalmente información personal de menores.",
      ],
      [
        "Contacto",
        "Para preguntas de privacidad, contacta a Kryptonal mediante el canal oficial indicado en el sitio web.",
      ],
      [
        "Actualizaciones de esta Política",
        "Kryptonal puede actualizar esta Política de Privacidad conforme evolucionen sus servicios. La versión más reciente se publicará en esta página.",
      ],
      [
        "Aviso sobre Cripto",
        "Blockchain, criptomonedas, Web3 y activos digitales implican riesgos de mercado, técnicos, regulatorios, contratos inteligentes, liquidez y pérdidas. Kryptonal no ofrece asesoramiento financiero.",
      ],
    ] as const,
  },

  fr: {
    title: "Politique de Confidentialité",
    metaTitle: "Politique de Confidentialité | Kryptonal",
    description:
      "Découvrez comment Kryptonal gère la confidentialité, la sécurité, les cookies et les informations utilisateur.",
    badge: "Centre Juridique",
    lastUpdated: "Dernière mise à jour : 24 juin 2026",
    notice:
      "Kryptonal ne collecte actuellement pas intentionnellement d’informations personnelles au-delà du fonctionnement technique de base du site.",
    toc: "Sur cette page",
    sections: [
      [
        "Introduction",
        "Kryptonal est une plateforme d’éducation crypto, blockchain, Web3, d’intelligence de marché et de recherche.",
      ],
      [
        "Informations que Nous Collectons",
        "À ce stade, Kryptonal ne collecte pas intentionnellement d’informations personnelles. Des journaux techniques de serveur peuvent exister pour le fonctionnement, la sécurité, le débogage, la surveillance et la performance du site.",
      ],
      [
        "Cookies et Analytics",
        "Des cookies de base peuvent être utilisés pour le fonctionnement du site. Des outils d’analyse pourront être introduits à l’avenir, avec consentement lorsque requis.",
      ],
      [
        "Services Futurs",
        "Kryptonal pourra proposer des comptes utilisateurs, watchlists, portefeuilles, newsletters, alertes, abonnements, outils IA, services premium et tableaux de bord personnalisés. Un consentement sera demandé avant toute collecte supplémentaire d’informations personnelles.",
      ],
      [
        "Utilisation Possible des Informations",
        "Les informations futures pourront être utilisées pour améliorer les services, personnaliser l’expérience, renforcer la sécurité, fournir un support client, améliorer les produits et envoyer les communications demandées.",
      ],
      [
        "Services Tiers",
        "Kryptonal peut utiliser des services comme CoinGecko, DefiLlama, des API d’actualités, des plateformes d’analyse, des hébergeurs et des outils de sécurité.",
      ],
      [
        "Sécurité",
        "Kryptonal vise à appliquer des pratiques raisonnables de sécurité, notamment HTTPS, contrôles d’accès, minimisation des données, infrastructure sécurisée et conservation limitée. Aucun service en ligne ne peut garantir une sécurité absolue.",
      ],
      [
        "Droits des Utilisateurs",
        "Selon votre localisation, notamment sous le RGPD lorsque applicable, vous pouvez disposer de droits d’accès, correction, suppression, limitation, exportation ou retrait du consentement.",
      ],
      [
        "Utilisateurs Internationaux",
        "Kryptonal peut être consulté dans le monde entier. Les informations techniques peuvent être traitées dans des pays différents du vôtre selon les hébergeurs et prestataires.",
      ],
      [
        "Confidentialité des Enfants",
        "Kryptonal n’est pas destiné aux enfants et ne collecte pas sciemment d’informations personnelles auprès d’enfants.",
      ],
      [
        "Contact",
        "Pour toute question de confidentialité, contactez Kryptonal via le canal officiel indiqué sur le site.",
      ],
      [
        "Mises à Jour de cette Politique",
        "Kryptonal peut mettre à jour cette Politique de Confidentialité à mesure que ses services évoluent. La dernière version sera publiée sur cette page.",
      ],
      [
        "Avertissement Crypto",
        "La blockchain, les cryptomonnaies, le Web3 et les actifs numériques comportent des risques de marché, techniques, réglementaires, de contrats intelligents, de liquidité et de perte. Kryptonal ne fournit pas de conseil financier.",
      ],
    ] as const,
  },

  de: {
    title: "Datenschutzerklärung",
    metaTitle: "Datenschutzerklärung | Kryptonal",
    description:
      "Erfahren Sie, wie Kryptonal Datenschutz, Sicherheit, Cookies und Nutzerinformationen behandelt.",
    badge: "Rechtszentrum",
    lastUpdated: "Zuletzt aktualisiert: 24. Juni 2026",
    notice:
      "Kryptonal sammelt derzeit nicht absichtlich personenbezogene Daten über den grundlegenden technischen Website-Betrieb hinaus.",
    toc: "Auf dieser Seite",
    sections: [
      [
        "Einleitung",
        "Kryptonal ist eine Plattform für Kryptowährungen, Blockchain, Web3-Bildung, Marktinformationen und Forschung.",
      ],
      [
        "Informationen, die wir sammeln",
        "In dieser Phase sammelt Kryptonal nicht absichtlich personenbezogene Daten. Grundlegende technische Serverprotokolle können für Website-Betrieb, Sicherheit, Debugging, Verfügbarkeitsüberwachung und Leistungsschutz entstehen.",
      ],
      [
        "Cookies und Analytics",
        "Grundlegende Cookies können für die Website-Funktionalität verwendet werden. Analytics-Tools können künftig eingeführt werden, wobei erforderliche Einwilligungen eingeholt werden.",
      ],
      [
        "Zukünftige Dienste",
        "Kryptonal kann künftig Nutzerkonten, Watchlists, Portfolios, Newsletter, Benachrichtigungen, Abonnements, KI-Tools, Premium-Dienste und personalisierte Dashboards einführen. Vor der Erhebung zusätzlicher personenbezogener Daten wird eine Einwilligung eingeholt.",
      ],
      [
        "Wie Informationen verwendet werden können",
        "Zukünftige Informationen können zur Verbesserung von Diensten, Personalisierung, Sicherheit, Kundenbetreuung, Produktverbesserung und zum Versand gewünschter Mitteilungen verwendet werden.",
      ],
      [
        "Drittanbieter-Dienste",
        "Kryptonal kann Dienste wie CoinGecko, DefiLlama, Nachrichten-APIs, Analytics-Plattformen, Hosting-Anbieter und Sicherheitstools verwenden.",
      ],
      [
        "Sicherheit",
        "Kryptonal bemüht sich um angemessene Sicherheitspraktiken wie HTTPS, Zugriffskontrollen, Datenminimierung, sichere Infrastruktur und begrenzte Speicherung. Kein Online-Dienst kann absolute Sicherheit garantieren.",
      ],
      [
        "Nutzerrechte",
        "Je nach Standort, einschließlich DSGVO sofern anwendbar, können Sie Rechte auf Zugriff, Berichtigung, Löschung, Einschränkung, Export oder Widerruf der Einwilligung haben.",
      ],
      [
        "Internationale Nutzer",
        "Kryptonal kann weltweit aufgerufen werden. Technische Informationen können je nach Hosting- und Dienstanbietern in anderen Ländern verarbeitet werden.",
      ],
      [
        "Datenschutz von Kindern",
        "Kryptonal ist nicht für Kinder bestimmt und sammelt wissentlich keine personenbezogenen Daten von Kindern.",
      ],
      [
        "Kontaktinformationen",
        "Bei Datenschutzfragen kontaktieren Sie Kryptonal über den offiziellen Kontaktkanal auf der Website.",
      ],
      [
        "Aktualisierungen dieser Richtlinie",
        "Kryptonal kann diese Datenschutzerklärung aktualisieren, wenn sich die Dienste weiterentwickeln. Die neueste Version wird auf dieser Seite veröffentlicht.",
      ],
      [
        "Krypto-Hinweis",
        "Blockchain, Kryptowährungen, Web3 und digitale Vermögenswerte beinhalten Markt-, technische, regulatorische, Smart-Contract-, Liquiditäts- und Verlustrisiken. Kryptonal bietet keine Finanzberatung.",
      ],
    ] as const,
  },
} satisfies Record<Locale, any>;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = getLocale(locale);
  const t = content[lang];
  const url = `${siteUrl}/${lang}/privacy`;

  return {
    title: t.metaTitle,
    description: t.description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: t.metaTitle,
      description: t.description,
      url,
      siteName: "Kryptonal",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.metaTitle,
      description: t.description,
    },
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  const lang = getLocale(locale);
  const t = content[lang];
  const dict = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} t={dict} />
      <main className="min-h-screen bg-[#020617] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">
              {t.badge}
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              {t.title}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              {t.description}
            </p>

            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm leading-7 text-emerald-100">
              <strong>{t.lastUpdated}</strong>
              <br />
              {t.notice}
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="hidden lg:block">
              <nav className="sticky top-24 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <p className="mb-4 text-sm font-bold text-slate-400">{t.toc}</p>
                <div className="space-y-2">
                  {t.sections.map((section, index) => {
                    const [title] = section;

                    return (
                      <a
                        key={title}
                        href={`#section-${index}`}
                        className="block rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                      >
                        {title}
                      </a>
                    );
                  })}
                </div>
              </nav>
            </aside>

            <article className="space-y-5">
              {t.sections.map((section, index) => {
                const [title, body] = section;

                return (
                  <section
                    key={title}
                    id={`section-${index}`}
                    className={`scroll-mt-28 rounded-3xl border p-6 leading-8 backdrop-blur md:p-8 ${
                      index === t.sections.length - 1
                        ? "border-amber-300/20 bg-amber-300/10 text-amber-100"
                        : "border-white/10 bg-white/[0.035] text-slate-300"
                    }`}
                  >
                    <h2 className="mb-4 text-2xl font-black text-white">
                      {index + 1}. {title}
                    </h2>
                    <p>{body}</p>
                  </section>
                );
              })}
            </article>
          </div>
        </section>
      </main>
      <Footer locale={locale} t={dict} />
    </>
  );
}
