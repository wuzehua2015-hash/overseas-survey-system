// ============================================================
// 企业出海成熟度评估系统 - 类型定义
// ============================================================

// ------------------------------------------------------------
// 1. 企业基础画像
// ------------------------------------------------------------
export interface CompanyProfile {
  // 企业身份
  name: string;
  establishedYear: string; // 成立年份
  registeredCapital: string; // 注册资本
  
  // 企业性质与类型
  companyNature: 'private' | 'state' | 'joint' | 'foreign' | 'listed' | '';
  companyType: 'manufacturer' | 'trader' | 'hybrid' | 'brand' | 'service' | '';
  
  // 主营业务
  industry: string;
  mainProduct: string;
  productCategory: string; // 产品品类细分
  
  // 企业规模
  annualRevenue: string;
  employeeCount: string;
  rAndDStaffRatio: string; // 研发人员占比
  
  // 核心优势
  coreCompetency: string[]; // 核心技术/专利/认证等
  
  // 联系人
  contactName: string;
  contactPosition: string; // 职位
  contactPhone: string;
  contactEmail: string;
}

// ------------------------------------------------------------
// 2. 出海现状诊断
// ------------------------------------------------------------
export interface OverseasDiagnosis {
  // 出海阶段
  stage: 'preparation' | 'exploration' | 'growth' | 'expansion' | '';
  
  // 出海历史
  startYear: string; // 开始出海年份
  hasExportExperience: boolean | null;
  
  // 业绩表现
  annualExportValue: string; // 年出口额
  exportGrowthRate: string; // 出口增长率
  exportRevenueRatio: string; // 出口占总营收比例
  
  // 市场覆盖
  marketCount: string; // 覆盖市场数量
  topMarkets: string[]; // 主要出口市场
  
  // 客户结构
  customerType: string[]; // 客户类型（品牌商/批发商/零售商等）
  topCustomerConcentration: string; // 前三大客户占比
  
  // 渠道布局
  channels: {
    b2bPlatform: boolean;
    b2bPlatformsUsed: string[];
    socialMedia: boolean;
    socialPlatformsUsed: string[];
    b2cPlatform: boolean;
    b2cPlatformsUsed: string[];
    independentSite: boolean;
    offlineExhibition: boolean;
    overseasOffice: boolean;
    agentDistributor: boolean;
  };
  
  // 团队配置
  teamConfig: {
    hasDedicatedTeam: boolean;
    teamSize: string;
    teamStructure: string[]; // 团队构成（业务/运营/跟单等）
    foreignLanguageCapability: string;
  };
}

// ------------------------------------------------------------
// 3. 产品竞争力评估
// ------------------------------------------------------------
export interface ProductCompetitiveness {
  // 产品认证
  certifications: string[]; // 已获认证
  certificationInProgress: string[]; // 进行中认证
  
  // 产品特性
  pricePositioning: 'premium' | 'mid-high' | 'mid' | 'economy' | ''; // 价格定位
  moq: string; // 最小起订量
  customizationCapability: 'strong' | 'medium' | 'weak' | ''; // 定制能力
  
  // 研发创新
  hasRAndD: boolean | null;
  annualNewProducts: string; // 年均新品数量
  patentCount: string; // 专利数量
  
  // 生产能力
  productionCapacity: string; // 产能
  qualityControl: string[]; // 质量控制体系
  deliveryTime: string; // 平均交期
  
  // 供应链
  supplyChainStability: 'excellent' | 'good' | 'average' | 'poor' | '';
  keyMaterialSource: 'domestic' | 'imported' | 'mixed' | '';
}

// ------------------------------------------------------------
// 4. 运营能力评估
// ------------------------------------------------------------
export interface OperationCapability {
  // 数字化能力
  hasCRM: boolean | null;
  hasERP: boolean | null;
  digitalLevel: 'advanced' | 'intermediate' | 'basic' | 'none' | '';
  
  // 营销能力
  marketingBudget: string; // 年度营销预算
  contentProduction: 'inhouse' | 'outsourced' | 'mixed' | 'none' | ''; // 内容生产
  
  // 平台运营（如使用B2B平台）
  platformOperation: {
    productCount: string;
    inquiryVolume: string;
    responseTime: string;
    conversionRate: string;
  };
  
  // 社媒运营（如使用社媒）
  socialOperation: {
    totalFollowers: string;
    monthlyContent: string;
    engagementRate: string;
    leadsGenerated: string;
  };
  
  // 品牌资产
  hasBrand: boolean | null;
  brandAwareness: 'high' | 'medium' | 'low' | 'none' | '';
  brandProtection: string[]; // 品牌保护（商标注册等）
}

// ------------------------------------------------------------
// 5. 资源与规划
// ------------------------------------------------------------
export interface ResourceAndPlan {
  // 资金资源
  exportBudget: string; // 年度出口预算
  financingCapability: 'strong' | 'medium' | 'weak' | ''; // 融资能力
  
  // 政策支持
  governmentSupport: string[]; // 享受的政策支持
  industryAssociation: string[]; // 所属行业协会
  
  // 出海规划
  hasClearPlan: boolean | null;
  planTimeframe: string; // 规划时间跨度
  targetMarkets: string[]; // 目标市场
  targetRevenue: string; // 目标营收
  
  // 风险认知
  perceivedRisks: string[]; // 认知到的风险
  riskMitigation: string[]; // 风险应对措施
}

// ------------------------------------------------------------
// 完整问卷数据
// ------------------------------------------------------------
export interface QuestionnaireData {
  profile: CompanyProfile;
  diagnosis: OverseasDiagnosis;
  product: ProductCompetitiveness;
  operation: OperationCapability;
  resource: ResourceAndPlan;
}

// ------------------------------------------------------------
// 评估结果
// ------------------------------------------------------------
export type CompanyStage = 'preparation' | 'exploration' | 'growth' | 'expansion' | 'mature';
export type CompanyLevel = '出海新锐' | '跨境成长型企业' | '全球化先锋' | '国际领军者';

export interface AssessmentResult {
  stage: CompanyStage;
  level: CompanyLevel;
  totalScore: number;
  dimensionScores: {
    foundation: number; // 基础能力
    product: number; // 产品竞争力
    operation: number; // 运营能力
    resource: number; // 资源配置
    potential: number; // 发展潜力
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  keyFindings: string[]; // 核心发现
}

// ------------------------------------------------------------
// 对标企业
// ------------------------------------------------------------
export interface BenchmarkCompany {
  id: string;
  name: string;
  industry: string;
  subIndustry?: string;
  companyNature: string;
  companyType: string;
  stage: CompanyStage;
  
  // 企业画像
  location: string; // 所在地区
  establishedYear: number;
  employeeRange: string;
  annualRevenue: string;
  
  // 出海成就
  exportMarkets: string[];
  exportRevenue: string;
  keyMilestones: string[];
  
  // 核心能力
  coreCompetency: string;
  competitiveAdvantage: string;
  
  // 出海路径
  expansionPath: string;
  keyStrategies: string[];
  
  // 可借鉴点
  learnablePoints: string[];
  applicableScenarios: string[]; // 适用场景
}

// ------------------------------------------------------------
// 服务产品
// ------------------------------------------------------------
export interface ServiceProduct {
  id: string;
  category: 'consulting' | 'training' | 'operation' | 'resource' | 'finance';
  name: string;
  description: string;
  deliverables: string[]; // 交付物
  duration: string; // 服务周期
  targetStage: CompanyStage[]; // 适用阶段
  painPoints: string[];
  expectedOutcomes: string[];
  investmentRange: { min: number; max: number };
}

// ------------------------------------------------------------
// 目标市场推荐
// ------------------------------------------------------------
export interface MarketRecommendation {
  priority: 'high' | 'medium' | 'low';
  region: string;
  countries: string[];
  marketSize: string;
  growthRate: string;
  entryDifficulty: 'easy' | 'medium' | 'hard';
  competitionLevel: 'high' | 'medium' | 'low';
  fitScore: number; // 匹配度评分
  rationale: string;
  entryStrategy: string;
  keyRequirements: string[];
  estimatedInvestment: string;
  timeline: string;
}

// ------------------------------------------------------------
// 报告数据
// ------------------------------------------------------------
export interface ReportData {
  // 企业信息
  companyProfile: CompanyProfile;
  
  // 评估结果
  assessmentResult: AssessmentResult;
  
  // 对标企业（多个）
  benchmarkCompanies: BenchmarkCompany[];
  
  // 推荐服务
  recommendedServices: ServiceProduct[];
  
  // 市场推荐
  marketRecommendations: MarketRecommendation[];
  
  // 行动计划
  actionPlan: {
    immediate: string[]; // 立即行动（1个月内）
    shortTerm: string[]; // 短期（1-3个月）
    mediumTerm: string[]; // 中期（3-6个月）
    longTerm: string[]; // 长期（6-12个月）
  };
  
  // 投资规划
  investmentPlan: {
    totalBudget: { min: number; max: number };
    allocation: { category: string; percentage: number; amount: string }[];
    roiProjection: string;
  };
  
  // 完整数据汇总（用于可视化）
  dataSummary: {
    profile: Record<string, string | string[]>;
    diagnosis: Record<string, string | string[] | boolean>;
    product: Record<string, string | string[]>;
    operation: Record<string, string | string[]>;
    resource: Record<string, string | string[]>;
  };
}

// ------------------------------------------------------------
// 问卷步骤
// ------------------------------------------------------------
export type QuestionnaireStep = 
  | 'welcome'
  | 'profile'      // 企业基础画像
  | 'diagnosis'    // 出海现状诊断
  | 'product'      // 产品竞争力
  | 'operation'    // 运营能力
  | 'resource'     // 资源与规划
  | 'report';      // 报告

// ------------------------------------------------------------
// 选项数据
// ------------------------------------------------------------

// 行业选项（更专业分类）
export const industryOptions = [
  { value: 'machinery', label: '机械设备', subCategories: ['工业设备', '农业机械', '建筑机械', '矿山机械', '食品机械', '印刷机械'] },
  { value: 'electronics', label: '电子电气', subCategories: ['消费电子', '电子元器件', 'LED照明', '电池电源', '电线电缆', '仪器仪表'] },
  { value: 'auto', label: '汽车及零部件', subCategories: ['整车', '汽车零部件', '新能源汽车', '摩托车及配件', '电动车'] },
  { value: 'textile', label: '纺织服装', subCategories: ['服装', '面料', '家纺', '纱线', '辅料', '功能性纺织品'] },
  { value: 'chemical', label: '化工及新材料', subCategories: ['精细化工', '塑料橡胶', '涂料油墨', '新材料', '化肥农药'] },
  { value: 'medical', label: '医疗器械', subCategories: ['医疗设备', '医用耗材', '康复器械', '体外诊断', '牙科眼科'] },
  { value: 'building', label: '建材五金', subCategories: ['卫浴洁具', '地板瓷砖', '门窗幕墙', '五金工具', '管材管件', '装饰材料'] },
  { value: 'furniture', label: '家具家居', subCategories: ['办公家具', '民用家具', '户外家具', '智能家居', '灯具照明'] },
  { value: 'food', label: '食品饮料', subCategories: ['休闲食品', '调味品', '茶叶咖啡', '保健食品', '冷冻食品'] },
  { value: 'beauty', label: '美妆个护', subCategories: ['护肤品', '彩妆', '洗护用品', '美容仪器', '口腔护理'] },
  { value: 'sports', label: '体育户外', subCategories: ['健身器材', '户外运动', '体育用品', '露营装备'] },
  { value: 'toys', label: '玩具礼品', subCategories: ['电子玩具', '毛绒玩具', '益智玩具', '工艺礼品', '节日用品'] },
  { value: 'packaging', label: '包装印刷', subCategories: ['纸包装', '塑料包装', '金属包装', '标签印刷'] },
  { value: 'energy', label: '新能源', subCategories: ['光伏', '储能', '充电桩', '氢能源', '风能设备'] },
  { value: 'other', label: '其他行业', subCategories: [] },
];

// 核心能力选项
export const coreCompetencyOptions = [
  { value: 'technology', label: '核心技术/专利' },
  { value: 'cost', label: '成本优势' },
  { value: 'quality', label: '品质管控' },
  { value: 'customization', label: '定制能力' },
  { value: 'delivery', label: '快速交期' },
  { value: 'certification', label: '国际认证' },
  { value: 'brand', label: '品牌影响力' },
  { value: 'service', label: '服务体系' },
  { value: 'scale', label: '规模优势' },
];

// B2B平台选项
export const b2bPlatformOptions = [
  { value: 'alibaba', label: '阿里巴巴国际站' },
  { value: 'mic', label: '中国制造网' },
  { value: 'globalsources', label: '环球资源' },
  { value: 'tradekey', label: 'TradeKey' },
  { value: 'ec21', label: 'EC21' },
  { value: 'indiamart', label: 'IndiaMART' },
  { value: 'thomasnet', label: 'ThomasNet' },
  { value: 'kompass', label: 'Kompass' },
];

// 社媒平台选项
export const socialPlatformOptions = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'pinterest', label: 'Pinterest' },
];

// B2C平台选项
export const b2cPlatformOptions = [
  { value: 'amazon', label: 'Amazon' },
  { value: 'ebay', label: 'eBay' },
  { value: 'aliexpress', label: '速卖通' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'lazada', label: 'Lazada' },
  { value: 'temu', label: 'Temu' },
  { value: 'tiktokshop', label: 'TikTok Shop' },
  { value: 'wayfair', label: 'Wayfair' },
  { value: 'manomano', label: 'ManoMano' },
];

// 主要市场选项
export const marketOptions = [
  { value: 'north_america', label: '北美', countries: ['美国', '加拿大', '墨西哥'] },
  { value: 'europe', label: '欧洲', countries: ['德国', '英国', '法国', '意大利', '西班牙', '荷兰', '波兰'] },
  { value: 'southeast_asia', label: '东南亚', countries: ['越南', '泰国', '印尼', '马来西亚', '菲律宾', '新加坡'] },
  { value: 'middle_east', label: '中东', countries: ['阿联酋', '沙特', '土耳其', '以色列', '埃及'] },
  { value: 'south_america', label: '南美', countries: ['巴西', '阿根廷', '智利', '哥伦比亚', '秘鲁'] },
  { value: 'africa', label: '非洲', countries: ['南非', '尼日利亚', '肯尼亚', '摩洛哥', '埃及'] },
  { value: 'oceania', label: '大洋洲', countries: ['澳大利亚', '新西兰'] },
  { value: 'east_asia', label: '东亚', countries: ['日本', '韩国'] },
  { value: 'south_asia', label: '南亚', countries: ['印度', '巴基斯坦', '孟加拉'] },
  { value: 'cis', label: '独联体', countries: ['俄罗斯', '哈萨克斯坦', '乌兹别克斯坦'] },
];

// 认证选项
export const certificationOptions = [
  { value: 'ce', label: 'CE认证', region: '欧盟' },
  { value: 'fcc', label: 'FCC认证', region: '美国' },
  { value: 'ul', label: 'UL认证', region: '北美' },
  { value: 'rohs', label: 'RoHS', region: '欧盟' },
  { value: 'reach', label: 'REACH', region: '欧盟' },
  { value: 'fda', label: 'FDA认证', region: '美国' },
  { value: 'iso9001', label: 'ISO9001', region: '国际' },
  { value: 'iso14001', label: 'ISO14001', region: '国际' },
  { value: 'iso13485', label: 'ISO13485', region: '医疗器械' },
  { value: 'iatf16949', label: 'IATF16949', region: '汽车' },
  { value: 'bsci', label: 'BSCI', region: '社会责任' },
  { value: 'sedex', label: 'SEDEX', region: '社会责任' },
  { value: 'fsc', label: 'FSC', region: '森林认证' },
  { value: 'gs', label: 'GS认证', region: '德国' },
  { value: 'cb', label: 'CB认证', region: '国际电工' },
];
