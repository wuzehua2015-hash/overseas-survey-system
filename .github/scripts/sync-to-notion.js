// GitHub → Notion 同步脚本
// 当有新提交时，自动同步到 Notion 数据库

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const DATA_DIR = process.env.DATA_PATH || '../gh-pages/data/submissions';

// 读取所有提交文件
function getSubmissions() {
  const submissions = [];
  
  try {
    const files = fs.readdirSync(DATA_DIR);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
        try {
          submissions.push(JSON.parse(content));
        } catch (e) {
          console.error(`解析 ${file} 失败:`, e.message);
        }
      }
    }
  } catch (e) {
    console.error(`读取目录 ${DATA_DIR} 失败:`, e.message);
  }
  
  return submissions;
}

// 提取企业名称（兼容新旧数据格式）
function getCompanyName(submission) {
  // 新格式: submission.profile.companyName
  if (submission.profile && submission.profile.companyName) {
    return submission.profile.companyName;
  }
  // 旧格式: submission.companyName
  if (submission.companyName) {
    return submission.companyName;
  }
  return '未填写';
}

// 提取联系人信息（兼容新旧数据格式）
function getContactInfo(submission) {
  // 新格式
  if (submission.profile) {
    return {
      name: submission.profile.contactName || '',
      phone: submission.profile.contactPhone || '',
      email: submission.profile.contactEmail || '',
      industry: submission.profile.industry || ''
    };
  }
  // 旧格式
  return {
    name: submission.contactName || '',
    phone: submission.contactPhone || '',
    email: submission.contactEmail || '',
    industry: submission.industry || ''
  };
}

// 提取评估结果（兼容新旧数据格式）
function getAssessment(submission) {
  // 新格式: submission.assessment
  if (submission.assessment) {
    return {
      score: submission.assessment.score || 0,
      stage: submission.assessment.stage || '',
      level: submission.assessment.level || ''
    };
  }
  // 旧格式
  return {
    score: submission.totalScore || submission.score || 0,
    stage: submission.stage || '',
    level: submission.level || ''
  };
}

// 提交到 Notion
async function submitToNotion(submission) {
  return new Promise((resolve, reject) => {
    const companyName = getCompanyName(submission);
    const contact = getContactInfo(submission);
    const assessment = getAssessment(submission);
    
    const data = JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        '企业名称': {
          title: [{ text: { content: companyName } }]
        },
        '联系人': {
          rich_text: [{ text: { content: contact.name } }]
        },
        '联系电话': {
          rich_text: [{ text: { content: contact.phone } }]
        },
        '联系邮箱': {
          rich_text: [{ text: { content: contact.email } }]
        },
        '所属行业': {
          rich_text: [{ text: { content: contact.industry } }]
        },
        '评估得分': {
          number: assessment.score
        },
        '出海阶段': {
          select: { name: assessment.stage || '未分类' }
        },
        '企业等级': {
          select: { name: assessment.level || '未分类' }
        },
        '提交时间': {
          date: { start: submission.timestamp || new Date().toISOString() }
        },
        '跟进状态': {
          select: { name: '待跟进' }
        }
      }
    });

    const options = {
      hostname: 'api.notion.com',
      port: 443,
      path: '/v1/pages',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ 同步成功: ${companyName}`);
          resolve(JSON.parse(responseData));
        } else {
          console.error(`❌ 同步失败: ${companyName}`, responseData);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`请求错误:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// 主函数
async function main() {
  console.log('开始同步到 Notion...');
  console.log(`数据目录: ${DATA_DIR}`);
  
  if (!NOTION_API_KEY) {
    console.error('错误: 未设置 NOTION_API_KEY');
    process.exit(1);
  }
  
  if (!NOTION_DATABASE_ID) {
    console.error('错误: 未设置 NOTION_DATABASE_ID');
    process.exit(1);
  }
  
  const submissions = getSubmissions();
  console.log(`找到 ${submissions.length} 条提交记录`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const submission of submissions) {
    try {
      await submitToNotion(submission);
      successCount++;
    } catch (error) {
      failCount++;
    }
  }
  
  console.log(`\n同步完成: ${successCount} 成功, ${failCount} 失败`);
  process.exit(failCount > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('同步失败:', error);
  process.exit(1);
});
