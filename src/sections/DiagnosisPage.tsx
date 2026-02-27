import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp, Users, Store, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { OverseasDiagnosis, QuestionnaireStep } from '@/types/questionnaire';
import { marketOptions } from '@/types/questionnaire';
import { QuestionnaireContainer } from '@/components/QuestionnaireContainer';
import { useSubStepNavigation } from '@/hooks/useSubStepNavigation';

interface DiagnosisPageProps {
  data: OverseasDiagnosis;
  onUpdate: (diagnosis: Partial<OverseasDiagnosis>) => void;
  onNext: (step: QuestionnaireStep) => void;
  onBack: () => void;
  onSaveProgress: (step: QuestionnaireStep, progress: number) => void;
}

// 简化的渠道选项
const simpleChannelOptions = [
  { key: 'b2bPlatform', label: 'B2B平台（阿里国际站/环球资源等）' },
  { key: 'socialMedia', label: '社交媒体（LinkedIn/Facebook等）' },
  { key: 'b2cPlatform', label: 'B2C跨境电商（亚马逊/速卖通等）' },
  { key: 'independentSite', label: '独立站' },
  { key: 'offlineExhibition', label: '线下展会' },
  { key: 'overseasOffice', label: '海外办事处' },
  { key: 'agentDistributor', label: '代理商/经销商' },
];

export function DiagnosisPage({ data, onUpdate, onNext, onBack, onSaveProgress }: DiagnosisPageProps) {
  const [localData, setLocalData] = useState<OverseasDiagnosis>(data);

  useEffect(() => {
    onUpdate(localData);
  }, [localData, onUpdate]);

  const {
    currentSubStep,
    totalSubSteps,
    goToSubStep,
    saveCurrentProgress,
    isFirstSubStep,
    isLastSubStep,
    goToPrevSubStep,
    goToNextSubStep,
  } = useSubStepNavigation({
    mainStep: 'diagnosis',
    onSaveProgress,
    onNextMainStep: onNext,
    onBackMainStep: onBack,
  });

  const updateField = <K extends keyof OverseasDiagnosis>(field: K, value: OverseasDiagnosis[K]) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const updateChannels = (key: keyof OverseasDiagnosis['channels'], value: any) => {
    setLocalData(prev => ({
      ...prev,
      channels: { ...prev.channels, [key]: value }
    }));
  };

  const updateTeamConfig = (key: keyof OverseasDiagnosis['teamConfig'], value: any) => {
    setLocalData(prev => ({
      ...prev,
      teamConfig: { ...prev.teamConfig, [key]: value }
    }));
  };

  const toggleArrayItem = (field: keyof OverseasDiagnosis, item: string) => {
    const current = (localData[field] as string[]) || [];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateField(field as keyof OverseasDiagnosis, updated as any);
  };

  const stepTitles = ['业务现状', '市场覆盖', '渠道布局', '团队配置'];

  // 渲染业务现状
  const renderBusinessStatus = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">业务现状</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>当前出海阶段</Label>
          <Select value={localData.stage} onValueChange={(v) => updateField('stage', v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preparation">准备期（尚未开始）</SelectItem>
              <SelectItem value="exploration">探索期（已尝试，规模较小）</SelectItem>
              <SelectItem value="growth">成长期（业务快速增长）</SelectItem>
              <SelectItem value="expansion">扩张期（规模化扩张）</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>年出口额</Label>
          <Select value={localData.annualExportValue} onValueChange={(v) => updateField('annualExportValue', v)}>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">无出口</SelectItem>
              <SelectItem value="<100">100万以下</SelectItem>
              <SelectItem value="100-1000">100-1000万</SelectItem>
              <SelectItem value="1000-5000">1000-5000万</SelectItem>
              <SelectItem value=">5000">5000万以上</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>出口占总营收比例</Label>
          <Select value={localData.exportRevenueRatio} onValueChange={(v) => updateField('exportRevenueRatio', v)}>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">无出口</SelectItem>
              <SelectItem value="<10%">10%以下</SelectItem>
              <SelectItem value="10-30%">10-30%</SelectItem>
              <SelectItem value="30-50%">30-50%</SelectItem>
              <SelectItem value=">50%">50%以上</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>出口增长率</Label>
          <Select value={localData.exportGrowthRate} onValueChange={(v) => updateField('exportGrowthRate', v)}>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">无增长</SelectItem>
              <SelectItem value="<10%">10%以下</SelectItem>
              <SelectItem value="10-30%">10-30%</SelectItem>
              <SelectItem value="30-50%">30-50%</SelectItem>
              <SelectItem value=">50%">50%以上</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // 渲染市场覆盖
  const renderMarketCoverage = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">市场覆盖</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>覆盖市场数量</Label>
          <Select value={localData.marketCount} onValueChange={(v) => updateField('marketCount', v)}>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">无</SelectItem>
              <SelectItem value="1-5">1-5个</SelectItem>
              <SelectItem value="5-10">5-10个</SelectItem>
              <SelectItem value="10-20">10-20个</SelectItem>
              <SelectItem value=">20">20个以上</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>主要出口市场（可多选）</Label>
          <div className="flex flex-wrap gap-2">
            {marketOptions.map((m) => (
              <label
                key={m.value}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                  localData.topMarkets.includes(m.value)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <Checkbox
                  checked={localData.topMarkets.includes(m.value)}
                  onCheckedChange={() => toggleArrayItem('topMarkets', m.value)}
                />
                {m.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // 渲染渠道布局（简化版）
  const renderChannelLayout = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Store className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">渠道布局</h3>
      </div>
      
      <div className="space-y-3">
        <Label>已使用的出海渠道（可多选）</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {simpleChannelOptions.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <Checkbox
                checked={localData.channels[key as keyof typeof localData.channels] as boolean}
                onCheckedChange={(checked) => updateChannels(key as any, checked)}
              />
              <Label className="cursor-pointer text-sm">{label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 渲染团队配置（简化版）
  const renderTeamConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">团队配置</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={localData.teamConfig.hasDedicatedTeam}
            onCheckedChange={(checked) => updateTeamConfig('hasDedicatedTeam', checked)}
          />
          <Label className="cursor-pointer">有专职外贸团队</Label>
        </div>

        {localData.teamConfig.hasDedicatedTeam && (
          <div className="pl-8 grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>团队规模</Label>
              <Select 
                value={localData.teamConfig.teamSize} 
                onValueChange={(v) => updateTeamConfig('teamSize', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<5">5人以下</SelectItem>
                  <SelectItem value="5-20">5-20人</SelectItem>
                  <SelectItem value="20-50">20-50人</SelectItem>
                  <SelectItem value=">50">50人以上</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>外语能力</Label>
              <Select 
                value={localData.teamConfig.foreignLanguageCapability} 
                onValueChange={(v) => updateTeamConfig('foreignLanguageCapability', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">优秀（多语种覆盖）</SelectItem>
                  <SelectItem value="good">良好（英语为主）</SelectItem>
                  <SelectItem value="basic">基础（简单沟通）</SelectItem>
                  <SelectItem value="weak">较弱</SelectItem>
                </SelectContent>
              </Select>
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
        return renderBusinessStatus();
      case 1:
        return renderMarketCoverage();
      case 2:
        return renderChannelLayout();
      case 3:
        return renderTeamConfig();
      default:
        return renderBusinessStatus();
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
        isFirstSubStep={isFirstSubStep}
        isLastSubStep={isLastSubStep}
        onFirstStepBack={goToPrevSubStep}
        onLastStepNext={goToNextSubStep}
      >
        {renderSubStepContent()}
      </QuestionnaireContainer>
    </div>
  );
}
