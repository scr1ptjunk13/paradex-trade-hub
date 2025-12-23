export function PlaceholderChart() {
  return (
    <div className="trading-card flex-1 flex flex-col min-h-[400px] p-6">
      <div className="flex items-center gap-4 mb-4">
        <span className="label-uppercase text-[10px]">Chart</span>
        <div className="flex gap-2">
          {['1m', '5m', '15m', '1H', '4H', '1D'].map((tf) => (
            <button
              key={tf}
              className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="w-full h-48 relative mb-4">
            {/* Fake chart lines */}
            <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(120, 100%, 50%)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(120, 100%, 50%)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <g stroke="hsl(0, 0%, 15%)" strokeWidth="0.5">
                <line x1="0" y1="37.5" x2="400" y2="37.5" />
                <line x1="0" y1="75" x2="400" y2="75" />
                <line x1="0" y1="112.5" x2="400" y2="112.5" />
              </g>
              {/* Price line */}
              <path
                d="M 0 100 Q 50 90, 80 95 T 120 70 T 180 80 T 220 50 T 280 60 T 340 40 T 400 45"
                fill="none"
                stroke="hsl(120, 100%, 50%)"
                strokeWidth="1.5"
              />
              <path
                d="M 0 100 Q 50 90, 80 95 T 120 70 T 180 80 T 220 50 T 280 60 T 340 40 T 400 45 L 400 150 L 0 150 Z"
                fill="url(#greenGradient)"
              />
            </svg>
          </div>
          <p className="text-xs">TradingView chart integration</p>
        </div>
      </div>
    </div>
  );
}