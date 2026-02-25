const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const REPO_OWNER = 'wuzehua2015-hash';
const REPO_NAME = 'overseas-survey-system';
const DATA_PATH = 'data/submissions';

// 完整问卷数据接口
export interface FullSubmissionData {
  id: string;
  timestamp: string;
  dataType: '完整问卷' | '预约咨询';
  // 企业画像
  profile: {
    companyName: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    industry: string;
    companyNature: string;
    companyType: string;
    annualRevenue: string;
    employeeCount: string;
    mainProduct: string;
    coreCompetency: string[];
  };
  // 评估结果
  assessment: {
    score: number;
    stage: string;
    level: string;
    dimensionScores: {
      foundation: number;
      product: number;
      operation: number;
      resource: number;
      potential: number;
    };
  };
  // 完整问卷数据（可选，用于深度分析）
  fullData?: Record<string, unknown>;
  // 预约咨询专用字段
  consultation?: {
    preferredTime: string;
    topic: string;
    description: string;
  };
}

// 兼容旧接口
export interface SubmissionData {
  id: string;
  companyName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  industry: string;
  score: number;
  stage: string;
  level: string;
  timestamp: string;
}

export async function submitToGitHub(data: SubmissionData | FullSubmissionData): Promise<{ success: boolean; message: string }> {
  try {
    // 检查 GitHub Token 是否可用
    if (!GITHUB_TOKEN || GITHUB_TOKEN === '__VITE_GITHUB_TOKEN__') {
      console.warn('GitHub Token 未配置，使用本地存储模式');
      saveToLocalStorage(data);
      return { 
        success: true, 
        message: '数据已保存到本地存储（GitHub Token 未配置）' 
      };
    }

    const filename = `${DATA_PATH}/${data.id}.json`;
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

    // 检查文件是否已存在
    let sha: string | undefined;
    try {
      const checkResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`,
        {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      if (checkResponse.ok) {
        const fileData = await checkResponse.json();
        sha = fileData.sha;
      }
    } catch (e) {
      // 文件不存在，继续创建
    }

    // 创建或更新文件
    const body: any = {
      message: `Add submission: ${(data as SubmissionData).companyName || (data as FullSubmissionData).profile?.companyName || 'Unknown'}`,
      content: content,
      branch: 'gh-pages'
    };
    
    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    if (response.ok) {
      return { success: true, message: '数据已成功提交到 GitHub' };
    } else {
      const error = await response.json();
      console.error('GitHub API 错误:', error);
      
      // 如果 API 失败，保存到本地存储
      saveToLocalStorage(data);
      return { 
        success: true, 
        message: `GitHub 提交失败，已保存到本地: ${error.message}` 
      };
    }
  } catch (error) {
    console.error('提交到 GitHub 失败:', error);
    
    // 保存到本地存储作为备份
    saveToLocalStorage(data);
    return { 
      success: true, 
      message: '网络错误，数据已保存到本地存储' 
    };
  }
}

function saveToLocalStorage(data: SubmissionData | FullSubmissionData): void {
  const key = `survey_submissions_${data.id}`;
  localStorage.setItem(key, JSON.stringify(data));
  
  // 同时保存到列表中
  const listKey = 'survey_submissions_list';
  const existingList = JSON.parse(localStorage.getItem(listKey) || '[]');
  const companyName = (data as SubmissionData).companyName || (data as FullSubmissionData).profile?.companyName || 'Unknown';
  existingList.push({
    id: data.id,
    companyName: companyName,
    timestamp: data.timestamp,
    synced: false
  });
  localStorage.setItem(listKey, JSON.stringify(existingList));
}

export function getLocalSubmissions(): Array<{ id: string; companyName: string; timestamp: string; synced: boolean }> {
  const listKey = 'survey_submissions_list';
  return JSON.parse(localStorage.getItem(listKey) || '[]');
}

export function getLocalSubmissionById(id: string): SubmissionData | FullSubmissionData | null {
  const key = `survey_submissions_${id}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function clearLocalSubmissions(): void {
  const list = getLocalSubmissions();
  list.forEach(item => {
    localStorage.removeItem(`survey_submissions_${item.id}`);
  });
  localStorage.removeItem('survey_submissions_list');
}
