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
      title: "10 Mistakes to Watch Out For If You Are New to Cryptocurrency",
      intro:
        "Entering the crypto space is exciting, but the learning curve is steep. From fake coins to sending funds to the wrong network, avoid these 10 critical mistakes to protect your digital assets.",
      ctaStart: "Explore Security Tools",
      ctaBlog: "Read Security Guides",
      whatIsTitle: "The Cost of Making Mistakes in Web3",
      whatIsBody:
        "Unlike traditional banking, blockchain technology does not have a customer service department or a 'reverse transaction' button. If you make a mistake, your funds are often gone forever. Scammers actively target beginners with honeypots, phishing links, and fake support accounts. However, by learning these 10 common pitfalls and utilizing Kryptonal's free security tools, you can trade and hold your assets with complete confidence.",
      mistakesHeader: "The 10 Critical Beginner Mistakes",
      mistakes: [
        {
          title: "1. Sending Funds to the Wrong Address or Network",
          body: "A single typo in a crypto address, or sending an Ethereum token to a Binance Smart Chain network, will result in permanent loss of funds. Always double-check addresses and test with a small amount first.",
          toolName: "Use Address Validator",
          toolUrl: "/tools/address-validator",
        },
        {
          title: "2. Buying 'Honeypot' Tokens",
          body: "A honeypot is a malicious smart contract designed to let you buy a token, but completely block you from selling it. The chart looks like it only goes up, trapping your money forever.",
          toolName: "Use Honeypot Checker",
          toolUrl: "/tools/honeypot-checker",
        },
        {
          title: "3. Connecting to Malicious dApps",
          body: "Hackers create fake websites that mimic popular exchanges or NFT mints. If you connect your wallet and sign a malicious transaction, they can drain your entire balance in seconds.",
          toolName: "Check Wallet Security",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "4. Falling for Phishing & Fake Giveaways",
          body: "If someone on Twitter or Discord offers to 'double your crypto' or acts as 'customer support' asking for your seed phrase, it is a scam. Never click suspicious links.",
          toolName: "Use Scam Risk Checker",
          toolUrl: "/tools/crypto-scam-risk-checker",
        },
        {
          title: "5. Losing or Exposing Your Seed Phrase",
          body: "Your 12- or 24-word seed phrase is the master key to your funds. Taking a screenshot, saving it in a cloud drive, or losing the physical paper means losing your crypto.",
        },
        {
          title: "6. Leaving Large Amounts on Exchanges",
          body: "Centralized exchanges can go bankrupt (like FTX) or get hacked. If you don't hold your private keys, you don't truly own your crypto. Use a hardware wallet for long-term storage.",
        },
        {
          title: "7. FOMO Buying at the All-Time High",
          body: "Fear Of Missing Out (FOMO) causes beginners to buy when a coin is heavily hyped on social media, often right before a massive price crash. Always wait for corrections.",
        },
        {
          title: "8. Ignoring Gas Fees",
          body: "Blockchain transactions require network fees (Gas). Beginners often try to transfer $20 worth of Ethereum, only to realize the network fee itself costs $30, resulting in stuck transactions.",
        },
        {
          title: "9. Trusting 'Guaranteed Return' Schemes",
          body: "In crypto, yield comes from risk. If a platform guarantees 5% daily returns or promises completely risk-free staking, it is almost certainly a Ponzi scheme.",
        },
        {
          title: "10. Not Doing Fundamental Research",
          body: "Buying a coin just because it has a funny dog logo without checking its market cap, tokenomics, or developer activity is gambling, not investing.",
        },
      ],
      summaryTitle: "Stay Safe with Kryptonal",
      summaryBody:
        "The best defense in the cryptocurrency market is a combination of education and utilizing the right tools. Always verify addresses, scan smart contracts before buying, and keep your seed phrase offline.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          question:
            "Can I reverse a crypto transaction if I sent it to the wrong address?",
          answer:
            "No. Blockchain transactions are immutable. Once confirmed on the network, they cannot be reversed or canceled.",
        },
        {
          question: "How do I know if a new coin is a honeypot?",
          answer:
            "You can use Kryptonal's Honeypot Checker to simulate a buy and sell transaction on the smart contract before you invest real money.",
        },
        {
          question: "Is it safe to keep my crypto on Binance or Coinbase?",
          answer:
            "While top-tier exchanges have strong security, they are not immune to hacks or regulatory freezes. It is safer to use them only for trading, and transfer long-term holdings to a self-custodial hardware wallet.",
        },
      ],
      ctaSectionTitle: "Audit Your Security Setup Today",
      ctaSectionDesc:
        "Don't wait until you lose your funds to start taking security seriously. Use our free suite of risk checkers to validate addresses and scan for scams.",
    },
    tr: {
      title: "Kripto Paraya Yeni Başlayanların Dikkat Etmesi Gereken 10 Hata",
      intro:
        "Kripto dünyasına girmek heyecan vericidir, ancak öğrenme eğrisi diktir. Sahte coinlerden yanlış ağa fon göndermeye kadar, dijital varlıklarınızı korumak için bu 10 kritik hatadan kaçının.",
      ctaStart: "Güvenlik Araçlarını Keşfet",
      ctaBlog: "Güvenlik Rehberlerini Oku",
      whatIsTitle: "Web3'te Hata Yapmanın Bedeli",
      whatIsBody:
        "Geleneksel bankacılığın aksine, blokzincir teknolojisinde müşteri hizmetleri veya 'işlemi iptal et' butonu yoktur. Bir hata yaparsanız, fonlarınız genellikle sonsuza dek kaybolur. Dolandırıcılar, oltalama bağlantıları ve sahte destek hesaplarıyla yeni başlayanları hedef alır.",
      mistakesHeader: "Yeni Başlayanların Yaptığı 10 Kritik Hata",
      mistakes: [
        {
          title: "1. Yanlış Adrese veya Ağa Fon Göndermek",
          body: "Kripto adresinde tek bir harf hatası veya yanlış ağ seçimi fonların kalıcı kaybına neden olur.",
          toolName: "Adres Doğrulayıcıyı Kullan",
          toolUrl: "/tools/address-validator",
        },
        {
          title: "2. 'Honeypot' Tokenları Almak",
          body: "Honeypot, bir tokenı almanıza izin veren ancak satmanızı tamamen engelleyen kötü amaçlı bir akıllı sözleşmedir.",
          toolName: "Honeypot Denetleyiciyi Kullan",
          toolUrl: "/tools/honeypot-checker",
        },
        {
          title: "3. Kötü Niyetli dApp'lere Bağlanmak",
          body: "Bilgisayar korsanları popüler borsaları taklit eden sahte web siteleri oluşturur. Cüzdanınızı bağlarsanız, bakiyenizi saniyeler içinde boşaltabilirler.",
          toolName: "Cüzdan Güvenliğini Kontrol Et",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "4. Oltalama ve Sahte Çekilişlere Kanmak",
          body: "Biri kriptonuzu 'ikiye katlamayı' teklif ederse veya destek ekibi gibi davranırsa, bu bir dolandırıcılıktır.",
          toolName: "Dolandırıcılık Riskini Kontrol Et",
          toolUrl: "/tools/crypto-scam-risk-checker",
        },
        {
          title: "5. Kurtarma İfadelerini (Seed Phrase) Kaybetmek",
          body: "12 veya 24 kelimelik ifadeniz fonlarınızın ana anahtarıdır. Bunu buluta kaydetmek veya kaybetmek kriptonuzu kaybetmek demektir.",
        },
        {
          title: "6. Borsalarda Büyük Miktarlar Tutmak",
          body: "Özel anahtarlarınızı elinizde tutmuyorsanız, kriptonuza gerçekten sahip değilsinizdir. Uzun vadeli depolama için donanım cüzdanı kullanın.",
        },
        {
          title: "7. Zirveden FOMO ile Alım Yapmak",
          body: "Fırsatı Kaçırma Korkusu (FOMO), yeni başlayanların sosyal medyada abartıldığında alım yapmasına neden olur.",
        },
        {
          title: "8. Ağ Ücretlerini (Gas) Göz Ardı Etmek",
          body: "Blokzincir işlemleri ağ ücretleri gerektirir. 20 dolarlık transfer için 30 dolar ücret ödemek zorunda kalabilirsiniz.",
        },
        {
          title: "9. 'Garantili Getiri' Vaatlerine Güvenmek",
          body: "Bir platform risksiz günlük %5 getiri garanti ediyorsa, bu neredeyse kesinlikle bir Ponzi şemasıdır.",
        },
        {
          title: "10. Temel Araştırma Yapmamak",
          body: "Sadece komik bir köpek logosu var diye piyasa değerini kontrol etmeden coin almak yatırım değil, kumardır.",
        },
      ],
      summaryTitle: "Kryptonal İle Güvende Kalın",
      summaryBody:
        "Kripto piyasasındaki en iyi savunma, eğitim ve doğru araçların birleşimidir. Adresleri her zaman doğrulayın ve satın almadan önce sözleşmeleri tarayın.",
      faqTitle: "Sıkça Sorulan Sorular",
      faqs: [
        {
          question:
            "Yanlış adrese gönderdiğim bir kripto işlemini geri alabilir miyim?",
          answer:
            "Hayır. Blokzincir işlemleri değiştirilemez. Onaylandıktan sonra geri alınamazlar.",
        },
        {
          question: "Yeni bir coinin honeypot olup olmadığını nasıl anlarım?",
          answer:
            "Gerçek para yatırmadan önce akıllı sözleşme üzerinde alım satım simülasyonu yapmak için Kryptonal Honeypot Checker'ı kullanabilirsiniz.",
        },
        {
          question: "Kriptomu borsada tutmak güvenli mi?",
          answer:
            "Büyük borsalar güvenli olsa da, uzun vadeli yatırımlarınızı donanım cüzdanına çekmek daha güvenlidir.",
        },
      ],
      ctaSectionTitle: "Güvenlik Ayarlarınızı Bugün Denetleyin",
      ctaSectionDesc:
        "Güvenliği ciddiye almak için fonlarınızı kaybetmeyi beklemeyin. Adresleri doğrulamak için ücretsiz araçlarımızı kullanın.",
    },
    pt: {
      title: "10 Erros a Evitar se Você é Novo em Criptomoedas",
      intro:
        "Entrar no espaço cripto é emocionante, mas a curva de aprendizado é íngreme. Desde moedas falsas a enviar fundos para a rede errada, evite estes 10 erros críticos.",
      ctaStart: "Explorar Ferramentas de Segurança",
      ctaBlog: "Ler Guias de Segurança",
      whatIsTitle: "O Custo de Cometer Erros na Web3",
      whatIsBody:
        "Ao contrário dos bancos, o blockchain não tem botão de 'cancelar transação'. Se você cometer um erro, seus fundos geralmente desaparecem para sempre.",
      mistakesHeader: "Os 10 Erros Críticos de Iniciantes",
      mistakes: [
        {
          title: "1. Enviar Fundos para Endereço ou Rede Errada",
          body: "Um erro de digitação resultará em perda permanente. Verifique sempre os endereços.",
          toolName: "Usar Validador de Endereço",
          toolUrl: "/tools/address-validator",
        },
        {
          title: "2. Comprar Tokens 'Honeypot'",
          body: "Um honeypot permite comprar um token, mas bloqueia a venda.",
          toolName: "Usar Verificador Honeypot",
          toolUrl: "/tools/honeypot-checker",
        },
        {
          title: "3. Conectar a dApps Maliciosos",
          body: "Se você conectar sua carteira a um site falso, eles podem roubar seu saldo em segundos.",
          toolName: "Verificar Segurança da Carteira",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "4. Cair em Phishing e Falsos Sorteios",
          body: "Se alguém oferecer para 'dobrar suas criptos', é golpe.",
          toolName: "Usar Verificador de Risco",
          toolUrl: "/tools/crypto-scam-risk-checker",
        },
        {
          title: "5. Perder sua Frase Semente (Seed Phrase)",
          body: "Sua frase de 12 ou 24 palavras é a chave mestra. Perder o papel significa perder suas criptos.",
        },
        {
          title: "6. Deixar Grandes Quantidades em Corretoras",
          body: "Se você não possui as chaves privadas, não possui as criptos. Use uma carteira de hardware.",
        },
        {
          title: "7. Comprar por FOMO no Topo Histórico",
          body: "O medo de ficar de fora faz iniciantes comprarem quando uma moeda está muito cara.",
        },
        {
          title: "8. Ignorar as Taxas de Gás",
          body: "Transações requerem taxas de rede. Você pode acabar pagando $30 de taxa para enviar $20.",
        },
        {
          title: "9. Confiar em Esquemas de 'Retorno Garantido'",
          body: "Se uma plataforma garante 5% ao dia, é quase certamente um esquema Ponzi.",
        },
        {
          title: "10. Não Fazer Pesquisa Fundamental",
          body: "Comprar uma moeda só por causa de um logotipo engraçado sem verificar sua tecnologia é jogo, não investimento.",
        },
      ],
      summaryTitle: "Fique Seguro com a Kryptonal",
      summaryBody:
        "A melhor defesa é a educação. Sempre valide endereços e analise contratos inteligentes antes de comprar.",
      faqTitle: "Perguntas Frequentes",
      faqs: [
        {
          question: "Posso reverter uma transação cripto?",
          answer:
            "Não. Transações em blockchain são imutáveis e irreversíveis.",
        },
        {
          question: "Como sei se uma moeda é honeypot?",
          answer:
            "Use o Verificador Honeypot da Kryptonal para simular uma transação antes de investir.",
        },
        {
          question: "É seguro manter cripto na corretora?",
          answer:
            "Para longo prazo, é mais seguro usar uma carteira de hardware de autocustódia.",
        },
      ],
      ctaSectionTitle: "Audite sua Segurança Hoje",
      ctaSectionDesc:
        "Use nosso conjunto de verificadores de risco para validar endereços e evitar golpes.",
    },
    es: {
      title: "10 Errores que Debes Evitar si Eres Nuevo en Criptomonedas",
      intro:
        "Entrar en el mundo cripto es emocionante, pero la curva de aprendizaje es empinada. Desde monedas falsas hasta enviar fondos a la red equivocada, evita estos 10 errores.",
      ctaStart: "Explorar Herramientas",
      ctaBlog: "Leer Guías",
      whatIsTitle: "El Costo de Cometer Erros en Web3",
      whatIsBody:
        "A diferencia de la banca tradicional, blockchain no tiene botón de 'revertir transacción'. Si cometes un error, tus fondos desaparecen para siempre.",
      mistakesHeader: "Los 10 Errores Críticos de Principiantes",
      mistakes: [
        {
          title: "1. Enviar a la Dirección o Red Equivocada",
          body: "Un error tipográfico resultará en pérdida permanente. Verifica siempre.",
          toolName: "Usar Validador",
          toolUrl: "/tools/address-validator",
        },
        {
          title: "2. Comprar Tokens 'Honeypot'",
          body: "Un honeypot permite comprar, pero bloquea por completo la venta.",
          toolName: "Chequear Honeypot",
          toolUrl: "/tools/honeypot-checker",
        },
        {
          title: "3. Conectarse a dApps Maliciosas",
          body: "Si conectas tu billetera a un sitio falso, pueden robar todo tu saldo.",
          toolName: "Seguridad de Billetera",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "4. Caer en Phishing",
          body: "Si alguien ofrece 'duplicar' tus criptos, es una estafa.",
          toolName: "Verificador de Riesgo",
          toolUrl: "/tools/crypto-scam-risk-checker",
        },
        {
          title: "5. Perder tu Frase Semilla",
          body: "Tu frase de 12 palabras es la llave maestra. Perder el papel significa perder tus criptos.",
        },
        {
          title: "6. Dejar Grandes Montos en Exchanges",
          body: "Si no tienes las llaves privadas, no tienes tus criptos. Usa una billetera de hardware.",
        },
        {
          title: "7. Comprar por FOMO en el Máximo Histórico",
          body: "El miedo a quedarse afuera hace que los principiantes compren en el pico de precio.",
        },
        {
          title: "8. Ignorar las Tarifas de Gas",
          body: "Las transacciones requieren tarifas de red que a veces superan el valor de tu transferencia.",
        },
        {
          title: "9. Confiar en 'Retornos Garantizados'",
          body: "Si una plataforma garantiza 5% diario, seguramente es un esquema Ponzi.",
        },
        {
          title: "10. No Investigar",
          body: "Comprar una moneda por su logo sin revisar su tecnología es apostar, no invertir.",
        },
      ],
      summaryTitle: "Mantente Seguro con Kryptonal",
      summaryBody:
        "La mejor defensa es la educación. Valida siempre las direcciones y escanea los contratos inteligentes.",
      faqTitle: "Preguntas Frecuentes",
      faqs: [
        {
          question: "¿Puedo revertir una transacción cripto?",
          answer:
            "No. Las transacciones son inmutables y no se pueden cancelar.",
        },
        {
          question: "¿Cómo sé si una moneda es honeypot?",
          answer:
            "Usa el Chequeador Honeypot de Kryptonal para simular una venta.",
        },
        {
          question: "¿Es seguro dejar cripto en un exchange?",
          answer:
            "Para el largo plazo, es más seguro usar tu propia billetera física.",
        },
      ],
      ctaSectionTitle: "Audita tu Seguridad Hoy",
      ctaSectionDesc:
        "Usa nuestra suite gratuita para validar direcciones y buscar estafas.",
    },
    fr: {
      title: "10 Erreurs à Éviter si Vous Débutez en Crypto-monnaie",
      intro:
        "Entrer dans la crypto est passionnant, mais la courbe d'apprentissage est abrupte. Des fausses pièces à l'envoi de fonds sur le mauvais réseau, évitez ces 10 erreurs.",
      ctaStart: "Explorer les Outils",
      ctaBlog: "Lire les Guides",
      whatIsTitle: "Le Coût des Erreurs dans le Web3",
      whatIsBody:
        "Contrairement à la banque, la blockchain n'a pas de bouton d'annulation. Si vous faites une erreur, vos fonds disparaissent.",
      mistakesHeader: "Les 10 Erreurs Critiques des Débutants",
      mistakes: [
        {
          title: "1. Envoyer à la Mauvaise Adresse",
          body: "Une faute de frappe entraîne une perte permanente.",
          toolName: "Valider l'Adresse",
          toolUrl: "/tools/address-validator",
        },
        {
          title: "2. Acheter des Tokens 'Honeypot'",
          body: "Un honeypot vous laisse acheter, mais bloque la revente.",
          toolName: "Vérificateur Honeypot",
          toolUrl: "/tools/honeypot-checker",
        },
        {
          title: "3. Se Connecter à des dApps Malveillantes",
          body: "Les sites frauduleux peuvent vider votre portefeuille en quelques secondes.",
          toolName: "Sécurité du Portefeuille",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "4. Tomber dans le Phishing",
          body: "Les promesses de 'doubler vos cryptos' sont toujours des arnaques.",
          toolName: "Vérificateur d'Arnaque",
          toolUrl: "/tools/crypto-scam-risk-checker",
        },
        {
          title: "5. Perdre sa Phrase de Récupération",
          body: "Perdre ces 12 mots, c'est perdre définitivement ses fonds.",
        },
        {
          title: "6. Laisser Trop de Fonds sur les Échanges",
          body: "Sans clés privées, vous ne possédez pas vos cryptos. Utilisez un portefeuille matériel.",
        },
        {
          title: "7. Acheter sous l'Effet du FOMO",
          body: "Acheter au sommet à cause de la panique ou de la hype.",
        },
        {
          title: "8. Ignorer les Frais de Gas",
          body: "Les frais de réseau peuvent parfois dépasser le montant de la transaction.",
        },
        {
          title: "9. Croire aux Rendements Garantis",
          body: "Un rendement garanti de 5% par jour est un système de Ponzi.",
        },
        {
          title: "10. Ne Pas Faire de Recherches",
          body: "Acheter un token juste pour son logo amusant est un pari, pas un investissement.",
        },
      ],
      summaryTitle: "Restez en Sécurité avec Kryptonal",
      summaryBody:
        "La meilleure défense est l'éducation. Vérifiez toujours les adresses et analysez les contrats.",
      faqTitle: "Questions Fréquentes",
      faqs: [
        {
          question: "Puis-je annuler une transaction crypto ?",
          answer: "Non. Elles sont immuables et irréversibles.",
        },
        {
          question: "Comment repérer un honeypot ?",
          answer:
            "Utilisez l'outil Honeypot de Kryptonal pour simuler une vente.",
        },
        {
          question: "Est-ce sûr de laisser ses cryptos sur un échange ?",
          answer:
            "Pour le long terme, un portefeuille matériel est recommandé.",
        },
      ],
      ctaSectionTitle: "Vérifiez Votre Sécurité Aujourd'hui",
      ctaSectionDesc:
        "N'attendez pas de perdre vos fonds pour utiliser nos outils gratuits.",
    },
    de: {
      title: "10 Fehler, die Krypto-Anfänger vermeiden sollten",
      intro:
        "Der Einstieg in Krypto ist aufregend, aber steil. Von gefälschten Coins bis hin zum falschen Netzwerk – vermeiden Sie diese 10 Fehler.",
      ctaStart: "Sicherheits-Tools",
      ctaBlog: "Sicherheits-Guides",
      whatIsTitle: "Die Kosten von Fehlern im Web3",
      whatIsBody:
        "Im Gegensatz zum Bankwesen gibt es bei Blockchain keinen Button für Stornierungen. Bei einem Fehler ist Ihr Geld meist für immer weg.",
      mistakesHeader: "Die 10 häufigsten Anfängerfehler",
      mistakes: [
        {
          title: "1. Senden an die falsche Adresse",
          body: "Ein Tippfehler führt zu dauerhaftem Verlust.",
          toolName: "Adresse validieren",
          toolUrl: "/tools/address-validator",
        },
        {
          title: "2. Kauf von 'Honeypot'-Tokens",
          body: "Ein Honeypot blockiert den Verkauf Ihres Tokens vollständig.",
          toolName: "Honeypot-Prüfer",
          toolUrl: "/tools/honeypot-checker",
        },
        {
          title: "3. Verbindung mit bösartigen dApps",
          body: "Betrügerische Websites können Ihr Wallet in Sekunden leeren.",
          toolName: "Wallet-Sicherheit",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "4. Auf Phishing hereinfallen",
          body: "Werden Ihnen 'verdoppelte Kryptos' versprochen, ist es Betrug.",
          toolName: "Betrugs-Prüfer",
          toolUrl: "/tools/crypto-scam-risk-checker",
        },
        {
          title: "5. Verlust der Seed-Phrase",
          body: "Ihre 12-Wort-Phrase ist der Hauptschlüssel. Ein Verlust bedeutet Krypto-Verlust.",
        },
        {
          title: "6. Große Summen auf Börsen lassen",
          body: "Not your keys, not your coins. Nutzen Sie Hardware-Wallets.",
        },
        {
          title: "7. FOMO-Käufe am Allzeithoch",
          body: "Aus Angst, etwas zu verpassen, kaufen Anfänger oft am Höchststand.",
        },
        {
          title: "8. Ignorieren von Gas-Gebühren",
          body: "Netzwerkgebühren können manchmal höher sein als die eigentliche Transaktion.",
        },
        {
          title: "9. Vertrauen auf 'Garantierte Renditen'",
          body: "Garantierte 5% pro Tag sind mit Sicherheit ein Ponzi-System.",
        },
        {
          title: "10. Keine eigene Recherche (DYOR)",
          body: "Coins nur wegen eines Logos zu kaufen, ist Glücksspiel.",
        },
      ],
      summaryTitle: "Bleiben Sie sicher mit Kryptonal",
      summaryBody:
        "Die beste Verteidigung ist Aufklärung. Überprüfen Sie immer Adressen und Scans.",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Kann ich eine Krypto-Transaktion rückgängig machen?",
          answer: "Nein. Blockchain-Transaktionen sind unveränderlich.",
        },
        {
          question: "Wie erkenne ich einen Honeypot?",
          answer: "Nutzen Sie den Kryptonal Honeypot Checker.",
        },
        {
          question: "Ist es sicher, Kryptos auf Börsen zu belassen?",
          answer:
            "Für langfristige Anlagen ist ein eigenes Hardware-Wallet sicherer.",
        },
      ],
      ctaSectionTitle: "Prüfen Sie noch heute Ihre Sicherheit",
      ctaSectionDesc:
        "Warten Sie nicht, bis Sie Ihr Geld verlieren. Nutzen Sie unsere kostenlosen Tools.",
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
      canonical: `https://www.kryptonal.com/${locale}/learn/10-crypto-mistakes-to-avoid`,
      languages: {
        en: "https://www.kryptonal.com/en/learn/10-crypto-mistakes-to-avoid",
        tr: "https://www.kryptonal.com/tr/learn/10-crypto-mistakes-to-avoid",
        pt: "https://www.kryptonal.com/pt/learn/10-crypto-mistakes-to-avoid",
        es: "https://www.kryptonal.com/es/learn/10-crypto-mistakes-to-avoid",
        fr: "https://www.kryptonal.com/fr/learn/10-crypto-mistakes-to-avoid",
        de: "https://www.kryptonal.com/de/learn/10-crypto-mistakes-to-avoid",
      },
    },
    openGraph: {
      title: t.title,
      description: t.intro.substring(0, 150),
      url: `https://www.kryptonal.com/${locale}/learn/10-crypto-mistakes-to-avoid`,
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
export default async function CryptoMistakesPage({ params }: PageProps) {
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
              🚨 Security & Scam Prevention
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
                href="/blog"
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

            {/* List of 10 Mistakes */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-2">
                {t.mistakesHeader}
              </h2>

              <div className="space-y-6">
                {t.mistakes.map((mistake: any, index: number) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <h3 className="text-xl font-semibold text-teal-400 mt-0 mb-3">
                      {mistake.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed m-0 mb-4">
                      {mistake.body}
                    </p>

                    {/* Tool specific Call To Action (only if the mistake has a mapped tool) */}
                    {mistake.toolUrl && (
                      <Link
                        href={mistake.toolUrl}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-medium text-sm rounded-lg border border-slate-700 transition-colors no-underline group"
                      >
                        {mistake.toolName}
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
                href="/tools"
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
