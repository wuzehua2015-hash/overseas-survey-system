// GitHub → Notion 同步脚本
// 支持双数据库：完整问卷数据库 + 预约咨询数据库

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_CONSULTATION_DATABASE_ID = process.env.NOTION_CONSULTATION_DATABASE_ID;
const DATA_DIR = process.env.DATA_PATH || '../gh-pages/data/submissions';

// 行业中文映射表
const industryMap = {
  'machinery': '机械设备',
  'electronics': '电子电气',
  'auto': '汽车及零部件',
  'textile': '纺织服装',
  'chemical': '化工及新材料',
  'medical': '医疗器械',
  'building': '建材五金',
  'furniture': '家具家居',
  'food': '食品饮料',
  'beauty': '美妆个护',
  'sports': '体育户外',
  'toys': '玩具礼品',
  'packaging': '包装印刷',
  'energy': '新能源',
  'other': '其他行业'
};

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
  if (submission.profile && submission.profile.companyName) {
    return submission.profile.companyName;
  }
  if (submission.companyName) {
    return submission.companyName;
  }
  return '未填写';
}

// 提取联系人信息（兼容新旧数据格式）
function getContactInfo(submission) {
  if (submission.profile) {
    return {
      name: submission.profile.contactName || '',
      phone: submission.profile.contactPhone || '',
      email: submission.profile.contactEmail || '',
      industry: submission.profile.industry || ''
    };
  }
  return {
    name: submission.contactName || '',
    phone: submission.contactPhone || '',
    email: submission.contactEmail || '',
    industry: submission.industry || ''
  };
}

// 提取评估结果（兼容新旧数据格式）
function getAssessment(submission) {
  if (submission.assessment) {
    return {
      score: submission.assessment.score || 0,
      stage: submission.assessment.stage || '',
      level: submission.assessment.level || ''
    };
  }
  return {
    score: submission.totalScore || submission.score || 0,
    stage: submission.stage || '',
    level: submission.level || ''
  };
}

// 获取数据类型
function getDataType(submission) {
  if (submission.dataType) {
    return submission.dataType;
  }
  if (submission.consultation && submission.consultation.topic) {
    return '预约咨询';
  }
  return '完整问卷';
}

// 查询 Notion 数据库检查记录是否已存在
async function findExistingRecord(databaseId, submissionId) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      filter: {
        property: '提交ID',
        rich_text: {
          equals: submissionId
        }
      }
    });

    const options = {
      hostname: 'api.notion.com',
      port: 443,
      path: `/v1/databases/${databaseId}/query`,
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
        try {
          const data = JSON.parse(responseData);
          if (res.statusCode === 200) {
            resolve(data.results.length > 0 ? data.results[0] : null);
          } else {
            console.error('查询现有记录失败:', data);
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.error('查询请求错误:', error.message);
      resolve(null);
    });

    req.write(data);
    req.end();
  });
}

// 提交到 Notion
async function submitToNotion(databaseId, submission) {
  return new Promise((resolve, reject) => {
    const companyName = getCompanyName(submission);
    const contact = getContactInfo(submission);
    const assessment = getAssessment(submission);
    const dataType = getDataType(submission);
    const consultation = submission.consultation || {};
    
    // 构建基础属性
    const industryLabel = industryMap[contact.industry] || contact.industry || '未填写';
    const properties = {
      '提交ID': {
        rich_text: [{ text: { content: submission.id || '' } }]
      },
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
        rich_text: [{ text: { content: industryLabel } }]
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
      },
      '数据类型': {
        select: { name: dataType }
      }
    };
    
    // 如果是预约咨询，添加额外字段
    if (dataType === '预约咨询') {
      properties['期望咨询时间'] = {
        date: { start: consultation.preferredTime || submission.timestamp || new Date().toISOString() }
      };
      properties['咨询主题'] = {
        select: { name: consultation.topic || '其他' }
      };
      properties['具体需求描述'] = {
        rich_text: [{ text: { content: consultation.description || '' } }]
      };
    }
    
    const data = JSON.stringify({
      parent: { database_id: databaseId },
      properties: properties
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
          resolve(JSON.parse(responseData));
        } else {
          console.error(`同步失败: ${companyName}`, responseData);
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

  console.log(`完整问卷数据库: ${NOTION_DATABASE_ID}`);
  console.log(`预约咨询数据库: ${NOTION_CONSULTATION_DATABASE_ID || '未配置'}`);
  
  const submissions = getSubmissions();
  console.log(`找到 ${submissions.length} 条提交记录`);
  
  let fullSurveySuccess = 0;
  let fullSurveySkip = 0;
  let fullSurveyFail = 0;
  let consultationSuccess = 0;
  let consultationSkip = 0;
  let consultationFail = 0;
  
  for (const submission of submissions) {
    const dataType = getDataType(submission);
    const companyName = getCompanyName(submission);
    
    // 根据数据类型选择目标数据库
    const targetDatabaseId = (dataType === '预约咨询' && NOTION_CONSULTATION_DATABASE_ID) 
      ? NOTION_CONSULTATION_DATABASE_ID 
      : NOTION_DATABASE_ID;
    
    try {
      // 检查是否已存在
      const existing = await findExistingRecord(targetDatabaseId, submission.id);
      
      if (existing) {
        console.log(`⚠️ 已存在，跳过: ${companyName} (${dataType})`);
        if (dataType === '预约咨询') {
          consultationSkip++;
        } else {
          fullSurveySkip++;
        }
        continue;
      }
      
      // 提交到 Notion
      await submitToNotion(targetDatabaseId, submission);
      console.log(`✅ 同步成功: ${companyName} (${dataType})`);
      
      if (dataType === '预约咨询') {
        consultationSuccess++;
      } else {
        fullSurveySuccess++;
      }
    } catch (error) {
      console.error(`❌ 同步失败: ${companyName}`, error.message);
      if (dataType === '预约咨询') {
        consultationFail++;
      } else {
        fullSurveyFail++;
      }
    }
  }
  
  console.log(`\n同步完成:`);
  console.log(`  完整问卷: ${fullSurveySuccess} 成功, ${fullSurveySkip} 跳过, ${fullSurveyFail} 失败`);
  console.log(`  预约咨询: ${consultationSuccess} 成功, ${consultationSkip} 跳过, ${consultationFail} 失败`);
  
  const totalFail = fullSurveyFail + consultationFail;
  process.exit(totalFail > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('同步失败:', error);
  process.exit(1);
});
