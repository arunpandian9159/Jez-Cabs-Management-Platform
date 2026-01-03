import { useState } from 'react';
import {
  Star,
  ThumbsUp,
  Camera,
  X,
  Loader2,
  Car,
  MessageSquare,
  Map,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/shared/utils/utils';

interface CategoryRatings {
  drivingSkills: number;
  vehicleCleanliness: number;
  communication: number;
  routeKnowledge: number;
}

interface EnhancedRatingModalProps {
  tripId: string;
  driverName: string;
  driverAvatar?: string;
  onClose: () => void;
  onSubmit: (rating: {
    overall: number;
    categories: CategoryRatings;
    comment: string;
    tags: string[];
    photos: string[];
  }) => Promise<void>;
  className?: string;
}

const RATING_TAGS = [
  { id: 'polite', label: 'Polite', icon: '😊' },
  { id: 'safe_driver', label: 'Safe Driver', icon: '🛡️' },
  { id: 'clean_car', label: 'Clean Car', icon: '✨' },
  { id: 'good_music', label: 'Good Music', icon: '🎵' },
  { id: 'helpful', label: 'Helpful', icon: '🤝' },
  { id: 'punctual', label: 'Punctual', icon: '⏰' },
  { id: 'professional', label: 'Professional', icon: '👔' },
  { id: 'friendly', label: 'Friendly', icon: '🙂' },
];

const CATEGORY_CONFIG = [
  {
    key: 'drivingSkills' as const,
    label: 'Driving Skills',
    icon: Car,
    description: 'Safe and smooth driving',
  },
  {
    key: 'vehicleCleanliness' as const,
    label: 'Vehicle Cleanliness',
    icon: Sparkles,
    description: 'Clean and well-maintained',
  },
  {
    key: 'communication' as const,
    label: 'Communication',
    icon: MessageSquare,
    description: 'Clear and helpful communication',
  },
  {
    key: 'routeKnowledge' as const,
    label: 'Route Knowledge',
    icon: Map,
    description: 'Knows the best routes',
  },
];

function StarRating({
  value,
  onChange,
  size = 'md',
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [hovered, setHovered] = useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          disabled={!onChange}
          className={cn(
            'transition-transform',
            onChange && 'hover:scale-110 cursor-pointer'
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              'transition-colors',
              (hovered || value) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function EnhancedRatingModal({
  tripId: _tripId,
  driverName,
  driverAvatar,
  onClose,
  onSubmit,
  className,
}: EnhancedRatingModalProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<CategoryRatings>({
    drivingSkills: 0,
    vehicleCleanliness: 0,
    communication: 0,
    routeKnowledge: 0,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'rating' | 'details'>('rating');

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you'd upload these to a server
    // For now, we'll just use local URLs
    const newPhotos = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 3)); // Max 3 photos
  };

  const handleSubmit = async () => {
    if (overallRating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        overall: overallRating,
        categories: categoryRatings,
        comment,
        tags: selectedTags,
        photos,
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = overallRating > 0;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
        className
      )}
    >
      <div className="bg-background rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Rate Your Ride</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {step === 'rating' ? (
            <>
              {/* Driver Info */}
              <div className="flex flex-col items-center text-center">
                {driverAvatar ? (
                  <img
                    src={driverAvatar}
                    alt={driverName}
                    className="w-20 h-20 rounded-full object-cover mb-3"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-3xl font-semibold text-primary">
                      {driverName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <h3 className="font-medium">{driverName}</h3>
                <p className="text-sm text-muted-foreground">
                  How was your ride?
                </p>
              </div>

              {/* Overall Rating */}
              <div className="flex flex-col items-center">
                <StarRating
                  value={overallRating}
                  onChange={setOverallRating}
                  size="lg"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {overallRating === 0 && 'Tap to rate'}
                  {overallRating === 1 && 'Poor'}
                  {overallRating === 2 && 'Fair'}
                  {overallRating === 3 && 'Good'}
                  {overallRating === 4 && 'Very Good'}
                  {overallRating === 5 && 'Excellent!'}
                </p>
              </div>

              {/* Quick Tags */}
              {overallRating > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3">
                    What made your ride great?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {RATING_TAGS.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={cn(
                          'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors',
                          selectedTags.includes(tag.id)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        )}
                      >
                        <span>{tag.icon}</span>
                        <span>{tag.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Category Ratings */}
              <div className="space-y-4">
                <p className="text-sm font-medium">Rate specific aspects</p>
                {CATEGORY_CONFIG.map(
                  ({ key, label, icon: Icon, description }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-muted-foreground">
                            {description}
                          </p>
                        </div>
                      </div>
                      <StarRating
                        value={categoryRatings[key]}
                        onChange={(value) =>
                          setCategoryRatings((prev) => ({
                            ...prev,
                            [key]: value,
                          }))
                        }
                        size="sm"
                      />
                    </div>
                  )
                )}
              </div>

              {/* Comment */}
              <div>
                <p className="text-sm font-medium mb-2">
                  Add a comment (optional)
                </p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full px-3 py-2 border rounded-lg text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <p className="text-sm font-medium mb-2">
                  Add photos (optional)
                </p>
                <div className="flex gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <button
                        onClick={() =>
                          setPhotos((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 3 && (
                    <label className="w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                      <Camera className="h-5 w-5 text-muted-foreground" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-3">
          {step === 'rating' ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                Skip
              </button>
              <button
                onClick={() => setStep('details')}
                disabled={!canSubmit}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  canSubmit
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('rating')}
                className="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <ThumbsUp className="h-4 w-4" />
                    Submit Rating
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnhancedRatingModal;
