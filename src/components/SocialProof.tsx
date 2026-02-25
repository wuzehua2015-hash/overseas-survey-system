import { Card, CardContent } from '@/components/ui/card';
import { Star, Users, Award, TrendingUp } from 'lucide-react';

export function SocialProof() {
  // 统计数据（可根据实际情况更新）
  const stats = [
    { icon: Users, value: '500+', label: '企业已完成评估' },
    { icon: Star, value: '98%', label: '客户满意度' },
    { icon: Award, value: '200+', label: '成功出海案例' },
    { icon: TrendingUp, value: '35%', label: '平均出口增长' },
  ];

  // 客户评价
  const testimonials = [
    {
      company: '某机械制造企业',
      industry: '机械设备',
      content: '通过评估发现了我们在认证方面的短板，按照建议补齐后成功进入欧洲市场。',
      result: '出口额增长120%',
    },
    {
      company: '某电子科技企业',
      industry: '电子电气',
      content: '报告中的市场推荐非常精准，帮助我们避开了竞争激烈的红海市场。',
      result: '成功开拓东南亚3国',
    },
    {
      company: '某纺织企业',
      industry: '纺织服装',
      content: '专业的SWOT分析让我们清晰认识到自身优势，现在品牌出海进展顺利。',
      result: '品牌知名度提升300%',
    },
  ];

  return (
    <div className="space-y-4">
      {/* 统计数据 */}
      <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 客户评价 */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">客户成功案例</p>
        {testimonials.map((item, index) => (
          <Card key={index} className="bg-amber-50 border-amber-100">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-700 font-bold text-sm">{item.company[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{item.company}</span>
                    <span className="text-xs text-slate-500">· {item.industry}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">"{item.content}"</p>
                  <div className="mt-2 inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded">
                    {item.result}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
