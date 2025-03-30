import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { AnalyticsData, VideoProgress } from '../lib/types';

export function Analytics() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'progress' | 'activity' | 'ranking'>('progress');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalWatchTime: 0,
    videosWatched: 0,
    averageScore: 0,
    completionRate: 0,
    recentProgress: [],
  });

  const categories = [
    { name: 'Familia', progress: 30 },
    { name: 'Autoconocimiento', progress: 45 },
    { name: 'Salud', progress: 60 },
    { name: 'Pareja', progress: 25 },
    { name: 'Dinero', progress: 40 },
    { name: 'Salud mental', progress: 70 },
    { name: 'Trabajo', progress: 80 },
    { name: 'Misión', progress: 65 },
  ];

  const rankings = [
    { position: 2, nickname: '@Player1', points: 89 },
    { position: 3, nickname: '@Player2', points: 76 },
    { position: 4, nickname: '@Player3', points: 43 },
    { position: 144, nickname: '@Mi Nickname', points: 10, isUser: true },
  ];

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user]);

  async function fetchAnalyticsData() {
    try {
      setLoading(true);
      const { data: progressData } = await supabase
        .from('video_progress')
        .select('*')
        .eq('user_id', user?.id);

      if (progressData) {
        setAnalyticsData({
          totalWatchTime: progressData.reduce((sum, p) => sum + p.watch_time, 0),
          videosWatched: new Set(progressData.map(p => p.video_id)).size,
          averageScore: 85.5, // Example score
          completionRate: 70,
          recentProgress: [],
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-medium">Perfil</h1>
        <button className="p-2">•••</button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'progress'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600'
            }`}
          >
            Mi progreso
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'activity'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600'
            }`}
          >
            Actividad
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'ranking'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600'
            }`}
          >
            Ranking
          </button>
        </div>
      </div>

      {activeTab === 'progress' && (
        <div className="px-4 py-6">
          {/* Progress Octagon */}
          <div className="bg-purple-700 rounded-lg p-6 mb-8 text-white">
            <h3 className="text-lg font-medium mb-1">Tu cometa</h3>
            <p className="text-sm mb-2">
              Has crecido en 5 áreas en los últimos 7 días ¡Lo estás haciendo excelente!
            </p>
            <p className="text-sm">+8.5% 7d</p>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{category.name}</span>
                  <span>{category.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${category.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button className="w-full bg-purple-700 text-white py-3 rounded-lg mt-8">
            Mejorar mi rendimiento
          </button>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="px-4 py-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Mis Öndas ganadas: 10</h2>
            
            {/* Ranking Table */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between text-sm font-medium mb-4">
                <span className="text-purple-600">Posición</span>
                <span>Jugadores</span>
                <span className="text-purple-600">Öndas</span>
              </div>
              {rankings.map((rank) => (
                <div
                  key={rank.nickname}
                  className={`flex justify-between items-center py-2 ${
                    rank.isUser ? 'bg-red-50 text-red-600' : ''
                  }`}
                >
                  <span>{rank.position} {rank.position <= 3 ? '🏆' : '⭐'}</span>
                  <span>{rank.nickname}</span>
                  <span>{rank.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Chart */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium">Abril</span>
              <ChevronRight className="h-5 w-5" />
            </div>
            
            <div className="flex justify-around">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm">
                Días
              </button>
              <button className="px-4 py-2 text-gray-600 text-sm">
                Meses
              </button>
            </div>
          </div>

          {/* Watch Time */}
          <div>
            <h3 className="font-medium mb-4">Tiempo de reproducción</h3>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-600">Mi tiempo hoy</p>
                <p className="font-medium">3h 10min</p>
              </div>
              <div className="w-16 h-16 border-4 border-purple-600 rounded-full" />
            </div>
            <div className="flex justify-between text-sm">
              <span>Últimos 7 días</span>
              <span>50 min</span>
            </div>
          </div>

          {/* Rest Reminder */}
          <div className="flex justify-between items-center mt-6">
            <div>
              <p className="font-medium">Recordatorio de descanso</p>
              <p className="text-sm text-gray-600">Desactivado</p>
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}