import { useState, useEffect } from 'react';
import {
  Music,
  Thermometer,
  MessageSquare,
  Accessibility,
  Dog,
  Baby,
  Star,
  Shield,
  User,
  Save,
  Loader2,
} from 'lucide-react';
import { cn } from '@/shared/utils/utils';

interface AccessibilityNeeds {
  wheelchairAccessible: boolean;
  visualAssistance: boolean;
  hearingAssistance: boolean;
  mobilityAssistance: boolean;
}

interface RidePreferences {
  musicPreference: string;
  temperaturePreference: string;
  communicationStyle: string;
  accessibilityNeeds: AccessibilityNeeds;
  petFriendly: boolean;
  childSeat: boolean;
  preferFemaleDriver: boolean | null;
  preferVerifiedDriver: boolean;
  minimumDriverRating: number;
}

const MUSIC_OPTIONS = [
  { value: 'classical', label: 'Classical' },
  { value: 'pop', label: 'Pop' },
  { value: 'rock', label: 'Rock' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'no_music', label: 'No Music' },
  { value: 'drivers_choice', label: "Driver's Choice" },
];

const TEMPERATURE_OPTIONS = [
  { value: 'cold', label: 'Cold', icon: '❄️' },
  { value: 'moderate', label: 'Moderate', icon: '🌤️' },
  { value: 'warm', label: 'Warm', icon: '☀️' },
];

const COMMUNICATION_OPTIONS = [
  { value: 'chatty', label: 'Chatty', description: 'I enjoy conversation' },
  {
    value: 'quiet',
    label: 'Quiet Ride',
    description: 'Prefer minimal talking',
  },
  {
    value: 'professional',
    label: 'Professional',
    description: 'Work-related only',
  },
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface PreferencesSettingsProps {
  className?: string;
}

export function PreferencesSettings({ className }: PreferencesSettingsProps) {
  const [preferences, setPreferences] = useState<RidePreferences>({
    musicPreference: 'drivers_choice',
    temperaturePreference: 'moderate',
    communicationStyle: 'professional',
    accessibilityNeeds: {
      wheelchairAccessible: false,
      visualAssistance: false,
      hearingAssistance: false,
      mobilityAssistance: false,
    },
    petFriendly: false,
    childSeat: false,
    preferFemaleDriver: null,
    preferVerifiedDriver: false,
    minimumDriverRating: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/users/preferences`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = <K extends keyof RidePreferences>(
    key: K,
    value: RidePreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateAccessibility = (
    key: keyof AccessibilityNeeds,
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      accessibilityNeeds: { ...prev.accessibilityNeeds, [key]: value },
    }));
    setHasChanges(true);
  };

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      });
      if (response.ok) {
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Ride Preferences</h2>
        {hasChanges && (
          <button
            onClick={savePreferences}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        )}
      </div>

      {/* Music Preference */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center gap-3 mb-4">
          <Music className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Music Preference</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MUSIC_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updatePreference('musicPreference', option.value)}
              className={cn(
                'px-4 py-2 rounded-lg border text-sm transition-colors',
                preferences.musicPreference === option.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Temperature Preference */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center gap-3 mb-4">
          <Thermometer className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Temperature Preference</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TEMPERATURE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                updatePreference('temperaturePreference', option.value)
              }
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-3 rounded-lg border transition-colors',
                preferences.temperaturePreference === option.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted'
              )}
            >
              <span className="text-xl">{option.icon}</span>
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Communication Style */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Communication Style</h3>
        </div>
        <div className="space-y-2">
          {COMMUNICATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                updatePreference('communicationStyle', option.value)
              }
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors text-left',
                preferences.communicationStyle === option.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted'
              )}
            >
              <div>
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs opacity-70">{option.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility Needs */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center gap-3 mb-4">
          <Accessibility className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Accessibility Needs</h3>
        </div>
        <div className="space-y-3">
          {[
            {
              key: 'wheelchairAccessible' as const,
              label: 'Wheelchair Accessible',
            },
            { key: 'visualAssistance' as const, label: 'Visual Assistance' },
            { key: 'hearingAssistance' as const, label: 'Hearing Assistance' },
            {
              key: 'mobilityAssistance' as const,
              label: 'Mobility Assistance',
            },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="text-sm">{label}</span>
              <button
                onClick={() =>
                  updateAccessibility(key, !preferences.accessibilityNeeds[key])
                }
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  preferences.accessibilityNeeds[key]
                    ? 'bg-primary'
                    : 'bg-muted'
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                    preferences.accessibilityNeeds[key]
                      ? 'translate-x-7'
                      : 'translate-x-1'
                  )}
                />
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="bg-card rounded-lg p-4 border">
        <h3 className="font-medium mb-4">Additional Options</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <Dog className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Pet Friendly</span>
            </div>
            <button
              onClick={() =>
                updatePreference('petFriendly', !preferences.petFriendly)
              }
              className={cn(
                'w-12 h-6 rounded-full transition-colors relative',
                preferences.petFriendly ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                  preferences.petFriendly ? 'translate-x-7' : 'translate-x-1'
                )}
              />
            </button>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <Baby className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Child Seat Required</span>
            </div>
            <button
              onClick={() =>
                updatePreference('childSeat', !preferences.childSeat)
              }
              className={cn(
                'w-12 h-6 rounded-full transition-colors relative',
                preferences.childSeat ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                  preferences.childSeat ? 'translate-x-7' : 'translate-x-1'
                )}
              />
            </button>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Prefer Verified Drivers</span>
            </div>
            <button
              onClick={() =>
                updatePreference(
                  'preferVerifiedDriver',
                  !preferences.preferVerifiedDriver
                )
              }
              className={cn(
                'w-12 h-6 rounded-full transition-colors relative',
                preferences.preferVerifiedDriver ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                  preferences.preferVerifiedDriver
                    ? 'translate-x-7'
                    : 'translate-x-1'
                )}
              />
            </button>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Prefer Female Driver</span>
            </div>
            <button
              onClick={() =>
                updatePreference(
                  'preferFemaleDriver',
                  preferences.preferFemaleDriver === true ? null : true
                )
              }
              className={cn(
                'w-12 h-6 rounded-full transition-colors relative',
                preferences.preferFemaleDriver === true
                  ? 'bg-primary'
                  : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                  preferences.preferFemaleDriver === true
                    ? 'translate-x-7'
                    : 'translate-x-1'
                )}
              />
            </button>
          </label>
        </div>
      </div>

      {/* Minimum Driver Rating */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center gap-3 mb-4">
          <Star className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Minimum Driver Rating</h3>
        </div>
        <div className="flex items-center gap-2">
          {[0, 3, 3.5, 4, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => updatePreference('minimumDriverRating', rating)}
              className={cn(
                'px-4 py-2 rounded-lg border text-sm transition-colors',
                preferences.minimumDriverRating === rating
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted'
              )}
            >
              {rating === 0 ? 'Any' : `${rating}+`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PreferencesSettings;
