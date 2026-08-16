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
      title: "Hot Wallet vs. Cold Storage: What's the Difference in 2026?",
      intro:
        "Understanding the difference between hot wallets and cold storage is the foundation of crypto security. Learn when to use each, their risks, and how to combine them to protect your digital assets.",
      ctaStart: "Explore Security Tools",
      ctaBlog: "Read Security Guides",
      whatIsTitle: "The Binary Distinction: Online vs. Offline",
      whatIsBody:
        "The fundamental difference between a hot wallet and a cold wallet is internet connectivity. A hot wallet is a software application connected to the internet, prioritizing convenience and speed. A cold wallet, typically a hardware device, stores your private keys completely offline, prioritizing maximum security. Most security properties of a crypto setup flow from which side of this line your wallet sits on.",
      sectionsHeader: "10 Key Concepts to Master Crypto Storage",
      sections: [
        {
          title: "1. The Anatomy of a Hot Wallet",
          body: "Hot wallets exist as browser extensions (like MetaMask) or mobile apps (like Trust Wallet) [1.1.3]. Because they generate and store your private keys online, they are always ready to transact. This makes them the standard for interacting with Web3 applications, but it also means the keys are vulnerable to online threats.",
          toolName: "Check Wallet Security",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. The Anatomy of a Cold Wallet",
          body: "Cold wallets are physical hardware devices (like Ledger or Trezor) or even paper wallets. They generate keys offline and sign transactions in an isolated environment. The connected computer or phone only receives the cryptographically signed transaction, ensuring the private keys are never exposed to the internet.",
        },
        {
          title: "3. The Convenience vs. Security Trade-off",
          body: "Hot wallets pay in attack surface—every app or extension on your device is a potential vector for malware. Cold wallets pay in friction—every transaction requires the physical device to be present, powered on, and manually approved.",
        },
        {
          title: "4. Custodial vs. Non-Custodial Wallets",
          body: "It's vital to know who holds the keys. Exchange wallets are custodial hot wallets; the exchange controls the keys. Non-custodial hot wallets (like MetaMask) give you the keys, meaning you have full control but also full responsibility if your seed phrase is compromised.",
        },
        {
          title: "5. When to Use a Hot Wallet",
          body: "Hot wallets are ideal for amounts below $500, active daily trading, or interacting with decentralized finance (DeFi) protocols where speed is critical. If you transact frequently, the friction of a hardware wallet might be too cumbersome.",
        },
        {
          title: "6. When to Use Cold Storage",
          body: "Amounts above $5,000 belong in cold storage. If your strategy is to 'HODL' Bitcoin or other assets for the long term, the slight inconvenience of a hardware wallet is a small price to pay for immunity against remote hacking and wallet drainers.",
        },
        {
          title: "7. The Risk of Wallet Drainers in 2026",
          body: "The 2025-2026 wave of crypto scams heavily involves malicious smart contracts and signature delegations. These attacks exclusively target hot wallets because the keys can be reached by software that an attacker influences.",
        },
        {
          title: "8. The Rise of 'Warm' and Multisig Setups",
          body: "In 2026, many advanced users employ 'warm' setups or multisignature (multisig) wallets. These require multiple keys to authorize a transaction (e.g., one hot, one cold), balancing speed with an added layer of institutional-grade security.",
        },
        {
          title: "9. The Perfect Setup: The Hybrid Approach",
          body: "The most effective strategy is using both. Keep 90% of your portfolio in a cold wallet for long-term savings, and transfer small amounts to a hot wallet for daily trading, NFT minting, or DeFi staking. Treat your cold wallet like a vault and your hot wallet like a checking account.",
        },
        {
          title: "10. Recovery Complexity",
          body: "If a hot wallet is lost, you simply restore the app using your seed phrase. Hardware wallets introduce physical recovery complexity—if the device is lost, stolen, or broken, your recovery depends on having safely stored the physical seed phrase backup offline.",
        },
      ],
      summaryTitle: "Stay Safe with Kryptonal",
      summaryBody:
        "There is no one-size-fits-all answer. By understanding the strengths of both online speed and offline security, you can architect a personal security setup that fits your exact trading needs.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          question: "Can I use both a hot wallet and a cold wallet?",
          answer:
            "Absolutely. In fact, it is highly recommended [1.1.8]. Use a cold wallet for your main holdings and a hot wallet for daily, small-value transactions.",
        },
        {
          question: "Is it safe to leave crypto on an exchange?",
          answer:
            "Leaving funds on an exchange means using a custodial hot wallet. While convenient, you do not truly own the assets. If the exchange goes bankrupt or gets hacked, your funds are at risk.",
        },
        {
          question: "Do cold wallets cost money?",
          answer:
            "Yes, hardware cold wallets typically cost between $60 and $250. Hot wallets, being software applications, are almost always free to download and use.",
        },
      ],
      ctaSectionTitle: "Audit Your Security Setup Today",
      ctaSectionDesc:
        "Whether you use a hot wallet or cold storage, ensuring you interact with safe contracts is vital. Use our free tools to stay protected.",
    },
    tr: {
      title: "Sıcak Cüzdan vs. Soğuk Depolama: 2026'da Fark Nedir?",
      intro:
        "Sıcak cüzdan (hot wallet) ile soğuk depolama (cold storage) arasındaki farkı anlamak kripto güvenliğinin temelidir. Hangisini ne zaman kullanacağınızı, risklerini ve varlıklarınızı korumak için bunları nasıl birleştireceğinizi öğrenin.",
      ctaStart: "Güvenlik Araçlarını Keşfet",
      ctaBlog: "Güvenlik Rehberlerini Oku",
      whatIsTitle: "İkili Ayrım: Çevrimiçi ve Çevrimdışı",
      whatIsBody:
        "Bir sıcak cüzdan ile soğuk cüzdan arasındaki temel fark internet bağlantısıdır. Sıcak cüzdan, internete bağlı olan, kolaylık ve hıza öncelik veren bir yazılım uygulamasıdır. Genellikle bir donanım cihazı olan soğuk cüzdan ise özel anahtarlarınızı tamamen çevrimdışı tutarak maksimum güvenliğe öncelik verir. Kripto güvenliğinizin büyük bir kısmı cüzdanınızın bu çizginin hangi tarafında olduğuna bağlıdır.",
      sectionsHeader: "Kripto Depolamada Ustalaşmak İçin 10 Temel Kavram",
      sections: [
        {
          title: "1. Sıcak Cüzdanın Anatomisi",
          body: "Sıcak cüzdanlar tarayıcı eklentileri (MetaMask gibi) veya mobil uygulamalar (Trust Wallet gibi) olarak mevcuttur [1.1.3]. Özel anahtarlarınızı çevrimiçi ortamda ürettikleri ve sakladıkları için her zaman işlem yapmaya hazırdırlar. Bu onları Web3 için standart yapar, ancak aynı zamanda anahtarların çevrimiçi tehditlere açık olduğu anlamına gelir.",
          toolName: "Cüzdan Güvenliğini Kontrol Et",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Soğuk Cüzdanın Anatomisi",
          body: "Soğuk cüzdanlar fiziksel donanım cihazlarıdır (Ledger veya Trezor gibi). Anahtarları çevrimdışı üretir ve işlemleri izole bir ortamda imzalarlar. Bilgisayar veya telefon yalnızca kriptografik olarak imzalanmış işlemi alır ve özel anahtarların internete maruz kalmamasını sağlar.",
        },
        {
          title: "3. Kolaylık vs. Güvenlik Takası",
          body: "Sıcak cüzdanların bedeli saldırı yüzeyidir; cihazınızdaki her uygulama kötü amaçlı yazılımlar için potansiyel bir vektördür. Soğuk cüzdanların bedeli ise kullanım zorluğudur; her işlem cihazın fiziksel olarak yanınızda olmasını gerektirir.",
        },
        {
          title: "4. Gözetimli ve Gözetimsiz Cüzdanlar",
          body: "Anahtarları kimin elinde tuttuğunu bilmek hayati önem taşır. Borsa cüzdanları gözetimli sıcak cüzdanlardır; anahtarları borsa kontrol eder. MetaMask gibi gözetimsiz cüzdanlar ise anahtarları size verir; tam kontrol sizdedir ancak tohum cümlenizi (seed phrase) kaybederseniz tüm sorumluluk da size aittir.",
        },
        {
          title: "5. Sıcak Cüzdan Ne Zaman Kullanılır?",
          body: "Sıcak cüzdanlar, 500 doların altındaki miktarlar, günlük alım satım veya hızın kritik olduğu DeFi protokolleriyle etkileşim için idealdir. Sık işlem yapıyorsanız, donanım cüzdanının yarattığı yavaşlık çok külfetli olabilir.",
        },
        {
          title: "6. Soğuk Depolama Ne Zaman Kullanılır?",
          body: "5.000 doların üzerindeki miktarlar soğuk depolamada tutulmalıdır. Stratejiniz Bitcoin veya diğer varlıkları uzun vadeli 'HODL' yapmaksa, donanım cüzdanının hafif zahmeti, uzaktan hacklenmeye karşı bağışıklık kazanmak için ödenmesi gereken küçük bir bedeldir.",
        },
        {
          title: "7. 2026'da Cüzdan Boşaltıcı (Drainer) Riski",
          body: "2025-2026 kripto dolandırıcılık dalgası, büyük ölçüde kötü niyetli akıllı sözleşmeleri içeriyor. Bu saldırılar yalnızca sıcak cüzdanları hedef alır çünkü anahtarlara bir saldırganın etkileyebileceği bir yazılım tarafından ulaşılabilir.",
        },
        {
          title: "8. 'Ilık' (Warm) ve Multisig Kurulumların Yükselişi",
          body: "2026'da birçok ileri düzey kullanıcı 'ılık' kurulumlar veya çoklu imzalı (multisig) cüzdanlar kullanıyor. Bunlar, bir işlemi yetkilendirmek için birden fazla anahtar gerektirir ve kurumsal düzeyde güvenlikle hızı dengeler.",
        },
        {
          title: "9. Mükemmel Kurulum: Hibrit Yaklaşım",
          body: "En etkili strateji ikisini birden kullanmaktır. Uzun vadeli tasarruflarınız için portföyünüzün %90'ını soğuk cüzdanda tutun ve günlük alım satım veya NFT basımı için küçük miktarları sıcak cüzdanınıza aktarın. Soğuk cüzdanınıza bir kasa, sıcak cüzdanınıza ise bir vadesiz hesap gibi davranın.",
        },
        {
          title: "10. Kurtarma Karmaşıklığı",
          body: "Sıcak bir cüzdan kaybolduğunda, tohum cümlenizi (seed phrase) kullanarak uygulamayı geri yüklersiniz. Donanım cüzdanları ise fiziksel kurtarma karmaşıklığı getirir; cihaz kaybolur, çalınır veya bozulursa kurtarma işleminiz çevrimdışı yedeği ne kadar iyi sakladığınıza bağlıdır.",
        },
      ],
      summaryTitle: "Kryptonal İle Güvende Kalın",
      summaryBody:
        "Herkese uyan tek bir cevap yoktur. Hem çevrimiçi hızın hem de çevrimdışı güvenliğin güçlü yönlerini anlayarak, kendi ticaret ihtiyaçlarınıza uygun kişisel bir güvenlik sistemi kurabilirsiniz.",
      faqTitle: "Sıkça Sorulan Sorular",
      faqs: [
        {
          question: "Hem sıcak cüzdan hem de soğuk cüzdan kullanabilir miyim?",
          answer:
            "Kesinlikle. Hatta bu şiddetle tavsiye edilir [1.1.8]. Ana varlıklarınız için soğuk cüzdan, günlük küçük değerli işlemleriniz için sıcak cüzdan kullanın.",
        },
        {
          question: "Kriptoyu bir borsada bırakmak güvenli mi?",
          answer:
            "Fonları bir borsada bırakmak, gözetimli bir sıcak cüzdan kullandığınız anlamına gelir. Pratik olsa da, varlıkların gerçek sahibi siz olmazsınız. Borsa iflas ederse veya hacklenirse fonlarınız risk altındadır.",
        },
        {
          question: "Soğuk cüzdanlar ücretli mi?",
          answer:
            "Evet, donanım cüzdanları genellikle 60 ile 250 dolar arasında bir maliyete sahiptir. Yazılım uygulaması olan sıcak cüzdanları indirmek ve kullanmak ise neredeyse her zaman ücretsizdir.",
        },
      ],
      ctaSectionTitle: "Güvenlik Ayarlarınızı Bugün Denetleyin",
      ctaSectionDesc:
        "İster sıcak ister soğuk cüzdan kullanın, güvenli sözleşmelerle etkileşim kurduğunuzdan emin olmak hayati önem taşır. Korunmak için ücretsiz araçlarımızı kullanın.",
    },
    pt: {
      title: "Hot Wallet vs. Cold Storage: Qual a Diferença em 2026?",
      intro:
        "Entender a diferença entre hot wallets e cold storage é a base da segurança cripto. Aprenda quando usar cada um, seus riscos e como combiná-los para proteger seus ativos digitais.",
      ctaStart: "Explorar Ferramentas de Segurança",
      ctaBlog: "Ler Guias de Segurança",
      whatIsTitle: "A Distinção Binária: Online vs. Offline",
      whatIsBody:
        "A diferença fundamental entre uma hot wallet e uma cold wallet é a conectividade com a internet. Uma hot wallet é um software conectado, priorizando conveniência e velocidade. Uma cold wallet, geralmente um dispositivo físico, armazena suas chaves totalmente offline, priorizando segurança máxima. As propriedades de segurança da sua configuração dependem de qual lado dessa linha sua carteira está.",
      sectionsHeader: "10 Conceitos Chave de Armazenamento Cripto",
      sections: [
        {
          title: "1. A Anatomia de uma Hot Wallet",
          body: "As hot wallets existem como extensões de navegador (MetaMask) ou apps (Trust Wallet) [1.1.3]. Como elas geram e armazenam chaves online, estão sempre prontas para transações. Isso as torna o padrão para Web3, mas também vulneráveis a ameaças online.",
          toolName: "Verificar Segurança",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. A Anatomia de uma Cold Wallet",
          body: "São dispositivos físicos (Ledger, Trezor). Eles geram chaves offline e assinam transações num ambiente isolado. O computador só recebe a transação já assinada criptograficamente, garantindo que as chaves nunca toquem a internet.",
        },
        {
          title: "3. O Paradoxo: Conveniência vs. Segurança",
          body: "As hot wallets pagam com superfície de ataque — cada app no dispositivo é um vetor potencial de malware. Cold wallets pagam com atrito — cada transação exige que o dispositivo físico esteja presente e seja aprovada manualmente.",
        },
        {
          title: "4. Carteiras Custodiais vs. Não-Custodiais",
          body: "Saber quem tem as chaves é vital. Carteiras de corretoras são hot wallets custodiais (a corretora controla). Carteiras como a MetaMask são não-custodiais: você tem controle total, mas a responsabilidade caso perca a seed phrase é só sua.",
        },
        {
          title: "5. Quando Usar uma Hot Wallet",
          body: "Ideais para valores abaixo de US$ 500, trade diário ativo ou interação com DeFi onde a velocidade é crucial. O atrito de uma cold wallet seria muito incômodo para usuários ativos.",
        },
        {
          title: "6. Quando Usar Cold Storage",
          body: "Valores acima de US$ 5.000 pertencem ao cold storage. Se a sua estratégia é fazer 'HODL' a longo prazo, o leve inconveniente de uma hardware wallet é um preço pequeno para ter imunidade contra hacks remotos.",
        },
        {
          title: "7. O Risco dos 'Wallet Drainers' em 2026",
          body: "A onda de golpes envolve contratos inteligentes maliciosos. Eles têm como alvo quase exclusivo as hot wallets, porque as chaves podem ser alcançadas por um software sob influência do invasor.",
        },
        {
          title: "8. A Ascensão das 'Warm Wallets' e Multisig",
          body: "Muitos usuários avançados utilizam configurações multisig. Elas exigem várias chaves (ex: uma hot, uma cold) para autorizar uma transação, equilibrando velocidade e segurança institucional.",
        },
        {
          title: "9. A Configuração Perfeita: Abordagem Híbrida",
          body: "A estratégia mais eficaz é usar ambas. Mantenha 90% num cold storage para longo prazo, e transfira pequenas quantias para uma hot wallet para trade diário ou NFTs. Trate sua cold wallet como cofre e a hot como conta corrente.",
        },
        {
          title: "10. Complexidade de Recuperação",
          body: "Se perder uma hot wallet, basta restaurar o app com a seed phrase. Hardware wallets introduzem complexidade física: se o dispositivo quebrar ou for roubado, a recuperação depende do seu backup offline estar muito bem guardado.",
        },
      ],
      summaryTitle: "Fique Seguro com a Kryptonal",
      summaryBody:
        "Não existe uma resposta única para todos. Compreendendo os pontos fortes da velocidade online e da segurança offline, você pode criar uma arquitetura de segurança que atenda às suas necessidades.",
      faqTitle: "Perguntas Frequentes",
      faqs: [
        {
          question: "Posso usar uma hot wallet e uma cold wallet?",
          answer:
            "Com certeza. Na verdade, é altamente recomendável [1.1.8]. Use uma cold para ativos principais e uma hot para transações menores.",
        },
        {
          question: "É seguro deixar criptomoedas em uma corretora?",
          answer:
            "Deixar em uma exchange significa usar uma hot wallet custodial. Se a corretora falir ou for hackeada, seus fundos correm risco.",
        },
        {
          question: "Cold wallets custam dinheiro?",
          answer:
            "Sim, as cold wallets físicas custam entre US$ 60 e US$ 250. Já as hot wallets são quase sempre gratuitas para baixar.",
        },
      ],
      ctaSectionTitle: "Audite sua Segurança Hoje",
      ctaSectionDesc:
        "Seja usando cold ou hot wallet, garanta interações seguras usando nossas ferramentas.",
    },
    es: {
      title: "Hot Wallet vs. Cold Storage: ¿Cuál es la diferencia en 2026?",
      intro:
        "Entender la diferencia entre hot wallets y cold storage es la base de la seguridad cripto. Aprende cuándo usar cada una, sus riesgos y cómo combinarlas para proteger tus activos digitales.",
      ctaStart: "Explorar Herramientas",
      ctaBlog: "Leer Guías de Seguridad",
      whatIsTitle: "La Distinción Binaria: Online vs. Offline",
      whatIsBody:
        "La diferencia fundamental entre una hot wallet y una cold wallet es la conectividad a internet. Una hot wallet es una aplicación de software conectada a internet, priorizando comodidad y velocidad. Una cold wallet almacena tus llaves privadas completamente fuera de línea, priorizando máxima seguridad. Casi todas las propiedades de seguridad derivan de en qué lado de esta línea se encuentra tu billetera.",
      sectionsHeader: "10 Conceptos Clave de Almacenamiento Cripto",
      sections: [
        {
          title: "1. La Anatomía de una Hot Wallet",
          body: "Las hot wallets existen como extensiones de navegador (MetaMask) o apps móviles (Trust Wallet) [1.1.3]. Al generar y guardar tus llaves en línea, siempre están listas para transaccionar. Esto las hace el estándar para Web3, pero también las expone a amenazas.",
          toolName: "Verificar Seguridad",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. La Anatomía de una Cold Wallet",
          body: "Son dispositivos físicos de hardware (Ledger, Trezor). Generan llaves y firman transacciones en un entorno aislado fuera de línea. La computadora conectada solo recibe la transacción ya firmada, asegurando que las llaves nunca toquen internet.",
        },
        {
          title: "3. Comodidad vs. Seguridad",
          body: "Las hot wallets pagan el precio con 'superficie de ataque'—cada app en tu dispositivo es un vector potencial para malware. Las cold wallets pagan con fricción—cada transacción requiere conectar físicamente el dispositivo.",
        },
        {
          title: "4. Billeteras Custodiales vs. No Custodiales",
          body: "Es vital saber quién posee las llaves. Las billeteras de exchanges son hot wallets custodiales; ellos controlan las llaves. Las no custodiales (MetaMask) te dan el control total, pero también la responsabilidad exclusiva si pierdes tu frase semilla.",
        },
        {
          title: "5. Cuándo Usar una Hot Wallet",
          body: "Son ideales para montos inferiores a $500, trading diario activo o protocolos DeFi donde la velocidad es crítica. Si transaccionas con frecuencia, la fricción de una hardware wallet sería demasiado molesta.",
        },
        {
          title: "6. Cuándo Usar Cold Storage",
          body: "Los montos superiores a $5,000 pertenecen al almacenamiento frío. Si tu estrategia es hacer 'HODL' a largo plazo, la leve molestia del hardware es un precio bajo para ser inmune a hackeos remotos.",
        },
        {
          title: "7. El Riesgo de los Drenadores (Drainers) en 2026",
          body: "La ola de estafas cripto involucra contratos inteligentes maliciosos. Éstos atacan exclusivamente a las hot wallets, ya que a las llaves se puede acceder mediante software que un atacante logre manipular.",
        },
        {
          title: "8. El Auge de las 'Warm Wallets' y Multisig",
          body: "Muchos usuarios avanzados usan billeteras multifirma (multisig) que requieren múltiples llaves (ej. una hot, una cold) para autorizar transferencias, equilibrando velocidad con seguridad de nivel institucional.",
        },
        {
          title: "9. La Configuración Perfecta: El Enfoque Híbrido",
          body: "La estrategia más efectiva es usar ambas. Mantén el 90% en cold storage para ahorros, y pasa montos pequeños a una hot wallet para el día a día. Trata el cold storage como bóveda y la hot wallet como cuenta corriente.",
        },
        {
          title: "10. Complejidad de Recuperación",
          body: "Si pierdes el acceso a una hot app, la restauras con la frase semilla. Las cold wallets introducen un factor físico: si el dispositivo se rompe o es robado, dependes totalmente de haber guardado bien el respaldo de papel fuera de línea.",
        },
      ],
      summaryTitle: "Mantente Seguro con Kryptonal",
      summaryBody:
        "No existe una respuesta única. Entendiendo las fortalezas de la velocidad en línea y la seguridad fuera de línea, puedes diseñar una arquitectura que se ajuste a ti.",
      faqTitle: "Preguntas Frecuentes",
      faqs: [
        {
          question: "¿Puedo usar una hot wallet y una cold wallet a la vez?",
          answer:
            "Absolutamente. De hecho, es lo más recomendado [1.1.8]. Usa la fría para tenencias a largo plazo y la caliente para operaciones diarias.",
        },
        {
          question: "¿Es seguro dejar cripto en el exchange?",
          answer:
            "Dejarlas en el exchange es usar una hot wallet custodial. No eres dueño real de los activos. Si quiebran, tus fondos corren riesgo.",
        },
        {
          question: "¿Las cold wallets cuestan dinero?",
          answer:
            "Sí, suelen costar entre $60 y $250. Las hot wallets, al ser software, casi siempre son gratuitas.",
        },
      ],
      ctaSectionTitle: "Audita tu Seguridad Hoy",
      ctaSectionDesc:
        "Ya sea que uses almacenamiento frío o caliente, usa nuestras herramientas gratuitas para navegar de forma segura.",
    },
    fr: {
      title: "Hot Wallet vs Cold Storage : Quelles différences en 2026 ?",
      intro:
        "Comprendre la différence entre les hot wallets et le stockage à froid (cold storage) est la base de la sécurité crypto. Découvrez quand les utiliser, leurs risques et comment les combiner.",
      ctaStart: "Explorer les Outils de Sécurité",
      ctaBlog: "Lire les Guides de Sécurité",
      whatIsTitle: "La Distinction Binaire : En ligne vs Hors ligne",
      whatIsBody:
        "La différence fondamentale entre un hot wallet et un cold wallet est la connectivité à internet. Un hot wallet est un logiciel connecté qui privilégie la praticité et la vitesse. Un cold wallet (appareil matériel) stocke vos clés privées totalement hors ligne, privilégiant la sécurité maximale. Toute votre stratégie de sécurité dépend du côté de cette frontière où vous vous situez.",
      sectionsHeader: "10 Concepts Clés du Stockage Crypto",
      sections: [
        {
          title: "1. L'Anatomie d'un Hot Wallet",
          body: "Les hot wallets existent sous forme d'extensions web (MetaMask) ou d'applications mobiles (Trust Wallet) [1.1.3]. Parce qu'ils stockent les clés en ligne, ils sont toujours prêts à l'emploi. C'est le standard pour le Web3, mais cela les expose aux menaces en ligne.",
          toolName: "Vérifier la Sécurité",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. L'Anatomie d'un Cold Wallet",
          body: "Les cold wallets sont des dispositifs physiques (Ledger, Trezor). Ils génèrent les clés et signent les transactions dans un environnement isolé. L'ordinateur ne reçoit que la transaction signée cryptographiquement : la clé ne touche jamais internet.",
        },
        {
          title: "3. Le Compromis : Praticité vs Sécurité",
          body: "Les hot wallets paient par leur 'surface d'attaque' : chaque application sur votre PC est un vecteur de malware. Les cold wallets paient par la friction : chaque transaction requiert l'appareil physique.",
        },
        {
          title: "4. Custodial vs Non-Custodial",
          body: "Il est vital de savoir qui détient les clés. Les portefeuilles d'échanges sont des hot wallets 'custodial' (ils contrôlent les clés). Les hot wallets 'non-custodial' (comme MetaMask) vous donnent les clés : vous avez le contrôle total, mais aussi la responsabilité.",
        },
        {
          title: "5. Quand utiliser un Hot Wallet",
          body: "Idéal pour les montants inférieurs à 500 $, le trading actif ou la DeFi où la rapidité est critique. Pour des transactions fréquentes, la friction d'un cold wallet serait trop lourde.",
        },
        {
          title: "6. Quand utiliser le Cold Storage",
          body: "Les montos supérieurs à 5 000 $ ont leur place dans un cold storage. Si vous 'HODLez' sur le long terme, le léger inconvénient de l'appareil est un faible prix à payer pour l'immunité contre les piratages à distance.",
        },
        {
          title: "7. Le Risque des 'Drainers' en 2026",
          body: "La vague d'arnaques crypto implique des smart contracts malveillants. Ces attaques ciblent presque exclusivement les hot wallets car les clés peuvent être atteintes par un logiciel compromis.",
        },
        {
          title: "8. L'Essor des 'Warm Wallets' et du Multisig",
          body: "De nombreux utilisateurs avancés emploient des portefeuilles multisig. Ils nécessitent plusieurs clés (ex. une hot, une cold) pour autoriser une transaction, équilibrant vitesse et sécurité.",
        },
        {
          title: "9. La Configuration Parfaite : L'Approche Hybride",
          body: "La stratégie la plus efficace est d'utiliser les deux. Gardez 90% dans un cold wallet pour l'épargne, et transférez de petits montants vers un hot wallet pour le quotidien. Le cold storage est votre coffre, le hot wallet votre compte courant.",
        },
        {
          title: "10. Complexité de Récupération",
          body: "Si vous perdez l'accès à un hot wallet, vous restaurez l'app avec votre phrase seed. Les cold wallets introduisent un facteur physique : si l'appareil est cassé, la récupération dépend du stockage hors ligne de votre seed sur papier.",
        },
      ],
      summaryTitle: "Restez en Sécurité avec Kryptonal",
      summaryBody:
        "Il n'y a pas de réponse universelle. En comprenant les atouts de la vitesse en ligne et de la sécurité hors ligne, vous pouvez créer l'architecture parfaite.",
      faqTitle: "Questions Fréquentes",
      faqs: [
        {
          question:
            "Puis-je utiliser un hot wallet et un cold wallet en même temps ?",
          answer:
            "Absolument, c'est même fortement recommandé [1.1.8]. Utilisez le cold storage pour le long terme et le hot wallet pour les petits achats.",
        },
        {
          question:
            "Est-ce sûr de laisser mes cryptos sur un échange (Binance, Coinbase) ?",
          answer:
            "Laisser des fonds sur un échange, c'est utiliser un hot wallet custodial. S'ils font faillite, vos fonds sont en danger.",
        },
        {
          question: "Les cold wallets sont-ils payants ?",
          answer:
            "Oui, les cold wallets matériels coûtent entre 60 $ et 250 $. Les hot wallets (logiciels) sont presque toujours gratuits.",
        },
      ],
      ctaSectionTitle: "Vérifiez Votre Sécurité Aujourd'hui",
      ctaSectionDesc:
        "Quel que soit votre choix, utilisez nos outils gratuits pour vérifier vos smart contracts.",
    },
    de: {
      title: "Hot Wallet vs. Cold Storage: Was ist der Unterschied in 2026?",
      intro:
        "Den Unterschied zwischen Hot Wallets und Cold Storage zu verstehen, ist die Grundlage der Krypto-Sicherheit. Lernen Sie die Risiken kennen und wie Sie beide optimal kombinieren.",
      ctaStart: "Sicherheits-Tools",
      ctaBlog: "Sicherheits-Guides",
      whatIsTitle: "Der binäre Unterschied: Online vs. Offline",
      whatIsBody:
        "Der grundlegende Unterschied zwischen einer Hot Wallet und einer Cold Wallet ist die Internetverbindung. Eine Hot Wallet ist online und auf Bequemlichkeit ausgelegt. Eine Cold Wallet (meist Hardware) speichert Ihre Schlüssel komplett offline für maximale Sicherheit. Fast alle Sicherheitseigenschaften leiten sich von diesem Unterschied ab.",
      sectionsHeader: "10 Kernkonzepte der Krypto-Aufbewahrung",
      sections: [
        {
          title: "1. Anatomie einer Hot Wallet",
          body: "Hot Wallets sind Browser-Erweiterungen (MetaMask) oder Apps (Trust Wallet) [1.1.3]. Da sie Schlüssel online generieren, sind sie immer einsatzbereit. Das macht sie ideal für Web3, aber auch anfällig für Online-Bedrohungen.",
          toolName: "Sicherheit prüfen",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Anatomie einer Cold Wallet",
          body: "Cold Wallets sind Hardware-Geräte (Ledger, Trezor). Sie signieren Transaktionen isoliert. Der verbundene PC empfängt nur die fertige Transaktion, sodass die privaten Schlüssel nie das Internet berühren.",
        },
        {
          title: "3. Bequemlichkeit vs. Sicherheit",
          body: "Hot Wallets vergrößern die Angriffsfläche – jede App ist ein potenzieller Malware-Vektor. Cold Wallets fordern physischen Aufwand – das Gerät muss bei jeder Transaktion bedient werden.",
        },
        {
          title: "4. Custodial vs. Non-Custodial",
          body: "Börsen-Wallets sind Custodial Hot Wallets (die Börse hat die Schlüssel). Bei Non-Custodial Wallets (MetaMask) haben Sie die volle Kontrolle, tragen aber das alleinige Risiko beim Verlust der Seed-Phrase.",
        },
        {
          title: "5. Wann man eine Hot Wallet nutzt",
          body: "Ideal für Beträge unter 500 $, aktives Trading oder DeFi. Bei häufigen Transaktionen wäre die Nutzung einer Hardware-Wallet zu umständlich.",
        },
        {
          title: "6. Wann man Cold Storage nutzt",
          body: "Beträge über 5.000 $ gehören in den Cold Storage. Für langfristiges 'HODLen' ist die kleine Unbequemlichkeit ein geringer Preis für die absolute Immunität gegen Remote-Hacks.",
        },
        {
          title: "7. Die Gefahr von Wallet-Drainern 2026",
          body: "Krypto-Scams nutzen oft bösartige Smart Contracts. Diese zielen fast ausschließlich auf Hot Wallets ab, da die Software direkt manipulierbar ist.",
        },
        {
          title: "8. Der Aufstieg von Multisig",
          body: "Viele fortgeschrittene Nutzer nutzen Multisig-Wallets. Diese erfordern mehrere Schlüssel (z.B. ein Hot, ein Cold) für eine Transaktion, was Geschwindigkeit und Sicherheit perfekt vereint.",
        },
        {
          title: "9. Das hybride Setup",
          body: "Die effektivste Strategie ist die Nutzung beider Arten. Behalten Sie 90 % als Ersparnis im Cold Storage und transferieren Sie kleine Summen für das tägliche Trading auf die Hot Wallet.",
        },
        {
          title: "10. Komplexität der Wiederherstellung",
          body: "Wenn Sie eine Hot Wallet verlieren, stellen Sie die App wieder her. Hardware-Wallets bringen physische Risiken mit sich: Geht das Gerät kaputt, hängt alles von Ihrem gut versteckten Papier-Backup ab.",
        },
      ],
      summaryTitle: "Bleiben Sie sicher mit Kryptonal",
      summaryBody:
        "Es gibt keine Pauschalantwort. Wer die Stärken beider Ansätze kennt, kann das perfekte Setup für die eigenen Bedürfnisse aufbauen.",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        {
          question:
            "Kann ich eine Hot Wallet und Cold Wallet gleichzeitig nutzen?",
          answer:
            "Unbedingt. Das wird sogar dringend empfohlen [1.1.8]. Nutzen Sie Cold Storage für die Masse und Hot Wallets für kleine Transaktionen.",
        },
        {
          question: "Ist es sicher, Krypto auf der Börse zu lassen?",
          answer:
            "Sie nutzen dann eine Custodial Hot Wallet. Geht die Börse pleite oder wird gehackt, sind Ihre Coins in Gefahr.",
        },
        {
          question: "Kosten Cold Wallets Geld?",
          answer:
            "Ja, Hardware-Wallets kosten meist 60 bis 250 $. Software (Hot Wallets) ist hingegen fast immer kostenlos.",
        },
      ],
      ctaSectionTitle: "Prüfen Sie Ihre Sicherheit noch heute",
      ctaSectionDesc:
        "Nutzen Sie unsere kostenlosen Tools für ein sorgenfreies Krypto-Erlebnis.",
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
      canonical: `https://www.kryptonal.com/${locale}/learn/hot-wallet-vs-cold-storage`,
      languages: {
        en: "https://www.kryptonal.com/en/learn/hot-wallet-vs-cold-storage",
        tr: "https://www.kryptonal.com/tr/learn/hot-wallet-vs-cold-storage",
        pt: "https://www.kryptonal.com/pt/learn/hot-wallet-vs-cold-storage",
        es: "https://www.kryptonal.com/es/learn/hot-wallet-vs-cold-storage",
        fr: "https://www.kryptonal.com/fr/learn/hot-wallet-vs-cold-storage",
        de: "https://www.kryptonal.com/de/learn/hot-wallet-vs-cold-storage",
      },
    },
    openGraph: {
      title: t.title,
      description: t.intro.substring(0, 150),
      url: `https://www.kryptonal.com/${locale}/learn/hot-wallet-vs-cold-storage`,
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
export default async function HotVsColdStoragePage({ params }: PageProps) {
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 mb-6 border border-rose-500/20">
              🔥 Hot Wallets vs 🧊 Cold Storage
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              {t.title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
              {t.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={`/${locale}/tools`}
                className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-xl transition-all duration-200 text-center transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-teal-500/20 no-underline"
              >
                {t.ctaStart}
              </Link>
              <Link
                href={`/${locale}/blog`}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl transition-all duration-200 text-center transform hover:-translate-y-0.5 active:translate-y-0 no-underline"
              >
                {t.ctaBlog}
              </Link>
            </div>
          </div>
        </section>

        {/* ARTICLE CONTENT SECTION */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <article className="prose prose-invert prose-teal max-w-none space-y-12">
            {/* Intro Section */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-2">
                {t.whatIsTitle}
              </h2>
              <p className="text-slate-400 leading-relaxed text-base sm:text-lg">
                {t.whatIsBody}
              </p>
            </div>

            {/* List of 10 Sections */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-2">
                {t.sectionsHeader}
              </h2>

              <div className="space-y-6">
                {t.sections.map((section: any, index: number) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <h3 className="text-xl font-semibold text-teal-400 mt-0 mb-3">
                      {section.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed m-0 mb-4">
                      {section.body}
                    </p>

                    {/* Tool specific Call To Action (only if the section has a mapped tool) */}
                    {section.toolUrl && (
                      <Link
                        href={`/${locale}${section.toolUrl}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-medium text-sm rounded-lg border border-slate-700 transition-colors no-underline group"
                      >
                        {section.toolName}
                        <span className="transform transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Highlighted Summary Area */}
            <div className="p-5 rounded-xl border-l-4 border-teal-500 bg-teal-950/20 text-slate-300 mt-12">
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
                href={`/${locale}/tools`}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg text-sm transition-colors no-underline"
              >
                {t.ctaStart}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} t={globalT} />
    </>
  );
}
