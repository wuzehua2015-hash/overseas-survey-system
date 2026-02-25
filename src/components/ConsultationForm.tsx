import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, User, Building2, CheckCircle, Loader2, Sparkles, ArrowRight, Calendar, MessageCircle } from 'lucide-react';
import { submitToGitHub, type SubmissionData } from '@/services/githubStorage';
import { industryOptions } from '@/types/questionnaire';

interface ConsultationFormProps {
  companyName?: string;
  assessmentScore?: number;
  stage?: string;
  level?: string;
  industry?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export function ConsultationForm({ 
  companyName = '', 
  assessmentScore = 0,
  stage = '',
  level = '',
  industry = '',
  contactName = '',
  contactPhone = '',
  contactEmail = ''
}: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    companyName: companyName,
    contactName: contactName,
    contactPhone: contactPhone,
    contactEmail: contactEmail,
    industry: industry,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // 检查是否已经自动提交过
  useEffect(() => {
    const autoSubmitKey = `questionnaire_saved_${companyName}_${contactPhone}`;
    const hasSubmitted = localStorage.getItem(autoSubmitKey);
    if (hasSubmitted) {
      setHasAutoSubmitted(true);
    }
    
    // 预填充表单数据
    const savedProgress = localStorage.getItem('questionnaire_progress_v2');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        const savedData = parsed.data;
        
        if (savedData?.profile) {
          setFormData(prev => ({
            companyName: prev.companyName || savedData.profile.name || '',
            contactName: prev.contactName || savedData.profile.contactName || '',
            contactPhone: prev.contactPhone || savedData.profile.contactPhone || '',
            contactEmail: prev.contactEmail || savedData.profile.contactEmail || '',
            industry: prev.industry || savedData.profile.industry || '',
          }));
        }
      } catch (e) {
        console.error('Failed to parse saved progress:', e);
      }
    }
  }, [companyName, contactPhone]);

  const getIndustryLabel = (value: string): string => {
    const industry = industryOptions.find(i => i.value === value);
    return industry?.label || value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    const submissionData: SubmissionData = {
      id: `consultation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      companyName: formData.companyName,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      industry: formData.industry,
      score: assessmentScore,
      stage: stage,
      level: level,
      timestamp: new Date().toISOString(),
      type: 'consultation',
    };

    try {
      const result = await submitToGitHub(submissionData);
      setSubmitResult(result);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitResult({
        success: false,
        message: '提交过程中发生错误，请稍后重试'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 已自动提交状态 - 显示预约深度咨询
  if (hasAutoSubmitted && !showBookingForm) {
    return (
      <div className="relative">
        {/* 醒目的标题区域 */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-t-xl p-1">
          <div className="bg-white rounded-t-lg p-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl font-bold text-slate-900">信息已收到</h2>
            </div>
            <p className="text-center text-slate-600">
              我们的出海专家将在 <span className="text-emerald-600 font-semibold">24小时内</span> 与您联系
            </p>
          </div>
        </div>

        <Card className="border-t-0 rounded-t-none shadow-xl">
          <CardContent className="p-6">
            {/* 已提交信息展示 */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">已提交信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">企业名称</span>
                  <span className="font-medium">{formData.companyName || '未填写'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">联系人</span>
                  <span className="font-medium">{formData.contactName || '未填写'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">联系电话</span>
                  <span className="font-medium">{formData.contactPhone || '未填写'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">评估得分</span>
                  <span className="font-medium text-blue-600">{assessmentScore}分</span>
                </div>
              </div>
            </div>

            {/* 升级服务提示 */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200 mb-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800">需要深度咨询？</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    预约专家1对1深度咨询，获取定制化出海方案
                  </p>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-3">
              <Button 
                onClick={() => setShowBookingForm(true)}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                预约专家1对1咨询
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => window.open('https://work.weixin.qq.com/kfid/kfc2a6f957f3e2f8f5', '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                在线咨询客服
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 提交成功状态
  if (submitResult?.success) {
    return (
      <Card className="border-emerald-200 bg-emerald-50 shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 text-emerald-700">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-xl">预约成功！</p>
              <p className="text-emerald-600 mt-1">我们的出海专家将在24小时内与您联系</p>
              <p className="text-sm text-emerald-500 mt-2">请保持电话畅通</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="mt-6 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            onClick={() => setSubmitResult(null)}
          >
            返回
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 默认表单状态（未提交或显示预约表单）
  return (
    <div className="relative">
      {/* 醒目的标题区域 */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-t-xl p-1">
        <div className="bg-white rounded-t-lg p-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
            <h2 className="text-2xl font-bold text-slate-900">
              {hasAutoSubmitted ? '预约专家深度咨询' : '获取专属出海方案'}
            </h2>
            <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>
          <p className="text-center text-slate-600">
            {hasAutoSubmitted 
              ? '填写下方信息，预约1对1深度咨询服务' 
              : '填写下方信息，立即预约免费深度咨询'}
          </p>
        </div>
      </div>

      <Card className="border-t-0 rounded-t-none shadow-xl">
        <CardContent className="p-6">
          {/* 服务优势 */}
          {!hasAutoSubmitted && (
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1对1</div>
                <div className="text-xs text-slate-600">专家咨询</div>
              </div>
              <div className="text-center border-x border-slate-200">
                <div className="text-2xl font-bold text-emerald-600">免费</div>
                <div className="text-xs text-slate-600">线下走访</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">定制</div>
                <div className="text-xs text-slate-600">解决方案</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="flex items-center gap-2 text-slate-700">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  企业名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="请输入企业名称"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactName" className="flex items-center gap-2 text-slate-700">
                  <User className="w-4 h-4 text-blue-500" />
                  联系人 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                  placeholder="请输入联系人姓名"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-blue-500" />
                  联系电话 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="请输入联系电话"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-blue-500" />
                  联系邮箱 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="请输入联系邮箱"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="industry" className="flex items-center gap-2 text-slate-700">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  所属行业 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="industry"
                  value={formData.industry ? getIndustryLabel(formData.industry) : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="请输入所属行业"
                  required
                  className="h-12"
                />
              </div>
            </div>

            {assessmentScore > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">评估得分: {assessmentScore}</Badge>
                {stage && <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">出海阶段: {stage}</Badge>}
                {level && <Badge variant="secondary" className="bg-purple-100 text-purple-700">企业等级: {level}</Badge>}
              </div>
            )}

            {submitResult && !submitResult.success && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <p className="font-semibold">提交失败</p>
                <p className="text-sm mt-1">{submitResult.message}</p>
                <p className="text-xs text-red-500 mt-2">请检查网络连接后重试，或联系客服</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  {hasAutoSubmitted ? '确认预约' : '立即预约免费咨询'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <span>✓ 24小时内响应</span>
              <span>✓ 完全免费</span>
              <span>✓ 隐私保护</span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
