import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { VideoProgress } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';

interface PlaylistItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
}

export function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<VideoProgress[]>([]);
  const [activeTab, setActiveTab] = useState('staff');

  const playlists = {
    staff: [
      {
        id: '1',
        title: 'Hogares autosostenibles',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
        duration: '10:00'
      },
      {
        id: '2',
        title: 'Energías renovables',
        thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=60',
        duration: '15:00'
      },
      {
        id: '3',
        title: 'Agricultura urbana',
        thumbnail: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&auto=format&fit=crop&q=60',
        duration: '12:00'
      }
    ],
    my: [
      {
        id: '4',
        title: 'Mi Playlist',
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60',
        duration: '20:00'
      }
    ],
    categories: [
      {
        id: '5',
        title: 'Sostenibilidad',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60',
        duration: '45:00'
      }
    ]
  };

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  async function fetchProgress() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('video_progress')
        .select(`
          *,
          video:videos(title)
        `)
        .eq('user_id', user?.id)
        .order('last_watched_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  }

  const PlaylistCard = ({ item }: { item: PlaylistItem }) => (
    <Link to={`/video/${item.id}`} className="block">
      <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
        <img 
          src={item.thumbnail} 
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {item.duration}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</h3>
    </Link>
  );

  return (
    <div className="max-w-md mx-auto px-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto py-2">
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeTab === 'staff' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Playlist del staff
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeTab === 'my' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Mis Playlist
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeTab === 'categories' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Categorías
        </button>
      </div>

      {/* Active Users */}
      <div className="mb-6">
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">150 jugadores activos</span>
        </div>
      </div>

      {/* Playlist Grid */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {playlists[activeTab as keyof typeof playlists].map((item) => (
          <PlaylistCard key={item.id} item={item} />
        ))}
      </div>

      {/* Continue Watching */}
      {progress.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Continuar viendo</h2>
          <div className="space-y-4">
            {progress.map((item) => (
              <Link
                key={item.id}
                to={`/video/${item.video_id}`}
                className="block bg-white rounded-lg shadow p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <Play className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.video.title}
                    </h3>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(item.progress * 100)}%</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${item.progress * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}