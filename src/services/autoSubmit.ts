import { submitToGitHub, type SubmissionData } from './githubStorage';
import { submitToNotion } from './notionDirect';
import { industryOptions } from '@/types/questionnaire';

// 自动提交用户联系信息到 GitHub 和 Notion
export async function autoSubmitContactInfo(
  profile: {
    name: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    industry: string;
  },
  assessmentResult: {
    totalScore: number;
    stage: string;
    level: string;
  }
): Promise<{ success: boolean; message: string; alreadySubmitted: boolean; silentlySaved: boolean }> {
  // 检查是否已经自动提交过（避免重复提交）
  const storageKey = `auto_submitted_${profile.name}_${profile.contactPhone}`;
  const alreadySubmitted = localStorage.getItem(storageKey);
  
  if (alreadySubmitted) {
    console.log('Contact info already auto-submitted');
    return { 
      success: true, 
      message: '联系信息已自动提交',
      alreadySubmitted: true,
      silentlySaved: true
    };
  }

  // 智能补全机制：如果信息不完整，尝试从 localStorage 补充
  let enhancedProfile = { ...profile };
  
  // 尝试从问卷数据中补充缺失信息
  const savedProgress = localStorage.getItem('questionnaire_progress_v2');
  if (savedProgress) {
    try {
      const parsed = JSON.parse(savedProgress);
      const savedData = parsed.data;
      
      if (savedData?.profile) {
        // 补充企业名称
        if (!enhancedProfile.name && savedData.profile.name) {
          enhancedProfile.name = savedData.profile.name;
        }
        // 补充联系人
        if (!enhancedProfile.contactName && savedData.profile.contactName) {
          enhancedProfile.contactName = savedData.profile.contactName;
        }
        // 补充电话
        if (!enhancedProfile.contactPhone && savedData.profile.contactPhone) {
          enhancedProfile.contactPhone = savedData.profile.contactPhone;
        }
        // 补充邮箱
        if (!enhancedProfile.contactEmail && savedData.profile.contactEmail) {
          enhancedProfile.contactEmail = savedData.profile.contactEmail;
        }
        // 补充行业
        if (!enhancedProfile.industry && savedData.profile.industry) {
          enhancedProfile.industry = savedData.profile.industry;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved progress:', e);
    }
  }

  // 转换行业名称为中文
  const industryMap = Object.fromEntries(industryOptions.map(i => [i.value, i.label]));
  const industryLabel = industryMap[enhancedProfile.industry] || enhancedProfile.industry || '未填写行业';

  // 检查联系信息是否完整
  const hasContactInfo = enhancedProfile.contactName || enhancedProfile.contactPhone || enhancedProfile.contactEmail;
  const isComplete = enhancedProfile.contactName && enhancedProfile.contactPhone && enhancedProfile.contactEmail;
  
  // 静默保存机制：即使信息不完整也保存，但不显示错误提示
  if (!hasContactInfo) {
    console.log('No contact info available, skipping auto-submit');
    return { 
      success: false, 
      message: '',
      alreadySubmitted: false,
      silentlySaved: true // 静默处理，不显示任何提示
    };
  }

  const submissionData: SubmissionData = {
    id: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    companyName: enhancedProfile.name || '未填写企业名称',
    contactName: enhancedProfile.contactName || '未填写',
    contactPhone: enhancedProfile.contactPhone || '未填写',
    contactEmail: enhancedProfile.contactEmail || '未填写',
    industry: industryLabel, // 使用中文行业名称
    score: assessmentResult.totalScore,
    stage: assessmentResult.stage,
    level: assessmentResult.level,
    timestamp: new Date().toISOString(),
    isPartial: !isComplete, // 标记是否为部分提交
  };

  console.log('Auto-submitting contact info:', submissionData);

  try {
    // 并行提交到 GitHub 和 Notion
    const [githubResult, notionResult] = await Promise.all([
      submitToGitHub(submissionData),
      submitToNotion(submissionData)
    ]);
    
    console.log('GitHub result:', githubResult);
    console.log('Notion result:', notionResult);
    
    // 只要有一个成功就算成功
    const success = githubResult.success || notionResult.success;
    
    if (success) {
      // 标记为已提交
      localStorage.setItem(storageKey, 'true');
      localStorage.setItem(`${storageKey}_time`, new Date().toISOString());
      localStorage.setItem(`${storageKey}_data`, JSON.stringify(submissionData));
      
      return {
        success: true,
        message: '', // 静默成功，不显示提示
        alreadySubmitted: false,
        silentlySaved: true
      };
    }
    
    // 提交失败也静默处理
    return {
      success: false,
      message: '',
      alreadySubmitted: false,
      silentlySaved: true
    };
  } catch (error) {
    console.error('Auto-submit failed:', error);
    // 静默失败，不显示错误提示
    return {
      success: false,
      message: '',
      alreadySubmitted: false,
      silentlySaved: true
    };
  }
}

// 检查是否已经自动提交
export function hasAutoSubmitted(companyName: string, contactPhone: string): boolean {
  const storageKey = `auto_submitted_${companyName}_${contactPhone}`;
  return !!localStorage.getItem(storageKey);
}

// 清除自动提交记录（用于测试）
export function clearAutoSubmitRecord(companyName: string, contactPhone: string): void {
  const storageKey = `auto_submitted_${companyName}_${contactPhone}`;
  localStorage.removeItem(storageKey);
  localStorage.removeItem(`${storageKey}_time`);
  localStorage.removeItem(`${storageKey}_data`);
}

// 获取已保存的提交记录
export function getAutoSubmitRecord(companyName: string, contactPhone: string): SubmissionData | null {
  const storageKey = `auto_submitted_${companyName}_${contactPhone}`;
  const data = localStorage.getItem(`${storageKey}_data`);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
  return null;
}
