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
                eventEn: "Three Kassapa brothers with 1000 disciples took refuge in the Triple Gem; attained Arahantship upon hearing Āditta-pariyāya Sutta",
                eventHindi: "तीन जटिल भाइयों (उरुवेल कश्यप, नदी कश्यप, गया कश्यप) और उनके 1000 शिष्यों ने त्रिरत्न की शरण ली; आदित्त परियाय सुत्त सुनकर अरहंत हुए",
                paliReference: "Āditta-pariyāya Sutta"
            },
            {
                eventEn: "First visit of the Tathāgata to Laṅkā — taming of Yakkhas and Nāgas; establishment of Mahiyangana Stūpa",
                eventHindi: "तथागत का पहली बार लंकागमन — यक्षों और नागों को दमन किया; महियंगन स्तूप की स्थापना",
                relic: "Hair Relic (केश धातु) — Mahiyangana Stūpa"
            },
            {
                eventEn: "First visit of the Tathāgata to Rājagṛha; King Bimbisāra and 110,000 householders attained Sotāpatti",
                eventHindi: "तथागत का पहली बार राजगृह आगमन; राजा बिम्बिसार सहित 11 नहुत ब्राह्मण-गृहपतियों ने सोतापन्न मार्गफल प्राप्त किया"
            },
            {
                eventEn: "First Ārāma offering — King Bimbisāra donated Veḷuvana garden to the Saṅgha",
                eventHindi: "बुद्ध शासन में पहली आराम पूजा — राजा बिम्बसार ने वेलुवन उद्यान भिक्षु संघ को दान दिया"
            },
            {
                eventEn: "Tirokudda Sutta event — king donates for his peta relatives; merit transference",
                eventHindi: "तिरोकुड्ड सुत्त की घटना — राजा के प्रेत रिश्तेदारों के निमित्त दान, पुण्यानुमोदन",
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
                eventEn: "First Mahāsaṅgha Sannipāta — 1250 Arahants at Veḷuvana, Rājagīr; Sāriputta & Moggallāna appointed as chief disciples",
                eventHindi: "प्रथम महासंघ सन्निपात — 1250 अरहंत भिक्षुओं के साथ राजगीर वेळुवनाराम में; सारिपुत्त और मोग्गल्लान अग्रश्रावक नियुक्त"
            },
            {
                eventEn: "First recitation of Ovāda Pātimokkha — 'Sabbapāpassa akaraṇaṃ, kusalassa upasampadā, sacittapariyodapanaṃ — etaṃ buddhāna sāsanaṃ.'",
                eventHindi: "ओवाद प्रातिमोक्ष का पहला उपदेश",
                paliReference: "Ovāda Pātimokkha"
            },
            {
                eventEn: "At Cāpāla Cetiya, Vesālī, the Buddha released his āyu-saṃskāra; declared Parinibbāna in 3 months",
                eventHindi: "माघ पूर्णिमा को वैशाली के चापाल चैत्य में भगवान ने 'आयु संस्कार' छोड़ दिए; तीन मास बाद परिनिर्वाण की घोषणा",
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
                eventEn: "At Arahant Kāḷudāyi's request, the Buddha departed Rājagīr with 20,000 Arahant monks towards Kapilavatthu (60 yojanas / ~600 km)",
                eventHindi: "अरहंत कालुदायी मुनि के अनुरोध पर भगवान बुद्ध ने 20,000 अरहंत भिक्षुओं के साथ कपिलवस्तु यात्रा शुरू की"
            },
            {
                eventEn: "Ten missions of 1000 men each sent by King Suddhodana — all became Arahants; Kāḷudāyi's mediation",
                eventHindi: "राजा शुद्धोधन के दस बार भेजे गए दूतों में से सभी अरहंत हुए; कालुदायी की मध्यस्थता"
            },
            {
                eventEn: "Journey from Rājagīr to Kapilavatthu — 2 months at 1 yojana/day",
                note: "Journey: Phālguṇa Purnima (departure) → Vaisākha Purnima (arrival at Kapilavatthu) — 2 months, 1 yojana/day"
            }
        ]
    },
    {
        masaIndex: 0, // Chaitra
        monthHindi: 'चैत्र पूर्णिमा',
        monthTransliterated: 'Caitra Purnima',
        keyEvents: [
            {
                eventEn: "First of the Four Signs — sight of an old man (jarā-nimitta) shown by the devas",
                eventHindi: "सिद्धार्थ बोधिसत्व को चार पूर्व-निमित्तों में से पहला — बूढ़े व्यक्ति का दृश्य देवताओं द्वारा दिखाया गया"
            },
            {
                eventEn: "Second visit of the Tathāgata to Laṅkā (Nāgadīpa) — 800 million Nāgas received Pañcasīla; Rājāyatana tree established as cetiya",
                eventHindi: "तथागत का दूसरी बार लंकागमन — नागद्वीप में 80 करोड़ नाग सेना को पंचशील दिया; राजायतन वृक्ष चैत्य की स्थापना",
                note: "On Caitra Amāvasyā (New Moon)"
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
                eventEn: "Birth of Siddhattha Gotama Bodhisatta at Lumbinī Sāl Grove; seven steps, 'I am the foremost in the world...'",
                eventHindi: "सिद्धार्थ गौतम बोधिसत्व का जन्म — लुंबिनी साल वन में; सात कदम, 'अग्रोऽहमस्मि लोकस्य...' उद्घोष"
            },
            {
                eventEn: "Attainment of Sammāsambuddhahood — under the Bodhi tree, Uruvelā; Sujātā's milk-rice offering; defeat of Māra",
                eventHindi: "सम्यक सम्बुद्धत्व प्राप्ति — उरुवेला में बोधि वृक्ष के नीचे; सुजाता का खीर भोजन; मार को परास्त किया"
            },
            {
                eventEn: "Mahāparinibbāna — at Upavattana Sāl Grove, Kusīnarā, at age 80",
                eventHindi: "महापरिनिर्वाण — कुशीनारा में उपवर्तन साल वन में 80 वर्ष की आयु में"
            },
            {
                eventEn: "Seven co-born (saptasahajāta): Yasodharā, Ānanda, Channa, Kāḷudāyi, horse Kaṇṭhaka, Uposatha-kula elephant, Vajrāsana Bodhi tree",
                eventHindi: "सप्त सहजात वस्तुओं का जन्म — यशोधरा, आनंद, छन्न, कालुदाई, कंथक अश्व, उपोसथ कुल का हाथी, वज्रासन बोधि वृक्ष"
            },
            {
                eventEn: "Third visit of the Tathāgata to Laṅkā — Kelaniya; footprint at Sumanakūṭa (Sri Pāda / Adam's Peak)",
                eventHindi: "तथागत का तीसरी बार लंका आगमन — मणिअक्खिक नाग राजा के निमंत्रण पर; सुमनकूट (Adam's Peak) पर पद-चिन्ह"
            },
            {
                eventEn: "Buddha's prophecy to Sakka: 'My sāsana will be established in Laṅkā'; arrival of Prince Vijaya",
                eventHindi: "भगवान की भविष्यवाणी — 'देवेंद्र! लंका में मेरा शासन स्थापित होगा'; लंका में विजय राजकुमार का आगमन"
            },
            {
                eventEn: "Parinibbāna of Arahant Ānanda at age 120 — aerial miracle above Rohiṇī river",
                eventHindi: "अरहंत आनंद मुनि का परिनिर्वाण — 120 वर्ष की आयु में रोहिणी नदी के ऊपर आकाश में ऋद्धि-चमत्कार करके"
            },
            {
                eventEn: "Chaṭṭha Saṅgāyana (6th Buddhist Council), Suvannabhūmi (Burma), 1954–1956; Tripiṭaka recited and purified",
                eventHindi: "छट्ठ संगायन (6th Buddhist Council), सुवर्णभूमि (बर्मा), 1954–1956; त्रिपिटक पाठ और शुद्धिकरण"
            }
        ]
    },
    {
        masaIndex: 2, // Jyeshtha
        monthHindi: 'ज्येष्ठ पूर्णिमा',
        monthTransliterated: 'Jyeṣṭha Purnima',
        keyEvents: [
            {
                eventEn: "Arahant Mahā Mahinda (son of Emperor Aśoka) arrives in Laṅkā; teaches 40,000 men; first Uposathagāra established",
                eventHindi: "अरहंत महामहेंद्र मुनि (सम्राट अशोक के पुत्र) का श्रीलंका आगमन — मिस्सक पर्वत पर; 40,000 पुरुषों को धम्म उपदेश; लंका में उपोसथगार की स्थापना",
                suttaCited: "Cūḷahatthipadopama Sutta; Devadhūta Sutta; Bālapaṇḍita Sutta; Dhammacakkappavattana Sutta"
            },
            {
                eventEn: "Mahinda's honorific titles and Poson festival in Laṅkā",
                note: "Mahinda's titles: 'Anubuddha', 'Satthu-sadisa', 'Dīpappasādaka', 'Paṭhamāguru'. Laṅkā celebrates 'Rajya Poson' festival."
            },
            {
                eventEn: "Third of the Four Signs — sight of a corpse (maraṇa-nimitta); Bodhisatta renounces 'jīvita-mada'",
                eventHindi: "सिद्धार्थ बोधिसत्व को तीसरा निमित्त — मृत देह का दृश्य; 'जीवित-मद' का त्याग"
            },
            {
                eventEn: "Fifth week after Buddhahood — under Ajapāla Nigrodha tree; Māra's three daughters (Taṇhā, Arati, Ragā) defeated",
                eventHindi: "बुद्धत्व के पाँचवें सप्ताह में — अजपाल निग्रोध वृक्ष; मार की तीन पुत्रियों (तण्हा, अरति, रागा) का प्रलोभन विफल"
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
                eventEn: "Bodhisatta descends from Tuṣita heaven into Māyādevī's womb; after Five Great Contemplations",
                eventHindi: "बोधिसत्व तुषित देवलोक से च्युत होकर देवी महामाया के गर्भ में प्रविष्ट — 5 महाविलोकन के बाद"
            },
            {
                eventEn: "Mahābhinishkramaṇa — Siddhattha departs with Channa & Kaṇṭhaka; reaches Anomā River; hair-cutting; donning the robe",
                eventHindi: "महाभिनिष्क्रमण — सिद्धार्थ बोधिसत्व का गृहत्याग; अनोमा नदी तक; केशच्छेदन; चीवर धारण"
            },
            {
                eventEn: "Birth of Prince Rāhula — son of Siddhattha and Yasodharā",
                eventHindi: "राजकुमार राहुल का जन्म — सिद्धार्थ और यशोधरा के पुत्र"
            },
            {
                eventEn: "First Dhamma Discourse — Dhammacakkappavattana Sutta — at Isipatana (Sarnath) to five monks; Aññā Koṇḍañña became first Sotāpanna",
                eventHindi: "प्रथम धम्म प्रवचन — धम्मचक्कप्पवत्तन सुत्त — वाराणसी इसिपत्तन (सारनाथ) में पाँच भिक्षुओं को; अञ्ञा कोण्डञ्ञ प्रथम सोतापन्न",
                paliReference: "Dhammacakkappavattana Sutta, Vinaya Piṭaka"
            },
            {
                eventEn: "Third and final Yamaka Mahāpāṭihāriya; Buddha ascended to Tāvatiṃsa to teach Abhidhamma to his mother",
                eventHindi: "तीसरा और अंतिम यमक महाप्रातिहार्य; तत्पश्चात तावतिंस देवलोक में माता को अभिधम्म देशना"
            },
            {
                eventEn: "Buddha's Vassa in Tāvatiṃsa — 3 months of Abhidhamma teaching; mother Māyā became Sotāpanna",
                eventHindi: "तावतिंस देवलोक में तीन माह अभिधम्म देशना; माता महामाया सोतापन्न हुईं"
            },
            {
                eventEn: "Mahā Mahinda's first Vassa in Laṅkā; Prince Ariṭṭha and 60 Sinhala youths ordained; all attained Arahantship",
                eventHindi: "महामहेंद्र मुनि का लंका में पहला वर्षावास; अरिट्ठ राजकुमार सहित 60 सिंहली कुमारों को प्रव्रज्या; सभी अरहंत हुए"
            },
            {
                eventEn: "Foundation stone of Ruvanvelisāya (Mahāthūpa) Stūpa laid by King Duṭṭhagāmaṇī",
                eventHindi: "रुवनवेळी महास्तूप की नींव — राजा दुत्थगामिणी के हाथ से"
            },
            {
                eventEn: "Buddha's Tooth Relic brought from Kaliṅga to Anurādhapura by Princess Hemamālā and Dantakumāra; 'Āsāḷha Perahera' established",
                eventHindi: "बुद्ध का दंत-धातु कलिंग देश से श्रीलंका पहुँचा — हेममाला और दंतकुमार द्वारा; 'असाल्ह पेरहेर' महोत्सव की शुरुआत"
            },
            {
                eventEn: "Beginning of Vassāvāsa (Rains Retreat)",
                note: "Vassāvāsa begins on Āṣāḍha Purnima and ends on Āśvina Purnima (first Vassa). Second Vassa: Śrāvaṇa Purnima to Kārtika Purnima."
            }
        ]
    },
    {
        masaIndex: 4, // Shravana
        monthHindi: 'श्रावण पूर्णिमा',
        monthTransliterated: 'Śrāvaṇa Purnima',
        keyEvents: [
            {
                eventEn: "Ven. Rāhulabhadra attained Arahantship at age 21 upon hearing Cūḷarāhulovāda Sutta; foremost among those desiring training",
                eventHindi: "भंते राहुलभद्र 21 वर्ष की आयु में अरहंत हुए — चुल्ल रहुलोवाद सुत्त सुनकर; 'शिक्षाकामियों में अग्र'",
                paliReference: "Cūḷarāhulovāda Sutta"
            },
            {
                eventEn: "3 months after Mahāparinibbāna — Arahant Ānanda attained Arahantship; foremost in learning among 80 Mahā-sāvakas",
                eventHindi: "भगवान बुद्ध के परिनिर्वाण के 3 महीने बाद — अरहंत आनंद मुनि अरहंत हुए; 80 महाश्रावकों में बहुश्रुतों में अग्र"
            },
            {
                eventEn: "First Dhamma Saṅgīti — led by Mahākaśyapa with 500 Arahants at Saptaparṇī Cave, Rājagīr; lasted 7 months",
                eventHindi: "प्रथम धम्म संगीति — अरहंत महाकाश्यप के नेतृत्व में 500 अरहंतों द्वारा; सप्तपर्णी गुफा, राजगीर; 7 महीने चली"
            },
            {
                eventEn: "Foundation stone for Buddha's forehead relic Stūpa laid in Laṅkā by King Kāvantissa",
                eventHindi: "भगवान बुद्ध के ललाटास्थि धातु हेतु मंगल-शिला — राजा कावनतिस्स द्वारा श्रीलंका में"
            },
            {
                eventEn: "Two-week Tooth Relic Festival at Dalada Māligāva, Kandy; grand pūjā on Śrāvaṇa Purnima",
                eventHindi: "कैंडी दंत-धातु मंदिर में 2-सप्ताह पूजा उत्सव; श्रावण पूर्णिमा को महापूजा का समापन"
            },
            {
                eventEn: "Second Vassa begins (Bhādrapada Kṛṣṇa Pratipadā)",
                note: "Second Vassa begins day after Śrāvaṇa Purnima (Bhādrapada Kṛṣṇa Pratipadā); ends on Kārtika Purnima."
            }
        ]
    },
    {
        masaIndex: 5, // Bhadrapada
        monthHindi: 'भाद्रपद पूर्णिमा',
        monthTransliterated: 'Bhādrapada Purnima',
        keyEvents: [
            {
                eventEn: "Founding of the Bhikkhunī Saṅgha — Mahāprajāpatī Gautamī accepted Eight Garudhammas at Vesālī; 500 Kṣatriya women ordained",
                eventHindi: "भिक्षुणी संघ की स्थापना — महाप्रजापति गौतमी द्वारा आठ गरुधम्म स्वीकार कर उपसम्पदा; वैशाली में; 500 क्षत्रिय महिलाओं को प्रव्रज्या",
                note: "5th year of Buddhahood; Vassa at Vesālī; preceded by Rohiṇī river dispute; 250+250 princes ordained"
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
                eventEn: "End of First Vassa; Kaṭhina Cīvara month begins",
                note: "First Vassa ends today. Kaṭhina Cīvara month begins (Āśvina PM → Kārtika PM). Vassa Pavāraṇā performed by monks."
            },
            {
                eventEn: "Devāvarohaṇa — Tathāgata descends from Tāvatiṃsa to Saṅkissa after Abhidhamma teaching; 'Acala Cetiya' established",
                eventHindi: "तावतिंस देवलोक से 3 महीने बाद तथागत संकिस्स में मानव-लोक में अवतरण — 'देवावरोहण दिवस'"
            },
            {
                eventEn: "Metteyya Bodhisatta (then a Brahmin youth) ordained upon witnessing the Devāvarohaṇa miracle",
                eventHindi: "मैत्रेय बोधिसत्व (तब एक ब्राह्मण कुमार) का प्रव्रज्या ग्रहण — देवावरोहण चमत्कार देखकर"
            },
            {
                eventEn: "Title 'Foremost in Great Wisdom' conferred on Sāriputta",
                eventHindi: "'महाप्रज्ञावानों में अग्र' उपाधि — तथागत ने सारिपुत्त मुनि को प्रदान की",
                paliReference: "Etadagga-pāli"
            },
            {
                eventEn: "First recitation of Vinaya Piṭaka in Laṅkā at Thūpārāma by Mahā Mahinda and 68,000 Arahant monks",
                eventHindi: "महामहेंद्र मुनि सहित 68,000 सिंहल अरहंतों द्वारा थूपाराम में विनय-पिटक का पहली बार संगायन"
            },
            {
                eventEn: "Mahābodhi southern branch miracle — Aśoka's saccakiriyā; branch rose into sky for a week; emitted six-colored rays",
                eventHindi: "महाबोधि वृक्ष दक्षिण शाखा चमत्कार — सम्राट अशोक की सत्यक्रिया; शाखा स्वयं अलग होकर आकाश में; 6-रंगी किरणें"
            },
            {
                eventEn: "Parinibbāna of Mahā Mahinda at age 80; cremation on Āśvina Purnima — 'Mahā Mahinda Aṣṭamī'",
                eventHindi: "महामहेंद्र मुनि का परिनिर्वाण — 80 वर्ष की आयु में; अंत्येष्टि आश्विन पूर्णिमा को — 'महा महेंद्र अष्टमी'"
            }
        ]
    },
    {
        masaIndex: 7, // Kartika
        monthHindi: 'कार्तिक पूर्णिमा',
        monthTransliterated: 'Kārtika Purnima',
        keyEvents: [
            {
                eventEn: "End of Kaṭhina Cīvara month and Second Vassa",
                note: "Kaṭhina Cīvara month ends today. Second Vassa also ends today."
            },
            {
                eventEn: "Tathāgata's Mission Instruction to 60 Arahants: 'Go forth for the welfare of the many, for the happiness of the many...'",
                eventHindi: "तथागत ने 60 अरहंतों को 'चरथ भिक्खवे चारिकं — बहुजनहिताय, बहुजनसुखाय...' अनुशासन दिया",
                paliReference: "Mahāvagga, Vinaya Piṭaka"
            },
            {
                eventEn: "End of first Vassa; Tathāgata departed for Uruvelā to convert the Kassapa brothers",
                eventHindi: "तथागत ने पहला वर्षावास समाप्त कर उरुवेला की यात्रा शुरू की — काश्यप बंधुओं को धम्म-दीक्षा देने"
            },
            {
                eventEn: "Metteyya Bodhisatta received Niyata-Vivaraṇa (prophecy of future Buddhahood) from Gautama Buddha",
                eventHindi: "मैत्रेय बोधिसत्व को 'नियत-विवरण' (भावी बुद्धत्व की भविष्यवाणी) मिली — गौतम बुद्ध द्वारा"
            },
            {
                eventEn: "Parinibbāna of Sāriputta at Nālaka (Nālandā); his mother attained Sotāpatti through his final teaching",
                eventHindi: "अग्रश्रावक सारिपुत्त मुनि का परिनिर्वाण — नालक (नालंदा) में; माता को स्रोतापन्न किया"
            },
            {
                eventEn: "Parinibbāna of Mahā Moggallāna at Kāḷasilā Pabbata, Rājagīr",
                note: "2 weeks after Sāriputta's Parinibbāna — Parinibbāna of Mahā Moggallāna at Kāḷasilā Pabbata, Rājagīr (Mārgaśīrṣa Amāvasyā)"
            },
            {
                eventEn: "Construction of Thūpārāma Stūpa begins with Buddha's right clavicle relic; 30,000 youth ordained same day",
                eventHindi: "थूपाराम स्तूप का निर्माण आरंभ — बुद्ध की दाहिनी हंसली धातु; 30,000 युवा उसी दिन प्रव्रजित हुए"
            },
            {
                eventEn: "Kattika Pūjā — Mahābodhi tree at Anurādhapura adorned with golden robes and thousands of oil lamps",
                eventHindi: "श्रीलंका में 'कार्तिक पूजा' — महाबोधि वृक्ष को सुनहरे वस्त्र और हजारों दीपकों से महापूजा"
            },
            {
                eventEn: "Kattika Pūja at Dalada Māligāva, Kandy — Mahādīpadānotsava; thousands of oil lamps",
                eventHindi: "कैंडी दंत-धातु मंदिर में 'कार्तिक पूजोत्सव' — महादीपदानोत्सव"
            }
        ]
    },
    {
        masaIndex: 8, // Margashirsha
        monthHindi: 'मार्गशीर्ष पूर्णिमा',
        monthTransliterated: 'Mārgaśīrṣa Purnima',
        keyEvents: [
            {
                eventEn: "Arrival of Arahantī Saṅghamittā (Aśoka's daughter) in Laṅkā with the southern Mahābodhi branch; planted at Mahāmeghavana, Anurādhapura",
                eventHindi: "अरहंत संघमित्रा महाथेरी (सम्राट अशोक की पुत्री) का श्रीलंका आगमन — महाबोधि वृक्ष की दक्षिण शाखा के साथ; अनुराधपुर महामेघ वन में प्रतिष्ठापित",
                note: "Journey: Mārgaśīrṣa Pratipadā (departed Tāmralipti) → Śukla Saptamī (arrived Jambukolapattana) → Purnima (planted at Anurādhapura)"
            },
            {
                eventEn: "Founding of Bhikkhunī Saṅgha in Laṅkā — Anulādevī and 500 Kṣatriya women ordained; all attained Arahantship",
                eventHindi: "श्रीलंका में भिक्षुणी संघ की शुरुआत — अनुलादेवी सहित 500 क्षत्रिय रानियों को प्रव्रज्या; सभी अरहंत हुए"
            },
            {
                eventEn: "Parinibbāna of Mahā Moggallāna — Mārgaśīrṣa Amāvasyā",
                note: "Parinibbāna of Mahā Moggallāna — Mārgaśīrṣa Amāvasyā, at Kāḷasilā Pabbata, Rājagīr"
            }
        ]
    }
];
