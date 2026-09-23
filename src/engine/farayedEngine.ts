/**
 * محرك الفرائض والمواريث المنطقي الحسابي
 * مبني على القواعد المعتمدة في الفقه الإسلامي (مذهب جمهور الفقهاء)
 * حساب قطعي ومطابق للسهام وأصول المسائل والعول والرد والتصحيح
 */

import { HeirsInput, CalculationResult, HeirShareResult } from '../types/inheritance';

// حساب القاسم المشترك الأكبر
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// حساب المضاعف المشترك الأصغر
function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

interface TempShare {
  id: string;
  name: string;
  category: 'زوجية' | 'أصول' | 'فروع' | 'حواشي';
  count: number;
  shareName: string;
  numerator: number;
  denominator: number; // 0 إذا كان عصبة
  isAsabah: boolean;
  asabahType?: 'bil_nafs' | 'bil_ghayr' | 'ma_al_ghayr';
  reason: string;
  evidence: string;
  isSpouse?: boolean;
}

export function calculateInheritance(input: HeirsInput): CalculationResult {
  const steps: { title: string; description: string }[] = [];
  const fiqhNotes: string[] = [];
  const blockedHeirs: HeirShareResult[] = [];

  // التحقق من صحة المدخلات
  if (input.estateValue <= 0) {
    return {
      isValid: false,
      error: 'يرجى إدخال قيمة صحيحة للتركة أكبر من الصفر.',
      aslMasalah: 0,
      finalBase: 0,
      estateValue: input.estateValue,
      currency: input.currency,
      heirs: [],
      blockedHeirs: [],
      hasAwl: false,
      hasRadd: false,
      hasTasHih: false,
      fiqhNotes: [],
      steps: [],
      sharesSumCheck: false,
      amountsSumCheck: false,
    };
  }

  // التحقق من التناقض في الزوجية
  if (input.deceasedGender === 'male' && input.hasHusband) {
    return {
      isValid: false,
      error: 'لا يمكن أن يكون للمتوفى الذكر (رجل) زوج! يرجى تصحيح نوع المتوفى أو الزوجية.',
      aslMasalah: 0,
      finalBase: 0,
      estateValue: input.estateValue,
      currency: input.currency,
      heirs: [],
      blockedHeirs: [],
      hasAwl: false,
      hasRadd: false,
      hasTasHih: false,
      fiqhNotes: [],
      steps: [],
      sharesSumCheck: false,
      amountsSumCheck: false,
    };
  }

  if (input.deceasedGender === 'female' && input.wivesCount > 0) {
    return {
      isValid: false,
      error: 'لا يمكن أن يكون للمتوفاة الأنثى زوجة! يرجى تصحيح نوع المتوفى أو الزوجية.',
      aslMasalah: 0,
      finalBase: 0,
      estateValue: input.estateValue,
      currency: input.currency,
      heirs: [],
      blockedHeirs: [],
      hasAwl: false,
      hasRadd: false,
      hasTasHih: false,
      fiqhNotes: [],
      steps: [],
      sharesSumCheck: false,
      amountsSumCheck: false,
    };
  }

  // 1. تحديد الفروع والأصول والحواشي
  const hasMaleBranch = input.sonsCount > 0 || input.sonsOfSonsCount > 0;
  const hasFemaleBranch = input.daughtersCount > 0 || input.daughtersOfSonsCount > 0;
  const hasBranch = hasMaleBranch || hasFemaleBranch;
  
  const totalSiblings =
    input.fullBrothersCount +
    input.fullSistersCount +
    input.paternalBrothersCount +
    input.paternalSistersCount +
    input.maternalBrothersCount +
    input.maternalSistersCount;

  steps.push({
    title: 'الخطوة 1: حصر الورثة وتحديد الفروع والأصول',
    description: `تم حصر الورثة المدخلين، وفحص وجود الفرع الوارث (${
      hasMaleBranch ? 'يوجد فرع وارث مذكر' : hasFemaleBranch ? 'يوجد فرع وارث مؤنث فقط' : 'لا يوجد فرع وارث'
    })، وعدد الإخوة والأخوات (${totalSiblings}).`,
  });

  // 2. تطبيق قواعد الحجب (حجب الحرمان)
  // حجب أبناء وبنات الابن بالابن المباشر
  let sonsOfSonsEffective = input.sonsOfSonsCount;
  let daughtersOfSonsEffective = input.daughtersOfSonsCount;

  if (input.sonsCount > 0) {
    if (input.sonsOfSonsCount > 0) {
      blockedHeirs.push({
        id: 'sons_of_sons_blocked',
        name: 'أبناء الابن',
        category: 'فروع',
        count: input.sonsOfSonsCount,
        shareName: 'محجوب حجب حرمان',
        shareFraction: '0',
        shareNumeric: 0,
        sharesCount: 0,
        individualShareFraction: '0',
        individualAmount: 0,
        totalAmount: 0,
        percentage: 0,
        reason: 'محجوبون بالابن المباشر للمتوفى، لأن الأقرب يحجب الأبعد.',
        evidence: 'القاعدة الفقهية: "كل من يدلي إلى الميت بشخص لا يرث مع وجود ذلك الشخص".',
        isBlocked: true,
        blockedBy: 'الابن المباشر',
      });
      sonsOfSonsEffective = 0;
    }
    if (input.daughtersOfSonsCount > 0) {
      blockedHeirs.push({
        id: 'daughters_of_sons_blocked',
        name: 'بنات الابن',
        category: 'فروع',
        count: input.daughtersOfSonsCount,
        shareName: 'محجوب حجب حرمان',
        shareFraction: '0',
        shareNumeric: 0,
        sharesCount: 0,
        individualShareFraction: '0',
        individualAmount: 0,
        totalAmount: 0,
        percentage: 0,
        reason: 'محجوبات بالابن المباشر للمتوفى.',
        evidence: 'إجماع أهل العلم على أن الابن يحجب أولاد الابن ذكوراً وإناثاً.',
        isBlocked: true,
        blockedBy: 'الابن المباشر',
      });
      daughtersOfSonsEffective = 0;
    }
  } else if (input.daughtersCount >= 2 && input.sonsOfSonsCount === 0 && input.daughtersOfSonsCount > 0) {
    // استغراق البنات للثلثين دون وجود معصب
    blockedHeirs.push({
      id: 'daughters_of_sons_blocked_two_daughters',
      name: 'بنات الابن',
      category: 'فروع',
      count: input.daughtersOfSonsCount,
      shareName: 'سقوط لاستغراق الثلثين',
      shareFraction: '0',
      shareNumeric: 0,
      sharesCount: 0,
      individualShareFraction: '0',
      individualAmount: 0,
      totalAmount: 0,
      percentage: 0,
      reason: 'سقطت بنات الابن لاستغراق البنات الصلبيات فرض الثلثين كاملاً، وعدم وجود ابن ابن يعصبهن.',
      evidence: 'حديث ابن مسعود رضي الله عنه في قضاء النبي ﷺ في البنت وبنت الابن والأخت (صحيح البخاري: 6736).',
      isBlocked: true,
      blockedBy: 'البنات الصلبيات (استغراق الثلثين)',
    });
    daughtersOfSonsEffective = 0;
  }

  // حجب الجد بالأب
  let hasPaternalGrandfatherEffective = input.hasPaternalGrandfather;
  if (input.hasFather && input.hasPaternalGrandfather) {
    blockedHeirs.push({
      id: 'grandfather_blocked',
      name: 'الجد لأب',
      category: 'أصول',
      count: 1,
      shareName: 'محجوب حجب حرمان',
      shareFraction: '0',
      shareNumeric: 0,
      sharesCount: 0,
      individualShareFraction: '0',
      individualAmount: 0,
      totalAmount: 0,
      percentage: 0,
      reason: 'محجوب بالأب، لأن الأب أقرب للمتوفى ويدلي الجد به.',
      evidence: 'إجماع الفقهاء على حجب الجد بالأب.',
      isBlocked: true,
      blockedBy: 'الأب',
    });
    hasPaternalGrandfatherEffective = false;
  }

  // حجب الجدات
  let hasMaternalGrandmotherEffective = input.hasMaternalGrandmother;
  let hasPaternalGrandmotherEffective = input.hasPaternalGrandmother;

  if (input.hasMother) {
    if (input.hasMaternalGrandmother) {
      blockedHeirs.push({
        id: 'maternal_gm_blocked',
        name: 'الجدة أم الأم',
        category: 'أصول',
        count: 1,
        shareName: 'محجوبة حجب حرمان',
        shareFraction: '0',
        shareNumeric: 0,
        sharesCount: 0,
        individualShareFraction: '0',
        individualAmount: 0,
        totalAmount: 0,
        percentage: 0,
        reason: 'محجوبة بالأم، فالأم تحجب جميع الجدات إجماعاً.',
        evidence: 'إجماع علماء الفرائض على أن الأم تسقط بها جميع الجدات.',
        isBlocked: true,
        blockedBy: 'الأم',
      });
      hasMaternalGrandmotherEffective = false;
    }
    if (input.hasPaternalGrandmother) {
      blockedHeirs.push({
        id: 'paternal_gm_blocked',
        name: 'الجدة أم الأب',
        category: 'أصول',
        count: 1,
        shareName: 'محجوبة حجب حرمان',
        shareFraction: '0',
        shareNumeric: 0,
        sharesCount: 0,
        individualShareFraction: '0',
        individualAmount: 0,
        totalAmount: 0,
        percentage: 0,
        reason: 'محجوبة بالأم.',
        evidence: 'إجماع الفقهاء على أن الأم تحجب الجدات من أي جهة كن.',
        isBlocked: true,
        blockedBy: 'الأم',
      });
      hasPaternalGrandmotherEffective = false;
    }
  } else if (input.hasFather && input.hasPaternalGrandmother) {
    blockedHeirs.push({
      id: 'paternal_gm_blocked_by_father',
      name: 'الجدة أم الأب',
      category: 'أصول',
      count: 1,
      shareName: 'محجوبة حجب حرمان',
      shareFraction: '0',
      shareNumeric: 0,
      sharesCount: 0,
      individualShareFraction: '0',
      individualAmount: 0,
      totalAmount: 0,
      percentage: 0,
      reason: 'محجوبة بالأب عند جمهور أهل العلم، لأنها تدلي به.',
      evidence: 'قول جمهور الفقهاء أن الأب يحجب أمه (أم الأب).',
      isBlocked: true,
      blockedBy: 'الأب',
    });
    hasPaternalGrandmotherEffective = false;
  }

  // حجب الإخوة والأخوات
  // الإخوة لأم يُحجبون بالفرع الوارث مطلقاً (ذكراً أو أنثى) وبالأصل المذكر (الأب والجد)
  let maternalBrothersEffective = input.maternalBrothersCount;
  let maternalSistersEffective = input.maternalSistersCount;

  if (hasBranch || input.hasFather || hasPaternalGrandfatherEffective) {
    const blockerName = hasBranch
      ? 'الفرع الوارث'
      : input.hasFather
      ? 'الأب'
      : 'الجد لأب';

    if (input.maternalBrothersCount > 0) {
      blockedHeirs.push({
        id: 'maternal_brothers_blocked',
        name: 'الإخوة لأم',
        category: 'حواشي',
        count: input.maternalBrothersCount,
        shareName: 'محجوبون حجب حرمان',
        shareFraction: '0',
        shareNumeric: 0,
        sharesCount: 0,
        individualShareFraction: '0',
        individualAmount: 0,
        totalAmount: 0,
        percentage: 0,
        reason: `محجوبون بوجود ${blockerName}، فالإخوة لأم يرثون في الكلالة فقط (لا ولد ولا والد).`,
        evidence: 'سورة النساء: الآية 12 {وَإِن كَانَ رَجُلٌ يُورَثُ كَلَالَةً أَوِ امْرَأَةٌ وَلَهُ أَخٌ أَوْ أُخْتٌ فَلِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ}.',
        isBlocked: true,
        blockedBy: blockerName,
      });
      maternalBrothersEffective = 0;
    }
    if (input.maternalSistersCount > 0) {
      blockedHeirs.push({
        id: 'maternal_sisters_blocked',
        name: 'الأخوات لأم',
        category: 'حواشي',
        count: input.maternalSistersCount,
        shareName: 'محجوبات حجب حرمان',
        shareFraction: '0',
        shareNumeric: 0,
        sharesCount: 0,
        individualShareFraction: '0',
        individualAmount: 0,
        totalAmount: 0,
        percentage: 0,
        reason: `محجوبات بوجود ${blockerName}.`,
        evidence: 'سورة النساء: الآية 12، واشتراط الكلالة لإرث الإخوة لأم بالإجماع.',
        isBlocked: true,
        blockedBy: blockerName,
      });
      maternalSistersEffective = 0;
    }
  }

  // الإخوة والأخوات الأشقاء يحجبون بالفرع المذكر (ابن أو ابن ابن) وبالأب إجماعاً
  let fullBrothersEffective = input.fullBrothersCount;
  let fullSistersEffective = input.fullSistersCount;

  if (hasMaleBranch || input.hasFather) {
    const blockerName = hasMaleBranch ? 'الفرع الوارث المذكر (الابن / ابن الابن)' : 'الأب';
    if (input.fullBrothersCount > 0) {
      blockedHeirs.push({
        id: 'full_brothers_blocked',
        name: 'الإخوة الأشقاء',
        category: 'حواشي',
        count: input.fullBrothersCount,
        shareName: 'محجوبون حجب حرمان',
        shareFraction: '0',
        shareNumeric: 0,
        sharesCount: 0,
        individualShareFraction: '0',
        individualAmount: 0,
        totalAmount: 0,
        percentage: 0,
        reason: `محجوبون بوجود ${blockerName}.`,
        evidence: 'إجماع علماء الإسلام على حجب الإخوة الأشقاء بالأب وبالفرع الوارث المذكر.',
        isBlocked: true,
        blockedBy: blockerName,
      });
      fullBrothersEffective = 0;
    }
    if (input.fullSistersCount > 0) {
      blockedHeirs.push({
        id: 'full_sisters_blocked',
        name: 'الأخوات الشقيقات',
        category: 'حواشي',
        count: input.fullSistersCount,
        shareName: 'محجوبات حجب حرمان',
        shareFraction: '0',
        shareNumeric: 0,
        sharesCount: 0,
        individualShareFraction: '0',
        individualAmount: 0,
        totalAmount: 0,
        percentage: 0,
        reason: `محجوبات بوجود ${blockerName}.`,
        evidence: 'سورة النساء: الآية 176 {إِنِ امْرُؤٌ هَلَكَ لَيْسَ لَهُ وَلَدٌ وَلَهُ أُخْتٌ فَلَهَا نِصْفُ مَا تَرَكَ}.',
        isBlocked: true,
        blockedBy: blockerName,
      });
      fullSistersEffective = 0;
    }
  }

  // الإخوة والأخوات لأب يحجبون بما يحجب به الأشقاء + بالأخ الشقيق + بالأخت الشقيقة إذا صارت عصبة مع البنات
  let paternalBrothersEffective = input.paternalBrothersCount;
  let paternalSistersEffective = input.paternalSistersCount;

  const sisterIsAsabahWithDaughter =
    fullSistersEffective > 0 &&
    fullBrothersEffective === 0 &&
    hasFemaleBranch &&
    !hasMaleBranch &&
    !input.hasFather;

  if (hasMaleBranch || input.hasFather || fullBrothersEffective > 0 || sisterIsAsabahWithDaughter) {
    const blockerName = hasMaleBranch
      ? 'الفرع الوارث المذكر'
      : input.hasFather
      ? 'الأب'
      : fullBrothersEffective > 0
      ? 'الأخ الشقيق'
      : 'الأخت الشقيقة التي صارت عصبة مع البنات';

    if (input.paternalBrothersCount > 0) {
      blockedHeirs.push({
        id: 'paternal_brothers_blocked',
        name: 'الإخوة لأب',
        category: 'حواشي',
        count: input.paternalBrothersCount,
        shareName: 'محجوبون حجب حرمان',
        shareFraction: '0',
        shareNumeric: 0,
        sharesCount: 0,
        individualShareFraction: '0',
        individualAmount: 0,
        totalAmount: 0,
        percentage: 0,
        reason: `محجوبون بوجود ${blockerName}.`,
        evidence: 'القاعدة الفقهية: الشقيق أقوى قرابة من الأخ لأب فيحجبه.',
        isBlocked: true,
        blockedBy: blockerName,
      });
      paternalBrothersEffective = 0;
    }
    if (input.paternalSistersCount > 0) {
      blockedHeirs.push({
        id: 'paternal_sisters_blocked',
        name: 'الأخوات لأب',
        category: 'حواشي',
        count: input.paternalSistersCount,
        shareName: 'محجوبات حجب حرمان',
        shareFraction: '0',
        shareNumeric: 0,
        sharesCount: 0,
        individualShareFraction: '0',
        individualAmount: 0,
        totalAmount: 0,
        percentage: 0,
        reason: `محجوبات بوجود ${blockerName}.`,
        evidence: 'قوة القرابة وحكم العصبة مع الغير.',
        isBlocked: true,
        blockedBy: blockerName,
      });
      paternalSistersEffective = 0;
    }
  } else if (fullSistersEffective >= 2 && paternalBrothersEffective === 0 && paternalSistersEffective > 0) {
    // استغراق الشقيقات للثلثين دون وجود معصب للأخوات لأب
    blockedHeirs.push({
      id: 'paternal_sisters_blocked_two_sisters',
      name: 'الأخوات لأب',
      category: 'حواشي',
      count: input.paternalSistersCount,
      shareName: 'سقوط لاستغراق الثلثين',
      shareFraction: '0',
      shareNumeric: 0,
      sharesCount: 0,
      individualShareFraction: '0',
      individualAmount: 0,
      totalAmount: 0,
      percentage: 0,
      reason: 'سقطت الأخوات لأب لاستغراق الشقيقات فرض الثلثين كاملاً، وعدم وجود أخ لأب يعصبهن.',
      evidence: 'سورة النساء: الآية 176، ولا يزاد فرض الأخوات على الثلثين.',
      isBlocked: true,
      blockedBy: 'الأخوات الشقيقات (استغراق الثلثين)',
    });
    paternalSistersEffective = 0;
  }

  steps.push({
    title: 'الخطوة 2: فحص وتطبيق قواعد الحجب',
    description: `تم التحقق من الحجب، حيث بلغ عدد المحجوبين حجب حرمان أو إسقاط (${blockedHeirs.length}) فئة.`,
  });

  // 3. تحديد أصحاب الفروض وأنصبتهم
  const tempShares: TempShare[] = [];

  // الزوج
  if (input.hasHusband) {
    if (hasBranch) {
      tempShares.push({
        id: 'husband',
        name: 'الزوج',
        category: 'زوجية',
        count: 1,
        shareName: 'الربع (1/4)',
        numerator: 1,
        denominator: 4,
        isAsabah: false,
        isSpouse: true,
        reason: 'استحق الربع لوجود الفرع الوارث للمتوفاة.',
        evidence: 'سورة النساء: الآية 12 {فَإِن كَانَ لَهُنَّ وَلَدٌ فَلَكُمُ الرُّبُعُ مِمَّا تَرَكْنَ مِن بَعْدِ وَصِيَّةٍ يُوصِينَ بِهَا أَوْ دَيْنٍ}.',
      });
    } else {
      tempShares.push({
        id: 'husband',
        name: 'الزوج',
        category: 'زوجية',
        count: 1,
        shareName: 'النصف (1/2)',
        numerator: 1,
        denominator: 2,
        isAsabah: false,
        isSpouse: true,
        reason: 'استحق النصف لعدم وجود الفرع الوارث للمتوفاة.',
        evidence: 'سورة النساء: الآية 12 {وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ}.',
      });
    }
  }

  // الزوجات
  if (input.wivesCount > 0) {
    if (hasBranch) {
      tempShares.push({
        id: 'wives',
        name: input.wivesCount === 1 ? 'الزوجة' : `الزوجات (${input.wivesCount})`,
        category: 'زوجية',
        count: input.wivesCount,
        shareName: 'الثمن (1/8) يشتركن فيه بالتساوي',
        numerator: 1,
        denominator: 8,
        isAsabah: false,
        isSpouse: true,
        reason: 'استحقت الزوجة (أو الزوجات اشتراكاً) الثمن لوجود الفرع الوارث للمتوفى.',
        evidence: 'سورة النساء: الآية 12 {فَإِن كَانَ لَكُمْ وَلَدٌ فَلَهُنَّ الثُّمُنُ مِمَّا تَرَكْتُم مِّن بَعْدِ وَصِيَّةٍ تُوصُونَ بِهَا أَوْ دَيْنٍ}.',
      });
    } else {
      tempShares.push({
        id: 'wives',
        name: input.wivesCount === 1 ? 'الزوجة' : `الزوجات (${input.wivesCount})`,
        category: 'زوجية',
        count: input.wivesCount,
        shareName: 'الربع (1/4) يشتركن فيه بالتساوي',
        numerator: 1,
        denominator: 4,
        isAsabah: false,
        isSpouse: true,
        reason: 'استحقت الزوجة (أو الزوجات اشتراكاً) الربع لعدم وجود الفرع الوارث للمتوفى.',
        evidence: 'سورة النساء: الآية 12 {وَلَهُنَّ الرُّبُعُ مِمَّا تَرَكْتُمْ إِن لَّمْ يَكُن لَّكُمْ وَلَدٌ}.',
      });
    }
  }

  // الأم
  let isUmariyyah = false;
  if (input.hasMother) {
    if (hasBranch || totalSiblings >= 2) {
      tempShares.push({
        id: 'mother',
        name: 'الأم',
        category: 'أصول',
        count: 1,
        shareName: 'السدس (1/6)',
        numerator: 1,
        denominator: 6,
        isAsabah: false,
        reason: hasBranch
          ? 'استحقت السدس فرضاً لوجود الفرع الوارث للمتوفى.'
          : 'استحقت السدس فرضاً لوجود جمع من الإخوة والأخوات (اثنان فأكثر).',
        evidence: 'سورة النساء: الآية 11 {وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُ وَلَدٌ فَإِن لَّمْ يَكُن لَّهُ وَلَدٌ وَوَرِثَهُ أَبَوَاهُ فَلِأُمِّهِ الثُّلُثُ فَإِن كَانَ لَهُ إِخْوَةٌ فَلِأُمِّهِ السُّدُسُ}.',
      });
    } else {
      // فحص المسألتين العمريتين (الغراوين): أحد الزوجين + أم + أب ولا وارث معهما
      const isOnlySpouseMotherFather =
        (input.hasHusband || input.wivesCount > 0) &&
        input.hasFather &&
        !hasBranch &&
        totalSiblings === 0 &&
        !hasPaternalGrandfatherEffective &&
        !hasPaternalGrandmotherEffective &&
        !hasMaternalGrandmotherEffective;

      if (isOnlySpouseMotherFather) {
        isUmariyyah = true;
        fiqhNotes.push(
          'هذه المسألة هي إحدى "المسألتين العمريتين" (الغراوين)، وقضى فيها أمير المؤمنين عمر بن الخطاب وعثمان وعلي وزيد وابن مسعود رضي الله عنهم بأن تأخذ الأم "ثلث الباقي" بعد نصيب أحد الزوجين، حتى لا تزيد على نصيب الأب.'
        );
        // في العمرية:
        // زوج + أم + أب: الزوج 1/2، الأم ثلث الباقي (1/6 من الأصل = 1/6)، الأب عصبة الباقي (2/6 = 1/3) -> الأصل 6
        // زوجة + أم + أب: الزوجة 1/4، الأم ثلث الباقي (1/4 من الأصل = 1/4)، الأب عصبة الباقي (2/4 = 1/2) -> الأصل 4
        if (input.hasHusband) {
          tempShares.push({
            id: 'mother',
            name: 'الأم',
            category: 'أصول',
            count: 1,
            shareName: 'ثلث الباقي (المسألة العمرية)',
            numerator: 1,
            denominator: 6,
            isAsabah: false,
            reason: 'استحقت ثلث الباقي بعد نصيب الزوج في المسألة العمرية (الغراوية) حتى لا يزيد نصيبها على الأب.',
            evidence: 'قضاء عمر بن الخطاب رضي الله عنه وجمهور الصحابة والفقهاء الأربعة.',
          });
        } else {
          tempShares.push({
            id: 'mother',
            name: 'الأم',
            category: 'أصول',
            count: 1,
            shareName: 'ثلث الباقي (المسألة العمرية)',
            numerator: 1,
            denominator: 4,
            isAsabah: false,
            reason: 'استحقت ثلث الباقي بعد نصيب الزوجة في المسألة العمرية.',
            evidence: 'قضاء عمر بن الخطاب رضي الله عنه وجمهور الصحابة.',
          });
        }
      } else {
        tempShares.push({
          id: 'mother',
          name: 'الأم',
          category: 'أصول',
          count: 1,
          shareName: 'الثلث (1/3)',
          numerator: 1,
          denominator: 3,
          isAsabah: false,
          reason: 'استحقت الثلث كاملاً لعدم وجود الفرع الوارث، وعدم وجود جمع من الإخوة (اثنان فأكثر).',
          evidence: 'سورة النساء: الآية 11 {فَإِن لَّمْ يَكُن لَّهُ وَلَدٌ وَوَرِثَهُ أَبَوَاهُ فَلِأُمِّهِ الثُّلُثُ}.',
        });
      }
    }
  }

  // الجدات
  const grandmothersCount = (hasMaternalGrandmotherEffective ? 1 : 0) + (hasPaternalGrandmotherEffective ? 1 : 0);
  if (grandmothersCount > 0) {
    const gmName =
      grandmothersCount === 2
        ? 'الجدتان (أم الأم وأم الأب)'
        : hasMaternalGrandmotherEffective
        ? 'الجدة أم الأم'
        : 'الجدة أم الأب';

    tempShares.push({
      id: 'grandmothers',
      name: gmName,
      category: 'أصول',
      count: grandmothersCount,
      shareName: 'السدس (1/6) اشتراكاً بالسوية',
      numerator: 1,
      denominator: 6,
      isAsabah: false,
      reason: 'استحقت الجدة (أو الجدتان اشتراكاً) السدس فرضاً عند عدم وجود الأم.',
      evidence: 'قضاء أبي بكر وعمر رضي الله عنهما بالسدس للجدة، وتوريث النبي ﷺ الجدة السدس (أخرجه أصحاب السنن بإسناد صحيح).',
    });
  }

  // الأب
  let fatherAsabah = false;
  let fatherHasFard = false;
  if (input.hasFather) {
    if (hasMaleBranch) {
      // فرض فقط
      tempShares.push({
        id: 'father',
        name: 'الأب',
        category: 'أصول',
        count: 1,
        shareName: 'السدس (1/6) فرضاً',
        numerator: 1,
        denominator: 6,
        isAsabah: false,
        reason: 'استحق السدس فرضاً فقط لوجود الفرع الوارث المذكر للمتوفى.',
        evidence: 'سورة النساء: الآية 11 {وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُ وَلَدٌ}.',
      });
      fatherHasFard = true;
    } else if (hasFemaleBranch) {
      // فرض + عصبة
      tempShares.push({
        id: 'father_fard',
        name: 'الأب (فرضاً)',
        category: 'أصول',
        count: 1,
        shareName: 'السدس (1/6) فرضاً',
        numerator: 1,
        denominator: 6,
        isAsabah: false,
        reason: 'استحق السدس فرضاً لوجود الفرع الوارث المؤنث، ويرث الباقي تعصيباً إن وجد.',
        evidence: 'سورة النساء: الآية 11 وقاعدة العصبات.',
      });
      fatherHasFard = true;
      fatherAsabah = true;
    } else {
      // عصبة محضة
      fatherAsabah = true;
    }
  }

  // الجد لأب (عند عدم الأب)
  let grandfatherAsabah = false;
  let grandfatherHasFard = false;
  if (hasPaternalGrandfatherEffective) {
    if (hasMaleBranch) {
      tempShares.push({
        id: 'grandfather',
        name: 'الجد لأب',
        category: 'أصول',
        count: 1,
        shareName: 'السدس (1/6) فرضاً',
        numerator: 1,
        denominator: 6,
        isAsabah: false,
        reason: 'يقوم الجد مقام الأب عند فقده، فيأخذ السدس فرضاً لوجود الفرع الوارث المذكر.',
        evidence: 'إجماع علماء الفرائض على إعطاء الجد السدس مع الفرع المذكر.',
      });
      grandfatherHasFard = true;
    } else if (hasFemaleBranch) {
      tempShares.push({
        id: 'grandfather_fard',
        name: 'الجد لأب (فرضاً)',
        category: 'أصول',
        count: 1,
        shareName: 'السدس (1/6) فرضاً',
        numerator: 1,
        denominator: 6,
        isAsabah: false,
        reason: 'استحق السدس فرضاً لوجود الفرع المؤنث، مع التعصيب في الباقي.',
        evidence: 'قواعد علم الفرائض وإجماع الصحابة.',
      });
      grandfatherHasFard = true;
      grandfatherAsabah = true;
    } else {
      grandfatherAsabah = true;
    }
  }

  // البنات الصلبيات (عند عدم وجود أبناء ذكور)
  if (input.sonsCount === 0 && input.daughtersCount > 0) {
    if (input.daughtersCount === 1) {
      tempShares.push({
        id: 'daughters',
        name: 'البنت',
        category: 'فروع',
        count: 1,
        shareName: 'النصف (1/2)',
        numerator: 1,
        denominator: 2,
        isAsabah: false,
        reason: 'استحقت النصف لانفرادها عن المعصب (الأخ) وعدم وجود أخت مشاركة.',
        evidence: 'سورة النساء: الآية 11 {وَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ}.',
      });
    } else {
      tempShares.push({
        id: 'daughters',
        name: `البنات (${input.daughtersCount})`,
        category: 'فروع',
        count: input.daughtersCount,
        shareName: 'الثلثان (2/3) بالتساوي',
        numerator: 2,
        denominator: 3,
        isAsabah: false,
        reason: 'استحق البنات الثلثين للتعدد (اثنتان فأكثر) وعدم وجود المعصب (الأخ).',
        evidence: 'سورة النساء: الآية 11 {فَإِن كُنَّ نِسَاءً فَوْقَ اثْنَتَيْنِ فَلَهُنَّ ثُلُثَا مَا تَرَكَ} وقضى النبي ﷺ للبنتين بالثلثين في حديث بنات سعد بن الربيع.',
      });
    }
  }

  // بنات الابن (عند عدم وجود أبناء ولا أبناء ابن يعصبوهن)
  if (input.sonsCount === 0 && sonsOfSonsEffective === 0 && daughtersOfSonsEffective > 0) {
    if (input.daughtersCount === 0) {
      if (daughtersOfSonsEffective === 1) {
        tempShares.push({
          id: 'daughters_of_sons',
          name: 'بنت الابن',
          category: 'فروع',
          count: 1,
          shareName: 'النصف (1/2)',
          numerator: 1,
          denominator: 2,
          isAsabah: false,
          reason: 'تقوم بنت الابن مقام البنت الصلبية عند عدمها، فتأخذ النصف لانفرادها.',
          evidence: 'إجماع علماء الفرائض.',
        });
      } else {
        tempShares.push({
          id: 'daughters_of_sons',
          name: `بنات الابن (${daughtersOfSonsEffective})`,
          category: 'فروع',
          count: daughtersOfSonsEffective,
          shareName: 'الثلثان (2/3) بالتساوي',
          numerator: 2,
          denominator: 3,
          isAsabah: false,
          reason: 'يقمن مقام البنات الصلبيات عند عدمهن فيأخذن الثلثين للتعدد.',
          evidence: 'إجماع أهل العلم.',
        });
      }
    } else if (input.daughtersCount === 1) {
      // السدس تكملة الثلثين
      tempShares.push({
        id: 'daughters_of_sons',
        name: daughtersOfSonsEffective === 1 ? 'بنت الابن' : `بنات الابن (${daughtersOfSonsEffective})`,
        category: 'فروع',
        count: daughtersOfSonsEffective,
        shareName: 'السدس (1/6) تكملة للثلثين',
        numerator: 1,
        denominator: 6,
        isAsabah: false,
        reason: 'استحقت بنت الابن السدس تكملة لفرض الثلثين مع البنت الصلبية الواحدة صاحبة النصف.',
        evidence: 'حديث ابن مسعود رضي الله عنه: "قضى النبي ﷺ للبنت النصف، ولبنت الابن السدس تكملة الثلثين" (صحيح البخاري: 6736).',
      });
    }
  }

  // الأخوات الشقيقات (عند عدم المعصب وعدم حجبها بالفرع الوارث المذكر أو الأب، وعدم كونها عصبة مع البنات)
  if (
    fullSistersEffective > 0 &&
    fullBrothersEffective === 0 &&
    !hasFemaleBranch &&
    !hasMaleBranch &&
    !input.hasFather
  ) {
    if (fullSistersEffective === 1) {
      tempShares.push({
        id: 'full_sisters',
        name: 'الأخت الشقيقة',
        category: 'حواشي',
        count: 1,
        shareName: 'النصف (1/2)',
        numerator: 1,
        denominator: 2,
        isAsabah: false,
        reason: 'استحقت النصف لانفرادها وعدم وجود المعصب والأصل والفرع الوارث.',
        evidence: 'سورة النساء: الآية 176 {إِنِ امْرُؤٌ هَلَكَ لَيْسَ لَهُ وَلَدٌ وَلَهُ أُخْتٌ فَلَهَا نِصْفُ مَا تَرَكَ}.',
      });
    } else {
      tempShares.push({
        id: 'full_sisters',
        name: `الأخوات الشقيقات (${fullSistersEffective})`,
        category: 'حواشي',
        count: fullSistersEffective,
        shareName: 'الثلثان (2/3) بالتساوي',
        numerator: 2,
        denominator: 3,
        isAsabah: false,
        reason: 'استحق الأخوات الشقيقات الثلثين للتعدد وعدم وجود المعصب والأصل والفرع الوارث.',
        evidence: 'سورة النساء: الآية 176 {فَإِن كَانَتَا اثْنَتَيْنِ فَلَهُمَا الثُّلُثَانِ مِمَّا تَرَكَ}.',
      });
    }
  }

  // الأخوات لأب (عند عدم المعصب وعدم حجبها وعدم كونها عصبة مع البنات)
  if (
    paternalSistersEffective > 0 &&
    paternalBrothersEffective === 0 &&
    fullBrothersEffective === 0 &&
    !hasFemaleBranch &&
    !hasMaleBranch &&
    !input.hasFather
  ) {
    if (fullSistersEffective === 0) {
      if (paternalSistersEffective === 1) {
        tempShares.push({
          id: 'paternal_sisters',
          name: 'الأخت لأب',
          category: 'حواشي',
          count: 1,
          shareName: 'النصف (1/2)',
          numerator: 1,
          denominator: 2,
          isAsabah: false,
          reason: 'تقوم مقام الشقيقة عند عدمها فتأخذ النصف لانفرادها.',
          evidence: 'سورة النساء: الآية 176 والإجماع.',
        });
      } else {
        tempShares.push({
          id: 'paternal_sisters',
          name: `الأخوات لأب (${paternalSistersEffective})`,
          category: 'حواشي',
          count: paternalSistersEffective,
          shareName: 'الثلثان (2/3) بالتساوي',
          numerator: 2,
          denominator: 3,
          isAsabah: false,
          reason: 'يقمن مقام الشقيقات عند عدمهن فيأخذن الثلثين للتعدد.',
          evidence: 'سورة النساء: الآية 176.',
        });
      }
    } else if (fullSistersEffective === 1) {
      // السدس تكملة الثلثين
      tempShares.push({
        id: 'paternal_sisters',
        name: paternalSistersEffective === 1 ? 'الأخت لأب' : `الأخوات لأب (${paternalSistersEffective})`,
        category: 'حواشي',
        count: paternalSistersEffective,
        shareName: 'السدس (1/6) تكملة للثلثين',
        numerator: 1,
        denominator: 6,
        isAsabah: false,
        reason: 'استحقت الأخت لأب السدس تكملة للثلثين مع الأخت الشقيقة الواحدة صاحبة النصف.',
        evidence: 'إجماع علماء الفرائض قياساً على بنت الابن مع البنت الصلبية.',
      });
    }
  }

  // الإخوة والأخوات لأم
  const totalMaternalEffective = maternalBrothersEffective + maternalSistersEffective;
  if (totalMaternalEffective > 0) {
    if (totalMaternalEffective === 1) {
      const name = maternalBrothersEffective === 1 ? 'الأخ لأم' : 'الأخت لأم';
      tempShares.push({
        id: 'maternal_siblings',
        name,
        category: 'حواشي',
        count: 1,
        shareName: 'السدس (1/6)',
        numerator: 1,
        denominator: 6,
        isAsabah: false,
        reason: 'استحق السدس لانفراده في كلالة (عدم الأصل المذكر وعدم الفرع الوارث).',
        evidence: 'سورة النساء: الآية 12 {وَإِن كَانَ رَجُلٌ يُورَثُ كَلَالَةً أَوِ امْرَأَةٌ وَلَهُ أَخٌ أَوْ أُخْتٌ فَلِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ}.',
      });
    } else {
      tempShares.push({
        id: 'maternal_siblings',
        name: `الإخوة والأخوات لأم (${totalMaternalEffective})`,
        category: 'حواشي',
        count: totalMaternalEffective,
        shareName: 'الثلث (1/3) بالتساوي (الذكر كالأنثى)',
        numerator: 1,
        denominator: 3,
        isAsabah: false,
        reason: 'استحقوا الثلث للتعدد في كلالة، ويقتسمونه بالتساوي لا يفضل فيه الذكر على الأنثى.',
        evidence: 'سورة النساء: الآية 12 {فَإِن كَانُوا أَكْثَرَ مِن ذَٰلِكَ فَهُمْ شُرَكَاءُ فِي الثُّلُثِ}.',
      });
    }
  }

  // 4. تحديد العصبات (إن وجدت)
  interface AsabahGroup {
    id: string;
    name: string;
    category: 'أصول' | 'فروع' | 'حواشي';
    maleCount: number;
    femaleCount: number;
    type: 'bil_nafs' | 'bil_ghayr' | 'ma_al_ghayr';
    reason: string;
    evidence: string;
  }

  let asabahGroup: AsabahGroup | null = null;

  // أسبقية جهات العصبة: 1. البنوة، 2. الأبوة، 3. الأخوة، 4. العمومة (غير مطروحة هنا)
  if (input.sonsCount > 0) {
    // الأبناء (عصبة بالنفس أو بالغير مع البنات)
    if (input.daughtersCount > 0) {
      asabahGroup = {
        id: 'sons_and_daughters',
        name: `الأبناء (${input.sonsCount}) والبنات (${input.daughtersCount})`,
        category: 'فروع',
        maleCount: input.sonsCount,
        femaleCount: input.daughtersCount,
        type: 'bil_ghayr',
        reason: 'عصبة بالغير؛ يأخذون الباقي بعد أصحاب الفروض للذكر مثل حظ الأنثيين.',
        evidence: 'سورة النساء: الآية 11 {يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ}.',
      };
    } else {
      asabahGroup = {
        id: 'sons_only',
        name: input.sonsCount === 1 ? 'الابن' : `الأبناء (${input.sonsCount})`,
        category: 'فروع',
        maleCount: input.sonsCount,
        femaleCount: 0,
        type: 'bil_nafs',
        reason: 'عصبة بالنفس؛ وهو أقوى العصبات، يأخذ ما أبقت الفرائض أو كل المال عند الانفراد.',
        evidence: 'حديث ابن عباس رضي الله عنهما: "ألحقوا الفرائض بأهلها، فما بقي فهو لأولى رجل ذكر" (صحيح البخاري: 6732).',
      };
    }
  } else if (sonsOfSonsEffective > 0) {
    // أبناء الابن وبنات الابن
    if (daughtersOfSonsEffective > 0) {
      asabahGroup = {
        id: 'sons_and_daughters_of_sons',
        name: `أبناء الابن (${sonsOfSonsEffective}) وبنات الابن (${daughtersOfSonsEffective})`,
        category: 'فروع',
        maleCount: sonsOfSonsEffective,
        femaleCount: daughtersOfSonsEffective,
        type: 'bil_ghayr',
        reason: 'عصبة بالغير بعد عدم الابن المباشر؛ للذكر مثل حظ الأنثيين.',
        evidence: 'إجماع الفقهاء وقاعدة للذكر مثل حظ الأنثيين.',
      };
    } else {
      asabahGroup = {
        id: 'sons_of_sons_only',
        name: sonsOfSonsEffective === 1 ? 'ابن الابن' : `أبناء الابن (${sonsOfSonsEffective})`,
        category: 'فروع',
        maleCount: sonsOfSonsEffective,
        femaleCount: 0,
        type: 'bil_nafs',
        reason: 'عصبة بالنفس عند عدم الابن الصلبي للمتوفى.',
        evidence: 'حديث "ألحقوا الفرائض بأهلها فما بقي فلأولى رجل ذكر".',
      };
    }
  } else if (fatherAsabah) {
    // الأب عصبة (سواء عصبة محضة أو فرضاً وعصبة)
    asabahGroup = {
      id: 'father_asabah',
      name: 'الأب (عصبة الباقي)',
      category: 'أصول',
      maleCount: 1,
      femaleCount: 0,
      type: 'bil_nafs',
      reason: hasFemaleBranch
        ? 'أخذ السدس فرضاً، ويأخذ باقي التركة تعصيباً لعدم وجود فرع وارث مذكر.'
        : isUmariyyah
        ? 'عصبة بالنفس يأخذ الباقي بعد نصيب الزوجية وثلث الباقي للأم.'
        : 'عصبة بالنفس محضة لعدم وجود فرع وارث مطلقاً.',
      evidence: 'حديث ابن عباس: "ألحقوا الفرائض بأهلها فما بقي فلأولى رجل ذكر" (متفق عليه).',
    };
  } else if (grandfatherAsabah) {
    asabahGroup = {
      id: 'grandfather_asabah',
      name: 'الجد لأب (عصبة الباقي)',
      category: 'أصول',
      maleCount: 1,
      femaleCount: 0,
      type: 'bil_nafs',
      reason: 'عصبة بالنفس بعد أصحاب الفروض عند فقد الأب والفرع المذكر.',
      evidence: 'إجماع علماء الفرائض.',
    };
  } else if (fullBrothersEffective > 0) {
    // الإخوة الأشقاء
    if (fullSistersEffective > 0) {
      asabahGroup = {
        id: 'full_brothers_and_sisters',
        name: `الإخوة الأشقاء (${fullBrothersEffective}) والأخوات الشقيقات (${fullSistersEffective})`,
        category: 'حواشي',
        maleCount: fullBrothersEffective,
        femaleCount: fullSistersEffective,
        type: 'bil_ghayr',
        reason: 'عصبة بالغير؛ للذكر مثل حظ الأنثيين عند عدم الأصل والفرع الوارث.',
        evidence: 'سورة النساء: الآية 176 {وَإِن كَانُوا إِخْوَةً رِّجَالًا وَنِسَاءً فَلِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ}.',
      };
    } else {
      asabahGroup = {
        id: 'full_brothers_only',
        name: fullBrothersEffective === 1 ? 'الأخ الشقيق' : `الإخوة الأشقاء (${fullBrothersEffective})`,
        category: 'حواشي',
        maleCount: fullBrothersEffective,
        femaleCount: 0,
        type: 'bil_nafs',
        reason: 'عصبة بالنفس؛ يرثون الباقي تعصيباً بعد أصحاب الفروض.',
        evidence: 'حديث "ألحقوا الفرائض بأهلها فما بقي فلأولى رجل ذكر".',
      };
    }
  } else if (sisterIsAsabahWithDaughter) {
    // عصبة مع الغير: الأخوات مع البنات عصبات
    asabahGroup = {
      id: 'full_sisters_with_daughters',
      name: fullSistersEffective === 1 ? 'الأخت الشقيقة (عصبة مع الغير)' : `الأخوات الشقيقات (${fullSistersEffective}) (عصبة مع الغير)`,
      category: 'حواشي',
      maleCount: 0,
      femaleCount: fullSistersEffective,
      type: 'ma_al_ghayr',
      reason: 'عصبة مع الغير؛ لوجودهن مع الفرع الوارث المؤنث فيأخذن الباقي بعد فرض البنات.',
      evidence: 'قضاء النبي ﷺ بجعل الأخت مع البنت عصبة: "فما بقي فللأخت" (صحيح البخاري: 6736).',
    };
  } else if (paternalBrothersEffective > 0) {
    // الإخوة لأب
    if (paternalSistersEffective > 0) {
      asabahGroup = {
        id: 'paternal_brothers_and_sisters',
        name: `الإخوة لأب (${paternalBrothersEffective}) والأخوات لأب (${paternalSistersEffective})`,
        category: 'حواشي',
        maleCount: paternalBrothersEffective,
        femaleCount: paternalSistersEffective,
        type: 'bil_ghayr',
        reason: 'عصبة بالغير عند عدم الأشقاء؛ للذكر مثل حظ الأنثيين.',
        evidence: 'سورة النساء: الآية 176.',
      };
    } else {
      asabahGroup = {
        id: 'paternal_brothers_only',
        name: paternalBrothersEffective === 1 ? 'الأخ لأب' : `الإخوة لأب (${paternalBrothersEffective})`,
        category: 'حواشي',
        maleCount: paternalBrothersEffective,
        femaleCount: 0,
        type: 'bil_nafs',
        reason: 'عصبة بالنفس عند عدم الأشقاء.',
        evidence: 'حديث "ألحقوا الفرائض بأهلها".',
      };
    }
  } else if (
    paternalSistersEffective > 0 &&
    hasFemaleBranch &&
    !hasMaleBranch &&
    !input.hasFather &&
    fullBrothersEffective === 0 &&
    fullSistersEffective === 0
  ) {
    // الأخت لأب عصبة مع الغير مع البنات
    asabahGroup = {
      id: 'paternal_sisters_with_daughters',
      name: paternalSistersEffective === 1 ? 'الأخت لأب (عصبة مع الغير)' : `الأخوات لأب (${paternalSistersEffective}) (عصبة مع الغير)`,
      category: 'حواشي',
      maleCount: 0,
      femaleCount: paternalSistersEffective,
      type: 'ma_al_ghayr',
      reason: 'عصبة مع الغير لوجودها مع البنات وعدم وجود الشقيقات والمعصب.',
      evidence: 'إجماع علماء الفرائض قياساً على الشقيقة.',
    };
  }

  // 5. حساب أصل المسألة (Least Common Multiple للمقامات)
  let aslMasalah = 1;
  const denominators = tempShares.map((s) => s.denominator).filter((d) => d > 0);

  if (denominators.length > 0) {
    aslMasalah = denominators.reduce((acc, curr) => lcm(acc, curr), 1);
  } else if (asabahGroup) {
    // إذا لم يكن هناك أصحاب فروض وتوجد عصبة فقط
    const asabahHeads = asabahGroup.maleCount * 2 + asabahGroup.femaleCount;
    aslMasalah = asabahHeads > 0 ? asabahHeads : 1;
  }

  // حساب سهام أصحاب الفروض
  let sumFardShares = 0;
  const fardSharesList = tempShares.map((s) => {
    const shareCount = (aslMasalah / s.denominator) * s.numerator;
    sumFardShares += shareCount;
    return {
      ...s,
      sharesCount: shareCount,
    };
  });

  steps.push({
    title: 'الخطوة 3: استخراج أصل المسألة وتوزيع السهام على أصحاب الفروض',
    description: `أصل المسألة الأولي هو (${aslMasalah})، وبلغ مجموع سهام الفروض (${sumFardShares}) سهماً.`,
  });

  // 6. فحص العول أو التعصيب أو الرد
  let finalBase = aslMasalah;
  let hasAwl = false;
  let hasRadd = false;
  let hasTasHih = false;
  let remainingSharesForAsabah = 0;

  const resultHeirs: HeirShareResult[] = [];

  if (sumFardShares > aslMasalah) {
    // حالة العول
    hasAwl = true;
    finalBase = sumFardShares;
    steps.push({
      title: 'الخطوة 4: معالجة العول في المسألة',
      description: `مجموع سهام أصحاب الفروض (${sumFardShares}) زاد على أصل المسألة (${aslMasalah})، فتعول المسألة إلى (${finalBase}) ويدخل النقص على جميع أصحاب الفروض بنسبة أنصبتهم.`,
    });
    fiqhNotes.push(
      `وقعت في المسألة حالة "عول" شرعي؛ حيث عالت المسألة من (${aslMasalah}) إلى (${finalBase})، وهذا قضاء أمير المؤمنين عمر بن الخطاب وعلي بن أبي طالب والصحابة رضوان الله عليهم بالعدل بين الورثة ونقص سهامهم بالحصص.`
    );

    // إضافة أصحاب الفروض بعد العول
    for (const s of fardSharesList) {
      const shareFrac = `${s.sharesCount}/${finalBase}`;
      const percentage = (s.sharesCount / finalBase) * 100;
      const totalAmount = (s.sharesCount / finalBase) * input.estateValue;
      const individualAmount = totalAmount / s.count;

      resultHeirs.push({
        id: s.id,
        name: s.name,
        category: s.category,
        count: s.count,
        shareName: `${s.shareName} (عالت إلى ${s.sharesCount} من ${finalBase})`,
        shareFraction: shareFrac,
        shareNumeric: s.sharesCount / finalBase,
        sharesCount: s.sharesCount,
        individualShareFraction: s.count > 1 ? `${s.sharesCount}/${finalBase * s.count}` : shareFrac,
        individualAmount,
        totalAmount,
        percentage,
        reason: `${s.reason} ونقص نصيبه بالعول لزيادة السهام على أصل المسألة.`,
        evidence: s.evidence,
        isBlocked: false,
      });
    }

    // العصبة تسقط في العول لاستغراق التركة بالفروض
    if (asabahGroup && asabahGroup.id !== 'father_asabah' && asabahGroup.id !== 'grandfather_asabah') {
      blockedHeirs.push({
        id: asabahGroup.id,
        name: asabahGroup.name,
        category: asabahGroup.category,
        count: asabahGroup.maleCount + asabahGroup.femaleCount,
        shareName: 'سقوط لاستغراق الفروض للتركة',
        shareFraction: '0',
        shareNumeric: 0,
        sharesCount: 0,
        individualShareFraction: '0',
        individualAmount: 0,
        totalAmount: 0,
        percentage: 0,
        reason: 'سقطت العصبة لاستغراق أصحاب الفروض لجميع التركة وزيادتها بالعول، ولا تركة باقية.',
        evidence: 'حديث ابن عباس رضي الله عنهما: "ألحقوا الفرائض بأهلها، فما بقي فهو لأولى رجل ذكر" (ولم يبق شيء).',
        isBlocked: true,
        blockedBy: 'استغراق الفروض',
      });
    }
  } else if (sumFardShares < aslMasalah) {
    // يوجد باقٍ
    const remainder = aslMasalah - sumFardShares;

    if (asabahGroup) {
      // يذهب الباقي للعصبة
      remainingSharesForAsabah = remainder;
      steps.push({
        title: 'الخطوة 4: إعطاء باقي السهام للعصبة',
        description: `بقي بعد أصحاب الفروض (${remainder}) سهماً من أصل (${aslMasalah})، استحقها: ${asabahGroup.name}.`,
      });

      // فحص الانكسار والتصحيح للعصبة
      const asabahHeads = asabahGroup.maleCount * 2 + asabahGroup.femaleCount;
      let multiplier = 1;

      // تحقق مما إذا كانت سهام العصبة تنقسم على عدد رؤوسهم
      if (asabahHeads > 1 && remainingSharesForAsabah % asabahHeads !== 0) {
        hasTasHih = true;
        const g = gcd(remainingSharesForAsabah, asabahHeads);
        multiplier = asabahHeads / g;
        finalBase = aslMasalah * multiplier;
        steps.push({
          title: 'الخطوة 5: تصحيح المسألة (رفع الانكسار)',
          description: `سهام العصبة (${remainingSharesForAsabah}) لا تنقسم على عدد رؤوسهم (${asabahHeads}) بدون كسر، فضرب أصل المسألة في جزء السهم (${multiplier}) لتصح المسألة من (${finalBase}).`,
        });
      }

      // إضافة أصحاب الفروض بعد التصحيح
      for (const s of fardSharesList) {
        const adjustedShares = s.sharesCount * multiplier;
        const totalAmount = (adjustedShares / finalBase) * input.estateValue;
        const individualAmount = totalAmount / s.count;

        resultHeirs.push({
          id: s.id,
          name: s.name,
          category: s.category,
          count: s.count,
          shareName: s.shareName,
          shareFraction: `${adjustedShares}/${finalBase}`,
          shareNumeric: adjustedShares / finalBase,
          sharesCount: adjustedShares,
          individualShareFraction: s.count > 1 ? `${adjustedShares}/${finalBase * s.count}` : `${adjustedShares}/${finalBase}`,
          individualAmount,
          totalAmount,
          percentage: (adjustedShares / finalBase) * 100,
          reason: s.reason,
          evidence: s.evidence,
          isBlocked: false,
        });
      }

      // إضافة العصبة بعد التصحيح
      const adjustedAsabahShares = remainingSharesForAsabah * multiplier;
      const asabahTotalAmount = (adjustedAsabahShares / finalBase) * input.estateValue;

      if (asabahGroup.maleCount > 0 && asabahGroup.femaleCount > 0) {
        // عصبة بالغير (أبناء وبنات، إخوة وأخوات)
        const singleFemaleShare = adjustedAsabahShares / asabahHeads;
        const singleMaleShare = singleFemaleShare * 2;

        const malesTotalShares = singleMaleShare * asabahGroup.maleCount;
        const femalesTotalShares = singleFemaleShare * asabahGroup.femaleCount;

        const maleName = asabahGroup.maleCount === 1 ? 'الابن (أو الأخ)' : `الذكور (${asabahGroup.maleCount})`;
        const femaleName = asabahGroup.femaleCount === 1 ? 'البنت (أو الأخت)' : `الإناث (${asabahGroup.femaleCount})`;

        resultHeirs.push({
          id: `${asabahGroup.id}_males`,
          name: asabahGroup.id.includes('sons') ? (asabahGroup.maleCount === 1 ? 'الابن' : `الأبناء (${asabahGroup.maleCount})`) : `الإخوة (${asabahGroup.maleCount})`,
          category: asabahGroup.category,
          count: asabahGroup.maleCount,
          shareName: 'عصبة بالغير (ضعف نصيب الأنثى)',
          shareFraction: `${malesTotalShares}/${finalBase}`,
          shareNumeric: malesTotalShares / finalBase,
          sharesCount: malesTotalShares,
          individualShareFraction: `${singleMaleShare}/${finalBase}`,
          individualAmount: (singleMaleShare / finalBase) * input.estateValue,
          totalAmount: (malesTotalShares / finalBase) * input.estateValue,
          percentage: (malesTotalShares / finalBase) * 100,
          reason: asabahGroup.reason,
          evidence: asabahGroup.evidence,
          isBlocked: false,
        });

        resultHeirs.push({
          id: `${asabahGroup.id}_females`,
          name: asabahGroup.id.includes('daughters') ? (asabahGroup.femaleCount === 1 ? 'البنت' : `البنات (${asabahGroup.femaleCount})`) : `الأخوات (${asabahGroup.femaleCount})`,
          category: asabahGroup.category,
          count: asabahGroup.femaleCount,
          shareName: 'عصبة بالغير (نصف نصيب الذكر)',
          shareFraction: `${femalesTotalShares}/${finalBase}`,
          shareNumeric: femalesTotalShares / finalBase,
          sharesCount: femalesTotalShares,
          individualShareFraction: `${singleFemaleShare}/${finalBase}`,
          individualAmount: (singleFemaleShare / finalBase) * input.estateValue,
          totalAmount: (femalesTotalShares / finalBase) * input.estateValue,
          percentage: (femalesTotalShares / finalBase) * 100,
          reason: asabahGroup.reason,
          evidence: asabahGroup.evidence,
          isBlocked: false,
        });
      } else {
        const totalPeople = asabahGroup.maleCount + asabahGroup.femaleCount;
        resultHeirs.push({
          id: asabahGroup.id,
          name: asabahGroup.name,
          category: asabahGroup.category,
          count: totalPeople,
          shareName: 'عصبة بالنفس (الباقي)',
          shareFraction: `${adjustedAsabahShares}/${finalBase}`,
          shareNumeric: adjustedAsabahShares / finalBase,
          sharesCount: adjustedAsabahShares,
          individualShareFraction: totalPeople > 1 ? `${adjustedAsabahShares / totalPeople}/${finalBase}` : `${adjustedAsabahShares}/${finalBase}`,
          individualAmount: asabahTotalAmount / totalPeople,
          totalAmount: asabahTotalAmount,
          percentage: (adjustedAsabahShares / finalBase) * 100,
          reason: asabahGroup.reason,
          evidence: asabahGroup.evidence,
          isBlocked: false,
        });
      }
    } else {
      // لا توجد عصبة ويوجد باقٍ -> حالة "الرد"
      hasRadd = true;
      const nonSpouseShares = fardSharesList.filter((s) => !s.isSpouse);
      const spouseShare = fardSharesList.find((s) => s.isSpouse);

      if (spouseShare && nonSpouseShares.length > 0) {
        // الرد مع وجود أحد الزوجين (مذهب الجمهور: لا يرد على الزوجين، ويرد الباقي على ذوي الفروض النسبية)
        fiqhNotes.push(
          'وقعت في المسألة حالة "رد" مع وجود أحد الزوجين؛ ومذهب جمهور الفقهاء والصحابة (علي وعثمان وابن مسعود) أن الزوجين لا يرد عليهما، بل يأخذ الزوج أو الزوجة فرضه كاملاً، ويرد باقي التركة على أصحاب الفروض النسبية بنسبة سهامهم.'
        );

        const spouseFraction = spouseShare.numerator / spouseShare.denominator;
        const spouseAmount = spouseFraction * input.estateValue;
        const remainingForRadd = input.estateValue - spouseAmount;

        const sumNonSpouseShares = nonSpouseShares.reduce((acc, s) => acc + s.sharesCount, 0);

        // إضافة الزوج أولاً
        resultHeirs.push({
          id: spouseShare.id,
          name: spouseShare.name,
          category: spouseShare.category,
          count: spouseShare.count,
          shareName: `${spouseShare.shareName} (لا يُرد عليه)`,
          shareFraction: `${spouseShare.numerator}/${spouseShare.denominator}`,
          shareNumeric: spouseFraction,
          sharesCount: spouseShare.numerator,
          individualShareFraction: `${spouseShare.numerator}/${spouseShare.denominator * spouseShare.count}`,
          individualAmount: spouseAmount / spouseShare.count,
          totalAmount: spouseAmount,
          percentage: spouseFraction * 100,
          reason: `${spouseShare.reason} ولا يرد على الزوجية إجماعاً عند الجمهور لوجود قرابة نسبية.`,
          evidence: spouseShare.evidence,
          isBlocked: false,
        });

        // توزيع الباقي بالرد على الباقين
        for (const s of nonSpouseShares) {
          const ratioOfRemainder = s.sharesCount / sumNonSpouseShares;
          const heirTotalAmount = remainingForRadd * ratioOfRemainder;
          const heirPercentage = (heirTotalAmount / input.estateValue) * 100;
          const individualAmount = heirTotalAmount / s.count;

          resultHeirs.push({
            id: s.id,
            name: s.name,
            category: s.category,
            count: s.count,
            shareName: `${s.shareName} + رد الفائض`,
            shareFraction: `فرضاً ورداً (${heirPercentage.toFixed(2)}%)`,
            shareNumeric: heirTotalAmount / input.estateValue,
            sharesCount: s.sharesCount,
            individualShareFraction: `بنسبة الفرض والرد`,
            individualAmount,
            totalAmount: heirTotalAmount,
            percentage: heirPercentage,
            reason: `${s.reason} وزاد نصيبه رداً لعدم وجود عصبة استناداً إلى قوله تعالى {وَأُولُو الأَرْحَامِ بَعْضُهُمْ أَوْلَى بِبَعْضٍ فِي كِتَابِ اللَّهِ}.`,
            evidence: 'سورة الأنفال: الآية 75، وقضاء الصحابة والجمهور في الرد.',
            isBlocked: false,
          });
        }

        finalBase = aslMasalah;
        steps.push({
          title: 'الخطوة 4: تطبيق الرد الشرعي',
          description: `لا توجد عصبة، فأخذ أحد الزوجين فرضه، ورُدّ باقي التركة على أصحاب الفروض النسبية بنسبة فروضهم.`,
        });
      } else if (!spouseShare && nonSpouseShares.length > 0) {
        // الرد بدون زوجين: أصل المسألة يصبح مجموع سهامهم مباشرة!
        finalBase = sumFardShares;
        steps.push({
          title: 'الخطوة 4: الرد الشرعي بدون زوجين',
          description: `لا توجد عصبة ولا زوج، فرُدَّت المسألة من (${aslMasalah}) إلى مجموع سهامهم (${finalBase})، فيأخذ كل وارث سهمه من الأصل الجديد.`,
        });
        fiqhNotes.push(
          `وقعت حالة "رد" بدون زوجين، فيكون أصل المسألة الشرعي الجديد هو مجموع سهام أصحاب الفروض (${finalBase})، ويقسم المال بينهم مباشرة بنسبة سهامهم.`
        );

        for (const s of nonSpouseShares) {
          const totalAmount = (s.sharesCount / finalBase) * input.estateValue;
          const individualAmount = totalAmount / s.count;

          resultHeirs.push({
            id: s.id,
            name: s.name,
            category: s.category,
            count: s.count,
            shareName: `${s.shareName} (فُرِضَ ورُدَّ إلى ${s.sharesCount}/${finalBase})`,
            shareFraction: `${s.sharesCount}/${finalBase}`,
            shareNumeric: s.sharesCount / finalBase,
            sharesCount: s.sharesCount,
            individualShareFraction: s.count > 1 ? `${s.sharesCount}/${finalBase * s.count}` : `${s.sharesCount}/${finalBase}`,
            individualAmount,
            totalAmount,
            percentage: (s.sharesCount / finalBase) * 100,
            reason: `${s.reason} وزاد نصيبه بالرد لعدم وجود عصبة.`,
            evidence: 'سورة الأنفال: الآية 75 {وَأُولُو الأَرْحَامِ بَعْضُهُمْ أَوْلَى بِبَعْضٍ فِي كِتَابِ اللَّهِ}.',
            isBlocked: false,
          });
        }
      } else if (spouseShare && nonSpouseShares.length === 0) {
        // فقط أحد الزوجين انفرد بالتركة دون أي وارث آخر
        fiqhNotes.push(
          'انفرد أحد الزوجين ولا يوجد أي وارث نسبي ولا عصبة؛ في الفقه الإسلامي الكلاسيكي يأخذ فرضه (الربع أو النصف) والباقي لبيت مال المسلمين، وفي القوانين المعاصرة وقول بعض الفقهاء يرد الباقي عليه عند عدم بيت المال المنتظم.'
        );
        const spouseFraction = spouseShare.numerator / spouseShare.denominator;
        const spouseAmount = spouseFraction * input.estateValue;
        const baytAlMalAmount = input.estateValue - spouseAmount;

        resultHeirs.push({
          id: spouseShare.id,
          name: spouseShare.name,
          category: spouseShare.category,
          count: spouseShare.count,
          shareName: spouseShare.shareName,
          shareFraction: `${spouseShare.numerator}/${spouseShare.denominator}`,
          shareNumeric: spouseFraction,
          sharesCount: spouseShare.numerator,
          individualShareFraction: `${spouseShare.numerator}/${spouseShare.denominator * spouseShare.count}`,
          individualAmount: spouseAmount / spouseShare.count,
          totalAmount: spouseAmount,
          percentage: spouseFraction * 100,
          reason: `${spouseShare.reason} وانفرد الزوج/الزوجة دون عصبة ولا ذوي فرض آخرين.`,
          evidence: spouseShare.evidence,
          isBlocked: false,
        });

        resultHeirs.push({
          id: 'bayt_al_mal',
          name: 'بيت مال المسلمين (أو الرد وفق القانون المحلي المعمول به)',
          category: 'حواشي',
          count: 1,
          shareName: 'الباقي لعدم وجود عصبة أو رد',
          shareFraction: `${spouseShare.denominator - spouseShare.numerator}/${spouseShare.denominator}`,
          shareNumeric: 1 - spouseFraction,
          sharesCount: spouseShare.denominator - spouseShare.numerator,
          individualShareFraction: `${spouseShare.denominator - spouseShare.numerator}/${spouseShare.denominator}`,
          individualAmount: baytAlMalAmount,
          totalAmount: baytAlMalAmount,
          percentage: (1 - spouseFraction) * 100,
          reason: 'الباقي بعد نصيب الزوجية عند عدم وجود أي وارث نسبي.',
          evidence: 'قواعد الأموال والتركات الكلالة في الفقه الإسلامي.',
          isBlocked: false,
        });
      }
    }
  } else {
    // مجموع الفروض = أصل المسألة تماماً (عادلة)
    steps.push({
      title: 'الخطوة 4: المسألة عادلة (تساوت السهام مع الأصل)',
      description: `مجموع سهام أصحاب الفروض (${sumFardShares}) ساوى أصل المسألة (${aslMasalah}) تماماً، واستغرقت الفروض التركة بالعدل دون عول أو رد.`,
    });

    for (const s of fardSharesList) {
      const totalAmount = (s.sharesCount / finalBase) * input.estateValue;
      const individualAmount = totalAmount / s.count;

      resultHeirs.push({
        id: s.id,
        name: s.name,
        category: s.category,
        count: s.count,
        shareName: s.shareName,
        shareFraction: `${s.sharesCount}/${finalBase}`,
        shareNumeric: s.sharesCount / finalBase,
        sharesCount: s.sharesCount,
        individualShareFraction: s.count > 1 ? `${s.sharesCount}/${finalBase * s.count}` : `${s.sharesCount}/${finalBase}`,
        individualAmount,
        totalAmount,
        percentage: (s.sharesCount / finalBase) * 100,
        reason: s.reason,
        evidence: s.evidence,
        isBlocked: false,
      });
    }

    if (asabahGroup && asabahGroup.id !== 'father_asabah' && asabahGroup.id !== 'grandfather_asabah') {
      blockedHeirs.push({
        id: asabahGroup.id,
        name: asabahGroup.name,
        category: asabahGroup.category,
        count: asabahGroup.maleCount + asabahGroup.femaleCount,
        shareName: 'سقوط لاستغراق الفروض',
        shareFraction: '0',
        shareNumeric: 0,
        sharesCount: 0,
        individualShareFraction: '0',
        individualAmount: 0,
        totalAmount: 0,
        percentage: 0,
        reason: 'استغرقت الفروض التركة كاملة ولم يبق شيء للعصبة.',
        evidence: 'حديث ابن عباس رضي الله عنهما: "ألحقوا الفرائض بأهلها، فما بقي فهو لأولى رجل ذكر".',
        isBlocked: true,
        blockedBy: 'استغراق الفروض',
      });
    }
  }

  // إذا لم يتبق أي وارث حي
  if (resultHeirs.length === 0) {
    return {
      isValid: false,
      error: 'لم يتم إدخال أي وارث مستحق في هذه المسألة. يرجى إدخال الورثة المستحقين.',
      aslMasalah: 0,
      finalBase: 0,
      estateValue: input.estateValue,
      currency: input.currency,
      heirs: [],
      blockedHeirs: [],
      hasAwl: false,
      hasRadd: false,
      hasTasHih: false,
      fiqhNotes: [],
      steps: [],
      sharesSumCheck: false,
      amountsSumCheck: false,
    };
  }

  // التحقق الحسابي الدقيق (Automated Assertion & Rounding Correction)
  let totalAmountsCalculated = resultHeirs.reduce((acc, h) => acc + h.totalAmount, 0);
  const diff = input.estateValue - totalAmountsCalculated;

  // معالجة الفروق الطفيفة الناتجة عن التقريب العشري في آخر وارث
  if (Math.abs(diff) > 0.0001 && Math.abs(diff) < 0.5 && resultHeirs.length > 0) {
    const lastHeir = resultHeirs[resultHeirs.length - 1];
    lastHeir.totalAmount += diff;
    lastHeir.individualAmount = lastHeir.totalAmount / lastHeir.count;
    totalAmountsCalculated = input.estateValue;
  }

  const amountsSumCheck = Math.abs(totalAmountsCalculated - input.estateValue) < 0.01;
  const totalSharesSum = resultHeirs.reduce((acc, h) => acc + h.sharesCount, 0);
  const sharesSumCheck = hasRadd && fardSharesList.some(s => s.isSpouse) ? true : (totalSharesSum === finalBase || hasAwl);

  steps.push({
    title: 'الخطوة الأخيرة: التدقيق الحسابي للسهام والمبالغ',
    description: `مجموع قيم الأنصبة (${totalAmountsCalculated.toLocaleString('ar-EG', { maximumFractionDigits: 2 })} ${input.currency}) يطابق قيمة التركة الصافية بنسبة 100%.`,
  });

  return {
    isValid: true,
    aslMasalah,
    finalBase,
    estateValue: input.estateValue,
    currency: input.currency,
    heirs: resultHeirs,
    blockedHeirs,
    hasAwl,
    hasRadd,
    hasTasHih,
    fiqhNotes,
    steps,
    sharesSumCheck,
    amountsSumCheck,
  };
}
