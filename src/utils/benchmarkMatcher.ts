// ============================================================
// 智能对标企业匹配算法
// ============================================================

import type { BenchmarkCompany, CompanyProfile, OverseasDiagnosis } from '@/types/questionnaire';
import { benchmarkCompanies } from '@/data/benchmarkCompanies';

interface MatchCriteria {
  industry: string;
  companyNature: string;
  companyType: string;
  stage: string;
  annualRevenue: string;
  employeeCount: string;
  mainProduct?: string;
}

interface MatchScore {
  company: BenchmarkCompany;
  score: number;
  matchReasons: string[];
}

// 收入范围转数值（用于比较）
function revenueToValue(revenue: string): number {
  const map: Record<string, number> = {
    '<1000万': 500,
    '1000万-5000万': 3000,
    '5000万-1亿': 7500,
    '1-5亿': 30000,
    '5-10亿': 75000,
    '10-50亿': 300000,
    '50-100亿': 750000,
    '100亿+': 1000000,
    '1000亿+': 10000000,
    '800亿+': 8000000,
    '400亿+': 4000000,
    '200亿+': 2000000,
    '100亿': 1000000,
    '60亿+': 600000,
    '50亿+': 500000,
    '30亿+': 300000,
    '20亿+': 200000,
    '10亿+': 100000,
    '5亿+': 50000,
    '3-5亿': 40000,
    '2-3亿': 25000,
    '1-2亿': 15000,
    '8000万-1亿': 9000,
    '5000万-8000万': 6500,
    '3000万-5000万': 4000,
  };
  return map[revenue] || 0;
}

// 员工规模转数值
function employeeToValue(employee: string): number {
  const map: Record<string, number> = {
    '<50': 25,
    '50-100': 75,
    '100-300': 200,
    '200-300': 250,
    '300-500': 400,
    '500-1000': 750,
    '1000-2000': 1500,
    '2000-5000': 3500,
    '3000+': 3000,
    '5000+': 5000,
    '10000+': 10000,
    '20000+': 20000,
  };
  return map[employee] || 0;
}

// 计算规模匹配度（收入）
function calculateRevenueMatch(userRevenue: string, companyRevenue: string): number {
  const userVal = revenueToValue(userRevenue);
  const companyVal = revenueToValue(companyRevenue);
  
  if (userVal === 0 || companyVal === 0) return 50;
  
  // 计算比例差异
  const ratio = Math.min(userVal, companyVal) / Math.max(userVal, companyVal);
  
  // 同数量级得高分，跨数量级扣分
  if (ratio >= 0.5) return 100;
  if (ratio >= 0.3) return 80;
  if (ratio >= 0.1) return 60;
  return 40;
}

// 计算规模匹配度（员工）
function calculateEmployeeMatch(userEmployee: string, companyEmployee: string): number {
  const userVal = employeeToValue(userEmployee);
  const companyVal = employeeToValue(companyEmployee);
  
  if (userVal === 0 || companyVal === 0) return 50;
  
  const ratio = Math.min(userVal, companyVal) / Math.max(userVal, companyVal);
  
  if (ratio >= 0.5) return 100;
  if (ratio >= 0.3) return 80;
  if (ratio >= 0.1) return 60;
  return 40;
}

// 行业匹配
function calculateIndustryMatch(userIndustry: string, companyIndustry: string): number {
  if (userIndustry === companyIndustry) return 100;
  
  // 相关行业的匹配
  const relatedIndustries: Record<string, string[]> = {
    'machinery': ['auto', 'energy', 'building'],
    'electronics': ['auto', 'machinery', 'medical'],
    'auto': ['machinery', 'electronics'],
    'textile': ['beauty', 'sports'],
    'building': ['machinery', 'furniture'],
    'furniture': ['building', 'textile'],
    'beauty': ['textile', 'food'],
    'food': ['beauty', 'packaging'],
  };
  
  const related = relatedIndustries[userIndustry] || [];
  if (related.includes(companyIndustry)) return 70;
  
  return 30;
}

// 企业性质匹配
function calculateNatureMatch(userNature: string, companyNature: string): number {
  if (userNature === companyNature) return 100;
  
  // 民营和私营视为同类
  if ((userNature === 'private' && companyNature === 'private') ||
      (userNature === 'foreign' && companyNature === 'joint')) return 90;
  
  return 60;
}

// 企业类型匹配
function calculateTypeMatch(userType: string, companyType: string): number {
  if (userType === companyType) return 100;
  
  // 制造商和品牌商有相似性
  if ((userType === 'manufacturer' && companyType === 'brand') ||
      (userType === 'brand' && companyType === 'manufacturer')) return 80;
  
  // 工贸一体与制造商/贸易商都有关联
  if (userType === 'hybrid') return 85;
  
  return 60;
}

// 出海阶段匹配
function calculateStageMatch(userStage: string, companyStage: string): number {
  const stageOrder = ['preparation', 'exploration', 'growth', 'expansion', 'mature'];
  const userIndex = stageOrder.indexOf(userStage);
  const companyIndex = stageOrder.indexOf(companyStage);
  
  if (userIndex === -1 || companyIndex === -1) return 50;
  
  const diff = Math.abs(userIndex - companyIndex);
  
  // 相邻阶段匹配度高
  if (diff === 0) return 100;
  if (diff === 1) return 90;
  if (diff === 2) return 70;
  return 50;
}

// 智能匹配对标企业
export function findBenchmarkCompanies(
  profile: CompanyProfile,
  diagnosis: OverseasDiagnosis,
  limit: number = 3
): MatchScore[] {
  const criteria: MatchCriteria = {
    industry: profile.industry,
    companyNature: profile.companyNature,
    companyType: profile.companyType,
    stage: diagnosis.stage || 'preparation',
    annualRevenue: profile.annualRevenue,
    employeeCount: profile.employeeCount,
    mainProduct: profile.mainProduct,
  };
  
  const scores: MatchScore[] = benchmarkCompanies.map((company: BenchmarkCompany) => {
    const matchReasons: string[] = [];
    
    // 计算各项得分
    const industryScore = calculateIndustryMatch(criteria.industry, company.industry);
    const natureScore = calculateNatureMatch(criteria.companyNature, company.companyNature);
    const typeScore = calculateTypeMatch(criteria.companyType, company.companyType);
    const stageScore = calculateStageMatch(criteria.stage, company.stage);
    const revenueScore = calculateRevenueMatch(criteria.annualRevenue, company.annualRevenue);
    const employeeScore = calculateEmployeeMatch(criteria.employeeCount, company.employeeRange);
    
    // 记录匹配原因
    if (industryScore >= 70) {
      matchReasons.push(industryScore === 100 ? '同行业标杆' : '相关行业标杆');
    }
    if (revenueScore >= 80) {
      matchReasons.push('规模相近');
    }
    if (stageScore >= 90) {
      matchReasons.push('出海阶段相似');
    }
    if (natureScore >= 90) {
      matchReasons.push('企业性质相同');
    }
    if (typeScore >= 80) {
      matchReasons.push('业务模式相似');
    }
    
    // 加权计算总分
    const weights = {
      industry: 0.25,
      stage: 0.20,
      revenue: 0.20,
      employee: 0.15,
      nature: 0.10,
      type: 0.10,
    };
    
    const totalScore = Math.round(
      industryScore * weights.industry +
      stageScore * weights.stage +
      revenueScore * weights.revenue +
      employeeScore * weights.employee +
      natureScore * weights.nature +
      typeScore * weights.type
    );
    
    return {
      company,
      score: totalScore,
      matchReasons: matchReasons.length > 0 ? matchReasons : ['综合匹配'],
    };
  });
  
  // 排序并返回前N个
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// 生成匹配说明
export function generateMatchDescription(match: MatchScore): string {
  const { score, matchReasons } = match;
  
  if (score >= 90) {
    return `高度匹配（${score}%）：${matchReasons.join('、')}，是最适合您的对标企业`;
  } else if (score >= 75) {
    return `良好匹配（${score}%）：${matchReasons.join('、')}，具有很强的参考价值`;
  } else if (score >= 60) {
    return `一般匹配（${score}%）：${matchReasons.join('、')}，部分经验可借鉴`;
  } else {
    return `参考匹配（${score}%）：虽不完全匹配，但其出海路径仍有参考价值`;
  }
}

// 导出用于测试
export { benchmarkCompanies };
