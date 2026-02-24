
import React, { useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import {
    closeCircleOutline,
    shieldCheckmarkOutline,
    bodyOutline,
    waterOutline,
    restaurantOutline,
    flowerOutline,
    infiniteOutline,
    alertCircleOutline,
    moonOutline,
    starOutline,
    calendarOutline,
    analyticsOutline
} from 'ionicons/icons';
import './DailyRoutineRef.css';

interface DailyRoutineRefProps {
    onClose: () => void;
}

type SectionType = 'foundations' | 'purity' | 'life' | 'recitation' | 'conduct' | 'siddhi';

const DailyRoutineRef: React.FC<DailyRoutineRefProps> = ({ onClose }) => {
    const [activeSection, setActiveSection] = useState<SectionType>('foundations');

    const renderContent = () => {
        switch (activeSection) {
            case 'foundations':
                return (
                    <div className="routine-content-area">
                        <h4 className="routine-section-heading"><IonIcon icon={shieldCheckmarkOutline} /> <span>1. Foundational Prerequisites</span></h4>
                        <div className="routine-text-block">These are permanent conditions, not daily actions:</div>
                        <ul className="routine-list">
                            <li className="routine-list-item"><strong>Arouse faith in the Sugata</strong> and with it arouse <strong>bodhicitta</strong> <span className="routine-verse-ref">(1.13)</span></li>
                            <li className="routine-list-item"><strong>Cast aside greed, arrogance, and conceit</strong>; faithfully serve the Three Jewels <span className="routine-verse-ref">(1.14)</span></li>
                            <li className="routine-list-item"><strong>Observe samaya</strong> with the vajra clan — without it, mantra recitation brings ruin <span className="routine-verse-ref">(1.28)</span></li>
                            <li className="routine-list-item"><strong>Prātimokṣa discipline</strong>: a householder mantrin abandons only the outer monastic signs and rites, and trains in all the rest of the Vinaya <span className="routine-verse-ref">(1.32)</span></li>
                            <li className="routine-list-item"><strong>Find a qualified assistant</strong> — intelligent, clean, inclined toward Dharma, faithful to the Three Jewels <span className="routine-verse-ref">(1.37–1.39)</span></li>
                            <li className="routine-list-item"><strong>Dwelling</strong>: hut near a pleasant town, warm, plastered with clay; door facing east, north, or west — never south <span className="routine-verse-ref">(2.3, 2.10)</span></li>
                            <li className="routine-list-item"><strong>Shrine</strong>: cloth image of the Victor facing west, or a beautiful wooden image <span className="routine-verse-ref">(2.4–2.7)</span></li>
                        </ul>
                    </div>
                );
            case 'purity':
                return (
                    <div className="routine-content-area">
                        <h4 className="routine-section-heading"><IonIcon icon={bodyOutline} /> <span>2. Appearance</span></h4>
                        <ul className="routine-list">
                            <li className="routine-list-item">Hair <strong>tied in a topknot and shaved</strong>, clothes dyed with mineral dyes <span className="routine-verse-ref">(2.8)</span></li>
                            <li className="routine-list-item">Wear <strong>white garb</strong>, or clothing made of leaves, hemp, flax, or bark <span className="routine-verse-ref">(2.8)</span></li>
                            <li className="routine-list-item">Alms bowl: <strong>gourd, iron, or clay</strong> — round, smooth, undamaged, free of cracks <span className="routine-verse-ref">(2.9)</span></li>
                        </ul>

                        <h4 className="routine-section-heading"><IonIcon icon={waterOutline} /> <span>3. Ritual Purification</span></h4>
                        <div className="routine-text-block">The text prescribes bathing <strong>on the three occasions</strong> (2.31):</div>
                        <div className="numbered-grid">
                            <div className="numbered-item"><span className="item-number">1</span> <span className="item-content">Greater and lesser external washing</span></div>
                            <div className="numbered-item"><span className="item-number">2</span> <span className="item-content">After eating food</span></div>
                            <div className="numbered-item"><span className="item-number">3</span> <span className="item-content">Mantra recitation</span></div>
                        </div>

                        <h5 className="sub-heading-routine">Bathing Procedure (Chapter 11)</h5>
                        <ul className="routine-list">
                            <li className="routine-list-item">Smear the body with earth before stepping into clean water <span className="routine-verse-ref">(11.12)</span></li>
                            <li className="routine-list-item">Emerge from water facing <strong>east or north</strong> <span className="routine-verse-ref">(11.12)</span></li>
                            <li className="routine-list-item">Wash hands and feet; squat with legs open; cup water noiselessly without bubbles <span className="routine-verse-ref">(11.12–11.13)</span></li>
                            <li className="routine-list-item">Take <strong>three sips of water</strong>, wipe lips twice, close teeth, touch with the tongue <span className="routine-verse-ref">(11.13)</span></li>
                            <li className="routine-list-item">If coughing, rinse again <span className="routine-verse-ref">(11.13)</span></li>
                        </ul>

                        <h5 className="sub-heading-routine">Toilet Hygiene (11.18)</h5>
                        <ul className="routine-list">
                            <li className="routine-list-item">Clean anus <strong>five times</strong></li>
                            <li className="routine-list-item">Clean genitals <strong>three times</strong></li>
                            <li className="routine-list-item">Clean left hand <strong>three times</strong>, both hands <strong>seven times</strong></li>
                        </ul>
                    </div>
                );
            case 'life':
                return (
                    <div className="routine-content-area">
                        <h4 className="routine-section-heading"><IonIcon icon={restaurantOutline} /> <span>4. Alms Round (Chapter 2)</span></h4>
                        <ul className="routine-list">
                            <li className="routine-list-item">Go for alms <strong>gazing a plow's length ahead</strong>, guarding against the six senses and sense objects <span className="routine-verse-ref">(2.24)</span></li>
                            <li className="routine-list-item">Walk in <strong>silence</strong>, with a mentally disciplined mind <span className="routine-verse-ref">(2.27)</span></li>
                            <li className="routine-list-item">Return with all alms received; <strong>share the first portion</strong> as one pleases; <strong>wash feet</strong>; give some to guests; then eat to care for the body <span className="routine-verse-ref">(2.30)</span></li>
                        </ul>

                        <h5 className="sub-heading-routine">Never go where:</h5>
                        <ul className="routine-list">
                            <li className="routine-list-item">Calves and young cows are present</li>
                            <li className="routine-list-item">People are drinking alcohol</li>
                            <li className="routine-list-item">Young women serve and play</li>
                            <li className="routine-list-item">Young men sport</li>
                            <li className="routine-list-item">Dog meat is served at a feast</li>
                            <li className="routine-list-item">Many people gather</li>
                            <li className="routine-list-item">Music is played</li>
                        </ul>
                        <div className="routine-text-block"><span className="routine-verse-ref">(2.28–2.29)</span></div>

                        <h4 className="routine-section-heading"><IonIcon icon={restaurantOutline} /> <span>5. Meals</span></h4>
                        <ul className="routine-list">
                            <li className="routine-list-item">Eat <strong>before noon</strong> — upholders of the eightfold path take food before noon <span className="routine-verse-ref">(2.15)</span></li>
                            <li className="routine-list-item">Eat in <strong>moderation</strong> — like a scale brought into balance; neither too much nor too little <span className="routine-verse-ref">(2.21)</span></li>
                            <li className="routine-list-item">Know the body to be like a <strong>plantain tree</strong> — do not let the mind desire food and drink <span className="routine-verse-ref">(2.23)</span></li>
                        </ul>

                        <div className="routine-table-container">
                            <table className="routine-table">
                                <thead>
                                    <tr><th>Permitted Foods (3.27)</th><th>Forbidden Foods (3.26)</th></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Three white foods, roots, stalks, fruits, and vegetables; yogurt, barley, milk, and ghee; oil cakes, buttermilk, boiled milk, and broth</td>
                                        <td>Meat and alcohol; garlic, wild garlic, and onions; grain oil, sesame, radishes, and yams; food for bhūtas, food offerings, or oblations to Paśupati</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'recitation':
                return (
                    <div className="routine-content-area">
                        <h4 className="routine-section-heading"><IonIcon icon={infiniteOutline} /> <span>6. Offerings and Pre-Recitation Rites (Chapter 6)</span></h4>
                        <div className="routine-text-block">After eating and bathing, before sitting to recite (2.31, 6.15–6.17):</div>

                        <div className="numbered-grid">
                            <div className="numbered-item">
                                <span className="item-number">1</span>
                                <span className="item-content"><strong>Smear the ground</strong> where the deity will rest with a mixture of soil and cow dung <span className="routine-verse-ref">(6.15)</span></span>
                            </div>
                            <div className="numbered-item">
                                <span className="item-number">2</span>
                                <span className="item-content"><strong>Make offerings of garlands, foods, flowers, fragrance, and lamps</strong> to all the Sugatas <span className="routine-verse-ref">(6.15)</span></span>
                            </div>
                            <div className="numbered-item">
                                <span className="item-number">3</span>
                                <span className="item-content"><strong>Worship Vajrapāṇi and his retinue</strong>, then make offerings to the mantra deities <span className="routine-verse-ref">(6.16)</span></span>
                            </div>
                            <div className="numbered-item">
                                <span className="item-number">4</span>
                                <span className="item-content"><strong>Sing the praises</strong> of the praiseworthy buddhas <span className="routine-verse-ref">(6.17)</span></span>
                            </div>
                            <div className="numbered-item">
                                <span className="item-number">5</span>
                                <span className="item-content"><strong>Reflect on bodhicitta</strong> and cultivate compassion for beings tormented by birth, old age, sickness, and death <span className="routine-verse-ref">(6.17)</span></span>
                            </div>
                        </div>

                        <blockquote>
                            If incense and fragrant unguents are unavailable, offer fragrant flowers — but avoid <em>buka</em> (Spermacoce hispida), <em>arka</em>, <em>bilva</em>, <em>bhaṭa</em>, and <em>kuśa</em>, as they smell bad and are unappealing <span className="routine-verse-ref">(2.32, footnote 64)</span>
                        </blockquote>

                        <h4 className="routine-section-heading"><IonIcon icon={calendarOutline} /> <span>7. Auspicious Dates to Begin Recitation</span></h4>
                        <p className="routine-text-block">Begin recitation on the <strong>15th, 8th, or 14th day of the waxing moon</strong> <span className="routine-verse-ref">(6.14)</span></p>

                        <h4 className="routine-section-heading"><IonIcon icon={analyticsOutline} /> <span>8. Recitation Session (Chapters 3–5)</span></h4>

                        <h5 className="sub-heading-routine">Seat and Posture</h5>
                        <ul className="routine-list">
                            <li className="routine-list-item">Sit on a <strong>mat of kuśa grass</strong> <span className="routine-verse-ref">(2.31, 3.29)</span></li>
                            <li className="routine-list-item">Body <strong>straight and steady</strong>, senses restrained <span className="routine-verse-ref">(3.5)</span></li>
                        </ul>

                        <h5 className="sub-heading-routine">The Mālā</h5>
                        <ul className="routine-list">
                            <li className="routine-list-item"><strong>108 beads</strong> of bodhi seed, conch, crystal, rudrākṣa, soapberry, lotus seed, lead, copper, or bronze <span className="routine-verse-ref">(3.3)</span></li>
                            <li className="routine-list-item">Hold carefully in the <strong>left hand</strong> or grip in the <strong>right</strong>; count one by one <span className="routine-verse-ref">(3.4)</span></li>
                        </ul>

                        <h5 className="sub-heading-routine">The Vajra</h5>
                        <ul className="routine-list">
                            <li className="routine-list-item"><strong>Pick up the vajra</strong> when recitation begins; place it at the Victor's feet when complete <span className="routine-verse-ref">(4.10)</span></li>
                            <li className="routine-list-item">No vajra available? <strong>Make a fist and recite with focus</strong> <span className="routine-verse-ref">(4.11)</span></li>
                        </ul>

                        <div className="routine-table-container">
                            <table className="routine-table">
                                <thead>
                                    <tr><th>Material</th><th>Purpose</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>Gold</td><td>Attaining the vidyādhara state or lands</td></tr>
                                    <tr><td>Silver</td><td>Kingship</td></tr>
                                    <tr><td>Copper</td><td>Nāgas and jewels</td></tr>
                                    <tr><td>Stone</td><td>Destroying asura magical devices</td></tr>
                                    <tr><td>Triple-alloy</td><td>Success in all aims</td></tr>
                                    <tr><td>Iron</td><td>Smashing guhyaka armies</td></tr>
                                    <tr><td>Khadira wood</td><td>Malevolent forces</td></tr>
                                    <tr><td>Bilva wood</td><td>Glory, prosperity, health, and riches</td></tr>
                                    <tr><td>Madu wood</td><td>Yakṣas and mātṛkās</td></tr>
                                    <tr><td>Aśvattha wood</td><td>Dharma purposes</td></tr>
                                    <tr><td>Human bone</td><td>Assailing murderers and enemies</td></tr>
                                    <tr><td>Crystal</td><td>Great illusions</td></tr>
                                    <tr><td>Neem</td><td>Separation</td></tr>
                                    <tr><td>Beleric myrobalan</td><td>Killing, desiccating, and piśācas</td></tr>
                                    <tr><td>Cedar</td><td>Devas, yakṣas, and gandharvas</td></tr>
                                    <tr><td>Nāga tree root</td><td>Mastery over nāgas</td></tr>
                                    <tr><td>Earth</td><td>Shapeshifting</td></tr>
                                    <tr><td>Kadamba wood</td><td>Success with vetālas</td></tr>
                                    <tr><td>Puṇṇāga wood</td><td>Wealth</td></tr>
                                    <tr><td>Arjuna tree</td><td>Victory in battle</td></tr>
                                    <tr><td>White or red sandalwood</td><td>All pleasing and desirable aims</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <h5 className="sub-heading-routine">Recitation Technique</h5>
                        <ul className="routine-list">
                            <li className="routine-list-item">Move the <strong>lower lip gently</strong> — at a whisper <span className="routine-verse-ref">(3.5)</span></li>
                            <li className="routine-list-item"><strong>Neither quick nor slow</strong>, neither loud nor too soft <span className="routine-verse-ref">(5.28)</span></li>
                            <li className="routine-list-item">Not while conversing or distracted <span className="routine-verse-ref">(5.28)</span></li>
                            <li className="routine-list-item">Vowels, nasalizations, and punctuation must be <strong>correct and complete</strong> <span className="routine-verse-ref">(5.28)</span></li>
                            <li className="routine-list-item">Focus on the <strong>tip of the nose</strong> and give up thoughts <span className="routine-verse-ref">(5.31)</span></li>
                        </ul>

                        <h5 className="sub-heading-routine">Managing the Mind During Recitation</h5>
                        <ul className="routine-list">
                            <li className="routine-list-item">Against <strong>drowsiness</strong>: stand, move around, look around, splash water on the face <span className="routine-verse-ref">(3.7)</span></li>
                            <li className="routine-list-item">Against <strong>strong desire</strong>: note the impurity of muscle, fat, skin, and bones <span className="routine-verse-ref">(3.11)</span></li>
                            <li className="routine-list-item">Against <strong>anger</strong>: douse with the water of affection and compassion <span className="routine-verse-ref">(3.11)</span></li>
                            <li className="routine-list-item">Against <strong>stupidity</strong>: apply the path of interdependence <span className="routine-verse-ref">(3.11)</span></li>
                        </ul>

                        <h5 className="sub-heading-routine">Silence Rule</h5>
                        <ul className="routine-list">
                            <li className="routine-list-item"><strong>No speaking</strong> with brahmins, kṣatriyas, vaiśyas, farmers, women, paṇḍakas, or young boys and girls during recitation <span className="routine-verse-ref">(3.14)</span></li>
                            <li className="routine-list-item">May speak with the <strong>attendant only</strong> <span className="routine-verse-ref">(3.15)</span></li>
                            <li className="routine-list-item">After speaking, or after expelling mucus, feces, or urine — <strong>must immerse in water and bathe</strong> <span className="routine-verse-ref">(3.15)</span></li>
                        </ul>

                        <h5 className="sub-heading-routine">After Recitation</h5>
                        <ul className="routine-list">
                            <li className="routine-list-item"><strong>Perform rites of protection</strong>, repeat the maṇḍala rites <span className="routine-verse-ref">(4.24)</span></li>
                            <li className="routine-list-item">Make offerings of fragrance; <strong>bow with faith</strong> and place the vajra at the Victor's feet <span className="routine-verse-ref">(4.10)</span></li>
                            <li className="routine-list-item"><strong>Request the deity's departure</strong> as the ritual specifies <span className="routine-verse-ref">(3.29)</span></li>
                        </ul>

                        <h5 className="sub-heading-routine">When Weary of Recitation (6.18)</h5>
                        <p className="routine-text-block">Read in order: 1. Sūtra of the Great Assembly, 2. Auspicious Verses, 3. The Supreme Wheel of Dharma, 4. The Secret of the Thus-Gone Ones, 5. The Great Lamp.</p>
                    </div>
                );
            case 'conduct':
                return (
                    <div className="routine-content-area">
                        <h4 className="routine-section-heading"><IonIcon icon={infiniteOutline} /> <span>9. Continuous Throughout the Day <small className="routine-verse-ref">(2.33)</small></span></h4>
                        <div className="routine-text-block">
                            At all times — standing, seated, lying down, asleep, moving, eating, reading, or reciting — bring to mind the <strong>six recollections</strong>, remaining aware of their respective qualities:
                            <span className="routine-verse-inline">(per Notes on the Meaning, footnote 65)</span>
                        </div>

                        <div className="recollection-grid">
                            <div className="recollection-item"><span className="recollection-number">1</span> The Buddha</div>
                            <div className="recollection-item"><span className="recollection-number">2</span> The Dharma</div>
                            <div className="recollection-item"><span className="recollection-number">3</span> The Saṅgha</div>
                            <div className="recollection-item"><span className="recollection-number">4</span> The deity</div>
                            <div className="recollection-item"><span className="recollection-number">5</span> Generosity</div>
                            <div className="recollection-item"><span className="recollection-number">6</span> Discipline</div>
                        </div>

                        <h4 className="routine-section-heading"><IonIcon icon={starOutline} /> <span>10. Ongoing Merit-Building</span></h4>
                        <ul className="routine-list">
                            <li className="routine-list-item">Continuously erect <strong>caityas</strong> of sand or clay containing the Essence of Dependent Arising in a clean, secluded place <span className="routine-verse-ref">(1.34)</span></li>
                            <li className="routine-list-item">Before caityas and statues: <strong>sing praise, offer fragrances, garlands, and lamps</strong>, using parasols, banners, flags, and music <span className="routine-verse-ref">(1.35)</span></li>
                            <li className="routine-list-item"><strong>Dedicate all merit</strong> to the highest awakening — for long life, Dharma-conducive places, freedom from weariness, and fulfilling the hopes of all beings <span className="routine-verse-ref">(3.16–3.20)</span></li>
                        </ul>

                        <h4 className="routine-section-heading"><IonIcon icon={alertCircleOutline} /> <span>11. Conduct and Prohibitions</span></h4>
                        <div className="routine-table-container">
                            <table className="routine-table">
                                <thead>
                                    <tr><th>Category</th><th>Instruction</th><th>Verse</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td><strong>Speech</strong></td><td>Forsake harsh speech, slander, and useless talk</td><td>1.15</td></tr>
                                    <tr><td><strong>Precepts</strong></td><td>Forsake visiting the woman of another, lying, and stealing</td><td>1.15</td></tr>
                                    <tr><td><strong>Killing / Harm</strong></td><td>Forsake killing, doing harm, and using alcohol</td><td>1.15</td></tr>
                                    <tr><td><strong>Body</strong></td><td>Abstain from posturing, jumping, dancing, singing, beating drums, earning people's derision, arrogance, deception, excessive desire, gambling, and social events</td><td>3.24</td></tr>
                                    <tr><td><strong>Mind</strong></td><td>Give up ill-timed sleep, pointless talk, reading and reciting false treatises, attachment, spite, haughtiness, conceit, resentment, laziness, and cunning</td><td>3.25</td></tr>
                                    <tr><td><strong>Idle talk</strong></td><td>No gossip about the realm, kings, war, wrestlers, women, fantastical tales, histories, desires, or sex work</td><td>8.8</td></tr>
                                    <tr><td><strong>Places</strong></td><td>Do not frequent towns, cities, homes, monasteries, caityas, hermitages, pleasure gardens, ponds, or pools</td><td>8.9</td></tr>
                                    <tr><td><strong>Diet</strong></td><td>No meat, alcohol, garlic, wild garlic, onions, grain oil, sesame, radishes, or yams</td><td>3.26</td></tr>
                                    <tr><td><strong>Offerings</strong></td><td>Avoid bad-smelling flowers: <em>buka</em>, <em>arka</em>, <em>bilva</em>, <em>bhaṭa</em>, <em>kuśa</em></td><td>2.32</td></tr>
                                    <tr><td><strong>Contact</strong></td><td>Do not touch renunciants, men, women, boys, girls, the elderly, or brahmins; if touched — bathe and rinse mouth, then resume</td><td>11.14–11.16</td></tr>
                                    <tr><td><strong>Mantra ethics</strong></td><td>Never suppress, restrict, or disrupt another's mantra; never alter syllables; never change the purpose of a rite; never torment local beings</td><td>5.14–5.16</td></tr>
                                    <tr><td><strong>Other deities</strong></td><td>Relying on other deities instead of having faith in the Buddha brings ruin</td><td>1.28</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <h4 className="routine-section-heading"><IonIcon icon={calendarOutline} /> <span>12. Seasonal Rules (Chapter 8)</span></h4>
                        <ul className="routine-list">
                            <li className="routine-list-item"><strong>Summer (three months)</strong>: stay in one place; engage only in recitation; do not seek accomplishment <span className="routine-verse-ref">(8.12–8.13)</span></li>
                            <li className="routine-list-item"><strong>After summer</strong>: perform self-protection rites and take up the main practice <span className="routine-verse-ref">(8.13)</span></li>
                            <li className="routine-list-item"><strong>Winter and spring</strong>: reside at an isolated lake, tree, mountain, pond, house, or riverbank; remain there alone through the summer <span className="routine-verse-ref">(8.11)</span></li>
                        </ul>
                    </div>
                );
            case 'siddhi':
                return (
                    <div className="routine-content-area">
                        <h4 className="routine-section-heading"><IonIcon icon={moonOutline} /> <span>13. Night <small className="routine-verse-ref">(3.29–3.30)</small></span></h4>
                        <div className="numbered-grid">
                            <div className="numbered-item"><span className="item-number">1</span> <span className="item-content">After a full day of activity, complete the final recitation session</span></div>
                            <div className="numbered-item"><span className="item-number">2</span> <span className="item-content"><strong>Request the deity's departure</strong> as the ritual specifies</span></div>
                            <div className="numbered-item"><span className="item-number">3</span> <span className="item-content"><strong>Lay down upon a spread of kuśa grass</strong></span></div>
                            <div className="numbered-item"><span className="item-number">4</span> <span className="item-content">Cultivate <strong>love, compassion, joy, and equanimity</strong></span></div>
                            <div className="numbered-item"><span className="item-number">5</span> <span className="item-content">Bring to mind the <strong>Sugata, Dharma, and Saṅgha</strong></span></div>
                            <div className="numbered-item"><span className="item-number">6</span> <span className="item-content"><strong>Join palms, bow to Vajrapāṇi and Śāriputra</strong>, then sleep</span></div>
                        </div>

                        <h4 className="routine-section-heading"><IonIcon icon={shieldCheckmarkOutline} /> 14. The Seven Requisites for Siddhi (11.24–11.25)</h4>
                        <div className="routine-text-block"><span className="routine-verse-ref">(11.24–11.25)</span></div>
                        <blockquote>
                            <em>"The fundamental root of mantra is discipline, followed by diligence and patience, faith in the victors, bodhicitta, the mantra, and an absence of laziness."</em>
                        </blockquote>
                        <blockquote>
                            <em>"Just as a ruler possessing the seven requisites has no trouble subduing any kind of being, so a mantrin possessing these seven requisites will quickly subdue any evil."</em>
                        </blockquote>
                        <div className="routine-table-container">
                            <table className="routine-table">
                                <thead>
                                    <tr><th>#</th><th>Requisite</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>1</td><td>Discipline</td></tr>
                                    <tr><td>2</td><td>Diligence</td></tr>
                                    <tr><td>3</td><td>Patience</td></tr>
                                    <tr><td>4</td><td>Faith in the Victors</td></tr>
                                    <tr><td>5</td><td>Bodhicitta</td></tr>
                                    <tr><td>6</td><td>The Mantra</td></tr>
                                    <tr><td>7</td><td>Absence of laziness</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
        }
    };

    const sections: { id: SectionType, label: string }[] = [
        { id: 'foundations', label: 'FOUNDATIONS' },
        { id: 'purity', label: 'PURITY' },
        { id: 'life', label: 'DAILY LIFE' },
        { id: 'recitation', label: 'RECITATION' },
        { id: 'conduct', label: 'CONDUCT' },
        { id: 'siddhi', label: 'SIDDHI' },
    ];

    return (
        <div className="routine-container">
            <div className="routine-glass-card">
                <div className="routine-header">
                    <div>
                        <h2 className="routine-title">The Mantrin's Routine</h2>
                        <span className="routine-reference">Subāhu's Questions (Toh 805)</span>
                    </div>
                    <IonButton fill="clear" onClick={onClose} className="close-routine-btn">
                        <IonIcon icon={closeCircleOutline} />
                    </IonButton>
                </div>

                <div className="routine-tabs-grid">
                    {sections.map(s => (
                        <IonButton
                            key={s.id}
                            className="routine-tab-pill"
                            fill={activeSection === s.id ? 'solid' : 'outline'}
                            size="small"
                            onClick={() => setActiveSection(s.id)}
                        >
                            {s.label}
                        </IonButton>
                    ))}
                </div>

                {renderContent()}
            </div>
        </div>
    );
};

export default DailyRoutineRef;
