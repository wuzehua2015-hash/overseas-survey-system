import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function ScoreExplanationDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-slate-500 hover:text-slate-700">
          <HelpCircle className="w-4 h-4" />
          评分说明
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            评分体系说明
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* 总分计算方式 */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              总分计算方式
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              综合得分 = 五维能力加权平均分
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">基础能力</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">产品竞争力</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">运营能力</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">资源配置</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">发展潜力</span>
                <span className="font-medium">20%</span>
              </div>
            </div>
          </div>

          {/* 评分标准 */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              评分标准
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                  80+
                </div>
                <div>
                  <p className="font-medium text-emerald-900">优秀 (A级)</p>
                  <p className="text-sm text-emerald-700">企业出海准备充分，具备较强竞争力</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  60-79
                </div>
                <div>
                  <p className="font-medium text-blue-900">良好 (B级)</p>
                  <p className="text-sm text-blue-700">具备出海基础，需要针对性提升</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                  40-59
                </div>
                <div>
                  <p className="font-medium text-amber-900">一般 (C级)</p>
                  <p className="text-sm text-amber-700">出海准备不足，需要系统规划</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg border border-rose-200">
                <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">
                  &lt;40
                </div>
                <div>
                  <p className="font-medium text-rose-900">待提升 (D级)</p>
                  <p className="text-sm text-rose-700">建议先完善内部能力再考虑出海</p>
                </div>
              </div>
            </div>
          </div>

          {/* 维度说明 */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-3">五维能力说明</h3>
            <div className="space-y-2 text-sm">
              <p><strong>基础能力</strong>：企业身份、规模、核心优势等基础要素</p>
              <p><strong>产品竞争力</strong>：认证、研发、生产、供应链等产品实力</p>
              <p><strong>运营能力</strong>：数字化、营销、品牌建设等运营水平</p>
              <p><strong>资源配置</strong>：资金、政策、规划、风险等资源配置</p>
              <p><strong>发展潜力</strong>：成长性、市场空间、团队等发展潜力</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
