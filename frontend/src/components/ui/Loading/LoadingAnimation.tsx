import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

interface LoadingAnimationProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: 16,
  sm: 24,
  md: 40,
  lg: 64,
  xl: 100,
};

export const LoadingAnimation = ({
  size = 'sm',
  className = '',
}: LoadingAnimationProps) => {
  const dimension = sizeMap[size];

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <DotLottiePlayer
        src="/Loading 49 _ Car Types.lottie"
        autoplay
        loop
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
