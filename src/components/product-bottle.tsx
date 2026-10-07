import { bottleTone } from "@/lib/catalog";

type Props = {
  color?: string;
  label?: string;
  className?: string;
};

const palettes: Record<string, { glass: [string, string, string]; foil: string; accent: string; paper: string }> = {
  red: { glass: ["#172b25", "#26342a", "#0a1714"], foil: "#632d31", accent: "#702e35", paper: "#eee2ca" },
  white: { glass: ["#65734a", "#89966c", "#344830"], foil: "#bba670", accent: "#737a4a", paper: "#f3ead2" },
  rose: { glass: ["#967766", "#b2947d", "#584b3e"], foil: "#c2a38a", accent: "#a26b67", paper: "#f7e9db" },
  sparkling: { glass: ["#454e33", "#6b7150", "#20291e"], foil: "#b49b65", accent: "#8a6c3d", paper: "#eee7d0" },
  "alcohol-free": { glass: ["#7c8754", "#a5a86c", "#4f603b"], foil: "#746e49", accent: "#7a7e51", paper: "#f3ebd3" },
};

export function ProductBottle({ color = "rouge", label = "LA SÉLECTION", className = "" }: Props) {
  const tone = bottleTone(color);
  const palette = palettes[tone];
  const gradientId = `glass-${tone}`;
  const shineId = `shine-${tone}`;
  const shortLabel = label.length > 20 ? `${label.slice(0, 19)}…` : label;

  return (
    <svg className={`product-bottle ${className}`} viewBox="0 0 180 430" role="img" aria-label={`Illustration d'une bouteille ${color}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1">
          <stop offset="0" stopColor={palette.glass[0]} />
          <stop offset="0.26" stopColor={palette.glass[1]} />
          <stop offset="0.58" stopColor={palette.glass[0]} />
          <stop offset="1" stopColor={palette.glass[2]} />
        </linearGradient>
        <linearGradient id={shineId} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".02" />
          <stop offset=".3" stopColor="#fff" stopOpacity=".22" />
          <stop offset=".48" stopColor="#fff" stopOpacity=".025" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="90" cy="414" rx="53" ry="8" fill="#211915" opacity=".15" />
      <path d="M67 22 Q67 17 72 17 L108 17 Q113 17 113 22 L113 91 L67 91Z" fill={palette.foil} />
      <path d="M67 31 L113 31 M67 39 L113 39 M67 81 L113 81" stroke="#f2dfb2" strokeOpacity=".28" strokeWidth="1" />
      <path d="M71 91 L109 91 L109 111 C109 132 126 137 134 160 C141 181 143 209 143 240 L143 379 Q143 403 127 406 L53 406 Q37 403 37 379 L37 240 C37 209 39 181 46 160 C54 137 71 132 71 111Z" fill={`url(#${gradientId})`} stroke="#19231c" strokeOpacity=".45" strokeWidth="1.5" />
      <path d="M71 91 L109 91 L109 111 C109 132 126 137 134 160 C141 181 143 209 143 240 L143 379 Q143 403 127 406 L53 406 Q37 403 37 379 L37 240 C37 209 39 181 46 160 C54 137 71 132 71 111Z" fill={`url(#${shineId})`} />
      <path d="M48 200 Q46 261 47 365" fill="none" stroke="#fff" strokeOpacity=".1" strokeWidth="4" strokeLinecap="round" />
      <rect x="45" y="210" width="90" height="119" rx="2" fill={palette.paper} />
      <rect x="49" y="214" width="82" height="111" fill="none" stroke={palette.accent} strokeOpacity=".55" strokeWidth=".65" />
      <text x="90" y="235" textAnchor="middle" fill={palette.accent} fontFamily="Georgia,serif" fontSize="6.4" letterSpacing="1.05">GUEULES DE</text>
      <text x="90" y="271" textAnchor="middle" fill={palette.accent} fontFamily="Georgia,serif" fontSize="17" fontStyle="italic" letterSpacing="-.35">RVins</text>
      <path d="M65 280 L115 280" stroke={palette.accent} strokeOpacity=".6" strokeWidth=".7" />
      <text x="90" y="294" textAnchor="middle" fill={palette.accent} fontFamily="Georgia,serif" fontSize="7.4" letterSpacing="1">VIGNERONS</text>
      <text x="90" y="306" textAnchor="middle" fill={palette.accent} fontFamily="Arial,sans-serif" fontSize="5.2" letterSpacing="1.3">PAR RVins</text>
      <text x="90" y="319" textAnchor="middle" fill={palette.accent} fontFamily="Arial,sans-serif" fontSize="4.9" letterSpacing=".45">{shortLabel.toUpperCase()}</text>
      <path d="M55 346 L125 346" stroke="#fff" strokeOpacity=".12" strokeWidth="1" />
    </svg>
  );
}
