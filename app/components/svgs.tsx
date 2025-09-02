import { clsx } from "clsx";

export const WavesHero = ({ className, fill }: SVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 300"
      className={className}
      fill="none"
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0, 119, 182, 0.1)" />
          <stop offset="50%" stopColor="rgba(0, 191, 166, 0.1)" />
          <stop offset="100%" stopColor="rgba(255, 107, 107, 0.1)" />
        </linearGradient>
        <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0, 119, 182, 0.2)" />
          <stop offset="50%" stopColor="rgba(0, 191, 166, 0.2)" />
          <stop offset="100%" stopColor="rgba(255, 107, 107, 0.2)" />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle cx="200" cy="150" r="120" fill="url(#waveGradient)" />
      
      {/* Main wave lines */}
      <path
        d="M0 200 Q50 180 100 200 T200 200 T300 200 T400 200 L400 300 L0 300 Z"
        fill="url(#waveGradient2)"
        className="animate-wave-float"
      />
      
      {/* Wave 1 */}
      <path
        d="M0 220 Q50 200 100 220 T200 220 T300 220 T400 220 L400 300 L0 300 Z"
        fill="rgba(0, 119, 182, 0.15)"
        className="animate-wave-flow"
      />
      
      {/* Wave 2 */}
      <path
        d="M0 240 Q50 220 100 240 T200 240 T300 240 T400 240 L400 300 L0 300 Z"
        fill="rgba(0, 191, 166, 0.15)"
        className="animate-wave-float"
        style={{ animationDelay: '1s' }}
      />
      
      {/* Wave 3 */}
      <path
        d="M0 260 Q50 240 100 260 T200 260 T300 260 T400 260 L400 300 L0 300 Z"
        fill="rgba(255, 107, 107, 0.15)"
        className="animate-wave-flow"
        style={{ animationDelay: '2s' }}
      />
      
      {/* Floating music notes */}
      <g className="animate-float" style={{ animationDelay: '0.5s' }}>
        <circle cx="80" cy="100" r="3" fill="rgba(0, 119, 182, 0.6)" />
        <circle cx="320" cy="80" r="2" fill="rgba(0, 191, 166, 0.6)" />
        <circle cx="280" cy="120" r="2.5" fill="rgba(255, 107, 107, 0.6)" />
      </g>
      
      {/* Central wave symbol */}
      <g className="animate-pulse">
        <path
          d="M180 140 Q200 120 220 140 T260 140"
          stroke="rgba(0, 119, 182, 0.8)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M140 160 Q160 140 180 160 T220 160"
          stroke="rgba(0, 191, 166, 0.8)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M200 180 Q220 160 240 180 T280 180"
          stroke="rgba(255, 107, 107, 0.8)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
