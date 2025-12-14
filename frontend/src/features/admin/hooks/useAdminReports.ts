import { useState, useMemo } from 'react';

export interface ReportMetric {
    label: string;
    value: string | number;
    change: string;
    trending: 'up' | 'down';
}

export interface ChartDataPoint {
    label: string;
    value: number;
}

export interface ReportData {
    revenue: {
        metrics: ReportMetric[];
        chart: ChartDataPoint[];
    };
    trips: {
        metrics: ReportMetric[];
        chart: ChartDataPoint[];
    };
    users: {
        metrics: ReportMetric[];
        chart: ChartDataPoint[];
    };
    drivers: {
        metrics: ReportMetric[];
        chart: ChartDataPoint[];
    };
}

// Mock report data
const mockReportData: ReportData = {
    revenue: {
        metrics: [
            { label: 'Total Revenue', value: '₹24,56,780', change: '+12.5%', trending: 'up' },
            { label: 'Avg. Trip Value', value: '₹485', change: '+5.2%', trending: 'up' },
            { label: 'Commission Earned', value: '₹3,68,517', change: '+8.3%', trending: 'up' },
            { label: 'Pending Payouts', value: '₹1,25,000', change: '-2.1%', trending: 'down' },
        ],
        chart: [
            { label: 'Jan', value: 180000 },
            { label: 'Feb', value: 195000 },
            { label: 'Mar', value: 220000 },
            { label: 'Apr', value: 210000 },
            { label: 'May', value: 245000 },
            { label: 'Jun', value: 268000 },
            { label: 'Jul', value: 290000 },
            { label: 'Aug', value: 310000 },
            { label: 'Sep', value: 285000 },
            { label: 'Oct', value: 320000 },
            { label: 'Nov', value: 345000 },
            { label: 'Dec', value: 389000 },
        ],
    },
    trips: {
        metrics: [
            { label: 'Total Trips', value: '5,067', change: '+18.2%', trending: 'up' },
            { label: 'Completed', value: '4,892', change: '+16.8%', trending: 'up' },
            { label: 'Cancelled', value: '175', change: '-5.5%', trending: 'down' },
            { label: 'Avg. Duration', value: '24 min', change: '-2.3%', trending: 'down' },
        ],
        chart: [
            { label: 'Mon', value: 720 },
            { label: 'Tue', value: 680 },
            { label: 'Wed', value: 750 },
            { label: 'Thu', value: 790 },
            { label: 'Fri', value: 920 },
            { label: 'Sat', value: 680 },
            { label: 'Sun', value: 527 },
        ],
    },
    users: {
        metrics: [
            { label: 'Total Users', value: '12,456', change: '+22.5%', trending: 'up' },
            { label: 'New This Month', value: '845', change: '+15.2%', trending: 'up' },
            { label: 'Active Users', value: '8,234', change: '+10.8%', trending: 'up' },
            { label: 'Retention Rate', value: '78%', change: '+3.2%', trending: 'up' },
        ],
        chart: [
            { label: 'Jan', value: 8500 },
            { label: 'Feb', value: 9200 },
            { label: 'Mar', value: 9800 },
            { label: 'Apr', value: 10200 },
            { label: 'May', value: 10800 },
            { label: 'Jun', value: 11300 },
            { label: 'Jul', value: 11600 },
            { label: 'Aug', value: 11900 },
            { label: 'Sep', value: 12100 },
            { label: 'Oct', value: 12250 },
            { label: 'Nov', value: 12350 },
            { label: 'Dec', value: 12456 },
        ],
    },
    drivers: {
        metrics: [
            { label: 'Total Drivers', value: '234', change: '+8.5%', trending: 'up' },
            { label: 'Active Today', value: '178', change: '+12.2%', trending: 'up' },
            { label: 'Avg. Rating', value: '4.6', change: '+0.2', trending: 'up' },
            { label: 'Top Performer', value: 'Arun P.', change: '245 trips', trending: 'up' },
        ],
        chart: [
            { label: 'Jan', value: 180 },
            { label: 'Feb', value: 188 },
            { label: 'Mar', value: 195 },
            { label: 'Apr', value: 202 },
            { label: 'May', value: 210 },
            { label: 'Jun', value: 215 },
            { label: 'Jul', value: 220 },
            { label: 'Aug', value: 225 },
            { label: 'Sep', value: 228 },
            { label: 'Oct', value: 230 },
            { label: 'Nov', value: 232 },
            { label: 'Dec', value: 234 },
        ],
    },
};

export type ReportType = 'revenue' | 'trips' | 'users' | 'drivers';
export type DateRange = 'today' | 'week' | 'month' | 'quarter' | 'year';

export function useAdminReports() {
    const [activeReport, setActiveReport] = useState<ReportType>('revenue');
    const [dateRange, setDateRange] = useState<DateRange>('month');

    const currentReport = useMemo(() => {
        return mockReportData[activeReport];
    }, [activeReport]);

    const maxChartValue = useMemo(() => {
        return Math.max(...currentReport.chart.map((d) => d.value));
    }, [currentReport]);

    return {
        // State
        activeReport,
        dateRange,
        // Computed
        currentReport,
        maxChartValue,
        // Actions
        setActiveReport,
        setDateRange,
    };
}
