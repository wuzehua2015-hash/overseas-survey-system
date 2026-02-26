import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Monitor, Share2, Award, Database } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { OperationCapability, QuestionnaireStep } from '@/types/questionnaire';
import { QuestionnaireContainer } from '@/components/QuestionnaireContainer';
import { useSubStepNavigation } from '@/hooks/useSubStepNavigation';

interface OperationPageProps {
  data: OperationCapability;
  onUpdate: (operation: Partial<OperationCapability>) => void;
  onNext: (step: QuestionnaireStep) => void;
  onBack: () => void;
  onSaveProgress: (step: QuestionnaireStep, progress: number) => void;
}

export function OperationPage({ data, onUpdate, onNext, onBack, onSaveProgress }: OperationPageProps) {
  const [localData, setLocalData] = useState<OperationCapability>(data);

  useEffect(() => {
    onUpdate(localData);
  }, [localData, onUpdate]);

  const {
    currentSubStep,
    totalSubSteps,
    goToSubStep,
    saveCurrentProgress,
  } = useSubStepNavigation({
    mainStep: 'operation',
    onSaveProgress,
    onNextMainStep: onNext,
    onBackMainStep: onBack,
  });

  const updateField = <K extends keyof OperationCapability>(field: K, value: OperationCapability[K]) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const updatePlatformOp = (key: keyof OperationCapability['platformOperation'], value: string) => {
    setLocalData(prev => ({
      ...prev,
      platformOperation: { ...prev.platformOperation, [key]: value }
    }));
  };

  const updateSocialOp = (key: keyof OperationCapability['socialOperation'], value: string) => {
    setLocalData(prev => ({
      ...prev,
      socialOperation: { ...prev.socialOperation, [key]: value }
    }));
  };

  const toggleBrandProtection = (value: string) => {
    const current = localData.brandProtection;
    const updated = current.includes(value)
      ? current.filter(b => b !== value)
      : [...current, value];
    updateField('brandProtection', updated);
  };

  const handleNext = () => {
    saveCurrentProgress();
  };

  const stepTitles = ['数字化能力', '营销能力', '平台运营数据', '社媒运营数据', '品牌建设'];

  // 渲染数字化能力
  const renderDigitalCapability = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">数字化能力</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={localData.hasCRM || false}
              onCheckedChange={(checked) => updateField('hasCRM', checked as boolean)}
            />
            <Label className="cursor-pointer">已部署CRM客户管理系统</Label>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={localData.hasERP || false}
              onCheckedChange={(checked) => updateField('hasERP', checked as boolean)}
            />
            <Label className="cursor-pointer">已部署ERP企业资源系统</Label>
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>整体数字化水平</Label>
          <Select value={localData.digitalLevel} onValueChange={(v) => updateField('digitalLevel', v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="advanced">先进（数据驱动决策，流程高度自动化）</SelectItem>
              <SelectItem value="intermediate">中等（主要流程数字化，部分自动化）</SelectItem>
              <SelectItem value="basic">基础（部分流程数字化）</SelectItem>
              <SelectItem value="none">无（主要依靠人工）</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // 渲染营销能力
  const renderMarketingCapability = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">营销能力</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>年度营销预算占出口额比例</Label>
          <Select value={localData.marketingBudget} onValueChange={(v) => updateField('marketingBudget', v)}>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<2%">2%以下</SelectItem>
              <SelectItem value="2-5%">2-5%</SelectItem>
              <SelectItem value="5-10%">5-10%</SelectItem>
              <SelectItem value=">10%">10%以上</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>内容生产方式</Label>
          <Select value={localData.contentProduction} onValueChange={(v) => updateField('contentProduction', v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inhouse">自有团队生产</SelectItem>
              <SelectItem value="outsourced">外包给服务商</SelectItem>
              <SelectItem value="mixed">混合模式</SelectItem>
              <SelectItem value="none">暂无内容生产</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // 渲染平台运营数据
  const renderPlatformOperation = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Monitor className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">平台运营数据（如使用B2B平台）</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>平台产品数量</Label>
          <Input
            value={localData.platformOperation.productCount}
            onChange={(e) => updatePlatformOp('productCount', e.target.value)}
            placeholder="请输入"
          />
        </div>

        <div className="space-y-2">
          <Label>月均询盘量</Label>
          <Input
            value={localData.platformOperation.inquiryVolume}
            onChange={(e) => updatePlatformOp('inquiryVolume', e.target.value)}
            placeholder="请输入"
          />
        </div>

        <div className="space-y-2">
          <Label>平均询盘响应时间</Label>
          <Select 
            value={localData.platformOperation.responseTime} 
            onValueChange={(v) => updatePlatformOp('responseTime', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<2h">2小时以内</SelectItem>
              <SelectItem value="2-8h">2-8小时</SelectItem>
              <SelectItem value="8-24h">8-24小时</SelectItem>
              <SelectItem value=">24h">24小时以上</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>询盘转化率</Label>
          <Select 
            value={localData.platformOperation.conversionRate} 
            onValueChange={(v) => updatePlatformOp('conversionRate', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<5%">5%以下</SelectItem>
              <SelectItem value="5-10%">5-10%</SelectItem>
              <SelectItem value="10-20%">10-20%</SelectItem>
              <SelectItem value=">20%">20%以上</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // 渲染社媒运营数据
  const renderSocialOperation = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">社媒运营数据（如使用社交媒体）</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>社媒账号粉丝总数</Label>
          <Input
            value={localData.socialOperation.totalFollowers}
            onChange={(e) => updateSocialOp('totalFollowers', e.target.value)}
            placeholder="请输入"
          />
        </div>

        <div className="space-y-2">
          <Label>月均发布内容数</Label>
          <Input
            value={localData.socialOperation.monthlyContent}
            onChange={(e) => updateSocialOp('monthlyContent', e.target.value)}
            placeholder="请输入"
          />
        </div>

        <div className="space-y-2">
          <Label>平均互动率</Label>
          <Select 
            value={localData.socialOperation.engagementRate} 
            onValueChange={(v) => updateSocialOp('engagementRate', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<1%">1%以下</SelectItem>
              <SelectItem value="1-3%">1-3%</SelectItem>
              <SelectItem value="3-5%">3-5%</SelectItem>
              <SelectItem value=">5%">5%以上</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>月均获客数量</Label>
          <Input
            value={localData.socialOperation.leadsGenerated}
            onChange={(e) => updateSocialOp('leadsGenerated', e.target.value)}
            placeholder="请输入"
          />
        </div>
      </div>
    </div>
  );

  // 渲染品牌建设
  const renderBrandBuilding = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">品牌建设</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={localData.hasBrand || false}
            onCheckedChange={(checked) => updateField('hasBrand', checked as boolean)}
          />
          <Label className="cursor-pointer">已建立自有品牌</Label>
        </div>

        {localData.hasBrand && (
          <div className="pl-8 space-y-4">
            <div className="space-y-2">
              <Label>品牌知名度</Label>
              <Select value={localData.brandAwareness} onValueChange={(v) => updateField('brandAwareness', v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高（行业内知名）</SelectItem>
                  <SelectItem value="medium">中（部分市场知名）</SelectItem>
                  <SelectItem value="low">低（仅少数客户知道）</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>品牌保护措施（可多选）</Label>
              <div className="flex flex-wrap gap-2">
                {['国内商标注册', '国际商标注册', '域名保护', '专利保护', '海关备案'].map((bp) => (
                  <label
                    key={bp}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                      localData.brandProtection.includes(bp)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <Checkbox
                      checked={localData.brandProtection.includes(bp)}
                      onCheckedChange={() => toggleBrandProtection(bp)}
                    />
                    {bp}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 根据当前子步骤渲染内容
  const renderSubStepContent = () => {
    switch (currentSubStep) {
      case 0:
        return renderDigitalCapability();
      case 1:
        return renderMarketingCapability();
      case 2:
        return renderPlatformOperation();
      case 3:
        return renderSocialOperation();
      case 4:
        return renderBrandBuilding();
      default:
        return renderDigitalCapability();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <QuestionnaireContainer
        totalSteps={totalSubSteps}
        currentStep={currentSubStep}
        onStepChange={goToSubStep}
        onSaveProgress={saveCurrentProgress}
        stepTitles={stepTitles}
      >
        {renderSubStepContent()}
      </QuestionnaireContainer>
    </div>
  );
}
