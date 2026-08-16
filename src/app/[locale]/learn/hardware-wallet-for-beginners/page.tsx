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
      title: "The Best Hardware Wallets for Beginners in 2026",
      intro:
        "Taking your crypto off an exchange can feel intimidating. Discover the most user-friendly hardware wallets designed for beginners, offering maximum security without the technical headaches.",
      ctaStart: "Explore Security Tools",
      ctaBlog: "Read Beginner Guides",
      whatIsTitle: "Why Beginners Need to Take Control",
      whatIsBody:
        "When you buy cryptocurrency on an exchange like Binance or Coinbase, you don't actually own it—the exchange does. Taking 'self-custody' with a hardware wallet ensures no company can freeze your account, block your transfers, or lose your funds to bankruptcy. While it used to require technical expertise, modern cold wallets in 2026 are as easy to use as Apple Pay or a standard mobile banking app. The transition is simpler than you think.",
      sectionsHeader: "10 Things Every Beginner Must Know",
      sections: [
        {
          title: "1. Ledger Nano S Plus: The Classic Starter",
          body: "The Ledger Nano S Plus is widely considered the best entry-level wallet. It is affordable, supports thousands of different coins, and integrates perfectly with the 'Ledger Live' app, which feels just like a traditional banking interface.",
          toolName: "Check Wallet Security",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Tangem Wallet: The Easiest Setup Ever",
          body: "Tangem revolutionized beginner crypto by eliminating screens and cables. It looks just like a credit card. You simply tap the NFC card to your smartphone to approve transactions. There are no batteries to charge and no complex seed phrases to memorize.",
        },
        {
          title: "3. Trezor Safe 3: Open-Source Simplicity",
          body: "Perfect for security-conscious beginners. The Trezor Safe 3 features an incredibly easy-to-use desktop application (Trezor Suite) and a dedicated secure chip, providing peace of mind with a straightforward, distraction-free interface.",
        },
        {
          title: "4. Understanding the 'Seed Phrase'",
          body: "When you set up a wallet, you will be given 12 to 24 words. This is your 'Seed Phrase' or 'Recovery Phrase'. Think of it as your ultimate master password. If your physical device breaks or is lost, entering these words into a new device will recover all your funds.",
        },
        {
          title: "5. Never Type Your Seed Phrase Online",
          body: "The golden rule of crypto: your seed phrase must never be typed on a keyboard, saved in a digital note, or photographed. Write it down on the provided physical paper cards and store it somewhere safe, like a fireproof safe.",
        },
        {
          title: "6. The Setup Process Takes 10 Minutes",
          body: "Don't be intimidated. Setting up a wallet simply involves downloading the official app (like Ledger Live or Trezor Suite), plugging in the device, writing down your backup words, and setting a PIN code. The app walks you through every step.",
        },
        {
          title: "7. Always Send a 'Test' Transaction",
          body: "When moving your funds from an exchange to your new hardware wallet, never send the full amount at once. Always send a small test transaction (e.g., $10) first to ensure you copied the address correctly and understand the process.",
        },
        {
          title: "8. Buy Directly from the Manufacturer",
          body: "NEVER buy a hardware wallet from Amazon, eBay, or a third-party reseller. To avoid tampered devices (supply-chain attacks), you must always purchase your wallet directly from the official website of Ledger, Trezor, or Tangem.",
        },
        {
          title: "9. Beware of Fake Customer Support",
          body: "Hardware wallet companies will NEVER ask for your seed phrase or ask to connect to your computer remotely. If you ask a question on Twitter or Telegram and someone instantly replies offering 'help', it is a scammer trying to drain your funds.",
        },
        {
          title: "10. You Don't Need an Expensive Device",
          body: "Premium devices ($150+) often just add features like Bluetooth, color touchscreens, or premium materials. A standard $60 beginner device offers the exact same underlying cryptographic security as the most expensive models.",
        },
      ],
      summaryTitle: "Taking the Leap",
      summaryBody:
        "Moving your digital assets to a hardware wallet is the most important step in your crypto journey. Choose a simple device, secure your paper backup, and enjoy the peace of mind that comes with true financial ownership.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          question: "Can I view my balance without plugging in the device?",
          answer:
            "Yes! Companion apps like Ledger Live sync your public addresses. You can open the app on your phone to check your portfolio balance safely at any time without needing the physical device.",
        },
        {
          question:
            "What if the company (like Ledger or Trezor) goes out of business?",
          answer:
            "Your crypto lives on the blockchain, not on their servers. If a wallet company shuts down, you simply use your 12 or 24-word seed phrase on any other compatible wallet brand to recover your funds.",
        },
        {
          question: "Do I need a separate wallet for Bitcoin and Ethereum?",
          answer:
            "No. Modern beginner hardware wallets can support multiple different blockchains (Bitcoin, Ethereum, Solana, etc.) simultaneously on a single device.",
        },
      ],
      ctaSectionTitle: "Ready to Secure Your First Crypto?",
      ctaSectionDesc:
        "Start your self-custody journey today. Use our free risk tools to scan addresses and smart contracts before you transact.",
    },
    tr: {
      title: "2026'da Yeni Başlayanlar İçin En İyi Donanım Cüzdanları",
      intro:
        "Kripto paralarınızı bir borsadan çıkarmak korkutucu gelebilir. Maksimum güvenliği teknik baş ağrıları olmadan sunan, yeni başlayanlar için tasarlanmış en kullanıcı dostu donanım cüzdanlarını keşfedin.",
      ctaStart: "Güvenlik Araçlarını Keşfet",
      ctaBlog: "Başlangıç Rehberlerini Oku",
      whatIsTitle: "Yeni Başlayanlar Neden Kontrolü Ele Almalı?",
      whatIsBody:
        "Binance veya Coinbase gibi bir borsadan kripto para satın aldığınızda, ona aslında siz sahip olmazsınız; borsa sahip olur. Bir donanım cüzdanı ile 'kendi gözetiminizi' (self-custody) almak, hiçbir şirketin hesabınızı donduramayacağını veya fonlarınızı kaybedemeyeceğini garanti eder. Eskiden teknik uzmanlık gerektirse de, 2026'daki modern soğuk cüzdanların kullanımı Apple Pay veya standart bir mobil bankacılık uygulaması kadar kolaydır.",
      sectionsHeader: "Her Yeni Başlayanın Bilmesi Gereken 10 Şey",
      sections: [
        {
          title: "1. Ledger Nano S Plus: Klasik Başlangıç",
          body: "Ledger Nano S Plus, en iyi giriş seviyesi cüzdan olarak kabul edilir. Uygun fiyatlıdır, binlerce farklı coini destekler ve geleneksel bir bankacılık arayüzü gibi hissettiren 'Ledger Live' uygulamasıyla mükemmel bir şekilde entegre olur.",
          toolName: "Cüzdan Güvenliğini Kontrol Et",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Tangem Wallet: En Kolay Kurulum",
          body: "Tangem, ekranları ve kabloları ortadan kaldırarak kullanımı devrimselleştirdi. Kredi kartı gibi görünür. İşlemleri onaylamak için NFC kartını akıllı telefonunuza dokundurmanız yeterlidir. Şarj edilecek pil veya ezberlenecek karmaşık tohum kelimeler yoktur.",
        },
        {
          title: "3. Trezor Safe 3: Açık Kaynaklı Basitlik",
          body: "Güvenlik bilincine sahip yeni başlayanlar için mükemmeldir. Trezor Safe 3, inanılmaz derecede kullanımı kolay bir masaüstü uygulaması (Trezor Suite) ve kafa karıştırmayan basit bir arayüzle gönül rahatlığı sağlar.",
        },
        {
          title: "4. 'Kurtarma İfadelerini' (Seed Phrase) Anlamak",
          body: "Bir cüzdan kurduğunuzda size 12 ila 24 kelime verilecektir. Bu sizin nihai ana şifrenizdir. Fiziksel cihazınız kırılırsa veya kaybolursa, bu kelimeleri yeni bir cihaza girmek tüm fonlarınızı kurtaracaktır.",
        },
        {
          title: "5. Kelimelerinizi Asla Çevrimiçi Yazmayın",
          body: "Kriptonun altın kuralı: Tohum cümleniz (seed phrase) asla klavyede yazılmamalı, dijital bir nota kaydedilmemeli veya fotoğrafı çekilmemelidir. Verilen fiziksel kağıt kartlara yazın ve güvenli bir yerde saklayın.",
        },
        {
          title: "6. Kurulum İşlemi Sadece 10 Dakika Sürer",
          body: "Gözünüz korkmasın. Bir cüzdan kurmak; resmi uygulamayı indirmek, cihazı prize takmak, yedek kelimelerinizi yazmak ve bir PIN kodu ayarlamaktan ibarettir. Uygulama size her adımda rehberlik eder.",
        },
        {
          title: "7. Her Zaman Bir 'Test' İşlemi Gönderin",
          body: "Fonlarınızı bir borsadan yeni donanım cüzdanınıza taşırken, asla tüm miktarı tek seferde göndermeyin. Adresi doğru kopyaladığınızdan emin olmak için her zaman önce küçük bir test işlemi (örneğin 10 $) gönderin.",
        },
        {
          title: "8. Doğrudan Üreticiden Satın Alın",
          body: "ASLA Amazon, eBay veya üçüncü taraf bir satıcıdan donanım cüzdanı almayın. Kurcalanmış cihazlardan kaçınmak için cüzdanınızı her zaman Ledger, Trezor veya Tangem'in resmi web sitesinden satın almalısınız.",
        },
        {
          title: "9. Sahte Müşteri Hizmetlerine Dikkat Edin",
          body: "Donanım cüzdanı şirketleri ASLA tohum ifadenizi istemez veya bilgisayarınıza uzaktan bağlanmayı talep etmez. Twitter veya Telegram'da bir soru sorarsanız ve biri anında yanıt vererek 'yardım' teklif ederse, o bir dolandırıcıdır.",
        },
        {
          title: "10. Pahalı Bir Cihaza İhtiyacınız Yok",
          body: "Premium cihazlar (150$+) genellikle Bluetooth, renkli dokunmatik ekranlar veya premium malzemeler gibi özellikler ekler. Standart bir 60$'lık başlangıç cihazı, en pahalı modellerle tamamen aynı kriptografik güvenliği sunar.",
        },
      ],
      summaryTitle: "Adımı Atmak",
      summaryBody:
        "Dijital varlıklarınızı bir donanım cüzdanına taşımak, kripto yolculuğunuzdaki en önemli adımdır. Basit bir cihaz seçin, kağıt yedeğinizi güvence altına alın ve gerçek finansal mülkiyetin getirdiği gönül rahatlığının tadını çıkarın.",
      faqTitle: "Sıkça Sorulan Sorular",
      faqs: [
        {
          question: "Cihazı takmadan bakiyemi görebilir miyim?",
          answer:
            "Evet! Ledger Live gibi uygulamalar genel adreslerinizi (public key) senkronize eder. Fiziksel cihaza ihtiyaç duymadan portföy bakiyenizi güvenle kontrol etmek için telefondaki uygulamayı açabilirsiniz.",
        },
        {
          question: "Ya şirket (Ledger veya Trezor gibi) iflas ederse?",
          answer:
            "Kriptonuz onların sunucularında değil, blokzincirinde yaşar. Bir cüzdan şirketi kapanırsa, fonlarınızı kurtarmak için 12 veya 24 kelimelik ifadenizi başka bir uyumlu cüzdan markasında kullanabilirsiniz.",
        },
        {
          question:
            "Bitcoin ve Ethereum için ayrı bir cüzdana ihtiyacım var mı?",
          answer:
            "Hayır. Modern başlangıç seviyesi donanım cüzdanları aynı anda birden fazla farklı blokzincirini (Bitcoin, Ethereum, Solana vb.) tek bir cihazda destekleyebilir.",
        },
      ],
      ctaSectionTitle: "İlk Kriptonuzu Güvence Altına Almaya Hazır Mısınız?",
      ctaSectionDesc:
        "Kendi güvenliğinizi sağlama yolculuğunuza bugün başlayın. İşlem yapmadan önce adresleri taramak için ücretsiz araçlarımızı kullanın.",
    },
    pt: {
      title: "As Melhores Carteiras de Hardware para Iniciantes em 2026",
      intro:
        "Tirar suas criptomoedas de uma corretora pode parecer intimidador. Descubra as carteiras de hardware mais amigáveis para iniciantes, oferecendo segurança máxima sem dores de cabeça técnicas.",
      ctaStart: "Explorar Ferramentas de Segurança",
      ctaBlog: "Ler Guias para Iniciantes",
      whatIsTitle: "Por Que os Iniciantes Precisam Assumir o Controle",
      whatIsBody:
        "Quando você compra criptomoedas em uma corretora (exchange), você não é o dono real delas — a corretora é. Assumir a 'autocustódia' com uma carteira de hardware garante que nenhuma empresa possa congelar sua conta ou perder seus fundos. Embora antigamente exigisse conhecimento técnico, as carteiras frias modernas em 2026 são tão fáceis de usar quanto um aplicativo de banco no celular.",
      sectionsHeader: "10 Coisas que Todo Iniciante Deve Saber",
      sections: [
        {
          title: "1. Ledger Nano S Plus: O Clássico para Começar",
          body: "A Ledger Nano S Plus é considerada a melhor carteira de entrada. É acessível, suporta milhares de moedas e se integra perfeitamente ao aplicativo 'Ledger Live', que funciona como uma interface bancária tradicional.",
          toolName: "Verificar Segurança",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Tangem Wallet: A Configuração Mais Fácil",
          body: "A Tangem revolucionou o mercado eliminando telas e cabos. Parece um cartão de crédito. Você simplesmente aproxima o cartão NFC do seu smartphone para aprovar transações. Sem baterias para carregar e sem frases semente complexas.",
        },
        {
          title: "3. Trezor Safe 3: Simplicidade de Código Aberto",
          body: "Perfeita para iniciantes focados em segurança. A Trezor Safe 3 possui um aplicativo de desktop incrivelmente fácil de usar (Trezor Suite) e uma interface direta e sem distrações.",
        },
        {
          title: "4. Entendendo a 'Seed Phrase' (Frase Semente)",
          body: "Ao configurar uma carteira, você receberá 12 a 24 palavras. Esta é sua senha mestra. Se o seu dispositivo físico quebrar ou for perdido, inserir essas palavras em um novo dispositivo recuperará todos os seus fundos.",
        },
        {
          title: "5. Nunca Digite sua Frase Semente Online",
          body: "A regra de ouro: sua frase semente nunca deve ser digitada em um teclado, salva na nuvem ou fotografada. Escreva-a no papel fornecido e guarde-a em um local seguro, como um cofre.",
        },
        {
          title: "6. O Processo de Configuração Leva 10 Minutos",
          body: "Não se intimide. Configurar uma carteira envolve simplesmente baixar o aplicativo oficial, conectar o dispositivo, anotar suas palavras de backup e definir um PIN. O aplicativo orienta você em cada etapa.",
        },
        {
          title: "7. Sempre Envie uma Transação de 'Teste'",
          body: "Ao transferir seus fundos de uma corretora para sua nova carteira, nunca envie o valor total de uma vez. Envie sempre um pequeno teste (ex: $10) primeiro para garantir que você copiou o endereço corretamente.",
        },
        {
          title: "8. Compre Diretamente do Fabricante",
          body: "NUNCA compre uma carteira de hardware na Amazon, eBay ou revendedor terceirizado. Para evitar dispositivos adulterados, você deve sempre comprar no site oficial da Ledger, Trezor ou Tangem.",
        },
        {
          title: "9. Cuidado com o Falso Suporte ao Cliente",
          body: "As empresas NUNCA pedirão sua frase semente ou acesso remoto ao seu computador. Se você fizer uma pergunta no Twitter e alguém responder instantaneamente oferecendo 'ajuda', é um golpista.",
        },
        {
          title: "10. Você Não Precisa de um Dispositivo Caro",
          body: "Dispositivos premium ($150+) adicionam recursos como Bluetooth ou telas sensíveis ao toque. Uma carteira padrão de $60 oferece exatamente a mesma segurança criptográfica dos modelos mais caros.",
        },
      ],
      summaryTitle: "Dando o Grande Salto",
      summaryBody:
        "Mover seus ativos para uma carteira de hardware é o passo mais importante. Escolha um dispositivo simples, proteja seu backup em papel e aproveite a verdadeira propriedade financeira.",
      faqTitle: "Perguntas Frequentes",
      faqs: [
        {
          question: "Posso ver meu saldo sem conectar o dispositivo?",
          answer:
            "Sim! Aplicativos como o Ledger Live sincronizam seus endereços públicos. Você pode abrir o app no celular para verificar seu saldo a qualquer momento sem precisar do dispositivo físico.",
        },
        {
          question: "E se a empresa (Ledger ou Trezor) falir?",
          answer:
            "Suas criptos estão na blockchain, não nos servidores deles. Se a empresa fechar, basta usar sua frase de 12 ou 24 palavras em qualquer outra carteira compatível para recuperar seus fundos.",
        },
        {
          question:
            "Preciso de uma carteira para Bitcoin e outra para Ethereum?",
          answer:
            "Não. As carteiras de hardware modernas para iniciantes suportam várias blockchains diferentes simultaneamente em um único dispositivo.",
        },
      ],
      ctaSectionTitle: "Pronto para Proteger Suas Criptos?",
      ctaSectionDesc:
        "Comece sua jornada de autocustódia hoje. Use nossas ferramentas gratuitas para verificar contratos inteligentes antes de transacionar.",
    },
    es: {
      title: "Las Mejores Billeteras de Hardware para Principiantes en 2026",
      intro:
        "Sacar tus criptomonedas de un exchange puede parecer intimidante. Descubre las billeteras de hardware más fáciles de usar, diseñadas para principiantes, que ofrecen máxima seguridad sin complicaciones técnicas.",
      ctaStart: "Explorar Herramientas",
      ctaBlog: "Leer Guías de Seguridad",
      whatIsTitle: "Por Qué los Principiantes Deben Tomar el Control",
      whatIsBody:
        "Cuando compras criptomonedas en Binance o Coinbase, no eres el verdadero dueño—el exchange lo es. Asumir la 'autocustodia' con una billetera de hardware garantiza que ninguna empresa pueda congelar tu cuenta o perder tus fondos. Aunque antes requería experiencia técnica, las billeteras frías de 2026 son tan fáciles de usar como Apple Pay o tu aplicación bancaria móvil.",
      sectionsHeader: "10 Cosas que Todo Principiante Debe Saber",
      sections: [
        {
          title: "1. Ledger Nano S Plus: El Clásico para Empezar",
          body: "El Ledger Nano S Plus es considerado la mejor billetera de entrada. Es asequible, soporta miles de monedas y se integra perfectamente con la app 'Ledger Live', que funciona como un banco tradicional.",
          toolName: "Verificar Seguridad",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Tangem Wallet: La Configuración Más Fácil",
          body: "Tangem revolucionó el mercado eliminando pantallas y cables. Parece una tarjeta de crédito. Simplemente acercas la tarjeta NFC a tu teléfono para aprobar transacciones. Sin baterías ni frases semilla complejas.",
        },
        {
          title: "3. Trezor Safe 3: Simplicidad de Código Abierto",
          body: "Perfecta para principiantes enfocados en la seguridad. El Trezor Safe 3 cuenta con una aplicación de escritorio muy fácil de usar (Trezor Suite) y una interfaz sin distracciones.",
        },
        {
          title: "4. Entendiendo la 'Frase Semilla'",
          body: "Al configurar una billetera, recibirás de 12 a 24 palabras. Esta es tu contraseña maestra. Si tu dispositivo físico se rompe o se pierde, ingresar estas palabras en un nuevo dispositivo recuperará todos tus fondos.",
        },
        {
          title: "5. Nunca Escribas tu Frase Semilla en Internet",
          body: "La regla de oro: tu frase semilla nunca debe escribirse en un teclado, guardarse en la nube ni ser fotografiada. Escríbela en el papel proporcionado y guárdala en un lugar seguro.",
        },
        {
          title: "6. El Proceso de Configuración Toma 10 Minutos",
          body: "No te intimides. Configurar una billetera implica descargar la app oficial, conectar el dispositivo, anotar tus palabras de respaldo y establecer un PIN. La app te guía paso a paso.",
        },
        {
          title: "7. Siempre Envía una Transacción de 'Prueba'",
          body: "Al mover tus fondos del exchange a tu nueva billetera, nunca envíes el monto total de una vez. Siempre envía una pequeña prueba (ej. $10) primero para asegurarte de que copiaste bien la dirección.",
        },
        {
          title: "8. Compra Directamente al Fabricante",
          body: "NUNCA compres una billetera en Amazon, eBay o revendedores. Para evitar dispositivos manipulados, siempre debes comprar en el sitio web oficial de Ledger, Trezor o Tangem.",
        },
        {
          title: "9. Cuidado con el Soporte Falso",
          body: "Las empresas NUNCA te pedirán tu frase semilla ni acceso remoto a tu PC. Si haces una pregunta en Twitter o Telegram y alguien te ofrece 'ayuda' de inmediato, es un estafador.",
        },
        {
          title: "10. No Necesitas un Dispositivo Caro",
          body: "Los dispositivos premium ($150+) añaden características como Bluetooth o pantallas táctiles. Una billetera estándar de $60 ofrece exactamente la misma seguridad criptográfica base.",
        },
      ],
      summaryTitle: "Dando el Gran Salto",
      summaryBody:
        "Mover tus activos a una billetera de hardware es el paso más importante. Elige un dispositivo simple, protege tu respaldo de papel y disfruta de la verdadera propiedad financiera.",
      faqTitle: "Preguntas Frecuentes",
      faqs: [
        {
          question: "¿Puedo ver mi saldo sin conectar el dispositivo?",
          answer:
            "¡Sí! Aplicaciones como Ledger Live sincronizan tus direcciones públicas. Puedes abrir la app en tu teléfono para ver tu saldo en cualquier momento sin necesidad del dispositivo físico.",
        },
        {
          question: "¿Qué pasa si la empresa (Ledger o Trezor) quiebra?",
          answer:
            "Tus criptos están en la blockchain, no en sus servidores. Si cierran, simplemente usas tu frase de 12 o 24 palabras en cualquier otra billetera compatible para recuperar tus fondos.",
        },
        {
          question:
            "¿Necesito una billetera para Bitcoin y otra para Ethereum?",
          answer:
            "No. Las billeteras modernas para principiantes soportan múltiples blockchains diferentes simultáneamente en un solo dispositivo.",
        },
      ],
      ctaSectionTitle: "¿Listo para Proteger tus Criptos?",
      ctaSectionDesc:
        "Comienza tu viaje de autocustodia hoy. Usa nuestras herramientas gratuitas para navegar de forma segura.",
    },
    fr: {
      title: "Les Meilleurs Portefeuilles Matériels pour Débutants en 2026",
      intro:
        "Retirer ses cryptos d'un échange peut sembler intimidant. Découvrez les portefeuilles matériels les plus simples à utiliser, conçus pour les débutants, offrant une sécurité maximale sans maux de tête techniques.",
      ctaStart: "Explorer les Outils",
      ctaBlog: "Lire les Guides Débutants",
      whatIsTitle: "Pourquoi les Débutants Doivent Prendre le Contrôle",
      whatIsBody:
        "Quand vous achetez de la crypto sur Binance ou Coinbase, vous ne la possédez pas réellement. L'auto-conservation (self-custody) avec un portefeuille matériel garantit qu'aucune entreprise ne peut geler ou perdre vos fonds. Si cela nécessitait autrefois des compétences techniques, les portefeuilles à froid de 2026 sont aussi faciles à utiliser qu'Apple Pay ou votre application bancaire.",
      sectionsHeader: "10 Choses que Tout Débutant Doit Savoir",
      sections: [
        {
          title: "1. Ledger Nano S Plus : Le Classique",
          body: "Le Ledger Nano S Plus est le meilleur portefeuille d'entrée de gamme. Abordable, il supporte des milliers de pièces et s'intègre parfaitement à l'application 'Ledger Live'.",
          toolName: "Vérifier la Sécurité",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Tangem Wallet : Le Plus Facile",
          body: "Tangem a révolutionné le marché en supprimant les écrans et les câbles. Il ressemble à une carte de crédit. Vous approchez la carte NFC de votre smartphone pour approuver les transactions.",
        },
        {
          title: "3. Trezor Safe 3 : Simplicité Open-Source",
          body: "Parfait pour les débutants soucieux de la sécurité. Le Trezor Safe 3 dispose d'une application de bureau incroyablement facile à utiliser (Trezor Suite) et d'une interface sans distraction.",
        },
        {
          title: "4. Comprendre la 'Phrase de Récupération' (Seed)",
          body: "Lors de la configuration, vous recevrez 12 à 24 mots. C'est votre mot de passe maître. Si votre appareil est cassé ou perdu, ces mots permettront de récupérer tous vos fonds sur un nouvel appareil.",
        },
        {
          title: "5. Ne Tapez Jamais Votre Seed en Ligne",
          body: "La règle d'or : votre phrase de récupération ne doit jamais être tapée sur un clavier, sauvegardée dans le cloud ou photographiée. Écrivez-la sur le papier fourni et rangez-la en lieu sûr.",
        },
        {
          title: "6. La Configuration Prend 10 Minutes",
          body: "Ne soyez pas intimidé. Configurer un portefeuille implique de télécharger l'application officielle, brancher l'appareil, noter vos mots de sauvegarde et définir un code PIN.",
        },
        {
          title: "7. Envoyez Toujours une Transaction 'Test'",
          body: "Lors du transfert de vos fonds de l'échange vers votre nouveau portefeuille, n'envoyez jamais le montant total d'un coup. Envoyez toujours un petit test (ex: 10 $) en premier.",
        },
        {
          title: "8. Achetez Directement au Fabricant",
          body: "N'achetez JAMAIS un portefeuille sur Amazon, eBay ou un revendeur tiers. Pour éviter les appareils falsifiés, commandez toujours sur le site officiel de Ledger, Trezor ou Tangem.",
        },
        {
          title: "9. Attention au Faux Support Client",
          body: "Les entreprises ne demanderont JAMAIS votre phrase seed. Si vous posez une question sur Twitter et que quelqu'un vous offre de 'l'aide' instantanément, c'est une arnaque.",
        },
        {
          title: "10. Vous N'avez Pas Besoin d'un Appareil Cher",
          body: "Les appareils premium (150 $+) ajoutent le Bluetooth ou un écran tactile. Un appareil standard à 60 $ offre exactement la même sécurité cryptographique.",
        },
      ],
      summaryTitle: "Faire le Grand Saut",
      summaryBody:
        "Déplacer vos actifs vers un portefeuille matériel est l'étape la plus importante. Choisissez un appareil simple, sécurisez votre sauvegarde papier et profitez de la véritable propriété financière.",
      faqTitle: "Questions Fréquentes",
      faqs: [
        {
          question: "Puis-je voir mon solde sans brancher l'appareil ?",
          answer:
            "Oui ! Les applications comme Ledger Live synchronisent vos adresses. Vous pouvez ouvrir l'application sur votre téléphone pour vérifier votre solde à tout moment.",
        },
        {
          question: "Et si l'entreprise (Ledger ou Trezor) fait faillite ?",
          answer:
            "Vos cryptos sont sur la blockchain, pas sur leurs serveurs. Vous pouvez utiliser vos 12 ou 24 mots sur n'importe quel autre portefeuille compatible pour récupérer vos fonds.",
        },
        {
          question: "Faut-il un appareil différent pour Bitcoin et Ethereum ?",
          answer:
            "Non. Les portefeuilles matériels modernes supportent plusieurs blockchains différentes simultanément sur un seul appareil.",
        },
      ],
      ctaSectionTitle: "Prêt à Sécuriser Vos Actifs ?",
      ctaSectionDesc:
        "Commencez votre voyage d'auto-conservation aujourd'hui. Utilisez nos outils gratuits pour analyser vos transactions.",
    },
    de: {
      title: "Die besten Hardware-Wallets für Anfänger in 2026",
      intro:
        "Der Wechsel von einer Börse zum eigenen Wallet kann einschüchternd wirken. Entdecken Sie die benutzerfreundlichsten Hardware-Wallets für Anfänger, die maximale Sicherheit ohne technisches Kopfzerbrechen bieten.",
      ctaStart: "Sicherheits-Tools",
      ctaBlog: "Anfänger-Guides",
      whatIsTitle: "Warum Anfänger die Kontrolle übernehmen müssen",
      whatIsBody:
        "Wenn Sie Krypto auf einer Börse (wie Binance) kaufen, gehört sie nicht wirklich Ihnen, sondern der Börse. Die 'Self-Custody' mit einem Hardware-Wallet stellt sicher, dass niemand Ihr Konto einfrieren kann. Während dies früher technisches Wissen erforderte, sind moderne Cold Wallets 2026 so einfach zu bedienen wie eine Mobile-Banking-App.",
      sectionsHeader: "10 Dinge, die jeder Anfänger wissen muss",
      sections: [
        {
          title: "1. Ledger Nano S Plus: Der Klassiker",
          body: "Das Ledger Nano S Plus gilt als bestes Einsteiger-Wallet. Es ist erschwinglich, unterstützt tausende Coins und lässt sich nahtlos in die 'Ledger Live'-App integrieren.",
          toolName: "Sicherheit prüfen",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Tangem Wallet: Das einfachste Setup",
          body: "Tangem hat die Krypto-Welt revolutioniert, indem es Bildschirme und Kabel eliminierte. Es sieht aus wie eine Kreditkarte. Sie tippen die NFC-Karte einfach an Ihr Smartphone, um Transaktionen zu bestätigen.",
        },
        {
          title: "3. Trezor Safe 3: Open-Source-Einfachheit",
          body: "Perfekt für sicherheitsbewusste Anfänger. Das Trezor Safe 3 bietet eine unglaublich einfach zu bedienende Desktop-App (Trezor Suite) und eine ablenkungsfreie Benutzeroberfläche.",
        },
        {
          title: "4. Was ist eine 'Seed Phrase'?",
          body: "Bei der Einrichtung erhalten Sie 12 bis 24 Wörter. Das ist Ihr Master-Passwort. Geht das Gerät verloren oder kaputt, stellen Sie mit diesen Wörtern auf einem neuen Gerät alle Ihre Gelder wieder her.",
        },
        {
          title: "5. Tippen Sie Ihre Seed Phrase niemals online ein",
          body: "Die goldene Regel: Ihre Wörter dürfen niemals auf einer Tastatur getippt, in der Cloud gespeichert oder fotografiert werden. Schreiben Sie sie auf Papier und bewahren Sie es sicher auf.",
        },
        {
          title: "6. Die Einrichtung dauert nur 10 Minuten",
          body: "Lassen Sie sich nicht einschüchtern. Sie laden die offizielle App herunter, schließen das Gerät an, notieren die Wörter und legen eine PIN fest. Die App führt Sie Schritt für Schritt durch den Prozess.",
        },
        {
          title: "7. Senden Sie immer eine 'Test'-Transaktion",
          body: "Wenn Sie Geld von der Börse auf das Wallet übertragen, senden Sie niemals sofort den gesamten Betrag. Senden Sie immer zuerst eine kleine Testüberweisung (z.B. 10 $).",
        },
        {
          title: "8. Kaufen Sie direkt beim Hersteller",
          body: "Kaufen Sie NIEMALS auf Amazon oder eBay. Um manipulierte Geräte zu vermeiden, müssen Sie immer direkt auf der offiziellen Website von Ledger, Trezor oder Tangem bestellen.",
        },
        {
          title: "9. Vorsicht vor falschem Kundensupport",
          body: "Unternehmen werden NIEMALS nach Ihrer Seed Phrase fragen. Wenn Ihnen auf Twitter oder Telegram sofort jemand 'Hilfe' anbietet, ist es ein Betrüger.",
        },
        {
          title: "10. Sie brauchen kein teures Gerät",
          body: "Premium-Geräte (150 $+) bieten Extras wie Bluetooth oder Touchscreens. Ein Standard-Wallet für 60 $ bietet genau die gleiche kryptografische Basis-Sicherheit.",
        },
      ],
      summaryTitle: "Den Sprung wagen",
      summaryBody:
        "Der Transfer Ihrer digitalen Werte auf ein Hardware-Wallet ist der wichtigste Schritt Ihrer Krypto-Reise. Wählen Sie ein einfaches Gerät und genießen Sie die echte finanzielle Unabhängigkeit.",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        {
          question:
            "Kann ich meinen Kontostand sehen, ohne das Gerät anzuschließen?",
          answer:
            "Ja! Apps wie Ledger Live synchronisieren Ihre öffentlichen Adressen. Sie können die App auf dem Smartphone öffnen, um den Kontostand jederzeit sicher abzufragen.",
        },
        {
          question: "Was passiert, wenn die Firma (z.B. Ledger) pleitegeht?",
          answer:
            "Ihre Kryptos liegen auf der Blockchain, nicht auf deren Servern. Sie können Ihre 12- oder 24-Wort-Phrase bei jedem anderen kompatiblen Wallet-Hersteller nutzen, um an Ihr Geld zu kommen.",
        },
        {
          question: "Brauche ich für Bitcoin und Ethereum getrennte Wallets?",
          answer:
            "Nein. Moderne Anfänger-Wallets unterstützen mehrere Blockchains (Bitcoin, Ethereum, Solana etc.) gleichzeitig auf einem einzigen Gerät.",
        },
      ],
      ctaSectionTitle: "Bereit für echte Sicherheit?",
      ctaSectionDesc:
        "Nutzen Sie unsere kostenlosen Tools, um Smart Contracts sicher zu prüfen.",
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
      canonical: `https://www.kryptonal.com/${locale}/learn/hardware-wallet-for-beginners`,
      languages: {
        en: "https://www.kryptonal.com/en/learn/hardware-wallet-for-beginners",
        tr: "https://www.kryptonal.com/tr/learn/hardware-wallet-for-beginners",
        pt: "https://www.kryptonal.com/pt/learn/hardware-wallet-for-beginners",
        es: "https://www.kryptonal.com/es/learn/hardware-wallet-for-beginners",
        fr: "https://www.kryptonal.com/fr/learn/hardware-wallet-for-beginners",
        de: "https://www.kryptonal.com/de/learn/hardware-wallet-for-beginners",
      },
    },
    openGraph: {
      title: t.title,
      description: t.intro.substring(0, 150),
      url: `https://www.kryptonal.com/${locale}/learn/hardware-wallet-for-beginners`,
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
export default async function HardwareWalletForBeginnersPage({
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 mb-6 border border-rose-500/20">
              🔰 Beginner's Guide to Security
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
