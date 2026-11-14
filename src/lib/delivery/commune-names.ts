/**
 * Arabic → French (Latin) commune names.
 *
 * The storefront stores communes in Arabic, while delivery APIs built on
 * EcoTrack validate the `commune` field against their own Latin names
 * (e.g. "Alger Centre", "Bab El Oued"). This map lets the dispatcher send a
 * name the carrier recognises. Keys must match the Arabic names used in
 * `ALGERIA_WILAYAS` (src/lib/algeria-data.ts).
 */
export const COMMUNE_FR_NAMES: Record<string, string> = {
  // 01 Adrar
  "أدرار": "Adrar", "تيميمون": "Timimoun", "رقان": "Reggane", "أولف": "Aoulef",
  "زاوية كنتة": "Zaouiet Kounta", "تسفاوت": "Tsabit", "فنوغيل": "Fenoughil",
  // 02 Chlef
  "الشلف": "Chlef", "تنس": "Tenes", "بوقادير": "Boukadir", "وادي الفضة": "Oued Fodda",
  "أولاد فارس": "Ouled Fares", "عين مران": "Ain Merane", "بني حواء": "Beni Haoua",
  // 03 Laghouat
  "الأغواط": "Laghouat", "أفلو": "Aflou", "قصر الحيران": "Ksar El Hirane",
  "سيدي مخلوف": "Sidi Makhlouf", "بريدة": "Brida", "عين ماضي": "Ain Madhi",
  // 04 Oum El Bouaghi
  "أم البواقي": "Oum El Bouaghi", "عين البيضاء": "Ain Beida", "عين مليلة": "Ain M'lila",
  "مسكيانة": "Meskiana", "سيقوس": "Sigus",
  // 05 Batna
  "باتنة": "Batna", "بريكة": "Barika", "عين التوتة": "Ain Touta", "مروانة": "Merouana",
  "أريس": "Arris", "نقاوس": "N'gaous", "المعذر": "El Madher",
  // 06 Béjaïa
  "بجاية": "Bejaia", "أقبو": "Akbou", "أميزور": "Amizour", "سيدي عيش": "Sidi Aich",
  "خراطة": "Kherrata", "تيزي نبربر": "Tizi N'berber", "أوقاس": "Aokas",
  // 07 Biskra
  "بسكرة": "Biskra", "طولقة": "Tolga", "سيدي عقبة": "Sidi Okba", "أولاد جلال": "Ouled Djellal",
  "الوطاية": "El Outaya", "زريبة الوادي": "Zeribet El Oued",
  // 08 Béchar
  "بشار": "Bechar", "القنادسة": "Kenadsa", "بني عباس": "Beni Abbes", "العبادلة": "Abadla",
  "تاغيت": "Taghit", "تبلبالة": "Tabelbala",
  // 09 Blida
  "البليدة": "Blida", "بوفاريك": "Boufarik", "أولاد يعيش": "Ouled Yaich", "العفرون": "El Affroun",
  "موزاية": "Mouzaia", "بوقرة": "Bougara", "الأربعاء": "Larbaa",
  // 10 Bouira
  "البويرة": "Bouira", "الأخضرية": "Lakhdaria", "سور الغزلان": "Sour El Ghozlane",
  "عين بسام": "Ain Bessem", "مشدالة": "M'chedallah", "بئر غبالو": "Bir Ghbalou",
  // 11 Tamanrasset
  "تمنراست": "Tamanrasset", "عين أمقل": "Ain Amguel", "إيدلس": "Idles", "تاظروك": "Tazrouk",
  "أباليسا": "Abalessa",
  // 12 Tébessa
  "تبسة": "Tebessa", "الونزة": "Ouenza", "بئر العاتر": "Bir El Ater", "الشريعة": "Cheria",
  "العوينات": "El Aouinet", "مرسط": "Morsott",
  // 13 Tlemcen
  "تلمسان": "Tlemcen", "مغنية": "Maghnia", "منصورة": "Mansourah", "سبدو": "Sebdou",
  "الغزوات": "Ghazaouet", "ندرومة": "Nedroma", "شتوان": "Chetouane",
  // 14 Tiaret
  "تيارت": "Tiaret", "السوقر": "Sougueur", "فرندة": "Frenda", "قصر الشلالة": "Ksar Chellala",
  "مهدية": "Mahdia", "الرحوية": "Rahouia",
  // 15 Tizi Ouzou
  "تيزي وزو": "Tizi Ouzou", "عزازقة": "Azazga", "ذراع الميزان": "Draa El Mizan",
  "بوغني": "Boghni", "الأربعاء نايث إيراثن": "Larbaa Nath Irathen", "تيقزيرت": "Tigzirt",
  // 16 Alger
  "الجزائر الوسطى": "Alger Centre", "باب الوادي": "Bab El Oued", "حيدرة": "Hydra",
  "سيدي يحيى": "Hydra", "بن عكنون": "Ben Aknoun", "بئر مراد رايس": "Bir Mourad Rais",
  "المرادية": "El Mouradia", "القبة": "Kouba", "حسين داي": "Hussein Dey", "الشراقة": "Cheraga",
  "دالي إبراهيم": "Dely Ibrahim", "الأبيار": "El Biar", "بئر خادم": "Birkhadem",
  "الدار البيضاء": "Dar El Beida", "برج البحري": "Bordj El Bahri", "برج الكيفان": "Bordj El Kiffan",
  "الرويبة": "Rouiba", "الرغاية": "Reghaia", "عين طاية": "Ain Taya", "زرالدة": "Zeralda",
  "سطاوالي": "Staoueli", "عين البنيان": "Ain Benian", "باب الزوار": "Bab Ezzouar",
  "باش جراح": "Bachdjerrah", "الحراش": "El Harrach", "بوزريعة": "Bouzareah", "براقي": "Baraki",
  // 17 Djelfa
  "الجلفة": "Djelfa", "عين وسارة": "Ain Oussera", "مسعد": "Messaad", "حاسي بحبح": "Hassi Bahbah",
  "الشارف": "Charef", "دار الشيوخ": "Dar Chioukh",
  // 18 Jijel
  "جيجل": "Jijel", "طاهير": "Taher", "الميلية": "El Milia", "العوانة": "El Aouana",
  "زيامة منصورية": "Ziama Mansouriah", "الشقفة": "Chekfa",
  // 19 Sétif
  "سطيف": "Setif", "العلمة": "El Eulma", "عين ولمان": "Ain Oulmene", "عين الكبيرة": "Ain El Kebira",
  "عين أرنات": "Ain Arnat", "بوقاعة": "Bougaa", "جميلة": "Djemila",
  // 20 Saïda
  "سعيدة": "Saida", "عين الحجر": "Ain El Hadjar", "يوب": "Youb", "الحساسنة": "El Hassasna",
  "أولاد خالد": "Ouled Khaled",
  // 21 Skikda
  "سكيكدة": "Skikda", "القل": "Collo", "عزابة": "Azzaba", "الحروش": "El Harrouch",
  "تمالوس": "Tamalous", "رمضان جمال": "Ramdane Djamel",
  // 22 Sidi Bel Abbès
  "سيدي بلعباس": "Sidi Bel Abbes", "تلاغ": "Telagh", "سفيزف": "Sfisef", "بن باديس": "Ben Badis",
  "سيدي علي بوسيدي": "Sidi Ali Boussidi", "تنيرة": "Tenira",
  // 23 Annaba
  "عنابة": "Annaba", "البوني": "El Bouni", "سيدي عمار": "Sidi Amar", "برحال": "Berrahal",
  "الحجار": "El Hadjar", "شطايبي": "Chetaibi", "عين الباردة": "Ain Berda",
  // 24 Guelma
  "قالمة": "Guelma", "وادي الزناتي": "Oued Zenati", "بوشقوف": "Bouchegouf",
  "هيليوبوليس": "Heliopolis", "حمام دباغ": "Hammam Debagh", "بلخير": "Belkheir",
  // 25 Constantine
  "قسنطينة": "Constantine", "الخروب": "El Khroub", "علي منجلي": "El Khroub",
  "حامة بوزيان": "Hamma Bouziane", "ديدوش مراد": "Didouche Mourad", "زيغود يوسف": "Zighoud Youcef",
  "عين سمارة": "Ain Smara",
  // 26 Médéa
  "المدية": "Medea", "البرواقية": "Berrouaghia", "قصر البخاري": "Ksar El Boukhari",
  "بني سليمان": "Beni Slimane", "تابلاط": "Tablat", "وزرة": "Ouzera",
  // 27 Mostaganem
  "مستغانم": "Mostaganem", "عين تدلس": "Ain Tedles", "سيدي علي": "Sidi Ali", "ماسرة": "Mesra",
  "بوقيرات": "Bouguirat", "حاسي ماماش": "Hassi Mameche",
  // 28 M'Sila
  "المسيلة": "M'sila", "بوسعادة": "Bou Saada", "سيدي عيسى": "Sidi Aissa", "مقرة": "Magra",
  "عين الحجل": "Ain El Hadjel", "حمام الضلعة": "Hammam Dalaa",
  // 29 Mascara
  "معسكر": "Mascara", "سيق": "Sig", "تيغنيف": "Tighennif", "المحمدية": "Mohammadia",
  "غريس": "Ghriss", "واد الأبطال": "Oued El Abtal",
  // 30 Ouargla
  "ورقلة": "Ouargla", "حاسي مسعود": "Hassi Messaoud", "تقرت": "Touggourt",
  "الرويسات": "Rouissat", "سيدي خويلد": "Sidi Khouiled", "الطيبات": "Taibet",
  // 31 Oran
  "وهران": "Oran", "بئر الجير": "Bir El Djir", "السانية": "Es Senia", "عين الترك": "Ain El Turk",
  "أرزيو": "Arzew", "بطيوة": "Bethioua", "قديل": "Gdyel", "مرسى الكبير": "Mers El Kebir",
  "بوتليليس": "Boutlelis",
  // 32 El Bayadh
  "البيض": "El Bayadh", "الأبيض سيدي الشيخ": "El Abiodh Sidi Cheikh", "بوعلام": "Boualem",
  "بريزينة": "Brezina", "بوقطب": "Bougtob",
  // 33 Illizi
  "إليزي": "Illizi", "جانت": "Djanet", "إن أمناس": "In Amenas", "برج عمر إدريس": "Bordj Omar Driss",
  // 34 Bordj Bou Arreridj
  "برج بوعريريج": "Bordj Bou Arreridj", "رأس الوادي": "Ras El Oued", "برج الغدير": "Bordj Ghedir",
  "المنصورة": "El Mansoura", "مجانة": "Medjana",
  // 35 Boumerdès
  "بومرداس": "Boumerdes", "برج منايل": "Bordj Menaiel", "دلس": "Dellys",
  "الرغاية الجديدة": "Boudouaou", "بودواو": "Boudouaou", "خميس الخشنة": "Khemis El Khechna",
  "يسر": "Isser", "الثنية": "Thenia",
  // 36 El Tarf
  "الطارف": "El Tarf", "القالة": "El Kala", "بن مهيدي": "Ben M'hidi", "بوحجار": "Bouhadjar",
  "الذرعان": "Drean", "البسباس": "Besbes",
  // 37 Tindouf
  "تندوف": "Tindouf", "أم العسل": "Oum El Assel",
  // 38 Tissemsilt
  "تسمسيلت": "Tissemsilt", "ثنية الحد": "Theniet El Had", "برج بونعامة": "Bordj Bou Naama",
  "لرجام": "Lardjem", "خميستي": "Khemisti",
  // 39 El Oued
  "الوادي": "El Oued", "قمار": "Guemar", "الدبيلة": "Debila", "جامعة": "Djamaa",
  "الرقيبة": "Reguiba", "المقرن": "El M'ghair", "حاسي خليفة": "Hassi Khalifa",
  // 40 Khenchela
  "خنشلة": "Khenchela", "ششار": "Chechar", "قايس": "Kais", "بوحمامة": "Bouhmama",
  "أولاد رشاش": "Ouled Rechache", "المحمل": "El Mahmal",
  // 41 Souk Ahras
  "سوق أهراس": "Souk Ahras", "سدراتة": "Sedrata", "مداوروش": "M'daourouch",
  "تاورة": "Taoura", "المراهنة": "Merahna",
  // 42 Tipaza
  "تيبازة": "Tipaza", "شرشال": "Cherchell", "القليعة": "Kolea", "بواسماعيل": "Bou Ismail",
  "حجوط": "Hadjout", "فوكة": "Fouka", "الداموس": "Damous", "حمر العين": "Hamr El Ain",
  // 43 Mila
  "ميلة": "Mila", "شلغوم العيد": "Chelghoum Laid", "فرجيوة": "Ferdjioua", "تاجنانت": "Tadjenanet",
  "قرارم قوقة": "Grarem Gouga", "سيدي مروان": "Sidi Merouane",
  // 44 Aïn Defla
  "عين الدفلى": "Ain Defla", "خميس مليانة": "Khemis Miliana", "مليانة": "Miliana",
  "العطاف": "El Attaf", "جليدة": "Djelida", "الروينة": "Rouina",
  // 45 Naâma
  "النعامة": "Naama", "مشرية": "Mecheria", "عين الصفراء": "Ain Sefra",
  "مكمن بن عمار": "Mekmen Ben Amar", "عسلة": "Asla",
  // 46 Aïn Témouchent
  "عين تموشنت": "Ain Temouchent", "بني صاف": "Beni Saf", "حمام بوحجر": "Hammam Bouhadjar",
  "العامرية": "El Amria", "عين الكيحل": "Ain Kihal",
  // 47 Ghardaïa
  "غرداية": "Ghardaia", "القرارة": "El Guerrara", "متليلي": "Metlili", "بريان": "Berriane",
  "بني يزقن": "Bounoura", "العطف": "El Atteuf", "ضاية بن ضحوة": "Daya Ben Dahoua",
  // 48 Relizane
  "غليزان": "Relizane", "وادي ارهيو": "Oued Rhiou", "مازونة": "Mazouna", "عمي موسى": "Ammi Moussa",
  "يلل": "Yellel", "زمورة": "Zemmoura",
  // 49 Timimoun
  "أوقروت": "Aougrout", "شروين": "Charouine", "تينركوك": "Tinerkouk", "دل دول": "Deldoul",
  // 50 Bordj Badji Mokhtar
  "برج باجي مختار": "Bordj Badji Mokhtar", "تيمياوين": "Timiaouine",
  // 51 Ouled Djellal
  "سيدي خالد": "Sidi Khaled", "رأس الميعاد": "Ras El Miad", "الشعيبة": "Chaiba",
  // 52 Béni Abbès
  "كرزاز": "Kerzaz", "الواتة": "El Ouata", "طبلبلة": "Tabelbala", "أولاد خضير": "Ouled Khoudir",
  // 53 In Salah
  "عين صالح": "In Salah", "فقارة الزاوية": "Foggaret Ezzaouia", "إينغر": "Inghar",
  // 54 In Guezzam
  "عين قزام": "In Guezzam", "تين زواتين": "Tin Zaouatine",
  // 55 Touggourt
  "النزلة": "Nezla", "تبسبست": "Tebesbest", "تماسين": "Temacine", "المقارين": "Megarine",
  // 56 Djanet
  "برج الحواس": "Bordj El Haouas",
  // 57 El M'Ghair
  "المغير": "El M'ghair", "أم الطيور": "Oum Touyour", "سيدي خليل": "Sidi Khellil",
  "المرارة": "M'rara",
  // 58 El Meniaa
  "المنيعة": "El Meniaa", "حاسي القارة": "Hassi Gara", "حاسي الفحل": "Hassi Fehal",
};

export function communeFrenchName(commune: string): string | undefined {
  const key = commune.trim();
  return COMMUNE_FR_NAMES[key];
}
