import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Award, Package, Factory, Shield } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ProductCompetitiveness, QuestionnaireStep } from '@/types/questionnaire';
import { certificationOptions } from '@/types/questionnaire';

interface ProductPageProps {
  data: ProductCompetitiveness;
  onUpdate: (product: Partial<ProductCompetitiveness>) => void;
  onNext: (step: QuestionnaireStep) => void;
  onBack: () => void;
  onSaveProgress: (step: QuestionnaireStep, progress: number) => void;
}

export function ProductPage({ data, onUpdate, onNext, onBack, onSaveProgress }: ProductPageProps) {
  const [localData, setLocalData] = useState<ProductCompetitiveness>(data);

  useEffect(() => {
    onUpdate(localData);
  }, [localData, onUpdate]);

  const handleNext = () => {
    onSaveProgress('product', 60);
    onNext('operation');
  };

  const updateField = <K extends keyof ProductCompetitiveness>(field: K, value: ProductCompetitiveness[K]) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCertification = (value: string) => {
    const current = localData.certifications;
    const updated = current.includes(value)
      ? current.filter(c => c !== value)
      : [...current, value];
    updateField('certifications', updated);
  };

  const toggleQualityControl = (value: string) => {
    const current = localData.qualityControl;
    const updated = current.includes(value)
      ? current.filter(q => q !== value)
      : [...current, value];
    updateField('qualityControl', updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>问卷进度</span>
            <span>60%</span>
          </div>
          <Progress value={60} className="h-2" />
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="text-2xl flex items-center gap-3">
              <Package className="w-6 h-6" />
              产品竞争力评估
            </CardTitle>
            <p className="text-blue-100 text-sm mt-1">
              了解您的产品竞争优势和准备情况
            </p>
          </CardHeader>
          
          <CardContent className="p-6 space-y-8">
            {/* 产品认证 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b flex items-center gap-2">
                <Award className="w-5 h-5" />
                产品认证
              </h3>
              
              <div className="space-y-3">
                <Label>已获得的认证（可多选）</Label>
                <div className="flex flex-wrap gap-2">
                  {certificationOptions.map((cert) => (
                    <label
                      key={cert.value}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                        localData.certifications.includes(cert.value)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <Checkbox
                        checked={localData.certifications.includes(cert.value)}
                        onCheckedChange={() => toggleCertification(cert.value)}
                      />
                      <span>{cert.label}</span>
                      <span className="text-xs text-slate-400">({cert.region})</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 产品特性 */}
            <div className="space-y-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b flex items-center gap-2">
                <Package className="w-5 h-5" />
                产品特性
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>价格定位</Label>
                  <Select value={localData.pricePositioning} onValueChange={(v) => updateField('pricePositioning', v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">高端（溢价能力强）</SelectItem>
                      <SelectItem value="mid-high">中高端</SelectItem>
                      <SelectItem value="mid">中端（性价比）</SelectItem>
                      <SelectItem value="economy">经济型</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>最小起订量（MOQ）</Label>
                  <Select value={localData.moq} onValueChange={(v) => updateField('moq', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<100">100件以下</SelectItem>
                      <SelectItem value="100-500">100-500件</SelectItem>
                      <SelectItem value="500-1000">500-1000件</SelectItem>
                      <SelectItem value=">1000">1000件以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>定制能力</Label>
                  <Select value={localData.customizationCapability} onValueChange={(v) => updateField('customizationCapability', v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strong">强（快速打样，灵活调整）</SelectItem>
                      <SelectItem value="medium">中等（一定调整空间）</SelectItem>
                      <SelectItem value="weak">弱（标准化产品）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 研发创新 */}
            <div className="space-y-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b flex items-center gap-2">
                <Factory className="w-5 h-5" />
                研发创新
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={localData.hasRAndD || false}
                    onCheckedChange={(checked) => updateField('hasRAndD', checked as boolean)}
                  />
                  <Label className="cursor-pointer">设有专门的研发团队</Label>
                </div>

                {localData.hasRAndD && (
                  <div className="pl-8 grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>年均新品数量</Label>
                      <Select value={localData.annualNewProducts} onValueChange={(v) => updateField('annualNewProducts', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">无</SelectItem>
                          <SelectItem value="1-5">1-5款</SelectItem>
                          <SelectItem value="5-10">5-10款</SelectItem>
                          <SelectItem value=">10">10款以上</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>专利数量</Label>
                      <Select value={localData.patentCount} onValueChange={(v) => updateField('patentCount', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">无</SelectItem>
                          <SelectItem value="1-5">1-5项</SelectItem>
                          <SelectItem value="5-10">5-10项</SelectItem>
                          <SelectItem value=">10">10项以上</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 生产能力 */}
            <div className="space-y-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b flex items-center gap-2">
                <Factory className="w-5 h-5" />
                生产能力
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>月产能</Label>
                  <Select value={localData.productionCapacity} onValueChange={(v) => updateField('productionCapacity', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<1000">1000件以下</SelectItem>
                      <SelectItem value="1000-10000">1000-10000件</SelectItem>
                      <SelectItem value="10000-100000">1-10万件</SelectItem>
                      <SelectItem value=">100000">10万件以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>平均交期</Label>
                  <Select value={localData.deliveryTime} onValueChange={(v) => updateField('deliveryTime', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<7">7天以内</SelectItem>
                      <SelectItem value="7-15">7-15天</SelectItem>
                      <SelectItem value="15-30">15-30天</SelectItem>
                      <SelectItem value=">30">30天以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    质量控制体系（可多选）
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {['IQC来料检验', 'IPQC过程检验', 'FQC成品检验', 'OQC出货检验', '第三方检测'].map((qc) => (
                      <label
                        key={qc}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                          localData.qualityControl.includes(qc)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <Checkbox
                          checked={localData.qualityControl.includes(qc)}
                          onCheckedChange={() => toggleQualityControl(qc)}
                        />
                        {qc}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 供应链 */}
            <div className="space-y-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b">供应链</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>供应链稳定性</Label>
                  <Select value={localData.supplyChainStability} onValueChange={(v) => updateField('supplyChainStability', v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">优秀（多供应商，无断供风险）</SelectItem>
                      <SelectItem value="good">良好（主要材料稳定）</SelectItem>
                      <SelectItem value="average">一般（偶有不稳定）</SelectItem>
                      <SelectItem value="poor">较差（经常断供）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>关键原材料来源</Label>
                  <Select value={localData.keyMaterialSource} onValueChange={(v) => updateField('keyMaterialSource', v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domestic">国内采购</SelectItem>
                      <SelectItem value="imported">进口为主</SelectItem>
                      <SelectItem value="mixed">混合采购</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" size="lg" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                上一步
              </Button>
              <Button size="lg" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                下一步
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
