/**
 * Theravada Purnima Mahatva — Rich Event Data
 *
 * Historical and spiritual significance of each Purnima (full moon) day
 * for Theravada Buddhist practitioners. Data sourced from:
 * "Uposatha Dindarshika Sahit Uposatha Pustika" (Hindi devotional handbook)
 *
 * Each Purnima is keyed by its Masa index (0 = Chaitra → 11 = Phalguna)
 * matching the panchangam-js library's masa.index.
 */


// ─── Types ───────────────────────────────────────────────────────────────────


export interface FestivalEvent {
    eventEn: string;
    eventHindi?: string;
    paliReference?: string;
    relic?: string;
    suttaCited?: string;
    note?: string;
}


export interface PurnimaEntry {
    masaIndex: number;
    monthHindi: string;
    monthTransliterated: string;
    alsoKnownAs?: string;
    keyEvents: FestivalEvent[];
}


// ─── Data ────────────────────────────────────────────────────────────────────


export const THERAVADA_PURNIMA_DATA: PurnimaEntry[] = [
    {
        masaIndex: 9, // Pausha
        monthHindi: 'पौष पूर्णिमा',
        monthTransliterated: 'Pausha Purnima',
        keyEvents: [
            {
                eventEn: "Three Kassapa brothers (Uruvelā, Nadī, Gayā Kassapa) with their 1000 disciples took refuge in the Triple Gem and received ordination; upon hearing the Āditta-pariyāya Sutta all became Arahants",
                eventHindi: "तीन जटिल भाइयों — उरुवेल कश्यप (500 शिष्य), नदी कश्यप (300 शिष्य), गया कश्यप (200 शिष्य) — ने अपने 1000 अनुयायियों के साथ त्रिरत्न की शरण ग्रहण की और प्रव्रज्या ली; आदित्त परियाय सुत्त सुनकर सभी अर्हंत हो गए",
                paliReference: "Āditta-pariyāya Sutta"
            },
            {
                eventEn: "First visit of the Tathāgata to Laṅkā — taming of Yakkhas and Nāgas through Dhamma teaching; the deva Sumana attained Sotāpatti and requested a Hair Relic; Mahiyangana Stūpa established",
                eventHindi: "तथागत का पहली बार लंकागमन — यक्षों और नागों को धम्म उपदेश से दमित किया; सोतापन्न बुद्ध-श्रावक देव सुमन के आयाचन पर तथागत ने अपनी केश-धातु प्रदान की; उस केश-धातु को प्रतिष्ठापित कर महियंगन स्तूप बनवाया गया",
                relic: "Hair Relic (केश धातु) — Mahiyangana Stūpa"
            },
            {
                eventEn: "First visit of the Tathāgata to Rājagṛha with thousands of Arahant monks; King Bimbisāra came with twelve nahuta (120,000) brāhmaṇas and householders; after hearing the Dhamma, Bimbisāra and eleven nahuta attained Sotāpatti; one nahuta took the Three Refuges",
                eventHindi: "तथागत का पहली बार हजारों अर्हंत भिक्षुओं के साथ राजगृह आगमन; मगध राजा बिम्बिसार बारह नहुत (1,20,000) ब्राह्मण-गृहपतियों के साथ स्वागत के लिए आए; धम्म सुनकर राजा बिम्बिसार सहित ग्यारह नहुत सोतापन्न मार्गफल लाभी हुए; एक नहुत ने त्रिशरण ग्रहण की"
            },
            {
                eventEn: "First Ārāma offering in the Buddha's dispensation — King Bimbisāra donated the Veḷuvana royal park to the Buddha and the Bhikkhu Saṅgha; the Buddha accepted and gave permission to monks to receive parks",
                eventHindi: "गौतम बुद्ध शासन में पहली आराम-पूजा — राजा बिम्बिसार ने वेलुवन राज-उद्यान भगवान बुद्ध सहित भिक्षु संघ को दान दिया; भगवान ने वेलुवन स्वीकार कर भिक्षुओं को आराम-ग्रहण की अनुमति दी"
            },
            {
                eventEn: "Tirokudda Sutta event — King Bimbisāra's peta relatives cried out in the night; on the Buddha's instruction the king gave meritorious gifts on their behalf; the Buddha taught the Tirokudda Sutta on merit-transference",
                eventHindi: "तिरोकुड्ड सुत्त की घटना — रात्रि में राजा बिम्बिसार के पूर्वजन्म के प्रेत-योनि में जन्मे रिश्तेदारों ने चीत्कार किया; भगवान के निर्देश पर राजा ने उनके निमित्त महादान दिया और पुण्यानुमोदन किया; भगवान ने तिरोकुड्ड सुत्त से धर्मोपदेश दिया",
                paliReference: "Tirokudda Sutta"
            }
        ]
    },
    {
        masaIndex: 10, // Magha
        monthHindi: 'माघ पूर्णिमा',
        monthTransliterated: 'Māgha Purnima',
        keyEvents: [
            {
                eventEn: "First Mahāsaṅgha Sannipāta — 1250 Arahants spontaneously assembled at Veḷuvana, Rājagīr; the assembly included Sāriputta and Moggallāna with 250 monks and the three Kassapa brothers with 1000 monks",
                eventHindi: "गौतम बुद्ध शासन में प्रथम महासंघ सन्निपात — 1250 अर्हंत भिक्षुओं के साथ राजगीर वेळुवनाराम में; भंते सारिपुत्त और भंते मोग्गल्लान सहित 250 भिक्षु, तथा भंते उरुवेल काश्यप, नदी काश्यप, गया काश्यप और 1000 भिक्षु इस अधिवेशन में एकत्रित हुए"
            },
            {
                eventEn: "Sāriputta and Moggallāna appointed as the two Chief Disciples (Aggasāvaka) of the Gautama Buddha dispensation at Veḷuvana, Rājagīr",
                eventHindi: "भगवान बुद्ध ने सारिपुत्त मुनि और मोग्गल्लान मुनि को गौतम बुद्ध शासन में अग्रश्रावक का पद प्रदान किया — राजगीर वेळुवनाराम में"
            },
            {
                eventEn: "First recitation of the Ovāda Pātimokkha — the teaching common to all Buddhas — delivered by the Tathāgata to the assembled monks: 'Sabbapāpassa akaraṇaṃ, kusalassa upasampadā, sacittapariyodapanaṃ — etaṃ buddhāna sāsanaṃ.'",
                eventHindi: "सभी बुद्धों के ओवाद प्रातिमोक्ष का पहला उपदेश — तथागत ने वेळुवन में एकत्रित भिक्षुओं को दिया: 'सब्बपापस्स अकरणं — कुसलस्स उपसम्पदा — सचित्तपरियोदपनं — एतं बुद्धान सासनं।'",
                paliReference: "Ovāda Pātimokkha"
            },
            {
                eventEn: "At Cāpāla Cetiya, Vesālī, six months before Mahāparinibbāna — at Māra's supplication the Buddha released his āyu-saṃskāra (life-force) and declared Parinibbāna in exactly three months; a great earthquake ensued",
                eventHindi: "वैशाली के चापाल चैत्य में महापरिनिर्वाण से 6 महीने पहले — पापी मार के आयाचन पर भगवान ने 'आयु संस्कार' छोड़ दिए और तीन मास बाद परिनिर्वाण की घोषणा की; उसी क्षण महाभूकंप हुआ",
                paliReference: "Mahāparinibbāna Sutta"
            }
        ]
    },
    {
        masaIndex: 11, // Phalguna
        monthHindi: 'फाल्गुण पूर्णिमा',
        monthTransliterated: 'Phālguṇa Purnima',
        keyEvents: [
            {
                eventEn: "At Arahant Kāḷudāyi's request, the Buddha departed Rājagīr with 20,000 Arahant monks towards Kapilavatthu — comprising 10,000 Arahants from the Sakya lands and 10,000 from Aṅga-Magadha",
                eventHindi: "अरहंत कालुदायी मुनि के अनुरोध पर भगवान बुद्ध ने 20,000 अर्हंत भिक्षुओं के साथ कपिलवस्तु यात्रा शुरू की — 10,000 शाक्य देश के और 10,000 अंग-मगध के अर्हंत भिक्षु"
            },
            {
                eventEn: "King Suddhodana had sent ten missions of 1000 men each to invite the Buddha; all ten groups, upon hearing the Dhamma, became monks and attained Arahantship; finally Kāḷudāyi the minister's son succeeded as mediator",
                eventHindi: "राजा शुद्धोधन ने दस बार एक-एक हजार पुरुष दूत भेजे; सभी दस समूहों ने धम्म सुनकर प्रव्रजित होकर अर्हंत-पद प्राप्त किया; अंत में अमात्य-पुत्र कालुदायी ने हजार पुरुषों के साथ जाकर, भिक्षु बनकर, अर्हंत होकर, राजा का संदेश पहुँचाया"
            },
            {
                eventEn: "Journey from Rājagīr to Kapilavatthu — 60 yojanas (~600 km) at 1 yojana per day",
                note: "Journey: Phālguṇa Purnima (departure from Rājagīr) → Vaisākha Purnima (arrival at Kapilavatthu) — exactly 2 months, 1 yojana/day"
            }
        ]
    },
    {
        masaIndex: 0, // Chaitra
        monthHindi: 'चैत्र पूर्णिमा',
        monthTransliterated: 'Caitra Purnima',
        keyEvents: [
            {
                eventEn: "First of the Four Signs — the devas manifested an old man (jarā-nimitta) before Siddhattha Bodhisatta during a pleasure-garden excursion; upon seeing this he became sorrowful and returned to the palace",
                eventHindi: "सिद्धार्थ बोधिसत्व को चार पूर्व-लक्षणों में से पहला — देवताओं ने उद्यान भ्रमण के समय एक बूढ़े व्यक्ति का दृश्य दिखाया; यह देखकर बोधिसत्व उदास होकर राजमहल लौट गए"
            },
            {
                eventEn: "Second visit of the Tathāgata to Laṅkā (Nāgadīpa) — tamed warring divine Nāgas using four Jātaka stories; 800 million Nāga army received Pañcasīla and Triple Refuge; the Rājāyatana tree and throne established as paribhogika cetiya",
                eventHindi: "तथागत का दूसरी बार लंकागमन — उत्तर लंका के नागद्वीप में युद्धरत दिव्य नागों को काकोलुक, फन्दन, वट्टक और लटुकिक जातक से दमित किया; 80 करोड़ नाग सेना को पंचशील सहित त्रिशरण दिए; राजायतन वृक्ष और सिंहासन परिभोग-चैत्य के रूप में स्थापित",
                note: "This event occurred on Caitra Amāvasyā (New Moon), not Purnima. Placed here as it falls in the Caitra masa."
            }
        ]
    },
    {
        masaIndex: 1, // Vaishakha
        monthHindi: 'वैशाख बुद्ध पूर्णिमा',
        monthTransliterated: 'Vaisākha Buddha Purnima',
        alsoKnownAs: 'Vesak / Buddha Purnima',
        keyEvents: [
            {
                eventEn: "Birth of Siddhattha Gotama Bodhisatta at Lumbinī Sāl Grove — took seven steps northward, declared: 'I am the foremost in the world! I am the eldest in the world! I am the supreme in the world! This is my final birth — there will be no more rebirth!'",
                eventHindi: "सिद्धार्थ गौतम बोधिसत्व का जन्म — लुंबिनी साल वन में; उत्तर दिशा में सात कदम चलकर उद्घोषणा की: 'मैं इस लोक में अग्र हूँ! मैं इस लोक में ज्येष्ठ हूँ! मैं इस लोक में श्रेष्ठ हूँ! यह मेरा अंतिम जन्म है — अब पुनर्भव नहीं होगा!'"
            },
            {
                eventEn: "Second of the Four Signs — the devas manifested a sick man (vyādhi-nimitta) before Siddhattha Bodhisatta during a pleasure-garden excursion",
                eventHindi: "सिद्धार्थ बोधिसत्व को चार पूर्व-लक्षणों में से दूसरा — देवताओं ने उद्यान भ्रमण के समय एक रोगी व्यक्ति का दृश्य दिखाया"
            },
            {
                eventEn: "Attainment of Sammāsambuddhahood — after six years of renunciation, under the Bodhi tree at Uruvelā, accepting Sujātā's milk-rice offering; defeat of Māra and his great army; attainment of Sabbaññuta-ñāṇa in the same night",
                eventHindi: "सम्यक सम्बुद्धत्व प्राप्ति — छह वर्ष के त्याग के बाद उरुवेला में नेरंजरा नदी के किनारे बोधि वृक्ष के नीचे; सुजाता का खीर भोजन ग्रहण कर; उसी रात्रि पापी मार और उसकी महासेना को परास्त कर; सर्वज्ञता-ज्ञान प्राप्त कर सम्यक सम्बुद्धत्व पाया"
            },
            {
                eventEn: "Mahāparinibbāna — at age 80 at the Upavattana Sāl Grove, Kusīnarā, having completed all the duties of a Sammāsambuddha",
                eventHindi: "महापरिनिर्वाण — 80 वर्ष की आयु में कुशीनारा के उपवर्तन साल वन में; सभी बुद्ध-कृत्य पूर्ण कर अमृत निर्वाण को प्राप्त किया"
            },
            {
                eventEn: "Seven co-born (saptasahajāta) on the same Vaisākha Purnima: Yasodharā, Ānanda, Channa, Kāḷudāyi, horse Kaṇṭhaka, Uposatha-kula elephant, and the Vajrāsana Bodhi tree at Uruvelā",
                eventHindi: "सप्त सहजात वस्तुओं का जन्म — देवी यशोधरा, अर्हंत आनंद मुनि, अर्हंत छन्न मुनि, अर्हंत कालुदाई मुनि, कंथक अश्व, उपोसथ कुल का हाथी, और वज्रासन बोधि मंडप में पीपल का बोधि वृक्ष — सभी आज के दिन जन्मे"
            },
            {
                eventEn: "Third and final visit of the Tathāgata to Laṅkā — at Maṇiakkhika Nāga king's invitation, visited Kelaniya with 500 great Arahants; left footprint at Sumanakūṭa (Sri Pāda / Adam's Peak) at the deva Sumana's request; also left footprint at Anurādhapura",
                eventHindi: "तथागत का तीसरी बार लंकागमन — मणिअक्खिक नाग राजा के निमंत्रण पर 500 महान अर्हंतों के साथ; देव सुमन के निमंत्रण पर सुमनकूट (Adam's Peak) पर पद-चिन्ह; अनुराधपुर में भी पद-चिन्ह स्थापित"
            },
            {
                eventEn: "On the day of the Tathāgata's Parinibbāna, prophecy to Sakka (Devendra): 'My sāsana will be established and protected in Laṅkā — you and your retinue guard Laṅkā and the sāsana'; arrival of Prince Vijaya with 700 Kṣatriya men to establish human settlement in Laṅkā",
                eventHindi: "तथागत के परिनिर्वाण के दिन देवेंद्र शक्र को भविष्यवाणी: 'देवेंद्र! लंका में मेरा शासन स्थापित होगा — आप और आपके परिषद लंका और शासन की रक्षा करें'; उसी दिन विजय राजकुमार और 700 क्षत्रियों का लंका में आगमन"
            },
            {
                eventEn: "Parinibbāna of Arahant Ānanda at age 120 — above the Rohiṇī river between Kapilavatthu and Koḷiya, he performed an aerial miracle; both the Sakya and Koḷiya clans received his bone relics and built stūpas",
                eventHindi: "अर्हंत आनंद मुनि का परिनिर्वाण — 120 वर्ष की आयु में कपिलवस्तु और कोलिय राज्य की सीमा पर रोहिणी नदी के ऊपर आकाश में ऋद्धि-चमत्कार करके; शाक्य और कोलिय दोनों राजवंशों ने अस्थि-धातु लेकर स्तूप बनाए"
            },
            {
                eventEn: "Chaṭṭha Saṅgāyana (6th Buddhist Council), Suvannabhūmi (Burma), 1954–1956 Vesākha; 2473 elders from Burma and 144 from Sri Lanka and other countries; Viccittasārābhivaṃsa Mahāthera recited and purified the entire Tipiṭaka",
                eventHindi: "छट्ठ संगायन (6वीं धम्म संगीति) — सुवर्णभूमि (बर्मा) में 1954–1956 वेसाख तक; 2473 भिक्षु सुवर्णभूमि से और 144 श्रीलंका आदि देशों से; विचित्तसाराभिवंस महाथेर द्वारा संपूर्ण त्रिपिटक का पाठ और शुद्धिकरण"
            }
        ]
    },
    {
        masaIndex: 2, // Jyeshtha
        monthHindi: 'ज्येष्ठ पूर्णिमा',
        monthTransliterated: 'Jyeṣṭha Purnima',
        keyEvents: [
            {
                eventEn: "Arahant Mahā Mahinda (son of Emperor Aśoka, aged 32) arrives in Laṅkā via aerial path with Arahants Iṭṭhiya, Uttiya, Sambala, Bhaddasāla, Sāmaṇera Sumana, and Anāgāmi Bhaṇḍuka upāsaka; lands at Missaka Pabbata (Mihintale)",
                eventHindi: "अर्हंत महामहेंद्र मुनि (सम्राट अशोक के पुत्र, 32 वर्ष की आयु में) ऋद्धि से आकाश मार्ग से श्रीलंका पहुँचे — साथ में अर्हंत इट्टिय, उत्तिय, सम्बल, भद्दसाल, सामणेर सुमन और अनागामी भंडूक उपासक; मिस्सक पर्वत (मिहिंताले) पर उतरे"
            },
            {
                eventEn: "Mahinda teaches 40,000 men including King Devānampiyatissa using the Cūḷahatthipadopama Sutta; in the evening teaches the devas using the Samecitta-pariyāya Sutta; countless devas attained path-fruits",
                eventHindi: "महामहेंद्र मुनि ने राजा देवानम्पियतिस्स सहित 40,000 पुरुषों को चुल्लहस्थिपदोपम सुत्त से धम्म देशना कर शरणागमन में स्थापित किया; संध्या में समचित्तपरियाय सुत्त से देवताओं को धम्म बताया; अनंत देवता मार्गफल लाभी हुए",
                suttaCited: "Cūḷahatthipadopama Sutta; Samecitta-pariyāya Sutta; Devadhūta Sutta; Bālapaṇḍita Sutta; Dhammacakkappavattana Sutta"
            },
            {
                eventEn: "On the fourth day of Mahinda's arrival, the first Uposathāgāra (Sīmā boundary) was established in Laṅkā; the entire island shook; King Devānampiyatissa donated Mahāmeghavana park to the Saṅgha — the first Ārāma offering in Laṅkā",
                eventHindi: "महामहेंद्र मुनि के आगमन के चौथे दिन लंका में पहला उपोसथगार (सीमा) स्थापित हुआ; सारा लंकादीप कांप उठा; राजा ने महामेघ वन संघ को दान दिया — लंका में पहली आराम-पूजा"
            },
            {
                eventEn: "Mahinda's honorific titles in Laṅkā: 'Anubuddha' (second Buddha), 'Satthu-sadisa' (equal to the Teacher), 'Dīpappasādaka' (one who established the sāsana in the island), 'Paṭhamāguru / Paṭhamācāriya' (first teacher); Laṅkā's Sinhala people celebrate 'Rajya Poson' festival on Jyeṣṭha Purnima week",
                eventHindi: "लंका में महामहेंद्र मुनि की उपाधियाँ: 'अनुबुद्ध' (दूसरे भगवान बुद्ध), 'सत्थुसदिस' (शास्ता के समान), 'दीपप्पसादक' (द्वीप के लोगों को बुद्ध-शासन में स्थापित करने वाले), 'प्रथमगुरु / प्रथमाचार्य'; श्रीलंका में ज्येष्ठ पूर्णिमा के सप्ताह में 'राज्य पॉसोन महोत्सव' मनाया जाता है",
                note: "Laṅkā's Buddhist New Year also begins from Jyeṣṭha Purnima. The '2332nd Buddhist Year' (Anubudu Mihidu Jayantī) is counted from this day."
            },
            {
                eventEn: "Third of the Four Signs — the devas manifested a corpse (maraṇa-nimitta) before Siddhattha Bodhisatta; upon seeing death he renounced 'jīvita-mada' (the conceit of living)",
                eventHindi: "सिद्धार्थ बोधिसत्व को चार पूर्व-लक्षणों में से तीसरा — देवताओं ने मृत देह का दृश्य दिखाया; मृत्यु देखकर बोधिसत्व ने 'जीवित-मद' का त्याग किया"
            },
            {
                eventEn: "Fifth week after Buddhahood — the Tathāgata sat in meditation under the Ajapāla Nigrodha tree; Māra's three daughters (Taṇhā, Aratī, Ragā) appeared in many alluring forms to tempt the Buddha with sensual desire; the Buddha defeated them by reciting two Dhammapada verses",
                eventHindi: "बुद्धत्व प्राप्ति के पाँचवें सप्ताह में — तथागत अजपाल नामक निग्रोध वृक्ष के नीचे धर्म-मनन में बैठे थे; पापी मार की तीन पुत्रियाँ (तण्हा, अरति, रागा) अनेक अनुनय-विनय करते हुए कामवासना से वश में करने के लिए आईं; भगवान ने धम्मपद की दो गाथाएँ कहकर उन्हें परास्त किया"
            }
        ]
    },
    {
        masaIndex: 3, // Ashadha
        monthHindi: 'आषाढ़ पूर्णिमा',
        monthTransliterated: 'Āṣāḍha Purnima',
        alsoKnownAs: 'Dhamma Cakka Day / Asalha Puja / Guru Purnima',
        keyEvents: [
            {
                eventEn: "Bodhisatta descends from Tuṣita heaven into Māyādevī's womb — having completed all pāramitās, born in Tuṣita as King Santuṣita; after Five Great Contemplations (pañca mahāvilokana) on time, continent, country, clan, and mother, descended at the moment of conception; ten-thousand world-systems shook",
                eventHindi: "बोधिसत्व तुषित देवलोक से च्युत होकर देवी महामाया के गर्भ में प्रविष्ट — सभी पारमिताएँ पूर्ण कर तुषित में 'सन्तुषित' नाम से राजा हुए थे; काल, द्वीप, देश, कुल और माता के पाँच महाविलोकन देखकर; गर्भ-प्रवेश के क्षण दस सहस्री लोकधातु काँप उठे"
            },
            {
                eventEn: "Fourth of the Four Signs — the devas manifested a renunciant monk (pabbajita-nimitta) before Siddhattha Bodhisatta; that night he performed the Mahābhinishkramaṇa — departed with Channa and horse Kaṇṭhaka, reaching the Anomā River; cut his hair, sent back Channa and Kaṇṭhaka, donned the robe given by Mahābrahmā Ghaṭīkāra",
                eventHindi: "सिद्धार्थ बोधिसत्व को चार पूर्व-लक्षणों में से चौथा — देवताओं ने श्रमण मुनि का दृश्य दिखाया; उसी रात महाभिनिष्क्रमण — छन्न और कंथक घोड़े के साथ अनोमा नदी तक; केशच्छेदन, छन्न-कंथक को वापस भेजा, महाब्रह्मा घटीकार द्वारा दिए गए चीवर धारण किए"
            },
            {
                eventEn: "Birth of Prince Rāhula — son of Siddhattha Bodhisatta and Yasodharā; later became Arahant and was foremost among those desiring training",
                eventHindi: "राजकुमार राहुल का जन्म — सिद्धार्थ बोधिसत्व और देवी यशोधरा के पुत्र; बाद में बुद्ध शासन में शिक्षाकामियों में अग्र महाश्रावक अर्हंत हुए"
            },
            {
                eventEn: "First Dhamma Discourse — Dhammacakkappavattana Sutta — delivered at Isipatana Migadāya (Sarnath), Vārāṇasī to five monks; eighteen koṭi Brahmas and countless devas attained path-fruits; Aññā Koṇḍañña became the first Sotāpanna; ten-thousand world-systems shook",
                eventHindi: "प्रथम धम्म प्रवचन — धम्मचक्कप्पवत्तन सुत्त — वाराणसी के इसिपत्तन मृगदाय वन में पाँच भिक्षुओं को; अठारह करोड़ ब्रह्मा और अनगिनत देवता मार्गफल लाभी हुए; अञ्ञा कोण्डञ्ञ प्रथम सोतापन्न हुए; दस सहस्री लोकधातु काँप उठी",
                paliReference: "Dhammacakkappavattana Sutta, Vinaya Piṭaka"
            },
            {
                eventEn: "Third and final Yamaka Mahāpāṭihāriya (twin-miracle) performed by the Tathāgata — producing fire and water from each pore of the body simultaneously; thereafter the Buddha ascended to Tāvatiṃsa to teach Abhidhamma to his mother",
                eventHindi: "तथागत का तीसरा और अंतिम यमक महाप्रातिहार्य — शरीर के एक-एक रोम से एक साथ अग्नि और जल निकाले; इसके पश्चात तावतिंस देवलोक में माता को अभिधम्म देशना के लिए गए"
            },
            {
                eventEn: "Buddha's Vassa in Tāvatiṃsa — 7th year after Buddhahood; three months of Abhidhamma teaching; his mother Māyā (reborn as male deva 'Mātu-devarāja' in Tuṣita) came to Tāvatiṃsa to hear the teaching and attained Sotāpatti",
                eventHindi: "तावतिंस देवलोक में भगवान का सातवाँ वर्षावास — बुद्धत्व के 7 वर्ष बाद; तीन माह अभिधम्म देशना; माता महामाया (मृत्यु पश्चात तुषित में 'मातृ देवराज' नाम पुरुष देव के रूप में जन्मी थीं) सुनने आईं और सोतापन्न हुईं"
            },
            {
                eventEn: "Mahā Mahinda's first Vassa in Laṅkā at 'Ambila' Pabbata; Prince Ariṭṭha along with 60 Sinhala youths received ordination (pabbajjā and upasampadā) and all attained Arahantship that very day — the first Sinhala Arahants",
                eventHindi: "महामहेंद्र मुनि का लंका में पहला वर्षावास — 'अम्बिल' पर्वत पर; अरिट्ठ राजकुमार सहित 60 सिंहली कुमारों को प्रव्रज्या और उपसम्पदा दी; उसी दिन सभी अर्हंत-पद प्राप्त किए — लंका के प्रथम सिंहली अर्हंत मुनि"
            },
            {
                eventEn: "Foundation auspicious stone (maṅgala-silā) of the Ruvanvelisāya (Mahāthūpa) Stūpa laid by King Duṭṭhagāmaṇī Abhaya; all Arahants in the ten-thousand world-systems arrived by air to attend",
                eventHindi: "रुवनवेळी (महास्तूप) स्तूप की मंगल-शिला प्रतिष्ठापन — राजा गामिणी अभय के हाथ से; दस सहस्री लोकधातुओं में रहने वाले सभी अर्हंत मुनि आकाश मार्ग से लंका पधारे"
            },
            {
                eventEn: "Buddha's Tooth Relic brought from Kaliṅga to Anurādhapura by Princess Hemamālā and Dantakumāra; King Śrīmeghavaṇṇa welcomed it with great reverence, built a gem-inlaid shrine; the relic emitted white rays from the sky; 'Āsāḷha Perahera' festival established",
                eventHindi: "भगवान बुद्ध का दंत-धातु कलिंग देश से श्रीलंका अनुराधपुर पहुँचा — कलिंगराज-पुत्री हेममाला और दंतकुमार द्वारा; लंका राजा श्रीमेघवर्ण ने मणि-मंदिर में प्रतिष्ठापित किया; आकाश से श्वेत किरणें निकलीं; 'असाल्ह पेरहेर' महोत्सव की शुरुआत"
            },
            {
                eventEn: "Beginning of Vassāvāsa (Rains Retreat) — First Vassa",
                note: "First Vassa: begins day after Āṣāḍha Purnima (Śrāvaṇa Kṛṣṇa Pratipadā) → ends on Āśvina Purnima. Second Vassa: begins day after Śrāvaṇa Purnima (Bhādrapada Kṛṣṇa Pratipadā) → ends on Kārtika Purnima."
            }
        ]
    },
    {
        masaIndex: 4, // Shravana
        monthHindi: 'श्रावण पूर्णिमा',
        monthTransliterated: 'Śrāvaṇa Purnima',
        keyEvents: [
            {
                eventEn: "Ven. Rāhulabhadra attained Arahantship at age 21 upon hearing the Cūḷarāhulovāda Sutta taught by the Tathāgata; foremost among those desiring training (sikkhākāmiya) among the 80 Mahā-sāvakas; had previously attained Sotāpatti at age 7 upon hearing the Ambalatthika-rāhulovāda Sutta",
                eventHindi: "भंते राहुलभद्र 21 वर्ष की आयु में तथागत द्वारा उपदिष्ट चुल्ल रहुलोवाद सुत्त सुनकर सभी क्लेश नष्ट कर अर्हंत हुए; 80 महाश्रावकों में शिक्षाकामी भिक्षुओं में अग्र; 7 वर्ष की आयु में अम्बलट्ठिक रहुलोवाद सुत्त सुनकर सोतापन्न हुए थे",
                paliReference: "Cūḷarāhulovāda Sutta"
            },
            {
                eventEn: "Three months after the Mahāparinibbāna — Arahant Ānanda attained Arahantship just before the First Council; foremost among the 80 Mahā-sāvakas in learning (bahussuta), continuity (gata), retentiveness (dhārita), diligence (uṭṭhāyin) and personal attendance (upaṭṭhāka)",
                eventHindi: "भगवान बुद्ध के परिनिर्वाण के तीन महीने बाद — अर्हंत आनंद मुनि प्रथम धम्म-संगीति से ठीक पहले अर्हंत हुए; 80 महाश्रावकों में बहुश्रुतों में अग्र, वृत्तिमानों में अग्र, प्रवीणों में अग्र, धृतिमानों में अग्र और सेवकों में अग्र"
            },
            {
                eventEn: "First Dhamma Saṅgīti — led by Arahant Mahākaśyapa with 500 Arahants at a maṇḍapa before the Saptaparṇī Cave on Vaibhāra Pabbata, Rājagīr, under King Ajātaśatru's patronage; lasted 7 months; Arahant Ānanda recited Sutta and Abhidhamma, Arahant Upāli recited Vinaya",
                eventHindi: "प्रथम धम्म संगीति — अर्हंत महाकाश्यप मुनि के नेतृत्व में 500 अर्हंतों द्वारा; राजगीर के वैभार पर्वत पर सप्तपर्णी गुफा के सामने मंडप में; राजा अजातशत्रु के शासनकाल में; 7 महीने चली; अर्हंत आनंद ने सुत्त और अभिधम्म का पाठ किया, अर्हंत उपालि ने विनय का"
            },
            {
                eventEn: "Foundation auspicious stone laid for the Forehead-relic (ललाटास्थि) Stūpa in Laṅkā by King Kāvantissa — fulfilling the Tathāgata's prophecy; the forehead relic had been preserved through Mahākaśyapa's pupil lineage for ~300 years before reaching Laṅkā",
                eventHindi: "तथागत बुद्ध की ललाटास्थि धातु के लिए श्रीलंका में मंगल-शिला प्रतिष्ठापन — राजा कावनतिस्स द्वारा; भगवान की भविष्यवाणी पूरी करते हुए; ललाटास्थि महाकाश्यप मुनि की शिष्य-परम्परा में ~300 वर्षों तक सुरक्षित रही"
            },
            {
                eventEn: "Fourteen-day Tooth Relic grand festival at Dalada Māligāva (Dalāḍa Māligāwa), Kandy; the grand Mahāpūjā festival concludes on Śrāvaṇa Purnima; devotees from across Sri Lanka gather for veneration",
                eventHindi: "कैंडी के दंत-धातु मंदिर (दलाड़ा माळिगाव) में दो सप्ताह के महादंत-धातु-पूजा उत्सव का समापन श्रावण पूर्णिमा को महापूजा से होता है; श्रद्धावान उपासक-उपासिकाएँ सारे श्रीलंका से कैंडी आते हैं"
            },
            {
                eventEn: "Second Vassa begins the day after Śrāvaṇa Purnima",
                note: "Second Vassa begins on Bhādrapada Kṛṣṇa Pratipadā (day after Śrāvaṇa Purnima); ends on Kārtika Purnima."
            }
        ]
    },
    {
        masaIndex: 5, // Bhadrapada
        monthHindi: 'भाद्रपद पूर्णिमा',
        monthTransliterated: 'Bhādrapada Purnima',
        keyEvents: [
            {
                eventEn: "Founding of the Bhikkhunī Saṅgha — in the 5th year of Buddhahood, during Vassa at Vesālī; after the Rohiṇī river dispute between Sakyas and Koḷiyas was resolved, 250 Sakya + 250 Koḷiya princes took ordination; their wives approached Mahāprajāpatī; Mahāprajāpatī Gautamī accepted the Eight Garudhammas from Ānanda and received upasampadā; she then ordained 500 Kṣatriya women",
                eventHindi: "भिक्षुणी संघ की स्थापना — बुद्धत्व के 5वें वर्ष में, वैशाली में वर्षावास के समय; शाक्य-कोलिय रोहिणी नदी विवाद सुलझने के बाद 250 शाक्य और 250 कोलिय राजकुमार प्रव्रजित हुए; उनकी पत्नियाँ महाप्रजापती के पास आईं; महाप्रजापती गौतमी ने आनंद के माध्यम से भगवान से आठ गरुधम्म स्वीकार कर उपसम्पदा पाई; फिर 500 क्षत्रिय महिलाओं को उपसम्पदा दी",
                note: "5th year of Buddhahood; Vassa at Vesālī (Kūṭāgārasālā); preceded by Rohiṇī river dispute; 250 Sakya + 250 Koḷiya princes ordained first"
            }
        ]
    },
    {
        masaIndex: 6, // Ashvina
        monthHindi: 'आश्विन पूर्णिमा',
        monthTransliterated: 'Āśvina Purnima',
        alsoKnownAs: 'Mahā Pavāraṇā / Devāvarohaṇa Divasa',
        keyEvents: [
            {
                eventEn: "End of First Vassa and Mahā Pavāraṇā — monks who completed the first Vassa (Āṣāḍha Purnima +1 day to Āśvina Purnima) perform Vassa Pavāraṇā today; Kaṭhina Cīvara month begins from today",
                note: "First Vassa ends today. Kaṭhina Cīvara month runs from Āśvina Purnima to Kārtika Purnima. Only monks who completed the first Vassa are eligible for Kaṭhina Cīvara."
            },
            {
                eventEn: "Devāvarohaṇa — in the 7th year after Buddhahood, after three months of Abhidhamma teaching in Tāvatiṃsa, the Tathāgata descended to the human world at the gate of Saṅkissa city; 'Acala Cetiya' established at the descent point; called 'Devāvarohaṇa Divasa'",
                eventHindi: "देवावरोहण — बुद्धत्व के 7 वर्ष बाद, तावतिंस में तीन माह अभिधम्म देशना के बाद तथागत संकिस्स नगर-द्वार पर मानव-लोक में अवतरित हुए; अवतरण-स्थल पर 'अचल चैत्य' स्थापित; यह दिन 'देवावरोहण दिवस' कहलाता है"
            },
            {
                eventEn: "Metteyya Bodhisatta (then a young Brahmin youth) witnessed the Devāvarohaṇa miracle and immediately took ordination; later received Niyata-Vivaraṇa prophecy of future Buddhahood",
                eventHindi: "मैत्रेय बोधिसत्व (तब एक ब्राह्मण कुमार) ने देवावरोहण चमत्कार देखकर तत्काल प्रव्रज्या ग्रहण की; बाद में भावी बुद्धत्व की 'नियत-विवरण' भविष्यवाणी प्राप्त की"
            },
            {
                eventEn: "Title 'Foremost in Great Wisdom' (Mahāpaññāvantānaṃ aggo) conferred on Sāriputta by the Tathāgata",
                eventHindi: "'महाप्रज्ञावानों में अग्र' उपाधि — तथागत ने आश्विन पूर्णिमा को सारिपुत्त मुनि को प्रदान की",
                paliReference: "Etadagga-pāli"
            },
            {
                eventEn: "First recitation of Vinaya Piṭaka in Laṅkā — Mahā Mahinda led 68,000 Arahant monks (61 Sinhala Arahants + 8 from Jambudīpa) in the first Vinaya saṅgāyana at Thūpārāma",
                eventHindi: "लंका में विनय-पिटक का पहली बार संगायन — महामहेंद्र मुनि सहित 68,000 अर्हंत भिक्षुओं (61 सिंहल अर्हंत और 8 जम्बुदीप के) द्वारा थूपाराम में"
            },
            {
                eventEn: "Mahābodhi southern branch miracle — Emperor Aśoka's saccakiriyā (act of truth): 'If I have truly attained the three fruitions, may this branch rise to the sky'; the branch rose into the sky and hovered for a week emitting six-colored rays; it then descended and planted itself at Anurādhapura",
                eventHindi: "महाबोधि वृक्ष दक्षिण शाखा चमत्कार — सम्राट अशोक की सत्यक्रिया: 'यदि मैंने सच में तीन फल प्राप्त किए हैं तो यह शाखा स्वयं अलग हो आकाश में उठे'; शाखा स्वयं अलग होकर एक सप्ताह आकाश में रही; 6-रंगी किरणें निकलती रहीं; फिर अनुराधपुर में उतरकर प्रतिष्ठापित हुई"
            },
            {
                eventEn: "Parinibbāna of Arahant Mahā Mahinda at age 80 — after 48 years in Laṅkā; cremation performed on Āśvina Purnima; day also called 'Mahā Mahinda Aṣṭamī'",
                eventHindi: "महामहेंद्र मुनि का परिनिर्वाण — 80 वर्ष की आयु में; 32 वर्ष में लंका आए, 48 वर्ष लंका में रहकर संपूर्ण लंका को धर्म-दीप बनाकर परिनिर्वाण पाया; आश्विन पूर्णिमा को अंत्येष्टि — 'महामहेंद्र अष्टमी'"
            }
        ]
    },
    {
        masaIndex: 7, // Kartika
        monthHindi: 'कार्तिक पूर्णिमा',
        monthTransliterated: 'Kārtika Purnima',
        keyEvents: [
            {
                eventEn: "End of Kaṭhina Cīvara month and end of Second Vassa — Kaṭhina Cīvara month (Āśvina PM → Kārtika PM) concludes; monks who completed the second Vassa also end their retreat today",
                note: "Kaṭhina Cīvara month ends today. Second Vassa (Bhādrapada Kṛṣṇa Pratipadā → Kārtika Purnima) also ends today."
            },
            {
                eventEn: "Tathāgata's Mission Instruction to 60 Arahants at end of first Vassa: 'Go forth, O monks, for the welfare of the many, for the happiness of the many, out of compassion for the world — caraṃ bhikkhave cārikaṃ, bahujana-hitāya, bahujana-sukhāya…'",
                eventHindi: "तथागत ने पहला वर्षावास समाप्त होने पर 60 अर्हंत भिक्षुओं को ऐतिहासिक अनुशासन दिया: 'चरथ भिक्खवे चारिकं — बहुजनहिताय, बहुजनसुखाय, लोकानुकम्पाय...' — अनेक दिशाओं में जाकर धम्म प्रचार करो",
                paliReference: "Mahāvagga, Vinaya Piṭaka"
            },
            {
                eventEn: "End of first Vassa at Isipatana (Sarnath); Tathāgata departed for Uruvelā to convert the three Kassapa brothers — this journey led to the Pausha Purnima events of 1000 new Arahants",
                eventHindi: "इसिपत्तन में पहला वर्षावास समाप्त कर तथागत ने उरुवेला की यात्रा शुरू की — काश्यप-बंधुओं को धम्म-दीक्षा देने; इस यात्रा के फलस्वरूप पौष पूर्णिमा को 1000 नए अर्हंत हुए"
            },
            {
                eventEn: "Metteyya Bodhisatta received Niyata-Vivaraṇa — the definitive prophecy of future Buddhahood — from Gautama Buddha",
                eventHindi: "मैत्रेय बोधिसत्व को गौतम बुद्ध द्वारा 'नियत-विवरण' — भावी बुद्धत्व की निश्चित भविष्यवाणी — प्राप्त हुई"
            },
            {
                eventEn: "Parinibbāna of Arahant Sāriputta at Nālaka village (Nālandā), his birthplace; he first taught his aged mother Rūpasārī who had never heard the Dhamma; she attained Sotāpatti through his final teaching; foremost in great wisdom among all disciples",
                eventHindi: "अग्रश्रावक अर्हंत सारिपुत्त मुनि का परिनिर्वाण — जन्मभूमि नालक गाँव (नालंदा) में; पहले वृद्ध माता रूपसारी को धम्म बताकर उन्हें स्रोतापन्न किया; महाप्रज्ञावानों में अग्र"
            },
            {
                eventEn: "Parinibbāna of Mahā Moggallāna at Kāḷasilā Pabbata, Rājagīr — two weeks after Sāriputta's Parinibbāna (on Mārgaśīrṣa Amāvasyā); foremost in psychic powers",
                note: "Mahā Moggallāna's Parinibbāna: ~2 weeks after Sāriputta's — on Mārgaśīrṣa Amāvasyā at Kāḷasilā Pabbata, Rājagīr. Noted here as it falls within Kārtika masa."
            },
            {
                eventEn: "Construction of Thūpārāma Stūpa begins at Anurādhapura with Buddha's right clavicle relic (dakkhiṇa-akkha-dhātu) brought by Mahinda; on the same day 30,000 Sinhala youth took ordination",
                eventHindi: "थूपाराम स्तूप का निर्माण आरम्भ — अनुराधपुर में भगवान की दाहिनी हंसली धातु के साथ; महामहेंद्र मुनि द्वारा लाई गई; उसी दिन 30,000 सिंहली युवकों ने प्रव्रज्या ग्रहण की"
            },
            {
                eventEn: "Kattika Pūjā in Sri Lanka — Mahābodhi tree at Anurādhapura adorned with golden robes (suvarṇa-vastra) and thousands of oil lamps in grand Mahāpūjā",
                eventHindi: "श्रीलंका में 'कार्तिक पूजा' — अनुराधपुर के महाबोधि वृक्ष को सुनहरे वस्त्र और हजारों दीपकों से महापूजा"
            },
            {
                eventEn: "Kattika Pūjā at Dalāḍa Māligāwa, Kandy — Mahādīpadānotsava (great lamp offering festival); thousands of oil lamps illuminate the Tooth Relic shrine",
                eventHindi: "कैंडी दंत-धातु मंदिर (दलाड़ा माळिगाव) में 'कार्तिक पूजोत्सव' — महादीपदानोत्सव; हजारों दीपकों से दंत-धातु मंदिर को प्रकाशित किया जाता है"
            }
        ]
    },
    {
        masaIndex: 8, // Margashirsha
        monthHindi: 'मार्गशीर्ष पूर्णिमा',
        monthTransliterated: 'Mārgaśīrṣa Purnima',
        keyEvents: [
            {
                eventEn: "Arrival of Arahantī Saṅghamittā (daughter of Emperor Aśoka, aged 32) in Laṅkā with the southern branch of the Mahābodhi tree — departed Tāmralipti on Mārgaśīrṣa Pratipadā, arrived at Jambukolapattana on Śukla Saptamī, and on Purnima the branch was planted at Mahāmeghavana, Anurādhapura by King Devānampiyatissa",
                eventHindi: "अर्हंत संघमित्रा महाथेरी (सम्राट अशोक की पुत्री, 32 वर्ष की आयु) का श्रीलंका आगमन — महाबोधि वृक्ष की दक्षिण शाखा के साथ; मार्गशीर्ष प्रतिपदा को ताम्रलिप्ति से प्रस्थान, शुक्ल सप्तमी को जम्बुकोलपत्तन पहुँचीं, पूर्णिमा को अनुराधपुर के महामेघ वन में राजा देवानम्पियतिस्स के हाथ से प्रतिष्ठापित",
                note: "Journey: Mārgaśīrṣa Pratipadā (departed Tāmralipti) → Śukla Saptamī (arrived Jambukolapattana) → Purnima (branch planted at Mahāmeghavana, Anurādhapura)"
            },
            {
                eventEn: "Founding of the Bhikkhunī Saṅgha in Laṅkā — Arahantī Saṅghamittā ordained Queen Anulādevī and 500 Kṣatriya women; all attained Arahantship; Saṅghamittā had brought with her 11 Bhikkhunīs skilled in all Vinaya procedures",
                eventHindi: "श्रीलंका में भिक्षुणी संघ की स्थापना — अर्हंत संघमित्रा महाथेरी ने अनुलादेवी रानी सहित 500 क्षत्रिय महिलाओं को उपसम्पदा दी; सभी अर्हंत-पद को प्राप्त हुईं; संघमित्रा के साथ विनय की सभी विधियों में कुशल 11 भिक्षुणियाँ भी आई थीं"
            },
            {
                eventEn: "Parinibbāna of Mahā Moggallāna — on Mārgaśīrṣa Amāvasyā at Kāḷasilā Pabbata, Rājagīr; foremost among disciples in psychic powers (iddhimantānaṃ aggo)",
                eventHindi: "अर्हंत महा मोग्गल्लान मुनि का परिनिर्वाण — मार्गशीर्ष अमावस्या को राजगीर के कालशिला पर्वत पर; 80 महाश्रावकों में ऋद्धिमानों में अग्र",
                note: "Parinibbāna of Mahā Moggallāna — Mārgaśīrṣa Amāvasyā (New Moon), at Kāḷasilā Pabbata, Rājagīr; ~2 weeks after Sāriputta's Kārtika Purnima Parinibbāna"
            }
        ]
    }
];
