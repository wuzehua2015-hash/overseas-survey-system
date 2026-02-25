// GitHub Storage Service
// 将表单数据直接提交到 GitHub 仓库

const GITHUB_REPO = 'wuzehua2015-hash/overseas-survey-system';
const GITHUB_BRANCH = 'gh-pages';
const DATA_PATH = 'data/submissions';

export interface SubmissionData {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  industry: string;
  assessmentScore: number;
  stage: string;
  companyLevel: string;
  submitTime: string;
  followUpStatus: string;
}

// 从 window 对象获取 Token（运行时注入）
function getGitHubToken(): string | null {
  return (window as any).VITE_GITHUB_TOKEN || null;
}

export async function submitToGitHub(data: SubmissionData): Promise<boolean> {
  const token = getGitHubToken();
  
  if (!token) {
    console.error('GitHub Token not configured');
    // 备用：保存到 localStorage
    saveToLocalStorage(data);
    return false;
  }

  try {
    const filename = `submission-${Date.now()}.json`;
    const content = btoa(JSON.stringify(data, null, 2));
    
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_PATH}/${filename}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Add submission: ${data.companyName}`,
          content: content,
          branch: GITHUB_BRANCH
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('GitHub API error:', error);
      // 备用：保存到 localStorage
      saveToLocalStorage(data);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Submit to GitHub failed:', error);
    // 备用：保存到 localStorage
    saveToLocalStorage(data);
    return false;
  }
}

// 备用：保存到 localStorage
export function saveToLocalStorage(data: SubmissionData): void {
  const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
  submissions.push(data);
  localStorage.setItem('submissions', JSON.stringify(submissions));
}
