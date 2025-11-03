export function NeuralNexusLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle with gradient */}
      <circle 
        cx="50" 
        cy="50" 
        r="48" 
        className="fill-primary/10 dark:fill-primary/20"
        stroke="url(#gradient)" 
        strokeWidth="2"
      />
      
      {/* Neural Network Nodes */}
      <circle cx="30" cy="30" r="5" className="fill-primary" />
      <circle cx="70" cy="30" r="5" className="fill-primary" />
      <circle cx="50" cy="50" r="6" className="fill-primary" />
      <circle cx="30" cy="70" r="5" className="fill-primary" />
      <circle cx="70" cy="70" r="5" className="fill-primary" />
      
      {/* Neural Network Connections */}
      <line x1="30" y1="30" x2="50" y2="50" stroke="url(#gradient)" strokeWidth="2" opacity="0.6" />
      <line x1="70" y1="30" x2="50" y2="50" stroke="url(#gradient)" strokeWidth="2" opacity="0.6" />
      <line x1="50" y1="50" x2="30" y2="70" stroke="url(#gradient)" strokeWidth="2" opacity="0.6" />
      <line x1="50" y1="50" x2="70" y2="70" stroke="url(#gradient)" strokeWidth="2" opacity="0.6" />
      
      {/* Health Cross in Center */}
      <path 
        d="M 50 40 L 50 60 M 40 50 L 60 50" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round"
        className="text-primary"
      />
      
      {/* NN Monogram */}
      <text 
        x="50" 
        y="25" 
        textAnchor="middle" 
        className="fill-primary font-bold text-xs"
        style={{ fontSize: '12px', fontFamily: 'system-ui, sans-serif' }}
      >
        NN
      </text>
      
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="[stop-color:hsl(var(--primary))]" />
          <stop offset="100%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
