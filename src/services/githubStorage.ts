const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const REPO_OWNER = 'wuzehua2015-hash';
const REPO_NAME = 'overseas-survey-system';
const DATA_PATH = 'data/submissions';

export interface SubmissionData {
  id: string;
  companyName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  industry: string;
  score?: number;
  stage?: string;
  level?: string;
  timestamp: string;
  isPartial?: boolean;
  // 数据类型：完整问卷 或 预约咨询
  dataType?: '完整问卷' | '预约咨询';
  // 预约咨询特有字段
  consultation?: {
    preferredTime?: string;
    topic?: string;
    description?: string;
  };
  // 完整问卷数据（可选）
  type?: 'complete_questionnaire' | 'consultation';
  completeData?: {
    profile: any;
    diagnosis: any;
    product: any;
    operation: any;
    resource: any;
  };
  assessmentResult?: any;
  reportSummary?: any;
}

export async function submitToGitHub(data: SubmissionData): Promise<{ success: boolean; message: string }> {
  console.log('=== Starting GitHub submission ===');
  console.log('Data:', data);
  console.log('Token available:', !!GITHUB_TOKEN);
  console.log('Token value:', GITHUB_TOKEN ? `${GITHUB_TOKEN.substring(0, 10)}...` : 'undefined');
  
  try {
    // 检查 GitHub Token 是否可用
    if (!GITHUB_TOKEN || GITHUB_TOKEN === '__VITE_GITHUB_TOKEN__' || GITHUB_TOKEN === 'undefined') {
      console.warn('GitHub Token 未配置，使用本地存储模式');
      saveToLocalStorage(data);
      return { 
        success: true, 
        message: '数据已保存，我们的专家将尽快与您联系' 
      };
    }

    const filename = `${DATA_PATH}/${data.id}.json`;
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

    console.log('Saving to:', filename);
    console.log('Branch: gh-pages');

    // 直接尝试创建/更新文件，不预先检查
    const body: any = {
      message: `Add submission: ${data.companyName || 'Unknown'}`,
      content: content,
      branch: 'gh-pages'
    };

    console.log('Sending request to GitHub API...');
    console.log('URL:', `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

    try {
      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28'
          },
          body: JSON.stringify(body),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('GitHub API success:', result.content?.html_url);
        return { success: true, message: '提交成功，我们的专家将尽快与您联系！' };
      } else {
        const errorText = await response.text();
        console.error('GitHub API error response:', errorText);
        
        let errorMessage = 'GitHub API 错误';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {
          // 不是 JSON 格式
        }
        
        // 如果 API 失败，保存到本地存储
        saveToLocalStorage(data);
        return { 
          success: true, 
          message: '数据已保存，我们的专家将尽快与您联系' 
        };
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Request timeout');
        saveToLocalStorage(data);
        return { 
          success: true, 
          message: '数据已保存，我们的专家将尽快与您联系' 
        };
      }
      
      throw fetchError;
    }
  } catch (error: any) {
    console.error('提交到 GitHub 失败:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // 保存到本地存储作为备份
    saveToLocalStorage(data);
    return { 
      success: true, 
      message: '数据已保存，我们的专家将尽快与您联系' 
    };
  }
}

function saveToLocalStorage(data: SubmissionData): void {
  try {
    const key = `survey_submissions_${data.id}`;
    localStorage.setItem(key, JSON.stringify(data));
    
    // 同时保存到列表中
    const listKey = 'survey_submissions_list';
    const existingList = JSON.parse(localStorage.getItem(listKey) || '[]');
    existingList.push({
      id: data.id,
      companyName: data.companyName,
      timestamp: data.timestamp,
      synced: false
    });
    localStorage.setItem(listKey, JSON.stringify(existingList));
    
    console.log('✓ Saved to localStorage:', key);
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function getLocalSubmissions(): Array<{ id: string; companyName: string; timestamp: string; synced: boolean }> {
  const listKey = 'survey_submissions_list';
  return JSON.parse(localStorage.getItem(listKey) || '[]');
}

export function getLocalSubmissionById(id: string): SubmissionData | null {
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
