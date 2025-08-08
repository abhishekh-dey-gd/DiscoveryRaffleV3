import React from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';
import GlassCard from '../components/GlassCard';
import { getWinners } from '../utils/storage';
import { getAllContestants, getContestantsByDepartment } from '../utils/raffle';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const winners = getWinners();
  const allContestants = getAllContestants();

  const departmentData = [
    'International Messaging',
    'India Messaging',
    'APAC'
  ].map(dept => ({
    department: dept,
    total: getContestantsByDepartment(dept as any).length,
    winners: winners.filter(w => w.department === dept).length,
    percentage: getContestantsByDepartment(dept as any).length > 0 
      ? Math.round((winners.filter(w => w.department === dept).length / getContestantsByDepartment(dept as any).length) * 100)
      : 0
  }));

  const chartData = {
    labels: departmentData.map(d => d.department.replace(' Messaging', '')),
    datasets: [
      {
        label: 'Total Contestants',
        data: departmentData.map(d => d.total),
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        borderColor: 'rgba(59, 130, 246, 0.8)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Winners Selected',
        data: departmentData.map(d => d.winners),
        backgroundColor: 'rgba(34, 197, 94, 0.3)',
        borderColor: 'rgba(34, 197, 94, 0.8)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 14,
            weight: '500' as const
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      title: {
        display: true,
        text: 'Contestants vs Winners by Department',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 18,
          weight: 'bold' as const
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const department = departmentData[context.dataIndex];
            if (context.datasetIndex === 0) {
              return `Total: ${context.parsed.y}`;
            } else {
              return `Winners: ${context.parsed.y} (${department.percentage}%)`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
            weight: '500' as const
          }
        },
        border: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
            weight: '500' as const
          },
          stepSize: 1
        },
        border: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const
    }
  };

  const getRecentDrawsData = () => {
    const drawsByDate = winners.reduce((acc: any, winner) => {
      const date = new Date(winner.drawDate).toDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});

    return Object.entries(drawsByDate)
      .sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-7); // Last 7 draws
  };

  const recentDraws = getRecentDrawsData();

  return (
    <Layout title="Analytics Dashboard">
      <Navigation />
      
      <div className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Total Contestants</h3>
                <p className="text-3xl font-bold text-white mt-1">{allContestants.length}</p>
                <p className="text-white/60 text-xs mt-2">Across all departments</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20 backdrop-blur-md">
                <Users className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Winners Selected</h3>
                <p className="text-3xl font-bold text-white mt-1">{winners.length}</p>
                <p className="text-white/60 text-xs mt-2">
                  {allContestants.length > 0 ? Math.round((winners.length / allContestants.length) * 100) : 0}% of total pool
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500/20 backdrop-blur-md">
                <TrendingUp className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Draw Sessions</h3>
                <p className="text-3xl font-bold text-white mt-1">{recentDraws.length}</p>
                <p className="text-white/60 text-xs mt-2">Unique draw dates</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/20 backdrop-blur-md">
                <Calendar className="w-6 h-6 text-purple-300" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Remaining Pool</h3>
                <p className="text-3xl font-bold text-white mt-1">{allContestants.length - winners.length}</p>
                <p className="text-white/60 text-xs mt-2">Available for future draws</p>
              </div>
              <div className="p-3 rounded-full bg-orange-500/20 backdrop-blur-md">
                <BarChart3 className="w-6 h-6 text-orange-300" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Main Chart */}
        <GlassCard className="p-8">
          <div className="h-96 w-full">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </GlassCard>

        {/* Department Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Department Statistics
            </h3>
            
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <motion.div
                  key={dept.department}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-white/10 backdrop-blur-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">{dept.department}</h4>
                    <span className="text-white/80 text-sm">{dept.percentage}%</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-white/70 mb-2">
                    <span>Total: {dept.total}</span>
                    <span>Winners: {dept.winners}</span>
                  </div>

                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              Recent Draw Activity
            </h3>
            
            {recentDraws.length > 0 ? (
              <div className="space-y-3">
                {recentDraws.map(([date, count]: any, index) => (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-between items-center p-3 rounded-lg bg-white/10 backdrop-blur-md"
                  >
                    <span className="text-white font-medium">
                      {new Date(date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white/80">{count} winner{count > 1 ? 's' : ''}</span>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                        {count}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-500/20 backdrop-blur-md flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-white/60">No draw activity yet</p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Summary Insights */}
        {winners.length > 0 && (
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-500/10 backdrop-blur-md border border-blue-400/20">
                <h4 className="text-blue-200 font-medium mb-2">Most Active Department</h4>
                <p className="text-white text-lg">
                  {departmentData.reduce((max, dept) => dept.winners > max.winners ? dept : max).department}
                </p>
                <p className="text-blue-200/70 text-sm">
                  {departmentData.reduce((max, dept) => dept.winners > max.winners ? dept : max).winners} winners selected
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-green-500/10 backdrop-blur-md border border-green-400/20">
                <h4 className="text-green-200 font-medium mb-2">Completion Rate</h4>
                <p className="text-white text-lg">
                  {Math.round((winners.length / allContestants.length) * 100)}%
                </p>
                <p className="text-green-200/70 text-sm">
                  of total contestant pool selected
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-500/10 backdrop-blur-md border border-purple-400/20">
                <h4 className="text-purple-200 font-medium mb-2">Average per Draw</h4>
                <p className="text-white text-lg">
                  {recentDraws.length > 0 ? Math.round(winners.length / recentDraws.length) : 0}
                </p>
                <p className="text-purple-200/70 text-sm">
                  winners selected per session
                </p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </Layout>
  );
}