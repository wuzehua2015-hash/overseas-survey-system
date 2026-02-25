import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LimitedOfferProps {
  onConsultClick: () => void;
}

export function LimitedOffer({ onConsultClick }: LimitedOfferProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  
  useEffect(() => {
    // 计算到本月结束的剩余时间
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const diff = endOfMonth.getTime() - now.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return { days, hours, minutes };
    };
    
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // 每分钟更新
    
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white shadow-lg overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold">本月限时福利</span>
              </div>
              <p className="text-sm text-white/90 mt-0.5">
                预约咨询即送价值 <span className="font-bold">¥5,000</span> 深度诊断
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4" />
              <span>剩余时间</span>
            </div>            <div className="text-2xl font-bold">
              {String(timeLeft.days).padStart(2, '0')}:
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-xs text-white/70">
              天:时:分
            </div>
          </div>
        </div>
        
        <Button 
          onClick={onConsultClick}
          className="w-full mt-3 bg-white text-orange-600 hover:bg-white/90 font-bold"
        >
          立即领取福利
        </Button>
      </CardContent>
    </Card>
  );
}
