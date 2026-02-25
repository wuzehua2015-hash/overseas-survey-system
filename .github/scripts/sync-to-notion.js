// GitHub → Notion 同步脚本
// 当有新提交时，自动同步到 Notion 数据库

const https = require('https');
const fs = require('fs');
const path = require('path');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const DATA_DIR = 'data/submissions';

// 读取所有提交文件
function getSubmissions() {
  const files = fs.readdirSync(DATA_DIR);
  const submissions = [];
  
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
  
  return submissions;
}

// 检查是否已同步到 Notion
async function isSynced(submission) {
  return false;
}

// 提交到 Notion
async function submitToNotion(submission) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        '企业名称': {
          title: [{ text: { content: submission.companyName || '未填写' } }]
        },
        '联系人': {
          rich_text: [{ text: { content: submission.contactName || '' } }]
        },
        '联系电话': {
          rich_text: [{ text: { content: submission.phone || '' } }]
        },
        '联系邮箱': {
          rich_text: [{ text: { content: submission.email || '' } }]
        },
        '所属行业': {
          rich_text: [{ text: { content: submission.industry || '' } }]
        },
        '评估得分': {
          number: submission.assessmentScore || 0
        },
        '出海阶段': {
          rich_text: [{ text: { content: submission.stage || '' } }]
        },
        '企业等级': {
          rich_text: [{ text: { content: submission.companyLevel || '' } }]
        },
        '提交时间': {
          date: { start: submission.submitTime || new Date().toISOString() }
        },
        '跟进状态': {
          select: { name: submission.followUpStatus || '待跟进' }
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
          console.log(`✅ 同步成功: ${submission.companyName}`);
          resolve(JSON.parse(responseData));
        } else {
          console.error(`❌ 同步失败: ${submission.companyName}`, responseData);
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error(`请求错误:`, e.message);
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

// 主函数
async function main() {
  console.log('🚀 开始同步到 Notion...');
  
  if (!NOTION_API_KEY) {
    console.error('❌ 错误: 未设置 NOTION_API_KEY');
    process.exit(1);
  }
  
  if (!NOTION_DATABASE_ID) {
    console.error('❌ 错误: 未设置 NOTION_DATABASE_ID');
    process.exit(1);
  }
  
  const submissions = getSubmissions();
  console.log(`📁 找到 ${submissions.length} 条提交记录`);
  
  for (const submission of submissions) {
    try {
      await submitToNotion(submission);
    } catch (e) {
      console.error(`同步失败:`, e.message);
    }
  }
  
  console.log('✅ 同步完成');
}

main();
