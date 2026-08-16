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
      title: "How to Secure Your Seed Phrase Offline: 2026 Guide",
      intro:
        "Your 12 or 24-word recovery phrase is the master key to your entire crypto portfolio. Discover the best offline storage strategies to protect your seed phrase against fire, water, theft, and digital hacking.",
      ctaStart: "Explore Security Tools",
      ctaBlog: "Read Security Guides",
      whatIsTitle: "The Golden Rule: Never Store a Seed Phrase Digitally",
      whatIsBody:
        "When you generate a new non-custodial wallet, you are provided with a 12 to 24-word recovery phrase (BIP39 standard). If anyone gains access to these words, they can instantly recreate your wallet on another device and steal your funds. Conversely, if you lose this phrase and your hardware device breaks, your funds are permanently lost. True self-custody requires keeping this master key completely offline—away from keyboards, cloud storage, cameras, and internet connections.",
      sectionsHeader: "10 Steps to Bulletproof Offline Seed Phrase Security",
      sections: [
        {
          title: "1. Never Type, Photo, or Cloud-Save Your Words",
          body: "The single biggest vulnerability is digitizing your phrase. Never type it on a computer keyboard, store it in password managers, take a screenshot, or email it to yourself. Malware and keyloggers can read digital text and images instantaneously.",
          toolName: "Check Wallet Security",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Upgrade from Paper to Stainless Steel or Titanium",
          body: "Paper recovery sheets provided with hardware wallets burn in fires, decay in humidity, and tear easily. Metal storage plates (like Cryptosteel, Billfodl, or Cryptotag) withstand extreme house fires (up to 1,500°C / 2,700°F), floods, and physical crushing.",
        },
        {
          title: "3. Understand the BIP39 '4-Letter Rule'",
          body: "Under the universal BIP39 standard, the first four letters of each word are completely unique. Even if a word is 'bitcoin' or 'abandon', recording only 'bitc' or 'aban' is 100% sufficient to uniquely identify and recover your wallet.",
        },
        {
          title: "4. Implement Geographic Redundancy (2 Copies, 2 Locations)",
          body: "Relying on a single backup copy creates a single point of failure. Store your primary metal backup in a bolted home safe, and a secondary copy in a separate geographic location, such as a secure bank safety deposit box or a trusted family member's safe.",
        },
        {
          title: "5. Use Tamper-Evident Envelopes and Seals",
          body: "Place your metal backup plate inside a sealed, numbered tamper-evident bag before hiding it. This ensures that if someone (like a houseguest or landlord) discovers your backup, you will immediately know it has been compromised during your periodic audits.",
        },
        {
          title: "6. Add a BIP39 Passphrase (The '25th Word')",
          body: "Modern hardware wallets allow you to append an optional custom passphrase (a 25th word stored only in your memory or a separate location). If a thief finds your physical 24-word backup plate, they still cannot access your funds without this passphrase.",
        },
        {
          title: "7. Consider Shamir's Secret Sharing (SLIP39)",
          body: "Supported by wallets like Trezor, Shamir's Secret Sharing splits your seed phrase into multiple cryptographic shares (e.g., a 2-of-3 setup). You need any 2 shares to recover your wallet, ensuring that losing a single share does not compromise your assets.",
        },
        {
          title: "8. Beware of Environmental Audio and Visual Spying",
          body: "When setting up your hardware wallet and writing down your words, ensure you are in a room with no smart speakers (Alexa, Siri), webcams, security cameras, or smartphones facing your recovery card.",
        },
        {
          title: "9. Perform Annual Physical Security Audits",
          body: "Set a calendar reminder once or twice a year to physically inspect your backup locations. Check that metal plates remain legible, tamper seals are intact, and offsite storage locations remain accessible.",
        },
        {
          title: "10. Create an Off-Grid Inheritance Plan",
          body: "If something happens to you, your family must be able to recover your assets without exposing the phrase to third parties. Leave clear, written physical instructions detailing where backups are stored and how to execute a standard wallet recovery.",
        },
      ],
      summaryTitle: "Summary & Best Practices",
      summaryBody:
        "The ultimate setup consists of an engraved stainless steel plate stored in a fireproof home safe, a secondary copy in an offsite location, and an optional 25th-word passphrase for physical theft protection.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          question:
            "Can I laminate paper recovery cards to make them waterproof?",
          answer:
            "While lamination protects against water, laminate plastic melts and burns rapidly in a fire, making the paper unreadable. Metal plates remain superior.",
        },
        {
          question: "What happens if someone steals my 24-word metal plate?",
          answer:
            "If you do not have a 25th-word passphrase enabled, a thief with your 24 words can instantly steal all your funds. If you have a passphrase enabled, your funds remain safe as long as they don't know that passphrase.",
        },
        {
          question: "Is it safe to store my seed phrase in a bank deposit box?",
          answer:
            "Yes, as a secondary backup location. Bank deposit boxes offer strong physical and fire protection, though you should pair it with a home backup so you aren't locked out during bank holidays or branch closures.",
        },
      ],
      ctaSectionTitle: "Audit Your Wallet Setup Today",
      ctaSectionDesc:
        "Proper offline backup is the foundation of self-custody. Use our suite of risk-checking tools to ensure your wallet interactions remain secure.",
    },
    tr: {
      title:
        "Kurtarma İfadesi (Seed Phrase) Çevrimdışı Nasıl Saklanır: 2026 Rehberi",
      intro:
        "12 veya 24 kelimelik kurtarma ifadeniz tüm kripto portföyünüzün ana anahtarıdır. İfadenizi yangın, su, hırsızlık ve dijital saldırılara karşı korumak için en iyi çevrimdışı saklama stratejilerini keşfedin.",
      ctaStart: "Güvenlik Araçlarını Keşfet",
      ctaBlog: "Güvenlik Rehberlerini Oku",
      whatIsTitle:
        "Altın Kural: Kurtarma İfadesini Asla Dijital Ortamda Saklamayın",
      whatIsBody:
        "Gözetimsiz bir cüzdan oluşturduğunuzda size 12 ila 24 kelimelik bir kurtarma ifadesi (BIP39 standardı) verilir. Birisi bu kelimelere erişirse cüzdanınızı başka bir cihazda anında kopyalayabilir. İfadenizi kaybeder ve cihazınız bozulursa fonlarınız sonsuza dek kaybolur. Tam erişim kontrolü için bu anahtar cümleyi klavyelerden, bulut depolamadan ve kameralardan tamamen uzak tutmalısınız.",
      sectionsHeader: "Çevrimdışı Kurtarma İfadesi Güvenliği İçin 10 Adım",
      sections: [
        {
          title: "1. Kelimelerinizi Asla Klavyeyle Yazmayın, Fotoğraflamayın",
          body: "En büyük güvenlik açığı veriyi dijitalleştirmektir. Asla bilgisayar klavyesinde yazmayın, şifre yöneticilerine kaydetmeyin veya fotoğrafını çekmeyin. Kötü amaçlı yazılımlar dijital metinleri ve görselleri anında okuyabilir.",
          toolName: "Cüzdan Güvenliğini Kontrol Et",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Kağıttan Paslanmaz Çelik veya Titanyuma Geçin",
          body: "Kağıt kartlar yangında yanar ve nemden çürür. Metal depolama plakaları (Cryptosteel, Billfodl vb.) 1.500°C'ye kadar yüksek ev yangınlarına, su baskınlarına ve fiziksel darbelere dayanır.",
        },
        {
          title: "3. BIP39 'İlk 4 Harf' Kuralını Anlayın",
          body: "Evrensel BIP39 standardına göre, listedeki her kelimenin ilk dört harfi benzersizdir. Her kelimenin sadece ilk 4 harfini kaydetmek, cüzdanınızı tam olarak geri yüklemek için %100 yeterlidir.",
        },
        {
          title: "4. Coğrafi Yedeklilik Uygulayın (2 Kopya, 2 Konum)",
          body: "Tek bir yedek kopyaya güvenmek risk yaratır. Ana metal yedeğinizi evinizdeki kasada, ikincil kopyayı ise farklı bir coğrafi konumda (örneğin kiralık kasa veya güvenilir bir aile ferdi) saklayın.",
        },
        {
          title: "5. Mühürlü ve Kurcalamaya Karşı Korumalı Zarflar Kullanın",
          body: "Metal yedeğinizi saklamadan önce numaralı, kurcalandığında iz bırakan mühürlü bir poşete koyun. Bu sayede yedeğinizin bilgisi dışında incelenip incelenmediğini periyodik kontrollerde anlarsınız.",
        },
        {
          title: "6. BIP39 Parolası (25. Kelime) Ekleyin",
          body: "Modern donanım cüzdanları, isteğe bağlı 25. bir kelime (parola) eklemenize izin verir. Biri 24 kelimelik metal plakanızı bulsa bile, zihninizde saklanan bu parolayı bilmeden fonlarınıza erişemez.",
        },
        {
          title: "7. Shamir'in Gizli Paylaşımı (SLIP39) Yönetimini İnceleyin",
          body: "Trezor gibi cüzdanlar tarafından desteklenen bu yöntem, kelimelerinizi birden fazla parçaya böler (örn. 3 parçadan 2'si). Cüzdanı kurtarmak için belirlediğiniz sayıda parçayı birleştirmeniz yeterlidir.",
        },
        {
          title: "8. Çevresel Ses ve Görsel Dinlemelere Dikkat Edin",
          body: "Kurulum sırasında odada akıllı hoparlörlerin (Siri, Alexa), web kameralarının veya telefon kameralarının kurtarma kartınıza bakmadığından emin olun.",
        },
        {
          title: "9. Yıllık Fiziksel Güvenlik Denetimleri Yapın",
          body: "Yılda bir veya iki kez yedekleme konumlarınızı fiziksel olarak kontrol edin. Plakaların okunabilirliğini ve mühürlerin sağlamlığını doğrulayın.",
        },
        {
          title: "10. Çevrimdışı Bir Miras Planı Oluşturun",
          body: "Başınıza bir şey gelirse ailenizin fonlara erişebilmesi için yedeklerin nerede durduğunu ve adımları açıklayan yazılı bir fiziksel kılavuz bırakın.",
        },
      ],
      summaryTitle: "Özet ve En İyi Uygulamalar",
      summaryBody:
        "En güvenli sistem; yangına dayanıklı kasada saklanan paslanmaz çelik plaka, farklı adreste ikincil kopya ve 25. kelime (passphrase) korumasının birleşiminden oluşur.",
      faqTitle: "Sıkça Sorulan Sorular",
      faqs: [
        {
          question: "Kağıt kartı lamine etmek (kaplamak) su geçirmez yapar mı?",
          answer:
            "Laminasyon suya karşı korusa da yangında plastik hızla erir ve kağıdı yakarak okunmaz hale getirir. Metal plakalar her zaman üstündür.",
        },
        {
          question: "Biri 24 kelimelik metal plakamı çalarsa ne olur?",
          answer:
            "25. kelime (passphrase) kullanmıyorsanız fonlarınızı anında çalabilir. Parola koruması aktifse, bu ek kelimeyi bilmeden paranıza ulaşamazlar.",
        },
        {
          question: "Kurtarma ifadesini banka kasasında saklamak güvenli mi?",
          answer:
            "Evet, ikincil bir yedek konumu olarak oldukça güvenlidir. Ancak banka tatillerinde erişim kısıtlanabileceği için evde de bir yedek bulunmalıdır.",
        },
      ],
      ctaSectionTitle: "Cüzdan Güvenliğinizi Bugün Denetleyin",
      ctaSectionDesc:
        "Çevrimdışı yedekleme kendi gözetiminizin temelidir. Ücretsiz analiz araçlarımızla işlemlerinizi güvende tutun.",
    },
    pt: {
      title: "Como Proteger sua Seed Phrase Offline: Guia 2026",
      intro:
        "Sua frase de recuperação de 12 ou 24 palavras é a chave mestra de toda a sua carteira cripto. Descubra as melhores estratégias de armazenamento offline contra incêndios, água, roubo e ataques digitais.",
      ctaStart: "Explorar Ferramentas",
      ctaBlog: "Ler Guias de Segurança",
      whatIsTitle:
        "A Regra de Ouro: Nunca Armazene sua Seed Phrase Digitalmente",
      whatIsBody:
        "Ao criar uma carteira não-custodial, você recebe uma frase de recuperação (padrão BIP39). Se alguém tiver acesso a essas palavras, poderá recriar sua carteira em outro dispositivo e roubar seus fundos. Mantenha essa chave mestra totalmente offline — longe de teclados, nuvem, câmeras e conexões com a internet.",
      sectionsHeader: "10 Passos para Proteção Offline da Seed Phrase",
      sections: [
        {
          title: "1. Nunca Digite, Tire Foto ou Salve na Nuvem",
          body: "A maior vulnerabilidade é digitalizar suas palavras. Nunca as digite no computador, não salve em gerenciadores de senha nem tire capturas de tela. Malwares conseguem ler textos e imagens instantaneamente.",
          toolName: "Verificar Segurança",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Evolua do Papel para Placas de Aço Inoxidável ou Titânio",
          body: "Papel queima em incêndios e estraga com umidade. Placas de metal (como Cryptosteel ou Billfodl) suportam incêndios graves (até 1.500°C), inundações e danos físicos.",
        },
        {
          title: "3. Entenda a Regra das '4 Primeiras Letras' do BIP39",
          body: "No padrão BIP39, as quatro primeiras letras de cada palavra da lista são únicas. Registrar apenas as 4 primeiras letras é 100% suficiente para identificar e recuperar sua carteira.",
        },
        {
          title: "4. Aplique Redundância Geográfica (2 Cópias, 2 Locais)",
          body: "Depender de uma única cópia gera um ponto único de falha. Guarde seu backup principal em um cofre em casa e uma cópia secundária em outro local seguro, como um cofre bancário.",
        },
        {
          title: "5. Use Envelopes e Lacres Antiviolação",
          body: "Coloque sua placa de metal em um envelope com lacre numerado antes de esconder. Isso garante saber imediatamente se alguém visualizou seu backup em suas inspeções periódicas.",
        },
        {
          title: "6. Adicione uma Passphrase BIP39 (A '25ª Palavra')",
          body: "Carteiras modernas permitem criar uma palavra extra personalizada. Se um ladrão encontrar sua placa de 24 palavras, ele não terá acesso aos fundos sem a senha mantida em sua memória.",
        },
        {
          title:
            "7. Considere o Compartilhamento de Segredos de Shamir (SLIP39)",
          body: "Suportado por carteiras como a Trezor, o método divide sua frase em várias partes (ex: esquema 2 de 3). Você precisa de um número mínimo de partes para restaurar o acesso.",
        },
        {
          title: "8. Cuidado com Câmeras e Dispositivos Inteligentes",
          body: "Ao anotar suas palavras na configuração, certifique-se de estar em um ambiente sem assistentes virtuais (Alexa, Siri), webcams ou celulares apontados para o papel.",
        },
        {
          title: "9. Faça Auditorias Físicas Anuais",
          body: "Defina um lembrete no calendário uma ou duas vezes por ano para inspecionar seus backups físicos, verificando a legibilidade e a integridade dos lacres.",
        },
        {
          title: "10. Crie um Plano de Herança Offline",
          body: "Deixe instruções físicas claras e por escrito detalhando onde os backups estão e como realizar a recuperação caso algo aconteça com você.",
        },
      ],
      summaryTitle: "Resumo e Melhores Práticas",
      summaryBody:
        "O sistema mais seguro junta uma placa de aço em cofre à prova de fogo, uma cópia secundária em outro endereço e uma passphrase extra de proteção.",
      faqTitle: "Perguntas Frequentes",
      faqs: [
        {
          question: "Plastificar o papel protege contra água e fogo?",
          answer:
            "Protege contra água, mas o plástico derrete e queima rapidamente no fogo, destruindo o papel. Placas de metal são infinitamente superiores.",
        },
        {
          question: "O que acontece se roubarem minha placa de 24 palavras?",
          answer:
            "Sem uma passphrase (25ª palavra) ativa, o ladrão roubará seus fundos. Se a passphrase estiver ativa, seus ativos continuam seguros.",
        },
        {
          question: "É seguro guardar a seed phrase em um cofre de banco?",
          answer:
            "Sim, como local secundário. Cofres bancários oferecem alta segurança física, embora você deva ter uma cópia em casa para emergências.",
        },
      ],
      ctaSectionTitle: "Audite sua Segurança Hoje",
      ctaSectionDesc:
        "O backup offline é a base da autocustódia. Use nossas ferramentas gratuitas para interagir com segurança.",
    },
    es: {
      title: "Cómo Guardar tu Frase Semilla Offline: Guía 2026",
      intro:
        "Tu frase de recuperación de 12 o 24 palabras es la llave maestra de tu billetera cripto. Descubre las mejores estrategias de almacenamiento fuera de línea contra incendios, agua, robos y ataques digitales.",
      ctaStart: "Explorar Herramientas",
      ctaBlog: "Leer Guías de Seguridad",
      whatIsTitle:
        "La Regla de Oro: Nunca Guardes tu Frase Semilla Digitalmente",
      whatIsBody:
        "Al crear una billetera no custodial, se genera una frase de recuperación (estándar BIP39). Si alguien accede a estas palabras, puede clonar tu billetera y robar tus fondos. Mantén esta clave maestra totalmente fuera de línea: lejos de teclados, la nube, fotos y conexiones a internet.",
      sectionsHeader: "10 Pasos para Proteger tu Frase Semilla Offline",
      sections: [
        {
          title: "1. Nunca Escribas, Fotografíes ni Guardes en la Nube",
          body: "Digitalizar tus palabras es el mayor peligro. Nunca las tipees en un teclado, no las guardes en gestores de contraseñas ni tomes capturas de pantalla. El malware puede leer imágenes y texto al instante.",
          toolName: "Verificar Seguridad",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Pasa del Papel a Placas de Acero Inoxidable o Titanio",
          body: "El papel se destruye en incendios y se degrada con la humedad. Las placas de metal (como Cryptosteel o Billfodl) soportan incendios severos (hasta 1,500°C), inundaciones y aplastamientos.",
        },
        {
          title: "3. Entiende la Regla de las '4 Primeras Letras' BIP39",
          body: "En el estándar BIP39, las primeras cuatro letras de cada palabra son únicas. Guardar únicamente las 4 primeras letras es 100% suficiente para identificar y recuperar tu billetera.",
        },
        {
          title: "4. Aplica Redundancia Geográfica (2 Copias, 2 Ubicaciones)",
          body: "Tener una sola copia crea un punto único de falla. Guarda tu respaldo principal en una caja fuerte en casa y una copia secundaria en otra ubicación segura (como una caja de seguridad bancaria).",
        },
        {
          title: "5. Usa Sobres y Sellos de Seguridad Antimanipulación",
          body: "Guarda tu placa de metal en una bolsa con sello numerado antimanipulación. Así sabrás de inmediato si alguien ha intentado ver tu respaldo durante tus revisiones periódicas.",
        },
        {
          title: "6. Añade una Passphrase BIP39 (La 'Palabra 25')",
          body: "Las billeteras modernas permiten añadir una palabra clave personalizada. Si un ladrón encuentra tu placa de 24 palabras, no podrá acceder a tus fondos sin esta contraseña clave.",
        },
        {
          title: "7. Considera el Esquema de Shamir (SLIP39)",
          body: "Soportado por billeteras como Trezor, el Esquema de Shamir divide tu frase en varias partes (ej. esquema 2 de 3). Requieres un número mínimo de partes para restaurar tu billetera.",
        },
        {
          title: "8. Cuidado con Asistentes de Voz y Cámaras",
          body: "Al anotar tus palabras durante la configuración, asegúrate de estar en una habitación sin altavoces inteligentes (Alexa, Siri) ni cámaras apuntando a tu tarjeta.",
        },
        {
          title: "9. Realiza Auditorías Físicas Anuales",
          body: "Programa un recordatorio una o dos veces al año para inspeccionar físicamente tus respaldos, comprobando la legibilidad de las placas y el estado de los sellos.",
        },
        {
          title: "10. Diseña un Plan de Herencia Offline",
          body: "Deja instrucciones escritas claras que expliquen dónde están los respaldos y cómo realizar la recuperación en caso de que te ocurra algo.",
        },
      ],
      summaryTitle: "Resumen y Mejores Prácticas",
      summaryBody:
        "La combinación más segura es una placa de acero en caja fuerte ignífuga, una copia secundaria en otra dirección y una passphrase adicional de protección.",
      faqTitle: "Preguntas Frecuentes",
      faqs: [
        {
          question: "¿Plastificar la tarjeta de papel la protege del fuego?",
          answer:
            "Lo protege del agua, pero el plástico se derrite y arde rápidamente en un incendio, destruyendo el papel. Las placas de metal son muy superiores.",
        },
        {
          question: "¿Qué pasa si roban mi placa de 24 palabras?",
          answer:
            "Si no usas una passphrase (palabra 25), podrán robar tus fondos. Si la tienes activada, tus activos seguirán protegidos.",
        },
        {
          question:
            "¿Es seguro guardar la frase semilla en una caja fuerte bancaria?",
          answer:
            "Sí, como segunda ubicación de respaldo es excelente. Asegúrate de tener la primera copia en casa para no depender exclusivamente del horario bancario.",
        },
      ],
      ctaSectionTitle: "Audita tu Seguridad Hoy",
      ctaSectionDesc:
        "El respaldo offline es la base de la autocustodia. Usa nuestras herramientas gratuitas para operar con seguridad.",
    },
    fr: {
      title: "Protéger sa Phrase de Récupération Hors Ligne : Guide 2026",
      intro:
        "Votre phrase de récupération de 12 ou 24 mots est la clé maîtresse de tout votre portefeuille crypto. Découvrez les meilleures stratégies de stockage hors ligne contre le feu, l'eau, le vol et le piratage.",
      ctaStart: "Explorer les Outils",
      ctaBlog: "Lire les Guides de Sécurité",
      whatIsTitle:
        "La Règle d'Or : Ne Jamais Stocker sa Phrase Seed Numériquement",
      whatIsBody:
        "Lors de la création d'un portefeuille non-custodial, vous recevez une phrase de récupération (norme BIP39). Si quelqu'un accède à ces mots, il peut recréer votre portefeuille et voler vos fonds. Conservez cette clé hors ligne : loin des claviers, du cloud, des photos et d'Internet.",
      sectionsHeader: "10 Étapes pour Sécuriser sa Phrase Seed Hors Ligne",
      sections: [
        {
          title:
            "1. Ne Jamais Taper, Photographier ou Sauvegarder sur le Cloud",
          body: "La plus grande vulnérabilité est la numérisation. Ne tapez jamais vos mots sur un clavier, ne les enregistrez pas dans un gestionnaire de mots de passe et ne prenez pas de capture d'écran.",
          toolName: "Vérifier la Sécurité",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Passer du Papier à l'Acier Inoxydable ou au Titane",
          body: "Le papier brûle et se dégrade. Les plaques métalliques (Cryptosteel, Billfodl) résistent aux incendies majeurs (jusqu'à 1 500 °C), aux inondations et aux écrasements physiques.",
        },
        {
          title: "3. Comprendre la Règle des '4 Premières Lettres' du BIP39",
          body: "Dans la liste BIP39, les quatre premières lettres de chaque mot sont uniques. Enregistrer uniquement les 4 premières lettres suffit à 100 % pour identifier et restaurer votre portefeuille.",
        },
        {
          title: "4. Appliquer la Redondance Géographique (2 Copies, 2 Lieux)",
          body: "Conserver une seule copie crée un point de défaillance unique. Stockez votre plaque principale dans un coffre chez vous et une seconde copie dans un autre lieu sécurisé (ex. coffre bancaire).",
        },
        {
          title: "5. Utiliser des Enveloppes et Scellés Anti-Altération",
          body: "Placez votre plaque dans une enveloppe scellée numérotée. Cela vous permettra de savoir immédiatement si quelqu'un a consulté votre sauvegarde lors de vos vérifications.",
        },
        {
          title: "6. Ajouter une Passphrase BIP39 (Le '25ème Mot')",
          body: "Les portefeuilles modernes permettent d'ajouter un mot de passe personnalisé. Si un voleur trouve votre plaque de 24 mots, il ne pourra pas accéder à vos fonds sans ce mot de passe secret.",
        },
        {
          title: "7. Utiliser le Partage de Secret de Shamir (SLIP39)",
          body: "Inclus sur des appareils comme Trezor, ce système divise votre phrase en plusieurs fragments (ex. 2 sur 3). Il faut réunir le nombre requis de fragments pour restaurer le portefeuille.",
        },
        {
          title: "8. Attention aux Caméras et Enceintes Connectées",
          body: "Pendant la configuration, assurez-vous d'être dans une pièce sans enceintes intelligentes (Alexa, Siri), webcams ou téléphones orientés vers votre carte.",
        },
        {
          title: "9. Effectuer des Audits Physiques Annuels",
          body: "Programmez un rappel une à deux fois par an pour vérifier l'état lisible de vos plaques et l'intégrité des scellés de sécurité.",
        },
        {
          title: "10. Préparer un Plan de Succession Hors Ligne",
          body: "Laissez des instructions écrites claires expliquant où se trouvent les sauvegardes et la marche à suivre pour restaurer le portefeuille en cas d'imprévu.",
        },
      ],
      summaryTitle: "Résumé & Bonnes Pratiques",
      summaryBody:
        "La meilleure configuration associe une plaque en acier dans un coffre ignifugé, un double dans un second lieu et une passphrase (25ème mot) pour parer au vol physique.",
      faqTitle: "Questions Fréquentes",
      faqs: [
        {
          question: "Plastifier la carte en papier la protège-t-elle du feu ?",
          answer:
            "Cela la protège de l'eau, mais le plastique fond et brûle très vite en cas d'incendie, détruisant le papier. Les plaques en métal sont indispensables.",
        },
        {
          question: "Que se passe-t-il si on me vole ma plaque de 24 mots ?",
          answer:
            "Sans passphrase (25ème mot), le voleur aura accès à vos fonds. Si la passphrase est activée, vos actifs restent en sécurité.",
        },
        {
          question:
            "Est-ce sûr de stocker sa phrase seed dans un coffre de banque ?",
          answer:
            "Oui, comme seconde adresse de sauvegarde. Cela offre une protection physique élevée, à condition de conserver un premier double accessible chez soi.",
        },
      ],
      ctaSectionTitle: "Auditez Votre Sécurité Aujourd'hui",
      ctaSectionDesc:
        "La sauvegarde hors ligne est le pilier de l'auto-conservation. Utilisez nos outils gratuits pour vérifier vos smart contracts.",
    },
    de: {
      title: "Seed-Phrase sicher offline aufbewahren: Guide 2026",
      intro:
        "Ihre 12- oder 24-Wort-Wiederherstellungphrase ist der Hauptschlüssel zu Ihrem Krypto-Vermögen. Entdecken Sie die besten Offline-Methoden zum Schutz vor Feuer, Wasser, Diebstahl und Hacks.",
      ctaStart: "Sicherheits-Tools",
      ctaBlog: "Sicherheits-Guides lesen",
      whatIsTitle: "Goldene Regel: Seed-Phrase niemals digital speichern",
      whatIsBody:
        "Beim Erstellen eines Non-Custodial Wallets erhalten Sie eine Wiederherstellungsphrase (BIP39-Standard). Erlangt jemand Zugriff darauf, kann er Ihr Wallet auf einem anderen Gerät wiederherstellen und Ihre Coins stehlen. Bewahren Sie diesen Schlüssel komplett offline auf – fern von Tastaturen, Cloud-Speichern, Fotos und Internetverbindungen.",
      sectionsHeader: "10 Schritte für maximale Offline-Sicherheit",
      sections: [
        {
          title: "1. Niemals tippen, fotografieren oder in der Cloud speichern",
          body: "Die größte Schwachstelle ist die Digitalisierung. Tippen Sie die Wörter nie auf einer Computertastatur ein, speichern Sie sie nicht in Passwort-Managern und machen Sie keine Screenshots. Malware kann Texte und Bilder sofort auslesen.",
          toolName: "Wallet-Sicherheit prüfen",
          toolUrl: "/tools/wallet-security",
        },
        {
          title: "2. Von Papier zu Edelstahl- oder Titanplatten wechseln",
          body: "Papier verbrennt bei Feuern und verrottet bei Feuchtigkeit. Metallplatten (wie Cryptosteel oder Billfodl) halten extremen Hausbränden (bis 1.500 °C), Überschwemmungen und physischen Belastungen stand.",
        },
        {
          title: "3. Die BIP39 '4-Buchstaben-Regel' verstehen",
          body: "Im BIP39-Standard sind die ersten vier Buchstaben jedes Wortes in der Liste einzigartig. Es reicht zu 100 % aus, nur die ersten 4 Buchstaben jedes Wortes zu notieren, um das Wallet eindeutig wiederherzustellen.",
        },
        {
          title: "4. Geografische Redundanz nutzen (2 Kopien, 2 Orte)",
          body: "Eine einzige Kopie ist ein 'Single Point of Failure'. Bewahren Sie Ihr Haupt-Backup aus Metall in einem Tresor zu Hause auf und eine zweite Kopie an einem anderen Ort (z.B. Bankschließfach).",
        },
        {
          title: "5. Versiegelte Sicherheitsumschläge verwenden",
          body: "Stecken Sie Ihre Metallplatte vor dem Verstecken in einen nummerierten Sicherheitsumschlag mit Siegel. So erkennen Sie bei regelmäßigen Prüfungen sofort, ob jemand das Backup heimlich eingesehen hat.",
        },
        {
          title: "6. Eine BIP39 Passphrase (das '25. Wort') hinzufügen",
          body: "Moderne Hardware-Wallets erlauben ein optionales Extra-Passwort. Findet ein Dieb Ihre 24-Wörter-Metallplatte, kann er ohne diese Passphrase dennoch nicht auf Ihr Geld zugreifen.",
        },
        {
          title: "7. Shamir's Secret Sharing (SLIP39) in Betracht ziehen",
          body: "Unterstützt von Wallets wie Trezor, teilt Shamir's Secret Sharing Ihre Phrase in mehrere Fragmente auf (z.B. 2-von-3-Schema). Sie benötigen eine festgelegte Anzahl an Teilen zur Wiederherstellung.",
        },
        {
          title: "8. Auf Kameras und smarte Geräte achten",
          body: "Achten Sie bei der Einrichtung darauf, dass sich im Raum keine smarten Lautsprecher (Alexa, Siri), Webcams oder Smartphones befinden, die auf Ihr Backup-Papier gerichtet sind.",
        },
        {
          title: "9. Jährliche physische Sicherheitsaudits durchführen",
          body: "Setzen Sie sich ein- bis zweimal im Jahr einen Kalendereintrag, um Ihre physischen Backups zu überprüfen. Kontrollieren Sie die Lesbarkeit der Platten und den Zustand der Siegel.",
        },
        {
          title: "10. Einen Offline-Nachlassplan erstellen",
          body: "Hinterlassen Sie klare, schriftliche Anweisungen für Ihre Angehörigen, wo sich die Backups befinden und wie die Wiederherstellung im Notfall durchgeführt werden kann.",
        },
      ],
      summaryTitle: "Zusammenfassung & Best Practices",
      summaryBody:
        "Das sicherste System besteht aus einer gravierten Edelstahlplatte im Tresor, einer zweiten Kopie an einem separaten Ort und einer optionalen 25.-Wort-Passphrase.",
      faqTitle: "Häufig gestellte Fragen",
      faqs: [
        {
          question: "Schützt Laminieren die Papierkarte vor Feuer?",
          answer:
            "Es schützt vor Wasser, aber Plastik schmilzt und brennt im Feuer extrem schnell, wodurch das Papier zerstört wird. Metallplatten sind weitaus überlegen.",
        },
        {
          question:
            "Was passiert, wenn meine 24-Wörter-Metallplatte gestohlen wird?",
          answer:
            "Ohne aktivierte Passphrase (25. Wort) kann der Dieb Ihre Gelder stehlen. Haben Sie eine Passphrase eingerichtet, bleiben Ihre Coins ohne diese Zusatzinformation geschützt.",
        },
        {
          question:
            "Ist ein Bankschließfach ein sicherer Ort für die Seed-Phrase?",
          answer:
            "Ja, als zweiter Backup-Ort sehr gut geeignet. Halten Sie jedoch immer eine Erstkopie zu Hause bereit, um nicht von Banköffnungszeiten abhängig zu sein.",
        },
      ],
      ctaSectionTitle: "Prüfen Sie Ihre Sicherheit",
      ctaSectionDesc:
        "Sauberes Offline-Backup ist das Fundament der Eigenverwahrung. Nutzen Sie unsere kostenlosen Tools für sichere Transaktionen.",
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
      canonical: `https://www.kryptonal.com/${locale}/learn/how-to-secure-seed-phrase-offline`,
      languages: {
        en: "https://www.kryptonal.com/en/learn/how-to-secure-seed-phrase-offline",
        tr: "https://www.kryptonal.com/tr/learn/how-to-secure-seed-phrase-offline",
        pt: "https://www.kryptonal.com/pt/learn/how-to-secure-seed-phrase-offline",
        es: "https://www.kryptonal.com/es/learn/how-to-secure-seed-phrase-offline",
        fr: "https://www.kryptonal.com/fr/learn/how-to-secure-seed-phrase-offline",
        de: "https://www.kryptonal.com/de/learn/how-to-secure-seed-phrase-offline",
      },
    },
    openGraph: {
      title: t.title,
      description: t.intro.substring(0, 150),
      url: `https://www.kryptonal.com/${locale}/learn/how-to-secure-seed-phrase-offline`,
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
export default async function SecureSeedPhraseOfflinePage({
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
              🔑 Offline Seed Storage & Backup
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
