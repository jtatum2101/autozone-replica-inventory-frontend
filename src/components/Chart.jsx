import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { inventoryAPI } from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Charts() {
  const [topSellingData, setTopSellingData] = useState(null);
  const [salesTrendData, setSalesTrendData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      
      // Get top selling parts
      const topSellingRes = await inventoryAPI.getTopSellingParts(10);
      
      // Get all sales for trend analysis
      const salesRes = await inventoryAPI.getAllSales();
      
      // Process top selling data
      const topSellingChartData = {
        labels: topSellingRes.data.map(item => item.partName),
        datasets: [
          {
            label: 'Total Units Sold',
            data: topSellingRes.data.map(item => item.totalQuantity),
            backgroundColor: 'rgba(234, 88, 12, 0.8)',
            borderColor: 'rgba(234, 88, 12, 1)',
            borderWidth: 1,
          },
        ],
      };
      
      // Process sales trend data (last 30 days)
      const salesByDay = processSalesTrend(salesRes.data);
      
      const trendChartData = {
        labels: salesByDay.labels,
        datasets: [
          {
            label: 'Daily Sales',
            data: salesByDay.data,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            tension: 0.3,
          },
        ],
      };
      
      setTopSellingData(topSellingChartData);
      setSalesTrendData(trendChartData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processSalesTrend = (sales) => {
    const last30Days = [];
    const today = new Date();
    
    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last30Days.push(date.toISOString().split('T')[0]);
    }
    
    // Count sales per day
    const salesByDay = {};
    last30Days.forEach(day => salesByDay[day] = 0);
    
    sales.forEach(sale => {
      const saleDate = sale.saleDate.split('T')[0];
      if (salesByDay.hasOwnProperty(saleDate)) {
        salesByDay[saleDate] += sale.quantitySold;
      }
    });
    
    return {
      labels: last30Days.map(date => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }),
      data: last30Days.map(date => salesByDay[date]),
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Loading charts...</p>
      </div>
    );
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales Trend Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Sales Trend (Last 30 Days)</h3>
        <div style={{ height: '300px' }}>
          {salesTrendData && <Line data={salesTrendData} options={lineOptions} />}
        </div>
      </div>

      {/* Top Selling Parts Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Top 10 Best-Selling Parts</h3>
        <div style={{ height: '300px' }}>
          {topSellingData && <Bar data={topSellingData} options={barOptions} />}
        </div>
      </div>
    </div>
  );
}

export default Charts;