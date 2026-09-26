/**
 * منصة الميراث والوقف
 * التعريفات والأنماط العامة للمنصة: التركات، الأوقاف، الأصول، العقود، المالية، المستندات، والصلاحيات
 */

import { CalculationResult } from './inheritance';

export type UserRole =
  | 'trustee'      // ناظر الوقف
  | 'auditor'      // مراجع شرعي وقانوني
  | 'data_entry'   // مدخل بيانات
  | 'beneficiary'  // مستفيد
  | 'admin';       // مدير نظام

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  avatarText: string;
  phone?: string;
  email?: string;
}

// -------------------------------------------------------------
// ملفات التركات (Estate Cases)
// -------------------------------------------------------------

export type CaseStatus =
  | 'draft'             // مسودة
  | 'needs_completion'  // يحتاج استكمالاً
  | 'under_review'      // قيد المراجعة
  | 'reviewed'          // تمت مراجعته
  | 'closed';           // مغلق

export interface EstateAsset {
  id: string;
  type: 'real_estate' | 'bank_account' | 'shares' | 'vehicle' | 'business' | 'other';
  typeName: string;
  title: string;
  description?: string;
  estimatedValue: number;
  location?: string;
  ownershipDocRef?: string;
}

export interface EstateObligation {
  id: string;
  type: 'funeral' | 'debt_god' | 'debt_people' | 'bequest' | 'other';
  typeName: string;
  title: string;
  amount: number;
  creditorOrBeneficiary?: string;
  dueDate?: string;
  isSettled: boolean;
}

export interface CaseDocument {
  id: string;
  caseId?: string;
  waqfId?: string;
  title: string;
  type: 'deed' | 'death_certificate' | 'heirs_proof' | 'property_title' | 'bank_statement' | 'contract' | 'financial' | 'other';
  typeName: string;
  uploadDate: string;
  ownerName: string;
  fileSizeText: string;
  reviewStatus: 'pending' | 'approved' | 'rejected' | 'needs_fix';
  reviewerName?: string;
  reviewerNotes?: string;
  reviewDate?: string;
  fileUrl?: string;
  aiExtractedSummary?: string;
}

export interface CaseTask {
  id: string;
  caseId: string;
  title: string;
  assigneeName: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'normal' | 'high' | 'urgent';
}

export interface CaseReview {
  id: string;
  caseId: string;
  reviewerName: string;
  reviewerRole: string;
  date: string;
  decision: 'approved' | 'returned_for_info' | 'rejected';
  notes: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: 'estate' | 'waqf' | 'asset' | 'contract' | 'financial' | 'document' | 'review' | 'user';
  entityId: string;
  details: string;
}

export interface EstateCase {
  id: string;
  caseNumber: string;
  title: string;
  deceasedName: string;
  deceasedGender: 'male' | 'female';
  deathDate: string;
  nationalId?: string;
  city: string;
  currency: string;
  totalGrossEstate: number;
  totalObligations: number;
  netDistributableEstate: number;
  status: CaseStatus;
  statusText: string;
  createdAt: string;
  updatedAt: string;
  heirsCount: number;
  notes: string;
  assets: EstateAsset[];
  obligations: EstateObligation[];
  documents: CaseDocument[];
  tasks: CaseTask[];
  reviews: CaseReview[];
  auditLogs: AuditLogEntry[];
  calculationSnapshot?: CalculationResult;
}

// -------------------------------------------------------------
// إدارة الأوقاف (Endowments, Assets, Contracts, Financials)
// -------------------------------------------------------------

export interface WaqfAsset {
  id: string;
  waqfId: string;
  name: string;
  type: 'property' | 'shop' | 'land' | 'building' | 'project' | 'investment' | 'other';
  typeName: string;
  location: string;
  estimatedValue: number;
  condition: 'ممتاز' | 'جيد' | 'يحتاج صيانة' | 'متوقف';
  rentalStatus: 'مؤجر' | 'شاغر' | 'صيانة';
  maintenanceHistoryCount: number;
  lastMaintenanceDate?: string;
  annualRevenue: number;
  annualExpenses: number;
  documentsCount: number;
  contractsCount: number;
  notes?: string;
}

export interface WaqfContract {
  id: string;
  waqfId: string;
  assetId: string;
  assetName: string;
  contractNumber: string;
  tenantOrPartyName: string;
  partyPhone: string;
  startDate: string;
  endDate: string;
  annualValue: number;
  paymentCycle: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  paymentCycleName: string;
  paidAmount: number;
  remainingAmount: number;
  status: 'active' | 'expiring_soon' | 'expired' | 'terminated';
  statusText: string;
  daysRemaining: number;
}

export interface WaqfBeneficiary {
  id: string;
  waqfId: string;
  name: string;
  type: 'needy_family' | 'student' | 'orphan' | 'health_patient' | 'mosque_care' | 'general_charity';
  typeName: string;
  phone: string;
  city: string;
  eligibilityStatus: 'active' | 'suspended' | 'under_review';
  eligibilityStatusText: string;
  monthlyEntitlement: number;
  totalDistributedToDate: number;
  lastDistributionDate?: string;
  documentsCount: number;
  notes?: string;
}

export type DisbursementStage =
  | 'proposal'             // 1. مقترح صرف
  | 'internal_review'     // 2. مراجعة داخلية
  | 'authorized_approval' // 3. اعتماد مخول
  | 'execution'           // 4. تنفيذ
  | 'doc_attached'        // 5. إرفاق المستند
  | 'closed';             // 6. إغلاق العملية

export interface DisbursementStageRecord {
  stage: DisbursementStage;
  stageName: string;
  completedAt?: string;
  userName?: string;
  notes?: string;
  docUrl?: string;
}

export interface WaqfDisbursement {
  id: string;
  waqfId: string;
  referenceNumber: string;
  title: string;
  amount: number;
  currency: string;
  beneficiaryOrVendor: string;
  beneficiaryId?: string;
  assetId?: string;
  purpose: string;
  category: 'كفالة أيتام' | 'دعم أسر' | 'منح تعليمية' | 'صيانة أصل' | 'أجور وإشراف' | 'مصروفات تشغيلية' | 'أخرى';
  proposalDate: string;
  currentStage: DisbursementStage;
  currentStageName: string;
  stagesHistory: DisbursementStageRecord[];
}

export interface WaqfTransaction {
  id: string;
  waqfId: string;
  date: string;
  type: 'revenue' | 'expense';
  typeName: string;
  amount: number;
  currency: string;
  category: string;
  assetId?: string;
  assetName?: string;
  documentRef?: string;
  notes: string;
  createdBy: string;
}

export interface WaqfRecord {
  id: string;
  name: string;
  deedNumber: string;
  deedDate: string;
  endowerName: string;        // الواقف
  trusteeName: string;        // الناظر
  supervisorName?: string;    // القاضي أو المشرف
  objectives: string[];       // المصارف
  conditions: string;         // شروط الواقف
  status: 'active' | 'under_review' | 'pending_deed';
  statusText: string;
  totalValue: number;
  currentCashBalance: number;
  totalAnnualRevenue: number;
  totalAnnualExpenses: number;
  assets: WaqfAsset[];
  contracts: WaqfContract[];
  beneficiaries: WaqfBeneficiary[];
  disbursements: WaqfDisbursement[];
  transactions: WaqfTransaction[];
  documents: CaseDocument[];
  notes?: string;
}

// -------------------------------------------------------------
// التنبيهات وإحصاءات المنصة (Alerts & Metrics)
// -------------------------------------------------------------

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  createdAt: string;
  isRead: boolean;
  linkTab?: string;
  linkPayload?: any;
}

export interface PlatformMetrics {
  totalCalculations: number;
  totalEstates: number;
  totalWaqf: number;
  pendingTasks: number;
  urgentAlerts: number;
  activeContracts: number;
  totalBeneficiaries: number;
  monthlyCashFlow: number;
}
