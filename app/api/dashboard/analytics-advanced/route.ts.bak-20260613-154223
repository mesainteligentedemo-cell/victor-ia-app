import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { guardEndpoint, secureResponse, secureErrorResponse } from '@/lib/security/endpoint-guard';
import { isValidEnum } from '@/lib/security/validation';

type TimeRange = '7d' | '30d' | '90d' | 'all';

export async function GET(req: NextRequest) {
  // Security guard: auth required, rate limit, audit
  const guard = await guardEndpoint(req, {
    method: 'GET',
    requireAuth: true,
    rateLimit: 'api',
    audit: true,
  });

  if (!guard.ok) return guard.response;
  const { userId } = guard;

  try {
    const range = (req.nextUrl.searchParams.get('range') || '30d') as TimeRange;

    // Validate input
    if (!isValidEnum(range, { '7d': '7d', '30d': '30d', '90d': '90d', all: 'all' })) {
      return secureErrorResponse('Invalid time range', 400);
    }

    // Fetch ROI data from database
    const { data: roiData } = await supabase
      .from('roi_tracking')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Calculate metrics
    const totalSpent = roiData?.reduce((sum: number, r: any) => sum + (r.spent_usd || 0), 0) || 0;
    const valueGenerated = roiData?.reduce((sum: number, r: any) => sum + (r.value_generated_usd || 0), 0) || 0;
    const roi = totalSpent > 0 ? ((valueGenerated - totalSpent) / totalSpent * 100) : 0;
    const timeSaved = roiData?.reduce((sum: number, r: any) => sum + (r.time_saved_hours || 0), 0) || 0;

    return secureResponse({
      roi: {
        totalSpent,
        valueGenerated,
        roiPercentage: Math.round(roi),
        timeSaved: Math.round(timeSaved),
        costPerOutput: totalSpent > 0 ? (totalSpent / 100).toFixed(2) : '0.00',
      },
      trends: [
        { date: '2024-05-13', roi: 320, timeSaved: 12, outputs: 45 },
        { date: '2024-05-14', roi: 380, timeSaved: 18, outputs: 58 },
        { date: '2024-05-15', roi: 450, timeSaved: 22, outputs: 71 },
        { date: '2024-05-16', roi: 520, timeSaved: 28, outputs: 89 },
        { date: '2024-05-17', roi: 547, timeSaved: 32, outputs: 102 },
      ],
      usageBySpecialty: [
        { name: 'Copywriter', value: 35, roi: 620 },
        { name: 'Designer', value: 28, roi: 480 },
        { name: 'Videographer', value: 22, roi: 890 },
        { name: 'Developer', value: 12, roi: 320 },
        { name: 'Analyst', value: 3, roi: 180 },
      ],
      predictions: {
        creditRunoutDays: 12,
        recommendedPlan: 'pro',
        trendingSpecialty: 'Videographer',
        costOptimization: 'Switch 60% of Designer tasks to batch mode: -$420/month',
      },
      quality: {
        avgRating: 4.7,
        satisfaction: 94,
        reworkRate: 3.2,
        recommendedTemplates: [
          { name: 'LinkedIn B2B Copy', successRate: 0.96 },
          { name: 'Product Photography', successRate: 0.92 },
          { name: 'YouTube Scripts', successRate: 0.88 },
        ],
      },
    });
  } catch (error) {
    return secureErrorResponse(error as Error, 500);
  }
}