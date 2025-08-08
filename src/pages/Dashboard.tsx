import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Trophy, BarChart3, Dice6 } from 'lucide-react';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';
import GlassCard from '../components/GlassCard';
import { getAllContestants, getContestantsByDepartment } from '../utils/raffle';
import { getWinners } from '../utils/storage';

export default function Dashboard() {
  const allContestants = getAllContestants();
  const winners = getWinners();
  
  const departmentStats = [
    { name: 'International Messaging', count: getContestantsByDepartment('International Messaging').length },
    { name: 'India Messaging', count: getContestantsByDepartment('India Messaging').length },
    { name: 'APAC', count: getContestantsByDepartment('APAC').length },
  ];

  const winnersByDepartment = {
    'International Messaging': winners.filter(w => w.department === 'International Messaging').length,
    'India Messaging': winners.filter(w => w.department === 'India Messaging').length,
    'APAC': winners.filter(w => w.department === 'APAC').length,
  };

  const quickActions = [
    {
      title: 'Start Raffle',
      description: 'Draw winners from the contestant pool',
      icon: Dice6,
      link: '/raffle',
      color: 'from-green-400 to-emerald-600'
    },
    {
      title: 'View Winners',
      description: 'See all selected winners and export data',
      icon: Trophy,
      link: '/winners',
      color: 'from-yellow-400 to-amber-600'
    },
    {
      title: 'Analytics',
      description: 'View statistical insights and charts',
      icon: BarChart3,
      link: '/analytics',
      color: 'from-purple-400 to-violet-600'
    }
  ];

  return (
    <Layout title="Contest Dashboard">
      <Navigation />
      
      <div className="space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Total Contestants</h3>
                <p className="text-3xl font-bold text-white mt-1">{allContestants.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20 backdrop-blur-md">
                <Users className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Total Winners</h3>
                <p className="text-3xl font-bold text-white mt-1">{winners.length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/20 backdrop-blur-md">
                <Trophy className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Departments</h3>
                <p className="text-3xl font-bold text-white mt-1">3</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/20 backdrop-blur-md">
                <BarChart3 className="w-6 h-6 text-purple-300" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Remaining Pool</h3>
                <p className="text-3xl font-bold text-white mt-1">{allContestants.length - winners.length}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-500/20 backdrop-blur-md">
                <Dice6 className="w-6 h-6 text-orange-300" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={action.link}>
                  <GlassCard className="p-6 cursor-pointer" hover>
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${action.color} mb-4`}>
                        <action.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
                      <p className="text-white/70 text-sm">{action.description}</p>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Department Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Contestants by Department</h3>
            <div className="space-y-3">
              {departmentStats.map((dept) => (
                <div key={dept.name} className="flex justify-between items-center p-3 rounded-lg bg-white/10 backdrop-blur-md">
                  <span className="text-white font-medium">{dept.name}</span>
                  <span className="text-white/80">{dept.count} contestants</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Winners by Department</h3>
            <div className="space-y-3">
              {Object.entries(winnersByDepartment).map(([dept, count]) => (
                <div key={dept} className="flex justify-between items-center p-3 rounded-lg bg-white/10 backdrop-blur-md">
                  <span className="text-white font-medium">{dept}</span>
                  <span className="text-white/80">{count} winners</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Recent Winners */}
        {winners.length > 0 && (
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Winners</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-white/80 py-3 px-4">Name</th>
                    <th className="text-left text-white/80 py-3 px-4">Department</th>
                    <th className="text-left text-white/80 py-3 px-4">Draw Date</th>
                  </tr>
                </thead>
                <tbody>
                  {winners.slice(-5).reverse().map((winner) => (
                    <tr key={winner.id} className="border-b border-white/10">
                      <td className="py-3 px-4 text-white font-medium">{winner.name}</td>
                      <td className="py-3 px-4 text-white/80">{winner.department}</td>
                      <td className="py-3 px-4 text-white/80">
                        {new Date(winner.drawDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {winners.length > 5 && (
              <div className="mt-4 text-center">
                <Link 
                  to="/winners"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-200"
                >
                  View All Winners
                </Link>
              </div>
            )}
          </GlassCard>
        )}
      </div>
    </Layout>
  );
}