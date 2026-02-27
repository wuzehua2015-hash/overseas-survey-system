// ============================================================
// 分页式问卷步骤类型定义
// ============================================================

// Profile 页面的子步骤
export type ProfileSubStep = 
  | 'company-basic'      // 企业基本信息
  | 'company-business'   // 主营业务
  | 'company-scale'      // 企业规模
  | 'contact-info';      // 联系人信息

// Diagnosis 页面的子步骤
export type DiagnosisSubStep = 
  | 'business-status'    // 业务现状
  | 'market-coverage'    // 市场覆盖
  | 'channel-layout'     // 渠道布局
  | 'team-config';       // 团队配置

// Product 页面的子步骤
export type ProductSubStep = 
  | 'product-cert'       // 产品认证
  | 'product-feature'    // 产品特性
  | 'rnd-innovation'     // 研发创新
  | 'production-capacity'; // 生产能力

// Operation 页面的子步骤
export type OperationSubStep = 
  | 'digital-capability' // 数字化能力
  | 'marketing-capability' // 营销能力
  | 'brand-building';    // 品牌建设

// Resource 页面的子步骤
export type ResourceSubStep = 
  | 'funding-resource'   // 资金资源
  | 'expansion-plan';    // 出海规划

// 所有子步骤的联合类型
export type SubStep = ProfileSubStep | DiagnosisSubStep | ProductSubStep | OperationSubStep | ResourceSubStep;

// 主步骤对应的子步骤配置
export const STEP_CONFIG: Record<string, { subSteps: string[]; titles: string[] }> = {
  profile: {
    subSteps: ['company-basic', 'company-business', 'company-scale', 'contact-info'],
    titles: ['企业基本信息', '主营业务', '企业规模', '联系人信息'],
  },
  diagnosis: {
    subSteps: ['business-status', 'market-coverage', 'channel-layout', 'team-config'],
    titles: ['业务现状', '市场覆盖', '渠道布局', '团队配置'],
  },
  product: {
    subSteps: ['product-cert', 'product-feature', 'rnd-innovation', 'production-capacity'],
    titles: ['产品认证', '产品特性', '研发创新', '生产能力'],
  },
  operation: {
    subSteps: ['digital-capability', 'marketing-capability', 'brand-building'],
    titles: ['数字化能力', '营销能力', '品牌建设'],
  },
  resource: {
    subSteps: ['funding-resource', 'expansion-plan'],
    titles: ['资金资源', '出海规划'],
  },
};

// 获取主步骤的总子步骤数
export function getSubStepCount(mainStep: string): number {
  return STEP_CONFIG[mainStep]?.subSteps.length || 1;
}

// 获取子步骤的标题
export function getSubStepTitle(mainStep: string, subStepIndex: number): string {
  return STEP_CONFIG[mainStep]?.titles[subStepIndex] || '';
}

// 获取子步骤的索引
export function getSubStepIndex(mainStep: string, subStep: string): number {
  return STEP_CONFIG[mainStep]?.subSteps.indexOf(subStep) || 0;
}
