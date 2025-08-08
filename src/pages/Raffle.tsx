import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';
import GlassCard from '../components/GlassCard';
import { Trophy, Users, Clock, Play, Settings, Sparkles } from 'lucide-react';
import type { Contestant, Winner } from '../types';
import { getWinners, addWinner } from '../utils/storage';
import { getAllContestants, drawWinners } from '../utils/raffle';

export const Raffle: React.FC = () => {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWinners, setCurrentWinners] = useState<Contestant[]>([]);
  const [numberOfWinners, setNumberOfWinners] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'shaking' | 'picking' | 'revealing'>('idle');
  const [floatingChits, setFloatingChits] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    setContestants(getAllContestants());
    setWinners(getWinners());
  }, []);

  const handleDraw = async () => {
    const existingWinnerNames = winners.map(w => w.name);
    const eligibleContestants = contestants.filter(c => !existingWinnerNames.includes(c.name));
    
    if (eligibleContestants.length === 0) return;

    const actualWinnerCount = Math.min(numberOfWinners, eligibleContestants.length);
    
    setIsDrawing(true);
    setCurrentWinners([]);
    setAnimationPhase('shaking');

    // Generate floating chits for animation
    const chits = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5
    }));
    setFloatingChits(chits);

    // Shaking animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAnimationPhase('picking');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Draw winners
    const selectedWinners = drawWinners(eligibleContestants, actualWinnerCount, existingWinnerNames);
    
    setAnimationPhase('revealing');
    
    // Reveal winners one by one
    for (let i = 0; i < selectedWinners.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentWinners(prev => [...prev, selectedWinners[i]]);
      
      // Add winner to storage
      const newWinner = addWinner(selectedWinners[i]);
      setWinners(prev => [...prev, newWinner]);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsDrawing(false);
    setAnimationPhase('idle');
    setFloatingChits([]);
  };

  const existingWinnerNames = winners.map(w => w.name);
  const eligibleContestants = contestants.filter(c => !existingWinnerNames.includes(c.name));
  const maxWinners = Math.min(10, eligibleContestants.length);

  return (
    <Layout title="Raffle Draw">
      <Navigation />
      
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Total Contestants</h3>
                <p className="text-3xl font-bold text-white mt-1">{contestants.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20 backdrop-blur-md">
                <Users className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Eligible</h3>
                <p className="text-3xl font-bold text-white mt-1">{eligibleContestants.length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/20 backdrop-blur-md">
                <Clock className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Total Winners</h3>
                <p className="text-3xl font-bold text-white mt-1">{winners.length}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500/20 backdrop-blur-md">
                <Trophy className="w-6 h-6 text-yellow-300" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/80 text-sm font-medium">To Draw</h3>
                <p className="text-3xl font-bold text-white mt-1">{numberOfWinners}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/20 backdrop-blur-md">
                <Sparkles className="w-6 h-6 text-purple-300" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Main Drawing Area */}
        <GlassCard className="p-8">
          <div className="text-center space-y-8">
            {/* Jar Animation Container */}
            <div className="relative mx-auto w-80 h-80 mb-8">
              {/* Jar SVG */}
              <div className="relative w-full h-full">
                <svg viewBox="0 0 200 240" className="w-full h-full">
                  {/* Jar Body */}
                  <path
                    d="M40 60 L40 200 Q40 220 60 220 L140 220 Q160 220 160 200 L160 60 Z"
                    fill="rgba(255, 255, 255, 0.1)"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                  />
                  {/* Jar Neck */}
                  <rect
                    x="70"
                    y="40"
                    width="60"
                    height="25"
                    fill="rgba(255, 255, 255, 0.1)"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                    rx="5"
                  />
                  {/* Jar Lid */}
                  <rect
                    x="65"
                    y="35"
                    width="70"
                    height="10"
                    fill="rgba(255, 255, 255, 0.2)"
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="2"
                    rx="5"
                  />
                </svg>

                {/* Floating Chits Animation */}
                <AnimatePresence>
                  {floatingChits.map((chit) => (
                    <motion.div
                      key={chit.id}
                      initial={{ 
                        x: `${chit.x}%`, 
                        y: '70%',
                        scale: 0.8,
                        opacity: 0.8
                      }}
                      animate={
                        animationPhase === 'shaking' ? {
                          x: [`${chit.x}%`, `${chit.x + 5}%`, `${chit.x - 5}%`, `${chit.x}%`],
                          y: ['70%', '65%', '75%', '70%'],
                          rotate: [0, 10, -10, 0],
                          transition: {
                            duration: 0.5,
                            repeat: Infinity,
                            delay: chit.delay
                          }
                        } : animationPhase === 'picking' ? {
                          x: '50%',
                          y: '20%',
                          scale: 1.2,
                          opacity: 1,
                          transition: {
                            duration: 1,
                            delay: chit.delay,
                            ease: "easeOut"
                          }
                        } : {}
                      }
                      exit={{ 
                        opacity: 0,
                        scale: 0,
                        transition: { duration: 0.3 }
                      }}
                      className="absolute w-4 h-6 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-sm shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    />
                  ))}
                </AnimatePresence>

                {/* Jar Shaking Animation */}
                <motion.div
                  animate={
                    animationPhase === 'shaking' ? {
                      rotate: [0, 2, -2, 0],
                      transition: {
                        duration: 0.2,
                        repeat: Infinity
                      }
                    } : {}
                  }
                  className="absolute inset-0 pointer-events-none"
                />
              </div>
            </div>

            {/* Winners Display */}
            <AnimatePresence>
              {currentWinners.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center justify-center">
                    <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
                    {currentWinners.length === 1 ? 'Winner Selected!' : 'Winners Selected!'}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    {currentWinners.map((winner, index) => (
                      <motion.div
                        key={winner.name}
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30 backdrop-blur-md"
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                            {index + 1}
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{winner.name}</h3>
                          <p className="text-white/80 text-sm mb-1">{winner.department}</p>
                          <p className="text-white/60 text-xs">Supervisor: {winner.supervisor}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drawing Status */}
            {isDrawing && currentWinners.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                  />
                  <h2 className="text-2xl font-bold text-white">
                    {animationPhase === 'shaking' && 'Shaking the jar...'}
                    {animationPhase === 'picking' && 'Picking winners...'}
                    {animationPhase === 'revealing' && 'Revealing winners...'}
                  </h2>
                </div>
                <p className="text-white/70">
                  {animationPhase === 'shaking' && 'Mixing up all the contestant chits'}
                  {animationPhase === 'picking' && `Selecting ${numberOfWinners} winner${numberOfWinners > 1 ? 's' : ''} from the jar`}
                  {animationPhase === 'revealing' && 'Announcing the lucky winners'}
                </p>
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => setShowSettings(!showSettings)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-200"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </motion.button>

              <motion.button
                onClick={handleDraw}
                disabled={isDrawing || eligibleContestants.length === 0}
                whileHover={{ scale: isDrawing ? 1 : 1.05 }}
                whileTap={{ scale: isDrawing ? 1 : 0.95 }}
                className="flex items-center space-x-2 px-8 py-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                <Play className="w-5 h-5" />
                <span>
                  {isDrawing 
                    ? 'Drawing...' 
                    : eligibleContestants.length === 0 
                      ? 'No Eligible Contestants' 
                      : `Draw ${numberOfWinners} Winner${numberOfWinners > 1 ? 's' : ''}`
                  }
                </span>
              </motion.button>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <GlassCard className="p-6 max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-white mb-4">Draw Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Number of Winners to Draw
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="range"
                            min="1"
                            max={maxWinners}
                            value={numberOfWinners}
                            onChange={(e) => setNumberOfWinners(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                            disabled={isDrawing}
                          />
                          <span className="text-white font-bold text-lg min-w-[2rem] text-center">
                            {numberOfWinners}
                          </span>
                        </div>
                        <p className="text-white/60 text-xs mt-2">
                          Maximum: {maxWinners} (based on eligible contestants)
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {eligibleContestants.length === 0 && contestants.length > 0 && (
              <p className="text-white/60 text-sm">
                All contestants have already won. Great job completing the raffle!
              </p>
            )}
          </div>
        </GlassCard>

        {/* Eligible Contestants */}
        {eligibleContestants.length > 0 && (
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Eligible Contestants ({eligibleContestants.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {eligibleContestants.map((contestant) => (
                <motion.div
                  key={contestant.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-200"
                >
                  <h4 className="font-semibold text-white mb-1">{contestant.name}</h4>
                  <p className="text-white/70 text-sm mb-1">{contestant.department}</p>
                  <p className="text-white/50 text-xs">Supervisor: {contestant.supervisor}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10b981, #059669);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10b981, #059669);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </Layout>
  );
};