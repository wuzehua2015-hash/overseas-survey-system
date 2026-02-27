import { useState, useEffect, useCallback } from 'react';
import type { QuestionnaireStep } from '@/types/questionnaire';
import { STEP_CONFIG, getSubStepCount } from '@/types/subSteps';

interface UseSubStepNavigationProps {
  mainStep: QuestionnaireStep;
  onSaveProgress: (step: QuestionnaireStep, progress: number) => void;
  onNextMainStep?: (step: QuestionnaireStep) => void;
  onBackMainStep: () => void;
}

interface UseSubStepNavigationReturn {
  currentSubStep: number;
  totalSubSteps: number;
  subStepTitle: string;
  subStepProgress: number;
  canGoNext: boolean;
  canGoBack: boolean;
  isLastSubStep: boolean;
  isFirstSubStep: boolean;
  goToNextSubStep: () => void;
  goToPrevSubStep: () => void;
  goToSubStep: (index: number) => void;
  saveCurrentProgress: () => void;
}

// 步骤进度映射
const STEP_PROGRESS_MAP: Record<QuestionnaireStep, number> = {
  'welcome': 0,
  'profile': 20,
  'diagnosis': 40,
  'product': 60,
  'operation': 80,
  'resource': 100,
  'report': 100,
};

export function useSubStepNavigation({
  mainStep,
  onSaveProgress,
  onNextMainStep,
  onBackMainStep,
}: UseSubStepNavigationProps): UseSubStepNavigationReturn {
  const [currentSubStep, setCurrentSubStep] = useState(0);
  
  const totalSubSteps = getSubStepCount(mainStep);
  const subStepTitle = STEP_CONFIG[mainStep]?.titles[currentSubStep] || '';
  
  // 计算当前步骤的整体进度
  const mainProgress = STEP_PROGRESS_MAP[mainStep] || 0;
  const prevProgress = STEP_PROGRESS_MAP[getPrevMainStep(mainStep)] || 0;
  const subStepProgress = prevProgress + ((currentSubStep + 1) / totalSubSteps) * (mainProgress - prevProgress);
  
  const canGoNext = currentSubStep < totalSubSteps - 1;
  const canGoBack = currentSubStep > 0;
  const isLastSubStep = currentSubStep === totalSubSteps - 1;
  const isFirstSubStep = currentSubStep === 0;

  // 从 localStorage 恢复子步骤状态
  useEffect(() => {
    const saved = localStorage.getItem(`substep_${mainStep}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.currentSubStep !== undefined) {
          setCurrentSubStep(parsed.currentSubStep);
        }
      } catch (e) {
        console.error('Failed to load substep progress:', e);
      }
    } else {
      setCurrentSubStep(0);
    }
  }, [mainStep]);

  // 保存子步骤状态到 localStorage
  const saveSubStepState = useCallback(() => {
    localStorage.setItem(`substep_${mainStep}`, JSON.stringify({
      currentSubStep,
      timestamp: Date.now(),
    }));
  }, [mainStep, currentSubStep]);

  const goToNextSubStep = useCallback(() => {
    if (canGoNext) {
      const nextStep = currentSubStep + 1;
      setCurrentSubStep(nextStep);
      localStorage.setItem(`substep_${mainStep}`, JSON.stringify({
        currentSubStep: nextStep,
        timestamp: Date.now(),
      }));
    } else if (isLastSubStep && onNextMainStep) {
      // 先清除当前子步骤状态，避免新页面读取到旧状态
      localStorage.removeItem(`substep_${mainStep}`);
      // 进入下一个主步骤
      const nextMainStep = getNextMainStep(mainStep);
      onSaveProgress(mainStep, mainProgress);
      onNextMainStep(nextMainStep);
    }
  }, [canGoNext, isLastSubStep, currentSubStep, mainStep, mainProgress, onSaveProgress, onNextMainStep, totalSubSteps]);

  const goToPrevSubStep = useCallback(() => {
    if (canGoBack) {
      const prevStep = currentSubStep - 1;
      setCurrentSubStep(prevStep);
      localStorage.setItem(`substep_${mainStep}`, JSON.stringify({
        currentSubStep: prevStep,
        timestamp: Date.now(),
      }));
    } else if (isFirstSubStep) {
      // 返回上一个主步骤
      onBackMainStep();
      // 清除当前子步骤状态
      localStorage.removeItem(`substep_${mainStep}`);
    }
  }, [canGoBack, isFirstSubStep, currentSubStep, mainStep, onBackMainStep]);

  const goToSubStep = useCallback((index: number) => {
    if (index >= 0 && index < totalSubSteps) {
      setCurrentSubStep(index);
      localStorage.setItem(`substep_${mainStep}`, JSON.stringify({
        currentSubStep: index,
        timestamp: Date.now(),
      }));
    }
  }, [totalSubSteps, mainStep]);

  const saveCurrentProgress = useCallback(() => {
    onSaveProgress(mainStep, Math.round(subStepProgress));
    saveSubStepState();
  }, [onSaveProgress, mainStep, subStepProgress, saveSubStepState]);

  return {
    currentSubStep,
    totalSubSteps,
    subStepTitle,
    subStepProgress: Math.round(subStepProgress),
    canGoNext,
    canGoBack,
    isLastSubStep,
    isFirstSubStep,
    goToNextSubStep,
    goToPrevSubStep,
    goToSubStep,
    saveCurrentProgress,
  };
}

// 获取下一个主步骤
function getNextMainStep(current: QuestionnaireStep): QuestionnaireStep {
  const stepOrder: QuestionnaireStep[] = ['welcome', 'profile', 'diagnosis', 'product', 'operation', 'resource', 'report'];
  const currentIndex = stepOrder.indexOf(current);
  return stepOrder[Math.min(currentIndex + 1, stepOrder.length - 1)];
}

// 获取上一个主步骤
function getPrevMainStep(current: QuestionnaireStep): QuestionnaireStep {
  const stepOrder: QuestionnaireStep[] = ['welcome', 'profile', 'diagnosis', 'product', 'operation', 'resource', 'report'];
  const currentIndex = stepOrder.indexOf(current);
  return stepOrder[Math.max(currentIndex - 1, 0)];
}
