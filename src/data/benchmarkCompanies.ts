// ============================================================
// 标杆企业数据库
// ============================================================

import type { BenchmarkCompany } from '@/types/questionnaire';

export const benchmarkCompanies: BenchmarkCompany[] = [
  // ========================================
  // 机械设备行业
  // ========================================
  {
    id: 'sany',
    name: '三一重工',
    industry: 'machinery',
    subIndustry: '建筑机械',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'mature',
    location: '湖南长沙',
    establishedYear: 1994,
    employeeRange: '20000+',
    annualRevenue: '1000亿+',
    exportMarkets: ['美国', '德国', '印度', '巴西', '印尼', '泰国', '俄罗斯'],
    exportRevenue: '400亿+',
    keyMilestones: [
      '2006年在印度普纳建立首个海外产业园',
      '2012年收购德国普茨迈斯特',
      '在美国、德国、巴西、印度建有四大研发制造基地',
      '混凝土机械全球市场份额第一'
    ],
    coreCompetency: '工程机械整机制造、智能化控制技术',
    competitiveAdvantage: '技术创新+本地化运营+服务网络',
    expansionPath: '产品出口→海外建厂→并购整合→全球运营',
    keyStrategies: [
      '"一带一路"沿线重点布局',
      '本地化研发、制造、服务三位一体',
      '数字化赋能，建设"灯塔工厂"',
      '并购整合获取技术和渠道'
    ],
    learnablePoints: [
      '通过海外并购快速获取技术和渠道',
      '建立本地化团队实现深度运营',
      '数字化提升全球协同效率',
      '服务网络建设是核心竞争力'
    ],
    applicableScenarios: ['大型制造企业', '有并购能力的企业', '技术驱动型企业']
  },
  {
    id: 'xcmg',
    name: '徐工集团',
    industry: 'machinery',
    subIndustry: '工程机械',
    companyNature: 'state',
    companyType: 'manufacturer',
    stage: 'expansion',
    location: '江苏徐州',
    establishedYear: 1989,
    employeeRange: '20000+',
    annualRevenue: '800亿+',
    exportMarkets: ['东南亚', '中东', '非洲', '南美', '欧洲', '澳洲'],
    exportRevenue: '200亿+',
    keyMilestones: [
      '在巴西、印尼、乌兹别克斯坦等建有海外基地',
      '出口覆盖190多个国家和地区',
      '起重机械全球第一'
    ],
    coreCompetency: '起重机械、土方机械、道路机械',
    competitiveAdvantage: '产品线齐全+性价比高+服务响应快',
    expansionPath: '产品出口→海外建厂→KD组装→本地化生产',
    keyStrategies: [
      '重点布局"一带一路"沿线',
      '建立区域服务中心',
      '发展当地代理商网络',
      '提供融资租赁支持'
    ],
    learnablePoints: [
      '选择重点市场深耕而非全面铺开',
      'KD组装是降低关税的有效方式',
      '金融服务是获取大客户的关键',
      '代理商培训和管理至关重要'
    ],
    applicableScenarios: ['国有企业', '产品品类丰富的企业', '资金实力较强的企业']
  },
  {
    id: 'wanshi',
    name: '山东万世机械科技',
    industry: 'machinery',
    subIndustry: '建筑机械',
    companyNature: 'private',
    companyType: 'manufacturer',
    stage: 'growth',
    location: '山东济宁',
    establishedYear: 2010,
    employeeRange: '300-500',
    annualRevenue: '5-10亿',
    exportMarkets: ['东南亚', '中东', '非洲', '南美'],
    exportRevenue: '2-3亿',
    keyMilestones: [
      '2025年省重点培育跨境电商品牌企业',
      '通过阿里巴巴国际站快速拓展海外市场',
      '建立海外服务团队'
    ],
    coreCompetency: '激光整平机、混凝土设备',
    competitiveAdvantage: '细分品类第一+性价比高+快速响应',
    expansionPath: 'B2B平台获客→建立海外仓→本地化服务',
    keyStrategies: [
      '聚焦细分品类建立专业形象',
      'B2B平台+社媒组合营销',
      '建立海外配件仓提升服务',
      '参加行业展会建立品牌'
    ],
    learnablePoints: [
      '细分品类更容易建立专业品牌',
      'B2B平台是中小企业出海的快速通道',
      '海外配件仓大幅提升客户满意度',
      '视频营销对机械设备效果显著'
    ],
    applicableScenarios: ['中小企业', '细分品类企业', 'B2B平台起步企业']
  },
  
  // ========================================
  // 电子电器行业
  // ========================================
  {
    id: 'haier',
    name: '海尔集团',
    industry: 'electronics',
    subIndustry: '消费电子',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'mature',
    location: '山东青岛',
    establishedYear: 1984,
    employeeRange: '100000+',
    annualRevenue: '3000亿+',
    exportMarkets: ['全球160+国家'],
    exportRevenue: '1000亿+',
    keyMilestones: [
      '1999年在美国南卡建立首个海外工业园',
      '2016年收购GE家电',
      '全球建立122个制造中心',
      '连续14年全球大型家电品牌零售量第一'
    ],
    coreCompetency: '智慧家庭解决方案、全球化品牌运营',
    competitiveAdvantage: '本土化研发+全球化品牌+生态化布局',
    expansionPath: '产品出口→海外建厂→品牌并购→生态构建',
    keyStrategies: [
      '"三位一体"本土化战略（研发、制造、营销）',
      '人单合一模式激发组织活力',
      '并购整合获取品牌和市场',
      '构建智慧家庭生态'
    ],
    learnablePoints: [
      '本土化是全球化成功的关键',
      '并购是快速获取品牌的有效方式',
      '组织创新支撑全球化运营',
      '从产品品牌向生态品牌升级'
    ],
    applicableScenarios: ['大型家电企业', '有并购实力的企业', '追求品牌全球化的企业']
  },
  {
    id: 'anker',
    name: '安克创新',
    industry: 'electronics',
    subIndustry: '消费电子',
    companyNature: 'listed',
    companyType: 'brand',
    stage: 'expansion',
    location: '湖南长沙',
    establishedYear: 2011,
    employeeRange: '3000+',
    annualRevenue: '140亿+',
    exportMarkets: ['北美', '欧洲', '日本', '中东'],
    exportRevenue: '140亿+',
    keyMilestones: [
      '亚马逊充电器品类第一',
      '成功打造Anker、Soundcore、Eufy、Nebula四大品牌',
      '2020年创业板上市',
      '北美、欧洲、日本市占率领先'
    ],
    coreCompetency: '充电技术、音频技术、智能家居',
    competitiveAdvantage: '产品创新+品牌运营+渠道深耕',
    expansionPath: '亚马逊精品→多品牌矩阵→全渠道布局→全球化品牌',
    keyStrategies: [
      '聚焦细分品类建立品牌认知',
      '产品创新驱动持续增长',
      '亚马逊+独立站+线下全渠道',
      '多品牌覆盖不同场景'
    ],
    learnablePoints: [
      '亚马逊是打造品牌的优质渠道',
      '产品创新是品牌溢价的基础',
      '多品牌矩阵实现规模增长',
      '独立站是品牌资产的沉淀'
    ],
    applicableScenarios: ['跨境电商企业', '消费电子品牌', '亚马逊卖家']
  },
  
  // ========================================
  // 纺织服装行业
  // ========================================
  {
    id: 'shein',
    name: 'SHEIN',
    industry: 'textile',
    subIndustry: '服装',
    companyNature: 'private',
    companyType: 'brand',
    stage: 'mature',
    location: '广东广州',
    establishedYear: 2008,
    employeeRange: '10000+',
    annualRevenue: '2000亿+',
    exportMarkets: ['全球150+国家'],
    exportRevenue: '2000亿+',
    keyMilestones: [
      '2022年全球下载量最大的购物APP',
      '快时尚领域市场份额超越ZARA',
      '建立柔性供应链体系',
      '估值一度超过1000亿美元'
    ],
    coreCompetency: '柔性供应链、数据驱动设计、极致性价比',
    competitiveAdvantage: '小单快反+数据驱动+社媒营销',
    expansionPath: '独立站起步→社媒引流→供应链整合→全球化扩张',
    keyStrategies: [
      '小单快反实现每日上新',
      '数据驱动设计和选品',
      'KOL+UGC社媒营销',
      '极致性价比获取用户'
    ],
    learnablePoints: [
      '柔性供应链是快时尚的核心竞争力',
      '数据驱动决策大幅提升效率',
      '社媒营销是获取年轻用户的关键',
      '独立站是品牌价值的沉淀'
    ],
    applicableScenarios: ['快时尚品牌', 'DTC品牌', '有供应链优势的企业']
  },
  
  // ========================================
  // 化工新材料行业
  // ========================================
  {
    id: 'wanhua',
    name: '万华化学',
    industry: 'chemical',
    subIndustry: '新材料',
    companyNature: 'state',
    companyType: 'manufacturer',
    stage: 'mature',
    location: '山东烟台',
    establishedYear: 1998,
    employeeRange: '20000+',
    annualRevenue: '1700亿+',
    exportMarkets: ['全球80+国家'],
    exportRevenue: '600亿+',
    keyMilestones: [
      'MDI产能全球第一',
      '与科威特石化6.38亿美金合资',
      '拥有CP价格推荐权',
      '在欧洲、美国、日本建有研发中心'
    ],
    coreCompetency: 'MDI制造技术、新材料研发',
    competitiveAdvantage: '技术领先+规模优势+全球化布局',
    expansionPath: '技术突破→产能扩张→全球布局→产业链整合',
    keyStrategies: [
      '持续研发投入保持技术领先',
      '通过合资获取海外资源',
      '全球化研发布局',
      '产业链上下游整合'
    ],
    learnablePoints: [
      '技术创新是化工企业的核心竞争力',
      '合资是进入高端市场的有效方式',
      '全球化研发布局支撑产品创新',
      '规模效应带来成本优势'
    ],
    applicableScenarios: ['技术型化工企业', '新材料企业', '国有企业']
  },
  
  // ========================================
  // 医疗器械行业
  // ========================================
  {
    id: 'mindray',
    name: '迈瑞医疗',
    industry: 'medical',
    subIndustry: '医疗设备',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'expansion',
    location: '广东深圳',
    establishedYear: 1991,
    employeeRange: '18000+',
    annualRevenue: '300亿+',
    exportMarkets: ['全球190+国家'],
    exportRevenue: '120亿+',
    keyMilestones: [
      '监护设备全球前三',
      '在美国、欧洲建有研发中心',
      '收购美国Datascope监护业务',
      '高端医院客户突破'
    ],
    coreCompetency: '生命信息与支持、体外诊断、医学影像',
    competitiveAdvantage: '技术创新+性价比+服务体系',
    expansionPath: '产品出口→海外研发→并购整合→高端突破',
    keyStrategies: [
      '技术创新进入高端市场',
      '并购获取技术和渠道',
      '建立海外服务中心',
      '学术推广建立品牌'
    ],
    learnablePoints: [
      '技术创新是进入高端医疗市场的关键',
      '并购是快速获取技术的有效方式',
      '学术推广比广告更有效',
      '服务体系是客户粘性的保障'
    ],
    applicableScenarios: ['医疗器械企业', '技术驱动型企业', '追求高端市场的企业']
  },
  
  // ========================================
  // 建材五金行业
  // ========================================
  {
    id: 'mingtuo',
    name: '临沂明拓进出口',
    industry: 'building',
    subIndustry: '建材',
    companyNature: 'private',
    companyType: 'trader',
    stage: 'growth',
    location: '山东临沂',
    establishedYear: 2005,
    employeeRange: '100-200',
    annualRevenue: '10亿+',
    exportMarkets: ['中东', '非洲', '东南亚', '南美'],
    exportRevenue: '10亿+',
    keyMilestones: [
      '年出口额连续破10亿元',
      '自主品牌"Consmos"在中东知名度高',
      '建立海外仓储和配送体系'
    ],
    coreCompetency: '胶合板、建筑模板供应链整合',
    competitiveAdvantage: '供应链整合+自主品牌+渠道深耕',
    expansionPath: '贸易起步→供应链整合→品牌建设→渠道深耕',
    keyStrategies: [
      '深度整合供应链确保品质和交期',
      '自主品牌提升溢价能力',
      '重点市场深耕而非全面铺开',
      '海外仓储提升服务体验'
    ],
    learnablePoints: [
      '供应链整合是贸易企业的核心竞争力',
      '自主品牌是摆脱价格战的关键',
      '重点市场深耕比全面铺开更有效',
      '海外仓储大幅提升客户满意度'
    ],
    applicableScenarios: ['贸易型企业', '建材企业', '追求品牌化转型的企业']
  },
  
  // ========================================
  // 新能源行业
  // ========================================
  {
    id: 'longi',
    name: '隆基绿能',
    industry: 'energy',
    subIndustry: '光伏',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'mature',
    location: '陕西西安',
    establishedYear: 2000,
    employeeRange: '60000+',
    annualRevenue: '1200亿+',
    exportMarkets: ['欧洲', '亚太', '中东', '南美', '非洲'],
    exportRevenue: '600亿+',
    keyMilestones: [
      '单晶硅片全球市占率第一',
      '在马来西亚、越南建有生产基地',
      '组件出货量全球领先',
      '打破多项电池效率世界纪录'
    ],
    coreCompetency: '单晶硅技术、电池效率',
    competitiveAdvantage: '技术领先+成本优势+全球化产能',
    expansionPath: '技术突破→产能扩张→海外建厂→全球化运营',
    keyStrategies: [
      '持续技术创新保持领先',
      '海外建厂规避贸易壁垒',
      '全球化供应链布局',
      '大型项目EPC能力'
    ],
    learnablePoints: [
      '技术创新是光伏企业的核心竞争力',
      '海外建厂是规避贸易壁垒的有效方式',
      '全球化供应链布局降低风险',
      '大型项目能力是差异化优势'
    ],
    applicableScenarios: ['新能源企业', '光伏企业', '技术驱动型企业']
  },
  
  // ========================================
  // 家具家居行业
  // ========================================
  {
    id: 'manwah',
    name: '敏华控股',
    industry: 'furniture',
    subIndustry: '民用家具',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'expansion',
    location: '广东惠州',
    establishedYear: 1992,
    employeeRange: '30000+',
    annualRevenue: '200亿+',
    exportMarkets: ['北美', '欧洲', '亚太'],
    exportRevenue: '80亿+',
    keyMilestones: [
      '功能沙发全球销量第一',
      'Cheers品牌知名度高',
      '在越南、墨西哥建有生产基地',
      '成功进入Costco等主流渠道'
    ],
    coreCompetency: '功能沙发设计制造',
    competitiveAdvantage: '品牌+渠道+供应链',
    expansionPath: 'OEM起步→自主品牌→渠道建设→全球化布局',
    keyStrategies: [
      '从OEM向自主品牌转型',
      '进入主流零售渠道',
      '海外建厂规避关税',
      '品牌营销提升溢价'
    ],
    learnablePoints: [
      '自主品牌是摆脱代工的关键',
      '进入主流渠道是品牌建设的捷径',
      '海外建厂应对贸易壁垒',
      '功能创新是差异化竞争的核心'
    ],
    applicableScenarios: ['家具企业', 'OEM转型企业', '追求品牌化的企业']
  },
  
  // ========================================
  // 汽车零部件行业
  // ========================================
  {
    id: 'catl',
    name: '宁德时代',
    industry: 'auto',
    subIndustry: '新能源汽车',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'mature',
    location: '福建宁德',
    establishedYear: 2011,
    employeeRange: '100000+',
    annualRevenue: '3000亿+',
    exportMarkets: ['欧洲', '北美', '亚太'],
    exportRevenue: '1000亿+',
    keyMilestones: [
      '动力电池全球市占率第一',
      '在德国、匈牙利建有工厂',
      '与宝马、奔驰、特斯拉等顶级车企合作',
      '技术路线引领行业发展'
    ],
    coreCompetency: '动力电池技术、规模化制造',
    competitiveAdvantage: '技术领先+规模优势+客户资源',
    expansionPath: '技术突破→客户绑定→产能扩张→全球化布局',
    keyStrategies: [
      '技术创新保持领先',
      '绑定顶级车企客户',
      '海外建厂贴近客户',
      '产业链上下游整合'
    ],
    learnablePoints: [
      '技术创新是进入高端供应链的关键',
      '绑定头部客户是快速增长的捷径',
      '海外建厂是服务全球客户的必需',
      '产业链整合提升竞争力'
    ],
    applicableScenarios: ['汽车零部件企业', '新能源企业', '技术驱动型企业']
  },
  
  // ========================================
  // 食品行业
  // ========================================
  {
    id: 'yihai',
    name: '颐海国际',
    industry: 'food',
    subIndustry: '调味品',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'growth',
    location: '四川成都',
    establishedYear: 2013,
    employeeRange: '3000+',
    annualRevenue: '60亿+',
    exportMarkets: ['东南亚', '北美', '欧洲', '澳洲'],
    exportRevenue: '5亿+',
    keyMilestones: [
      '海底捞火锅底料供应商',
      '成功打造"筷手小厨"品牌',
      '复合调味料市场领先',
      '海外华人市场占有率高'
    ],
    coreCompetency: '火锅底料、中式复合调味料',
    competitiveAdvantage: '产品力+渠道力+品牌力',
    expansionPath: 'B端供应→C端品牌→品类扩张→出海',
    keyStrategies: [
      '依托海底捞品牌背书',
      '产品标准化实现规模化',
      '华人市场作为出海起点',
      '本地化口味调整'
    ],
    learnablePoints: [
      'B端经验为C端品牌奠定基础',
      '华人市场是食品出海的天然起点',
      '产品标准化是规模化的前提',
      '口味本地化是进入主流市场的关键'
    ],
    applicableScenarios: ['食品企业', '调味品企业', '有B端基础的企业']
  },
  
  // ========================================
  // 美妆个护行业
  // ========================================
  {
    id: 'proya',
    name: '珀莱雅',
    industry: 'beauty',
    subIndustry: '护肤品',
    companyNature: 'listed',
    companyType: 'brand',
    stage: 'growth',
    location: '浙江杭州',
    establishedYear: 2003,
    employeeRange: '3000+',
    annualRevenue: '60亿+',
    exportMarkets: ['东南亚', '中东'],
    exportRevenue: '2亿+',
    keyMilestones: [
      '国货美妆头部品牌',
      '成功打造多个爆款单品',
      '线上运营能力行业领先',
      '开始布局东南亚市场'
    ],
    coreCompetency: '产品研发、品牌营销、渠道运营',
    competitiveAdvantage: '爆品打造+社媒营销+渠道覆盖',
    expansionPath: '线下起步→线上爆发→品牌升级→出海',
    keyStrategies: [
      '大单品策略建立品牌认知',
      '社媒营销获取年轻用户',
      '全渠道覆盖提升渗透率',
      '东南亚作为出海首站'
    ],
    learnablePoints: [
      '大单品策略是品牌建立的捷径',
      '社媒营销是美妆品牌的必修课',
      '东南亚是美妆出海的优质市场',
      '本地化研发是长期发展的基础'
    ],
    applicableScenarios: ['美妆企业', '消费品品牌', 'DTC品牌']
  },
  
  // ========================================
  // 体育户外行业
  // ========================================
  {
    id: 'yettel',
    name: '浙江野特户外',
    industry: 'sports',
    subIndustry: '户外装备',
    companyNature: 'private',
    companyType: 'manufacturer',
    stage: 'growth',
    location: '浙江杭州',
    establishedYear: 2010,
    employeeRange: '200-300',
    annualRevenue: '3-5亿',
    exportMarkets: ['北美', '欧洲', '日本'],
    exportRevenue: '2-3亿',
    keyMilestones: [
      '露营装备细分领域领先',
      '通过亚马逊和独立站出海',
      '建立海外品牌"Naturehike"',
      '在日韩市场知名度高'
    ],
    coreCompetency: '露营装备设计制造',
    competitiveAdvantage: '性价比+设计+品质',
    expansionPath: '代工起步→自主品牌→跨境电商→全球化',
    keyStrategies: [
      '从代工积累制造能力',
      '自主品牌提升溢价',
      '跨境电商快速出海',
      '社交媒体种草营销'
    ],
    learnablePoints: [
      '代工是积累能力的有效方式',
      '跨境电商是品牌出海的快速通道',
      '社交媒体对户外品类效果显著',
      '性价比是进入市场的有效策略'
    ],
    applicableScenarios: ['户外用品企业', '跨境电商企业', '代工转型企业']
  },

  // ========================================
  // 医疗器械行业
  // ========================================
  {
    id: 'mindray',
    name: '迈瑞医疗',
    industry: 'medical',
    subIndustry: '医疗设备',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'mature',
    location: '广东深圳',
    establishedYear: 1991,
    employeeRange: '10000+',
    annualRevenue: '367亿',
    exportMarkets: ['北美', '欧洲', '拉美', '亚太', '中东', '非洲'],
    exportRevenue: '164亿',
    keyMilestones: [
      '2024年海外收入占比超50%',
      '在北美、欧洲等高端市场实现突破',
      '生命信息与支持领域全球前三',
      '体外诊断领域全球前五'
    ],
    coreCompetency: '生命信息与支持、体外诊断、医学影像',
    competitiveAdvantage: '技术创新+产品齐全+服务网络',
    expansionPath: '产品出口→本地化服务→高端市场突破→全球领先',
    keyStrategies: [
      '持续高研发投入（营收10%+）',
      '建立海外研发中心和服务网络',
      '高端人才引进和本地化团队',
      '并购整合获取技术和渠道'
    ],
    learnablePoints: [
      '高研发投入是医疗器械核心竞争力',
      '本地化服务网络是进入市场的关键',
      '高端市场需要长期投入和耐心',
      '并购是快速获取技术的有效方式'
    ],
    applicableScenarios: ['医疗器械企业', '高技术制造企业', '研发驱动型企业']
  },
  {
    id: 'unitedimaging',
    name: '联影医疗',
    industry: 'medical',
    subIndustry: '医学影像',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'expansion',
    location: '上海',
    establishedYear: 2011,
    employeeRange: '5000+',
    annualRevenue: '103亿',
    exportMarkets: ['美国', '欧洲', '日本', '东南亚', '中东'],
    exportRevenue: '16亿',
    keyMilestones: [
      '2024年海外收入增长55%',
      'PET/CT等高端设备进入美日欧市场',
      '在美国建立研发中心和生产基地',
      '超高端CT、MR实现国产替代'
    ],
    coreCompetency: '医学影像设备（CT、MR、PET/CT等）',
    competitiveAdvantage: '技术创新+高端突破+产学研结合',
    expansionPath: '国内市场领先→高端设备突破→海外市场拓展→全球竞争',
    keyStrategies: [
      '聚焦高端设备突破',
      '产学研深度合作',
      '海外建立研发和服务体系',
      '参与国际标准制定'
    ],
    learnablePoints: [
      '高端市场需要技术突破作为基础',
      '产学研结合加速技术创新',
      '参与国际标准提升话语权',
      '海外建厂规避贸易壁垒'
    ],
    applicableScenarios: ['高端制造企业', '技术驱动型企业', '研发密集型行业']
  },
  {
    id: 'yuwell',
    name: '鱼跃医疗',
    industry: 'medical',
    subIndustry: '家用医疗器械',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'expansion',
    location: '江苏丹阳',
    establishedYear: 1998,
    employeeRange: '5000+',
    annualRevenue: '80亿',
    exportMarkets: ['东南亚', '欧洲', '拉美', '中东', '非洲'],
    exportRevenue: '15亿',
    keyMilestones: [
      '制氧机、血压计等家用医械龙头',
      '通过并购整合扩大产品线',
      '跨境电商渠道快速出海',
      '在东南亚市场占有率领先'
    ],
    coreCompetency: '家用医疗器械（制氧机、血压计、血糖仪等）',
    competitiveAdvantage: '产品齐全+渠道覆盖+性价比',
    expansionPath: '国内市场深耕→产品线扩展→渠道出海→品牌出海',
    keyStrategies: [
      '并购整合快速扩展产品线',
      '线上线下全渠道覆盖',
      '跨境电商快速进入新兴市场',
      '性价比策略打开市场'
    ],
    learnablePoints: [
      '并购是快速扩展产品线的有效方式',
      '全渠道覆盖提升市场占有率',
      '跨境电商是新兴市场的快速通道',
      '性价比是进入市场的有效策略'
    ],
    applicableScenarios: ['消费品医械企业', '渠道驱动型企业', '多品类企业']
  },

  // ========================================
  // 纺织服装行业
  // ========================================
  {
    id: 'shenzhou',
    name: '申洲国际',
    industry: 'textile',
    subIndustry: '针织服装',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'mature',
    location: '浙江宁波',
    establishedYear: 1988,
    employeeRange: '90000+',
    annualRevenue: '260亿',
    exportMarkets: ['全球'],
    exportRevenue: '260亿',
    keyMilestones: [
      '全球最大的纵向一体化针织制造商',
      '为Nike、Adidas、优衣库等国际品牌代工',
      '在越南、柬埔寨建有大型生产基地',
      '垂直一体化模式行业标杆'
    ],
    coreCompetency: '纵向一体化针织服装制造',
    competitiveAdvantage: '垂直整合+规模效应+快速反应',
    expansionPath: '国内代工→国际大客户→海外建厂→垂直整合',
    keyStrategies: [
      '垂直一体化降低成本提升效率',
      '绑定国际大客户获取稳定订单',
      '海外建厂规避贸易壁垒',
      '持续投入自动化和数字化'
    ],
    learnablePoints: [
      '垂直整合是制造业降本增效的关键',
      '绑定大客户获取稳定订单和现金流',
      '海外产能布局规避贸易风险',
      '自动化是应对成本上升的有效方式'
    ],
    applicableScenarios: ['服装制造企业', '代工企业', '劳动密集型企业']
  },
  {
    id: 'huaxi',
    name: '华利集团',
    industry: 'textile',
    subIndustry: '鞋类制造',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'expansion',
    location: '广东中山',
    establishedYear: 2004,
    employeeRange: '100000+',
    annualRevenue: '200亿',
    exportMarkets: ['全球'],
    exportRevenue: '200亿',
    keyMilestones: [
      '全球第二大运动鞋制造商',
      '为Nike、Converse、Vans等品牌代工',
      '在越南建有大型生产基地',
      '年产能超2亿双'
    ],
    coreCompetency: '运动鞋设计制造',
    competitiveAdvantage: '规模效应+快速交付+成本控制',
    expansionPath: '国内生产→海外建厂→大客户绑定→全球供应',
    keyStrategies: [
      '大客户战略获取规模效应',
      '海外建厂规避关税和成本上升',
      '持续投入自动化提升效率',
      '快速交付能力满足快时尚需求'
    ],
    learnablePoints: [
      '大客户战略带来规模效应和稳定性',
      '海外产能布局是应对成本上升的必要选择',
      '自动化投入是长期竞争力的基础',
      '快速交付是快时尚时代的核心竞争力'
    ],
    applicableScenarios: ['鞋类制造企业', '代工企业', '劳动密集型企业']
  },
  {
    id: 'furatex',
    name: '孚日股份',
    industry: 'textile',
    subIndustry: '家纺',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'expansion',
    location: '山东潍坊',
    establishedYear: 1987,
    employeeRange: '5000+',
    annualRevenue: '53亿',
    exportMarkets: ['日本', '美国', '欧洲', '澳洲'],
    exportRevenue: '38亿',
    keyMilestones: [
      '全球最大的毛巾生产企业',
      '出口额连续20年行业第一',
      '日本市场占有率超50%',
      '从代工向自主品牌转型'
    ],
    coreCompetency: '毛巾、家纺产品设计制造',
    competitiveAdvantage: '规模优势+品质稳定+客户粘性',
    expansionPath: '国内生产→出口代工→大客户绑定→自主品牌',
    keyStrategies: [
      '规模优势降低成本',
      '品质稳定建立客户信任',
      '大客户长期合作建立粘性',
      '自主品牌提升溢价'
    ],
    learnablePoints: [
      '规模优势是制造业的核心竞争力',
      '品质稳定是获取大客户的基础',
      '长期合作建立客户粘性',
      '自主品牌是提升利润率的必由之路'
    ],
    applicableScenarios: ['家纺企业', '代工企业', '传统制造业']
  },

  // ========================================
  // 新能源行业
  // ========================================
  {
    id: 'longi',
    name: '隆基绿能',
    industry: 'energy',
    subIndustry: '光伏组件',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'mature',
    location: '陕西西安',
    establishedYear: 2000,
    employeeRange: '50000+',
    annualRevenue: '825亿',
    exportMarkets: ['欧洲', '亚太', '中东', '拉美', '非洲'],
    exportRevenue: '385亿',
    keyMilestones: [
      '全球最大的光伏组件制造商',
      '单晶硅片技术引领行业',
      '在海外多国建立生产基地',
      '组件出货量连续多年全球第一'
    ],
    coreCompetency: '单晶硅片、光伏组件、光伏电站',
    competitiveAdvantage: '技术领先+规模效应+全球化布局',
    expansionPath: '国内领先→技术突破→全球扩张→海外建厂',
    keyStrategies: [
      '持续技术创新保持领先',
      '垂直整合降低成本',
      '全球化产能布局',
      '品牌建设和渠道拓展'
    ],
    learnablePoints: [
      '技术创新是光伏行业的核心竞争力',
      '垂直整合是降本增效的有效方式',
      '全球化产能布局规避贸易风险',
      '品牌建设提升溢价能力'
    ],
    applicableScenarios: ['光伏企业', '新能源企业', '技术驱动型企业']
  },
  {
    id: 'jinko',
    name: '晶科能源',
    industry: 'energy',
    subIndustry: '光伏组件',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'mature',
    location: '江西上饶',
    establishedYear: 2006,
    employeeRange: '30000+',
    annualRevenue: '1000亿+',
    exportMarkets: ['全球160+国家'],
    exportRevenue: '700亿+',
    keyMilestones: [
      '全球光伏组件出货量领先',
      '海外营收占比超70%',
      '在东南亚、美国建有生产基地',
      'N型TOPCon技术行业领先'
    ],
    coreCompetency: '光伏组件、电池片、硅片',
    competitiveAdvantage: '全球化布局+技术创新+成本优势',
    expansionPath: '国内生产→出口扩张→海外建厂→全球运营',
    keyStrategies: [
      '全球化产能布局规避贸易壁垒',
      '持续技术创新保持竞争力',
      '大客户战略获取稳定订单',
      '本地化运营提升服务'
    ],
    learnablePoints: [
      '全球化产能布局是应对贸易壁垒的关键',
      '技术创新是保持竞争力的基础',
      '大客户战略带来稳定订单',
      '本地化运营提升客户满意度'
    ],
    applicableScenarios: ['光伏企业', '新能源企业', '全球化企业']
  },
  {
    id: 'catl',
    name: '宁德时代',
    industry: 'energy',
    subIndustry: '动力电池',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'mature',
    location: '福建宁德',
    establishedYear: 2011,
    employeeRange: '100000+',
    annualRevenue: '4000亿+',
    exportMarkets: ['欧洲', '北美', '亚太'],
    exportRevenue: '1000亿+',
    keyMilestones: [
      '全球动力电池市场占有率第一',
      '为特斯拉、宝马、奔驰等供货',
      '在德国、匈牙利建有工厂',
      '技术路线覆盖三元锂、磷酸铁锂、钠离子等'
    ],
    coreCompetency: '动力电池、储能电池',
    competitiveAdvantage: '技术领先+规模优势+客户资源',
    expansionPath: '国内市场领先→技术突破→大客户绑定→全球扩张',
    keyStrategies: [
      '持续高研发投入保持技术领先',
      '绑定国际车企大客户',
      '海外建厂贴近客户需求',
      '垂直整合降低成本'
    ],
    learnablePoints: [
      '技术领先是获取大客户的基础',
      '绑定国际大客户提升品牌和技术',
      '海外建厂贴近客户是必要选择',
      '垂直整合是降本增效的有效方式'
    ],
    applicableScenarios: ['动力电池企业', '新能源企业', '技术驱动型企业']
  },

  // ========================================
  // 电子电气行业
  // ========================================
  {
    id: 'luxshare',
    name: '立讯精密',
    industry: 'electronics',
    subIndustry: '消费电子代工',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'mature',
    location: '广东东莞',
    establishedYear: 2004,
    employeeRange: '200000+',
    annualRevenue: '2600亿+',
    exportMarkets: ['全球'],
    exportRevenue: '2000亿+',
    keyMilestones: [
      '全球领先的消费电子精密制造龙头',
      '苹果核心供应商，AirPods主力供应商',
      '通过并购莱尼拓展汽车电子',
      '从代工向模组、整机延伸'
    ],
    coreCompetency: '消费电子精密制造、连接器、声学',
    competitiveAdvantage: '精密制造+大客户绑定+垂直整合',
    expansionPath: '连接器起步→大客户绑定→产品线扩展→汽车电子',
    keyStrategies: [
      '大客户战略获取规模效应',
      '垂直整合提升附加值',
      '并购整合快速扩展',
      '向汽车电子等新兴领域拓展'
    ],
    learnablePoints: [
      '大客户战略是代工企业成功的关键',
      '垂直整合是提升附加值的有效方式',
      '并购是快速扩展产品线的手段',
      '向新兴领域拓展寻找第二曲线'
    ],
    applicableScenarios: ['电子代工企业', '精密制造企业', '消费电子企业']
  },
  {
    id: 'goertek',
    name: '歌尔股份',
    industry: 'electronics',
    subIndustry: '声学器件',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'expansion',
    location: '山东潍坊',
    establishedYear: 2001,
    employeeRange: '80000+',
    annualRevenue: '1000亿+',
    exportMarkets: ['全球'],
    exportRevenue: '800亿+',
    keyMilestones: [
      '全球领先的声学器件制造商',
      '苹果AirPods、Meta VR设备供应商',
      'VR/AR领域全球领先',
      '从声学向光学、微电子扩展'
    ],
    coreCompetency: '声学器件、VR/AR设备、精密制造',
    competitiveAdvantage: '技术领先+大客户绑定+产品线扩展',
    expansionPath: '声学器件→大客户绑定→VR/AR→多元化',
    keyStrategies: [
      '技术领先建立护城河',
      '大客户战略获取稳定订单',
      '布局VR/AR等新兴领域',
      '产品线多元化降低风险'
    ],
    learnablePoints: [
      '技术领先是建立护城河的基础',
      '大客户战略带来稳定性',
      '布局新兴领域寻找增长点',
      '多元化降低单一客户风险'
    ],
    applicableScenarios: ['电子制造企业', '声学器件企业', '新兴科技企业']
  },
  {
    id: 'bydelectronics',
    name: '比亚迪电子',
    industry: 'electronics',
    subIndustry: '手机代工',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'expansion',
    location: '广东深圳',
    establishedYear: 1995,
    employeeRange: '100000+',
    annualRevenue: '1300亿+',
    exportMarkets: ['全球'],
    exportRevenue: '800亿+',
    keyMilestones: [
      '全球领先的手机代工企业',
      '为苹果、三星、华为等代工',
      '从手机向汽车电子、AIoT扩展',
      '垂直整合能力强'
    ],
    coreCompetency: '手机代工、汽车电子、AIoT',
    competitiveAdvantage: '垂直整合+规模效应+技术积累',
    expansionPath: '手机代工→产品线扩展→汽车电子→多元化',
    keyStrategies: [
      '垂直整合降低成本提升效率',
      '大客户战略获取规模效应',
      '向汽车电子等新兴领域拓展',
      '技术创新保持竞争力'
    ],
    learnablePoints: [
      '垂直整合是制造业的核心竞争力',
      '大客户战略带来规模效应',
      '向新兴领域拓展寻找增长点',
      '技术创新是长期竞争力的基础'
    ],
    applicableScenarios: ['电子代工企业', '汽车电子企业', '多元化企业']
  },

  // ========================================
  // 建材五金行业
  // ========================================
  {
    id: 'cnBM',
    name: '中国建材',
    industry: 'building',
    subIndustry: '水泥建材',
    companyNature: 'state',
    companyType: 'manufacturer',
    stage: 'mature',
    location: '北京',
    establishedYear: 1984,
    employeeRange: '100000+',
    annualRevenue: '2000亿+',
    exportMarkets: ['东南亚', '非洲', '中东', '南美'],
    exportRevenue: '200亿+',
    keyMilestones: [
      '全球最大的水泥技术装备工程服务商',
      '在海外承建300+条水泥生产线',
      '中材国际是全球水泥工程市场龙头',
      '技术和装备出口全球'
    ],
    coreCompetency: '水泥技术装备、工程服务',
    competitiveAdvantage: '技术领先+工程经验+全球网络',
    expansionPath: '国内工程→技术出口→海外工程→全球服务',
    keyStrategies: [
      '技术领先是获取海外订单的基础',
      '工程经验丰富建立信任',
      '全球服务网络提升响应速度',
      '本地化运营提升竞争力'
    ],
    learnablePoints: [
      '技术领先是工程服务企业的核心竞争力',
      '丰富的项目经验是获取订单的关键',
      '全球服务网络提升客户满意度',
      '本地化运营是长期发展的基础'
    ],
    applicableScenarios: ['建材企业', '工程服务企业', '国有企业']
  },
  {
    id: 'oriental',
    name: '东方雨虹',
    industry: 'building',
    subIndustry: '防水材料',
    companyNature: 'listed',
    companyType: 'manufacturer',
    stage: 'expansion',
    location: '北京',
    establishedYear: 1995,
    employeeRange: '10000+',
    annualRevenue: '300亿+',
    exportMarkets: ['东南亚', '中东', '非洲', '南美'],
    exportRevenue: '20亿+',
    keyMilestones: [
      '国内防水材料行业龙头',
      '在东南亚、中东建立生产基地',
      '产品出口100+国家',
      '从材料向施工服务延伸'
    ],
    coreCompetency: '防水材料、防水工程',
    competitiveAdvantage: '品牌优势+渠道覆盖+技术服务',
    expansionPath: '国内市场领先→产品线扩展→渠道出海→海外建厂',
    keyStrategies: [
      '品牌优势建立客户信任',
      '渠道覆盖提升市场占有率',
      '技术服务提升客户粘性',
      '海外建厂贴近市场'
    ],
    learnablePoints: [
      '品牌优势是获取客户信任的基础',
      '渠道覆盖是提升市占率的关键',
      '技术服务提升客户粘性',
      '海外建厂是长期发展的选择'
    ],
    applicableScenarios: ['建材企业', '消费品建材企业', '品牌驱动型企业']
  },
  {
    id: 'cnbmintl',
    name: '中材国际',
    industry: 'building',
    subIndustry: '水泥工程',
    companyNature: 'state',
    companyType: 'manufacturer',
    stage: 'mature',
    location: '北京',
    establishedYear: 2001,
    employeeRange: '10000+',
    annualRevenue: '400亿+',
    exportMarkets: ['全球'],
    exportRevenue: '300亿+',
    keyMilestones: [
      '全球最大的水泥技术装备工程系统集成服务商',
      '海外水泥工程市场占有率第一',
      '在全球承建300+条水泥生产线',
      '技术和装备出口到70+国家'
    ],
    coreCompetency: '水泥工程总承包、技术装备',
    competitiveAdvantage: '技术领先+工程经验+全球网络',
    expansionPath: '国内工程→技术出口→海外工程→全球服务',
    keyStrategies: [
      '技术领先获取高端订单',
      '丰富经验建立客户信任',
      '全球网络提升服务能力',
      '本地化运营提升竞争力'
    ],
    learnablePoints: [
      '技术领先是工程服务企业的核心竞争力',
      '项目经验是获取订单的关键',
      '全球服务网络提升响应速度',
      '本地化是长期发展的基础'
    ],
    applicableScenarios: ['工程服务企业', '技术输出企业', '国有企业']
  },

  // ========================================
  // 专精特新中小企业（贸促会推荐案例）
  // ========================================
  {
    id: 'dawei',
    name: '戴维医疗',
    industry: 'medical',
    subIndustry: '儿产科保育设备',
    companyNature: 'private',
    companyType: 'manufacturer',
    stage: 'growth',
    location: '浙江宁波',
    establishedYear: 1992,
    employeeRange: '500-1000',
    annualRevenue: '5-10亿',
    exportMarkets: ['欧洲', '东南亚', '中东', '拉美'],
    exportRevenue: '1-2亿',
    keyMilestones: [
      '国家级专精特新"小巨人"企业',
      '国内首家获取欧盟MDR认证证书的儿产科设备制造商',
      '产品出口100+国家和地区',
      '婴儿培养箱市场占有率国内领先'
    ],
    coreCompetency: '儿产科保育设备研发制造',
    competitiveAdvantage: '技术专精+认证齐全+性价比高',
    expansionPath: '国内市场深耕→技术突破→认证获取→海外拓展',
    keyStrategies: [
      '专注细分领域建立技术壁垒',
      '获取国际认证打开高端市场',
      '性价比策略进入新兴市场',
      '贸促会等平台获取出海资源'
    ],
    learnablePoints: [
      '专精特新是中小企业出海的优质路径',
      '国际认证是进入高端市场的敲门砖',
      '细分领域专注建立技术壁垒',
      '贸促会等平台提供出海支持'
    ],
    applicableScenarios: ['专精特新企业', '医疗器械中小企业', '技术驱动型企业']
  },
  {
    id: 'davidneedle',
    name: '山东万世机械',
    industry: 'machinery',
    subIndustry: '建筑机械',
    companyNature: 'private',
    companyType: 'manufacturer',
    stage: 'growth',
    location: '山东济宁',
    establishedYear: 2010,
    employeeRange: '300-500',
    annualRevenue: '5-10亿',
    exportMarkets: ['东南亚', '中东', '非洲', '南美'],
    exportRevenue: '2-3亿',
    keyMilestones: [
      '2025年省重点培育跨境电商品牌企业',
      '通过阿里巴巴国际站快速拓展海外市场',
      '激光整平机细分领域国内龙头',
      '产品出口50+国家'
    ],
    coreCompetency: '激光整平机等建筑机械研发制造',
    competitiveAdvantage: '技术专精+跨境电商+快速响应',
    expansionPath: '国内细分市场领先→跨境电商出海→品牌建立→海外服务',
    keyStrategies: [
      '专注细分领域建立技术优势',
      '跨境电商快速触达海外客户',
      '快速响应客户需求建立口碑',
      '贸促会等平台获取出海资源'
    ],
    learnablePoints: [
      '跨境电商是中小企业出海的快速通道',
      '细分领域专注建立技术壁垒',
      '快速响应是获取客户的关键',
      '贸促会等平台提供出海支持'
    ],
    applicableScenarios: ['机械制造企业', '跨境电商企业', '专精特新企业']
  },
  {
    id: 'danyangoptical',
    name: '丹阳眼镜产业集群代表企业',
    industry: 'textile',
    subIndustry: '眼镜制造',
    companyNature: 'private',
    companyType: 'manufacturer',
    stage: 'growth',
    location: '江苏丹阳',
    establishedYear: 2005,
    employeeRange: '100-300',
    annualRevenue: '1-5亿',
    exportMarkets: ['欧美', '东南亚', '中东'],
    exportRevenue: '5000万-1亿',
    keyMilestones: [
      '丹阳眼镜产业基地代表企业',
      '2023年前三季度出口35亿元，同比增长6.94%',
      '从代工向自主品牌转型',
      '通过跨境电商拓展海外市场'
    ],
    coreCompetency: '眼镜设计制造',
    competitiveAdvantage: '产业集群+性价比+快速交付',
    expansionPath: '代工起步→产业集群→跨境电商→品牌转型',
    keyStrategies: [
      '依托产业集群降低成本',
      '跨境电商快速出海',
      '从代工向品牌转型提升溢价',
      '贸促会等平台获取出海资源'
    ],
    learnablePoints: [
      '产业集群是中小企业的重要优势',
      '跨境电商是快速出海的有效方式',
      '品牌转型是提升利润率的必由之路',
      '贸促会等平台提供出海支持'
    ],
    applicableScenarios: ['产业集群企业', '眼镜制造企业', '代工转型企业']
  },
  {
    id: 'guangrun',
    name: '光润通科技',
    industry: 'electronics',
    subIndustry: '光通信器件',
    companyNature: 'private',
    companyType: 'manufacturer',
    stage: 'growth',
    location: '北京',
    establishedYear: 2009,
    employeeRange: '100-300',
    annualRevenue: '1-5亿',
    exportMarkets: ['欧美', '东南亚'],
    exportRevenue: '3000万-5000万',
    keyMilestones: [
      '北京市专精特新企业',
      '光通信器件细分领域领先',
      '产品出口30+国家',
      '通过"京品出海"拓展海外市场'
    ],
    coreCompetency: '光通信器件研发制造',
    competitiveAdvantage: '技术专精+产品可靠+服务响应快',
    expansionPath: '国内市场→技术积累→认证获取→海外拓展',
    keyStrategies: [
      '技术专精建立竞争壁垒',
      '产品可靠性建立客户信任',
      '快速响应提升客户满意度',
      '贸促会等平台获取出海资源'
    ],
    learnablePoints: [
      '技术专精是中小企业核心竞争力',
      '产品可靠性是获取客户的基础',
      '快速响应是差异化竞争手段',
      '贸促会等平台提供出海支持'
    ],
    applicableScenarios: ['专精特新企业', '光通信企业', '技术驱动型企业']
  },
  {
    id: 'yettel',
    name: '浙江野特户外',
    industry: 'sports',
    subIndustry: '户外装备',
    companyNature: 'private',
    companyType: 'manufacturer',
    stage: 'growth',
    location: '浙江杭州',
    establishedYear: 2010,
    employeeRange: '200-300',
    annualRevenue: '3-5亿',
    exportMarkets: ['北美', '欧洲', '日本'],
    exportRevenue: '2-3亿',
    keyMilestones: [
      '露营装备细分领域领先',
      '通过亚马逊和独立站出海',
      '建立海外品牌"Naturehike"',
      '在日韩市场知名度高'
    ],
    coreCompetency: '露营装备设计制造',
    competitiveAdvantage: '性价比+设计+品质',
    expansionPath: '代工起步→自主品牌→跨境电商→全球化',
    keyStrategies: [
      '从代工积累制造能力',
      '自主品牌提升溢价',
      '跨境电商快速出海',
      '社交媒体种草营销'
    ],
    learnablePoints: [
      '代工是积累能力的有效方式',
      '跨境电商是品牌出海的快速通道',
      '社交媒体对户外品类效果显著',
      '性价比是进入市场的有效策略'
    ],
    applicableScenarios: ['户外用品企业', '跨境电商企业', '代工转型企业']
  }
];

// 根据条件筛选对标企业
export function findBenchmarkCompanies(
  industry: string,
  companyNature: string,
  companyType: string,
  stage: string,
  limit: number = 3
): BenchmarkCompany[] {
  let matches = [...benchmarkCompanies];
  
  // 按行业筛选（最严格）
  if (industry) {
    const industryMatches = matches.filter(c => c.industry === industry);
    if (industryMatches.length >= limit) {
      matches = industryMatches;
    }
  }
  
  // 按企业性质筛选
  if (companyNature) {
    const natureMatches = matches.filter(c => c.companyNature === companyNature);
    if (natureMatches.length >= 2) {
      matches = natureMatches;
    }
  }
  
  // 按企业类型筛选
  if (companyType) {
    const typeMatches = matches.filter(c => c.companyType === companyType);
    if (typeMatches.length >= 2) {
      matches = typeMatches;
    }
  }
  
  // 按阶段筛选（选择相近阶段）
  if (stage) {
    const stageOrder = ['preparation', 'exploration', 'growth', 'expansion', 'mature'];
    const currentIndex = stageOrder.indexOf(stage);
    const stageMatches = matches.filter(c => {
      const cIndex = stageOrder.indexOf(c.stage);
      return Math.abs(cIndex - currentIndex) <= 1;
    });
    if (stageMatches.length >= 2) {
      matches = stageMatches;
    }
  }
  
  // 返回前limit个
  return matches.slice(0, limit);
}
