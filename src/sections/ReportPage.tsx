import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Download, 
  RotateCcw, 
  CheckCircle, 
  Globe, 
  Building2, 
  Target,
  Phone,
  MessageCircle,
  Calendar,
  Star,
  MapPin,
  Briefcase,
  Award,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  Zap,
  Shield,
  Wallet,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { ReportData } from '@/types/questionnaire';
import { ConsultationForm } from '@/components/ConsultationForm';
import { CoreSummary } from '@/components/CoreSummary';
import { SocialProof } from '@/components/SocialProof';
import { LimitedOffer } from '@/components/LimitedOffer';
import { ShareReport } from '@/components/ShareReport';
import { autoSubmitContactInfo } from '@/services/autoSubmit';
import { industryOptions } from '@/types/questionnaire';
import { findBenchmarkCompanies, generateMatchDescription } from '@/utils/benchmarkMatcher';
import { recommendMarkets, generateMarketDescription } from '@/utils/marketRecommender';
import { ReportCover } from '@/components/ReportCover';
import { generateProfessionalPDF } from '@/services/pdfGenerator';

interface ReportPageProps {
  reportData: ReportData;
  onReset: () => void;
}

// 雷达图组件
function RadarChart({ scores }: { scores: Record<string, number> }) {
  const size = 200;
  const center = size / 2;
  const radius = 80;
  const labels = ['基础能力', '产品竞争力', '运营能力', '资源配置', '发展潜力'];
  const values = [scores.foundation, scores.product, scores.operation, scores.resource, scores.potential];
  const maxValue = 100;
  
  const angleStep = (Math.PI * 2) / 5;
  
  const getPoint = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };
  
  const points = values.map((v, i) => getPoint(v, i));
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  
  return (
    <svg width={size} height={size} className="mx-auto">
      {/* 背景网格 */}
      {[20, 40, 60, 80, 100].map((level) => (
        <polygon
          key={level}
          points={Array(5).fill(0).map((_, i) => {
            const p = getPoint(level, i);
            return `${p.x},${p.y}`;
          }).join(' ')}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}
      {/* 轴线 */}
      {Array(5).fill(0).map((_, i) => {
        const p = getPoint(100, i);
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#e2e8f0" strokeWidth="1" />;
      })}
      {/* 数据区域 */}
      <path d={pathData} fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2" />
      {/* 数据点 */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3b82f6" />
      ))}
      {/* 标签 */}
      {labels.map((label, i) => {
        const p = getPoint(115, i);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#64748b">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// 进度条组件
function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium">{score}分</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function ReportPage({ reportData, onReset }: ReportPageProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedBenchmarks, setExpandedBenchmarks] = useState<Record<string, boolean>>({});
  const [expandedMarkets, setExpandedMarkets] = useState<Record<string, boolean>>({});

  const toggleBenchmark = (id: string) => {
    setExpandedBenchmarks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMarket = (id: string) => {
    setExpandedMarkets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const { 
    companyProfile,
    assessmentResult, 
    benchmarkCompanies, 
    recommendedServices,
    marketRecommendations,
    actionPlan,
    investmentPlan,
    dataSummary
  } = reportData;

  // 使用智能匹配算法获取对标企业和市场推荐
  // 注意：如果匹配失败，回退到使用 reportData 中已有的数据
  let matchedBenchmarks: { company: typeof benchmarkCompanies[0]; score: number; matchReasons: string[] }[];
  let matchedMarkets: (typeof marketRecommendations[0] & { fitScore?: number })[];
  
  try {
    // 尝试从 dataSummary 中提取原始数据（简化版本）
    const diagnosisData: any = {
      stage: assessmentResult.stage,
      targetMarkets: dataSummary.resource['目标市场']?.toString().split('、') || [],
    };
    
    const productData: any = {
      pricePositioning: 'mid', // 默认值
      certifications: dataSummary.product['已获认证']?.toString().includes('项') ? ['CE'] : [],
    };
    
    const bmResult = findBenchmarkCompanies(companyProfile, diagnosisData, 3);
    const mrResult = recommendMarkets(companyProfile, productData, diagnosisData, 3);
    
    // 确保返回的数据格式正确
    matchedBenchmarks = bmResult.map((m: any) => ({
      company: m.company,
      score: m.score,
      matchReasons: m.matchReasons,
    }));
    
    matchedMarkets = mrResult.map((m: any) => ({
      ...m,
      fitScore: m.fitScore || 80,
    }));
  } catch (error) {
    console.error('智能匹配失败，使用默认数据:', error);
    // 回退到使用 reportData 中已有的数据
    matchedBenchmarks = benchmarkCompanies.map((company, index) => ({
      company,
      score: 95 - index * 5,
      matchReasons: ['行业相关', '规模相近'],
    }));
    matchedMarkets = marketRecommendations.map((market) => ({
      ...market,
      fitScore: market.fitScore || 80,
    }));
  }

  // 自动提交联系信息（静默模式）
  useEffect(() => {
    const submitContact = async () => {
      await autoSubmitContactInfo(
        {
          name: companyProfile.name,
          contactName: companyProfile.contactName,
          contactPhone: companyProfile.contactPhone,
          contactEmail: companyProfile.contactEmail,
          industry: companyProfile.industry,
        },
        {
          totalScore: assessmentResult.totalScore,
          stage: assessmentResult.stage,
          level: assessmentResult.level,
        }
      );
      // 静默处理，不显示任何状态
    };

    submitContact();
  }, [companyProfile, assessmentResult]);

  // 获取行业中文名称
  const getIndustryLabel = (value: string): string => {
    const industry = industryOptions.find(i => i.value === value);
    return industry?.label || value;
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      await generateProfessionalPDF({
        companyName: companyProfile.name,
        assessmentResult,
        actionPlan,
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      preparation: 'bg-slate-500',
      exploration: 'bg-emerald-500',
      growth: 'bg-blue-500',
      expansion: 'bg-amber-500',
      mature: 'bg-purple-500',
    };
    return colors[stage] || 'bg-slate-500';
  };

  const getStageBg = (stage: string) => {
    const colors: Record<string, string> = {
      preparation: 'from-slate-600 to-slate-700',
      exploration: 'from-emerald-600 to-emerald-700',
      growth: 'from-blue-600 to-blue-700',
      expansion: 'from-amber-600 to-amber-700',
      mature: 'from-purple-600 to-purple-700',
    };
    return colors[stage] || 'from-slate-600 to-slate-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 操作按钮 */}
        <div className="flex justify-end gap-4 mb-6">
          <ShareReport 
            companyName={companyProfile.name}
            score={assessmentResult.totalScore}
            level={assessmentResult.level}
          />
          <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            重新评估
          </Button>
          <Button onClick={handleDownloadPDF} disabled={isGenerating} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4" />
            {isGenerating ? '生成中...' : '下载PDF报告'}
          </Button>
        </div>

        {/* 报告内容 */}
        <div ref={reportRef} className="space-y-6">
          {/* 报告封面 */}
          <ReportCover
            companyName={companyProfile.name}
            totalScore={assessmentResult.totalScore}
            stage={assessmentResult.stage}
            level={assessmentResult.level}
            industry={getIndustryLabel(companyProfile.industry)}
          />

          {/* 核心结论 */}
          <CoreSummary
            companyName={companyProfile.name}
            totalScore={assessmentResult.totalScore}
            stage={assessmentResult.stage}
            level={assessmentResult.level}
            dimensionScores={assessmentResult.dimensionScores}
          />

          {/* 限时福利 */}
          <LimitedOffer onConsultClick={() => document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth' })} />

          {/* 报告主体 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="overview">评估概览</TabsTrigger>
              <TabsTrigger value="details">详细分析</TabsTrigger>
              <TabsTrigger value="benchmark">标杆对标</TabsTrigger>
              <TabsTrigger value="recommendations">市场与服务</TabsTrigger>
              <TabsTrigger value="action">行动计划</TabsTrigger>
            </TabsList>

            {/* 评估概览 */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* 五维能力雷达图 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    五维能力评估
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                  <div>
                    <RadarChart scores={assessmentResult.dimensionScores} />
                  </div>
                  <div className="space-y-4">
                    <ScoreBar label="基础能力" score={assessmentResult.dimensionScores.foundation} color="bg-blue-500" />
                    <ScoreBar label="产品竞争力" score={assessmentResult.dimensionScores.product} color="bg-emerald-500" />
                    <ScoreBar label="运营能力" score={assessmentResult.dimensionScores.operation} color="bg-amber-500" />
                    <ScoreBar label="资源配置" score={assessmentResult.dimensionScores.resource} color="bg-purple-500" />
                    <ScoreBar label="发展潜力" score={assessmentResult.dimensionScores.potential} color="bg-rose-500" />
                  </div>
                </CardContent>
              </Card>

              {/* SWOT分析 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    SWOT分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        优势 (Strengths)
                      </h4>
                      <ul className="space-y-2">
                        {assessmentResult.swot.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
                      <h4 className="font-semibold text-rose-800 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        劣势 (Weaknesses)
                      </h4>
                      <ul className="space-y-2">
                        {assessmentResult.swot.weaknesses.map((w, i) => (
                          <li key={i} className="text-sm text-rose-700 flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        机会 (Opportunities)
                      </h4>
                      <ul className="space-y-2">
                        {assessmentResult.swot.opportunities.map((o, i) => (
                          <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        威胁 (Threats)
                      </h4>
                      <ul className="space-y-2">
                        {assessmentResult.swot.threats.map((t, i) => (
                          <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 核心发现 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    核心发现
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assessmentResult.keyFindings.map((finding, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-slate-700">{finding}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 详细分析 */}
            <TabsContent value="details" className="space-y-6 mt-6">
              {/* 企业画像 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    企业画像
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {Object.entries(dataSummary.profile).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="text-sm text-slate-500">{key}</div>
                        <div className="font-medium">{value || '-'}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 出海诊断 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    出海诊断
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {Object.entries(dataSummary.diagnosis).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="text-sm text-slate-500">{key}</div>
                        <div className="font-medium">
                          {Array.isArray(value) ? value.join('、') || '-' : value?.toString() || '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 产品竞争力 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    产品竞争力
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {Object.entries(dataSummary.product).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="text-sm text-slate-500">{key}</div>
                        <div className="font-medium">
                          {Array.isArray(value) ? value.join('、') || '-' : value || '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 标杆对标 */}
            <TabsContent value="benchmark" className="space-y-6 mt-6">
              {matchedBenchmarks.map((match) => {
                const company = match.company;
                const isExpanded = expandedBenchmarks[company.id] || false;
                return (
                  <Card key={company.id}>
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-xl">
                            <Star className="w-5 h-5 text-amber-500" />
                            {company.name}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary">{getIndustryLabel(company.industry)}</Badge>
                            <Badge variant="secondary">{company.location}</Badge>
                            <Badge variant="secondary">{company.annualRevenue}</Badge>
                          </div>
                          <p className="text-sm text-slate-600 mt-2">{generateMatchDescription(match)}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-500">对标指数</div>
                          <div className="text-2xl font-bold text-blue-600">{match.score}%</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <Collapsible open={isExpanded} onOpenChange={() => toggleBenchmark(company.id)}>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-2">核心业务</h4>
                            <p className="text-slate-600">{company.coreCompetency}</p>
                          </div>
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  收起详情
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  展开详情
                                </>
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-2">出海成就</h4>
                              <ul className="space-y-1">
                                {company.keyMilestones.slice(0, 3).map((m, i) => (
                                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    {m}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-2">可借鉴点</h4>
                              <ul className="space-y-1">
                                {company.learnablePoints.map((p, i) => (
                                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                    {p}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            {/* 市场与服务 */}
            <TabsContent value="recommendations" className="space-y-6 mt-6">
              {/* 目标市场推荐 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    目标市场推荐
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {matchedMarkets.map((market, i) => {
                      const marketId = String(i);
                      const isMarketExpanded = expandedMarkets[marketId] || false;
                      return (
                        <div key={i} className={`p-4 rounded-lg border-2 ${
                          market.priority === 'high' ? 'border-emerald-200 bg-emerald-50' :
                          market.priority === 'medium' ? 'border-blue-200 bg-blue-50' :
                          'border-slate-200 bg-slate-50'
                        }`}>
                          <Collapsible open={isMarketExpanded} onOpenChange={() => toggleMarket(marketId)}>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-lg">{market.region}</h4>
                                  <Badge className={
                                    market.priority === 'high' ? 'bg-emerald-500' :
                                    market.priority === 'medium' ? 'bg-blue-500' :
                                    'bg-slate-500'
                                  }>
                                    {market.priority === 'high' ? '优先推荐' :
                                     market.priority === 'medium' ? '推荐' : '备选'}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {market.countries?.map(c => (
                                    <span key={c} className="text-sm bg-white px-2 py-1 rounded">{c}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-slate-500">匹配度</div>
                                <div className="text-2xl font-bold text-blue-600">{market.fitScore}%</div>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{generateMarketDescription(market)}</p>
                            
                            <CollapsibleTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2 mb-3">
                                {isMarketExpanded ? (
                                  <>
                                    <ChevronUp className="w-4 h-4" />
                                    收起详情
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-4 h-4" />
                                    展开详情
                                  </>
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent className="space-y-3">
                              <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-slate-500">进入策略：</span>
                                  <span className="text-slate-700">{market.entryStrategy}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500">预计投入：</span>
                                  <span className="text-slate-700">{market.estimatedInvestment}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500">时间周期：</span>
                                  <span className="text-slate-700">{market.timeline}</span>
                                </div>
                              </div>
                              
                              {market.keyRequirements && market.keyRequirements.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-200">
                                  <span className="text-sm text-slate-500">关键要求：</span>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {market.keyRequirements.map((req, idx) => (
                                      <span key={idx} className="text-xs bg-white px-2 py-1 rounded border">{req}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 推荐服务 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    推荐服务
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendedServices.map((service, i) => (
                      <div key={service.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-lg flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                                {i + 1}
                              </span>
                              {service.name}
                            </h4>
                            <p className="text-slate-600 mt-1">{service.description}</p>
                          </div>
                          <Badge variant="outline">{service.duration}</Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">交付物：</span>
                            <span className="text-slate-700">{service.deliverables.join('、')}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">预期效果：</span>
                            <span className="text-slate-700">{service.expectedOutcomes.join('、')}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">投资区间：</span>
                            <span className="text-slate-700">{service.investmentRange.min}-{service.investmentRange.max}万</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 行动计划 */}
            <TabsContent value="action" className="space-y-6 mt-6">
              {/* 投资规划 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    投资规划
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-sm text-slate-500">预计总投资</div>
                      <div className="text-3xl font-bold text-blue-600">
                        {investmentPlan.totalBudget.min}-{investmentPlan.totalBudget.max}万
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">预期回报</div>
                      <div className="text-lg font-medium text-emerald-600">{investmentPlan.roiProjection}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {investmentPlan.allocation.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-24 text-sm text-slate-600">{item.category}</div>
                        <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <div className="w-24 text-right text-sm font-medium">{item.amount}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 行动计划 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    行动计划
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { title: '立即行动（1个月内）', items: actionPlan.immediate, color: 'emerald' },
                      { title: '短期行动（1-3个月）', items: actionPlan.shortTerm, color: 'blue' },
                      { title: '中期行动（3-6个月）', items: actionPlan.mediumTerm, color: 'amber' },
                      { title: '长期行动（6-12个月）', items: actionPlan.longTerm, color: 'purple' },
                    ].map((section, i) => (
                      <div key={i}>
                        <h4 className={`font-semibold mb-3 text-${section.color}-700`}>{section.title}</h4>
                        <ul className="space-y-2">
                          {section.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                              <CheckCircle className={`w-5 h-5 text-${section.color}-500 mt-0.5 flex-shrink-0`} />
                              <span className="text-slate-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* 社交证明 */}
          <div className="mt-6">
            <SocialProof />
          </div>

          {/* 咨询表单 */}
          <div id="consultation-form" className="mt-6">
            <ConsultationForm 
              companyName={companyProfile.name}
              assessmentScore={assessmentResult.totalScore}
              stage={assessmentResult.stage}
              level={assessmentResult.level}
              industry={companyProfile.industry}
              contactName={companyProfile.contactName}
              contactPhone={companyProfile.contactPhone}
              contactEmail={companyProfile.contactEmail}
            />
          </div>

          {/* 联系方式 */}
          <Card className="mt-6">
            <CardHeader className={`bg-gradient-to-r ${getStageBg(assessmentResult.stage)} text-white`}>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                联系我们获取深度服务
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">聊商联盟海外服务部</h4>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>13346257732</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>微信：PatrickWu1104</span>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">专属权益</h4>
                  <ul className="space-y-1 text-sm text-amber-700">
                    <li>• 1对1深度咨询</li>
                    <li>• 免费线下走访</li>
                    <li>• 定制化解决方案</li>
                    <li>• 会员专属优惠</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-slate-600">
                  建议于 <span className="font-semibold text-red-600">7日内</span> 联系我们，获取详细解读
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 隐藏的PDF内容容器 - 包含所有标签页内容 */}
      <div ref={pdfContentRef} style={{ display: 'none' }} className="bg-white p-8">
        {/* 封面 */}
        <div className={`bg-gradient-to-r ${getStageBg(assessmentResult.stage)} text-white p-12 mb-8`}>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm mb-6">
              <Building2 className="w-4 h-4" />
              聊商联盟海外服务部
            </div>
            <h1 className="text-4xl font-bold mb-4">{companyProfile.name}</h1>
            <p className="text-xl text-white/80 mb-8">企业出海成熟度评估报告</p>
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold">{assessmentResult.totalScore}</div>
                <div className="text-sm text-white/70">综合得分</div>
              </div>
              <div className="w-px h-16 bg-white/30" />
              <div className="text-center">
                <div className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${getStageColor(assessmentResult.stage)}`}>
                  {assessmentResult.level}
                </div>
                <div className="text-sm text-white/70 mt-1">企业等级</div>
              </div>
            </div>
          </div>
        </div>

        {/* 五维能力评估 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">五维能力评估</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <RadarChart scores={assessmentResult.dimensionScores} />
            </div>
            <div className="space-y-3">
              <ScoreBar label="基础能力" score={assessmentResult.dimensionScores.foundation} color="bg-blue-500" />
              <ScoreBar label="产品竞争力" score={assessmentResult.dimensionScores.product} color="bg-emerald-500" />
              <ScoreBar label="运营能力" score={assessmentResult.dimensionScores.operation} color="bg-amber-500" />
              <ScoreBar label="资源配置" score={assessmentResult.dimensionScores.resource} color="bg-purple-500" />
              <ScoreBar label="发展潜力" score={assessmentResult.dimensionScores.potential} color="bg-rose-500" />
            </div>
          </div>
        </div>

        {/* SWOT分析 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">SWOT分析</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <h4 className="font-semibold text-emerald-800 mb-3">优势 (Strengths)</h4>
              <ul className="space-y-1 text-sm text-emerald-700">
                {assessmentResult.swot.strengths.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
            <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
              <h4 className="font-semibold text-rose-800 mb-3">劣势 (Weaknesses)</h4>
              <ul className="space-y-1 text-sm text-rose-700">
                {assessmentResult.swot.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">机会 (Opportunities)</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                {assessmentResult.swot.opportunities.map((o, i) => <li key={i}>• {o}</li>)}
              </ul>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-3">威胁 (Threats)</h4>
              <ul className="space-y-1 text-sm text-amber-700">
                {assessmentResult.swot.threats.map((t, i) => <li key={i}>• {t}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* 核心发现 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">核心发现</h2>
          <div className="space-y-2">
            {assessmentResult.keyFindings.map((finding, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-slate-700">{finding}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 企业画像 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">企业画像</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(dataSummary.profile).map(([key, value]) => (
              <div key={key} className="p-3 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-500">{key}</div>
                <div className="font-medium">{value || '-'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 出海诊断 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">出海诊断</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(dataSummary.diagnosis).map(([key, value]) => (
              <div key={key} className="p-3 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-500">{key}</div>
                <div className="font-medium">{Array.isArray(value) ? value.join('、') || '-' : value?.toString() || '-'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 标杆对标 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">标杆企业对标</h2>
          {benchmarkCompanies.map((company, index) => (
            <div key={company.id} className="mb-4 p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{company.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-sm bg-slate-100 px-2 py-1 rounded">{getIndustryLabel(company.industry)}</span>
                    <span className="text-sm bg-slate-100 px-2 py-1 rounded">{company.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">对标指数</div>
                  <div className="text-2xl font-bold text-blue-600">{95 - index * 5}%</div>
                </div>
              </div>
              <p className="text-slate-600 mb-2">{company.coreCompetency}</p>
              <div className="text-sm text-slate-500">
                <strong>可借鉴：</strong>{company.learnablePoints.join('、')}
              </div>
            </div>
          ))}
        </div>

        {/* 目标市场推荐 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">目标市场推荐</h2>
          {marketRecommendations.map((market, i) => (
            <div key={i} className="mb-4 p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold">{market.region}</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {market.countries.map(c => <span key={c} className="text-sm bg-slate-100 px-2 py-1 rounded">{c}</span>)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">匹配度</div>
                  <div className="text-xl font-bold text-blue-600">{market.fitScore}%</div>
                </div>
              </div>
              <p className="text-sm text-slate-600">{market.rationale}</p>
            </div>
          ))}
        </div>

        {/* 推荐服务 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">推荐服务</h2>
          {recommendedServices.map((service) => (
            <div key={service.id} className="mb-4 p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold">{service.name}</h4>
                <span className="text-sm text-slate-500">{service.duration}</span>
              </div>
              <p className="text-slate-600">{service.description}</p>
            </div>
          ))}
        </div>

        {/* 投资规划 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">投资规划</h2>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="mb-4">
              <span className="text-slate-500">总预算：</span>
              <span className="text-2xl font-bold">{investmentPlan.totalBudget.min}-{investmentPlan.totalBudget.max}万元</span>
            </div>
            <div className="space-y-2">
              {investmentPlan.allocation.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <div className="w-32 text-sm">{item.category}</div>
                  <div className="w-24 text-right text-sm font-medium">{item.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 行动计划 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">行动计划</h2>
          {[
            { title: '立即行动（1个月内）', items: actionPlan.immediate },
            { title: '短期行动（1-3个月）', items: actionPlan.shortTerm },
            { title: '中期行动（3-6个月）', items: actionPlan.mediumTerm },
            { title: '长期行动（6-12个月）', items: actionPlan.longTerm },
          ].map((section, i) => (
            <div key={i} className="mb-4">
              <h4 className="font-semibold mb-2">{section.title}</h4>
              <ul className="space-y-1">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 p-2 bg-slate-50 rounded">
                    <span className="text-blue-500">✓</span>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 联系方式 */}
        <div className="p-6 bg-slate-100 rounded-lg">
          <h2 className="text-xl font-bold mb-4">联系我们获取深度服务</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">聊商联盟海外服务部</h4>
              <div className="space-y-1 text-slate-600">
                <div>电话：13346257732</div>
                <div>微信：PatrickWu1104</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">专属权益</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• 1对1深度咨询</li>
                <li>• 免费线下走访</li>
                <li>• 定制化解决方案</li>
                <li>• 会员专属优惠</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
