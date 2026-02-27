// ============================================================
// 问卷状态管理 Hook
// ============================================================

import { useState, useCallback, useEffect } from 'react';
import type {
  QuestionnaireData,
  CompanyProfile,
  OverseasDiagnosis,
  ProductCompetitiveness,
  OperationCapability,
  ResourceAndPlan,
  AssessmentResult,
  QuestionnaireStep,
  ReportData,
  MarketRecommendation,
  ServiceProduct,
} from '@/types/questionnaire';
import { findBenchmarkCompanies } from '@/data/benchmarkCompanies';
import {
  b2bPlatformOptions,
  socialPlatformOptions,
  b2cPlatformOptions,
  marketOptions,
} from '@/types/questionnaire';
import { INDUSTRY_MAP, INDUSTRY_SERVICE_MAP } from '@/constants/industry';

// 初始数据
const initialData: QuestionnaireData = {
  profile: {
    name: '',
    establishedYear: '',
    registeredCapital: '',
    companyNature: '',
    companyType: '',
    industry: '',
    mainProduct: '',
    productCategory: '',
    annualRevenue: '',
    employeeCount: '',
    rAndDStaffRatio: '',
    coreCompetency: [],
    contactName: '',
    contactPosition: '',
    contactPhone: '',
    contactEmail: '',
  },
  diagnosis: {
    stage: '',
    startYear: '',
    hasExportExperience: null,
    annualExportValue: '',
    exportGrowthRate: '',
    exportRevenueRatio: '',
    marketCount: '',
    topMarkets: [],
    customerType: [],
    topCustomerConcentration: '',
    channels: {
      b2bPlatform: false,
      b2bPlatformsUsed: [],
      socialMedia: false,
      socialPlatformsUsed: [],
      b2cPlatform: false,
      b2cPlatformsUsed: [],
      independentSite: false,
      offlineExhibition: false,
      overseasOffice: false,
      agentDistributor: false,
    },
    teamConfig: {
      hasDedicatedTeam: false,
      teamSize: '',
      teamStructure: [],
      foreignLanguageCapability: '',
    },
  },
  product: {
    certifications: [],
    certificationInProgress: [],
    pricePositioning: '',
    moq: '',
    customizationCapability: '',
    hasRAndD: null,
    annualNewProducts: '',
    patentCount: '',
    productionCapacity: '',
    qualityControl: [],
    deliveryTime: '',
    supplyChainStability: '',
    keyMaterialSource: '',
  },
  operation: {
    hasCRM: null,
    hasERP: null,
    digitalLevel: '',
    marketingBudget: '',
    contentProduction: '',
    platformOperation: {
      productCount: '',
      inquiryVolume: '',
      responseTime: '',
      conversionRate: '',
    },
    socialOperation: {
      totalFollowers: '',
      monthlyContent: '',
      engagementRate: '',
      leadsGenerated: '',
    },
    hasBrand: null,
    brandAwareness: '',
    brandProtection: [],
  },
  resource: {
    exportBudget: '',
    financingCapability: '',
    governmentSupport: [],
    industryAssociation: [],
    hasClearPlan: null,
    planTimeframe: '',
    targetMarkets: [],
    targetRevenue: '',
    perceivedRisks: [],
    riskMitigation: [],
  },
};

// 服务产品库
const serviceProducts: ServiceProduct[] = [
  {
    id: 'market_entry_consulting',
    category: 'consulting',
    name: '市场准入咨询',
    description: '目标市场调研、准入要求分析、进入策略制定',
    deliverables: ['市场调研报告', '准入要求清单', '进入策略方案'],
    duration: '4-6周',
    targetStage: ['preparation', 'exploration'],
    painPoints: ['不了解目标市场', '不清楚准入要求', '缺乏进入策略'],
    expectedOutcomes: ['明确目标市场', '掌握准入要求', '制定进入路径'],
    investmentRange: { min: 5, max: 15 },
  },
  {
    id: 'certification_service',
    category: 'consulting',
    name: '认证代办服务',
    description: '产品认证规划、认证机构对接、全程代办服务',
    deliverables: ['认证规划方案', '认证证书', '持续合规支持'],
    duration: '3-12个月',
    targetStage: ['preparation', 'exploration'],
    painPoints: ['认证流程复杂', '周期长', '费用不透明'],
    expectedOutcomes: ['获得目标市场认证', '缩短认证周期', '降低认证成本'],
    investmentRange: { min: 3, max: 30 },
  },
  {
    id: 'brand_building',
    category: 'consulting',
    name: '品牌出海咨询',
    description: '品牌定位、VI设计、品牌传播策略',
    deliverables: ['品牌定位报告', 'VI设计手册', '品牌传播方案'],
    duration: '6-8周',
    targetStage: ['exploration', 'growth'],
    painPoints: ['品牌知名度低', '缺乏品牌体系', '溢价能力弱'],
    expectedOutcomes: ['建立品牌体系', '提升品牌认知', '增强溢价能力'],
    investmentRange: { min: 10, max: 30 },
  },
  {
    id: 'digital_transformation',
    category: 'operation',
    name: '数字化出海解决方案',
    description: 'CRM/ERP系统部署、数据看板搭建、流程数字化',
    deliverables: ['数字化方案', '系统部署', '培训支持'],
    duration: '2-3个月',
    targetStage: ['growth', 'expansion'],
    painPoints: ['管理效率低', '数据不透明', '协同困难'],
    expectedOutcomes: ['提升管理效率', '实现数据驱动', '支撑规模增长'],
    investmentRange: { min: 15, max: 50 },
  },
  {
    id: 'platform_operation',
    category: 'operation',
    name: '平台代运营服务',
    description: 'B2B/B2C平台店铺运营、内容创作、数据分析',
    deliverables: ['店铺运营', '内容创作', '数据报告'],
    duration: '长期服务',
    targetStage: ['exploration', 'growth'],
    painPoints: ['缺乏运营经验', '人手不足', '效果不稳定'],
    expectedOutcomes: ['提升店铺效果', '增加询盘/订单', '降低运营成本'],
    investmentRange: { min: 8, max: 25 },
  },
  {
    id: 'social_media_marketing',
    category: 'operation',
    name: '海外社媒营销',
    description: '社媒账号运营、KOL合作、内容营销',
    deliverables: ['社媒运营', '内容创作', 'KOL合作'],
    duration: '长期服务',
    targetStage: ['exploration', 'growth', 'expansion'],
    painPoints: ['不了解海外社媒', '内容创作困难', '粉丝增长慢'],
    expectedOutcomes: ['建立社媒矩阵', '提升品牌曝光', '获取精准客户'],
    investmentRange: { min: 5, max: 20 },
  },
  {
    id: 'overseas_warehouse',
    category: 'resource',
    name: '海外仓配服务',
    description: '海外仓储、本地配送、退换货处理',
    deliverables: ['海外仓储', '本地配送', '售后服务'],
    duration: '长期服务',
    targetStage: ['growth', 'expansion'],
    painPoints: ['物流成本高', '配送时效慢', '售后困难'],
    expectedOutcomes: ['降低物流成本', '提升配送时效', '改善客户体验'],
    investmentRange: { min: 10, max: 50 },
  },
  {
    id: 'trade_finance',
    category: 'finance',
    name: '出口金融服务',
    description: '出口信用保险、贸易融资、汇率风险管理',
    deliverables: ['金融方案', '保险服务', '风险管理'],
    duration: '长期服务',
    targetStage: ['growth', 'expansion', 'mature'],
    painPoints: ['资金压力大', '收汇风险高', '汇率波动'],
    expectedOutcomes: ['缓解资金压力', '降低收汇风险', '稳定汇率成本'],
    investmentRange: { min: 2, max: 10 },
  },
];

export function useQuestionnaire() {
  const [data, setData] = useState<QuestionnaireData>(initialData);
  const [currentStep, setCurrentStep] = useState<QuestionnaireStep>('welcome');
  const [savedProgress, setSavedProgress] = useState<number>(0);

  // 从localStorage加载进度
  useEffect(() => {
    const saved = localStorage.getItem('questionnaire_progress_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed.data);
        setSavedProgress(parsed.progress || 0);
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    }
  }, []);

  // 保存进度
  const saveProgress = useCallback((step: QuestionnaireStep, progress: number) => {
    localStorage.setItem('questionnaire_progress_v2', JSON.stringify({
      data,
      currentStep: step,
      progress,
    }));
    setSavedProgress(progress);
  }, [data]);

  // 更新企业画像
  const updateProfile = useCallback((profile: Partial<CompanyProfile>) => {
    setData(prev => ({ ...prev, profile: { ...prev.profile, ...profile } }));
  }, []);

  // 更新出海诊断
  const updateDiagnosis = useCallback((diagnosis: Partial<OverseasDiagnosis>) => {
    setData(prev => ({ ...prev, diagnosis: { ...prev.diagnosis, ...diagnosis } }));
  }, []);

  // 更新产品竞争力
  const updateProduct = useCallback((product: Partial<ProductCompetitiveness>) => {
    setData(prev => ({ ...prev, product: { ...prev.product, ...product } }));
  }, []);

  // 更新运营能力
  const updateOperation = useCallback((operation: Partial<OperationCapability>) => {
    setData(prev => ({ ...prev, operation: { ...prev.operation, ...operation } }));
  }, []);

  // 更新资源与规划
  const updateResource = useCallback((resource: Partial<ResourceAndPlan>) => {
    setData(prev => ({ ...prev, resource: { ...prev.resource, ...resource } }));
  }, []);

  // 执行评估
  const performAssessment = useCallback((): AssessmentResult => {
    const { profile, diagnosis, product, operation, resource } = data;
    
    // 计算各维度得分（0-100）
    const dimensionScores = {
      foundation: calculateFoundationScore(profile, diagnosis),
      product: calculateProductScore(product),
      operation: calculateOperationScore(operation, diagnosis),
      resource: calculateResourceScore(resource),
      potential: calculatePotentialScore(profile, product, resource),
    };
    
    const totalScore = Math.round(
      (dimensionScores.foundation * 0.2 +
       dimensionScores.product * 0.25 +
       dimensionScores.operation * 0.25 +
       dimensionScores.resource * 0.15 +
       dimensionScores.potential * 0.15)
    );
    
    // 确定阶段和等级
    const { stage, level } = determineStageAndLevel(totalScore, dimensionScores, diagnosis);
    
    // 生成SWOT分析
    const swot = generateSWOT(data, dimensionScores);
    
    // 生成核心发现
    const keyFindings = generateKeyFindings(data, dimensionScores);
    
    return {
      stage,
      level,
      totalScore,
      dimensionScores,
      swot,
      keyFindings,
    };
  }, [data]);

  // 生成报告数据
  const generateReportData = useCallback((): ReportData => {
    const assessmentResult = performAssessment();
    
    // 获取对标企业
    const benchmarkCompanies = findBenchmarkCompanies(
      data.profile.industry,
      data.profile.companyNature,
      data.profile.companyType,
      assessmentResult.stage,
      3
    );
    
    // 获取推荐服务
    const recommendedServices = getRecommendedServices(assessmentResult.stage, data);
    
    // 生成市场推荐
    const marketRecommendations = generateMarketRecommendations(data, assessmentResult);
    
    // 生成行动计划
    const actionPlan = generateActionPlan(data, assessmentResult);
    
    // 生成投资规划
    const investmentPlan = generateInvestmentPlan(data, assessmentResult);
    
    // 生成数据汇总
    const dataSummary = generateDataSummary(data);
    
    return {
      companyProfile: data.profile,
      assessmentResult,
      benchmarkCompanies,
      recommendedServices,
      marketRecommendations,
      actionPlan,
      investmentPlan,
      dataSummary,
    };
  }, [data, performAssessment]);

  // 重置问卷
  const resetQuestionnaire = useCallback(() => {
    setData(initialData);
    setCurrentStep('welcome');
    localStorage.removeItem('questionnaire_progress_v2');
    setSavedProgress(0);
  }, []);

  return {
    data,
    currentStep,
    setCurrentStep,
    savedProgress,
    saveProgress,
    updateProfile,
    updateDiagnosis,
    updateProduct,
    updateOperation,
    updateResource,
    performAssessment,
    generateReportData,
    resetQuestionnaire,
  };
}

// 计算基础能力得分
function calculateFoundationScore(
  profile: CompanyProfile,
  diagnosis: OverseasDiagnosis
): number {
  // 检查数据完整性
  const hasBasicInfo = profile.name && profile.establishedYear && profile.industry;
  const hasTeamInfo = diagnosis.teamConfig.hasDedicatedTeam !== undefined;
  
  // 如果基本信息不完整，给予较低基础分
  if (!hasBasicInfo) {
    return 30;
  }
  
  let score = 30; // 降低基础分
  
  // 企业规模（最高15分）
  if (profile.annualRevenue === '>5000') score += 15;
  else if (profile.annualRevenue === '3000-5000') score += 12;
  else if (profile.annualRevenue === '1000-3000') score += 9;
  else if (profile.annualRevenue === '500-1000') score += 6;
  else if (profile.annualRevenue) score += 3;
  
  // 团队配置（最高20分）- 必须填写才有分
  if (hasTeamInfo && diagnosis.teamConfig.hasDedicatedTeam) {
    if (diagnosis.teamConfig.teamSize === '>50') score += 20;
    else if (diagnosis.teamConfig.teamSize === '20-50') score += 15;
    else if (diagnosis.teamConfig.teamSize === '5-20') score += 10;
    else if (diagnosis.teamConfig.teamSize) score += 5;
    
    // 外语能力（最高10分）
    if (diagnosis.teamConfig.foreignLanguageCapability === 'excellent') score += 10;
    else if (diagnosis.teamConfig.foreignLanguageCapability === 'good') score += 6;
    else if (diagnosis.teamConfig.foreignLanguageCapability === 'basic') score += 3;
  }
  
  // 数字化水平（最高10分）
  if (profile.rAndDStaffRatio === '>30%') score += 10;
  else if (profile.rAndDStaffRatio === '10-30%') score += 6;
  else if (profile.rAndDStaffRatio) score += 3;
  
  // 企业性质加分（最高5分）
  if (profile.companyNature === 'listed' || profile.companyNature === 'state') score += 5;
  else if (profile.companyNature) score += 2;
  
  return Math.min(100, score);
}

// 计算产品竞争力得分
function calculateProductScore(product: ProductCompetitiveness): number {
  // 检查是否有填写产品信息
  const hasProductInfo = product.pricePositioning || product.customizationCapability || product.certifications.length > 0;
  
  if (!hasProductInfo) {
    return 25; // 未填写产品信息，给予基础分
  }
  
  let score = 25; // 降低基础分
  
  // 认证情况（最高20分）
  score += Math.min(product.certifications.length * 4, 20);
  
  // 价格定位（最高15分）
  if (product.pricePositioning === 'premium') score += 15;
  else if (product.pricePositioning === 'mid-high') score += 10;
  else if (product.pricePositioning === 'mid') score += 7;
  else if (product.pricePositioning) score += 3;
  
  // 定制能力（最高12分）
  if (product.customizationCapability === 'strong') score += 12;
  else if (product.customizationCapability === 'medium') score += 8;
  else if (product.customizationCapability === 'weak') score += 4;
  
  // 研发能力（最高15分）
  if (product.hasRAndD) {
    score += 5;
    if (product.patentCount === '>10') score += 10;
    else if (product.patentCount === '5-10') score += 7;
    else if (product.patentCount === '1-5') score += 4;
  }
  
  // 质量控制（最高10分）
  score += Math.min(product.qualityControl.length * 2, 10);
  
  // 供应链稳定性（最高10分）
  if (product.supplyChainStability === 'excellent') score += 10;
  else if (product.supplyChainStability === 'good') score += 7;
  else if (product.supplyChainStability === 'average') score += 3;
  
  // 生产规模（最高8分）- 暂时注释，类型中不存在此字段
  // if (product.productionScale === 'large') score += 8;
  // else if (product.productionScale === 'medium') score += 5;
  // else if (product.productionScale === 'small') score += 3;
  
  return Math.min(100, score);
}

// 计算运营能力得分
function calculateOperationScore(
  operation: OperationCapability,
  diagnosis: OverseasDiagnosis
): number {
  // 检查是否有填写运营信息
  const hasOperationInfo = operation.digitalLevel || operation.marketingBudget || operation.hasBrand !== undefined;
  const hasChannelInfo = Object.values(diagnosis.channels).some(v => 
    Array.isArray(v) ? v.length > 0 : v === true
  );
  
  if (!hasOperationInfo && !hasChannelInfo) {
    return 20; // 未填写运营信息，给予基础分
  }
  
  let score = 20; // 降低基础分
  
  // 渠道布局（最高25分）
  const channelCount = Object.values(diagnosis.channels).filter(v => 
    Array.isArray(v) ? v.length > 0 : v === true
  ).length;
  score += Math.min(channelCount * 5, 25);
  
  // 数字化工具（最高15分）
  if (operation.hasCRM) score += 5;
  if (operation.hasERP) score += 5;
  if (operation.digitalLevel === 'advanced') score += 10;
  else if (operation.digitalLevel === 'intermediate') score += 6;
  else if (operation.digitalLevel === 'basic') score += 3;
  
  // 营销投入（最高10分）
  if (operation.marketingBudget === '>10%') score += 10;
  else if (operation.marketingBudget === '5-10%') score += 7;
  else if (operation.marketingBudget === '2-5%') score += 4;
  else if (operation.marketingBudget) score += 2;
  
  // 品牌建设（最高15分）
  if (operation.hasBrand) {
    score += 5;
    if (operation.brandAwareness === 'high') score += 10;
    else if (operation.brandAwareness === 'medium') score += 6;
    else if (operation.brandAwareness === 'low') score += 3;
  }
  
  // 品牌保护（最高6分）
  score += Math.min(operation.brandProtection.length * 2, 6);
  
  // 社媒运营（最高9分）- socialOperation是对象类型，需要检查其属性
  if (operation.socialOperation && operation.socialOperation.totalFollowers) {
    score += 3;
    // 根据粉丝数判断运营水平
    const followers = parseInt(operation.socialOperation.totalFollowers) || 0;
    if (followers >= 10000) score += 6;
    else if (followers >= 1000) score += 4;
    else score += 2;
  }
  
  return Math.min(100, score);
}

// 计算资源配置得分
function calculateResourceScore(resource: ResourceAndPlan): number {
  // 检查是否有填写资源信息
  const hasResourceInfo = resource.exportBudget || resource.financingCapability || resource.targetMarkets.length > 0;
  
  if (!hasResourceInfo) {
    return 20; // 未填写资源信息，给予基础分
  }
  
  let score = 20; // 降低基础分
  
  // 预算投入（最高20分）
  if (resource.exportBudget === '>500') score += 20;
  else if (resource.exportBudget === '200-500') score += 16;
  else if (resource.exportBudget === '100-200') score += 12;
  else if (resource.exportBudget === '50-100') score += 8;
  else if (resource.exportBudget === '20-50') score += 4;
  else if (resource.exportBudget) score += 2;
  
  // 融资能力（最高10分）
  if (resource.financingCapability === 'strong') score += 10;
  else if (resource.financingCapability === 'medium') score += 6;
  else if (resource.financingCapability === 'weak') score += 3;
  
  // 政策支持（最高9分）
  score += Math.min(resource.governmentSupport.length * 3, 9);
  
  // 规划清晰度（最高12分）
  if (resource.hasClearPlan) {
    score += 5;
    if (resource.planTimeframe === '>3years') score += 7;
    else if (resource.planTimeframe === '1-3years') score += 4;
    else if (resource.planTimeframe) score += 2;
  }
  
  // 风险意识（最高10分）
  if (resource.perceivedRisks.length > 0 && resource.riskMitigation.length > 0) {
    score += 10;
  } else if (resource.perceivedRisks.length > 0 || resource.riskMitigation.length > 0) {
    score += 5;
  }
  
  // 目标市场明确度（最高10分）
  if (resource.targetMarkets.length >= 3) score += 10;
  else if (resource.targetMarkets.length >= 2) score += 7;
  else if (resource.targetMarkets.length >= 1) score += 4;
  
  // 目标营收（最高10分）
  if (resource.targetRevenue === '>100%') score += 10;
  else if (resource.targetRevenue === '50-100%') score += 7;
  else if (resource.targetRevenue === '30-50%') score += 5;
  else if (resource.targetRevenue === '10-30%') score += 3;
  else if (resource.targetRevenue) score += 1;
  
  return Math.min(100, score);
}

// 计算发展潜力得分
function calculatePotentialScore(
  profile: CompanyProfile,
  product: ProductCompetitiveness,
  resource: ResourceAndPlan
): number {
  // 检查是否有填写发展相关信息
  const hasPotentialInfo = profile.coreCompetency.length > 0 || resource.targetMarkets.length > 0 || product.hasRAndD !== undefined;
  
  if (!hasPotentialInfo) {
    return 25; // 未填写发展信息，给予基础分
  }
  
  let score = 25; // 降低基础分
  
  // 核心优势（最高15分）
  score += Math.min(profile.coreCompetency.length * 3, 15);
  
  // 目标市场明确度（最高10分）
  if (resource.targetMarkets.length >= 3) score += 10;
  else if (resource.targetMarkets.length >= 2) score += 7;
  else if (resource.targetMarkets.length >= 1) score += 4;
  
  // 目标营收（最高15分）
  if (resource.targetRevenue === '>100%') score += 15;
  else if (resource.targetRevenue === '50-100%') score += 11;
  else if (resource.targetRevenue === '30-50%') score += 8;
  else if (resource.targetRevenue === '10-30%') score += 5;
  else if (resource.targetRevenue) score += 2;
  
  // 研发创新（最高15分）
  if (product.hasRAndD) {
    score += 5;
    if (product.annualNewProducts === '>10') score += 10;
    else if (product.annualNewProducts === '5-10') score += 7;
    else if (product.annualNewProducts === '1-5') score += 4;
    else if (product.annualNewProducts) score += 2;
  }
  
  // 行业优势加分（最高10分）
  if (profile.industry === 'energy' || profile.industry === 'electronics') {
    score += 10;
  } else if (profile.industry === 'machinery' || profile.industry === 'auto') {
    score += 8;
  } else if (profile.industry) {
    score += 5;
  }
  
  // 研发投入比例（最高10分）
  if (profile.rAndDStaffRatio === '>30%') score += 10;
  else if (profile.rAndDStaffRatio === '10-30%') score += 6;
  else if (profile.rAndDStaffRatio) score += 3;
  
  return Math.min(100, score);
}

// 确定阶段和等级
function determineStageAndLevel(
  totalScore: number,
  _dimensionScores: AssessmentResult['dimensionScores'],
  diagnosis: OverseasDiagnosis
): { stage: AssessmentResult['stage']; level: AssessmentResult['level'] } {
  void totalScore; // 保留用于未来扩展
  // 根据出口额和综合得分确定阶段
  const exportValue = diagnosis.annualExportValue;
  
  if (exportValue === '0' || diagnosis.stage === 'preparation') {
    return { stage: 'preparation', level: '出海新锐' };
  }
  
  if (exportValue === '<100' || diagnosis.stage === 'exploration') {
    return { stage: 'exploration', level: '出海新锐' };
  }
  
  if (exportValue === '100-1000' || diagnosis.stage === 'growth') {
    if (totalScore >= 75) return { stage: 'growth', level: '跨境成长型企业' };
    return { stage: 'growth', level: '跨境成长型企业' };
  }
  
  if (exportValue === '1000-5000' || diagnosis.stage === 'expansion') {
    if (totalScore >= 80) return { stage: 'expansion', level: '全球化先锋' };
    return { stage: 'expansion', level: '全球化先锋' };
  }
  
  return { stage: 'mature', level: '国际领军者' };
}

// 生成SWOT分析
function generateSWOT(
  data: QuestionnaireData,
  scores: AssessmentResult['dimensionScores']
): AssessmentResult['swot'] {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const threats: string[] = [];
  
  // 优势分析
  if (scores.product >= 70) strengths.push('产品竞争力较强');
  if (data.product.certifications.length >= 3) strengths.push('产品认证体系完善');
  if (data.diagnosis.teamConfig.hasDedicatedTeam && data.diagnosis.teamConfig.teamSize !== '<5') {
    strengths.push('外贸团队配置较为完善');
  }
  if (scores.operation >= 70) strengths.push('运营能力较强');
  if (data.operation.hasBrand && data.operation.brandAwareness !== 'none') {
    strengths.push('已建立品牌基础');
  }
  if (data.profile.coreCompetency.includes('technology')) {
    strengths.push('具备核心技术优势');
  }
  
  // 劣势分析
  if (scores.foundation < 60) weaknesses.push('基础能力有待提升');
  if (!data.diagnosis.teamConfig.hasDedicatedTeam) weaknesses.push('缺乏专职外贸团队');
  if (data.product.certifications.length === 0) weaknesses.push('产品认证不足');
  if (!data.operation.hasBrand) weaknesses.push('品牌建设滞后');
  if (data.operation.digitalLevel === 'basic' || data.operation.digitalLevel === 'none') {
    weaknesses.push('数字化程度较低');
  }
  
  // 机会分析
  opportunities.push('RCEP等区域贸易协定带来关税优惠');
  opportunities.push('跨境电商降低市场准入门槛');
  if (data.profile.industry === 'energy' || data.profile.industry === 'electronics') {
    opportunities.push('目标市场相关产业政策支持');
  }
  if (data.resource.governmentSupport.includes('export_subsidy')) {
    opportunities.push('可享受出口补贴政策');
  }
  
  // 威胁分析
  threats.push('国际贸易摩擦和关税壁垒风险');
  threats.push('汇率波动影响利润');
  threats.push('目标市场竞争加剧');
  if (data.resource.perceivedRisks.includes('payment')) {
    threats.push('海外客户信用风险');
  }
  
  return { strengths, weaknesses, opportunities, threats };
}

// 生成核心发现
function generateKeyFindings(
  data: QuestionnaireData,
  scores: AssessmentResult['dimensionScores']
): string[] {
  const findings: string[] = [];
  
  // 根据得分生成发现
  const lowestScore = Math.min(...Object.values(scores));
  const highestScore = Math.max(...Object.values(scores));
  
  if (lowestScore === scores.foundation) {
    findings.push('基础能力建设是当前最紧迫的任务，建议优先完善团队配置和内部管理体系');
  }
  if (lowestScore === scores.product) {
    findings.push('产品竞争力有待提升，建议加强产品研发和认证体系建设');
  }
  if (lowestScore === scores.operation) {
    findings.push('运营能力是制约因素，建议加强数字化建设和渠道布局');
  }
  if (lowestScore === scores.resource) {
    findings.push('资源配置需要加强，建议制定清晰的出海规划和预算');
  }
  
  if (highestScore === scores.product) {
    findings.push('产品竞争力是核心优势，可作为出海的重要突破口');
  }
  if (highestScore === scores.operation) {
    findings.push('运营能力较强，具备支撑业务快速扩张的基础');
  }
  
  // 渠道分析
  const activeChannels = Object.entries(data.diagnosis.channels)
    .filter(([k]) => k !== 'b2bPlatformsUsed' && k !== 'socialPlatformsUsed' && k !== 'b2cPlatformsUsed')
    .filter(([_, v]) => v === true || (Array.isArray(v) && v.length > 0))
    .length;
  
  if (activeChannels === 0) {
    findings.push('尚未建立任何出海渠道，建议尽快启动渠道布局');
  } else if (activeChannels === 1) {
    findings.push('渠道布局较为单一，建议拓展多元化渠道降低风险');
  } else if (activeChannels >= 4) {
    findings.push('渠道布局较为完善，建议优化各渠道协同效率');
  }
  
  return findings;
}

// 获取推荐服务
function getRecommendedServices(
  stage: AssessmentResult['stage'],
  data: QuestionnaireData
): ServiceProduct[] {
  const { profile, diagnosis, product, operation, resource } = data;
  
  // 计算每个服务的匹配分数
  const serviceScores: { service: ServiceProduct; score: number; reasons: string[] }[] = [];
  
  for (const service of serviceProducts) {
    let score = 0;
    const reasons: string[] = [];
    
    // 1. 阶段匹配（最高30分）
    if (service.targetStage.includes(stage)) {
      score += 30;
      reasons.push('符合当前出海阶段');
    }
    
    // 2. 行业匹配（最高25分）
    const recommendedForIndustry = INDUSTRY_SERVICE_MAP[profile.industry] || [];
    if (recommendedForIndustry.includes(service.id)) {
      score += 25;
      reasons.push('适合' + (INDUSTRY_MAP[profile.industry] || profile.industry) + '行业');
    }
    
    // 3. 痛点匹配（最高25分）
    let painPointMatches = 0;
    for (const painPoint of service.painPoints) {
      // 检查产品痛点
      if (product.certifications.length === 0 && painPoint.includes('认证')) {
        painPointMatches++;
      }
      if (!product.hasRAndD && painPoint.includes('研发')) {
        painPointMatches++;
      }
      // 检查品牌痛点
      if (!operation.hasBrand && painPoint.includes('品牌')) {
        painPointMatches++;
      }
      // 检查数字化痛点
      if (!operation.hasCRM && !operation.hasERP && painPoint.includes('管理')) {
        painPointMatches++;
      }
      // 检查渠道痛点
      const hasChannels = Object.values(diagnosis.channels).some(v => 
        Array.isArray(v) ? v.length > 0 : v === true
      );
      if (!hasChannels && painPoint.includes('渠道')) {
        painPointMatches++;
      }
      // 检查团队痛点
      if (!diagnosis.teamConfig.hasDedicatedTeam && painPoint.includes('团队')) {
        painPointMatches++;
      }
      // 检查资金痛点
      if (resource.financingCapability === 'weak' && painPoint.includes('资金')) {
        painPointMatches++;
      }
    }
    score += Math.min(painPointMatches * 8, 25);
    if (painPointMatches > 0) {
      reasons.push(`匹配${painPointMatches}个痛点`);
    }
    
    // 4. 数据缺失惩罚（如果相关数据未填写，降低优先级）
    if (service.id === 'certification_service' && product.certifications.length > 0) {
      score -= 10; // 已有认证，降低优先级
    }
    if (service.id === 'brand_building' && operation.hasBrand) {
      score -= 10; // 已有品牌，降低优先级
    }
    
    // 5. 企业规模匹配（最高10分）
    const investment = (service.investmentRange.min + service.investmentRange.max) / 2;
    if (profile.annualRevenue === '>5000' && investment > 20) {
      score += 10; // 大企业推荐高投入服务
    } else if (profile.annualRevenue === '1000-3000' && investment >= 10 && investment <= 30) {
      score += 10; // 中型企业推荐适中投入服务
    } else if (profile.annualRevenue && profile.annualRevenue !== '>5000' && investment < 15) {
      score += 10; // 小企业推荐低投入服务
    }
    
    serviceScores.push({ service, score, reasons });
  }
  
  // 按分数排序，取前5个
  serviceScores.sort((a, b) => b.score - a.score);
  const topServices = serviceScores.slice(0, 5);
  
  // 添加推荐理由到服务描述
  return topServices.map(({ service, reasons }) => ({
    ...service,
    description: service.description + (reasons.length > 0 ? `（推荐理由：${reasons.join('、')}）` : ''),
  }));
}

// 生成市场推荐
function generateMarketRecommendations(
  data: QuestionnaireData,
  _assessment: AssessmentResult
): MarketRecommendation[] {
  const { profile } = data;
  
  // 根据行业推荐
  const industryMarketMap: Record<string, MarketRecommendation[]> = {
    machinery: [
      {
        priority: 'high',
        region: '东南亚',
        countries: ['越南', '印尼', '泰国'],
        marketSize: '快速增长',
        growthRate: '15-20%',
        entryDifficulty: 'medium',
        competitionLevel: 'medium',
        fitScore: 85,
        rationale: '基建需求旺盛，中国机械性价比高，RCEP关税优惠',
        entryStrategy: 'B2B平台+展会+代理商',
        keyRequirements: ['CE认证', '本地化服务'],
        estimatedInvestment: '50-100万',
        timeline: '6-12个月',
      },
      {
        priority: 'medium',
        region: '中东',
        countries: ['阿联酋', '沙特'],
        marketSize: '大型',
        growthRate: '10-15%',
        entryDifficulty: 'medium',
        competitionLevel: 'high',
        fitScore: 75,
        rationale: '大型基建项目多，采购能力强',
        entryStrategy: '项目投标+本地代理',
        keyRequirements: ['国际认证', '项目经验'],
        estimatedInvestment: '100-200万',
        timeline: '12-18个月',
      },
    ],
    electronics: [
      {
        priority: 'high',
        region: '北美',
        countries: ['美国', '加拿大'],
        marketSize: '全球最大',
        growthRate: '5-8%',
        entryDifficulty: 'hard',
        competitionLevel: 'high',
        fitScore: 80,
        rationale: '市场规模大，消费能力强，电商成熟',
        entryStrategy: '亚马逊+独立站+线下渠道',
        keyRequirements: ['FCC认证', 'UL认证', '品牌注册'],
        estimatedInvestment: '200-500万',
        timeline: '12-24个月',
      },
      {
        priority: 'high',
        region: '欧洲',
        countries: ['德国', '英国', '法国'],
        marketSize: '大型',
        growthRate: '5-7%',
        entryDifficulty: 'hard',
        competitionLevel: 'high',
        fitScore: 78,
        rationale: '消费能力强，环保意识高',
        entryStrategy: '亚马逊+独立站',
        keyRequirements: ['CE认证', 'RoHS', 'WEEE'],
        estimatedInvestment: '150-400万',
        timeline: '12-18个月',
      },
    ],
    textile: [
      {
        priority: 'high',
        region: '美国',
        countries: ['美国'],
        marketSize: '全球最大',
        growthRate: '3-5%',
        entryDifficulty: 'hard',
        competitionLevel: 'high',
        fitScore: 82,
        rationale: '市场规模最大，快时尚需求旺盛',
        entryStrategy: 'B2B大客户+跨境电商',
        keyRequirements: ['OEKO-TEX', '社会责任认证'],
        estimatedInvestment: '100-300万',
        timeline: '6-12个月',
      },
      {
        priority: 'medium',
        region: '欧洲',
        countries: ['德国', '法国', '意大利'],
        marketSize: '大型',
        growthRate: '2-4%',
        entryDifficulty: 'hard',
        competitionLevel: 'high',
        fitScore: 75,
        rationale: '品质要求高，溢价空间大',
        entryStrategy: '品牌客户+展会',
        keyRequirements: ['有机认证', '环保认证'],
        estimatedInvestment: '150-300万',
        timeline: '12-18个月',
      },
    ],
  };
  
  const defaultRecommendations: MarketRecommendation[] = [
    {
      priority: 'high',
      region: '东南亚',
      countries: ['越南', '印尼', '泰国'],
      marketSize: '快速增长',
      growthRate: '10-15%',
      entryDifficulty: 'easy',
      competitionLevel: 'medium',
      fitScore: 80,
      rationale: '地理位置近，文化相似，RCEP关税优惠，市场增长快',
      entryStrategy: 'B2B平台+展会+代理商',
      keyRequirements: ['基础认证'],
      estimatedInvestment: '30-80万',
      timeline: '3-6个月',
    },
    {
      priority: 'medium',
      region: '中东',
      countries: ['阿联酋', '沙特'],
      marketSize: '中型',
      growthRate: '8-12%',
      entryDifficulty: 'medium',
      competitionLevel: 'medium',
      fitScore: 70,
      rationale: '采购能力强，对中国产品接受度高',
      entryStrategy: '展会+本地代理',
      keyRequirements: ['国际认证'],
      estimatedInvestment: '50-150万',
      timeline: '6-12个月',
    },
  ];
  
  return industryMarketMap[profile.industry] || defaultRecommendations;
}

// 生成行动计划
function generateActionPlan(
  _data: QuestionnaireData,
  assessment: AssessmentResult
): ReportData['actionPlan'] {
  const immediate: string[] = [];
  const shortTerm: string[] = [];
  const mediumTerm: string[] = [];
  const longTerm: string[] = [];
  
  const { stage } = assessment;
  
  // 根据阶段生成行动计划
  if (stage === 'preparation') {
    immediate.push('明确出海目标市场和目标客户群体');
    immediate.push('完成核心产品认证规划');
    shortTerm.push('建立基础外贸团队（至少2-3人）');
    shortTerm.push('开通阿里巴巴国际站等B2B平台');
    mediumTerm.push('完成2-3项核心产品认证');
    mediumTerm.push('参加目标市场行业展会');
    longTerm.push('建立稳定的询盘获取渠道');
    longTerm.push('完成首批海外订单交付');
  } else if (stage === 'exploration') {
    immediate.push('优化现有渠道运营效率');
    immediate.push('分析现有客户数据，明确客户画像');
    shortTerm.push('拓展1-2个新渠道');
    shortTerm.push('完善外贸团队配置');
    mediumTerm.push('建立客户管理体系（CRM）');
    mediumTerm.push('启动品牌建设');
    longTerm.push('实现出口额翻倍增长');
    longTerm.push('建立稳定的客户复购机制');
  } else if (stage === 'growth') {
    immediate.push('分析各渠道ROI，优化资源配置');
    immediate.push('识别并解决客户流失原因');
    shortTerm.push('拓展2-3个新市场');
    shortTerm.push('建立海外仓或合作物流体系');
    mediumTerm.push('启动品牌升级');
    mediumTerm.push('建立本地化服务团队');
    longTerm.push('实现出口额增长50%以上');
    longTerm.push('建立区域市场领导地位');
  } else {
    immediate.push('评估海外建厂/分公司可行性');
    immediate.push('优化全球供应链布局');
    shortTerm.push('在重点市场设立办事处或分公司');
    shortTerm.push('建立本地化团队');
    mediumTerm.push('启动海外并购或合资谈判');
    mediumTerm.push('建立全球研发中心');
    longTerm.push('实现全球化运营体系');
    longTerm.push('成为细分领域全球领导者');
  }
  
  return { immediate, shortTerm, mediumTerm, longTerm };
}

// 生成投资规划
function generateInvestmentPlan(
  data: QuestionnaireData,
  assessment: AssessmentResult
): ReportData['investmentPlan'] {
  const { stage } = assessment;
  const { profile } = data;
  
  // 基础预算
  let baseMin = 20;
  let baseMax = 50;
  
  if (stage === 'preparation') {
    baseMin = 10;
    baseMax = 30;
  } else if (stage === 'exploration') {
    baseMin = 20;
    baseMax = 50;
  } else if (stage === 'growth') {
    baseMin = 50;
    baseMax = 150;
  } else {
    baseMin = 150;
    baseMax = 500;
  }
  
  // 根据企业规模调整
  const scaleFactor = profile.annualRevenue === '>5000' ? 1.5 :
    profile.annualRevenue === '3000-5000' ? 1.3 :
    profile.annualRevenue === '1000-3000' ? 1.1 :
    profile.annualRevenue === '500-1000' ? 0.9 : 0.7;
  
  const totalBudget = {
    min: Math.round(baseMin * scaleFactor),
    max: Math.round(baseMax * scaleFactor),
  };
  
  // 预算分配
  const allocation = [
    { category: '团队建设', percentage: 25, amount: `${Math.round(totalBudget.min * 0.25)}-${Math.round(totalBudget.max * 0.25)}万` },
    { category: '认证与合规', percentage: 20, amount: `${Math.round(totalBudget.min * 0.2)}-${Math.round(totalBudget.max * 0.2)}万` },
    { category: '营销推广', percentage: 30, amount: `${Math.round(totalBudget.min * 0.3)}-${Math.round(totalBudget.max * 0.3)}万` },
    { category: '平台建设', percentage: 15, amount: `${Math.round(totalBudget.min * 0.15)}-${Math.round(totalBudget.max * 0.15)}万` },
    { category: '其他费用', percentage: 10, amount: `${Math.round(totalBudget.min * 0.1)}-${Math.round(totalBudget.max * 0.1)}万` },
  ];
  
  return {
    totalBudget,
    allocation,
    roiProjection: `预计12-18个月实现投资回报，出口额增长30-100%`,
  };
}

// 生成数据汇总
function generateDataSummary(data: QuestionnaireData): ReportData['dataSummary'] {
  const { profile, diagnosis, product, operation, resource } = data;
  
  // 市场中文映射
  const marketMap = Object.fromEntries(marketOptions.map(m => [m.value, m.label]));
  
  // B2B平台中文映射
  const b2bMap = Object.fromEntries(b2bPlatformOptions.map(p => [p.value, p.label]));
  
  // 社媒平台中文映射
  const socialMap = Object.fromEntries(socialPlatformOptions.map(p => [p.value, p.label]));
  
  // B2C平台中文映射
  const b2cMap = Object.fromEntries(b2cPlatformOptions.map(p => [p.value, p.label]));
  
  return {
    profile: {
      '企业名称': profile.name,
      '成立年份': profile.establishedYear,
      '企业性质': profile.companyNature === 'private' ? '私营企业' :
        profile.companyNature === 'state' ? '国有/央企' :
        profile.companyNature === 'joint' ? '合资企业' :
        profile.companyNature === 'foreign' ? '外资企业' :
        profile.companyNature === 'listed' ? '上市公司' : '-',
      '企业类型': profile.companyType === 'manufacturer' ? '生产型' :
        profile.companyType === 'trader' ? '贸易型' :
        profile.companyType === 'hybrid' ? '工贸一体' :
        profile.companyType === 'brand' ? '品牌型' :
        profile.companyType === 'service' ? '服务型' : '-',
      '所属行业': INDUSTRY_MAP[profile.industry] || profile.industry,
      '主要产品': profile.mainProduct,
      '年营业额': profile.annualRevenue === '>5000' ? '5000万以上' :
        profile.annualRevenue === '3000-5000' ? '3000-5000万' :
        profile.annualRevenue === '1000-3000' ? '1000-3000万' :
        profile.annualRevenue === '500-1000' ? '500-1000万' : '500万以下',
      '员工规模': profile.employeeCount === '>500' ? '500人以上' :
        profile.employeeCount === '100-500' ? '100-500人' :
        profile.employeeCount === '50-100' ? '50-100人' : '50人以下',
      '核心优势': profile.coreCompetency.map(c => ({
        technology: '核心技术', cost: '成本优势', quality: '品质管控',
        customization: '定制能力', delivery: '快速交期', certification: '国际认证',
        brand: '品牌影响力', service: '服务体系', scale: '规模优势'
      })[c]).filter(Boolean).join('、') || '-',
    },
    diagnosis: {
      '出海阶段': diagnosis.stage === 'preparation' ? '准备期' :
        diagnosis.stage === 'exploration' ? '探索期' :
        diagnosis.stage === 'growth' ? '成长期' :
        diagnosis.stage === 'expansion' ? '扩张期' : '-',
      '年出口额': diagnosis.annualExportValue === '0' ? '无出口' :
        diagnosis.annualExportValue === '<100' ? '100万以下' :
        diagnosis.annualExportValue === '100-1000' ? '100-1000万' :
        diagnosis.annualExportValue === '1000-5000' ? '1000-5000万' : '5000万以上',
      '出口占比': diagnosis.exportRevenueRatio === '>50%' ? '50%以上' :
        diagnosis.exportRevenueRatio === '30-50%' ? '30-50%' :
        diagnosis.exportRevenueRatio === '10-30%' ? '10-30%' : '10%以下',
      '覆盖市场数': diagnosis.marketCount === '>20' ? '20个以上' :
        diagnosis.marketCount === '10-20' ? '10-20个' :
        diagnosis.marketCount === '5-10' ? '5-10个' :
        diagnosis.marketCount === '1-5' ? '1-5个' : '无',
      '主要市场': diagnosis.topMarkets.map(m => marketMap[m] || m).join('、') || '-',
      'B2B平台': diagnosis.channels.b2bPlatform ? `是（${diagnosis.channels.b2bPlatformsUsed.map(p => b2bMap[p] || p).join('、')}）` : '否',
      '社交媒体': diagnosis.channels.socialMedia ? `是（${diagnosis.channels.socialPlatformsUsed.map(p => socialMap[p] || p).join('、')}）` : '否',
      'B2C平台': diagnosis.channels.b2cPlatform ? `是（${diagnosis.channels.b2cPlatformsUsed.map(p => b2cMap[p] || p).join('、')}）` : '否',
      '专职外贸团队': diagnosis.teamConfig.hasDedicatedTeam ? `是（${diagnosis.teamConfig.teamSize}人）` : '否',
    },
    product: {
      '已获认证': product.certifications.length > 0 ? `${product.certifications.length}项` : '无',
      '价格定位': product.pricePositioning === 'premium' ? '高端' :
        product.pricePositioning === 'mid-high' ? '中高端' :
        product.pricePositioning === 'mid' ? '中端' : '经济型',
      '定制能力': product.customizationCapability === 'strong' ? '强' :
        product.customizationCapability === 'medium' ? '中等' : '弱',
      '研发能力': product.hasRAndD ? `有（专利${product.patentCount}项）` : '无',
      '年均新品': product.annualNewProducts === '>10' ? '10款以上' :
        product.annualNewProducts === '5-10' ? '5-10款' :
        product.annualNewProducts === '1-5' ? '1-5款' : '无',
      '供应链稳定性': product.supplyChainStability === 'excellent' ? '优秀' :
        product.supplyChainStability === 'good' ? '良好' :
        product.supplyChainStability === 'average' ? '一般' : '较差',
    },
    operation: {
      'CRM系统': operation.hasCRM ? '已部署' : '未部署',
      'ERP系统': operation.hasERP ? '已部署' : '未部署',
      '数字化水平': operation.digitalLevel === 'advanced' ? '先进' :
        operation.digitalLevel === 'intermediate' ? '中等' :
        operation.digitalLevel === 'basic' ? '基础' : '无',
      '品牌建设': operation.hasBrand ? `有（知名度${operation.brandAwareness === 'high' ? '高' : operation.brandAwareness === 'medium' ? '中' : '低'}）` : '无',
      '营销预算占比': operation.marketingBudget === '>10%' ? '10%以上' :
        operation.marketingBudget === '5-10%' ? '5-10%' :
        operation.marketingBudget === '2-5%' ? '2-5%' : '2%以下',
    },
    resource: {
      '出口预算': resource.exportBudget === '>500' ? '500万以上' :
        resource.exportBudget === '200-500' ? '200-500万' :
        resource.exportBudget === '100-200' ? '100-200万' :
        resource.exportBudget === '50-100' ? '50-100万' : '50万以下',
      '融资能力': resource.financingCapability === 'strong' ? '强' :
        resource.financingCapability === 'medium' ? '中等' : '弱',
      '政策支持': resource.governmentSupport.length > 0 ? `${resource.governmentSupport.length}项` : '无',
      '出海规划': resource.hasClearPlan ? `有（${resource.planTimeframe === '>3years' ? '3年以上' : resource.planTimeframe === '1-3years' ? '1-3年' : '1年以内'}）` : '无',
      '目标市场': resource.targetMarkets.length > 0 ? resource.targetMarkets.join('、') : '未明确',
      '目标增长': resource.targetRevenue === '>100%' ? '100%以上' :
        resource.targetRevenue === '50-100%' ? '50-100%' :
        resource.targetRevenue === '30-50%' ? '30-50%' : '30%以下',
    },
  };
}
