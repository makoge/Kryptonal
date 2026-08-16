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
      title: "The Best Hardware Wallets for Bitcoin in 2026 (BTC-Only)",
      intro:
        "Bitcoin purists know that less is more. Explore the top Bitcoin-only hardware wallets designed to minimize your attack surface and secure your satoshis against the most advanced digital threats.",
      ctaStart: "Explore Security Tools",
      ctaBlog: "Read Bitcoin Guides",
      whatIsTitle: "Why Choose a Bitcoin-Only Wallet?",
      whatIsBody:
        "Multi-coin hardware wallets require complex, sprawling codebases to support thousands of different tokens, networks, and smart contracts. Every line of code introduces a potential vulnerability. A 'Bitcoin-only' hardware wallet runs stripped-down firmware dedicated solely to the Bitcoin protocol. By eliminating all altcoin and decentralized finance (DeFi) code, you drastically reduce the attack surface, creating an impenetrable physical vault for your BTC.",
      sectionsHeader: "10 Essentials for Bitcoin Self-Custody",
      sections: [
        {
          title: "1. Coldcard Q: The Gold Standard",
          body: "Manufactured by Coinkite, the Coldcard Q is the ultimate Bitcoin maximalist device. It features a full QWERTY keyboard, dual secure element chips from different manufacturers, and operates 100% air-gapped via MicroSD cards. It even includes features to physically destroy the device's USB capabilities.",
          toolName: "Check Wallet Security",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. BitBox02 (Bitcoin-Only Edition)",
          body: "Swiss engineering at its finest. The BitBox02 Bitcoin-only edition boasts a minimalist design and features a specialized firmware that solely processes BTC transactions. Its standout feature is an incredibly easy MicroSD backup system, removing the need to write down 24 words on paper if you choose not to.",
        },
        {
          title: "3. Blockstream Jade: Open-Source Innovation",
          body: "The Blockstream Jade is a highly affordable, fully open-source Bitcoin wallet. It features a built-in camera for air-gapped QR code signing and offers a unique 'stateless' mode where it completely forgets your keys the moment it powers off, relying on an encrypted companion app.",
        },
        {
          title: "4. Foundation Passport: Luxury Cold Storage",
          body: "Designed to look and feel like a premium retro mobile phone, the Foundation Passport provides air-gapped Bitcoin security via QR codes. It runs entirely on open-source software and is favored by users who want enterprise-grade security wrapped in an intuitive, premium user interface.",
        },
        {
          title: "5. Trezor Safe 5 (BTC-Only Firmware)",
          body: "While the Trezor Safe 5 ships as a multi-coin wallet, Trezor provides an official 'Bitcoin-only' firmware option. You can flash this firmware onto your device via Trezor Suite, stripping away all altcoin code while benefiting from Trezor's NDA-free secure element chip.",
        },
        {
          title: "6. SeedSigner: The DIY Approach",
          body: "For the ultimate 'Don't Trust, Verify' advocate, SeedSigner allows you to build your own Bitcoin hardware wallet using a Raspberry Pi Zero. It is entirely stateless, meaning it holds no private data once powered off, mitigating the risk of physical theft entirely.",
        },
        {
          title: "7. The Power of PSBTs",
          body: "Bitcoin-only wallets excel at using Partially Signed Bitcoin Transactions (PSBTs). This allows you to generate a transaction on a connected computer (like Sparrow Wallet), export the PSBT to a MicroSD card, sign it offline on your Coldcard, and broadcast it without your keys ever touching a connected device.",
        },
        {
          title: "8. Multisig Setups for Whales",
          body: "For securing large amounts of Bitcoin, users often combine multiple hardware wallets (e.g., a Coldcard, a BitBox02, and a Trezor) into a multisignature quorum (like a 2-of-3 setup). This eliminates the single point of failure inherent in relying on one device brand.",
        },
        {
          title: "9. Connecting to Your Own Node",
          body: "A true Bitcoin setup isn't complete until your hardware wallet is connected to your own full node (like Umbrel or Start9). Relying on a manufacturer's node compromises your privacy; running your own node ensures you are cryptographically verifying your own incoming transactions.",
        },
        {
          title: "10. Passphrase Protection (The 25th Word)",
          body: "Top Bitcoin wallets heavily encourage the use of a 'BIP39 Passphrase'. This acts as a 25th word that creates an entirely hidden wallet. If someone finds your 24-word paper backup, they still cannot access your Bitcoin without knowing the secret passphrase stored in your head.",
        },
      ],
      summaryTitle: "The Ultimate Bitcoin Vault",
      summaryBody:
        "If you are dedicating your wealth to the hardest money ever created, it deserves the hardest security. By choosing a Bitcoin-only hardware wallet, you eliminate unnecessary code and protect your stack from complex digital threats.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          question:
            "Can I store Ethereum or other altcoins on a Bitcoin-only wallet?",
          answer:
            "No. Bitcoin-only wallets lack the necessary firmware to process or secure altcoins and tokens. If you try to send them, they will be lost or rejected.",
        },
        {
          question:
            "What is the best desktop software to pair with these wallets?",
          answer:
            "Sparrow Wallet and Electrum are the gold standards for Bitcoiners. They integrate flawlessly with devices like Coldcard and BitBox02 and allow you to easily connect to your own personal full node.",
        },
        {
          question: "Can I convert a multi-coin wallet to Bitcoin-only?",
          answer:
            "Some brands, like Trezor and BitBox, offer official Bitcoin-only firmware that you can install to replace the standard multi-coin software.",
        },
      ],
      ctaSectionTitle: "Audit Your Bitcoin Security Today",
      ctaSectionDesc:
        "Ensure your self-custody setup is watertight. Explore our tools to verify addresses and mitigate transaction risks.",
    },
    tr: {
      title: "2026'da Bitcoin İçin En İyi Donanım Cüzdanları (Sadece BTC)",
      intro:
        "Bitcoin puristleri azın daha çok olduğunu bilir. Saldırı yüzeyinizi en aza indirmek ve satoshi'lerinizi en gelişmiş dijital tehditlere karşı güvence altına almak için tasarlanmış, yalnızca Bitcoin (Bitcoin-only) destekleyen en iyi donanım cüzdanlarını keşfedin.",
      ctaStart: "Güvenlik Araçlarını Keşfet",
      ctaBlog: "Bitcoin Rehberlerini Oku",
      whatIsTitle: "Neden Yalnızca Bitcoin (Bitcoin-Only) Cüzdan Seçmelisiniz?",
      whatIsBody:
        "Çoklu coin (multi-coin) donanım cüzdanları, binlerce farklı tokeni, ağı ve akıllı sözleşmeyi desteklemek için karmaşık ve genişleyen kod tabanlarına ihtiyaç duyar. Her kod satırı potansiyel bir güvenlik açığı yaratır. 'Yalnızca Bitcoin' bir donanım cüzdanı, yalnızca Bitcoin protokolüne adanmış, sadeleştirilmiş bir bellenim (firmware) çalıştırır. Tüm altcoin ve DeFi kodlarını ortadan kaldırarak saldırı yüzeyini büyük ölçüde azaltır ve BTC'niz için geçilmez fiziksel bir kasa oluşturursunuz.",
      sectionsHeader: "Bitcoin Gözetimi İçin 10 Temel Unsur",
      sections: [
        {
          title: "1. Coldcard Q: Altın Standart",
          body: "Coinkite tarafından üretilen Coldcard Q, nihai Bitcoin maksimalisti cihazıdır. Tam QWERTY klavyesi, çift güvenlik çipi ve MicroSD kartlar aracılığıyla %100 air-gapped çalışmasıyla öne çıkar. USB özelliklerini fiziksel olarak yok etme seçenekleri bile içerir.",
          toolName: "Cüzdan Güvenliğini Kontrol Et",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. BitBox02 (Sadece Bitcoin Sürümü)",
          body: "İsviçre mühendisliğinin en iyi örneği. BitBox02 yalnızca Bitcoin sürümü, minimalist bir tasarıma ve yalnızca BTC işlemlerini işleyen özel bir bellenime sahiptir. Öne çıkan özelliği, 24 kelimeyi kağıda yazma ihtiyacını ortadan kaldıran kolay MicroSD yedekleme sistemidir.",
        },
        {
          title: "3. Blockstream Jade: Açık Kaynaklı İnovasyon",
          body: "Blockstream Jade, son derece uygun fiyatlı, tamamen açık kaynaklı bir Bitcoin cüzdanıdır. Air-gapped QR kod imzalama için dahili bir kameraya sahiptir ve gücü kapatıldığı anda anahtarlarınızı tamamen unuttuğu, 'durumsuz' (stateless) benzersiz bir mod sunar.",
        },
        {
          title: "4. Foundation Passport: Lüks Soğuk Depolama",
          body: "Premium retro bir cep telefonu gibi görünmek üzere tasarlanan Foundation Passport, QR kodları aracılığıyla air-gapped Bitcoin güvenliği sağlar. Tamamen açık kaynaklı yazılım üzerinde çalışır ve sezgisel bir kullanıcı arayüzü sunar.",
        },
        {
          title: "5. Trezor Safe 5 (Sadece BTC Bellenimi)",
          body: "Trezor Safe 5 çoklu coin cüzdanı olarak gelse de, Trezor resmi bir 'yalnızca Bitcoin' bellenim seçeneği sunar. Bu bellenimi cihazınıza yükleyerek tüm altcoin kodlarını kaldırabilir ve Trezor'un güvenlik çipinden yararlanabilirsiniz.",
        },
        {
          title: "6. SeedSigner: Kendin Yap Yaklaşımı",
          body: "'Güvenme, Doğrula' savunucuları için SeedSigner, Raspberry Pi Zero kullanarak kendi Bitcoin donanım cüzdanınızı oluşturmanıza olanak tanır. Tamamen durumsuzdur (stateless), yani kapatıldığında hiçbir özel veri tutmaz, fiziksel hırsızlık riskini tamamen azaltır.",
        },
        {
          title: "7. PSBT'lerin Gücü",
          body: "Yalnızca Bitcoin cüzdanları, Kısmen İmzalanmış Bitcoin İşlemlerini (PSBT) kullanmada mükemmeldir. Bu, anahtarlarınız internete bağlı bir cihaza asla dokunmadan işlemi çevrimdışı imzalayıp yayınlamanıza olanak tanır.",
        },
        {
          title: "8. Balinalar İçin Multisig Kurulumları",
          body: "Büyük miktarlarda Bitcoin'i güvence altına almak için kullanıcılar genellikle birden fazla donanım cüzdanını çoklu imza (multisig) yapısında (örn. 3'ün 2'si) birleştirir. Bu, tek bir cihaz markasına güvenmenin getirdiği riskleri ortadan kaldırır.",
        },
        {
          title: "9. Kendi Düğümünüze (Node) Bağlanmak",
          body: "Gerçek bir Bitcoin kurulumu, donanım cüzdanınız kendi tam düğümünüze (Umbrel veya Start9 gibi) bağlanana kadar tamamlanmış sayılmaz. Kendi düğümünüzü çalıştırmak, gelen işlemlerinizi kriptografik olarak doğrulamanızı sağlar.",
        },
        {
          title: "10. Parola Koruması (25. Kelime)",
          body: "En iyi Bitcoin cüzdanları, tamamen gizli bir cüzdan oluşturan 'BIP39 Parolası' (Passphrase) kullanımını şiddetle teşvik eder. Birisi 24 kelimelik kağıt yedeğinizi bulsa bile, aklınızdaki gizli parolayı bilmeden Bitcoin'inize erişemez.",
        },
      ],
      summaryTitle: "Nihai Bitcoin Kasası",
      summaryBody:
        "Servetinizi şimdiye kadar yaratılmış en sert paraya adıyorsanız, en sert güvenliği hak ediyor demektir. Sadece Bitcoin'e özel bir donanım cüzdanı seçerek gereksiz kodları ortadan kaldırır ve varlığınızı korursunuz.",
      faqTitle: "Sıkça Sorulan Sorular",
      faqs: [
        {
          question:
            "Sadece Bitcoin olan bir cüzdanda Ethereum saklayabilir miyim?",
          answer:
            "Hayır. Yalnızca Bitcoin cüzdanları, altcoinleri işlemek için gerekli bellenime sahip değildir. Onları göndermeye çalışırsanız, kaybolurlar veya reddedilirler.",
        },
        {
          question:
            "Bu cüzdanlarla eşleştirilecek en iyi masaüstü yazılımı hangisidir?",
          answer:
            "Sparrow Wallet ve Electrum, Bitcoinciler için altın standartlardır. Coldcard ve BitBox02 gibi cihazlarla kusursuz bir şekilde entegre olurlar.",
        },
        {
          question:
            "Çoklu coin cüzdanını yalnızca Bitcoin'e dönüştürebilir miyim?",
          answer:
            "Trezor ve BitBox gibi bazı markalar, standart yazılımı değiştirmek için yükleyebileceğiniz resmi yalnızca Bitcoin bellenimi sunar.",
        },
      ],
      ctaSectionTitle: "Bitcoin Güvenliğinizi Bugün Denetleyin",
      ctaSectionDesc:
        "Kendinize ait cüzdan kurulumunuzun su sızdırmaz olduğundan emin olun. Ücretsiz araçlarımızı keşfedin.",
    },
    pt: {
      title:
        "As Melhores Carteiras de Hardware para Bitcoin em 2026 (Apenas BTC)",
      intro:
        "Os puristas do Bitcoin sabem que menos é mais. Explore as melhores carteiras de hardware 'apenas Bitcoin' projetadas para minimizar a superfície de ataque e proteger seus satoshis contra ameaças digitais avançadas.",
      ctaStart: "Explorar Ferramentas de Segurança",
      ctaBlog: "Ler Guias de Bitcoin",
      whatIsTitle: "Por Que Escolher uma Carteira Apenas Bitcoin?",
      whatIsBody:
        "Carteiras multimoeda requerem códigos complexos para suportar milhares de tokens diferentes. Cada linha de código introduz uma vulnerabilidade potencial. Uma carteira 'apenas Bitcoin' (Bitcoin-only) executa um firmware simplificado dedicado exclusivamente ao protocolo Bitcoin. Ao eliminar códigos de altcoins e DeFi, você reduz drasticamente a superfície de ataque, criando um cofre impenetrável para o seu BTC.",
      sectionsHeader: "10 Essenciais para Autocustódia de Bitcoin",
      sections: [
        {
          title: "1. Coldcard Q: O Padrão Ouro",
          body: "Fabricada pela Coinkite, a Coldcard Q é o dispositivo maximalista definitivo. Possui teclado QWERTY, chips de segurança duplos e opera 100% air-gapped via MicroSD. Inclui recursos para destruir fisicamente o USB.",
          toolName: "Verificar Segurança",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. BitBox02 (Bitcoin-Only Edition)",
          body: "Engenharia suíça com design minimalista. A edição BitBox02 Bitcoin-only possui um firmware especializado apenas para BTC. Seu destaque é o backup em MicroSD incrivelmente fácil, removendo a necessidade do papel.",
        },
        {
          title: "3. Blockstream Jade: Inovação de Código Aberto",
          body: "A Blockstream Jade é uma carteira totalmente de código aberto e muito acessível. Possui câmera para códigos QR air-gapped e um modo 'stateless' único, onde esquece completamente suas chaves ao ser desligada.",
        },
        {
          title: "4. Foundation Passport: Cofre de Luxo",
          body: "Projetado para parecer um celular retrô premium, o Foundation Passport oferece segurança air-gapped via QR codes. Funciona com código aberto e tem uma interface de usuário altamente intuitiva e luxuosa.",
        },
        {
          title: "5. Trezor Safe 5 (Firmware Apenas BTC)",
          body: "Embora a Trezor Safe 5 seja multimoeda, a Trezor oferece um firmware oficial 'apenas Bitcoin'. Você pode instalá-lo via Trezor Suite, removendo todos os códigos de altcoins e mantendo o chip seguro sem NDA.",
        },
        {
          title: "6. SeedSigner: O Método DIY",
          body: "Para os defensores do 'Não Confie, Verifique', o SeedSigner permite construir sua própria carteira usando um Raspberry Pi Zero. É totalmente 'stateless', não guardando dados privados após ser desligado.",
        },
        {
          title: "7. O Poder das PSBTs",
          body: "As carteiras apenas Bitcoin são excelentes no uso de Transações Bitcoin Parcialmente Assinadas (PSBT). Isso permite criar uma transação no PC, exportar via MicroSD, assinar offline na Coldcard e transmitir com total segurança.",
        },
        {
          title: "8. Configurações Multisig para Baleias",
          body: "Para grandes quantias, usuários combinam várias carteiras de hardware (ex: Coldcard, BitBox02 e Trezor) num esquema de múltiplas assinaturas, eliminando a falha única de depender de uma só marca.",
        },
        {
          title: "9. Conectando-se ao Seu Próprio Node",
          body: "A verdadeira segurança exige conectar a carteira ao seu próprio full node (como Umbrel). Confiar no node do fabricante compromete sua privacidade; rodar o seu garante a verificação criptográfica das suas transações.",
        },
        {
          title: "10. Proteção com Passphrase (A 25ª Palavra)",
          body: "As melhores carteiras incentivam o uso da 'Passphrase BIP39'. Ela age como uma 25ª palavra que cria uma carteira oculta. Se acharem seu backup de 24 palavras, ainda não acessarão o Bitcoin sem a senha na sua mente.",
        },
      ],
      summaryTitle: "O Cofre de Bitcoin Definitivo",
      summaryBody:
        "Se você está dedicando sua riqueza ao dinheiro mais sólido já criado, ele merece a segurança mais sólida. Escolher uma carteira apenas Bitcoin elimina códigos desnecessários e protege seu patrimônio.",
      faqTitle: "Perguntas Frequentes",
      faqs: [
        {
          question: "Posso armazenar Ethereum numa carteira apenas Bitcoin?",
          answer:
            "Não. Carteiras Bitcoin-only não possuem o firmware para processar altcoins. Se você tentar enviar, as moedas serão perdidas ou a transação rejeitada.",
        },
        {
          question:
            "Qual o melhor software de PC para usar com essas carteiras?",
          answer:
            "Sparrow Wallet e Electrum são os padrões ouro para Bitcoiners, integrando-se perfeitamente com Coldcard e BitBox02.",
        },
        {
          question:
            "Posso converter uma carteira multimoeda para apenas Bitcoin?",
          answer:
            "Algumas marcas, como Trezor e BitBox, oferecem firmware oficial apenas Bitcoin que você pode instalar para substituir o padrão.",
        },
      ],
      ctaSectionTitle: "Audite Sua Segurança Hoje",
      ctaSectionDesc:
        "Garanta que sua configuração de autocustódia seja impenetrável. Explore nossas ferramentas gratuitas.",
    },
    es: {
      title:
        "Las Mejores Billeteras de Hardware para Bitcoin en 2026 (Solo BTC)",
      intro:
        "Los puristas de Bitcoin saben que menos es más. Explora las mejores billeteras de hardware exclusivas de Bitcoin, diseñadas para minimizar la superficie de ataque y asegurar tus satoshis contra amenazas avanzadas.",
      ctaStart: "Explorar Herramientas",
      ctaBlog: "Leer Guías de Bitcoin",
      whatIsTitle: "¿Por Qué Elegir una Billetera 'Solo Bitcoin'?",
      whatIsBody:
        "Las billeteras multimoneda requieren códigos complejos para soportar miles de tokens. Cada línea de código introduce una vulnerabilidad potencial. Una billetera de hardware 'solo Bitcoin' (Bitcoin-only) ejecuta un firmware optimizado y dedicado exclusivamente al protocolo Bitcoin. Al eliminar el código de las altcoins y DeFi, reduces drásticamente la superficie de ataque, creando una bóveda impenetrable para tu BTC.",
      sectionsHeader: "10 Esenciales para la Autocustodia de Bitcoin",
      sections: [
        {
          title: "1. Coldcard Q: El Estándar de Oro",
          body: "Fabricada por Coinkite, la Coldcard Q es el dispositivo maximalista definitivo. Tiene teclado QWERTY, doble chip de seguridad de diferentes fabricantes y opera 100% aislada (air-gapped) mediante tarjetas MicroSD.",
          toolName: "Verificar Seguridad",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. BitBox02 (Edición Solo Bitcoin)",
          body: "Ingeniería suiza minimalista. La BitBox02 edición solo Bitcoin posee un firmware especializado en transacciones BTC. Su característica estrella es el respaldo fácil en MicroSD, eliminando la necesidad de escribir las palabras en papel.",
        },
        {
          title: "3. Blockstream Jade: Innovación de Código Abierto",
          body: "La Blockstream Jade es una billetera completamente de código abierto. Cuenta con cámara para firmas air-gapped y ofrece un modo 'stateless' donde olvida por completo tus llaves al apagarse, dependiendo de una app complementaria.",
        },
        {
          title: "4. Foundation Passport: Almacenamiento de Lujo",
          body: "Diseñado para parecerse a un teléfono móvil retro premium, el Foundation Passport proporciona seguridad air-gapped mediante códigos QR. Funciona con software de código abierto y ofrece una experiencia de usuario altamente intuitiva.",
        },
        {
          title: "5. Trezor Safe 5 (Firmware Solo BTC)",
          body: "Aunque la Trezor Safe 5 viene como multimoneda, Trezor ofrece un firmware oficial 'solo Bitcoin'. Puedes instalarlo a través de Trezor Suite, eliminando todo el código de altcoins mientras te beneficias de su chip seguro.",
        },
        {
          title: "6. SeedSigner: El Enfoque DIY",
          body: "Para el defensor absoluto de 'No confíes, verifica', SeedSigner te permite construir tu propia billetera usando una Raspberry Pi Zero. Es totalmente 'stateless', no guarda datos al apagarse, eliminando el riesgo de robo físico.",
        },
        {
          title: "7. El Poder de las PSBT",
          body: "Las billeteras solo Bitcoin sobresalen al usar Transacciones de Bitcoin Parcialmente Firmadas (PSBT). Esto permite generar la transacción en la PC, exportarla, firmarla sin conexión en la Coldcard, y transmitirla con seguridad total.",
        },
        {
          title: "8. Configuración Multisig para Ballenas",
          body: "Para grandes montos, los usuarios combinan múltiples billeteras (ej. Coldcard, BitBox02 y Trezor) en un esquema multifirma, eliminando el riesgo de depender de un solo fabricante o dispositivo.",
        },
        {
          title: "9. Conectando tu Propio Nodo",
          body: "Una configuración real de Bitcoin requiere conectar tu billetera a tu propio nodo completo (como Umbrel). Confiar en el nodo del fabricante compromete tu privacidad; correr el tuyo asegura la verificación criptográfica propia.",
        },
        {
          title: "10. Protección con Passphrase (Palabra 25)",
          body: "Se recomienda el uso de una 'Passphrase BIP39'. Actúa como una palabra 25 que crea una billetera oculta. Si alguien encuentra tus 24 palabras, no podrá acceder al Bitcoin sin la contraseña que está en tu mente.",
        },
      ],
      summaryTitle: "La Bóveda Definitiva de Bitcoin",
      summaryBody:
        "Si dedicas tu riqueza al dinero más duro jamás creado, merece la seguridad más dura. Elegir una billetera exclusiva de Bitcoin elimina código innecesario y protege tu inversión de las amenazas digitales.",
      faqTitle: "Preguntas Frecuentes",
      faqs: [
        {
          question: "¿Puedo guardar Ethereum en una billetera solo Bitcoin?",
          answer:
            "No. Carecen del firmware necesario para procesar altcoins. Si intentas enviarlos, se perderán o la red rechazará la transacción.",
        },
        {
          question: "¿Cuál es el mejor software de escritorio para usar?",
          answer:
            "Sparrow Wallet y Electrum son los estándares de oro para Bitcoiners. Se integran perfectamente con dispositivos como Coldcard y BitBox02.",
        },
        {
          question:
            "¿Puedo convertir una billetera multimoneda a solo Bitcoin?",
          answer:
            "Algunas marcas, como Trezor y BitBox, ofrecen firmware oficial de solo Bitcoin que puedes instalar para reemplazar el estándar.",
        },
      ],
      ctaSectionTitle: "Audita tu Seguridad de Bitcoin Hoy",
      ctaSectionDesc:
        "Asegúrate de que tu configuración de autocustodia sea impenetrable. Explora nuestras herramientas.",
    },
    fr: {
      title:
        "Les Meilleurs Portefeuilles Matériels pour Bitcoin en 2026 (100% BTC)",
      intro:
        "Les puristes de Bitcoin savent que 'moins c'est plus'. Découvrez les portefeuilles matériels 100% Bitcoin conçus pour minimiser votre surface d'attaque et sécuriser vos satoshis.",
      ctaStart: "Explorer les Outils",
      ctaBlog: "Lire les Guides Bitcoin",
      whatIsTitle: "Pourquoi Choisir un Portefeuille 100% Bitcoin ?",
      whatIsBody:
        "Les portefeuilles multi-cryptos nécessitent des codes complexes pour supporter des milliers de tokens. Chaque ligne de code introduit une vulnérabilité potentielle. Un portefeuille '100% Bitcoin' (Bitcoin-only) exécute un firmware allégé dédié uniquement au protocole Bitcoin. En éliminant les altcoins et la DeFi, vous réduisez considérablement la surface d'attaque, créant un coffre-fort physique impénétrable.",
      sectionsHeader: "10 Essentiels de l'Auto-conservation Bitcoin",
      sections: [
        {
          title: "1. Coldcard Q : L'Étalon-Or",
          body: "Fabriqué par Coinkite, le Coldcard Q est le dispositif maximaliste par excellence. Il possède un clavier QWERTY, deux puces sécurisées et fonctionne 100% hors ligne (air-gapped) via MicroSD.",
          toolName: "Vérifier la Sécurité",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. BitBox02 (Édition Bitcoin-Only)",
          body: "L'ingénierie suisse à son apogée. L'édition Bitcoin-only du BitBox02 possède un firmware spécialisé. Sa fonction phare est une sauvegarde MicroSD ultra-simple, évitant de devoir écrire les mots sur papier.",
        },
        {
          title: "3. Blockstream Jade : L'Innovation Open-Source",
          body: "Le Blockstream Jade est un portefeuille open-source très abordable. Il dispose d'une caméra pour la signature QR hors ligne et d'un mode 'stateless' où il oublie totalement les clés lorsqu'il s'éteint.",
        },
        {
          title: "4. Foundation Passport : Le Luxe",
          body: "Conçu comme un téléphone rétro premium, le Foundation Passport assure la sécurité Bitcoin via des codes QR. Il fonctionne sur logiciel open-source et est apprécié pour son interface utilisateur intuitive.",
        },
        {
          title: "5. Trezor Safe 5 (Firmware Bitcoin-Only)",
          body: "Bien que le Trezor Safe 5 soit multi-cryptos, Trezor propose un firmware officiel 100% Bitcoin. Vous pouvez l'installer via Trezor Suite pour supprimer le code altcoin tout en bénéficiant de la puce sécurisée.",
        },
        {
          title: "6. SeedSigner : L'Approche DIY (Faites-le vous-même)",
          body: "Pour les adeptes du 'Ne faites pas confiance, vérifiez', SeedSigner permet de construire son propre portefeuille avec un Raspberry Pi Zero. Il ne conserve aucune donnée privée une fois éteint.",
        },
        {
          title: "7. La Puissance des PSBT",
          body: "Les portefeuilles Bitcoin-only excellent dans l'utilisation des Transactions Bitcoin Partiellement Signées (PSBT). Cela permet de créer la transaction sur PC, de la signer hors ligne sur le Coldcard et de la diffuser en toute sécurité.",
        },
        {
          title: "8. Multisig pour les 'Baleines'",
          body: "Pour sécuriser de gros montants, les utilisateurs combinent plusieurs portefeuilles matériels dans un quorum multi-signatures (ex. 2 sur 3), éliminant le risque de dépendre d'un seul fabricant.",
        },
        {
          title: "9. Se Connecter à son Propre Nœud",
          body: "Une vraie configuration Bitcoin nécessite de connecter le portefeuille à votre propre nœud (comme Umbrel). Utiliser le nœud du fabricant compromet la confidentialité ; le vôtre garantit la vérification cryptographique de vos propres transactions.",
        },
        {
          title: "10. La Passphrase (Le 25ème Mot)",
          body: "L'utilisation d'une 'Passphrase BIP39' est vivement recommandée. Elle agit comme un 25ème mot qui crée un portefeuille caché. Si quelqu'un trouve vos 24 mots, il ne peut pas accéder au Bitcoin sans ce mot de passe mémorisé.",
        },
      ],
      summaryTitle: "Le Coffre-Fort Bitcoin Ultime",
      summaryBody:
        "Si vous dédiez votre richesse à la monnaie la plus solide jamais créée, elle mérite la sécurité la plus solide. Un portefeuille 100% Bitcoin élimine le code inutile et protège vos actifs.",
      faqTitle: "Questions Fréquentes",
      faqs: [
        {
          question:
            "Puis-je stocker de l'Ethereum sur un portefeuille Bitcoin-only ?",
          answer:
            "Non. Ces portefeuilles n'ont pas le firmware pour traiter les altcoins. Si vous essayez de les envoyer, les fonds seront perdus ou rejetés.",
        },
        {
          question: "Quel logiciel de bureau utiliser avec ces portefeuilles ?",
          answer:
            "Sparrow Wallet et Electrum sont les standards de l'industrie. Ils s'intègrent parfaitement avec des appareils comme Coldcard et BitBox02.",
        },
        {
          question:
            "Puis-je convertir un portefeuille multi-cryptos en Bitcoin-only ?",
          answer:
            "Certaines marques (Trezor, BitBox) proposent des firmwares officiels 100% Bitcoin que vous pouvez installer pour remplacer la version standard.",
        },
      ],
      ctaSectionTitle: "Auditez Votre Sécurité Bitcoin Aujourd'hui",
      ctaSectionDesc:
        "Assurez-vous que votre configuration d'auto-conservation est infaillible. Utilisez nos outils d'analyse.",
    },
    de: {
      title: "Die besten Hardware-Wallets für Bitcoin 2026 (Bitcoin-Only)",
      intro:
        "Bitcoin-Puristen wissen, dass weniger mehr ist. Entdecken Sie die besten Bitcoin-Only-Hardware-Wallets, die Ihre Angriffsfläche minimieren und Ihre Satoshis vor den fortschrittlichsten digitalen Bedrohungen schützen.",
      ctaStart: "Sicherheits-Tools",
      ctaBlog: "Bitcoin-Guides lesen",
      whatIsTitle: "Warum ein Bitcoin-Only Wallet wählen?",
      whatIsBody:
        "Multi-Coin-Wallets erfordern komplexe Codebasen, um Tausende verschiedener Token zu unterstützen. Jede Zeile Code birgt eine potenzielle Schwachstelle. Ein 'Bitcoin-Only'-Wallet verwendet eine verschlankte Firmware, die ausschließlich für das Bitcoin-Protokoll bestimmt ist. Durch die Eliminierung von Altcoin-Code reduzieren Sie die Angriffsfläche drastisch und schaffen einen undurchdringlichen Tresor für Ihre BTC.",
      sectionsHeader: "10 Essenzielles für die Bitcoin-Verwahrung",
      sections: [
        {
          title: "1. Coldcard Q: Der Goldstandard",
          body: "Die Coldcard Q von Coinkite ist das ultimative Maximalisten-Gerät. Sie verfügt über eine vollständige QWERTY-Tastatur, zwei separate Sicherheitschips und arbeitet 100% Air-Gapped via MicroSD.",
          toolName: "Wallet-Sicherheit prüfen",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. BitBox02 (Bitcoin-Only Edition)",
          body: "Schweizer Ingenieurskunst. Die Bitcoin-Only Edition der BitBox02 verarbeitet ausschließlich BTC. Die Besonderheit ist das einfache MicroSD-Backup-System, das das Aufschreiben der 24 Wörter überflüssig machen kann.",
        },
        {
          title: "3. Blockstream Jade: Open-Source-Innovation",
          body: "Das Blockstream Jade ist ein sehr erschwingliches, Open-Source-Wallet. Es bietet eine Kamera für Air-Gapped QR-Code-Signierung und einen 'Stateless'-Modus, bei dem es Schlüssel beim Ausschalten komplett vergisst.",
        },
        {
          title: "4. Foundation Passport: Luxus-Storage",
          body: "Im Design eines Premium-Retro-Handys bietet das Foundation Passport Air-Gapped Bitcoin-Sicherheit via QR-Codes. Es basiert komplett auf Open-Source-Software und überzeugt mit intuitiver Bedienung.",
        },
        {
          title: "5. Trezor Safe 5 (BTC-Only Firmware)",
          body: "Obwohl das Trezor Safe 5 als Multi-Coin-Wallet ausgeliefert wird, bietet Trezor eine offizielle 'Bitcoin-Only'-Firmware an. So können Sie allen Altcoin-Code entfernen und profitieren trotzdem vom Sicherheitschip.",
        },
        {
          title: "6. SeedSigner: Der DIY-Ansatz",
          body: "Für echte 'Don't Trust, Verify'-Anhänger ermöglicht SeedSigner den Bau eines eigenen Bitcoin-Wallets mit einem Raspberry Pi Zero. Es ist komplett stateless und speichert nach dem Ausschalten keine privaten Daten.",
        },
        {
          title: "7. Die Macht von PSBTs",
          body: "Bitcoin-Only-Wallets sind exzellent in der Nutzung von Partially Signed Bitcoin Transactions (PSBTs). So generieren Sie die Transaktion am PC, signieren sie offline (z.B. auf der Coldcard) und veröffentlichen sie sicher.",
        },
        {
          title: "8. Multisig-Setups für Wale",
          body: "Für große Summen kombinieren Nutzer oft mehrere Wallets (z.B. Coldcard, BitBox02, Trezor) zu einem Multisig-Quorum (wie 2-of-3). Das eliminiert den Ausfallpunkt ('Single Point of Failure') eines einzelnen Herstellers.",
        },
        {
          title: "9. Die Verbindung zur eigenen Node",
          body: "Ein echtes Bitcoin-Setup erfordert die Verbindung des Wallets zur eigenen Full Node (wie Umbrel). Das Vertrauen auf Nodes der Hersteller gefährdet die Privatsphäre; eine eigene Node verifiziert Ihre Transaktionen kryptografisch.",
        },
        {
          title: "10. Passphrase-Schutz (Das 25. Wort)",
          body: "Die Nutzung einer 'BIP39 Passphrase' wird dringend empfohlen. Sie fungiert als 25. Wort und kreiert ein verstecktes Wallet. Findet jemand Ihr 24-Wort-Backup, kommt er ohne das Passwort in Ihrem Kopf nicht an das Bitcoin.",
        },
      ],
      summaryTitle: "Der ultimative Bitcoin-Tresor",
      summaryBody:
        "Wenn Sie Ihr Vermögen dem härtesten Geld aller Zeiten widmen, verdient es auch die härteste Sicherheit. Mit einem Bitcoin-Only-Wallet eliminieren Sie unnötigen Code und schützen Ihre Bestände.",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        {
          question:
            "Kann ich Ethereum auf einem Bitcoin-Only Wallet speichern?",
          answer:
            "Nein. Diesen Wallets fehlt die Firmware zur Verarbeitung von Altcoins. Wenn Sie versuchen, diese zu senden, gehen sie verloren oder werden abgelehnt.",
        },
        {
          question: "Welche Desktop-Software ist die beste für diese Wallets?",
          answer:
            "Sparrow Wallet und Electrum sind die Goldstandards für Bitcoiner. Sie integrieren sich nahtlos mit Geräten wie Coldcard und BitBox02.",
        },
        {
          question: "Kann ich ein Multi-Coin-Wallet in Bitcoin-Only umwandeln?",
          answer:
            "Einige Marken wie Trezor und BitBox bieten offizielle Bitcoin-Only-Firmware an, die Sie installieren können, um die Standardsoftware zu ersetzen.",
        },
      ],
      ctaSectionTitle: "Prüfen Sie Ihre Bitcoin-Sicherheit",
      ctaSectionDesc:
        "Stellen Sie sicher, dass Ihr Self-Custody-Setup wasserdicht ist. Entdecken Sie unsere kostenlosen Tools.",
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
      canonical: `https://www.kryptonal.com/${locale}/learn/best-hardware-wallet-for-bitcoin`,
      languages: {
        en: "https://www.kryptonal.com/en/learn/best-hardware-wallet-for-bitcoin",
        tr: "https://www.kryptonal.com/tr/learn/best-hardware-wallet-for-bitcoin",
        pt: "https://www.kryptonal.com/pt/learn/best-hardware-wallet-for-bitcoin",
        es: "https://www.kryptonal.com/es/learn/best-hardware-wallet-for-bitcoin",
        fr: "https://www.kryptonal.com/fr/learn/best-hardware-wallet-for-bitcoin",
        de: "https://www.kryptonal.com/de/learn/best-hardware-wallet-for-bitcoin",
      },
    },
    openGraph: {
      title: t.title,
      description: t.intro.substring(0, 150),
      url: `https://www.kryptonal.com/${locale}/learn/best-hardware-wallet-for-bitcoin`,
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
export default async function BitcoinOnlyWalletPage({ params }: PageProps) {
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
              🪙 Bitcoin-Only Security
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
