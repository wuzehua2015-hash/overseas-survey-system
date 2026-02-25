import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Copy, Link2, MessageSquare, Link as LinkIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ShareReportProps {
  companyName: string;
  score: number;
  level: string;
}

// 域名配置 - 方便后续切换到自有域名
const DOMAIN_CONFIG = {
  // 当前使用的域名
  current: 'https://wuzehua2015-hash.github.io/overseas-survey-system',
  // 自有域名（后续启用时修改这里）
  custom: '', // 例如: 'https://assessment.liaoshanglm.com'
  // 是否使用自有域名
  useCustom: false,
};

// 获取分享基础URL
const getShareBaseUrl = (): string => {
  if (DOMAIN_CONFIG.useCustom && DOMAIN_CONFIG.custom) {
    return DOMAIN_CONFIG.custom;
  }
  // 浏览器环境使用当前域名，SSR使用配置的域名
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${window.location.pathname}`;
  }
  return DOMAIN_CONFIG.current;
};

export function ShareReport({ companyName, score, level }: ShareReportProps) {
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  
  // 生成分享链接
  const shareUrl = `${getShareBaseUrl()}?share=true`;
  
  // 分享文案
  const shareText = `【${companyName}】的出海成熟度评估报告：综合得分${score}分，被评为"${level}"。来看看你的企业出海 readiness 如何？`;
  
  const handleCopyFull = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          分享报告
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            分享您的出海评估报告
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="full" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="full" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              完整文案
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              仅链接
            </TabsTrigger>
          </TabsList>
          
          {/* 完整文案标签 */}
          <TabsContent value="full" className="space-y-4 mt-4">
            {/* 预览卡片 */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                {shareText}
              </p>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-slate-500 font-mono break-all">{shareUrl}</p>
              </div>
            </div>
            
            {/* 复制按钮 */}
            <Button 
              onClick={handleCopyFull}
              className="w-full flex items-center justify-center gap-2"
              variant={copiedFull ? "default" : "secondary"}
            >
              {copiedFull ? (
                <>
                  <Check className="w-4 h-4" />
                  已复制完整文案
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制完整文案
                </>
              )}
            </Button>
          </TabsContent>
          
          {/* 仅链接标签 */}
          <TabsContent value="link" className="space-y-4 mt-4">
            {/* 链接显示 */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <label className="text-sm font-medium text-slate-700 mb-2 block">分享链接</label>
              <p className="text-sm text-slate-600 font-mono break-all bg-white p-3 rounded border">
                {shareUrl}
              </p>
            </div>
            
            {/* 复制按钮 */}
            <Button 
              onClick={handleCopyUrl}
              className="w-full flex items-center justify-center gap-2"
              variant={copiedUrl ? "default" : "secondary"}
            >
              {copiedUrl ? (
                <>
                  <Check className="w-4 h-4" />
                  已复制链接
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  复制链接
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
        
        {/* 分享提示 */}
        <div className="bg-amber-50 rounded-lg p-3 mt-4">
          <p className="text-sm text-amber-800 flex items-start gap-2">
            <span className="text-lg">💡</span>
            <span>分享后可邀请其他企业主一起评估</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 导出配置，方便其他组件使用
export { DOMAIN_CONFIG, getShareBaseUrl };
