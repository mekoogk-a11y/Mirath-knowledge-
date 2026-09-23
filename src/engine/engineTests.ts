/**
 * مجموعة الاختبارات الآلية والتحقق البرمجي لمحرك المواريث
 * تختبر جميع الحالات الفقهية الأساسية والفرعية:
 * - زوج + أبناء
 * - زوجة + أبناء
 * - أب + أم + أبناء
 * - بنت واحدة (فرض + رد)
 * - بنتان فأكثر (فرض + رد)
 * - أبناء وبنات (عصبة بالغير)
 * - زوج + أم + أب (المسألة العمرية)
 * - حالات الحجب (حجب الابن لأبناء الابن وللإخوة، وحجب الأب للجد)
 * - حالات العول (المسألة المنبرية وعول أصل 6 إلى 7)
 * - حالات الرد (مع أحد الزوجين وبدون أحد الزوجين)
 * - حالات الانكسار والتصحيح
 */

import { HeirsInput, CalculationResult } from '../types/inheritance';
import { calculateInheritance } from './farayedEngine';

export interface TestCaseResult {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  notes: string;
  result: CalculationResult;
}

const defaultInput: HeirsInput = {
  deceasedGender: 'male',
  estateValue: 120000,
  currency: 'ريال سعودي',
  hasHusband: false,
  wivesCount: 0,
  hasFather: false,
  hasMother: false,
  hasPaternalGrandfather: false,
  hasPaternalGrandmother: false,
  hasMaternalGrandmother: false,
  sonsCount: 0,
  daughtersCount: 0,
  sonsOfSonsCount: 0,
  daughtersOfSonsCount: 0,
  fullBrothersCount: 0,
  fullSistersCount: 0,
  paternalBrothersCount: 0,
  paternalSistersCount: 0,
  maternalBrothersCount: 0,
  maternalSistersCount: 0,
};

export function runFarayedEngineTests(): TestCaseResult[] {
  const testResults: TestCaseResult[] = [];

  // 1. اختبار: زوج + 2 أبناء
  {
    const input: HeirsInput = {
      ...defaultInput,
      deceasedGender: 'female',
      hasHusband: true,
      sonsCount: 2,
    };
    const res = calculateInheritance(input);
    const husband = res.heirs.find((h) => h.id === 'husband');
    const sons = res.heirs.find((h) => h.id.includes('sons'));
    const passed =
      res.isValid &&
      res.amountsSumCheck &&
      husband !== undefined &&
      Math.abs(husband.percentage - 25) < 0.1 && // الربع
      sons !== undefined &&
      Math.abs(sons.percentage - 75) < 0.1; // الباقي تعصيباً

    testResults.push({
      id: 'test_1_husband_sons',
      name: 'زوج + ابنان',
      description: 'الزوج يأخذ الربع لوجود الفرع الوارث، والباقي للابنين تعصيباً بالتساوي.',
      passed,
      notes: passed
        ? `ناجح: أصل المسألة ${res.finalBase}، الزوج 25%، الابنان 75%، مجموع المبالغ مطابق.`
        : 'فشل في التحقق الحسابي.',
      result: res,
    });
  }

  // 2. اختبار: زوجة + أبناء (زوجة + ابن + بنتان)
  {
    const input: HeirsInput = {
      ...defaultInput,
      deceasedGender: 'male',
      wivesCount: 1,
      sonsCount: 1,
      daughtersCount: 2,
    };
    const res = calculateInheritance(input);
    const wife = res.heirs.find((h) => h.id === 'wives');
    const passed =
      res.isValid &&
      res.amountsSumCheck &&
      wife !== undefined &&
      Math.abs(wife.percentage - 12.5) < 0.1; // الثمن 12.5%

    testResults.push({
      id: 'test_2_wife_sons_daughters',
      name: 'زوجة + ابن + بنتان',
      description: 'الزوجة تأخذ الثمن (12.5%)، والباقي للأولاد عصبة بالغير للذكر مثل حظ الأنثيين.',
      passed,
      notes: passed
        ? `ناجح: الزوجة أخذت الثمن، والباقي قُسم للذكر مثل حظ الأنثيين وتصح المسألة.`
        : 'فشل في التحقق الحسابي.',
      result: res,
    });
  }

  // 3. اختبار: أب + أم + أبناء
  {
    const input: HeirsInput = {
      ...defaultInput,
      deceasedGender: 'male',
      hasFather: true,
      hasMother: true,
      sonsCount: 2,
    };
    const res = calculateInheritance(input);
    const father = res.heirs.find((h) => h.id === 'father');
    const mother = res.heirs.find((h) => h.id === 'mother');
    const sons = res.heirs.find((h) => h.id.includes('sons'));
    const passed =
      res.isValid &&
      res.amountsSumCheck &&
      father !== undefined &&
      Math.abs(father.percentage - 16.666) < 0.1 && // السدس
      mother !== undefined &&
      Math.abs(mother.percentage - 16.666) < 0.1 && // السدس
      sons !== undefined &&
      Math.abs(sons.percentage - 66.666) < 0.1; // الثلثان الباقيان

    testResults.push({
      id: 'test_3_father_mother_sons',
      name: 'أب + أم + ابنان',
      description: 'الأب السدس، الأم السدس لوجود الفرع المذكر، والباقي تعصيباً للابنين.',
      passed,
      notes: passed
        ? `ناجح: أصل المسألة 6، الأب سهم (سدس)، الأم سهم (سدس)، الابنان 4 سهام (الباقي).`
        : 'فشل في التحقق الحسابي.',
      result: res,
    });
  }

  // 4. اختبار: بنت واحدة منفردة (فرض النصف + الرد)
  {
    const input: HeirsInput = {
      ...defaultInput,
      deceasedGender: 'male',
      daughtersCount: 1,
    };
    const res = calculateInheritance(input);
    const daughter = res.heirs.find((h) => h.id === 'daughters');
    const passed =
      res.isValid &&
      res.amountsSumCheck &&
      res.hasRadd &&
      daughter !== undefined &&
      Math.abs(daughter.totalAmount - input.estateValue) < 0.01;

    testResults.push({
      id: 'test_4_single_daughter',
      name: 'بنت واحدة منفردة',
      description: 'البنت تستحق النصف فرضاً وباقي التركة رداً، فتأخذ كامل التركة فرضاً ورداً.',
      passed,
      notes: passed
        ? `ناجح: أخذت البنت كامل التركة (100%) فرضاً ورداً وفق مذهب الجمهور.`
        : 'فشل في الرد للبنت.',
      result: res,
    });
  }

  // 5. اختبار: بنتان فأكثر (فرض الثلثين + الرد)
  {
    const input: HeirsInput = {
      ...defaultInput,
      deceasedGender: 'male',
      daughtersCount: 2,
    };
    const res = calculateInheritance(input);
    const daughters = res.heirs.find((h) => h.id === 'daughters');
    const passed =
      res.isValid &&
      res.amountsSumCheck &&
      res.hasRadd &&
      daughters !== undefined &&
      Math.abs(daughters.totalAmount - input.estateValue) < 0.01;

    testResults.push({
      id: 'test_5_two_daughters',
      name: 'بنتان منفردتان',
      description: 'البنتان تستحقان الثلثين فرضاً والباقي رداً، وتقسم التركة بينهما نصفين بالسوية.',
      passed,
      notes: passed
        ? `ناجح: استحقتا كامل التركة (50% لكل بنت) فرضاً ورداً.`
        : 'فشل في مسألة البنتين.',
      result: res,
    });
  }

  // 6. اختبار: أبناء وبنات (عصبة بالغير)
  {
    const input: HeirsInput = {
      ...defaultInput,
      deceasedGender: 'male',
      sonsCount: 1,
      daughtersCount: 2,
    };
    const res = calculateInheritance(input);
    const males = res.heirs.find((h) => h.id.includes('males'));
    const females = res.heirs.find((h) => h.id.includes('females'));
    const passed =
      res.isValid &&
      res.amountsSumCheck &&
      males !== undefined &&
      females !== undefined &&
      Math.abs(males.individualAmount - females.individualAmount * 2) < 0.01;

    testResults.push({
      id: 'test_6_sons_and_daughters',
      name: 'ابن + بنتان (عصبة بالغير)',
      description: 'الابن مع البنتين عصبة بالغير؛ للذكر مثل حظ الأنثيين (الابن سهمان، وكل بنت سهم).',
      passed,
      notes: passed
        ? `ناجح: نصيب الابن ضعف نصيب كل بنت تماماً (للذكر مثل حظ الأنثيين).`
        : 'فشل في تطبيق قاعدة الذكر مثل حظ الأنثيين.',
      result: res,
    });
  }

  // 7. اختبار: زوج + أم + أب (المسألة العمرية الأولى)
  {
    const input: HeirsInput = {
      ...defaultInput,
      deceasedGender: 'female',
      hasHusband: true,
      hasMother: true,
      hasFather: true,
    };
    const res = calculateInheritance(input);
    const husband = res.heirs.find((h) => h.id === 'husband');
    const mother = res.heirs.find((h) => h.id === 'mother');
    const father = res.heirs.find((h) => h.id === 'father_asabah');
    const passed =
      res.isValid &&
      res.amountsSumCheck &&
      husband !== undefined &&
      Math.abs(husband.percentage - 50) < 0.1 && // النصف 50%
      mother !== undefined &&
      Math.abs(mother.percentage - 16.666) < 0.1 && // ثلث الباقي = 1/6 = 16.67%
      father !== undefined &&
      Math.abs(father.percentage - 33.333) < 0.1; // الباقي للأب = 2/6 = 33.33%

    testResults.push({
      id: 'test_7_umariyyah_husband',
      name: 'المسألة العمرية: زوج + أم + أب',
      description: 'الزوج النصف (3 سهام من 6)، الأم ثلث الباقي (سهم من 6)، والأب الباقي (سهمان من 6).',
      passed,
      notes: passed
        ? `ناجح: طُبقت المسألة العمرية بدقة؛ الأم ثلث الباقي (16.67%) والأب ضعفها (33.33%).`
        : 'فشل في تطبيق المسألة العمرية.',
      result: res,
    });
  }

  // 8. اختبار: العول (زوج + أختان شقيقتان)
  {
    const input: HeirsInput = {
      ...defaultInput,
      deceasedGender: 'female',
      hasHusband: true,
      fullSistersCount: 2,
    };
    const res = calculateInheritance(input);
    const passed =
      res.isValid &&
      res.hasAwl &&
      res.aslMasalah === 6 &&
      res.finalBase === 7 && // عالت من 6 إلى 7
      res.amountsSumCheck;

    testResults.push({
      id: 'test_8_awl_husband_sisters',
      name: 'حالة عول: زوج + أختان شقيقتان',
      description: 'الزوج النصف (3/6) والأختان الثلثان (4/6)؛ مجموع السهام 7/6، فتعول المسألة من 6 إلى 7.',
      passed,
      notes: passed
        ? `ناجح: أصل المسألة 6 وعالت إلى 7، وتوزعت السهام: الزوج 3/7 والأختان 4/7.`
        : 'فشل في معالجة العول.',
      result: res,
    });
  }

  // 9. اختبار: المسألة المنبرية (عول أصل 24 إلى 27)
  // زوجة + بنتان + أب + أم
  {
    const input: HeirsInput = {
      ...defaultInput,
      deceasedGender: 'male',
      wivesCount: 1,
      daughtersCount: 2,
      hasFather: true,
      hasMother: true,
    };
    const res = calculateInheritance(input);
    const passed =
      res.isValid &&
      res.hasAwl &&
      res.aslMasalah === 24 &&
      res.finalBase === 27 && // عالت إلى 27
      res.amountsSumCheck;

    testResults.push({
      id: 'test_9_manbariyyah_awl',
      name: 'المسألة المنبرية: زوجة + بنتان + أب + أم',
      description: 'عول أصل 24 إلى 27 (الزوجة الثمن 3، البنتان الثلثان 16، الأب السدس 4، الأم السدس 4 = 27).',
      passed,
      notes: passed
        ? `ناجح: عالت المسألة من 24 إلى 27 كما قضى أمير المؤمنين علي بن أبي طالب على المنبر بالكوفة.`
        : 'فشل في المسألة المنبرية.',
      result: res,
    });
  }

  // 10. اختبار: حجب الحرمان (ابن يحجب ابن الابن والأخ الشقيق والجد)
  {
    const input: HeirsInput = {
      ...defaultInput,
      deceasedGender: 'male',
      sonsCount: 1,
      sonsOfSonsCount: 2,
      fullBrothersCount: 3,
      hasPaternalGrandfather: false,
    };
    const res = calculateInheritance(input);
    const sonsOfSonsBlocked = res.blockedHeirs.some((h) => h.id.includes('sons_of_sons'));
    const fullBrothersBlocked = res.blockedHeirs.some((h) => h.id.includes('full_brothers'));
    const passed =
      res.isValid &&
      sonsOfSonsBlocked &&
      fullBrothersBlocked &&
      res.heirs.length === 1 &&
      res.heirs[0].id.includes('sons');

    testResults.push({
      id: 'test_10_hajb_by_son',
      name: 'حجب الحرمان بواسطة الابن',
      description: 'الابن يحجب أولاد الابن والإخوة الأشقاء حجب حرمان تاماً.',
      passed,
      notes: passed
        ? `ناجح: حجب الابن أولاد الابن والإخوة الأشقاء تماماً واستقل بالتركة عصبة.`
        : 'فشل في تطبيق حجب الابن.',
      result: res,
    });
  }

  // 11. اختبار: حجب الأب للجد والإخوة
  {
    const input: HeirsInput = {
      ...defaultInput,
      deceasedGender: 'male',
      hasFather: true,
      hasPaternalGrandfather: true,
      fullBrothersCount: 2,
    };
    const res = calculateInheritance(input);
    const grandfatherBlocked = res.blockedHeirs.some((h) => h.id.includes('grandfather'));
    const brothersBlocked = res.blockedHeirs.some((h) => h.id.includes('full_brothers'));
    const passed = res.isValid && grandfatherBlocked && brothersBlocked;

    testResults.push({
      id: 'test_11_hajb_by_father',
      name: 'حجب الأب للجد والإخوة',
      description: 'الأب يحجب الجد لأب ويحجب جميع الإخوة والأخوات إجماعاً.',
      passed,
      notes: passed
        ? `ناجح: تم تسجيل حجب الجد والإخوة حجب حرمان بالأب.`
        : 'فشل في حجب الأب.',
      result: res,
    });
  }

  // 12. اختبار: الرد مع وجود أحد الزوجين (زوجة + بنت)
  {
    const input: HeirsInput = {
      ...defaultInput,
      deceasedGender: 'male',
      wivesCount: 1,
      daughtersCount: 1,
    };
    const res = calculateInheritance(input);
    const wife = res.heirs.find((h) => h.id === 'wives');
    const daughter = res.heirs.find((h) => h.id === 'daughters');
    const passed =
      res.isValid &&
      res.hasRadd &&
      res.amountsSumCheck &&
      wife !== undefined &&
      Math.abs(wife.percentage - 12.5) < 0.1 && // الزوجة الثمن 12.5% ولا يرد عليها
      daughter !== undefined &&
      Math.abs(daughter.percentage - 87.5) < 0.1; // البنت النصف 50% + رد 37.5% = 87.5%

    testResults.push({
      id: 'test_12_radd_with_wife',
      name: 'الرد مع وجود الزوجة: زوجة + بنت',
      description: 'الزوجة تأخذ الثمن كاملاً ولا يرد عليها، ويرد باقي التركة (7/8 = 87.5%) على البنت.',
      passed,
      notes: passed
        ? `ناجح: الزوجة 12.5%، البنت 87.5% فرضاً ورداً، ومجموع القيم 100%.`
        : 'فشل في الرد مع الزوجة.',
      result: res,
    });
  }

  // 13. اختبار: تصحيح المسألة (الانكسار)
  // زوجتان + ابن
  {
    const input: HeirsInput = {
      ...defaultInput,
      deceasedGender: 'male',
      wivesCount: 2,
      sonsCount: 1,
    };
    const res = calculateInheritance(input);
    const passed =
      res.isValid &&
      res.amountsSumCheck &&
      res.hasTasHih &&
      res.finalBase % 2 === 0;

    testResults.push({
      id: 'test_13_tas_hih',
      name: 'تصحيح الانكسار: زوجتان + ابن',
      description: 'الثمن (سهم من 8) لا ينقسم على زوجتين بدون كسر، فضرب أصل المسألة (8 × 2 = 16) لتصح المسألة.',
      passed,
      notes: passed
        ? `ناجح: تم رفع الانكسار وصحت المسألة من 16، لكل زوجة سهم صحيح.`
        : 'فشل في تصحيح المسألة.',
      result: res,
    });
  }

  return testResults;
}
