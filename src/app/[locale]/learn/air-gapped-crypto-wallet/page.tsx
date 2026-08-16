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
      title: "The Best Air-Gapped Crypto Wallets for Maximum Security in 2026",
      intro:
        "For investors who refuse to compromise on security, air-gapped crypto wallets are the ultimate defense. Discover how devices with no USB or Bluetooth connections keep your digital assets completely isolated from hackers.",
      ctaStart: "Explore Security Tools",
      ctaBlog: "Read Hardware Reviews",
      whatIsTitle: "What Does 'Air-Gapped' Actually Mean?",
      whatIsBody:
        "In cybersecurity, an 'air gap' means a device is physically isolated from any unsecured network. In the context of crypto, an air-gapped hardware wallet never connects to your computer or phone via USB cables, Bluetooth, WiFi, or NFC. Instead, data is transferred using transparent, verifiable methods like scanning QR codes via a built-in camera or physically moving a MicroSD card. This physical isolation makes remote hacking mathematically and physically impossible.",
      sectionsHeader: "10 Things to Know About Air-Gapped Wallets",
      sections: [
        {
          title: "1. Why USB and Bluetooth Are Risks",
          body: "While modern hardware wallets encrypt USB and Bluetooth connections, highly paranoid users view any physical or wireless connection to an internet-enabled device as a potential vector for malware or supply-chain attacks. Air-gapping removes this vector entirely.",
          toolName: "Check Wallet Security",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. How QR Code Signing Works",
          body: "To send a transaction, your software wallet generates a QR code containing the unsigned transaction data. You scan this with your air-gapped wallet's camera. The device signs the transaction offline and displays a new QR code, which your webcam or phone scans to broadcast it to the blockchain.",
        },
        {
          title: "3. ELLIPAL Titan 2.0: The Metal Fortress",
          body: "The ELLIPAL Titan 2.0 is a heavyweight, fully metal-sealed device that relies entirely on QR codes. It has no USB ports or radio frequencies and features a self-destruct mechanism that wipes the private keys if someone tries to pry the casing open.",
        },
        {
          title: "4. SafePal S1 Pro: Budget Air-Gapping",
          body: "Air-gapped security isn't just for whales. The SafePal S1 Pro offers an EAL6+ secure element and pure QR-code communication at a fraction of the cost of premium competitors, making maximum security accessible to everyone.",
        },
        {
          title: "5. Keystone 3 Pro: Open-Source Verification",
          body: "Keystone bridges the gap between air-gapped security and open-source transparency. It utilizes three separate secure element chips from different manufacturers and relies purely on QR codes or MicroSD cards, making it a favorite for advanced DeFi users.",
        },
        {
          title: "6. Coldcard Q: The MicroSD Champion",
          body: "Designed strictly for Bitcoin, the Coldcard Q allows users to physically destroy its USB capabilities. To sign transactions, users save the 'Partially Signed Bitcoin Transaction' (PSBT) onto a MicroSD card, insert it into the Coldcard, sign it, and move the card back to the PC.",
        },
        {
          title: "7. The UX Trade-off: Security vs. Friction",
          body: "Maximum security comes with maximum friction. Scanning multiple QR codes or physically swapping MicroSD cards between devices takes significantly longer than simply pressing a button on a Bluetooth-enabled wallet.",
        },
        {
          title: "8. Protection Against Battery Explosions",
          body: "Some purists even avoid batteries. Devices like the Coldcard can be powered via a direct wall outlet using a 'power-only' USB cable (which has the data transfer pins physically removed), ensuring zero data can leak while the device is on.",
        },
        {
          title: "9. Firmware Updates on Air-Gapped Devices",
          body: "Updating an air-gapped wallet requires transferring the encrypted firmware file onto a MicroSD card via your computer, and then inserting that card into the hardware wallet. The wallet cryptographically verifies the manufacturer's signature before installing.",
        },
        {
          title: "10. Who Actually Needs One?",
          body: "If you trade NFTs daily or use DeFi protocols constantly, an air-gapped wallet will be frustrating. However, if you are a 'whale' holding significant wealth, a corporate treasury, or a long-term HODLer, an air-gapped vault is the smartest choice.",
        },
      ],
      summaryTitle: "The Ultimate Vault",
      summaryBody:
        "An air-gapped wallet represents the pinnacle of personal digital security. By physically severing all connections to the internet, you reduce your attack surface to zero, protecting your wealth from even the most sophisticated digital threats.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          question: "Can an air-gapped wallet be hacked?",
          answer:
            "Remotely? No. It is physically impossible to hack a device over the internet if it cannot connect to the internet. The only threats are physical theft (if they know your PIN) or the '$5 wrench attack' (physical coercion).",
        },
        {
          question: "What happens if the camera on a QR-code wallet breaks?",
          answer:
            "If the camera breaks, you won't be able to scan transactions. However, your funds are safe. You simply recover your wallet by entering your 12 or 24-word seed phrase into a new hardware device.",
        },
        {
          question: "Are air-gapped wallets compatible with MetaMask?",
          answer:
            "Some are. Devices like the Keystone 3 Pro have native QR-code integration with MetaMask, allowing you to use DeFi safely without ever plugging the device into your PC.",
        },
      ],
      ctaSectionTitle: "Evaluate Your Wallet Security",
      ctaSectionDesc:
        "Whether you use an air-gapped vault or a standard hardware wallet, ensure you only interact with safe smart contracts. Use our free risk tools today.",
    },
    tr: {
      title:
        "2026'nın En İyi Air-Gapped (Havadan Yalıtılmış) Kripto Cüzdanları",
      intro:
        "Güvenlikten ödün vermek istemeyen yatırımcılar için air-gapped kripto cüzdanları nihai savunmadır. USB veya Bluetooth bağlantısı olmayan cihazların dijital varlıklarınızı bilgisayar korsanlarından nasıl tamamen izole ettiğini keşfedin.",
      ctaStart: "Güvenlik Araçlarını Keşfet",
      ctaBlog: "Donanım İncelemelerini Oku",
      whatIsTitle: "'Air-Gapped' Gerçekte Ne Anlama Geliyor?",
      whatIsBody:
        "Siber güvenlikte 'air gap' (hava boşluğu/havadan yalıtım), bir cihazın güvenli olmayan herhangi bir ağdan fiziksel olarak izole edilmesi anlamına gelir. Kripto bağlamında, air-gapped bir donanım cüzdanı bilgisayarınıza veya telefonunuza asla USB kablosu, Bluetooth, WiFi veya NFC ile bağlanmaz. Bunun yerine veriler, dahili bir kamera aracılığıyla QR kodlarını taramak veya bir MicroSD kartı fiziksel olarak taşımak gibi doğrulanabilir yöntemlerle aktarılır. Bu fiziksel izolasyon, uzaktan hacklemeyi imkansız hale getirir.",
      sectionsHeader: "Air-Gapped Cüzdanlar Hakkında Bilmeniz Gereken 10 Şey",
      sections: [
        {
          title: "1. USB ve Bluetooth Neden Risklidir?",
          body: "Modern donanım cüzdanları USB ve Bluetooth bağlantılarını şifrelese de, oldukça paranoyak kullanıcılar internet özellikli bir cihaza yönelik herhangi bir fiziksel veya kablosuz bağlantıyı potansiyel bir kötü amaçlı yazılım veya tedarik zinciri saldırısı vektörü olarak görürler.",
          toolName: "Cüzdan Güvenliğini Kontrol Et",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. QR Kod ile İmzalama Nasıl Çalışır?",
          body: "İşlem yapmak için yazılım cüzdanınız imzasız işlem verilerini içeren bir QR kod üretir. Bunu air-gapped cüzdanınızın kamerasıyla tararsınız. Cihaz işlemi çevrimdışı imzalar ve yeni bir QR kod görüntüler; bunu da blokzincirine yayınlamak için telefonunuz veya web kameranız tarar.",
        },
        {
          title: "3. ELLIPAL Titan 2.0: Metal Kale",
          body: "ELLIPAL Titan 2.0, tamamen metal mühürlü, yalnızca QR kodlarına dayanan ağır bir cihazdır. USB bağlantı noktası yoktur ve kasası açılmaya çalışılırsa özel anahtarları silen bir kendi kendini imha mekanizmasına sahiptir.",
        },
        {
          title: "4. SafePal S1 Pro: Bütçe Dostu Yalıtım",
          body: "SafePal S1 Pro, EAL6+ güvenli çipi ve saf QR kod iletişimi sunarken premium rakiplerinin çok altında bir maliyete sahiptir, bu da maksimum güvenliği herkes için erişilebilir kılar.",
        },
        {
          title: "5. Keystone 3 Pro: Açık Kaynak Doğrulaması",
          body: "Keystone, air-gapped güvenlik ile açık kaynak şeffaflığı arasındaki boşluğu doldurur. Üç ayrı güvenlik çipi kullanır ve yalnızca QR kodlarına veya MicroSD kartlara dayanarak gelişmiş DeFi kullanıcılarının favorisi olur.",
        },
        {
          title: "6. Coldcard Q: MicroSD Şampiyonu",
          body: "Yalnızca Bitcoin için tasarlanan Coldcard Q, kullanıcıların USB yeteneklerini fiziksel olarak yok etmesine olanak tanır. İşlemleri imzalamak için kullanıcılar veriyi bir MicroSD karta kaydeder, Coldcard'a takar, imzalar ve kartı tekrar PC'ye taşır.",
        },
        {
          title: "7. Kullanıcı Deneyimi Takası: Güvenlik vs. Zorluk",
          body: "Maksimum güvenlik maksimum zorlukla gelir. Birden fazla QR kodu taramak veya MicroSD kartları cihazlar arasında fiziksel olarak değiştirmek, Bluetooth özellikli bir cüzdandaki bir düğmeye basmaktan çok daha uzun sürer.",
        },
        {
          title: "8. Pil Patlamalarına Karşı Koruma",
          body: "Bazı puristler pillerden bile kaçınır. Coldcard gibi cihazlar, yalnızca güç sağlayan (veri aktarım pinleri çıkarılmış) bir USB kablosu kullanılarak doğrudan prizden çalıştırılabilir, cihaz açıkken veri sızmamasını sağlar.",
        },
        {
          title: "9. Air-Gapped Cihazlarda Yazılım Güncellemeleri",
          body: "Bir air-gapped cüzdanı güncellemek, şifrelenmiş bellenim dosyasını bilgisayarınız üzerinden bir MicroSD karta aktarmayı ve ardından bu kartı donanım cüzdanına takmayı gerektirir.",
        },
        {
          title: "10. Gerçekten Kimin İhtiyacı Var?",
          body: "Her gün NFT ticareti yapıyorsanız, air-gapped bir cüzdan sinir bozucu olacaktır. Ancak önemli bir servet tutan bir 'balina', kurumsal bir hazine veya uzun vadeli bir HODLer iseniz, air-gapped bir kasa en akıllıca seçimdir.",
        },
      ],
      summaryTitle: "Nihai Kasa",
      summaryBody:
        "Air-gapped bir cüzdan kişisel dijital güvenliğin zirvesini temsil eder. İnternetle olan tüm bağlantıları fiziksel olarak keserek, saldırı yüzeyinizi sıfıra indirirsiniz.",
      faqTitle: "Sıkça Sorulan Sorular",
      faqs: [
        {
          question: "Air-gapped bir cüzdan hacklenebilir mi?",
          answer:
            "Uzaktan mı? Hayır. İnternete bağlanamayan bir cihazı internet üzerinden hacklemek fiziksel olarak imkansızdır. Tek tehdit fiziksel hırsızlıktır.",
        },
        {
          question: "QR kodlu cüzdanın kamerası bozulursa ne olur?",
          answer:
            "Kamera bozulursa işlemleri tarayamazsınız. Ancak fonlarınız güvendedir. 12 veya 24 kelimelik ifadenizi (seed phrase) yeni bir donanıma girerek cüzdanınızı kurtarırsınız.",
        },
        {
          question: "Air-gapped cüzdanlar MetaMask ile uyumlu mu?",
          answer:
            "Bazıları evet. Keystone 3 Pro gibi cihazların MetaMask ile yerel QR kodu entegrasyonu vardır.",
        },
      ],
      ctaSectionTitle: "Cüzdan Güvenliğinizi Değerlendirin",
      ctaSectionDesc:
        "İster air-gapped ister standart bir donanım cüzdanı kullanın, ücretsiz araçlarımızı kullanarak akıllı sözleşmeleri kontrol edin.",
    },
    pt: {
      title:
        "As Melhores Carteiras Cripto Air-Gapped para Segurança Máxima em 2026",
      intro:
        "Para investidores que se recusam a comprometer a segurança, as carteiras air-gapped são a defesa definitiva. Descubra como dispositivos sem conexões USB ou Bluetooth mantêm seus ativos digitais isolados de hackers.",
      ctaStart: "Explorar Ferramentas de Segurança",
      ctaBlog: "Ler Avaliações de Hardware",
      whatIsTitle: "O Que 'Air-Gapped' Realmente Significa?",
      whatIsBody:
        "Em segurança cibernética, um 'air gap' significa que um dispositivo está fisicamente isolado de qualquer rede. No contexto de cripto, uma carteira de hardware air-gapped nunca se conecta ao seu computador ou telefone via cabos USB, Bluetooth, WiFi ou NFC. Em vez disso, os dados são transferidos usando métodos verificáveis, como leitura de códigos QR via câmera embutida ou movendo fisicamente um cartão MicroSD. Esse isolamento físico torna o hackeamento remoto impossível.",
      sectionsHeader: "10 Coisas a Saber Sobre Carteiras Air-Gapped",
      sections: [
        {
          title: "1. Por Que USB e Bluetooth São Riscos",
          body: "Embora as carteiras modernas criptografem conexões USB e Bluetooth, usuários altamente paranoicos veem qualquer conexão com um dispositivo conectado à internet como um vetor potencial para malwares. O air-gapping remove esse vetor inteiramente.",
          toolName: "Verificar Segurança",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Como Funciona a Assinatura por Código QR",
          body: "Para enviar uma transação, sua carteira de software gera um código QR com os dados da transação. Você o escaneia com a câmera da sua carteira air-gapped. O dispositivo assina a transação offline e exibe um novo código QR, que o seu telefone escaneia para enviar à blockchain.",
        },
        {
          title: "3. ELLIPAL Titan 2.0: A Fortaleza de Metal",
          body: "A ELLIPAL Titan 2.0 é um dispositivo totalmente selado em metal que depende inteiramente de códigos QR. Não possui portas USB ou frequências de rádio e possui um mecanismo de autodestruição que apaga as chaves se for aberto à força.",
        },
        {
          title: "4. SafePal S1 Pro: Air-Gapping Acessível",
          body: "A SafePal S1 Pro oferece um chip EAL6+ e comunicação pura por código QR por uma fração do custo dos concorrentes premium, tornando a segurança máxima acessível a todos.",
        },
        {
          title: "5. Keystone 3 Pro: Verificação de Código Aberto",
          body: "A Keystone preenche a lacuna entre segurança air-gapped e transparência de código aberto. Ela utiliza três chips de segurança separados e depende puramente de códigos QR ou cartões MicroSD.",
        },
        {
          title: "6. Coldcard Q: A Campeã do MicroSD",
          body: "Projetada estritamente para Bitcoin, a Coldcard Q permite que os usuários destruam fisicamente seus componentes USB. Para assinar transações, salva-se o arquivo PSBT em um cartão MicroSD, insere-o na Coldcard, assina-o e devolve-se o cartão ao PC.",
        },
        {
          title: "7. O Dilema: Segurança vs. Atrito",
          body: "A segurança máxima vem com atrito máximo. Escanear vários códigos QR ou trocar cartões MicroSD entre dispositivos leva muito mais tempo do que simplesmente pressionar um botão via Bluetooth.",
        },
        {
          title: "8. Proteção Contra Baterias",
          body: "Alguns puristas evitam até baterias. Dispositivos como a Coldcard podem ser alimentados através de um cabo USB 'apenas de energia' (com os pinos de dados fisicamente removidos), garantindo vazamento zero de dados.",
        },
        {
          title: "9. Atualizações de Firmware",
          body: "Atualizar uma carteira air-gapped requer a transferência do arquivo de firmware criptografado para um cartão MicroSD através do seu computador, que é inserido na carteira para instalação.",
        },
        {
          title: "10. Quem Realmente Precisa de Uma?",
          body: "Se você negocia NFTs diariamente ou usa DeFi constantemente, uma carteira air-gapped será frustrante. No entanto, se você é uma 'baleia' segurando grande riqueza ou um HODLer de longo prazo, é a escolha mais inteligente.",
        },
      ],
      summaryTitle: "O Cofre Definitivo",
      summaryBody:
        "Uma carteira air-gapped representa o auge da segurança digital. Ao cortar fisicamente todas as conexões com a internet, você reduz sua superfície de ataque a zero.",
      faqTitle: "Perguntas Frequentes",
      faqs: [
        {
          question: "Uma carteira air-gapped pode ser hackeada?",
          answer:
            "Remotamente? Não. É fisicamente impossível hackear um dispositivo pela internet se ele não se conecta a ela. A única ameaça é o roubo físico.",
        },
        {
          question: "O que acontece se a câmera quebrar?",
          answer:
            "Você não poderá assinar transações, mas seus fundos estão seguros. Basta inserir sua frase semente (seed phrase) de 12 ou 24 palavras em um novo dispositivo de hardware.",
        },
        {
          question: "Elas são compatíveis com a MetaMask?",
          answer:
            "Algumas sim. Dispositivos como a Keystone 3 Pro possuem integração nativa por código QR com a MetaMask, permitindo usar DeFi com segurança.",
        },
      ],
      ctaSectionTitle: "Avalie a Segurança da Sua Carteira",
      ctaSectionDesc:
        "Independentemente do dispositivo, use nossas ferramentas gratuitas para verificar contratos inteligentes.",
    },
    es: {
      title:
        "Las Mejores Billeteras Cripto Air-Gapped para Máxima Seguridad en 2026",
      intro:
        "Para los inversores que se niegan a comprometer la seguridad, las billeteras air-gapped son la defensa definitiva. Descubre cómo los dispositivos sin conexiones USB o Bluetooth aíslan tus activos de los hackers.",
      ctaStart: "Explorar Herramientas",
      ctaBlog: "Leer Reseñas de Hardware",
      whatIsTitle: "¿Qué Significa Realmente 'Air-Gapped'?",
      whatIsBody:
        "En ciberseguridad, un 'air gap' significa que un dispositivo está físicamente aislado de cualquier red no segura. En el mundo cripto, una billetera de hardware air-gapped nunca se conecta a tu PC o teléfono a través de cables USB, Bluetooth, WiFi o NFC. En cambio, los datos se transfieren utilizando métodos verificables como escanear códigos QR con una cámara integrada o moviendo físicamente una tarjeta MicroSD. Este aislamiento físico hace que el hackeo remoto sea imposible.",
      sectionsHeader:
        "10 Cosas que Debes Saber Sobre las Billeteras Air-Gapped",
      sections: [
        {
          title: "1. Por Qué el USB y el Bluetooth Son Riesgos",
          body: "Aunque las billeteras modernas encriptan el USB y Bluetooth, los usuarios paranoicos ven cualquier conexión a un dispositivo con internet como un vector potencial para malware. El air-gapping elimina este vector por completo.",
          toolName: "Verificar Seguridad",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Cómo Funciona la Firma con Código QR",
          body: "Para enviar una transacción, tu billetera de software genera un código QR con los datos. Lo escaneas con la cámara de tu billetera air-gapped. El dispositivo firma la transacción fuera de línea y muestra un nuevo código QR, que tu teléfono escanea para transmitirlo a la blockchain.",
        },
        {
          title: "3. ELLIPAL Titan 2.0: La Fortaleza de Metal",
          body: "Es un dispositivo pesado, sellado completamente en metal, que depende enteramente de códigos QR. No tiene puertos USB e incluye un mecanismo de autodestrucción que borra las llaves privadas si intentan abrir la carcasa.",
        },
        {
          title: "4. SafePal S1 Pro: Air-Gapping Económico",
          body: "La seguridad air-gapped no es solo para millonarios. El SafePal S1 Pro ofrece un chip EAL6+ y comunicación pura por código QR a una fracción del costo de sus competidores premium.",
        },
        {
          title: "5. Keystone 3 Pro: Verificación de Código Abierto",
          body: "Keystone une la seguridad air-gapped con la transparencia del código abierto. Utiliza tres chips de seguridad separados y depende de códigos QR o MicroSD, ideal para usuarios avanzados de DeFi.",
        },
        {
          title: "6. Coldcard Q: El Campeón del MicroSD",
          body: "Diseñado estrictamente para Bitcoin, permite a los usuarios destruir físicamente sus capacidades USB. Para firmar, el usuario guarda la transacción en una MicroSD, la inserta en la Coldcard, la firma y la devuelve a la PC.",
        },
        {
          title: "7. El Dilema: Seguridad vs. Fricción",
          body: "La seguridad máxima conlleva máxima fricción. Escanear múltiples códigos QR o intercambiar tarjetas MicroSD toma mucho más tiempo que presionar un botón en una billetera con Bluetooth.",
        },
        {
          title: "8. Protección Contra Baterías",
          body: "Algunos puristas evitan las baterías. Dispositivos como la Coldcard pueden encenderse enchufados a la pared usando un cable USB 'solo para energía' (sin pines de transferencia de datos), garantizando cero fugas.",
        },
        {
          title: "9. Actualizaciones de Firmware",
          body: "Actualizar una billetera air-gapped requiere transferir el archivo encriptado a una tarjeta MicroSD desde la PC, e insertarla en la billetera. La billetera verifica criptográficamente la firma antes de instalar.",
        },
        {
          title: "10. ¿Quién las Necesita Realmente?",
          body: "Si haces trading DeFi a diario, una billetera air-gapped será frustrante. Pero si eres una 'ballena', un tesoro corporativo o un HODLer a largo plazo, es la elección más inteligente.",
        },
      ],
      summaryTitle: "La Bóveda Definitiva",
      summaryBody:
        "Una billetera air-gapped representa el pináculo de la seguridad digital. Al cortar físicamente todas las conexiones a internet, reduces tu superficie de ataque a cero.",
      faqTitle: "Preguntas Frecuentes",
      faqs: [
        {
          question: "¿Se puede hackear una billetera air-gapped?",
          answer:
            "¿De forma remota? No. Es físicamente imposible hackear un dispositivo si no puede conectarse a internet. La única amenaza es el robo físico.",
        },
        {
          question: "¿Qué pasa si se rompe la cámara?",
          answer:
            "No podrás escanear transacciones. Sin embargo, tus fondos están a salvo. Simplemente recuperas tu billetera ingresando tu frase semilla en un nuevo dispositivo.",
        },
        {
          question: "¿Son compatibles con MetaMask?",
          answer:
            "Algunas sí. Dispositivos como el Keystone 3 Pro tienen integración nativa por código QR con MetaMask.",
        },
      ],
      ctaSectionTitle: "Evalúa la Seguridad de tu Billetera",
      ctaSectionDesc:
        "Usa nuestras herramientas gratuitas para verificar los contratos inteligentes antes de transaccionar.",
    },
    fr: {
      title:
        "Les Meilleurs Portefeuilles Crypto Air-Gapped pour une Sécurité Maximale en 2026",
      intro:
        "Pour les investisseurs refusant tout compromis sur la sécurité, les portefeuilles air-gapped sont la défense ultime. Découvrez comment l'absence d'USB et de Bluetooth isole totalement vos actifs des hackers.",
      ctaStart: "Explorer les Outils de Sécurité",
      ctaBlog: "Lire les Tests",
      whatIsTitle: "Que Signifie Vraiment 'Air-Gapped' ?",
      whatIsBody:
        "En cybersécurité, un 'air gap' signifie qu'un appareil est physiquement isolé de tout réseau non sécurisé. Dans la crypto, un portefeuille matériel air-gapped ne se connecte jamais à votre PC ou téléphone via USB, Bluetooth, WiFi ou NFC. Les données sont transférées via des méthodes vérifiables comme le scan de codes QR via une caméra ou l'utilisation d'une carte MicroSD. Cette isolation physique rend le piratage à distance mathématiquement impossible.",
      sectionsHeader: "10 Choses à Savoir sur les Portefeuilles Air-Gapped",
      sections: [
        {
          title: "1. Pourquoi l'USB et le Bluetooth sont des Risques",
          body: "Bien que les connexions USB et Bluetooth soient cryptées, les utilisateurs paranoïaques considèrent toute connexion à un appareil connecté à Internet comme un vecteur de malware. L'air-gapping supprime totalement ce vecteur.",
          toolName: "Vérifier la Sécurité",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Comment Fonctionne la Signature par QR Code",
          body: "Pour envoyer une transaction, votre logiciel génère un QR code contenant les données. Vous le scannez avec la caméra du portefeuille air-gapped. L'appareil signe la transaction hors ligne et affiche un nouveau QR code, que votre téléphone scanne pour la diffuser sur la blockchain.",
        },
        {
          title: "3. ELLIPAL Titan 2.0 : La Forteresse en Métal",
          body: "L'ELLIPAL Titan 2.0 est un appareil scellé en métal qui repose entièrement sur les QR codes. Il n'a aucun port USB et intègre un mécanisme d'autodestruction qui efface les clés privées en cas d'effraction du boîtier.",
        },
        {
          title: "4. SafePal S1 Pro : L'Air-Gapping Abordable",
          body: "La sécurité air-gapped n'est pas réservée aux millionnaires. Le SafePal S1 Pro offre une puce EAL6+ et une communication par QR code pour une fraction du prix des concurrents premium.",
        },
        {
          title: "5. Keystone 3 Pro : Vérification Open-Source",
          body: "Keystone allie sécurité air-gapped et transparence open-source. Il utilise trois puces sécurisées et s'appuie sur des QR codes ou MicroSD, ce qui en fait un favori pour la DeFi.",
        },
        {
          title: "6. Coldcard Q : Le Champion de la MicroSD",
          body: "Conçu pour Bitcoin, le Coldcard Q permet de détruire physiquement ses ports USB. Pour signer, l'utilisateur sauvegarde la transaction sur une MicroSD, l'insère dans le Coldcard, la signe, et remet la carte dans le PC.",
        },
        {
          title: "7. Le Compromis : Sécurité vs. Friction",
          body: "Une sécurité maximale implique une friction maximale. Scanner plusieurs QR codes ou échanger des cartes MicroSD prend plus de temps que d'appuyer sur un bouton Bluetooth.",
        },
        {
          title: "8. Protection Contre les Batteries",
          body: "Certains puristes évitent même les batteries. Des appareils comme le Coldcard peuvent être alimentés sur secteur via un câble USB 'power-only' (sans broches de données), garantissant aucune fuite de données.",
        },
        {
          title: "9. Mises à Jour du Firmware",
          body: "Mettre à jour un portefeuille air-gapped nécessite de transférer le fichier crypté sur une carte MicroSD via votre PC, puis de l'insérer dans l'appareil. Le portefeuille vérifie la signature avant d'installer.",
        },
        {
          title: "10. Qui en a Vraiment Besoin ?",
          body: "Si vous faites du trading DeFi quotidien, un portefeuille air-gapped sera frustrant. Mais si vous êtes une 'baleine', une trésorerie d'entreprise ou un HODLer long terme, c'est le choix le plus intelligent.",
        },
      ],
      summaryTitle: "Le Coffre-Fort Ultime",
      summaryBody:
        "Un portefeuille air-gapped représente le summum de la sécurité numérique personnelle. En coupant physiquement toutes les connexions, vous réduisez votre surface d'attaque à zéro.",
      faqTitle: "Questions Fréquentes",
      faqs: [
        {
          question: "Un portefeuille air-gapped peut-il être piraté ?",
          answer:
            "À distance ? Non. Il est physiquement impossible de pirater un appareil via Internet s'il ne s'y connecte jamais. La seule menace est le vol physique (s'ils connaissent votre PIN).",
        },
        {
          question: "Que se passe-t-il si la caméra se casse ?",
          answer:
            "Vous ne pourrez pas scanner de transactions. Cependant, vos fonds sont en sécurité. Il suffit de récupérer votre portefeuille en entrant votre phrase seed dans un nouvel appareil.",
        },
        {
          question: "Sont-ils compatibles avec MetaMask ?",
          answer:
            "Certains oui. Le Keystone 3 Pro intègre nativement les QR codes avec MetaMask.",
        },
      ],
      ctaSectionTitle: "Évaluez la Sécurité de votre Portefeuille",
      ctaSectionDesc:
        "Utilisez nos outils gratuits pour vérifier les contrats intelligents avant de transiger.",
    },
    de: {
      title:
        "Die besten Air-Gapped Krypto-Wallets für maximale Sicherheit 2026",
      intro:
        "Für Anleger, die bei der Sicherheit keine Kompromisse eingehen, sind Air-Gapped-Wallets die ultimative Verteidigung. Entdecken Sie, wie Geräte ohne USB- oder Bluetooth-Verbindung Ihre digitalen Assets komplett von Hackern isolieren.",
      ctaStart: "Sicherheits-Tools",
      ctaBlog: "Hardware-Tests lesen",
      whatIsTitle: "Was bedeutet 'Air-Gapped' wirklich?",
      whatIsBody:
        "In der Cybersicherheit bedeutet ein 'Air Gap', dass ein Gerät physisch von jedem ungesicherten Netzwerk isoliert ist. Ein Air-Gapped Hardware-Wallet verbindet sich niemals per USB, Bluetooth, WiFi oder NFC mit Ihrem PC oder Telefon. Stattdessen werden Daten über überprüfbare Methoden wie QR-Codes (via Kamera) oder MicroSD-Karten übertragen. Diese physische Isolation macht Remote-Hacks unmöglich.",
      sectionsHeader: "10 Dinge über Air-Gapped Wallets",
      sections: [
        {
          title: "1. Warum USB und Bluetooth Risiken sind",
          body: "Obwohl moderne Wallets USB- und Bluetooth-Verbindungen verschlüsseln, sehen extrem sicherheitsbewusste Nutzer jede Verbindung zu einem internetfähigen Gerät als potenziellen Malware-Vektor. Air-Gapping beseitigt diesen Vektor komplett.",
          toolName: "Wallet-Sicherheit prüfen",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Wie QR-Code-Signierung funktioniert",
          body: "Für eine Transaktion generiert Ihr Software-Wallet einen QR-Code mit den Daten. Sie scannen diesen mit der Kamera Ihres Air-Gapped-Wallets. Das Gerät signiert die Transaktion offline und zeigt einen neuen QR-Code an, den Ihr Telefon scannt, um ihn auf der Blockchain zu veröffentlichen.",
        },
        {
          title: "3. ELLIPAL Titan 2.0: Die Metallfestung",
          body: "Das ELLIPAL Titan 2.0 ist ein komplett versiegeltes Metallgerät, das ausschließlich auf QR-Codes angewiesen ist. Es hat keine USB-Anschlüsse und besitzt einen Selbstzerstörungsmechanismus, der die privaten Schlüssel löscht, wenn das Gehäuse aufgebrochen wird.",
        },
        {
          title: "4. SafePal S1 Pro: Budget Air-Gapping",
          body: "Das SafePal S1 Pro bietet einen EAL6+ Sicherheitschip und reine QR-Code-Kommunikation zu einem Bruchteil der Kosten der Premium-Konkurrenten. So wird maximale Sicherheit für alle zugänglich.",
        },
        {
          title: "5. Keystone 3 Pro: Open-Source-Transparenz",
          body: "Keystone verbindet Air-Gapped-Sicherheit mit Open-Source-Transparenz. Es nutzt drei verschiedene Sicherheitschips und verlässt sich nur auf QR-Codes oder MicroSD-Karten.",
        },
        {
          title: "6. Coldcard Q: Der MicroSD-Champion",
          body: "Speziell für Bitcoin entwickelt, erlaubt die Coldcard Q den Nutzern, USB physisch zu zerstören. Zur Signierung wird die Transaktion auf einer MicroSD-Karte gespeichert, in die Coldcard gesteckt, signiert und zurück zum PC gebracht.",
        },
        {
          title: "7. Der UX-Kompromiss: Sicherheit vs. Komfort",
          body: "Maximale Sicherheit bedeutet maximalen Aufwand. Das Scannen von QR-Codes oder Tauschen von MicroSD-Karten dauert länger als der Knopfdruck auf einem Bluetooth-Wallet.",
        },
        {
          title: "8. Schutz vor Batterie-Problemen",
          body: "Einige Puristen vermeiden sogar Batterien. Geräte wie die Coldcard können mit einem speziellen USB-Kabel, dem die Datenübertragungs-Pins fehlen ('Power-Only'), direkt an der Steckdose betrieben werden, um Datenlecks auszuschließen.",
        },
        {
          title: "9. Firmware-Updates bei Air-Gapped-Geräten",
          body: "Ein Update erfordert, dass die verschlüsselte Datei über den PC auf eine MicroSD-Karte übertragen und diese ins Wallet gesteckt wird. Das Wallet verifiziert die Signatur des Herstellers kryptografisch vor der Installation.",
        },
        {
          title: "10. Wer braucht so etwas wirklich?",
          body: "Wenn Sie täglich DeFi nutzen, ist ein Air-Gapped-Wallet frustrierend. Wenn Sie jedoch große Summen verwalten, eine Firmenkasse leiten oder ein langfristiger HODLer sind, ist es die intelligenteste Wahl.",
        },
      ],
      summaryTitle: "Der ultimative Tresor",
      summaryBody:
        "Ein Air-Gapped-Wallet repräsentiert den Höhepunkt der digitalen Sicherheit. Indem Sie alle Verbindungen zum Internet physisch kappen, reduzieren Sie Ihre Angriffsfläche auf null.",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Kann ein Air-Gapped-Wallet gehackt werden?",
          answer:
            "Remote? Nein. Es ist physisch unmöglich, ein Gerät über das Internet zu hacken, das nicht verbunden ist. Die einzige Bedrohung ist physischer Diebstahl (inkl. PIN).",
        },
        {
          question: "Was passiert, wenn die Kamera kaputt geht?",
          answer:
            "Sie können dann keine Transaktionen mehr scannen. Ihre Gelder sind aber sicher. Stellen Sie das Wallet einfach mit Ihrer Seed-Phrase auf einem neuen Gerät wieder her.",
        },
        {
          question: "Sind sie mit MetaMask kompatibel?",
          answer:
            "Einige schon. Das Keystone 3 Pro hat z.B. eine native QR-Code-Integration mit MetaMask.",
        },
      ],
      ctaSectionTitle: "Prüfen Sie Ihre Wallet-Sicherheit",
      ctaSectionDesc:
        "Egal ob Air-Gapped oder Standard-Wallet, nutzen Sie unsere kostenlosen Tools für sichere Smart Contracts.",
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
      canonical: `https://www.kryptonal.com/${locale}/learn/air-gapped-crypto-wallet`,
      languages: {
        en: "https://www.kryptonal.com/en/learn/air-gapped-crypto-wallet",
        tr: "https://www.kryptonal.com/tr/learn/air-gapped-crypto-wallet",
        pt: "https://www.kryptonal.com/pt/learn/air-gapped-crypto-wallet",
        es: "https://www.kryptonal.com/es/learn/air-gapped-crypto-wallet",
        fr: "https://www.kryptonal.com/fr/learn/air-gapped-crypto-wallet",
        de: "https://www.kryptonal.com/de/learn/air-gapped-crypto-wallet",
      },
    },
    openGraph: {
      title: t.title,
      description: t.intro.substring(0, 150),
      url: `https://www.kryptonal.com/${locale}/learn/air-gapped-crypto-wallet`,
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
export default async function AirGappedWalletPage({ params }: PageProps) {
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
              🛡️ Air-Gapped Security
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
