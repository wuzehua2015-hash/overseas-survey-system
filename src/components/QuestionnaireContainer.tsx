import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface QuestionnaireContainerProps {
  totalSteps: number;
  currentStep: number;
  onStepChange: (step: number) => void;
  onSaveProgress?: () => void;
  children: React.ReactNode;
  stepTitles: string[];
}

export function QuestionnaireContainer({
  totalSteps,
  currentStep,
  onStepChange,
  onSaveProgress,
  children,
  stepTitles,
}: QuestionnaireContainerProps) {
  const [showSaveHint, setShowSaveHint] = useState(false);
  const [contentAnimation, setContentAnimation] = useState('');
  const prevStepRef = useRef(currentStep);

  const progress = ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    // 显示保存提示
    const timer = setTimeout(() => setShowSaveHint(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // 监听步骤变化，添加内容动画
  useEffect(() => {
    if (currentStep !== prevStepRef.current) {
      const direction = currentStep > prevStepRef.current ? 'right' : 'left';
      setContentAnimation(direction === 'right' ? 'substep-enter-right' : 'substep-enter-left');
      
      prevStepRef.current = currentStep;
      
      // 清除动画类
      const timer = setTimeout(() => {
        setContentAnimation('');
      }, 250);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      onStepChange(currentStep + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 步骤指示器 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {stepTitles[currentStep]}
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-blue-600">{currentStep + 1}</span>
            <span>/</span>
            <span>{totalSteps}</span>
          </div>
        </div>

        {/* 进度条 */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-slate-400">
            <span>已完成 {Math.round(progress)}%</span>
            <span>还剩 {totalSteps - currentStep - 1} 步</span>
          </div>
        </div>

        {/* 步骤标题指示器 */}
        <div className="flex gap-1 mt-4 overflow-x-auto pb-2">
          {stepTitles.map((title, index) => (
            <button
              key={index}
              onClick={() => onStepChange(index)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                index === currentStep
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : index < currentStep
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {index + 1}. {title}
            </button>
          ))}
        </div>
      </div>

      {/* 保存提示 */}
      {showSaveHint && onSaveProgress && (
        <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Save className="w-4 h-4" />
            <span>进度会自动保存，您可以随时离开</span>
          </div>
          <button
            onClick={() => setShowSaveHint(false)}
            className="text-blue-400 hover:text-blue-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* 内容区域 */}
      <div className={`bg-white rounded-xl shadow-sm border p-6 mb-6 ${contentAnimation}`}>
        {children}
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          上一步
        </Button>

        <div className="flex gap-3">
          {onSaveProgress && (
            <Button
              variant="outline"
              onClick={onSaveProgress}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              保存进度
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={currentStep === totalSteps - 1}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            下一步
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
