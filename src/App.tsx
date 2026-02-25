import { useQuestionnaire } from '@/hooks/useQuestionnaire';
import { WelcomePage } from '@/sections/WelcomePage';
import { ProfilePage } from '@/sections/ProfilePage';
import { DiagnosisPage } from '@/sections/DiagnosisPage';
import { ProductPage } from '@/sections/ProductPage';
import { OperationPage } from '@/sections/OperationPage';
import { ResourcePage } from '@/sections/ResourcePage';
import { ReportPage } from '@/sections/ReportPage';
import type { QuestionnaireStep } from '@/types/questionnaire';
import './App.css';

function App() {
  const {
    data,
    currentStep,
    setCurrentStep,
    savedProgress,
    saveProgress,
    updateProfile,
    updateDiagnosis,
    updateProduct,
    updateOperation,
    updateResource,
    generateReportData,
    resetQuestionnaire,
  } = useQuestionnaire();

  const handleStart = (step: QuestionnaireStep) => {
    setCurrentStep(step);
  };

  const handleContinue = () => {
    // 根据保存的数据恢复到对应的步骤
    if (data.profile.name) {
      if (!data.diagnosis.stage) {
        setCurrentStep('diagnosis');
      } else if (data.product.certifications.length === 0 && !data.product.pricePositioning) {
        setCurrentStep('product');
      } else if (!data.operation.digitalLevel) {
        setCurrentStep('operation');
      } else if (!data.resource.exportBudget) {
        setCurrentStep('resource');
      } else {
        setCurrentStep('report');
      }
    } else {
      setCurrentStep('profile');
    }
  };

  const handleNext = (step: QuestionnaireStep) => {
    setCurrentStep(step);
  };

  const handleBack = () => {
    const stepMap: Record<QuestionnaireStep, QuestionnaireStep> = {
      'welcome': 'welcome',
      'profile': 'welcome',
      'diagnosis': 'profile',
      'product': 'diagnosis',
      'operation': 'product',
      'resource': 'operation',
      'report': 'welcome',
    };
    setCurrentStep(stepMap[currentStep]);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <WelcomePage
            onStart={handleStart}
            savedProgress={savedProgress}
            onContinue={handleContinue}
          />
        );
      
      case 'profile':
        return (
          <ProfilePage
            data={data.profile}
            onUpdate={updateProfile}
            onNext={handleNext}
            onSaveProgress={saveProgress}
          />
        );
      
      case 'diagnosis':
        return (
          <DiagnosisPage
            data={data.diagnosis}
            onUpdate={updateDiagnosis}
            onNext={handleNext}
            onBack={handleBack}
            onSaveProgress={saveProgress}
          />
        );
      
      case 'product':
        return (
          <ProductPage
            data={data.product}
            onUpdate={updateProduct}
            onNext={handleNext}
            onBack={handleBack}
            onSaveProgress={saveProgress}
          />
        );
      
      case 'operation':
        return (
          <OperationPage
            data={data.operation}
            onUpdate={updateOperation}
            onNext={handleNext}
            onBack={handleBack}
            onSaveProgress={saveProgress}
          />
        );
      
      case 'resource':
        return (
          <ResourcePage
            data={data.resource}
            onUpdate={updateResource}
            onNext={handleNext}
            onBack={handleBack}
            onSaveProgress={saveProgress}
          />
        );
      
      case 'report':
        return (
          <ReportPage
            reportData={generateReportData()}
            onReset={resetQuestionnaire}
          />
        );
      
      default:
        return (
          <WelcomePage
            onStart={handleStart}
            savedProgress={savedProgress}
            onContinue={handleContinue}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {renderCurrentStep()}
    </div>
  );
}

export default App;
