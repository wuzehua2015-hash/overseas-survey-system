// Notion 直接写入服务
// 用户提交后直接写入 Notion，绕过 GitHub Actions

const NOTION_API_KEY = import.meta.env.VITE_NOTION_API_KEY;
const NOTION_DATABASE_ID = import.meta.env.VITE_NOTION_DATABASE_ID || '31155e5e-0a9e-8142-8361-c394d107afe3';

export interface NotionSubmissionData {
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
  type?: 'complete_questionnaire' | 'consultation';
  completeData?: {
    profile: any;
    diagnosis: any;
    product: any;
    operation: any;
    resource: any;
  };
  assessmentResult?: any;
}

export async function submitToNotion(data: NotionSubmissionData): Promise<{ success: boolean; message: string }> {
  console.log('=== Starting Notion submission ===');
  console.log('Data:', data);
  
  if (!NOTION_API_KEY) {
    console.warn('Notion API Key not configured');
    return { success: false, message: 'Notion API Key 未配置' };
  }

  try {
    const isCompleteQuestionnaire = data.type === 'complete_questionnaire';
    
    // 构建属性对象
    const properties: any = {
      '提交ID': {
        rich_text: [{ text: { content: data.id } }]
      },
      '企业名称': {
        title: [{ text: { content: data.companyName || '未填写企业名称' } }]
      },
      '联系人': {
        rich_text: [{ text: { content: data.contactName || '未填写' } }]
      },
      '联系电话': {
        rich_text: [{ text: { content: data.contactPhone || '未填写' } }]
      },
      '联系邮箱': {
        rich_text: [{ text: { content: data.contactEmail || '未填写' } }]
      },
      '所属行业': {
        rich_text: [{ text: { content: data.industry || '未填写' } }]
      },
      '评估得分': {
        number: typeof data.score === 'number' ? data.score : (data.assessmentResult?.totalScore || 0)
      },
      '出海阶段': {
        select: { name: data.stage || data.assessmentResult?.stage || '未评估' }
      },
      '企业等级': {
        select: { name: data.level || data.assessmentResult?.level || '未评估' }
      },
      '提交时间': {
        date: { start: data.timestamp || new Date().toISOString() }
      },
      '跟进状态': {
        select: { name: '待跟进' }
      },
      '数据类型': {
        select: { name: isCompleteQuestionnaire ? '完整问卷' : '咨询提交' }
      }
    };

    // 完整问卷额外字段
    if (isCompleteQuestionnaire && data.completeData) {
      const revenue = data.completeData.profile?.annualRevenue;
      if (revenue) {
        properties['年营业额'] = { rich_text: [{ text: { content: revenue } }] };
      }
      
      const employees = data.completeData.profile?.employeeCount;
      if (employees) {
        properties['员工规模'] = { rich_text: [{ text: { content: employees } }] };
      }
      
      const exportValue = data.completeData.diagnosis?.annualExportValue;
      if (exportValue) {
        properties['年出口额'] = { rich_text: [{ text: { content: exportValue } }] };
      }
      
      const hasTeam = data.completeData.diagnosis?.teamConfig?.hasDedicatedTeam;
      if (hasTeam !== undefined) {
        properties['有外贸团队'] = { select: { name: hasTeam ? '是' : '否' } };
      }
      
      if (data.assessmentResult?.dimensionScores) {
        const ds = data.assessmentResult.dimensionScores;
        properties['基础能力'] = { number: ds.foundation };
        properties['产品竞争力'] = { number: ds.product };
        properties['运营能力'] = { number: ds.operation };
        properties['资源配置'] = { number: ds.resource };
        properties['发展潜力'] = { number: ds.potential };
      }
    }

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: properties
      })
    });

    if (response.ok) {
      console.log('✓ Notion submission successful');
      return { success: true, message: '提交成功，我们的专家将尽快与您联系！' };
    } else {
      const error = await response.text();
      console.error('Notion API error:', error);
      return { success: false, message: 'Notion 写入失败' };
    }
  } catch (error: any) {
    console.error('Notion submission error:', error);
    return { success: false, message: error.message };
  }
}
