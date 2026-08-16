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
      title: "What is a Non-Custodial Crypto Wallet? The 2026 Guide",
      intro:
        "True digital ownership starts with self-custody. Learn how non-custodial crypto wallets put you in total control of your private keys and shield your wealth from exchange bankruptcies, freezes, and third-party risk.",
      ctaStart: "Explore Security Tools",
      ctaBlog: "Read Self-Custody Guides",
      whatIsTitle: "Not Your Keys, Not Your Coins",
      whatIsBody:
        "A non-custodial wallet (also known as a self-custodial wallet) gives you absolute, exclusive control over your private keys and seed phrase. Unlike centralized exchange accounts where a third party manages your funds, a non-custodial wallet ensures that no company, government, or hacker can freeze, seize, or mismanage your digital assets. It is the cornerstone of Web3 sovereignty.",
      sectionsHeader: "10 Essential Truths About Non-Custodial Wallets",
      sections: [
        {
          title: "1. Complete Control Over Your Private Keys",
          body: "In a non-custodial setup, your private keys are generated and stored locally on your device—never on a centralized server. You are the sole custodian of your funds.",
          toolName: "Check Wallet Security",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Immunity to Exchange Bankruptcies and Freezes",
          body: "Centralized exchanges can halt withdrawals or go bankrupt during market panics. Non-custodial wallets interact directly with the blockchain, guaranteeing 24/7 liquidity and access.",
        },
        {
          title: "3. The Double-Edged Sword: Total Personal Responsibility",
          body: "With complete freedom comes complete responsibility. There is no 'Forgot Password' button or customer support team to recover lost keys if you lose your recovery seed phrase.",
        },
        {
          title: "4. Hardware vs. Software Non-Custodial Wallets",
          body: "Software wallets (MetaMask, Phantom) store keys on internet-connected devices for convenience. Hardware non-custodial wallets (Ledger, Trezor) keep keys strictly offline for maximum security.",
        },
        {
          title: "5. Seamless Web3 and DeFi Integration",
          body: "Non-custodial wallets act as your digital passport to Web3, allowing you to connect directly to decentralized exchanges, NFT marketplaces, and staking protocols without intermediaries.",
        },
        {
          title: "6. Enhanced Privacy and Anonymity",
          body: "Setting up a non-custodial wallet requires no Know-Your-Customer (KYC) verification, background checks, or personal data submissions, preserving your financial privacy.",
        },
        {
          title: "7. Protection Against Malicious Smart Contracts",
          body: "While your keys are safe from exchange failures, interacting with unverified Web3 dApps can still expose your funds to drainers. Always audit smart contract allowances before approving transactions.",
        },
        {
          title: "8. The Power of Portable Recovery",
          body: "Your assets live on the blockchain, not inside a specific app. You can import your 12/24-word seed phrase into any compatible non-custodial wallet software anytime.",
        },
        {
          title: "9. Multi-Signature (Multisig) Possibilities",
          body: "Advanced non-custodial setups allow multi-signature authorization (e.g., 2-of-3 keys), enabling institutional-grade security for corporate treasuries and high-net-worth individuals.",
        },
        {
          title: "10. The Golden Rule of Backup Storage",
          body: "Protecting your 12/24-word seed phrase on a physical, fireproof medium (like stainless steel) is the single most important step in maintaining a secure non-custodial wallet.",
        },
      ],
      summaryTitle: "Summary & Best Practices",
      summaryBody:
        "Adopting a non-custodial crypto wallet is the ultimate step toward true financial independence. Combine software ease for small trades with a hardware wallet for long-term cold storage.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          question: "Is MetaMask a non-custodial wallet?",
          answer:
            "Yes, MetaMask is a non-custodial software wallet. You hold the private keys and 12-word secret recovery phrase.",
        },
        {
          question: "Can a government freeze my non-custodial wallet?",
          answer:
            "No. Because the keys reside on your local device or offline hardware, third parties cannot freeze or confiscate your wallet remotely.",
        },
        {
          question: "What happens if I lose my seed phrase?",
          answer:
            "If you lose your seed phrase and your device breaks or gets wiped, your assets are permanently lost. There is no way to reset it.",
        },
      ],
      ctaSectionTitle: "Audit Your Non-Custodial Security Today",
      ctaSectionDesc:
        "Take charge of your assets with confidence. Use our free risk checkers to validate contract interactions and secure your self-custody setup.",
    },
    tr: {
      title: "Gözetimsiz (Non-Custodial) Kripto Cüzdanı Nedir? 2026 Rehberi",
      intro:
        "Gerçek dijital mülkiyet kendi gözetiminizle (self-custody) başlar. Gözetimsiz cüzdanların özel anahtarlarınızın tam kontrolünü size nasıl verdiğini ve varlıklarınızı borsa iflaslarından nasıl koruduğunu öğrenin.",
      ctaStart: "Güvenlik Araçlarını Keşfet",
      ctaBlog: "Kişisel Saklama Rehberlerini Oku",
      whatIsTitle: "Anahtarlar Senin Değilse, Coinler de Senin Değildir",
      whatIsBody:
        "Gözetimsiz (non-custodial) bir cüzdan, özel anahtarlarınız ve kurtarma ifadeniz üzerinde mutlak ve özel kontrol sağlar. Merkezi borsa hesaplarının aksine, hiç bir şirket veya hükümet dijital varlıklarınızı donduramaz veya bunlara el koyamaz.",
      sectionsHeader: "Gözetimsiz Cüzdanlar Hakkında 10 Temel Gerçek",
      sections: [
        {
          title: "1. Özel Anahtarlarınız Üzerinde Tam Kontrol",
          body: "Gözetimsiz bir yapıda özel anahtarlarınız merkezi bir sunucuda değil, cihazınızda yerel olarak üretilir ve saklanır.",
          toolName: "Cüzdan Güvenliğini Kontrol Et",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Borsa İflaslarına ve Dondurmalarına Karşı Bağışıklık",
          body: "Merkezi borsalar çekim işlemlerini durdurabilir. Gözetimsiz cüzdanlar ise doğrudan blokzinciri ile etkileşime girerek 7/24 erişim sağlar.",
        },
        {
          title: "3. Çift Taraflı Madalyon: Tam Kişisel Sorumluluk",
          body: "Tam özgürlük tam sorumluluk getirir. Anahtarlarınızı veya kurtarma ifadenizi kaybederseniz bunu geri getirecek bir müşteri hizmetleri yoktur.",
        },
        {
          title: "4. Yazılımsal ve Donanımsal Gözetimsiz Cüzdanlar",
          body: "Yazılım cüzdanları (MetaMask, Phantom) pratiklik sunar. Donanım cüzdanları (Ledger, Trezor) ise anahtarları çevrimdışı tutarak maksimum güvenlik sağlar.",
        },
        {
          title: "5. Kesintisiz Web3 ve DeFi Entegrasyonu",
          body: "Gözetimsiz cüzdanlar Web3 pasaportunuzdur; merkeziyetsiz borsalara ve protokollerle doğrudan bağlantı kurmanızı sağlar.",
        },
        {
          title: "6. Artırılmış Gizlilik ve Anonimlik",
          body: "Gözetimsiz cüzdan oluşturmak KYC doğrulaması veya kişisel veri gönderimi gerektirmez, finansal gizliliğinizi korur.",
        },
        {
          title: "7. Kötü Niyetli Akıllı Sözleşmelere Karşı Koruma",
          body: "Anahtarlarınız güvende olsa da doğrulama yapmadan kötü amaçlı dApp'lerle etkileşime girmek risklidir. İşlemleri onaylamadan önce izinleri mutlaka denetleyin.",
        },
        {
          title: "8. Taşınabilir Kurtarma Gücü",
          body: "Varlıklarınız uygulamanın içinde değil blokzincirindedir. 12/24 kelimelik ifadenizi istediğiniz uyumlu yazılıma aktarabilirsiniz.",
        },
        {
          title: "9. Çoklu İmza (Multisig) İmkânları",
          body: "Gelişmiş kurulumlar çoklu imza yetkilendirmesi (örn. 3 anahtardan 2'si) sağlayarak kurumsal düzeyde güvenlik sunar.",
        },
        {
          title: "10. Çevrimdışı Yedeklemenin Altın Kuralı",
          body: "Kurtarma ifadenizi yangına dayanıklı metal bir plakada saklamak, cüzdan güvenliğinizi korumanın en önemli adımıdır.",
        },
      ],
      summaryTitle: "Özet ve En İyi Uygulamalar",
      summaryBody:
        "Gözetimsiz bir cüzdana geçmek finansal bağımsızlığın en büyük adımıdır. Günlük işlemler için yazılım cüzdanlarını, uzun vadeli birikimler için donanım cüzdanlarını birleştirin.",
      faqTitle: "Sıkça Sorulan Sorular",
      faqs: [
        {
          question: "MetaMask gözetimsiz (non-custodial) bir cüzdan mıdır?",
          answer:
            "Evet, MetaMask gözetimsiz bir yazılım cüzdanıdır. Özel anahtarlar ve 12 kelimelik kurtarma ifadesi tamamen sizin elinizdedir.",
        },
        {
          question: "Bir hükümet gözetimsiz cüzdanımı dondurabilir mi?",
          answer:
            "Hayır. Anahtarlar yerel cihazınızda veya çevrimdışı donanımınızda olduğu için üçüncü taraflar cüzdanınızı uzaktan donduramaz.",
        },
        {
          question: "Kurtarma ifademi kaybedersem ne olur?",
          answer:
            "Kurtarma ifadenizi kaybederseniz ve cihazınız bozulursa, varlıklarınız kalıcı olarak kaybolur.",
        },
      ],
      ctaSectionTitle: "Cüzdan Güvenliğinizi Bugün Denetleyin",
      ctaSectionDesc:
        "Varlıklarınızın kontrolünü güvenle elinize alın. Sözleşme etkileşimlerini doğrulamak için ücretsiz araçlarımızı kullanın.",
    },
    pt: {
      title: "O que é uma Carteira Cripto Não-Custodial? Guia 2026",
      intro:
        "A verdadeira propriedade digital começa com a autocustódia. Saiba como as carteiras não-custodiais colocam você no controle total das suas chaves privadas.",
      ctaStart: "Explorar Ferramentas",
      ctaBlog: "Ler Guias de Autocustódia",
      whatIsTitle: "Not Your Keys, Not Your Coins",
      whatIsBody:
        "Uma carteira não-custodial oferece controle exclusivo sobre suas chaves privadas e frase semente. Ao contrário das corretoras, nenhuma empresa ou governo pode congelar seus fundos.",
      sectionsHeader: "10 Verdades Sobre Carteiras Não-Custodiais",
      sections: [
        {
          title: "1. Controle Total das Suas Chaves Privadas",
          body: "Suas chaves são geradas e armazenadas localmente no seu dispositivo, garantindo que você seja o único custodiante.",
          toolName: "Verificar Segurança",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Imunidade a Falências de Corretoras",
          body: "Corretoras centralizadas podem pausar saques. Carteiras não-custodiais interagem direto com a blockchain, garantindo acesso 24/7.",
        },
        {
          title: "3. A Responsabilidade É Totalmente Sua",
          body: "Não existe botão de 'Esqueci a senha'. Se perder sua frase de recuperação, ninguém poderá recuperar seus fundos.",
        },
        {
          title: "4. Carteiras de Software vs. Hardware",
          body: "Carteiras de software (MetaMask) oferecem praticidade. Carteiras de hardware (Ledger, Trezor) mantêm as chaves offline para segurança máxima.",
        },
        {
          title: "5. Integração com Web3 e DeFi",
          body: "Funcionam como seu passaporte digital para conectar a corretoras descentralizadas e dApps sem intermediários.",
        },
        {
          title: "6. Maior Privacidade Financeira",
          body: "Criar uma carteira não-custodial não exige verificação de identidade (KYC) nem envio de dados pessoais.",
        },
        {
          title: "7. Cuidado com Contratos Inteligentes Maliciosos",
          body: "Suas chaves ficam seguras, mas aprovar contratos maliciosos pode drenar seus fundos. Audite as permissões antes de assinar.",
        },
        {
          title: "8. Recuperação Portátil",
          body: "Seus ativos estão na blockchain. Você pode importar sua frase de 12/24 palavras em qualquer aplicativo compatível a qualquer momento.",
        },
        {
          title: "9. Opções de Múltiplas Assinaturas (Multisig)",
          body: "Permitem exigir várias chaves para autorizar transações, garantindo proteção de nível institucional.",
        },
        {
          title: "10. A Regra do Backup Físico",
          body: "Proteger sua frase semente em metal é o passo mais importante para manter sua carteira não-custodial segura.",
        },
      ],
      summaryTitle: "Resumo e Recomendações",
      summaryBody:
        "Adotar uma carteira não-custodial é o passo definitivo para a independência financeiras no ecossistema cripto.",
      faqTitle: "Perguntas Frequentes",
      faqs: [
        {
          question: "A MetaMask é uma carteira não-custodial?",
          answer:
            "Sim. Na MetaMask você possui o controle total das chaves privadas e da frase de recuperação.",
        },
        {
          question: "Um governo pode congelar minha carteira não-custodial?",
          answer:
            "Não. Como as chaves ficam no seu dispositivo local, terceiros não conseguem bloquear o acesso remotamente.",
        },
        {
          question: "O que acontece se eu perder minha frase semente?",
          answer:
            "Se você perder a frase e o dispositivo quebrar, seus fundos serão perdidos permanentemente.",
        },
      ],
      ctaSectionTitle: "Audite sua Segurança Hoje",
      ctaSectionDesc:
        "Assuma o controle dos seus ativos com confiança usando nossas ferramentas gratuitas.",
    },
    es: {
      title: "¿Qué es una Billetera Cripto No Custodial? Guía 2026",
      intro:
        "La verdadera propiedad digital comienza con la autocustodia. Descubre cómo las billeteras no custodiales te dan el control total de tus llaves privadas.",
      ctaStart: "Explorar Herramientas",
      ctaBlog: "Leer Guías de Autocustodia",
      whatIsTitle: "Si No Son Tus Llaves, No Son Tus Monedas",
      whatIsBody:
        "Una billetera no custodial te otorga control absoluto sobre tus llaves privadas. A diferencia de un exchange, ninguna empresa o gobierno puede congelar o confiscar tus fondos.",
      sectionsHeader: "10 Verdades Sobre las Billeteras No Custodiales",
      sections: [
        {
          title: "1. Control Total de tus Llaves Privadas",
          body: "Tus llaves se generan y almacenan localmente en tu dispositivo, garantizando que seas el único dueño de tus activos.",
          toolName: "Verificar Seguridad",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Inmunidad ante Quiebras de Exchanges",
          body: "Los exchanges centralizados pueden congelar retiros. Las billeteras no custodiales interactúan directamente con la blockchain 24/7.",
        },
        {
          title: "3. Responsabilidad Personal Absoluta",
          body: "No existe la opción de 'Olvidé mi contraseña'. Si pierdes tu frase de recuperación, nadie podrá ayudarte a recuperar los fondos.",
        },
        {
          title: "4. Billeteras de Software vs. Hardware",
          body: "Las de software (MetaMask) ofrecen rapidez. Las de hardware (Ledger, Trezor) mantienen las llaves offline para máxima seguridad.",
        },
        {
          title: "5. Integración Directa con Web3 y DeFi",
          body: "Funcionan como tu pasaporte digital para interactuar con aplicaciones descentralizadas sin intermediarios.",
        },
        {
          title: "6. Mayor Privacidad Financiera",
          body: "Crear una billetera no custodial no requiere verificación KYC ni ingresar datos personales.",
        },
        {
          title: "7. Cuidado con Contratos Inteligentes Maliciosos",
          body: "Interactuar con dApps no verificadas puede exponer tus fondos. Revisa siempre los permisos antes de firmar.",
        },
        {
          title: "8. Recuperación Portátil",
          body: "Tus activos están en la blockchain. Puedes importar tu frase semilla en cualquier software compatible cuando quieras.",
        },
        {
          title: "9. Esquemas Multifirma (Multisig)",
          body: "Permiten requerir múltiples llaves para autorizar una transacción, añadiendo seguridad de nivel institucional.",
        },
        {
          title: "10. La Importancia del Respaldo Físico",
          body: "Guardar tu frase semilla en un soporte resistente de metal es el paso clave para proteger tu billetera.",
        },
      ],
      summaryTitle: "Resumen y Recomendaciones",
      summaryBody:
        "Adoptar una billetera no custodial es el paso definitivo hacia la verdadera independencia financiera en Web3.",
      faqTitle: "Preguntas Frecuentes",
      faqs: [
        {
          question: "¿MetaMask es una billetera no custodial?",
          answer:
            "Sí. Con MetaMask tú posees las llaves privadas y la frase de recuperación de 12 palabras.",
        },
        {
          question: "¿Un gobierno puede congelar mi billetera no custodial?",
          answer:
            "No. Como las llaves están en tu dispositivo local u offline, nadie puede congelarla de forma remota.",
        },
        {
          question: "¿Qué pasa si pierdo mi frase semilla?",
          answer:
            "Si pierdes la frase y tu dispositivo se rompe, perderás tus fondos de forma permanente.",
        },
      ],
      ctaSectionTitle: "Audita tu Seguridad Hoy",
      ctaSectionDesc:
        "Toma el control de tus activos con confianza usando nuestras herramientas gratuitas.",
    },
    fr: {
      title: "Qu'est-ce qu'un Portefeuille Crypto Non-Custodial ? Guide 2026",
      intro:
        "La vraie propriété numérique commence par l'auto-conservation. Découvrez comment les portefeuilles non-custodial vous donnent le contrôle total de vos clés privées.",
      ctaStart: "Explorer les Outils",
      ctaBlog: "Lire les Guides d'Auto-Conservation",
      whatIsTitle: "Pas Vos Clés, Pas Vos Coins",
      whatIsBody:
        "Un portefeuille non-custodial vous donne un contrôle exclusif sur vos clés privées. Contrairement aux plateformes d'échange, aucune entreprise ne peut geler vos fonds.",
      sectionsHeader: "10 Vérités sur les Portefeuilles Non-Custodial",
      sections: [
        {
          title: "1. Contrôle Total de Vos Clés Privées",
          body: "Vos clés sont générées et stockées localement sur votre appareil, faisant de vous le seul maître de vos fonds.",
          toolName: "Vérifier la Sécurité",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Immunité Face aux Faillites d'Échanges",
          body: "Les plateformes centralisées peuvent bloquer les retraits. Les portefeuilles non-custodial interagissent directement avec la blockchain 24/7.",
        },
        {
          title: "3. Une Responsabilité Individuelle Totale",
          body: "Il n'y a pas de bouton 'Mot de passe oublié'. La perte de votre phrase seed entraîne la perte définitive de vos accès.",
        },
        {
          title: "4. Portefeuilles Logiciels vs. Matériels",
          body: "Les portefeuilles logiciels (MetaMask) offrent de la flexibilité. Les portefeuilles matériels (Ledger, Trezor) gardent les clés hors ligne.",
        },
        {
          title: "5. Intégration Directe avec le Web3 et la DeFi",
          body: "Ils servent de passeport numérique pour interagir avec les applications décentralisées sans intermédiaire.",
        },
        {
          title: "6. Confidentialité Financière Renforcée",
          body: "Créer un portefeuille non-custodial ne nécessite aucune vérification d'identité (KYC) ni donnée personnelle.",
        },
        {
          title: "7. Attention aux Smart Contracts Frauduleux",
          body: "Signer une transaction sur une dApp malveillante peut vider votre portefeuille. Auditez toujours les autorisations.",
        },
        {
          title: "8. Récupération Portables",
          body: "Vos actifs sont sur la blockchain. Vous pouvez importer votre phrase seed sur n'importe quel logiciel compatible.",
        },
        {
          title: "9. Options Multi-Signatures (Multisig)",
          body: "Permettent d'exiger plusieurs clés pour valider une transaction, idéal pour une sécurité de niveau institutionnel.",
        },
        {
          title: "10. L'Importance de la Sauvegarde Physique",
          body: "Protéger votre phrase seed sur un support en acier est l'étape essentielle pour sécuriser votre portefeuille.",
        },
      ],
      summaryTitle: "Résumé & Recommandations",
      summaryBody:
        "Adopter un portefeuille non-custodial est l'étape ultime vers une véritable souveraineté financière numérique.",
      faqTitle: "Questions Fréquentes",
      faqs: [
        {
          question: "MetaMask est-il un portefeuille non-custodial ?",
          answer:
            "Oui. Vous êtes le seul détenteur des clés privées et de la phrase de récupération sur MetaMask.",
        },
        {
          question:
            "Un gouvernement peut-il geler mon portefeuille non-custodial ?",
          answer:
            "Non. Les clés étant stockées sur votre appareil local, aucun tiers ne peut geler vos fonds à distance.",
        },
        {
          question: "Que se passe-t-il si je perds ma phrase seed ?",
          answer:
            "Si vous perdez votre phrase seed et que votre appareil tombe en panne, vos fonds sont définitivement perdus.",
        },
      ],
      ctaSectionTitle: "Auditez Votre Sécurité Aujourd'hui",
      ctaSectionDesc:
        "Prenez le contrôle de vos actifs en toute confiance grâce à nos outils gratuits.",
    },
    de: {
      title: "Was ist ein Non-Custodial Crypto Wallet? Guide 2026",
      intro:
        "Echte digitale Eigentümerschaft beginnt mit Eigenverwahrung. Erfahren Sie, wie Non-Custodial Wallets Ihnen die volle Kontrolle über Ihre privaten Schlüssel geben.",
      ctaStart: "Sicherheits-Tools",
      ctaBlog: "Eigenverwaltungs-Guides lesen",
      whatIsTitle: "Not Your Keys, Not Your Coins",
      whatIsBody:
        "Ein Non-Custodial Wallet gibt Ihnen die exklusive Kontrolle über Ihre privaten Schlüssel und Ihre Seed-Phrase. Im Gegensatz zu Börsen kann kein Dritter Ihre Gelder einfrieren.",
      sectionsHeader: "10 Kernwahrheiten über Non-Custodial Wallets",
      sections: [
        {
          title: "1. Volle Kontrolle über Ihre privaten Schlüssel",
          body: "Ihre Schlüssel werden lokal auf Ihrem Gerät generiert und gespeichert. Sie sind der einzige Verwalter Ihrer Krypto-Werte.",
          toolName: "Wallet-Sicherheit prüfen",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Immunität gegen Börsen-Insolvenzen",
          body: "Zentrale Börsen können Auszahlungen stoppen. Non-Custodial Wallets interagieren direkt mit der Blockchain und bieten 24/7 Zugriff.",
        },
        {
          title: "3. Volle persönliche Verantwortung",
          body: "Es gibt keine 'Passwort vergessen'-Funktion. Verliert man die Seed-Phrase, gibt es keinen Kundensupport, der helfen kann.",
        },
        {
          title: "4. Software- vs. Hardware-Wallets",
          body: "Software-Wallets (MetaMask) bieten Komfort für den Alltag. Hardware-Wallets (Ledger, Trezor) halten die Schlüssel offline für maximale Sicherheit.",
        },
        {
          title: "5. Nahtlose Web3- und DeFi-Integration",
          body: "Sie fungieren als digitaler Reisepass, um sich direkt mit dezentralen Börsen und dApps zu verbinden.",
        },
        {
          title: "6. Höhere finanzielle Privatsphäre",
          body: "Die Erstellung erfordert keine KYC-Verifizierung oder Angabe persönlicher Daten.",
        },
        {
          title: "7. Schutz vor bösartigen Smart Contracts",
          body: "Interaktionen mit unüberprüften dApps können Ihr Wallet leeren. Prüfen Sie Berechtigungen stets vor der Freigabe.",
        },
        {
          title: "8. Portable Wiederherstellung",
          body: "Ihre Coins liegen auf der Blockchain. Sie können Ihre 12/24 Wörter jederzeit in jede kompatible Wallet-Software importieren.",
        },
        {
          title: "9. Multi-Signature (Multisig) Optionen",
          body: "Ermöglicht die Anforderung mehrerer Schlüssel für eine Transaktion – ideal für institutionelle Sicherheit.",
        },
        {
          title: "10. Die Wichtigkeit des physischen Backups",
          body: "Der Schutz Ihrer Seed-Phrase auf einem feuerfesten Edelstahl-Medium ist der wichtigste Schritt zur Absicherung.",
        },
      ],
      summaryTitle: "Zusammenfassung & Best Practices",
      summaryBody:
        "Ein Non-Custodial Wallet ist der finale Schritt zu echter finanzieller Unabhängigkeit im Krypto-Bereich.",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Ist MetaMask ein Non-Custodial Wallet?",
          answer:
            "Ja, MetaMask ist ein Non-Custodial Software-Wallet. Sie besitzen die privaten Schlüssel und die Seed-Phrase.",
        },
        {
          question: "Kann eine Regierung mein Non-Custodial Wallet einfrieren?",
          answer:
            "Nein. Da die Schlüssel auf Ihrem lokalen Gerät liegen, können Dritte das Wallet nicht aus der Ferne sperren.",
        },
        {
          question: "Was passiert, wenn ich meine Seed-Phrase verliere?",
          answer:
            "Wenn Sie die Seed-Phrase verlieren und Ihr Gerät kaputtgeht, sind Ihre Gelder dauerhaft verloren.",
        },
      ],
      ctaSectionTitle: "Prüfen Sie Ihre Sicherheit noch heute",
      ctaSectionDesc:
        "Übernehmen Sie die Kontrolle über Ihre Assets mit unseren kostenlosen Sicherheits-Tools.",
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
      canonical: `https://www.kryptonal.com/${locale}/learn/non-custodial-crypto-wallet`,
      languages: {
        en: "https://www.kryptonal.com/en/learn/non-custodial-crypto-wallet",
        tr: "https://www.kryptonal.com/tr/learn/non-custodial-crypto-wallet",
        pt: "https://www.kryptonal.com/pt/learn/non-custodial-crypto-wallet",
        es: "https://www.kryptonal.com/es/learn/non-custodial-crypto-wallet",
        fr: "https://www.kryptonal.com/fr/learn/non-custodial-crypto-wallet",
        de: "https://www.kryptonal.com/de/learn/non-custodial-crypto-wallet",
      },
    },
    openGraph: {
      title: t.title,
      description: t.intro.substring(0, 150),
      url: `https://www.kryptonal.com/${locale}/learn/non-custodial-crypto-wallet`,
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
export default async function NonCustodialWalletPage({ params }: PageProps) {
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
              🔑 Self-Custody & Ownership
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

                    {/* Tool specific Call To Action */}
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
