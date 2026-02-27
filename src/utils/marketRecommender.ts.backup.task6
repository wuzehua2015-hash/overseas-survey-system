// ============================================================
// 智能目标市场推荐算法
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

// 行业-市场匹配度矩阵
const industryMarketMatrix: Record<string, Record<string, number>> = {
  machinery: {
    southeast_asia: 90,
    middle_east: 85,
    africa: 80,
    cis: 75,
    south_america: 70,
    europe: 60,
    north_america: 55,
  },
  electronics: {
    southeast_asia: 95,
    middle_east: 80,
    europe: 85,
    north_america: 80,
    south_america: 70,
    africa: 65,
  },
  auto: {
    middle_east: 90,
    southeast_asia: 85,
    cis: 80,
    south_america: 75,
    africa: 70,
    europe: 50,
  },
  textile: {
    europe: 90,
    north_america: 85,
    japan: 88,
    southeast_asia: 75,
    middle_east: 70,
    south_america: 65,
  },
  building: {
    middle_east: 95,
    southeast_asia: 85,
    africa: 80,
    cis: 75,
    south_america: 70,
  },
  furniture: {
    north_america: 90,
    europe: 85,
    japan: 80,
    australia: 75,
    middle_east: 70,
  },
  beauty: {
    southeast_asia: 90,
    middle_east: 85,
    europe: 75,
    south_america: 70,
    africa: 65,
  },
  food: {
    southeast_asia: 85,
    north_america: 80,
    europe: 75,
    japan: 85,
    australia: 70,
  },
  medical: {
    europe: 90,
    north_america: 88,
    japan: 85,
    middle_east: 75,
    southeast_asia: 70,
  },
  chemical: {
    southeast_asia: 80,
    middle_east: 75,
    africa: 70,
    south_america: 65,
  },
  energy: {
    europe: 90,
    north_america: 85,
    middle_east: 80,
    southeast_asia: 75,
  },
};

// 价格定位-市场匹配度
const priceMarketMatrix: Record<string, Record<string, number>> = {
  premium: {
    europe: 95,
    north_america: 90,
    japan: 92,
    australia: 85,
    middle_east: 80,
  },
  'mid-high': {
    europe: 80,
    north_america: 85,
    japan: 78,
    southeast_asia: 75,
    middle_east: 70,
  },
  mid: {
    southeast_asia: 90,
    middle_east: 85,
    south_america: 80,
    cis: 75,
    africa: 70,
  },
  'mid-low': {
    africa: 90,
    southeast_asia: 85,
    south_america: 80,
    cis: 75,
  },
  low: {
    africa: 95,
    southeast_asia: 90,
    south_america: 85,
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

// 市场详细信息
const marketDetails: Record<string, Partial<MarketRecommendation>> = {
  north_america: {
    region: '北美',
    countries: ['美国', '加拿大', '墨西哥'],
    marketSize: '6.5万亿美元',
    growthRate: '3-5%',
    entryDifficulty: 'hard',
    competitionLevel: 'high',
    rationale: '全球最大消费市场，购买力强，但准入门槛高，竞争激烈',
    entryStrategy: '品牌先行+本地化运营+合规认证',
    keyRequirements: ['UL/FCC认证', '本地化客服', '仓储物流', '品牌营销'],
    estimatedInvestment: '100-500万',
    timeline: '12-24个月',
  },
  europe: {
    region: '欧洲',
    countries: ['德国', '英国', '法国', '意大利', '西班牙', '荷兰', '波兰'],
    marketSize: '4.2万亿美元',
    growthRate: '2-4%',
    entryDifficulty: 'hard',
    competitionLevel: 'high',
    rationale: '成熟市场，消费力强，注重品质和环保，认证要求严格',
    entryStrategy: '合规先行+品质定位+渠道建设',
    keyRequirements: ['CE认证', 'GDPR合规', '多语言支持', '本地仓储'],
    estimatedInvestment: '80-400万',
    timeline: '12-18个月',
  },
  southeast_asia: {
    region: '东南亚',
    countries: ['越南', '泰国', '印尼', '马来西亚', '菲律宾', '新加坡'],
    marketSize: '1.2万亿美元',
    growthRate: '8-12%',
    entryDifficulty: 'medium',
    competitionLevel: 'medium',
    rationale: 'RCEP红利，华人基础好，电商渗透率高，增长潜力大',
    entryStrategy: '电商切入+社媒营销+本地代理',
    keyRequirements: ['Shopee/Lazada店铺', '本地支付方式', '物流配送', '客服团队'],
    estimatedInvestment: '30-150万',
    timeline: '3-6个月',
  },
  middle_east: {
    region: '中东',
    countries: ['阿联酋', '沙特', '土耳其', '以色列', '埃及'],
    marketSize: '8000亿美元',
    growthRate: '6-8%',
    entryDifficulty: 'medium',
    competitionLevel: 'medium',
    rationale: '购买力强，对中国产品接受度高，基建需求旺盛',
    entryStrategy: '展会+代理+B2B平台',
    keyRequirements: ['SASO认证', '阿拉伯语支持', '本地代理', '展会参与'],
    estimatedInvestment: '50-200万',
    timeline: '6-12个月',
  },
  south_america: {
    region: '南美',
    countries: ['巴西', '阿根廷', '智利', '哥伦比亚', '秘鲁'],
    marketSize: '6000亿美元',
    growthRate: '4-6%',
    entryDifficulty: 'hard',
    competitionLevel: 'medium',
    rationale: '市场潜力大，但物流成本高，支付和清关复杂',
    entryStrategy: 'Mercado Libre+本地代理+分期付款',
    keyRequirements: ['本地支付方式', '葡萄牙语/西班牙语', '物流方案', '清关代理'],
    estimatedInvestment: '40-180万',
    timeline: '6-12个月',
  },
  africa: {
    region: '非洲',
    countries: ['南非', '尼日利亚', '肯尼亚', '摩洛哥', '埃及'],
    marketSize: '3000亿美元',
    growthRate: '5-8%',
    entryDifficulty: 'medium',
    competitionLevel: 'low',
    rationale: '人口红利，基建需求大，竞争相对较小，但基础设施待完善',
    entryStrategy: 'B2B平台+本地代理+分期付款',
    keyRequirements: ['本地代理网络', '灵活支付方式', '物流方案', '售后服务'],
    estimatedInvestment: '20-100万',
    timeline: '3-9个月',
  },
  japan: {
    region: '日本',
    countries: ['日本'],
    marketSize: '1.2万亿美元',
    growthRate: '1-2%',
    entryDifficulty: 'hard',
    competitionLevel: 'high',
    rationale: '品质要求高，消费者挑剔，但一旦进入忠诚度高',
    entryStrategy: '品质认证+本地化+长期主义',
    keyRequirements: ['JIS/PSE认证', '日语支持', '极致品质', '本地代理'],
    estimatedInvestment: '80-300万',
    timeline: '12-18个月',
  },
  australia: {
    region: '澳洲',
    countries: ['澳大利亚', '新西兰'],
    marketSize: '3000亿美元',
    growthRate: '3-4%',
    entryDifficulty: 'medium',
    competitionLevel: 'medium',
    rationale: '人均消费高，对品质要求严格，反倾销调查较多',
    entryStrategy: '合规认证+品质定位+本地仓储',
    keyRequirements: ['SAA/RCM认证', '本地仓储', '英语支持', '售后服务'],
    estimatedInvestment: '50-200万',
    timeline: '6-12个月',
  },
  cis: {
    region: '独联体',
    countries: ['俄罗斯', '哈萨克斯坦', '乌兹别克斯坦'],
    marketSize: '4000亿美元',
    growthRate: '3-5%',
    entryDifficulty: 'medium',
    competitionLevel: 'medium',
    rationale: '制裁下西方退出，中国品牌机会增加，但支付和物流受限',
    entryStrategy: 'B2B平台+本地代理+人民币结算',
    keyRequirements: ['EAC认证', '俄语支持', '本地代理', '支付方案'],
    estimatedInvestment: '30-150万',
    timeline: '3-9个月',
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
    if (industryScore >= 80) {
      reasons.push(`${details.region}是${factors.industry}行业的热门出口市场`);
    }
    
    // 2. 价格定位匹配度（权重25%）
    const priceScores = priceMarketMatrix[factors.pricePositioning] || {};
    const priceScore = priceScores[marketKey] || 50;
    score += priceScore * 0.25;
    if (priceScore >= 80) {
      reasons.push(`${factors.pricePositioning === 'premium' ? '高端' : factors.pricePositioning === 'mid' ? '中端' : '性价比'}定位适合${details.region}市场`);
    }
    
    // 3. 认证匹配度（权重20%）
    const requiredCerts = certificationMarketBonus[marketKey] || [];
    const hasRequiredCert = factors.certifications.some(cert => 
      requiredCerts.some(req => cert.toLowerCase().includes(req.toLowerCase()))
    );
    const certScore = hasRequiredCert ? 100 : (factors.certifications.length > 0 ? 60 : 30);
    score += certScore * 0.20;
    if (hasRequiredCert) {
      reasons.push('您的产品认证符合该市场准入要求');
    } else if (factors.certifications.length > 0) {
      reasons.push('建议补充该市场所需认证以提升竞争力');
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
      reasons.push(`适合${factors.stage === 'preparation' ? '准备期' : factors.stage === 'exploration' ? '探索期' : '成长期'}企业进入`);
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
