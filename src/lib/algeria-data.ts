export interface WilayaInfo {
  code: string;
  nameAr: string;
  nameFr: string;
  communes: string[];
}

export const ALGERIA_WILAYAS: WilayaInfo[] = [
  { code: "01", nameAr: "01 - أدرار", nameFr: "01 - Adrar", communes: ["أدرار", "تيميمون", "رقان", "أولف", "زاوية كنتة", "تسفاوت", "فنوغيل"] },
  { code: "02", nameAr: "02 - الشلف", nameFr: "02 - Chlef", communes: ["الشلف", "تنس", "بوقادير", "وادي الفضة", "أولاد فارس", "عين مران", "بني حواء"] },
  { code: "03", nameAr: "03 - الأغواط", nameFr: "03 - Laghouat", communes: ["الأغواط", "أفلو", "قصر الحيران", "سيدي مخلوف", "بريدة", "عين ماضي"] },
  { code: "04", nameAr: "04 - أم البواقي", nameFr: "04 - Oum El Bouaghi", communes: ["أم البواقي", "عين البيضاء", "عين مليلة", "مسكيانة", "سيقوس"] },
  { code: "05", nameAr: "05 - باتنة", nameFr: "05 - Batna", communes: ["باتنة", "بريكة", "عين التوتة", "مروانة", "أريس", "نقاوس", "المعذر"] },
  { code: "06", nameAr: "06 - بجاية", nameFr: "06 - Béjaïa", communes: ["بجاية", "أقبو", "أميزور", "سيدي عيش", "خراطة", "تيزي نبربر", "أوقاس"] },
  { code: "07", nameAr: "07 - بسكرة", nameFr: "07 - Biskra", communes: ["بسكرة", "طولقة", "سيدي عقبة", "أولاد جلال", "الوطاية", "زريبة الوادي"] },
  { code: "08", nameAr: "08 - بشار", nameFr: "08 - Béchar", communes: ["بشار", "القنادسة", "بني عباس", "العبادلة", "تاغيت", "تبلبالة"] },
  { code: "09", nameAr: "09 - البليدة", nameFr: "09 - Blida", communes: ["البليدة", "بوفاريك", "أولاد يعيش", "العفرون", "موزاية", "بوقرة", "الأربعاء"] },
  { code: "10", nameAr: "10 - البويرة", nameFr: "10 - Bouira", communes: ["البويرة", "الأخضرية", "سور الغزلان", "عين بسام", "مشدالة", "بئر غبالو"] },
  { code: "11", nameAr: "11 - تمنراست", nameFr: "11 - Tamanrasset", communes: ["تمنراست", "عين أمقل", "إيدلس", "تاظروك", "أباليسا"] },
  { code: "12", nameAr: "12 - تبسة", nameFr: "12 - Tébessa", communes: ["تبسة", "الونزة", "بئر العاتر", "الشريعة", "العوينات", "مرسط"] },
  { code: "13", nameAr: "13 - تلمسان", nameFr: "13 - Tlemcen", communes: ["تلمسان", "مغنية", "منصورة", "سبدو", "الغزوات", "ندرومة", "شتوان"] },
  { code: "14", nameAr: "14 - تيارت", nameFr: "14 - Tiaret", communes: ["تيارت", "السوقر", "فرندة", "قصر الشلالة", "مهدية", "الرحوية"] },
  { code: "15", nameAr: "15 - تيزي وزو", nameFr: "15 - Tizi Ouzou", communes: ["تيزي وزو", "عزازقة", "ذراع الميزان", "بوغني", "الأربعاء نايث إيراثن", "تيقزيرت"] },
  { code: "16", nameAr: "16 - الجزائر", nameFr: "16 - Alger", communes: ["الجزائر الوسطى", "باب الوادي", "حيدرة", "سيدي يحيى", "بن عكنون", "بئر مراد رايس", "المرادية", "القبة", "حسين داي", "الشراقة", "دالي إبراهيم", "الأبيار", "بئر خادم", "الدار البيضاء", "برج البحري", "برج الكيفان", "الرويبة", "الرغاية", "عين طاية", "زرالدة", "سطاوالي", "عين البنيان", "باب الزوار", "باش جراح", "الحراش", "بوزريعة", "براقي"] },
  { code: "17", nameAr: "17 - الجلفة", nameFr: "17 - Djelfa", communes: ["الجلفة", "عين وسارة", "مسعد", "حاسي بحبح", "الشارف", "دار الشيوخ"] },
  { code: "18", nameAr: "18 - جيجل", nameFr: "18 - Jijel", communes: ["جيجل", "طاهير", "الميلية", "العوانة", "زيامة منصورية", "الشقفة"] },
  { code: "19", nameAr: "19 - سطيف", nameFr: "19 - Sétif", communes: ["سطيف", "العلمة", "عين ولمان", "عين الكبيرة", "عين أرنات", "بوقاعة", "جميلة"] },
  { code: "20", nameAr: "20 - سعيدة", nameFr: "20 - Saïda", communes: ["سعيدة", "عين الحجر", "يوب", "الحساسنة", "أولاد خالد"] },
  { code: "21", nameAr: "21 - سكيكدة", nameFr: "21 - Skikda", communes: ["سكيكدة", "القل", "عزابة", "الحروش", "تمالوس", "رمضان جمال"] },
  { code: "22", nameAr: "22 - سيدي بلعباس", nameFr: "22 - Sidi Bel Abbès", communes: ["سيدي بلعباس", "تلاغ", "سفيزف", "بن باديس", "سيدي علي بوسيدي", "تنيرة"] },
  { code: "23", nameAr: "23 - عنابة", nameFr: "23 - Annaba", communes: ["عنابة", "البوني", "سيدي عمار", "برحال", "الحجار", "شطايبي", "عين الباردة"] },
  { code: "24", nameAr: "24 - قالمة", nameFr: "24 - Guelma", communes: ["قالمة", "وادي الزناتي", "بوشقوف", "هيليوبوليس", "حمام دباغ", "بلخير"] },
  { code: "25", nameAr: "25 - قسنطينة", nameFr: "25 - Constantine", communes: ["قسنطينة", "الخروب", "علي منجلي", "حامة بوزيان", "ديدوش مراد", "زيغود يوسف", "عين سمارة"] },
  { code: "26", nameAr: "26 - المدية", nameFr: "26 - Médéa", communes: ["المدية", "البرواقية", "قصر البخاري", "بني سليمان", "تابلاط", "وزرة"] },
  { code: "27", nameAr: "27 - مستغانم", nameFr: "27 - Mostaganem", communes: ["مستغانم", "عين تدلس", "سيدي علي", "ماسرة", "بوقيرات", "حاسي ماماش"] },
  { code: "28", nameAr: "28 - المسيلة", nameFr: "28 - M'Sila", communes: ["المسيلة", "بوسعادة", "سيدي عيسى", "مقرة", "عين الحجل", "حمام الضلعة"] },
  { code: "29", nameAr: "29 - معسكر", nameFr: "29 - Mascara", communes: ["معسكر", "سيق", "تيغنيف", "المحمدية", "غريس", "واد الأبطال"] },
  { code: "30", nameAr: "30 - ورقلة", nameFr: "30 - Ouargla", communes: ["ورقلة", "حاسي مسعود", "تقرت", "الرويسات", "سيدي خويلد", "الطيبات"] },
  { code: "31", nameAr: "31 - وهران", nameFr: "31 - Oran", communes: ["وهران", "بئر الجير", "السانية", "عين الترك", "أرزيو", "بطيوة", "قديل", "مرسى الكبير", "بوتليليس"] },
  { code: "32", nameAr: "32 - البيض", nameFr: "32 - El Bayadh", communes: ["البيض", "الأبيض سيدي الشيخ", "بوعلام", "بريزينة", "بوقطب"] },
  { code: "33", nameAr: "33 - إليزي", nameFr: "33 - Illizi", communes: ["إليزي", "جانت", "إن أمناس", "برج عمر إدريس"] },
  { code: "34", nameAr: "34 - برج بوعريريج", nameFr: "34 - Bordj Bou Arreridj", communes: ["برج بوعريريج", "رأس الوادي", "برج الغدير", "المنصورة", "مجانة"] },
  { code: "35", nameAr: "35 - بومرداس", nameFr: "35 - Boumerdès", communes: ["بومرداس", "برج منايل", "دلس", "الرغاية الجديدة", "بودواو", "خميس الخشنة", "يسر", "الثنية"] },
  { code: "36", nameAr: "36 - الطارف", nameFr: "36 - El Tarf", communes: ["الطارف", "القالة", "بن مهيدي", "بوحجار", "الذرعان", "البسباس"] },
  { code: "37", nameAr: "37 - تندوف", nameFr: "37 - Tindouf", communes: ["تندوف", "أم العسل"] },
  { code: "38", nameAr: "38 - تسمسيلت", nameFr: "38 - Tissemsilt", communes: ["تسمسيلت", "ثنية الحد", "برج بونعامة", "لرجام", "خميستي"] },
  { code: "39", nameAr: "39 - الوادي", nameFr: "39 - El Oued", communes: ["الوادي", "قمار", "الدبيلة", "جامعة", "الرقيبة", "المقرن", "حاسي خليفة"] },
  { code: "40", nameAr: "40 - خنشلة", nameFr: "40 - Khenchela", communes: ["خنشلة", "ششار", "قايس", "بوحمامة", "أولاد رشاش", "المحمل"] },
  { code: "41", nameAr: "41 - سوق أهراس", nameFr: "41 - Souk Ahras", communes: ["سوق أهراس", "سدراتة", "مداوروش", "تاورة", "المراهنة"] },
  { code: "42", nameAr: "42 - تيبازة", nameFr: "42 - Tipaza", communes: ["تيبازة", "شرشال", "القليعة", "بواسماعيل", "حجوط", "فوكة", "الداموس", "حمر العين"] },
  { code: "43", nameAr: "43 - ميلة", nameFr: "43 - Mila", communes: ["ميلة", "شلغوم العيد", "فرجيوة", "تاجنانت", "قرارم قوقة", "سيدي مروان"] },
  { code: "44", nameAr: "44 - عين الدفلى", nameFr: "44 - Aïn Defla", communes: ["عين الدفلى", "خميس مليانة", "مليانة", "العطاف", "جليدة", "الروينة"] },
  { code: "45", nameAr: "45 - النعامة", nameFr: "45 - Naâma", communes: ["النعامة", "مشرية", "عين الصفراء", "مكمن بن عمار", "عسلة"] },
  { code: "46", nameAr: "46 - عين تموشنت", nameFr: "46 - Aïn Témouchent", communes: ["عين تموشنت", "بني صاف", "حمام بوحجر", "العامرية", "عين الكيحل"] },
  { code: "47", nameAr: "47 - غرداية", nameFr: "47 - Ghardaïa", communes: ["غرداية", "القرارة", "متليلي", "بريان", "بني يزقن", "العطف", "ضاية بن ضحوة"] },
  { code: "48", nameAr: "48 - غليزان", nameFr: "48 - Relizane", communes: ["غليزان", "وادي ارهيو", "مازونة", "عمي موسى", "يلل", "زمورة"] },
  { code: "49", nameAr: "49 - تيميمون", nameFr: "49 - Timimoun", communes: ["تيميمون", "أوقروت", "شروين", "تينركوك", "دل دول"] },
  { code: "50", nameAr: "50 - برج باجي مختار", nameFr: "50 - Bordj Badji Mokhtar", communes: ["برج باجي مختار", "تيمياوين"] },
  { code: "51", nameAr: "51 - أولاد جلال", nameFr: "51 - Ouled Djellal", communes: ["أولاد جلال", "سيدي خالد", "رأس الميعاد", "البسباس", "الشعيبة"] },
  { code: "52", nameAr: "52 - بني عباس", nameFr: "52 - Béni Abbès", communes: ["بني عباس", "كرزاز", "الواتة", "طبلبلة", "أولاد خضير"] },
  { code: "53", nameAr: "53 - عين صالح", nameFr: "53 - In Salah", communes: ["عين صالح", "فقارة الزاوية", "إينغر"] },
  { code: "54", nameAr: "54 - عين قزام", nameFr: "54 - In Guezzam", communes: ["عين قزام", "تين زواتين"] },
  { code: "55", nameAr: "55 - تقرت", nameFr: "55 - Touggourt", communes: ["تقرت", "النزلة", "تبسبست", "الطيبات", "تماسين", "المقارين"] },
  { code: "56", nameAr: "56 - جانت", nameFr: "56 - Djanet", communes: ["جانت", "برج الحواس"] },
  { code: "57", nameAr: "57 - المغير", nameFr: "57 - El M'Ghair", communes: ["المغير", "جامعة", "أم الطيور", "سيدي خليل", "المرارة"] },
  { code: "58", nameAr: "58 - المنيعة", nameFr: "58 - El Meniaa", communes: ["المنيعة", "حاسي القارة", "حاسي الفحل"] },
];

export function getWilayaName(nameOrCode: string, locale: "ar" | "fr" = "ar"): string {
  const clean = nameOrCode.trim().toLowerCase();
  const match = ALGERIA_WILAYAS.find(
    (w) =>
      w.code === nameOrCode ||
      w.nameAr.toLowerCase().includes(clean) ||
      w.nameFr.toLowerCase().includes(clean)
  );
  if (!match) return nameOrCode;
  return locale === "ar" ? match.nameAr : match.nameFr;
}

export function getCommunesForWilaya(wilayaValue: string): string[] {
  if (!wilayaValue) return [];
  const clean = wilayaValue.trim().toLowerCase();
  const match = ALGERIA_WILAYAS.find(
    (w) =>
      w.nameAr.toLowerCase().includes(clean) ||
      w.nameFr.toLowerCase().includes(clean) ||
      clean.includes(w.code)
  );
  return match?.communes ?? [];
}
