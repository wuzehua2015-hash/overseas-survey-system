import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';
import type { QuestionnaireStep } from '@/types/questionnaire';

interface StepIndicatorProps {
  currentStep: QuestionnaireStep;
}

const steps = [
  { key: 'profile', label: '企业画像', number: 1 },
  { key: 'diagnosis', label: '出海诊断', number: 2 },
  { key: 'product', label: '产品竞争力', number: 3 },
  { key: 'operation', label: '运营能力', number: 4 },
  { key: 'resource', label: '资源配置', number: 5 },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  // 计算当前进度
  const getCurrentStepIndex = () => {
    const index = steps.findIndex(s => s.key === currentStep);
    return index >= 0 ? index : 0;
  };
  
  const currentIndex = getCurrentStepIndex();
  const progress = ((currentIndex + 1) / steps.length) * 100;
  
  // 如果是欢迎页或报告页，不显示
  if (currentStep === 'welcome' || currentStep === 'report') {
    return null;
  }

  return (
    <div className="bg-white border-b border-slate-200 py-4 px-4 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto">
        {/* 顶部进度条 */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700">
            第 {currentIndex + 1} 步 / 共 {steps.length} 步
          </span>
          <span className="text-sm text-slate-500">
            {steps[currentIndex]?.label}
          </span>
        </div>
        
        <Progress value={progress} className="h-2 mb-4" />
        
        {/* 步骤指示器 */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      isCompleted || isCurrent ? 'text-slate-700 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 md:w-16 h-0.5 mx-1 md:mx-2 ${
                      index < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
