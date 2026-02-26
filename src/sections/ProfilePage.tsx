import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Users, Phone, Mail, Award, Factory } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CompanyProfile, QuestionnaireStep } from '@/types/questionnaire';
import { industryOptions, coreCompetencyOptions } from '@/types/questionnaire';
import { QuestionnaireContainer } from '@/components/QuestionnaireContainer';
import { useSubStepNavigation } from '@/hooks/useSubStepNavigation';

interface ProfilePageProps {
  data: CompanyProfile;
  onUpdate: (profile: Partial<CompanyProfile>) => void;
  onNext: (step: QuestionnaireStep) => void;
  onBack: () => void;
  onSaveProgress: (step: QuestionnaireStep, progress: number) => void;
}

export function ProfilePage({ data, onUpdate, onNext, onBack, onSaveProgress }: ProfilePageProps) {
  const [localData, setLocalData] = useState<CompanyProfile>(data);
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyProfile, string>>>({});

  useEffect(() => {
    onUpdate(localData);
  }, [localData, onUpdate]);

  const {
    currentSubStep,
    totalSubSteps,
    goToSubStep,
    saveCurrentProgress,
  } = useSubStepNavigation({
    mainStep: 'profile',
    onSaveProgress,
    onNextMainStep: onNext,
    onBackMainStep: onBack,
  });

  const updateField = <K extends keyof CompanyProfile>(field: K, value: CompanyProfile[K]) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleCompetency = (value: string) => {
    const current = localData.coreCompetency;
    const updated = current.includes(value)
      ? current.filter(c => c !== value)
      : [...current, value];
    updateField('coreCompetency', updated);
  };

  // 验证当前子步骤
  const validateCurrentStep = (): boolean => {
    const newErrors: Partial<Record<keyof CompanyProfile, string>> = {};
    
    switch (currentSubStep) {
      case 0: // 企业基本信息
        if (!localData.name.trim()) newErrors.name = '请输入企业名称';
        if (!localData.companyNature) newErrors.companyNature = '请选择企业性质';
        if (!localData.companyType) newErrors.companyType = '请选择企业类型';
        break;
      case 1: // 主营业务
        if (!localData.industry) newErrors.industry = '请选择所属行业';
        if (!localData.mainProduct.trim()) newErrors.mainProduct = '请输入主要产品';
        break;
      case 2: // 企业规模
        if (!localData.annualRevenue) newErrors.annualRevenue = '请选择年营业额';
        if (!localData.employeeCount) newErrors.employeeCount = '请选择员工规模';
        break;
      case 3: // 联系人信息
        if (!localData.contactName.trim()) newErrors.contactName = '请输入联系人姓名';
        if (!localData.contactPhone.trim()) newErrors.contactPhone = '请输入联系电话';
        else if (!/^1[3-9]\d{9}$/.test(localData.contactPhone)) {
          newErrors.contactPhone = '请输入正确的手机号';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      saveCurrentProgress();
    }
  };

  const stepTitles = ['企业基本信息', '主营业务', '企业规模', '联系人信息'];

  // 渲染企业基本信息
  const renderCompanyBasic = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">企业基本信息</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>企业名称 <span className="text-red-500">*</span></Label>
          <Input
            value={localData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="请输入企业全称"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label>成立年份</Label>
          <Select value={localData.establishedYear} onValueChange={(v) => updateField('establishedYear', v)}>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              {['<5年', '5-10年', '10-20年', '>20年'].map(y => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>企业性质 <span className="text-red-500">*</span></Label>
          <Select value={localData.companyNature} onValueChange={(v) => updateField('companyNature', v as any)}>
            <SelectTrigger className={errors.companyNature ? 'border-red-500' : ''}>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">私营企业</SelectItem>
              <SelectItem value="state">国有/央企</SelectItem>
              <SelectItem value="joint">合资企业</SelectItem>
              <SelectItem value="foreign">外资企业</SelectItem>
              <SelectItem value="listed">上市公司</SelectItem>
            </SelectContent>
          </Select>
          {errors.companyNature && <p className="text-red-500 text-sm">{errors.companyNature}</p>}
        </div>

        <div className="space-y-2">
          <Label>企业类型 <span className="text-red-500">*</span></Label>
          <Select value={localData.companyType} onValueChange={(v) => updateField('companyType', v as any)}>
            <SelectTrigger className={errors.companyType ? 'border-red-500' : ''}>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manufacturer">生产型企业</SelectItem>
              <SelectItem value="trader">贸易型企业</SelectItem>
              <SelectItem value="hybrid">工贸一体</SelectItem>
              <SelectItem value="brand">品牌型企业</SelectItem>
              <SelectItem value="service">服务型企业</SelectItem>
            </SelectContent>
          </Select>
          {errors.companyType && <p className="text-red-500 text-sm">{errors.companyType}</p>}
        </div>
      </div>
    </div>
  );

  // 渲染主营业务
  const renderCompanyBusiness = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">主营业务</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>所属行业 <span className="text-red-500">*</span></Label>
          <Select value={localData.industry} onValueChange={(v) => updateField('industry', v)}>
            <SelectTrigger className={errors.industry ? 'border-red-500' : ''}>
              <SelectValue placeholder="请选择行业" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {industryOptions.map((ind) => (
                <SelectItem key={ind.value} value={ind.value}>{ind.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && <p className="text-red-500 text-sm">{errors.industry}</p>}
        </div>

        <div className="space-y-2">
          <Label>主要产品 <span className="text-red-500">*</span></Label>
          <Input
            value={localData.mainProduct}
            onChange={(e) => updateField('mainProduct', e.target.value)}
            placeholder="请简要描述主要产品"
            className={errors.mainProduct ? 'border-red-500' : ''}
          />
          {errors.mainProduct && <p className="text-red-500 text-sm">{errors.mainProduct}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Award className="w-4 h-4" />
          核心竞争优势（可多选）
        </Label>
        <div className="flex flex-wrap gap-3">
          {coreCompetencyOptions.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                localData.coreCompetency.includes(opt.value)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <Checkbox
                checked={localData.coreCompetency.includes(opt.value)}
                onCheckedChange={() => toggleCompetency(opt.value)}
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // 渲染企业规模
  const renderCompanyScale = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">企业规模</h3>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>年营业额 <span className="text-red-500">*</span></Label>
          <Select value={localData.annualRevenue} onValueChange={(v) => updateField('annualRevenue', v)}>
            <SelectTrigger className={errors.annualRevenue ? 'border-red-500' : ''}>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<500">500万以下</SelectItem>
              <SelectItem value="500-1000">500-1000万</SelectItem>
              <SelectItem value="1000-3000">1000-3000万</SelectItem>
              <SelectItem value="3000-5000">3000-5000万</SelectItem>
              <SelectItem value=">5000">5000万以上</SelectItem>
            </SelectContent>
          </Select>
          {errors.annualRevenue && <p className="text-red-500 text-sm">{errors.annualRevenue}</p>}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            员工规模 <span className="text-red-500">*</span>
          </Label>
          <Select value={localData.employeeCount} onValueChange={(v) => updateField('employeeCount', v)}>
            <SelectTrigger className={errors.employeeCount ? 'border-red-500' : ''}>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<50">50人以下</SelectItem>
              <SelectItem value="50-100">50-100人</SelectItem>
              <SelectItem value="100-500">100-500人</SelectItem>
              <SelectItem value=">500">500人以上</SelectItem>
            </SelectContent>
          </Select>
          {errors.employeeCount && <p className="text-red-500 text-sm">{errors.employeeCount}</p>}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Factory className="w-4 h-4" />
            研发人员占比
          </Label>
          <Select value={localData.rAndDStaffRatio} onValueChange={(v) => updateField('rAndDStaffRatio', v)}>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<5%">5%以下</SelectItem>
              <SelectItem value="5-10%">5-10%</SelectItem>
              <SelectItem value="10-30%">10-30%</SelectItem>
              <SelectItem value=">30%">30%以上</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // 渲染联系人信息
  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Phone className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">联系人信息</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            联系人姓名 <span className="text-red-500">*</span>
          </Label>
          <Input
            value={localData.contactName}
            onChange={(e) => updateField('contactName', e.target.value)}
            placeholder="请输入"
            className={errors.contactName ? 'border-red-500' : ''}
          />
          {errors.contactName && <p className="text-red-500 text-sm">{errors.contactName}</p>}
        </div>

        <div className="space-y-2">
          <Label>职位</Label>
          <Input
            value={localData.contactPosition}
            onChange={(e) => updateField('contactPosition', e.target.value)}
            placeholder="如：外贸经理"
          />
        </div>

        <div className="space-y-2">
          <Label>联系电话 <span className="text-red-500">*</span></Label>
          <Input
            value={localData.contactPhone}
            onChange={(e) => updateField('contactPhone', e.target.value)}
            placeholder="请输入手机号"
            className={errors.contactPhone ? 'border-red-500' : ''}
          />
          {errors.contactPhone && <p className="text-red-500 text-sm">{errors.contactPhone}</p>}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            电子邮箱
          </Label>
          <Input
            value={localData.contactEmail}
            onChange={(e) => updateField('contactEmail', e.target.value)}
            placeholder="请输入邮箱"
            type="email"
          />
        </div>
      </div>
    </div>
  );

  // 根据当前子步骤渲染内容
  const renderSubStepContent = () => {
    switch (currentSubStep) {
      case 0:
        return renderCompanyBasic();
      case 1:
        return renderCompanyBusiness();
      case 2:
        return renderCompanyScale();
      case 3:
        return renderContactInfo();
      default:
        return renderCompanyBasic();
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
