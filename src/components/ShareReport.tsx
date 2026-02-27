import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Copy, Link2, MessageSquare, Link as LinkIcon, Download, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

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
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const posterRef = useRef<HTMLDivElement>(null);
  
  // 生成分享链接
  const shareUrl = `${getShareBaseUrl()}?share=true`;
  
  // 生成二维码
  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(shareUrl, {
          width: 80,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('QR Code generation failed:', err);
      }
    };
    generateQR();
  }, [shareUrl]);
  
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

  // 生成海报
  const handleGeneratePoster = async () => {
    if (!posterRef.current) return;
    
    setIsGeneratingPoster(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      
      // 下载海报
      const link = document.createElement('a');
      link.download = `${companyName}_出海评估报告.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Poster generation failed:', err);
      alert('海报生成失败，请重试');
    } finally {
      setIsGeneratingPoster(false);
    }
  };

  // 获取评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  // 获取评分背景色
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          分享报告
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            分享您的出海评估报告
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="poster" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="poster" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              生成海报
            </TabsTrigger>
            <TabsTrigger value="full" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              完整文案
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              仅链接
            </TabsTrigger>
          </TabsList>
          
          {/* 生成海报标签 */}
          <TabsContent value="poster" className="space-y-4 mt-4">
            {/* 海报预览 */}
            <div 
              ref={posterRef}
              className="w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 rounded-xl text-white"
              style={{ aspectRatio: '3/4' }}
            >
              {/* 头部 */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm mb-4">
                  <span>🌏</span>
                  聊商联盟海外服务部
                </div>
                <h1 className="text-2xl font-bold mb-2">企业出海成熟度测评</h1>
                <p className="text-white/80 text-sm">Enterprise Overseas Readiness Assessment</p>
              </div>
              
              {/* 企业信息 */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
                <p className="text-white/70 text-sm mb-1">企业名称</p>
                <p className="text-xl font-bold">{companyName}</p>
              </div>
              
              {/* 评分 */}
              <div className="bg-white rounded-xl p-6 text-center mb-4">
                <p className="text-slate-500 text-sm mb-2">综合得分</p>
                <div className={`text-5xl font-bold ${getScoreColor(score)} mb-2`}>
                  {score}
                  <span className="text-2xl">分</span>
                </div>                <div className={`inline-block px-4 py-1.5 rounded-full text-white text-sm font-medium ${getScoreBgColor(score)}`}>
                  {level}
                </div>
              </div>
              
              {/* 二维码区域 */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {qrCodeUrl ? (
                      <img src={qrCodeUrl} alt="扫码测评" className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-center">
                        <div className="text-3xl mb-1">📱</div>
                        <div className="text-[8px] text-slate-400">扫码测评</div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">扫码免费测评</p>
                    <p className="text-xs text-white/70">{shareUrl}</p>
                  </div>
                </div>
              </div>
              
              {/* 底部 */}
              <div className="text-center mt-6 text-white/60 text-xs">
                聊商联盟海外服务部 · 标准化评估体系
              </div>
            </div>
            
            {/* 生成按钮 */}
            <Button 
              onClick={handleGeneratePoster}
              disabled={isGeneratingPoster}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {isGeneratingPoster ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  下载海报
                </>
              )}
            </Button>
          </TabsContent>
          
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
            <span>生成海报或复制文案，分享到朋友圈吸引更多企业主测评</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 导出配置，方便其他组件使用
export { DOMAIN_CONFIG, getShareBaseUrl };
