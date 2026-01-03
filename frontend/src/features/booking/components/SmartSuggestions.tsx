import { useState, useEffect } from 'react';
import {
  Home,
  Briefcase,
  Clock,
  MapPin,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface LocationSuggestion {
  type: 'home' | 'work' | 'frequent' | 'recent' | 'predicted';
  label: string;
  address: string;
  lat: number;
  lng: number;
  confidence: number;
  reason: string;
}

interface FareInsight {
  type: 'lower' | 'higher' | 'normal';
  message: string;
  suggestedTime?: string;
}

interface SmartSuggestionsProps {
  onSelectLocation: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  className?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function SmartSuggestions({
  onSelectLocation,
  className,
}: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<{
    locations: LocationSuggestion[];
    fareInsight?: FareInsight;
  }>({ locations: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/users/suggestions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type: LocationSuggestion['type']) => {
    switch (type) {
      case 'home':
        return <Home className="h-5 w-5" />;
      case 'work':
        return <Briefcase className="h-5 w-5" />;
      case 'predicted':
        return <Sparkles className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: LocationSuggestion['type']) => {
    switch (type) {
      case 'home':
        return 'text-blue-500 bg-blue-500/10';
      case 'work':
        return 'text-amber-500 bg-amber-500/10';
      case 'predicted':
        return 'text-purple-500 bg-purple-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  if (isLoading) {
    return (
      <div className={cn('animate-pulse space-y-3', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  if (suggestions.locations.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Fare Insight Banner */}
      {suggestions.fareInsight && suggestions.fareInsight.type !== 'normal' && (
        <div
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg',
            suggestions.fareInsight.type === 'lower'
              ? 'bg-green-500/10 text-green-700 dark:text-green-400'
              : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
          )}
        >
          {suggestions.fareInsight.type === 'lower' ? (
            <TrendingDown className="h-5 w-5" />
          ) : (
            <TrendingUp className="h-5 w-5" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">
              {suggestions.fareInsight.message}
            </p>
            {suggestions.fareInsight.suggestedTime && (
              <p className="text-xs opacity-80">
                Better prices around {suggestions.fareInsight.suggestedTime}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Location Suggestions */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Suggested Destinations</h3>
        </div>
        <div className="space-y-2">
          {suggestions.locations.map((location, index) => (
            <button
              key={`${location.address}-${index}`}
              onClick={() =>
                onSelectLocation({
                  address: location.address,
                  lat: location.lat,
                  lng: location.lng,
                })
              }
              className="w-full flex items-center gap-3 p-3 bg-card border rounded-lg hover:bg-muted/50 transition-colors text-left group"
            >
              <div
                className={cn('p-2 rounded-lg', getTypeColor(location.type))}
              >
                {getIcon(location.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{location.label}</span>
                  {location.confidence > 0.8 && (
                    <span className="px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded">
                      Likely
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {location.address}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {location.reason}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SmartSuggestions;
