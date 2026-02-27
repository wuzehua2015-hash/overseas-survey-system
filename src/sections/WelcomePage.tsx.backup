import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Globe, 
  ClipboardCheck, 
  TrendingUp, 
  ArrowRight, 
  Target,
  BarChart3,
  Lightbulb,
  Shield
} from 'lucide-react';
import type { QuestionnaireStep } from '@/types/questionnaire';

interface WelcomePageProps {
  onStart: (step: QuestionnaireStep) => void;
  savedProgress: number;
  onContinue: () => void;
}

export function WelcomePage({ onStart, savedProgress, onContinue }: WelcomePageProps) {
  const features = [
    {
      icon: <ClipboardCheck className="w-10 h-10 text-blue-600" />,
      title: '五维成熟度评估',
      description: '基于基础能力、产品竞争力、运营能力、资源配置、发展潜力五大维度，全方位量化评估企业出海准备度',
    },
    {
      icon: <Target className="w-10 h-10 text-emerald-600" />,
      title: '精准标杆对标',
      description: '匹配同行业、同性质、同阶段的成功案例，深度解析可复制的出海路径与关键策略',
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-violet-600" />,
      title: '数据驱动洞察',
      description: 'SWOT战略分析、雷达图可视化、关键发现提炼，为决策提供科学依据',
    },
    {
      icon: <Lightbulb className="w-10 h-10 text-amber-600" />,
      title: '定制化服务方案',
      description: '根据企业阶段与痛点，推荐精准服务组合，制定分阶段行动计划与投资规划',
    },
    {
      icon: <Globe className="w-10 h-10 text-cyan-600" />,
      title: '目标市场推荐',
      description: '结合行业特性、产品定位、企业规模，智能推荐高匹配度的海外目标市场',
    },
    {
      icon: <Shield className="w-10 h-10 text-rose-600" />,
      title: '风险预警机制',
      description: '识别潜在出海风险，提供应对策略建议，帮助企业规避常见陷阱',
    },
  ];

  const assessmentDimensions = [
    { name: '基础能力', color: 'bg-blue-500', desc: '企业身份、规模、核心优势' },
    { name: '产品竞争力', color: 'bg-emerald-500', desc: '认证、研发、生产、供应链' },
    { name: '运营能力', color: 'bg-violet-500', desc: '数字化、营销、品牌建设' },
    { name: '资源配置', color: 'bg-amber-500', desc: '资金、政策、规划、风险' },
    { name: '发展潜力', color: 'bg-rose-500', desc: '成长性、市场空间、团队' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-medium mb-8 shadow-lg">
              <Globe className="w-4 h-4" />
              聊商联盟海外服务部 · 标准化评估体系
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              企业出海成熟度
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                智能评估系统
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              基于聊商联盟海外服务部标准化体系，通过五维评估模型量化诊断企业出海准备度，
              提供精准的对标分析、市场推荐与服务匹配，助力企业科学决策、稳健出海
            </p>
          </div>

          {/* Assessment Dimensions */}
          <div className="mb-16">
            <p className="text-center text-sm font-medium text-slate-500 uppercase tracking-wider mb-6">
              五维评估体系
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {assessmentDimensions.map((dim, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-sm border border-slate-100"
                >
                  <div className={`w-3 h-3 rounded-full ${dim.color}`} />
                  <span className="font-medium text-slate-700">{dim.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="text-center mb-20">
            {savedProgress > 0 ? (
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">您有未完成的评估（进度 {savedProgress}%）</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={onContinue}
                    className="px-8 py-6 text-lg border-2"
                  >
                    继续填写
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => onStart('profile')}
                    className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                  >
                    重新开始
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  size="lg"
                  onClick={() => onStart('profile')}
                  className="px-12 py-7 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all"
                >
                  开始评估
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-sm text-slate-500">
                  预计用时 8-12 分钟 · 所有信息严格保密 · 支持随时保存进度
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            系统核心能力
          </h2>
          <p className="text-slate-600">专业、量化、可落地的出海评估与规划服务</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white/50 backdrop-blur-sm border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">15+</div>
              <div className="text-sm text-slate-600">标杆企业案例</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-1">5</div>
              <div className="text-sm text-slate-600">评估维度</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-violet-600 mb-1">50+</div>
              <div className="text-sm text-slate-600">评估指标</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-1">10+</div>
              <div className="text-sm text-slate-600">目标市场</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
