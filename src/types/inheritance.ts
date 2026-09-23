/**
 * أنواع وبيانات علم المواريث والفرائض
 */

export type Gender = 'male' | 'female';

export interface HeirsInput {
  deceasedGender: Gender;
  estateValue: number;
  currency: string;
  
  // الزوجية
  hasHusband: boolean;
  wivesCount: number; // 0 to 4
  
  // الأصول
  hasFather: boolean;
  hasMother: boolean;
  hasPaternalGrandfather: boolean;
  hasPaternalGrandmother: boolean;
  hasMaternalGrandmother: boolean;
  
  // الفروع
  sonsCount: number;
  daughtersCount: number;
  sonsOfSonsCount: number;
  daughtersOfSonsCount: number;
  
  // الحواشي - الإخوة الأشقاء
  fullBrothersCount: number;
  fullSistersCount: number;
  
  // الحواشي - الإخوة لأب
  paternalBrothersCount: number;
  paternalSistersCount: number;
  
  // الحواشي - الإخوة لأم
  maternalBrothersCount: number;
  maternalSistersCount: number;
}

export interface HeirShareResult {
  id: string;
  name: string;
  category: 'زوجية' | 'أصول' | 'فروع' | 'حواشي';
  count: number;
  shareName: string; // مثل: الثمن، السدس، عصبة بالنفس، عصبة بالغير، محجوب
  shareFraction: string; // مثل: 1/8, 1/6, 2/3, عصبة
  shareNumeric: number; // النسبة من 1
  sharesCount: number; // عدد السهام في المسألة
  individualShareFraction: string; // نصيب الفرد الواحد
  individualAmount: number; // المبلغ المالي للفرد
  totalAmount: number; // المبلغ الإجمالي لهذه الفئة
  percentage: number; // النسبة المئوية %
  reason: string; // سبب الاستحقاق الفقهي
  evidence: string; // الدليل الشرعي من القرآن أو السنة
  isBlocked: boolean; // هل هو محجوب؟
  blockedBy?: string; // من حجبه؟
}

export interface CalculationResult {
  isValid: boolean;
  error?: string;
  aslMasalah: number; // أصل المسألة الأولي
  finalBase: number; // أصل المسألة بعد العول أو الرد أو التصحيح
  estateValue: number;
  currency: string;
  heirs: HeirShareResult[];
  blockedHeirs: HeirShareResult[];
  hasAwl: boolean;
  hasRadd: boolean;
  hasTasHih: boolean;
  awlAmount?: number;
  raddRatio?: number;
  fiqhNotes: string[];
  steps: {
    title: string;
    description: string;
  }[];
  sharesSumCheck: boolean;
  amountsSumCheck: boolean;
}
