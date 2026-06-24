import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kryptonal.com";

type Locale = "en" | "tr" | "pt" | "es" | "fr" | "de";
type PageProps = { params: Promise<{ locale: string }> };
type Section = readonly [string, string, string];

const validLocales: Locale[] = ["en", "tr", "pt", "es", "fr", "de"];

function getLocale(locale: string): Locale {
  return validLocales.includes(locale as Locale) ? (locale as Locale) : "en";
}

const content = {
  en: {
    metaTitle: "Terms & Conditions | Kryptonal",
    description:
      "Read the terms governing the use of Kryptonal's crypto market analysis tools, educational content, and research platform.",
    badge: "Legal Center",
    title: "Terms & Conditions",
    intro:
      "These Terms govern your use of Kryptonal’s crypto market analysis, educational content, research tools, and market intelligence platform.",
    lastUpdated: "Last Updated: June 24, 2026",
    toc: "On this page",
    disclaimerTitle: "Educational Disclaimer",
    disclaimer:
      "Kryptonal provides educational market intelligence and research tools. Nothing on this website constitutes financial, investment, legal, or tax advice.",
    privacyLink: "Read Privacy Policy",
    sections: [
      [
        "acceptance",
        "Acceptance of Terms",
        "By accessing or using Kryptonal, you agree to these Terms & Conditions. If you do not agree, you should not use the website.",
      ],
      [
        "service",
        "Description of Service",
        "Kryptonal provides crypto market analysis, market cap research, educational content, crypto tools, news aggregation, gaming crypto research, cycle analysis, and research resources.",
      ],
      [
        "advice",
        "No Financial Advice",
        "Kryptonal is not a broker, exchange, wallet provider, custodian, investment advisor, financial institution, or regulated securities provider. All content is educational and informational only. Users are responsible for their own financial, tax, legal, and investment decisions.",
      ],
      [
        "risk",
        "Cryptocurrency Risk Disclosure",
        "Cryptocurrency and blockchain markets involve serious risks, including volatility, loss of capital, regulatory uncertainty, smart contract failures, liquidity risks, technical failures, market manipulation, and security risks.",
      ],
      [
        "accuracy",
        "Accuracy of Information",
        "Kryptonal may display market data, analytics, news, and research from third-party providers. Information may be delayed, incomplete, inaccurate, or changed without notice. Kryptonal does not guarantee accuracy, completeness, or reliability.",
      ],
      [
        "sources",
        "Third-Party Data Sources",
        "Kryptonal may use data from CoinGecko, DefiLlama, news providers, analytics services, hosting providers, and external websites. Kryptonal is not responsible for third-party data, websites, services, or content.",
      ],
      [
        "ip",
        "Intellectual Property",
        "Kryptonal’s branding, design, content, interface, research structure, tools, and original materials are protected by intellectual property rights. You may not copy, resell, or misuse Kryptonal content without permission.",
      ],
      [
        "responsibilities",
        "User Responsibilities",
        "You are responsible for how you use Kryptonal, for verifying information independently, for protecting your own devices and wallets, and for complying with applicable laws in your location.",
      ],
      [
        "prohibited",
        "Prohibited Activities",
        "You may not abuse, scrape, overload, reverse engineer, attack, exploit, interfere with, fraudulently use, or attempt unauthorized access to Kryptonal, its systems, data, tools, or infrastructure.",
      ],
      [
        "liability",
        "Limitation of Liability",
        "Kryptonal is provided on an “as is” and “as available” basis. To the maximum extent permitted by law, Kryptonal is not liable for losses, damages, missed opportunities, investment outcomes, data errors, service interruptions, or third-party failures.",
      ],
      [
        "indemnification",
        "Indemnification",
        "You agree to indemnify and hold Kryptonal harmless from claims, losses, liabilities, damages, costs, or expenses arising from your misuse of the website, violation of these Terms, or violation of applicable laws.",
      ],
      [
        "availability",
        "Availability of Service",
        "Kryptonal may change, pause, restrict, update, remove, or discontinue parts of the website or services at any time without guarantee of uninterrupted availability.",
      ],
      [
        "future",
        "Future Accounts and Services",
        "Kryptonal may introduce accounts, newsletters, watchlists, portfolios, alerts, subscriptions, premium tools, AI features, and other services. Additional terms or consent requests may apply.",
      ],
      [
        "changes",
        "Changes to Terms",
        "Kryptonal may update these Terms as the platform evolves. The latest version will be posted on this page with an updated date.",
      ],
      [
        "law",
        "Governing Law",
        "These Terms are intended to be governed by applicable laws relevant to Kryptonal’s operations, unless mandatory local consumer laws require otherwise.",
      ],
      [
        "contact",
        "Contact Information",
        "For questions about these Terms, contact Kryptonal through the official contact channel provided on the website.",
      ],
    ] as readonly Section[],
  },

  tr: {
    metaTitle: "Şartlar ve Koşullar | Kryptonal",
    description:
      "Kryptonal’ın kripto piyasa analiz araçları, eğitim içerikleri ve araştırma platformunun kullanım şartlarını okuyun.",
    badge: "Hukuk Merkezi",
    title: "Şartlar ve Koşullar",
    intro:
      "Bu Şartlar, Kryptonal’ın kripto piyasa analizi, eğitim içerikleri, araştırma araçları ve piyasa zekâsı platformunun kullanımını düzenler.",
    lastUpdated: "Son Güncelleme: 24 Haziran 2026",
    toc: "Bu sayfada",
    disclaimerTitle: "Eğitim Amaçlı Feragatname",
    disclaimer:
      "Kryptonal eğitim amaçlı piyasa zekâsı ve araştırma araçları sağlar. Bu web sitesindeki hiçbir şey finansal, yatırım, hukuki veya vergi tavsiyesi değildir.",
    privacyLink: "Gizlilik Politikasını Oku",
    sections: [
      [
        "acceptance",
        "Şartların Kabulü",
        "Kryptonal’a erişerek veya kullanarak bu Şartlar ve Koşulları kabul etmiş olursunuz. Kabul etmiyorsanız web sitesini kullanmamalısınız.",
      ],
      [
        "service",
        "Hizmetin Tanımı",
        "Kryptonal kripto piyasa analizi, piyasa değeri araştırması, eğitim içerikleri, kripto araçları, haber toplama, gaming crypto araştırması, döngü analizi ve araştırma kaynakları sağlar.",
      ],
      [
        "advice",
        "Finansal Tavsiye Değildir",
        "Kryptonal bir aracı kurum, borsa, cüzdan sağlayıcısı, saklama kuruluşu, yatırım danışmanı, finans kurumu veya düzenlenmiş menkul kıymet sağlayıcısı değildir. Tüm içerik yalnızca eğitim ve bilgi amaçlıdır. Kullanıcılar kendi finansal, vergi, hukuki ve yatırım kararlarından sorumludur.",
      ],
      [
        "risk",
        "Kripto Para Risk Açıklaması",
        "Kripto para ve blockchain piyasaları volatilite, sermaye kaybı, düzenleyici belirsizlik, akıllı sözleşme hataları, likidite riskleri, teknik arızalar, piyasa manipülasyonu ve güvenlik riskleri dahil ciddi riskler içerir.",
      ],
      [
        "accuracy",
        "Bilgilerin Doğruluğu",
        "Kryptonal üçüncü taraf sağlayıcılardan piyasa verileri, analizler, haberler ve araştırmalar gösterebilir. Bilgiler gecikebilir, eksik, hatalı veya haber verilmeksizin değişebilir. Kryptonal doğruluk, eksiksizlik veya güvenilirlik garantisi vermez.",
      ],
      [
        "sources",
        "Üçüncü Taraf Veri Kaynakları",
        "Kryptonal CoinGecko, DefiLlama, haber sağlayıcıları, analitik hizmetleri, barındırma sağlayıcıları ve harici web sitelerinden veri kullanabilir. Kryptonal üçüncü taraf verilerinden, web sitelerinden, hizmetlerinden veya içeriklerinden sorumlu değildir.",
      ],
      [
        "ip",
        "Fikri Mülkiyet",
        "Kryptonal’ın markası, tasarımı, içeriği, arayüzü, araştırma yapısı, araçları ve özgün materyalleri fikri mülkiyet haklarıyla korunur. İzin olmadan Kryptonal içeriğini kopyalayamaz, yeniden satamaz veya kötüye kullanamazsınız.",
      ],
      [
        "responsibilities",
        "Kullanıcı Sorumlulukları",
        "Kryptonal’ı nasıl kullandığınızdan, bilgileri bağımsız olarak doğrulamaktan, cihazlarınızı ve cüzdanlarınızı korumaktan ve bulunduğunuz yerdeki geçerli yasalara uymaktan siz sorumlusunuz.",
      ],
      [
        "prohibited",
        "Yasaklı Faaliyetler",
        "Kryptonal’ı, sistemlerini, verilerini, araçlarını veya altyapısını kötüye kullanamaz, kazıyamaz, aşırı yükleyemez, tersine mühendislik yapamaz, saldıramaz, istismar edemez, müdahale edemez, hileli kullanamaz veya yetkisiz erişim girişiminde bulunamazsınız.",
      ],
      [
        "liability",
        "Sorumluluğun Sınırlandırılması",
        "Kryptonal “olduğu gibi” ve “mevcut olduğu şekilde” sunulur. Yasaların izin verdiği azami ölçüde Kryptonal kayıplardan, zararlardan, kaçırılan fırsatlardan, yatırım sonuçlarından, veri hatalarından, hizmet kesintilerinden veya üçüncü taraf arızalarından sorumlu değildir.",
      ],
      [
        "indemnification",
        "Tazminat",
        "Web sitesini kötüye kullanmanız, bu Şartları ihlal etmeniz veya geçerli yasaları ihlal etmeniz nedeniyle doğan talepler, kayıplar, yükümlülükler, zararlar, masraflar veya giderlere karşı Kryptonal’ı tazmin etmeyi kabul edersiniz.",
      ],
      [
        "availability",
        "Hizmetin Kullanılabilirliği",
        "Kryptonal web sitesinin veya hizmetlerin bazı bölümlerini kesintisiz erişim garantisi olmadan herhangi bir zamanda değiştirebilir, duraklatabilir, kısıtlayabilir, güncelleyebilir, kaldırabilir veya sonlandırabilir.",
      ],
      [
        "future",
        "Gelecek Hesaplar ve Hizmetler",
        "Kryptonal hesaplar, bültenler, izleme listeleri, portföyler, uyarılar, abonelikler, premium araçlar, yapay zekâ özellikleri ve diğer hizmetleri tanıtabilir. Ek şartlar veya onay talepleri uygulanabilir.",
      ],
      [
        "changes",
        "Şartlardaki Değişiklikler",
        "Kryptonal platform geliştikçe bu Şartları güncelleyebilir. En son sürüm güncellenmiş tarih ile bu sayfada yayınlanacaktır.",
      ],
      [
        "law",
        "Geçerli Hukuk",
        "Bu Şartlar, zorunlu yerel tüketici yasaları aksi yönde gerektirmedikçe Kryptonal’ın operasyonlarıyla ilgili geçerli yasalara tabi olacak şekilde amaçlanmıştır.",
      ],
      [
        "contact",
        "İletişim Bilgileri",
        "Bu Şartlarla ilgili sorular için web sitesinde sağlanan resmi iletişim kanalı üzerinden Kryptonal ile iletişime geçin.",
      ],
    ] as readonly Section[],
  },

  pt: {
    metaTitle: "Termos e Condições | Kryptonal",
    description:
      "Leia os termos que regem o uso das ferramentas de análise de mercado cripto, conteúdo educacional e plataforma de pesquisa da Kryptonal.",
    badge: "Centro Legal",
    title: "Termos e Condições",
    intro:
      "Estes Termos regem o uso da análise de mercado cripto, conteúdo educacional, ferramentas de pesquisa e plataforma de inteligência de mercado da Kryptonal.",
    lastUpdated: "Última atualização: 24 de junho de 2026",
    toc: "Nesta página",
    disclaimerTitle: "Aviso Educacional",
    disclaimer:
      "A Kryptonal fornece inteligência de mercado e ferramentas de pesquisa para fins educacionais. Nada neste site constitui aconselhamento financeiro, de investimento, jurídico ou fiscal.",
    privacyLink: "Ler Política de Privacidade",
    sections: [
      [
        "acceptance",
        "Aceitação dos Termos",
        "Ao acessar ou usar a Kryptonal, você concorda com estes Termos e Condições. Se não concordar, não deve usar o site.",
      ],
      [
        "service",
        "Descrição do Serviço",
        "A Kryptonal fornece análise de mercado cripto, pesquisa de capitalização de mercado, conteúdo educacional, ferramentas cripto, agregação de notícias, pesquisa de gaming crypto, análise de ciclos e recursos de pesquisa.",
      ],
      [
        "advice",
        "Não é Aconselhamento Financeiro",
        "A Kryptonal não é corretora, exchange, provedora de carteira, custodiante, consultora de investimentos, instituição financeira ou provedora regulada de valores mobiliários. Todo conteúdo é apenas educacional e informativo. Os usuários são responsáveis por suas próprias decisões financeiras, fiscais, jurídicas e de investimento.",
      ],
      [
        "risk",
        "Divulgação de Riscos de Criptomoedas",
        "Mercados de criptomoedas e blockchain envolvem riscos sérios, incluindo volatilidade, perda de capital, incerteza regulatória, falhas de contratos inteligentes, riscos de liquidez, falhas técnicas, manipulação de mercado e riscos de segurança.",
      ],
      [
        "accuracy",
        "Precisão das Informações",
        "A Kryptonal pode exibir dados de mercado, análises, notícias e pesquisas de provedores terceiros. As informações podem estar atrasadas, incompletas, imprecisas ou mudar sem aviso. A Kryptonal não garante precisão, completude ou confiabilidade.",
      ],
      [
        "sources",
        "Fontes de Dados de Terceiros",
        "A Kryptonal pode usar dados da CoinGecko, DefiLlama, provedores de notícias, serviços de analytics, provedores de hospedagem e sites externos. A Kryptonal não é responsável por dados, sites, serviços ou conteúdos de terceiros.",
      ],
      [
        "ip",
        "Propriedade Intelectual",
        "A marca, design, conteúdo, interface, estrutura de pesquisa, ferramentas e materiais originais da Kryptonal são protegidos por direitos de propriedade intelectual. Você não pode copiar, revender ou usar indevidamente o conteúdo da Kryptonal sem permissão.",
      ],
      [
        "responsibilities",
        "Responsabilidades do Usuário",
        "Você é responsável por como usa a Kryptonal, por verificar informações de forma independente, por proteger seus dispositivos e carteiras, e por cumprir as leis aplicáveis em sua localização.",
      ],
      [
        "prohibited",
        "Atividades Proibidas",
        "Você não pode abusar, fazer scraping, sobrecarregar, fazer engenharia reversa, atacar, explorar, interferir, usar de forma fraudulenta ou tentar acesso não autorizado à Kryptonal, seus sistemas, dados, ferramentas ou infraestrutura.",
      ],
      [
        "liability",
        "Limitação de Responsabilidade",
        "A Kryptonal é fornecida “como está” e “conforme disponível”. Na máxima extensão permitida por lei, a Kryptonal não é responsável por perdas, danos, oportunidades perdidas, resultados de investimento, erros de dados, interrupções de serviço ou falhas de terceiros.",
      ],
      [
        "indemnification",
        "Indenização",
        "Você concorda em indenizar e isentar a Kryptonal de reivindicações, perdas, responsabilidades, danos, custos ou despesas decorrentes do uso indevido do site, violação destes Termos ou violação de leis aplicáveis.",
      ],
      [
        "availability",
        "Disponibilidade do Serviço",
        "A Kryptonal pode alterar, pausar, restringir, atualizar, remover ou descontinuar partes do site ou serviços a qualquer momento, sem garantia de disponibilidade ininterrupta.",
      ],
      [
        "future",
        "Contas e Serviços Futuros",
        "A Kryptonal pode introduzir contas, newsletters, watchlists, portfólios, alertas, assinaturas, ferramentas premium, recursos de IA e outros serviços. Termos adicionais ou pedidos de consentimento podem se aplicar.",
      ],
      [
        "changes",
        "Alterações nos Termos",
        "A Kryptonal pode atualizar estes Termos conforme a plataforma evolui. A versão mais recente será publicada nesta página com uma data atualizada.",
      ],
      [
        "law",
        "Lei Aplicável",
        "Estes Termos destinam-se a ser regidos pelas leis aplicáveis relevantes às operações da Kryptonal, salvo quando leis obrigatórias locais de consumo exigirem o contrário.",
      ],
      [
        "contact",
        "Contato",
        "Para dúvidas sobre estes Termos, entre em contato com a Kryptonal pelo canal oficial indicado no site.",
      ],
    ] as readonly Section[],
  },

  es: {
    metaTitle: "Términos y Condiciones | Kryptonal",
    description:
      "Lee los términos que rigen el uso de las herramientas de análisis del mercado cripto, contenido educativo y plataforma de investigación de Kryptonal.",
    badge: "Centro Legal",
    title: "Términos y Condiciones",
    intro:
      "Estos Términos regulan el uso del análisis de mercado cripto, contenido educativo, herramientas de investigación y plataforma de inteligencia de mercado de Kryptonal.",
    lastUpdated: "Última actualización: 24 de junio de 2026",
    toc: "En esta página",
    disclaimerTitle: "Aviso Educativo",
    disclaimer:
      "Kryptonal proporciona inteligencia de mercado y herramientas de investigación con fines educativos. Nada en este sitio constituye asesoramiento financiero, de inversión, legal o fiscal.",
    privacyLink: "Leer Política de Privacidad",
    sections: [
      [
        "acceptance",
        "Aceptación de los Términos",
        "Al acceder o usar Kryptonal, aceptas estos Términos y Condiciones. Si no estás de acuerdo, no debes usar el sitio web.",
      ],
      [
        "service",
        "Descripción del Servicio",
        "Kryptonal proporciona análisis del mercado cripto, investigación de capitalización de mercado, contenido educativo, herramientas cripto, agregación de noticias, investigación de gaming crypto, análisis de ciclos y recursos de investigación.",
      ],
      [
        "advice",
        "No es Asesoramiento Financiero",
        "Kryptonal no es broker, exchange, proveedor de wallet, custodio, asesor de inversiones, institución financiera ni proveedor regulado de valores. Todo el contenido es únicamente educativo e informativo. Los usuarios son responsables de sus propias decisiones financieras, fiscales, legales y de inversión.",
      ],
      [
        "risk",
        "Divulgación de Riesgos de Criptomonedas",
        "Los mercados de criptomonedas y blockchain implican riesgos serios, incluyendo volatilidad, pérdida de capital, incertidumbre regulatoria, fallos de contratos inteligentes, riesgos de liquidez, fallos técnicos, manipulación del mercado y riesgos de seguridad.",
      ],
      [
        "accuracy",
        "Exactitud de la Información",
        "Kryptonal puede mostrar datos de mercado, análisis, noticias e investigaciones de proveedores externos. La información puede estar retrasada, incompleta, ser inexacta o cambiar sin aviso. Kryptonal no garantiza exactitud, integridad ni fiabilidad.",
      ],
      [
        "sources",
        "Fuentes de Datos de Terceros",
        "Kryptonal puede usar datos de CoinGecko, DefiLlama, proveedores de noticias, servicios de analítica, proveedores de hosting y sitios externos. Kryptonal no es responsable de datos, sitios, servicios o contenidos de terceros.",
      ],
      [
        "ip",
        "Propiedad Intelectual",
        "La marca, diseño, contenido, interfaz, estructura de investigación, herramientas y materiales originales de Kryptonal están protegidos por derechos de propiedad intelectual. No puedes copiar, revender o usar indebidamente contenido de Kryptonal sin permiso.",
      ],
      [
        "responsibilities",
        "Responsabilidades del Usuario",
        "Eres responsable de cómo usas Kryptonal, de verificar la información de forma independiente, de proteger tus dispositivos y wallets, y de cumplir con las leyes aplicables en tu ubicación.",
      ],
      [
        "prohibited",
        "Actividades Prohibidas",
        "No puedes abusar, hacer scraping, sobrecargar, realizar ingeniería inversa, atacar, explotar, interferir, usar fraudulentamente o intentar acceso no autorizado a Kryptonal, sus sistemas, datos, herramientas o infraestructura.",
      ],
      [
        "liability",
        "Limitación de Responsabilidad",
        "Kryptonal se proporciona “tal cual” y “según disponibilidad”. En la máxima medida permitida por la ley, Kryptonal no será responsable por pérdidas, daños, oportunidades perdidas, resultados de inversión, errores de datos, interrupciones del servicio o fallos de terceros.",
      ],
      [
        "indemnification",
        "Indemnización",
        "Aceptas indemnizar y mantener indemne a Kryptonal frente a reclamaciones, pérdidas, responsabilidades, daños, costes o gastos derivados del uso indebido del sitio, la violación de estos Términos o la infracción de leyes aplicables.",
      ],
      [
        "availability",
        "Disponibilidad del Servicio",
        "Kryptonal puede cambiar, pausar, restringir, actualizar, eliminar o discontinuar partes del sitio o servicios en cualquier momento sin garantía de disponibilidad ininterrumpida.",
      ],
      [
        "future",
        "Cuentas y Servicios Futuros",
        "Kryptonal puede introducir cuentas, newsletters, listas de seguimiento, portafolios, alertas, suscripciones, herramientas premium, funciones de IA y otros servicios. Pueden aplicarse términos adicionales o solicitudes de consentimiento.",
      ],
      [
        "changes",
        "Cambios en los Términos",
        "Kryptonal puede actualizar estos Términos conforme evolucione la plataforma. La versión más reciente se publicará en esta página con una fecha actualizada.",
      ],
      [
        "law",
        "Ley Aplicable",
        "Estos Términos están destinados a regirse por las leyes aplicables relevantes para las operaciones de Kryptonal, salvo que leyes locales obligatorias de consumidores exijan lo contrario.",
      ],
      [
        "contact",
        "Contacto",
        "Para preguntas sobre estos Términos, contacta a Kryptonal mediante el canal oficial indicado en el sitio web.",
      ],
    ] as readonly Section[],
  },

  fr: {
    metaTitle: "Conditions Générales | Kryptonal",
    description:
      "Lisez les conditions régissant l’utilisation des outils d’analyse crypto, du contenu éducatif et de la plateforme de recherche de Kryptonal.",
    badge: "Centre Juridique",
    title: "Conditions Générales",
    intro:
      "Ces Conditions régissent votre utilisation des analyses de marché crypto, contenus éducatifs, outils de recherche et plateforme d’intelligence de marché de Kryptonal.",
    lastUpdated: "Dernière mise à jour : 24 juin 2026",
    toc: "Sur cette page",
    disclaimerTitle: "Avertissement Éducatif",
    disclaimer:
      "Kryptonal fournit des outils d’intelligence de marché et de recherche à des fins éducatives. Rien sur ce site ne constitue un conseil financier, d’investissement, juridique ou fiscal.",
    privacyLink: "Lire la Politique de Confidentialité",
    sections: [
      [
        "acceptance",
        "Acceptation des Conditions",
        "En accédant à Kryptonal ou en l’utilisant, vous acceptez ces Conditions Générales. Si vous n’êtes pas d’accord, vous ne devez pas utiliser le site.",
      ],
      [
        "service",
        "Description du Service",
        "Kryptonal fournit des analyses de marché crypto, recherches sur la capitalisation, contenus éducatifs, outils crypto, agrégation d’actualités, recherche gaming crypto, analyse de cycles et ressources de recherche.",
      ],
      [
        "advice",
        "Aucun Conseil Financier",
        "Kryptonal n’est pas un courtier, une plateforme d’échange, un fournisseur de portefeuille, un dépositaire, un conseiller en investissement, une institution financière ou un fournisseur réglementé de titres. Tout le contenu est uniquement éducatif et informatif. Les utilisateurs sont responsables de leurs propres décisions financières, fiscales, juridiques et d’investissement.",
      ],
      [
        "risk",
        "Divulgation des Risques Crypto",
        "Les marchés des cryptomonnaies et de la blockchain comportent des risques importants, notamment volatilité, perte de capital, incertitude réglementaire, défaillances de contrats intelligents, risques de liquidité, défaillances techniques, manipulation de marché et risques de sécurité.",
      ],
      [
        "accuracy",
        "Exactitude des Informations",
        "Kryptonal peut afficher des données de marché, analyses, actualités et recherches provenant de fournisseurs tiers. Les informations peuvent être retardées, incomplètes, inexactes ou modifiées sans préavis. Kryptonal ne garantit pas l’exactitude, l’exhaustivité ou la fiabilité.",
      ],
      [
        "sources",
        "Sources de Données Tierces",
        "Kryptonal peut utiliser des données de CoinGecko, DefiLlama, fournisseurs d’actualités, services d’analyse, hébergeurs et sites externes. Kryptonal n’est pas responsable des données, sites, services ou contenus tiers.",
      ],
      [
        "ip",
        "Propriété Intellectuelle",
        "La marque, le design, le contenu, l’interface, la structure de recherche, les outils et les matériaux originaux de Kryptonal sont protégés par des droits de propriété intellectuelle. Vous ne pouvez pas copier, revendre ou utiliser abusivement le contenu de Kryptonal sans autorisation.",
      ],
      [
        "responsibilities",
        "Responsabilités de l’Utilisateur",
        "Vous êtes responsable de votre utilisation de Kryptonal, de la vérification indépendante des informations, de la protection de vos appareils et portefeuilles, et du respect des lois applicables dans votre pays.",
      ],
      [
        "prohibited",
        "Activités Interdites",
        "Vous ne pouvez pas abuser, scraper, surcharger, faire de l’ingénierie inverse, attaquer, exploiter, interférer, utiliser frauduleusement ou tenter un accès non autorisé à Kryptonal, ses systèmes, données, outils ou infrastructure.",
      ],
      [
        "liability",
        "Limitation de Responsabilité",
        "Kryptonal est fourni “tel quel” et “selon disponibilité”. Dans la mesure maximale permise par la loi, Kryptonal n’est pas responsable des pertes, dommages, opportunités manquées, résultats d’investissement, erreurs de données, interruptions de service ou défaillances de tiers.",
      ],
      [
        "indemnification",
        "Indemnisation",
        "Vous acceptez d’indemniser et de dégager Kryptonal de toute responsabilité concernant les réclamations, pertes, responsabilités, dommages, coûts ou dépenses résultant de votre mauvaise utilisation du site, de la violation de ces Conditions ou des lois applicables.",
      ],
      [
        "availability",
        "Disponibilité du Service",
        "Kryptonal peut modifier, suspendre, restreindre, mettre à jour, supprimer ou interrompre certaines parties du site ou des services à tout moment, sans garantie de disponibilité continue.",
      ],
      [
        "future",
        "Comptes et Services Futurs",
        "Kryptonal peut introduire des comptes, newsletters, watchlists, portefeuilles, alertes, abonnements, outils premium, fonctionnalités IA et autres services. Des conditions supplémentaires ou demandes de consentement peuvent s’appliquer.",
      ],
      [
        "changes",
        "Modifications des Conditions",
        "Kryptonal peut mettre à jour ces Conditions à mesure que la plateforme évolue. La dernière version sera publiée sur cette page avec une date mise à jour.",
      ],
      [
        "law",
        "Droit Applicable",
        "Ces Conditions sont destinées à être régies par les lois applicables pertinentes aux opérations de Kryptonal, sauf si des lois locales obligatoires de protection des consommateurs exigent le contraire.",
      ],
      [
        "contact",
        "Contact",
        "Pour toute question concernant ces Conditions, contactez Kryptonal via le canal officiel indiqué sur le site.",
      ],
    ] as readonly Section[],
  },

  de: {
    metaTitle: "Allgemeine Geschäftsbedingungen | Kryptonal",
    description:
      "Lesen Sie die Bedingungen für die Nutzung der Kryptonal-Kryptoanalyse-Tools, Bildungsinhalte und Forschungsplattform.",
    badge: "Rechtszentrum",
    title: "Allgemeine Geschäftsbedingungen",
    intro:
      "Diese Bedingungen regeln Ihre Nutzung der Kryptonal-Krypto-Marktanalysen, Bildungsinhalte, Forschungstools und Marktintelligenz-Plattform.",
    lastUpdated: "Zuletzt aktualisiert: 24. Juni 2026",
    toc: "Auf dieser Seite",
    disclaimerTitle: "Bildungshinweis",
    disclaimer:
      "Kryptonal bietet Marktinformationen und Forschungstools zu Bildungszwecken. Nichts auf dieser Website stellt Finanz-, Anlage-, Rechts- oder Steuerberatung dar.",
    privacyLink: "Datenschutzerklärung lesen",
    sections: [
      [
        "acceptance",
        "Annahme der Bedingungen",
        "Durch den Zugriff auf Kryptonal oder dessen Nutzung stimmen Sie diesen Allgemeinen Geschäftsbedingungen zu. Wenn Sie nicht zustimmen, sollten Sie die Website nicht nutzen.",
      ],
      [
        "service",
        "Beschreibung des Dienstes",
        "Kryptonal bietet Krypto-Marktanalysen, Marktkapitalisierungsforschung, Bildungsinhalte, Krypto-Tools, Nachrichtenaggregation, Gaming-Crypto-Forschung, Zyklusanalyse und Forschungsressourcen.",
      ],
      [
        "advice",
        "Keine Finanzberatung",
        "Kryptonal ist kein Broker, keine Börse, kein Wallet-Anbieter, kein Verwahrer, kein Anlageberater, kein Finanzinstitut und kein regulierter Wertpapieranbieter. Alle Inhalte dienen ausschließlich Bildungs- und Informationszwecken. Nutzer sind für ihre eigenen Finanz-, Steuer-, Rechts- und Anlageentscheidungen verantwortlich.",
      ],
      [
        "risk",
        "Risikohinweis zu Kryptowährungen",
        "Kryptowährungs- und Blockchain-Märkte bergen erhebliche Risiken, einschließlich Volatilität, Kapitalverlust, regulatorischer Unsicherheit, Smart-Contract-Fehlern, Liquiditätsrisiken, technischen Ausfällen, Marktmanipulation und Sicherheitsrisiken.",
      ],
      [
        "accuracy",
        "Richtigkeit der Informationen",
        "Kryptonal kann Marktdaten, Analysen, Nachrichten und Forschung von Drittanbietern anzeigen. Informationen können verzögert, unvollständig, ungenau oder ohne Vorankündigung geändert werden. Kryptonal garantiert keine Genauigkeit, Vollständigkeit oder Zuverlässigkeit.",
      ],
      [
        "sources",
        "Datenquellen von Drittanbietern",
        "Kryptonal kann Daten von CoinGecko, DefiLlama, Nachrichtenanbietern, Analytics-Diensten, Hosting-Anbietern und externen Websites verwenden. Kryptonal ist nicht verantwortlich für Daten, Websites, Dienste oder Inhalte Dritter.",
      ],
      [
        "ip",
        "Geistiges Eigentum",
        "Die Marke, das Design, die Inhalte, die Benutzeroberfläche, die Forschungsstruktur, die Tools und die Originalmaterialien von Kryptonal sind durch geistige Eigentumsrechte geschützt. Sie dürfen Kryptonal-Inhalte ohne Erlaubnis nicht kopieren, weiterverkaufen oder missbrauchen.",
      ],
      [
        "responsibilities",
        "Verantwortlichkeiten der Nutzer",
        "Sie sind verantwortlich für Ihre Nutzung von Kryptonal, die unabhängige Überprüfung von Informationen, den Schutz Ihrer Geräte und Wallets sowie die Einhaltung der an Ihrem Standort geltenden Gesetze.",
      ],
      [
        "prohibited",
        "Verbotene Aktivitäten",
        "Sie dürfen Kryptonal, seine Systeme, Daten, Tools oder Infrastruktur nicht missbrauchen, scrapen, überlasten, zurückentwickeln, angreifen, ausnutzen, stören, betrügerisch verwenden oder unbefugten Zugriff versuchen.",
      ],
      [
        "liability",
        "Haftungsbeschränkung",
        "Kryptonal wird “wie besehen” und “wie verfügbar” bereitgestellt. Soweit gesetzlich zulässig, haftet Kryptonal nicht für Verluste, Schäden, verpasste Chancen, Anlageergebnisse, Datenfehler, Dienstunterbrechungen oder Ausfälle Dritter.",
      ],
      [
        "indemnification",
        "Freistellung",
        "Sie erklären sich damit einverstanden, Kryptonal von Ansprüchen, Verlusten, Verbindlichkeiten, Schäden, Kosten oder Ausgaben freizustellen, die aus Ihrem Missbrauch der Website, der Verletzung dieser Bedingungen oder der Verletzung geltender Gesetze entstehen.",
      ],
      [
        "availability",
        "Verfügbarkeit des Dienstes",
        "Kryptonal kann Teile der Website oder Dienste jederzeit ändern, pausieren, einschränken, aktualisieren, entfernen oder einstellen, ohne eine ununterbrochene Verfügbarkeit zu garantieren.",
      ],
      [
        "future",
        "Zukünftige Konten und Dienste",
        "Kryptonal kann Konten, Newsletter, Watchlists, Portfolios, Benachrichtigungen, Abonnements, Premium-Tools, KI-Funktionen und andere Dienste einführen. Zusätzliche Bedingungen oder Einwilligungsanfragen können gelten.",
      ],
      [
        "changes",
        "Änderungen der Bedingungen",
        "Kryptonal kann diese Bedingungen aktualisieren, wenn sich die Plattform weiterentwickelt. Die neueste Version wird mit aktualisiertem Datum auf dieser Seite veröffentlicht.",
      ],
      [
        "law",
        "Anwendbares Recht",
        "Diese Bedingungen sollen den für den Betrieb von Kryptonal relevanten geltenden Gesetzen unterliegen, sofern zwingende lokale Verbraucherschutzgesetze nichts anderes verlangen.",
      ],
      [
        "contact",
        "Kontaktinformationen",
        "Bei Fragen zu diesen Bedingungen kontaktieren Sie Kryptonal über den offiziellen Kontaktkanal auf der Website.",
      ],
    ] as readonly Section[],
  },
} satisfies Record<
  Locale,
  {
    metaTitle: string;
    description: string;
    badge: string;
    title: string;
    intro: string;
    lastUpdated: string;
    toc: string;
    disclaimerTitle: string;
    disclaimer: string;
    privacyLink: string;
    sections: readonly Section[];
  }
>;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = getLocale(locale);
  const t = content[lang];
  const url = `${siteUrl}/${lang}/terms`;

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

export default async function TermsPage({ params }: PageProps) {
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
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
              {t.badge}
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              {t.title}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              {t.intro}
            </p>

            <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-7 text-amber-100">
              <strong>{t.disclaimerTitle}:</strong> {t.disclaimer}
            </div>

            <p className="mt-4 text-sm text-slate-400">{t.lastUpdated}</p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="hidden lg:block">
              <nav className="sticky top-24 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <p className="mb-4 text-sm font-bold text-slate-400">{t.toc}</p>

                <div className="space-y-2">
                  {t.sections.map((section) => {
                    const [id, title] = section;

                    return (
                      <a
                        key={id}
                        href={`#${id}`}
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
                const [id, title, body] = section;
                const isDisclaimer = id === "advice";

                return (
                  <section
                    key={id}
                    id={id}
                    className={`scroll-mt-28 rounded-3xl border p-6 leading-8 backdrop-blur md:p-8 ${
                      isDisclaimer
                        ? "border-red-400/20 bg-red-400/10 text-red-100"
                        : "border-white/10 bg-white/[0.035] text-slate-300"
                    }`}
                  >
                    <h2
                      className={`mb-4 text-2xl font-black ${
                        isDisclaimer ? "text-red-200" : "text-white"
                      }`}
                    >
                      {index + 1}. {title}
                    </h2>

                    <p>{body}</p>
                  </section>
                );
              })}

              <div className="pt-6">
                <Link
                  href={`/${locale}/privacy`}
                  className="inline-flex rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
                >
                  {t.privacyLink}
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer locale={locale} t={dict} />
    </>
  );
}
