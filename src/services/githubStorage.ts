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
  score: number;
  stage: string;
  level: string;
  timestamp: string;
}

export async function submitToGitHub(data: SubmissionData): Promise<{ success: boolean; message: string }> {
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
    const content = btoa(JSON.stringify(data, null, 2));

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
      message: `Add submission: ${data.companyName}`,
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

function saveToLocalStorage(data: SubmissionData): void {
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
