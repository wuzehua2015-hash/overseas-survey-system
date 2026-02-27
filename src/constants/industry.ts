/**
 * 行业相关常量定义
 */

// 行业中文映射表
export const INDUSTRY_MAP: Record<string, string> = {
  'machinery': '机械设备',
  'electronics': '电子电气',
  'auto': '汽车及零部件',
  'textile': '纺织服装',
  'chemical': '化工及新材料',
  'medical': '医疗器械',
  'building': '建材五金',
  'furniture': '家具家居',
  'food': '食品饮料',
  'beauty': '美妆个护',
  'sports': '体育户外',
  'toys': '玩具礼品',
  'packaging': '包装印刷',
  'energy': '新能源',
  'other': '其他行业'
};

// 行业选项（用于表单选择）
export const INDUSTRY_OPTIONS = [
  { value: 'machinery', label: '机械设备' },
  { value: 'electronics', label: '电子电气' },
  { value: 'auto', label: '汽车及零部件' },
  { value: 'textile', label: '纺织服装' },
  { value: 'chemical', label: '化工及新材料' },
  { value: 'medical', label: '医疗器械' },
  { value: 'building', label: '建材五金' },
  { value: 'furniture', label: '家具家居' },
  { value: 'food', label: '食品饮料' },
  { value: 'beauty', label: '美妆个护' },
  { value: 'sports', label: '体育户外' },
  { value: 'toys', label: '玩具礼品' },
  { value: 'packaging', label: '包装印刷' },
  { value: 'energy', label: '新能源' },
  { value: 'other', label: '其他行业' },
];

// 行业服务推荐映射
export const INDUSTRY_SERVICE_MAP: Record<string, string[]> = {
  'machinery': ['certification_service', 'market_entry_consulting', 'trade_finance'],
  'electronics': ['certification_service', 'brand_building', 'digital_transformation'],
  'auto': ['certification_service', 'overseas_warehouse', 'trade_finance'],
  'textile': ['brand_building', 'social_media_marketing', 'platform_operation'],
  'chemical': ['certification_service', 'market_entry_consulting', 'trade_finance'],
  'medical': ['certification_service', 'market_entry_consulting', 'brand_building'],
  'building': ['certification_service', 'overseas_warehouse', 'trade_finance'],
  'furniture': ['brand_building', 'overseas_warehouse', 'platform_operation'],
  'food': ['certification_service', 'brand_building', 'overseas_warehouse'],
  'beauty': ['brand_building', 'social_media_marketing', 'platform_operation'],
  'sports': ['brand_building', 'social_media_marketing', 'platform_operation'],
  'toys': ['certification_service', 'brand_building', 'platform_operation'],
  'packaging': ['market_entry_consulting', 'trade_finance', 'platform_operation'],
  'energy': ['certification_service', 'brand_building', 'trade_finance'],
  'other': ['market_entry_consulting', 'platform_operation'],
};

// 获取行业中文名称
export function getIndustryLabel(value: string): string {
  return INDUSTRY_MAP[value] || value;
}

// 获取行业推荐服务
export function getIndustryRecommendedServices(industry: string): string[] {
  return INDUSTRY_SERVICE_MAP[industry] || [];
}
