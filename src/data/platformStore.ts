/**
 * منصة الميراث والوقف
 * إدارة وتخزين بيانات التركات والأوقاف والأصول والعقود والمستندات والعمليات
 * مع حفظ تلقائي في التخزين المحلي (LocalStorage) ودعم المزامنة والتحديث
 */

import {
  EstateCase,
  WaqfRecord,
  CaseDocument,
  SystemAlert,
  AuditLogEntry,
  UserProfile,
  UserRole,
  DisbursementStage,
  WaqfDisbursement,
  WaqfTransaction,
  CaseStatus,
} from '../types/platform';

const STORAGE_KEYS = {
  ESTATES: 'manassah_estates_v1',
  WAQFS: 'manassah_waqfs_v1',
  DOCUMENTS: 'manassah_documents_v1',
  ALERTS: 'manassah_alerts_v1',
  AUDIT_LOGS: 'manassah_audit_logs_v1',
  CURRENT_USER: 'manassah_current_user_v1',
  CALCULATIONS_COUNT: 'manassah_calc_count_v1',
};

// -------------------------------------------------------------
// المستخدمون الافتراضيون والأدوار
// -------------------------------------------------------------

export const SYSTEM_ROLES: { role: UserRole; title: string; description: string; name: string }[] = [
  {
    role: 'trustee',
    title: 'ناظر الوقف',
    name: 'الشيخ عبد الرحمن بن خالد',
    description: 'صلاحيات إدارة الأصول والمصارف واعتماد دورة الصرف والتعاقدات',
  },
  {
    role: 'auditor',
    title: 'مراجع شرعي وقانوني',
    name: 'د. عاصم المصلح',
    description: 'تدقيق المستندات والأنصبة والتحقق من موافقة شروط الواقف',
  },
  {
    role: 'data_entry',
    title: 'مدخل بيانات ومحاسب',
    name: 'أ. طارق الفاتح',
    description: 'إدخال التركات وتسجيل المعاملات المالية والمقترحات',
  },
  {
    role: 'beneficiary',
    title: 'مستفيد / وارث',
    name: 'السيد عبد الله إبراهيم',
    description: 'الاطلاع على الاستحقاق الشخصي والتقارير المعتمدة والمستندات المصرحة',
  },
  {
    role: 'admin',
    title: 'مدير النظام التقني',
    name: 'كمال جعفر زكريا',
    description: 'التحكم الكامل بالإعدادات والصلاحيات وسجلات التدقيق والمحرك',
  },
];

// -------------------------------------------------------------
// البيانات الافتراضية الأولية (Seed Data)
// -------------------------------------------------------------

const DEFAULT_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-26 11:30:00',
    userId: 'usr-1',
    userName: 'الشيخ عبد الرحمن بن خالد',
    userRole: 'ناظر الوقف',
    action: 'اعتماد مرحلة الصرف',
    entityType: 'waqf',
    entityId: 'wqf-1',
    details: 'اعتماد صرف منحة كفالة 50 يتيماً لشهر ربيع الثاني بمبلغ 35,000 ريال',
  },
  {
    id: 'log-2',
    timestamp: '2026-09-25 16:45:00',
    userId: 'usr-2',
    userName: 'د. عاصم المصلح',
    userRole: 'مراجع شرعي وقانوني',
    action: 'مراجعة وتدقيق صك حصر ورثة',
    entityType: 'document',
    entityId: 'doc-1',
    details: 'الموافقة على وثيقة حصر ورثة تركة الشيخ عبد الله بن محمد بعد مطابقة بيانات الدوائر القضائية',
  },
  {
    id: 'log-3',
    timestamp: '2026-09-24 09:15:00',
    userId: 'usr-3',
    userName: 'أ. طارق الفاتح',
    userRole: 'مدخل بيانات',
    action: 'إنشاء ملف تركة جديد',
    entityType: 'estate',
    entityId: 'est-1',
    details: 'إنشاء مسودة ملف تركة المتوفى عبد الله بن محمد بحجم تركة 2,450,000 ريال',
  },
  {
    id: 'log-4',
    timestamp: '2026-09-23 14:20:00',
    userId: 'usr-1',
    userName: 'الشيخ عبد الرحمن بن خالد',
    userRole: 'ناظر الوقف',
    action: 'تجديد عقد إيجار عقار',
    entityType: 'contract',
    entityId: 'cnt-1',
    details: 'تجديد عقد مجمع الأترجة التجاري مع شركة النور المتحدة بقيمة سنوية 180,000 ريال',
  },
];

const DEFAULT_ESTATE_CASES: EstateCase[] = [
  {
    id: 'est-1',
    caseNumber: 'TRK-2026-0104',
    title: 'تركة المرحوم الشيخ عبد الله بن محمد',
    deceasedName: 'عبد الله بن محمد آل سعيد',
    deceasedGender: 'male',
    deathDate: '2026-08-15',
    nationalId: '1098234712',
    city: 'الرياض',
    currency: 'ريال سعودي',
    totalGrossEstate: 2450000,
    totalObligations: 250000,
    netDistributableEstate: 2200000,
    status: 'under_review',
    statusText: 'قيد المراجعة الشرعية',
    createdAt: '2026-08-20',
    updatedAt: '2026-09-25',
    heirsCount: 6,
    notes: 'توفي عن زوجة واحدة، وأم، وابنين، وثلاث بنات. أوصى بثلث ماله في بناء مسجد ومركز قرآني وقد تم عزله مسبقاً قبل التوزيع.',
    assets: [
      {
        id: 'ast-1',
        type: 'real_estate',
        typeName: 'عقار سكني وتجاري',
        title: 'عمارة سكنية بحي الياسمين (4 شقق ومحلات)',
        estimatedValue: 1400000,
        location: 'الرياض - حي الياسمين',
        ownershipDocRef: 'صك إلكتروني رقم 310294829',
      },
      {
        id: 'ast-2',
        type: 'bank_account',
        typeName: 'حساب بنكي جاري',
        title: 'رصيد حساب مصرف الراجحي',
        estimatedValue: 650000,
        location: 'مصرف الراجحي فرع الصحافة',
        ownershipDocRef: 'كشف حساب رسمي بنكي',
      },
      {
        id: 'ast-3',
        type: 'shares',
        typeName: 'أسهم وصناديق استثمارية',
        title: 'محفظة أسهم في السوق المالية السعودية (تداول)',
        estimatedValue: 280000,
        location: 'شركة دراية المالية',
      },
      {
        id: 'ast-4',
        type: 'vehicle',
        typeName: 'مركبة',
        title: 'سيارة تويوتا لاندكروزر 2023',
        estimatedValue: 120000,
        location: 'الرياض',
      },
    ],
    obligations: [
      {
        id: 'ob-1',
        type: 'funeral',
        typeName: 'مؤن التجهيز والدفن',
        title: 'تكاليف التجهيز والإكرام والدفن',
        amount: 8000,
        isSettled: true,
      },
      {
        id: 'ob-2',
        type: 'debt_people',
        typeName: 'ديون للعباد',
        title: 'متبقي قرض تجاري موثق بسند لأمر',
        amount: 142000,
        creditorOrBeneficiary: 'مؤسسة الوفاء للتجارة',
        dueDate: '2026-10-01',
        isSettled: false,
      },
      {
        id: 'ob-3',
        type: 'bequest',
        typeName: 'وصية شرعية',
        title: 'وصية الوقف الخيري بثلث المال أو ما يعادل 100 ألف محددة',
        amount: 100000,
        creditorOrBeneficiary: 'جمعية رعاية الأيتام',
        isSettled: false,
      },
    ],
    documents: [
      {
        id: 'doc-1',
        caseId: 'est-1',
        title: 'صك حصر الورثة الصادر من محكمة الأحوال الشخصية',
        type: 'heirs_proof',
        typeName: 'صك حصر ورثة',
        uploadDate: '2026-08-22',
        ownerName: 'المحكمة الشرعية',
        fileSizeText: '2.4 MB',
        reviewStatus: 'approved',
        reviewerName: 'د. عاصم المصلح',
        reviewerNotes: 'مستند مكتمل وموثق رسمياً برقم صك صحيح.',
      },
      {
        id: 'doc-2',
        caseId: 'est-1',
        title: 'شهادة الوفاة الرسمية',
        type: 'death_certificate',
        typeName: 'شهادة وفاة',
        uploadDate: '2026-08-20',
        ownerName: 'الأحوال المدنية والصحة',
        fileSizeText: '1.1 MB',
        reviewStatus: 'approved',
        reviewerName: 'د. عاصم المصلح',
      },
      {
        id: 'doc-3',
        caseId: 'est-1',
        title: 'صك ملكية العمارة السكنية بحي الياسمين',
        type: 'property_title',
        typeName: 'صك ملكية عقار',
        uploadDate: '2026-08-23',
        ownerName: 'وزارة العدل - البورصة العقارية',
        fileSizeText: '3.8 MB',
        reviewStatus: 'approved',
      },
    ],
    tasks: [
      {
        id: 'tsk-1',
        caseId: 'est-1',
        title: 'سداد متبقي الدين لمؤسسة الوفاء للتجارة وفك السند',
        assigneeName: 'طارق الفاتح',
        dueDate: '2026-10-05',
        status: 'in_progress',
        priority: 'urgent',
      },
      {
        id: 'tsk-2',
        caseId: 'est-1',
        title: 'مراجعة تثمين المحفظة الاستثمارية وتسييل الأصول تمهيداً للتوزيع',
        assigneeName: 'د. عاصم المصلح',
        dueDate: '2026-10-15',
        status: 'pending',
        priority: 'normal',
      },
    ],
    reviews: [
      {
        id: 'rev-1',
        caseId: 'est-1',
        reviewerName: 'د. عاصم المصلح',
        reviewerRole: 'مراجع شرعي',
        date: '2026-09-25',
        decision: 'approved',
        notes: 'تمت مطابقة الأنصبة الشرعية: الزوجة الثمن (3/24)، الأم السدس (4/24)، والباقي عصوبة للابنين والبنات الثلاث للذكر مثل حظ الأنثيين.',
      },
    ],
    auditLogs: [
      {
        id: 'aud-est-1',
        timestamp: '2026-08-20 10:00:00',
        userId: 'usr-3',
        userName: 'طارق الفاتح',
        userRole: 'مدخل بيانات',
        action: 'إنشاء ملف التركة',
        entityType: 'estate',
        entityId: 'est-1',
        details: 'تم قيد ملف التركة وحصر البيانات الأساسية',
      },
    ],
  },
  {
    id: 'est-2',
    caseNumber: 'TRK-2026-0105',
    title: 'تركة المرحومة فاطمة الزهراء الشريف',
    deceasedName: 'فاطمة الزهراء الشريف الحسن',
    deceasedGender: 'female',
    deathDate: '2026-07-10',
    nationalId: '2081736192',
    city: 'الخرطوم / أم درمان',
    currency: 'جنيه سوداني',
    totalGrossEstate: 85000000,
    totalObligations: 5000000,
    netDistributableEstate: 80000000,
    status: 'needs_completion',
    statusText: 'يحتاج استكمال وثائق',
    createdAt: '2026-07-25',
    updatedAt: '2026-09-20',
    heirsCount: 4,
    notes: 'توفيت عن زوج، وأب، وثلاث بنات. جاري استكمال مستند تسجيل الأراضي الزراعية.',
    assets: [
      {
        id: 'ast-21',
        type: 'real_estate',
        typeName: 'مزرعة نخيل ومحاصيل',
        title: 'مزرعة شمال أم درمان مساحة 10 فدان',
        estimatedValue: 55000000,
        location: 'ريف أم درمان',
      },
      {
        id: 'ast-22',
        type: 'bank_account',
        typeName: 'حساب بنك الخرطوم',
        title: 'رصيد حساب بنك الخرطوم (بنكك)',
        estimatedValue: 30000000,
        location: 'بنك الخرطوم',
      },
    ],
    obligations: [
      {
        id: 'ob-21',
        type: 'debt_people',
        typeName: 'ديون للعباد',
        title: 'أجور عمال المزرعة المتأخرة',
        amount: 5000000,
        isSettled: false,
      },
    ],
    documents: [
      {
        id: 'doc-21',
        caseId: 'est-2',
        title: 'شهادة وفاة رسمية',
        type: 'death_certificate',
        typeName: 'شهادة وفاة',
        uploadDate: '2026-07-28',
        ownerName: 'وزارة الصحة',
        fileSizeText: '900 KB',
        reviewStatus: 'approved',
      },
    ],
    tasks: [
      {
        id: 'tsk-21',
        caseId: 'est-2',
        title: 'إرفاق شهادة بحث وتخطيط المزرعة من مصلحة الأراضي',
        assigneeName: 'طارق الفاتح',
        dueDate: '2026-10-10',
        status: 'pending',
        priority: 'urgent',
      },
    ],
    reviews: [],
    auditLogs: [],
  },
  {
    id: 'est-3',
    caseNumber: 'TRK-2026-0106',
    title: 'تركة المرحوم الحاج عثمان أحمد',
    deceasedName: 'عثمان أحمد عبد القادر',
    deceasedGender: 'male',
    deathDate: '2026-05-02',
    city: 'جدة',
    currency: 'ريال سعودي',
    totalGrossEstate: 920000,
    totalObligations: 0,
    netDistributableEstate: 920000,
    status: 'reviewed',
    statusText: 'تمت المراجعة والاعتماد',
    createdAt: '2026-05-15',
    updatedAt: '2026-09-18',
    heirsCount: 3,
    notes: 'توفي عن زوجة وبنت وأخ شقيق. مسألة محسوبة ومعتمدة ومرفوعة للقاضي الشرعي للتنفيذ.',
    assets: [
      {
        id: 'ast-31',
        type: 'bank_account',
        typeName: 'حساب بنكي',
        title: 'وديعة استثمارية إسلامية في بنك الجزيرة',
        estimatedValue: 920000,
      },
    ],
    obligations: [],
    documents: [],
    tasks: [],
    reviews: [],
    auditLogs: [],
  },
];

const DEFAULT_WAQF_RECORDS: WaqfRecord[] = [
  {
    id: 'wqf-1',
    name: 'وقف الأترجة القرآني والتعليمي',
    deedNumber: 'صك-وقفي-449102',
    deedDate: '2020-03-12',
    endowerName: 'الواقف فاعل خير رحمه الله',
    trusteeName: 'الشيخ عبد الرحمن بن خالد',
    supervisorName: 'الهيئة العامة للأوقاف',
    objectives: [
      'كفالة وتأهيل معلمي القرآن الكريم والدراسات الإسلامية',
      'طباعة المصاحف والكتب الفقهية المتخصصة في المواريث والفرائض',
      'منح دراسية للطلبة المتفوقين في علوم الشريعة الإسلامية',
      'صيانة المساجد ودور تحفيظ القرآن الكريم',
    ],
    conditions: 'شرط الواقف: ألا يُباع الأصل ولا يُوهب ولا يُورث، ويصرف ريعه بنسبة 60% للمصارف المحددة، و25% لإعادة استثمار وتنمية الأصل الوقفي، و10% صيانة ونظافة، و5% مكافأة الناظر وأتعاب الإدارة.',
    status: 'active',
    statusText: 'وقف مسجل ونشط',
    totalValue: 5800000,
    currentCashBalance: 420000,
    totalAnnualRevenue: 520000,
    totalAnnualExpenses: 345000,
    assets: [
      {
        id: 'wqf-ast-1',
        waqfId: 'wqf-1',
        name: 'مجمع الأترجة التجاري والسكني',
        type: 'building',
        typeName: 'مبنى تجاري وسكني',
        location: 'الرياض - طريق الملك عبد العزيز',
        estimatedValue: 4200000,
        condition: 'ممتاز',
        rentalStatus: 'مؤجر',
        maintenanceHistoryCount: 5,
        lastMaintenanceDate: '2026-06-15',
        annualRevenue: 400000,
        annualExpenses: 45000,
        documentsCount: 4,
        contractsCount: 6,
        notes: 'مبنى مكون من 6 معارض تجارية و8 مكاتب إدارية، مؤجرة بالكامل بعقود منصة إيجار الموحدة.',
      },
      {
        id: 'wqf-ast-2',
        waqfId: 'wqf-1',
        name: 'محفظة الأترجة الوقفي الاستثماري',
        type: 'investment',
        typeName: 'محفظة صكوك واستثمار منخفض المخاطر',
        location: 'مصرف الراجحي كابيتال',
        estimatedValue: 1600000,
        condition: 'ممتاز',
        rentalStatus: 'شاغر',
        maintenanceHistoryCount: 0,
        annualRevenue: 120000,
        annualExpenses: 5000,
        documentsCount: 2,
        contractsCount: 1,
        notes: 'صكوك حكومية إسلامية وصناديق مرابحة مرخصة متوافقة مع ضوابط الشريعة.',
      },
    ],
    contracts: [
      {
        id: 'cnt-1',
        waqfId: 'wqf-1',
        assetId: 'wqf-ast-1',
        assetName: 'مجمع الأترجة التجاري',
        contractNumber: 'EJR-90214-2025',
        tenantOrPartyName: 'شركة النور للحلول التعليمية',
        partyPhone: '+966501234567',
        startDate: '2025-11-01',
        endDate: '2026-10-31',
        annualValue: 180000,
        paymentCycle: 'semi_annual',
        paymentCycleName: 'نصف سنوي',
        paidAmount: 90000,
        remainingAmount: 90000,
        status: 'expiring_soon',
        statusText: 'ينتهي خلال 35 يوماً',
        daysRemaining: 35,
      },
      {
        id: 'cnt-2',
        waqfId: 'wqf-1',
        assetId: 'wqf-ast-1',
        assetName: 'مجمع الأترجة التجاري',
        contractNumber: 'EJR-81204-2026',
        tenantOrPartyName: 'مكتب المحامي والموثق العدلي أحمد الفهد',
        partyPhone: '+966559876543',
        startDate: '2026-03-01',
        endDate: '2027-02-28',
        annualValue: 80000,
        paymentCycle: 'quarterly',
        paymentCycleName: 'ربع سنوي',
        paidAmount: 40000,
        remainingAmount: 40000,
        status: 'active',
        statusText: 'سارٍ ونشط',
        daysRemaining: 154,
      },
    ],
    beneficiaries: [
      {
        id: 'ben-1',
        waqfId: 'wqf-1',
        name: 'معهد دار الهدى لتحفيظ القرآن وتدريس الفرائض',
        type: 'mosque_care',
        typeName: 'مؤسسة تعليمية قرآنية',
        phone: '+966114829100',
        city: 'الرياض',
        eligibilityStatus: 'active',
        eligibilityStatusText: 'مستحق ونشط',
        monthlyEntitlement: 15000,
        totalDistributedToDate: 180000,
        lastDistributionDate: '2026-09-01',
        documentsCount: 3,
        notes: 'معهد معتمد يخرج سنوياً 30 حافظاً لكتاب الله ومتخصصاً في علم الفرائض والمواريث.',
      },
      {
        id: 'ben-2',
        waqfId: 'wqf-1',
        name: 'البرنامج الجامعي للمنح الشرعية (12 طالباً)',
        type: 'student',
        typeName: 'طلبة علم الفرائض والشريعة',
        phone: '+966531982736',
        city: 'مكة المكرمة والمدينة',
        eligibilityStatus: 'active',
        eligibilityStatusText: 'مستحق ونشط',
        monthlyEntitlement: 12000,
        totalDistributedToDate: 144000,
        lastDistributionDate: '2026-09-01',
        documentsCount: 4,
      },
    ],
    disbursements: [
      {
        id: 'disb-1',
        waqfId: 'wqf-1',
        referenceNumber: 'DSB-2026-081',
        title: 'مخصص المنح الدراسية لطلبة علم المواريث لشهر ربيع الثاني',
        amount: 12000,
        currency: 'ريال سعودي',
        beneficiaryOrVendor: 'طلبة المنح المعتمدين (12 طالباً)',
        purpose: 'صرف الإعانة الشهرية المعتمدة لشهر ربيع الثاني 1448هـ',
        category: 'منح تعليمية',
        proposalDate: '2026-09-20',
        currentStage: 'execution',
        currentStageName: 'قيد التنفيذ والتحويل البنكي',
        stagesHistory: [
          {
            stage: 'proposal',
            stageName: 'مقترح صرف',
            completedAt: '2026-09-20 09:30',
            userName: 'طارق الفاتح (مدخل بيانات)',
            notes: 'رفع مسير الصرف استناداً للائحة الوقف المعتمدة',
          },
          {
            stage: 'internal_review',
            stageName: 'مراجعة داخلية',
            completedAt: '2026-09-21 11:15',
            userName: 'د. عاصم المصلح (مراجع شرعي)',
            notes: 'تمت مراجعة شروط الواقف وتطابق المسير مع الاستحقاق',
          },
          {
            stage: 'authorized_approval',
            stageName: 'اعتماد مخول',
            completedAt: '2026-09-22 14:00',
            userName: 'الشيخ عبد الرحمن بن خالد (ناظر الوقف)',
            notes: 'تم الاعتماد النهائي والموافقة على التحويل',
          },
        ],
      },
      {
        id: 'disb-2',
        waqfId: 'wqf-1',
        referenceNumber: 'DSB-2026-080',
        title: 'أعمال الصيانة الدورية لمكيفات ومصاعد مجمع الأترجة',
        amount: 8500,
        currency: 'ريال سعودي',
        beneficiaryOrVendor: 'شركة الرواد للمصاعد والتكييف',
        assetId: 'wqf-ast-1',
        purpose: 'صيانة وقائية دورية معتمدة بعقد الصيانة',
        category: 'صيانة أصل',
        proposalDate: '2026-09-10',
        currentStage: 'closed',
        currentStageName: 'مغلقة وموثقة بالإيصالات',
        stagesHistory: [
          {
            stage: 'proposal',
            stageName: 'مقترح صرف',
            completedAt: '2026-09-10 10:00',
            userName: 'طارق الفاتح',
          },
          {
            stage: 'internal_review',
            stageName: 'مراجعة داخلية',
            completedAt: '2026-09-11 12:00',
            userName: 'د. عاصم المصلح',
          },
          {
            stage: 'authorized_approval',
            stageName: 'اعتماد مخول',
            completedAt: '2026-09-12 09:00',
            userName: 'الشيخ عبد الرحمن بن خالد',
          },
          {
            stage: 'execution',
            stageName: 'تنفيذ',
            completedAt: '2026-09-14 11:00',
            userName: 'طارق الفاتح',
          },
          {
            stage: 'doc_attached',
            stageName: 'إرفاق المستند',
            completedAt: '2026-09-15 15:30',
            userName: 'طارق الفاتح',
            notes: 'تم إرفاق فاتورة ضريبية وسند قبض رسمي',
          },
          {
            stage: 'closed',
            stageName: 'إغلاق العملية',
            completedAt: '2026-09-16 10:00',
            userName: 'د. عاصم المصلح',
            notes: 'اكتملت الدورة والقيود المحاسبية سليمة',
          },
        ],
      },
    ],
    transactions: [
      {
        id: 'trx-1',
        waqfId: 'wqf-1',
        date: '2026-09-01',
        type: 'revenue',
        typeName: 'إيراد إيجار',
        amount: 90000,
        currency: 'ريال سعودي',
        category: 'إيجارات عقارية',
        assetId: 'wqf-ast-1',
        assetName: 'مجمع الأترجة التجاري',
        notes: 'دفعة إيجار نصف سنوية من شركة النور',
        createdBy: 'طارق الفاتح',
      },
      {
        id: 'trx-2',
        waqfId: 'wqf-1',
        date: '2026-09-15',
        type: 'expense',
        typeName: 'مصروف صيانة',
        amount: 8500,
        currency: 'ريال سعودي',
        category: 'صيانة مباني وتشغيل',
        assetId: 'wqf-ast-1',
        assetName: 'مجمع الأترجة التجاري',
        notes: 'صيانة مصاعد وتكييف',
        createdBy: 'طارق الفاتح',
      },
    ],
    documents: [
      {
        id: 'doc-wqf-1',
        waqfId: 'wqf-1',
        title: 'صك الوقفية الأصلي الموثق لدى محكمة الأحوال الشخصية بالرياض',
        type: 'deed',
        typeName: 'صك وقف رسمي',
        uploadDate: '2020-03-15',
        ownerName: 'المحكمة العامة بالرياض',
        fileSizeText: '4.1 MB',
        reviewStatus: 'approved',
        reviewerName: 'د. عاصم المصلح',
      },
    ],
  },
  {
    id: 'wqf-2',
    name: 'وقف دار الخير لرعاية الأيتام والمحتاجين',
    deedNumber: 'صك-وقفي-558291',
    deedDate: '2022-06-20',
    endowerName: 'سيدة أعمال محسنة رحمها الله',
    trusteeName: 'المهندس مصعب عبد القادر',
    objectives: [
      'كفالة الأسر المتعففة وتوفير السكن الملائم',
      'إفطار الصائمين ووجبات الإطعام الخيري',
      'دعم علاج الحالات الحرجة للفقراء والمساكين',
    ],
    conditions: 'ألا يتم تغيير مصرف الوقف ما بقيت الحاجة، ويخصص 15% من صافي الغلة السنوية كاحتياطي نقدي للتجديد والاستبدال عند الضرورة.',
    status: 'active',
    statusText: 'وقف مسجل ونشط',
    totalValue: 3100000,
    currentCashBalance: 290000,
    totalAnnualRevenue: 280000,
    totalAnnualExpenses: 195000,
    assets: [
      {
        id: 'wqf-ast-21',
        waqfId: 'wqf-2',
        name: 'عمارة الخير السكنية (10 شقق)',
        type: 'building',
        typeName: 'مبنى سكني وقفي',
        location: 'جدة - حي الصفا',
        estimatedValue: 3100000,
        condition: 'جيد',
        rentalStatus: 'مؤجر',
        maintenanceHistoryCount: 3,
        annualRevenue: 280000,
        annualExpenses: 35000,
        documentsCount: 2,
        contractsCount: 10,
      },
    ],
    contracts: [],
    beneficiaries: [
      {
        id: 'ben-21',
        waqfId: 'wqf-2',
        name: 'أسر أيتام مشمولة بالكفالة (25 أسرة)',
        type: 'orphan',
        typeName: 'كفالة أيتام وأرامل',
        phone: '+966540099881',
        city: 'جدة',
        eligibilityStatus: 'active',
        eligibilityStatusText: 'مستحق ونشط',
        monthlyEntitlement: 16000,
        totalDistributedToDate: 320000,
        documentsCount: 6,
      },
    ],
    disbursements: [],
    transactions: [],
    documents: [],
  },
];

const DEFAULT_ALERTS: SystemAlert[] = [
  {
    id: 'alt-1',
    title: 'تنبيه انتهاء عقد إيجار وقفي',
    message: 'عقد شركة النور للحلول التعليمية (مجمع الأترجة التجاري) ينتهي خلال 35 يوماً. يتطلب إشعار المستأجر وتجهيز التجديد.',
    type: 'warning',
    createdAt: '2026-09-26 08:00',
    isRead: false,
    linkTab: 'contracts',
  },
  {
    id: 'alt-2',
    title: 'طلب مراجعة شرعية لتركة آل سعيد',
    message: 'تم استكمال مستندات تركة الشيخ عبد الله بن محمد، والملف بانتظار الاعتماد النهائي من المراجع الشرعي والقاضي.',
    type: 'info',
    createdAt: '2026-09-25 15:30',
    isRead: false,
    linkTab: 'estates',
    linkPayload: { caseId: 'est-1' },
  },
  {
    id: 'alt-3',
    title: 'دفعة صرف بانتظار التنفيذ والتحويل',
    message: 'مقترح صرف المنح الدراسية للطلبة (12,000 ريال) اعتمد من الناظر وبانتظار التنفيذ البنكي وإرفاق الإيصال.',
    type: 'urgent',
    createdAt: '2026-09-24 11:20',
    isRead: false,
    linkTab: 'waqf',
  },
];

// -------------------------------------------------------------
// إدارة التخزين والاسترجاع (Store Service)
// -------------------------------------------------------------

class PlatformStore {
  // Current user role
  getCurrentUser(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // fallback
    }
    const defaultUser: UserProfile = {
      id: 'usr-1',
      name: 'الشيخ عبد الرحمن بن خالد',
      role: 'trustee',
      roleTitle: 'ناظر الوقف',
      avatarText: 'ن',
      phone: '+966501234567',
      email: 'trustee@manassah-waqf.org',
    };
    this.setCurrentUser(defaultUser);
    return defaultUser;
  }

  setCurrentUser(user: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {}
  }

  switchRole(role: UserRole) {
    const roleMeta = SYSTEM_ROLES.find((r) => r.role === role) || SYSTEM_ROLES[0];
    const user: UserProfile = {
      id: `usr-${role}`,
      name: roleMeta.name,
      role: roleMeta.role,
      roleTitle: roleMeta.title,
      avatarText: roleMeta.title.charAt(0),
      email: `${role}@manassah-waqf.org`,
    };
    this.setCurrentUser(user);
    this.addAuditLog(
      'تبديل دور المستخدم',
      'user',
      user.id,
      `تم تبديل الجلسة الحالية إلى صلاحية: ${roleMeta.title} (${roleMeta.name})`
    );
    return user;
  }

  // Audit Logs
  getAuditLogs(): AuditLogEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(DEFAULT_AUDIT_LOGS));
    return DEFAULT_AUDIT_LOGS;
  }

  addAuditLog(
    action: string,
    entityType: AuditLogEntry['entityType'],
    entityId: string,
    details: string
  ): AuditLogEntry {
    const user = this.getCurrentUser();
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
      userId: user.id,
      userName: user.name,
      userRole: user.roleTitle,
      action,
      entityType,
      entityId,
      details,
    };

    const logs = [newLog, ...this.getAuditLogs()];
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
    } catch (e) {}
    return newLog;
  }

  // Estate Cases
  getEstateCases(): EstateCase[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ESTATES);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.ESTATES, JSON.stringify(DEFAULT_ESTATE_CASES));
    return DEFAULT_ESTATE_CASES;
  }

  getEstateCaseById(id: string): EstateCase | undefined {
    return this.getEstateCases().find((c) => c.id === id);
  }

  saveEstateCase(caseData: EstateCase): EstateCase {
    const cases = this.getEstateCases();
    const index = cases.findIndex((c) => c.id === caseData.id);
    const isNew = index === -1;

    caseData.updatedAt = new Date().toISOString().split('T')[0];
    if (isNew) {
      cases.unshift(caseData);
      this.addAuditLog('إنشاء ملف تركة', 'estate', caseData.id, `تم إنشاء ملف تركة: ${caseData.title}`);
    } else {
      cases[index] = caseData;
      this.addAuditLog('تحديث ملف تركة', 'estate', caseData.id, `تم تحديث بيانات ملف التركة: ${caseData.title}`);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.ESTATES, JSON.stringify(cases));
    } catch (e) {}
    return caseData;
  }

  updateCaseStatus(caseId: string, newStatus: CaseStatus, reason?: string): EstateCase | null {
    const cases = this.getEstateCases();
    const item = cases.find((c) => c.id === caseId);
    if (!item) return null;

    const oldStatus = item.status;
    item.status = newStatus;
    const statusMap: Record<CaseStatus, string> = {
      draft: 'مسودة',
      needs_completion: 'يحتاج استكمالاً',
      under_review: 'قيد المراجعة الشرعية',
      reviewed: 'تمت مراجعته واعتماده',
      closed: 'مغلق وموزع',
    };
    item.statusText = statusMap[newStatus];
    item.updatedAt = new Date().toISOString().split('T')[0];

    this.addAuditLog(
      'تغيير حالة ملف تركة',
      'estate',
      caseId,
      `تم تغيير حالة ملف ${item.title} من (${statusMap[oldStatus]}) إلى (${item.statusText})${
        reason ? ` — السبب: ${reason}` : ''
      }`
    );

    try {
      localStorage.setItem(STORAGE_KEYS.ESTATES, JSON.stringify(cases));
    } catch (e) {}
    return item;
  }

  deleteEstateCase(caseId: string): boolean {
    const user = this.getCurrentUser();
    // Restrictions on sensitive delete
    if (user.role !== 'admin' && user.role !== 'trustee') {
      throw new Error('لا تملك الصلاحية الكافية لحذف ملف تركة. يتطلب صلاحية مدير نظام أو ناظر.');
    }
    const cases = this.getEstateCases();
    const target = cases.find((c) => c.id === caseId);
    const filtered = cases.filter((c) => c.id !== caseId);
    try {
      localStorage.setItem(STORAGE_KEYS.ESTATES, JSON.stringify(filtered));
      if (target) {
        this.addAuditLog('حذف ملف تركة', 'estate', caseId, `تم حذف ملف التركة: ${target.title}`);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  // Waqf Records
  getWaqfRecords(): WaqfRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WAQFS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.WAQFS, JSON.stringify(DEFAULT_WAQF_RECORDS));
    return DEFAULT_WAQF_RECORDS;
  }

  getWaqfById(id: string): WaqfRecord | undefined {
    return this.getWaqfRecords().find((w) => w.id === id);
  }

  saveWaqfRecord(record: WaqfRecord): WaqfRecord {
    const list = this.getWaqfRecords();
    const index = list.findIndex((w) => w.id === record.id);
    if (index === -1) {
      list.unshift(record);
      this.addAuditLog('تسجيل وقف جديد', 'waqf', record.id, `تم تسجيل وقف: ${record.name}`);
    } else {
      list[index] = record;
      this.addAuditLog('تحديث بيانات الوقف', 'waqf', record.id, `تم تحديث بيانات الوقف: ${record.name}`);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.WAQFS, JSON.stringify(list));
    } catch (e) {}
    return record;
  }

  // Waqf Financial Transactions
  addWaqfTransaction(waqfId: string, transaction: Omit<WaqfTransaction, 'id' | 'waqfId' | 'createdBy'>): WaqfTransaction {
    const waqf = this.getWaqfById(waqfId);
    if (!waqf) throw new Error('الوقف غير موجود');

    const user = this.getCurrentUser();
    const newTrx: WaqfTransaction = {
      ...transaction,
      id: `trx-${Date.now()}`,
      waqfId,
      createdBy: user.name,
    };

    if (newTrx.type === 'revenue') {
      waqf.currentCashBalance += newTrx.amount;
      waqf.totalAnnualRevenue += newTrx.amount;
    } else {
      waqf.currentCashBalance -= newTrx.amount;
      waqf.totalAnnualExpenses += newTrx.amount;
    }

    waqf.transactions.unshift(newTrx);
    this.saveWaqfRecord(waqf);

    this.addAuditLog(
      newTrx.type === 'revenue' ? 'تسجيل إيراد وقفي' : 'تسجيل مصروف وقفي',
      'financial',
      newTrx.id,
      `تم قيد ${newTrx.typeName} بمبلغ ${newTrx.amount.toLocaleString()} ${newTrx.currency} — بيان: ${newTrx.notes}`
    );

    return newTrx;
  }

  // Disbursement Workflow
  advanceDisbursementStage(
    waqfId: string,
    disbursementId: string,
    notes?: string,
    docUrl?: string
  ): WaqfDisbursement | null {
    const waqf = this.getWaqfById(waqfId);
    if (!waqf) return null;

    const disb = waqf.disbursements.find((d) => d.id === disbursementId);
    if (!disb) return null;

    const stagesOrder: DisbursementStage[] = [
      'proposal',
      'internal_review',
      'authorized_approval',
      'execution',
      'doc_attached',
      'closed',
    ];

    const stageNames: Record<DisbursementStage, string> = {
      proposal: 'مقترح صرف',
      internal_review: 'مراجعة داخلية',
      authorized_approval: 'اعتماد مخول',
      execution: 'تنفيذ وصرف',
      doc_attached: 'إرفاق المستند والإيصال',
      closed: 'إغلاق العملية نهائياً',
    };

    const currentIndex = stagesOrder.indexOf(disb.currentStage);
    if (currentIndex >= stagesOrder.length - 1) {
      return disb; // already closed
    }

    const nextStage = stagesOrder[currentIndex + 1];
    const user = this.getCurrentUser();
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    disb.currentStage = nextStage;
    disb.currentStageName = stageNames[nextStage];

    disb.stagesHistory.push({
      stage: nextStage,
      stageName: stageNames[nextStage],
      completedAt: timeStr,
      userName: `${user.name} (${user.roleTitle})`,
      notes: notes || `تم الانتقال للمرحلة: ${stageNames[nextStage]}`,
      docUrl,
    });

    // If reached execution stage, record a financial transaction automatically
    if (nextStage === 'execution') {
      const trx: WaqfTransaction = {
        id: `trx-disb-${disb.id}`,
        waqfId,
        date: now.toISOString().split('T')[0],
        type: 'expense',
        typeName: 'مصروف صرف وقفي معتمد',
        amount: disb.amount,
        currency: disb.currency,
        category: disb.category,
        notes: `صرف معتمد لمعاملة رقم ${disb.referenceNumber}: ${disb.purpose}`,
        createdBy: user.name,
      };
      waqf.currentCashBalance -= disb.amount;
      waqf.totalAnnualExpenses += disb.amount;
      waqf.transactions.unshift(trx);
    }

    this.saveWaqfRecord(waqf);
    this.addAuditLog(
      'تقدم دورة الصرف',
      'waqf',
      disb.id,
      `تقدمت معاملة الصرف (${disb.referenceNumber}) بمبلغ ${disb.amount.toLocaleString()} إلى مرحلة: ${stageNames[nextStage]}`
    );

    return disb;
  }

  // Documents
  getAllDocuments(): CaseDocument[] {
    const allDocs: CaseDocument[] = [];
    const cases = this.getEstateCases();
    cases.forEach((c) => {
      if (c.documents) allDocs.push(...c.documents);
    });

    const waqfs = this.getWaqfRecords();
    waqfs.forEach((w) => {
      if (w.documents) allDocs.push(...w.documents);
    });

    return allDocs;
  }

  reviewDocument(docId: string, decision: 'approved' | 'rejected' | 'needs_fix', notes: string): boolean {
    const user = this.getCurrentUser();
    let updated = false;

    // Check in estates
    const cases = this.getEstateCases();
    for (const c of cases) {
      const doc = c.documents?.find((d) => d.id === docId);
      if (doc) {
        doc.reviewStatus = decision;
        doc.reviewerName = user.name;
        doc.reviewerNotes = notes;
        doc.reviewDate = new Date().toISOString().split('T')[0];
        this.saveEstateCase(c);
        updated = true;
        break;
      }
    }

    // Check in waqfs
    if (!updated) {
      const waqfs = this.getWaqfRecords();
      for (const w of waqfs) {
        const doc = w.documents?.find((d) => d.id === docId);
        if (doc) {
          doc.reviewStatus = decision;
          doc.reviewerName = user.name;
          doc.reviewerNotes = notes;
          doc.reviewDate = new Date().toISOString().split('T')[0];
          this.saveWaqfRecord(w);
          updated = true;
          break;
        }
      }
    }

    if (updated) {
      this.addAuditLog('مراجعة مستند رسمي', 'document', docId, `تم اتخاذ قرار (${decision}) بشأن المستند — ملاحظات: ${notes}`);
    }
    return updated;
  }

  // System Alerts
  getAlerts(): SystemAlert[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ALERTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(DEFAULT_ALERTS));
    return DEFAULT_ALERTS;
  }

  markAlertRead(alertId: string) {
    const alerts = this.getAlerts();
    const item = alerts.find((a) => a.id === alertId);
    if (item) {
      item.isRead = true;
      try {
        localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
      } catch (e) {}
    }
  }

  // Calculations count
  getCalculationsCount(): number {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CALCULATIONS_COUNT);
      return stored ? parseInt(stored, 10) : 1248;
    } catch (e) {
      return 1248;
    }
  }

  incrementCalculationsCount(): number {
    const current = this.getCalculationsCount() + 1;
    try {
      localStorage.setItem(STORAGE_KEYS.CALCULATIONS_COUNT, current.toString());
    } catch (e) {}
    return current;
  }

  // Reset to seed data
  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.ESTATES);
    localStorage.removeItem(STORAGE_KEYS.WAQFS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.CALCULATIONS_COUNT);
    this.addAuditLog('إعادة تعيين النظام', 'user', 'system', 'تم استعادة البيانات الافتراضية الأولية للنظام');
  }
}

export const platformStore = new PlatformStore();
