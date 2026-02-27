import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Wallet, Target, Shield, Flag } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ResourceAndPlan, QuestionnaireStep } from '@/types/questionnaire';
import { marketOptions } from '@/types/questionnaire';

interface ResourcePageProps {
  data: ResourceAndPlan;
  onUpdate: (resource: Partial<ResourceAndPlan>) => void;
  onNext: (step: QuestionnaireStep) => void;
  onBack: () => void;
  onSaveProgress: (step: QuestionnaireStep, progress: number) => void;
}

export function ResourcePage({ data, onUpdate, onNext, onBack, onSaveProgress }: ResourcePageProps) {
  const [localData, setLocalData] = useState<ResourceAndPlan>(data);

  useEffect(() => {
    onUpdate(localData);
  }, [localData, onUpdate]);

  const handleNext = () => {
    onSaveProgress('resource', 100);
    onNext('report');
  };

  const updateField = <K extends keyof ResourceAndPlan>(field: K, value: ResourceAndPlan[K]) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof ResourceAndPlan, item: string) => {
    const current = (localData[field] as string[]) || [];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateField(field as keyof ResourceAndPlan, updated as any);
  };

  const riskOptions = [
    { value: 'payment', label: '海外客户信用风险/收汇风险' },
    { value: 'exchange', label: '汇率波动风险' },
    { value: 'policy', label: '目标国政策/关税风险' },
    { value: 'competition', label: '市场竞争加剧风险' },
    { value: 'logistics', label: '物流/供应链风险' },
    { value: 'ip', label: '知识产权风险' },
    { value: 'culture', label: '文化/语言障碍' },
  ];

  const mitigationOptions = [
    { value: 'insurance', label: '出口信用保险' },
    { value: 'hedging', label: '汇率对冲工具' },
    { value: 'diversification', label: '市场多元化' },
    { value: 'ip_protection', label: '知识产权保护' },
    { value: 'legal', label: '法律顾问支持' },
    { value: 'training', label: '团队培训提升' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>问卷进度</span>
            <span>100%</span>
          </div>
          <Progress value={100} className="h-2" />
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="text-2xl flex items-center gap-3">
              <Wallet className="w-6 h-6" />
              资源与规划
            </CardTitle>
            <p className="text-blue-100 text-sm mt-1">
              了解您的资源配置和出海规划
            </p>
          </CardHeader>
          
          <CardContent className="p-6 space-y-8">
            {/* 资金资源 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                资金资源
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>年度出口业务预算</Label>
                  <Select value={localData.exportBudget} onValueChange={(v) => updateField('exportBudget', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<20">20万以下</SelectItem>
                      <SelectItem value="20-50">20-50万</SelectItem>
                      <SelectItem value="50-100">50-100万</SelectItem>
                      <SelectItem value="100-200">100-200万</SelectItem>
                      <SelectItem value="200-500">200-500万</SelectItem>
                      <SelectItem value=">500">500万以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>融资能力</Label>
                  <Select value={localData.financingCapability} onValueChange={(v) => updateField('financingCapability', v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strong">强（银行授信充足，融资成本低）</SelectItem>
                      <SelectItem value="medium">中等（有一定融资能力）</SelectItem>
                      <SelectItem value="weak">弱（融资困难）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 政策支持 */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b flex items-center gap-2">
                <Flag className="w-5 h-5" />
                政策支持
              </h3>
              
              <div className="space-y-3">
                <Label>享受的政策支持（可多选）</Label>
                <div className="flex flex-wrap gap-2">
                  {['出口退税', '出口补贴', '参展补贴', '信保补贴', '贷款贴息', '无'].map((policy) => (
                    <label
                      key={policy}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                        localData.governmentSupport.includes(policy)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <Checkbox
                        checked={localData.governmentSupport.includes(policy)}
                        onCheckedChange={() => toggleArrayItem('governmentSupport', policy)}
                      />
                      {policy}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 出海规划 */}
            <div className="space-y-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b flex items-center gap-2">
                <Target className="w-5 h-5" />
                出海规划
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={localData.hasClearPlan || false}
                    onCheckedChange={(checked) => updateField('hasClearPlan', checked as boolean)}
                  />
                  <Label className="cursor-pointer">有清晰的出海规划</Label>
                </div>

                {localData.hasClearPlan && (
                  <div className="pl-8 grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>规划时间跨度</Label>
                      <Select value={localData.planTimeframe} onValueChange={(v) => updateField('planTimeframe', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<1year">1年以内</SelectItem>
                          <SelectItem value="1-3years">1-3年</SelectItem>
                          <SelectItem value=">3years">3年以上</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>目标增长</Label>
                      <Select value={localData.targetRevenue} onValueChange={(v) => updateField('targetRevenue', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<30%">30%以下</SelectItem>
                          <SelectItem value="30-50%">30-50%</SelectItem>
                          <SelectItem value="50-100%">50-100%</SelectItem>
                          <SelectItem value=">100%">100%以上</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label>目标市场（可多选）</Label>
                  <div className="flex flex-wrap gap-2">
                    {marketOptions.map((m) => (
                      <label
                        key={m.value}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                          localData.targetMarkets.includes(m.value)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <Checkbox
                          checked={localData.targetMarkets.includes(m.value)}
                          onCheckedChange={() => toggleArrayItem('targetMarkets', m.value)}
                        />
                        {m.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 风险认知 */}
            <div className="space-y-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b flex items-center gap-2">
                <Shield className="w-5 h-5" />
                风险认知与应对
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>认知到的主要风险（可多选）</Label>
                  <div className="flex flex-wrap gap-2">
                    {riskOptions.map((risk) => (
                      <label
                        key={risk.value}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                          localData.perceivedRisks.includes(risk.value)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <Checkbox
                          checked={localData.perceivedRisks.includes(risk.value)}
                          onCheckedChange={() => toggleArrayItem('perceivedRisks', risk.value)}
                        />
                        {risk.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>已采取的风险应对措施（可多选）</Label>
                  <div className="flex flex-wrap gap-2">
                    {mitigationOptions.map((m) => (
                      <label
                        key={m.value}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                          localData.riskMitigation.includes(m.value)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <Checkbox
                          checked={localData.riskMitigation.includes(m.value)}
                          onCheckedChange={() => toggleArrayItem('riskMitigation', m.value)}
                        />
                        {m.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" size="lg" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                上一步
              </Button>
              <Button size="lg" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                生成报告
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
