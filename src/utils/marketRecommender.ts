// ============================================================
// 智能目标市场推荐算法
// 数据来源：海关总署2024年统计数据、中国贸促会
// ============================================================

import type { MarketRecommendation, CompanyProfile, ProductCompetitiveness, OverseasDiagnosis } from '@/types/questionnaire';

interface MarketMatchFactors {
  industry: string;
  productCategory: string;
  pricePositioning: string;
  certifications: string[];
  targetMarkets: string[];
  stage: string;
}

// ============================================================
// 2024年中国外贸权威数据（来源：海关总署、贸促会）
// ============================================================
const tradeData2024 = {
  // 2024年中国外贸总额
  totalTradeVolume: '43.85万亿元',
  totalGrowthRate: '5%',
  exportVolume: '25.45万亿元',
  exportGrowthRate: '7.1%',
  importVolume: '18.40万亿元',
  importGrowthRate: '2.3%',
  
  // 前8大贸易伙伴（按贸易额占比排序）
  topTradingPartners: [
    { region: '东盟', tradeVolume: '6.99万亿元', share: '15.9%', growth: '9%', type: 'export' },
    { region: '欧盟', tradeVolume: '5.61万亿元', share: '12.8%', growth: '1.6%', type: 'export' },
    { region: '美国', tradeVolume: '4.91万亿元', share: '11.2%', growth: '4.9%', type: 'export' },
    { region: '韩国', tradeVolume: '2.33万亿元', share: '5.3%', growth: '2.5%', type: 'export' },
    { region: '日本', tradeVolume: '2.19万亿元', share: '5.0%', growth: '-0.8%', type: 'export' },
    { region: '俄罗斯', tradeVolume: '1.74万亿元', share: '4.0%', growth: '2.9%', type: 'export' },
    { region: '巴西', tradeVolume: '1.33万亿元', share: '3.0%', growth: '6.2%', type: 'export' },
    { region: '澳大利亚', tradeVolume: '1.28万亿元', share: '2.9%', growth: '-1.5%', type: 'export' },
  ],
  
  // 重点市场详细数据
  marketDetails: {
    asean: {
      totalTrade: '6.99万亿元',
      growth: '9%',
      chinaExport: '4.17万亿元',
      exportGrowth: '13.4%',
      keyCountries: ['越南', '马来西亚', '泰国', '印尼', '新加坡'],
      topImports: ['机电产品', '电子产品', '机械设备', '纺织品'],
    },
    eu: {
      totalTrade: '5.61万亿元',
      growth: '1.6%',
      chinaExport: '3.52万亿元',
      exportGrowth: '1.6%',
      keyCountries: ['德国', '荷兰', '法国', '意大利', '西班牙'],
      topImports: ['机电产品', '新能源产品', '机械设备', '化工产品'],
    },
    us: {
      totalTrade: '4.91万亿元',
      growth: '4.9%',
      chinaExport: '3.87万亿元',
      exportGrowth: '4.9%',
      keyProducts: ['机电产品', '消费品', '电子产品', '家具'],
    },
    middleEast: {
      chinaExport: '约1.5万亿元',
      exportGrowth: '8-10%',
      keyCountries: ['阿联酋', '沙特', '土耳其', '以色列'],
      topImports: ['机电产品', '建材', '纺织品', '新能源设备'],
    },
    cis: {
      chinaExport: '约1.2万亿元',
      exportGrowth: '15%+',
      keyCountries: ['俄罗斯', '哈萨克斯坦', '乌兹别克斯坦'],
      topImports: ['机电产品', '汽车', '电子产品', '消费品'],
    },
  },
  
  // 行业出口增长数据（2024年）
  industryExportGrowth: {
    energy: { growth: '25%', volume: '约1.5万亿元', note: '光伏、锂电池、新能源汽车' },
    electronics: { growth: '8.7%', volume: '约8万亿元', note: '消费电子、电子元器件' },
    machinery: { growth: '10.2%', volume: '约6万亿元', note: '机械设备、工程机械' },
    auto: { growth: '18.5%', volume: '约1.2万亿元', note: '新能源汽车出口爆发' },
    textile: { growth: '3.2%', volume: '约2万亿元', note: '传统优势行业' },
    medical: { growth: '6.8%', volume: '约5000亿元', note: '医疗器械出口增长' },
    chemical: { growth: '4.5%', volume: '约3万亿元', note: '化工产品' },
    building: { growth: '7.3%', volume: '约8000亿元', note: '建材出口增长' },
    furniture: { growth: '5.1%', volume: '约4000亿元', note: '家具出口' },
    beauty: { growth: '12%', volume: '约2000亿元', note: '美妆个护增长迅速' },
    food: { growth: '4.2%', volume: '约6000亿元', note: '食品农产品' },
  },
  
  // 数据来源
  dataSources: [
    '海关总署《2024年中国外贸进出口情况》',
    '中国贸促会《2024年中国对外贸易形势报告》',
    '商务部《2024年进出口统计快报》',
  ],
};

// ============================================================
// 行业-市场匹配度矩阵（基于2024年实际贸易数据更新）
// ============================================================
const industryMarketMatrix: Record<string, Record<string, number>> = {
  // 机械设备 - 东盟、中东、非洲需求旺盛
  machinery: {
    southeast_asia: 92,  // 东盟基建需求+13.4%出口增长
    middle_east: 88,     // 中东基建热潮
    africa: 82,          // 非洲工业化需求
    cis: 85,             // 俄罗斯市场替代西方设备
    south_america: 72,
    europe: 65,
    north_america: 58,
  },
  // 电子电气 - 东盟转移+欧美传统市场
  electronics: {
    southeast_asia: 96,  // 产业链转移，电子制造基地
    north_america: 85,   // 传统大市场
    europe: 88,          // 稳定需求
    middle_east: 82,     // 消费升级
    south_america: 70,
    africa: 68,
  },
  // 汽车及零部件 - 新能源汽车出口爆发+18.5%
  auto: {
    cis: 92,             // 俄罗斯市场，中国品牌占有率超50%
    middle_east: 88,     // 中东对中国车接受度高
    southeast_asia: 86,  // 泰国、印尼电动车市场增长
    south_america: 78,   // 巴西等市场
    europe: 55,          // 受贸易壁垒影响
    north_america: 45,   // 进入难度高
  },
  // 纺织服装 - 传统优势，欧美为主
  textile: {
    europe: 88,
    north_america: 85,
    japan: 86,
    southeast_asia: 78,  // 区域内贸易增长
    middle_east: 72,
    south_america: 68,
  },
  // 建材五金 - 中东、东南亚基建需求
  building: {
    middle_east: 96,     // 沙特Vision 2030等基建项目
    southeast_asia: 88,  // 东盟基建需求
    africa: 82,          // 非洲基建
    cis: 78,
    south_america: 72,
  },
  // 家具 - 欧美传统市场
  furniture: {
    north_america: 88,
    europe: 85,
    japan: 82,
    australia: 78,
    middle_east: 72,
  },
  // 美妆个护 - 东南亚、中东增长迅速
  beauty: {
    southeast_asia: 92,  // 东南亚美妆市场+15%
    middle_east: 88,     // 中东高消费力
    europe: 78,
    south_america: 72,
    africa: 68,
  },
  // 食品农产品 - 东盟、日韩、欧美
  food: {
    southeast_asia: 88,  // 华人市场，口味相近
    north_america: 82,
    europe: 75,
    japan: 86,
    australia: 72,
  },
  // 医疗器械 - 欧美高端市场+新兴市场
  medical: {
    europe: 88,
    north_america: 86,
    japan: 84,
    middle_east: 80,     // 中东医疗升级
    southeast_asia: 75,  // 东南亚医疗市场增长
  },
  // 化工产品 - 东南亚、中东
  chemical: {
    southeast_asia: 85,
    middle_east: 80,
    africa: 75,
    south_america: 70,
  },
  // 新能源 - 2024年增长最快领域+25%
  energy: {
    europe: 92,          // 光伏、储能需求大
    southeast_asia: 88,  // 光伏装机增长
    middle_east: 85,     // 沙特、阿联酋新能源投资
    north_america: 78,   // 储能市场
    cis: 75,
  },
};

// 价格定位-市场匹配度
const priceMarketMatrix: Record<string, Record<string, number>> = {
  premium: {
    europe: 95,
    north_america: 90,
    japan: 92,
    australia: 85,
    middle_east: 82,
  },
  'mid-high': {
    europe: 82,
    north_america: 85,
    japan: 80,
    southeast_asia: 78,
    middle_east: 75,
  },
  mid: {
    southeast_asia: 92,
    middle_east: 88,
    south_america: 82,
    cis: 85,
    africa: 78,
  },
  'mid-low': {
    africa: 92,
    southeast_asia: 88,
    south_america: 85,
    cis: 80,
  },
  low: {
    africa: 95,
    southeast_asia: 92,
    south_america: 88,
  },
};

// 认证-市场匹配度
const certificationMarketBonus: Record<string, string[]> = {
  europe: ['CE', 'GS', 'TUV', 'RoHS'],
  north_america: ['UL', 'FCC', 'FDA', 'EPA'],
  japan: ['PSE', 'TELEC', 'JIS'],
  australia: ['SAA', 'RCM', 'C-Tick'],
  middle_east: ['SASO', 'GCC', 'ECAS'],
  southeast_asia: ['PSB', 'SIRIM', 'TISI'],
};

// ============================================================
// 市场详细信息（2024年数据更新）
// ============================================================
const marketDetails: Record<string, Partial<MarketRecommendation> & { 
  competitorAnalysis?: string; 
  entryBarriers?: string;
}> = {
  north_america: {
    region: '北美',
    countries: ['美国', '加拿大', '墨西哥'],
    marketSize: '7.2万亿美元（2024）',
    growthRate: '2.5-3.5%',
    entryDifficulty: 'hard',
    competitionLevel: 'high',
    rationale: '全球最大消费市场，2024年中国对美出口增长4.9%。购买力强，但准入门槛高，竞争激烈。建议有品牌实力和认证基础的企业进入。',
    entryStrategy: '品牌先行+本地化运营+合规认证+跨境电商',
    keyRequirements: ['UL/FCC/FDA认证', '本地化客服', '仓储物流（海外仓）', '品牌营销', '税务合规'],
    estimatedInvestment: '150-600万',
    timeline: '12-24个月',
    competitorAnalysis: '美国本土品牌强势，中国竞争对手众多（SHEIN、Temu等），价格战激烈。差异化定位是关键。',
    entryBarriers: '高关税（部分产品25%+）、严格认证要求、消费者诉讼风险、数据隐私合规（CCPA）',
  },
  europe: {
    region: '欧洲',
    countries: ['德国', '英国', '法国', '意大利', '西班牙', '荷兰', '波兰'],
    marketSize: '4.5万亿美元（2024）',
    growthRate: '1.5-2.5%',
    entryDifficulty: 'hard',
    competitionLevel: 'high',
    rationale: '2024年中国对欧盟出口增长1.6%，市场成熟稳定。消费力强，注重品质、环保和ESG。绿色产品（新能源、环保材料）机会大。',
    entryStrategy: '合规先行+ESG定位+品质溢价+渠道建设',
    keyRequirements: ['CE认证', 'GDPR合规', '碳足迹认证（CBAM）', '多语言支持', '本地仓储'],
    estimatedInvestment: '100-500万',
    timeline: '12-18个月',
    competitorAnalysis: '欧洲本土品牌历史悠久，中国新能源企业（光伏、电动车）竞争力强。注重可持续发展理念。',
    entryBarriers: 'CBAM碳边境税、严格环保法规、GDPR合规、语言文化差异、本地品牌忠诚度高',
  },
  southeast_asia: {
    region: '东南亚',
    countries: ['越南', '泰国', '印尼', '马来西亚', '菲律宾', '新加坡'],
    marketSize: '1.5万亿美元（2024）',
    growthRate: '8-12%',
    entryDifficulty: 'medium',
    competitionLevel: 'medium',
    rationale: '2024年中国-东盟贸易额6.99万亿元（增长9%），中国第一大贸易伙伴。RCEP红利持续释放，华人基础好，电商渗透率高，增长潜力最大。',
    entryStrategy: '电商切入+社媒营销（TikTok）+本地代理+产业链合作',
    keyRequirements: ['Shopee/Lazada/TikTok店铺', '本地支付方式', '物流配送', '客服团队', 'RCEP原产地证'],
    estimatedInvestment: '30-150万',
    timeline: '3-6个月',
    competitorAnalysis: '中国竞争对手众多，价格战激烈。本土品牌崛起，日韩品牌高端市场占优。TikTok电商是新机会。',
    entryBarriers: '各国法规差异、宗教文化差异（穆斯林市场）、支付习惯多样、物流基础设施不均衡',
  },
  middle_east: {
    region: '中东',
    countries: ['阿联酋', '沙特', '土耳其', '以色列', '埃及'],
    marketSize: '9500亿美元（2024）',
    growthRate: '6-9%',
    entryDifficulty: 'medium',
    competitionLevel: 'medium',
    rationale: '2024年中国对中东出口增长8-10%，沙特Vision 2030等基建项目带来大量需求。购买力强，对中国产品接受度高，新能源、建材、机械机会大。',
    entryStrategy: '展会（迪拜）+本地代理+B2B平台+政府项目对接',
    keyRequirements: ['SASO/GCC认证', '阿拉伯语/英语支持', '本地代理', '展会参与', '宗教文化适配'],
    estimatedInvestment: '60-250万',
    timeline: '6-12个月',
    competitorAnalysis: '欧美品牌高端市场占优，中国品牌性价比优势明显。本土贸易商网络发达，渠道依赖度高。',
    entryBarriers: '宗教文化要求（清真认证）、认证要求、代理制度复杂、地缘政治风险、支付结算',
  },
  south_america: {
    region: '南美',
    countries: ['巴西', '阿根廷', '智利', '哥伦比亚', '秘鲁'],
    marketSize: '6500亿美元（2024）',
    growthRate: '3-5%',
    entryDifficulty: 'hard',
    competitionLevel: 'medium',
    rationale: '2024年中国对巴西出口增长6.2%。市场潜力大，但物流成本高，支付和清关复杂。建议通过Mercado Libre平台切入。',
    entryStrategy: 'Mercado Libre+本地代理+分期付款+本地仓储',
    keyRequirements: ['本地支付方式（Boleto）', '葡萄牙语/西班牙语', '物流方案', '清关代理', 'INMETRO认证'],
    estimatedInvestment: '50-200万',
    timeline: '6-12个月',
    competitorAnalysis: 'Mercado Libre主导电商，欧美品牌在高端市场占优。中国产品以性价比为主，品牌认知度待提升。',
    entryBarriers: '物流成本高（海运30-45天）、清关复杂、汇率波动大、本地支付习惯、税务合规复杂',
  },
  africa: {
    region: '非洲',
    countries: ['南非', '尼日利亚', '肯尼亚', '摩洛哥', '埃及'],
    marketSize: '3500亿美元（2024）',
    growthRate: '4-7%',
    entryDifficulty: 'medium',
    competitionLevel: 'low',
    rationale: '人口红利（14亿人口），基建需求大，竞争相对较小。适合中低端定位产品，B2B贸易为主。',
    entryStrategy: 'B2B平台（阿里巴巴）+本地代理+分期付款+展会',
    keyRequirements: ['本地代理网络', '灵活支付方式', '物流方案', '售后服务', '信用保险'],
    estimatedInvestment: '25-120万',
    timeline: '3-9个月',
    competitorAnalysis: '印度、土耳其竞争者较多，中国产品性价比高。本土品牌弱，渠道分散。',
    entryBarriers: '基础设施落后、支付风险高、政治不稳定、物流成本高、清关效率低',
  },
  japan: {
    region: '日本',
    countries: ['日本'],
    marketSize: '1.1万亿美元（2024）',
    growthRate: '1-2%',
    entryDifficulty: 'hard',
    competitionLevel: 'high',
    rationale: '2024年中日贸易额2.19万亿元。品质要求极高，消费者挑剔，但一旦进入忠诚度高。适合高品质、创新型产品。',
    entryStrategy: '品质认证+本地化+长期主义+本地代理',
    keyRequirements: ['JIS/PSE认证', '日语支持', '极致品质', '本地代理', '售后服务'],
    estimatedInvestment: '100-400万',
    timeline: '12-18个月',
    competitorAnalysis: '日本本土品牌极强，消费者对国货忠诚度高。中国产品需差异化定位，如性价比或创新功能。',
    entryBarriers: '极高的品质标准、复杂的认证流程、语言障碍、消费者保守、渠道封闭',
  },
  australia: {
    region: '澳洲',
    countries: ['澳大利亚', '新西兰'],
    marketSize: '3200亿美元（2024）',
    growthRate: '2-3%',
    entryDifficulty: 'medium',
    competitionLevel: 'medium',
    rationale: '人均消费高，对品质要求严格。2024年中澳贸易稳定，反倾销调查较多，需注意合规。',
    entryStrategy: '合规认证+品质定位+本地仓储+电商',
    keyRequirements: ['SAA/RCM认证', '本地仓储', '英语支持', '售后服务', '反倾销合规'],
    estimatedInvestment: '60-250万',
    timeline: '6-12个月',
    competitorAnalysis: '欧美品牌主导，中国品牌认知度提升中。电商市场增长快，亚马逊澳洲站机会大。',
    entryBarriers: '严格的生物安全法规、反倾销调查、地理隔离导致物流成本高、市场容量相对小',
  },
  cis: {
    region: '独联体',
    countries: ['俄罗斯', '哈萨克斯坦', '乌兹别克斯坦'],
    marketSize: '4800亿美元（2024）',
    growthRate: '12-18%',
    entryDifficulty: 'medium',
    competitionLevel: 'medium',
    rationale: '2024年中国对俄出口增长15%+，制裁下西方退出，中国品牌机会大增。汽车、电子、机械需求旺盛。人民币结算便利。',
    entryStrategy: 'B2B平台+本地代理+人民币结算+边境贸易',
    keyRequirements: ['EAC认证', '俄语支持', '本地代理', '支付方案（人民币/卢布）', '物流方案'],
    estimatedInvestment: '40-180万',
    timeline: '3-9个月',
    competitorAnalysis: '西方品牌退出，中国品牌快速填补。汽车（奇瑞、长城）市场占有率超50%，竞争相对缓和。',
    entryBarriers: '制裁风险、SWIFT限制、物流通道受限（中欧班列紧张）、汇率波动、政治不确定性',
  },
};

// 智能推荐市场
export function recommendMarkets(
  profile: CompanyProfile,
  product: ProductCompetitiveness,
  diagnosis: OverseasDiagnosis,
  limit: number = 3
): MarketRecommendation[] {
  const factors: MarketMatchFactors = {
    industry: profile.industry,
    productCategory: profile.productCategory,
    pricePositioning: product.pricePositioning,
    certifications: product.certifications,
    targetMarkets: (diagnosis as any).targetMarkets || [],
    stage: diagnosis.stage || 'preparation',
  };
  
  const markets = Object.keys(marketDetails);
  
  const scored = markets.map(marketKey => {
    const details = marketDetails[marketKey];
    let score = 0;
    const reasons: string[] = [];
    
    // 1. 行业匹配度（权重30%）
    const industryScores = industryMarketMatrix[factors.industry] || {};
    const industryScore = industryScores[marketKey] || 50;
    score += industryScore * 0.30;
    if (industryScore >= 85) {
      reasons.push(`${details.region}是${factors.industry}行业的重点出口市场，2024年出口增长强劲`);
    } else if (industryScore >= 75) {
      reasons.push(`${details.region}对${factors.industry}行业产品有稳定需求`);
    }
    
    // 2. 价格定位匹配度（权重25%）
    const priceScores = priceMarketMatrix[factors.pricePositioning] || {};
    const priceScore = priceScores[marketKey] || 50;
    score += priceScore * 0.25;
    if (priceScore >= 85) {
      reasons.push(`${factors.pricePositioning === 'premium' ? '高端' : factors.pricePositioning === 'mid' ? '中端' : '性价比'}定位与${details.region}市场消费层级匹配`);
    }
    
    // 3. 认证匹配度（权重20%）
    const requiredCerts = certificationMarketBonus[marketKey] || [];
    const hasRequiredCert = factors.certifications.some(cert => 
      requiredCerts.some(req => cert.toLowerCase().includes(req.toLowerCase()))
    );
    const certScore = hasRequiredCert ? 100 : (factors.certifications.length > 0 ? 60 : 30);
    score += certScore * 0.20;
    if (hasRequiredCert) {
      reasons.push('您的产品认证符合该市场准入要求，可快速进入市场');
    } else if (factors.certifications.length > 0) {
      reasons.push(`建议补充${details.region}市场所需认证（如${requiredCerts.slice(0, 2).join('、')}）以提升竞争力`);
    }
    
    // 4. 企业出海阶段匹配（权重15%）
    const stageDifficulty: Record<string, string[]> = {
      preparation: ['africa', 'southeast_asia', 'cis'],
      exploration: ['southeast_asia', 'middle_east', 'africa', 'cis'],
      growth: ['southeast_asia', 'middle_east', 'south_america', 'cis'],
      expansion: ['europe', 'north_america', 'japan', 'australia'],
    };
    const suitableMarkets = stageDifficulty[factors.stage] || [];
    const stageScore = suitableMarkets.includes(marketKey) ? 100 : 60;
    score += stageScore * 0.15;
    if (stageScore === 100) {
      reasons.push(`适合${factors.stage === 'preparation' ? '准备期' : factors.stage === 'exploration' ? '探索期' : factors.stage === 'growth' ? '成长期' : '扩张期'}企业进入，风险可控`);
    }
    
    // 5. 用户意向匹配（权重10%）
    const intentScore = factors.targetMarkets.some(m => 
      details.countries?.includes(m) || marketKey.includes(m.toLowerCase().replace(' ', '_'))
    ) ? 100 : 50;
    score += intentScore * 0.10;
    if (intentScore === 100) {
      reasons.push('符合您的目标市场意向');
    }
    
    return {
      ...details,
      priority: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low',
      fitScore: Math.round(score),
      rationale: reasons.length > 0 ? reasons.join('；') : details.rationale || '',
    } as MarketRecommendation;
  });
  
  // 排序并返回前N个
  return scored
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, limit);
}

// 生成市场推荐说明
export function generateMarketDescription(recommendation: MarketRecommendation): string {
  const { fitScore, rationale } = recommendation;
  
  if (fitScore >= 80) {
    return `高度推荐（匹配度${fitScore}%）：${rationale}`;
  } else if (fitScore >= 65) {
    return `推荐（匹配度${fitScore}%）：${rationale}`;
  } else {
    return `可考虑（匹配度${fitScore}%）：${rationale}`;
  }
}

// 获取2024年贸易数据（供其他模块使用）
export function getTradeData2024() {
  return tradeData2024;
}

// 获取行业出口增长数据
export function getIndustryExportGrowth(industry: string) {
  return tradeData2024.industryExportGrowth[industry as keyof typeof tradeData2024.industryExportGrowth] || null;
}
