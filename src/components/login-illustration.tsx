export function LoginIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background elements */}
      <ellipse cx="140" cy="160" rx="40" ry="40" fill="#D4D9F5" opacity="0.6"/>
      <rect x="200" y="145" width="140" height="30" rx="15" fill="#D4D9F5" opacity="0.6"/>
      <rect x="380" y="130" width="180" height="30" rx="15" fill="#D4D9F5" opacity="0.6"/>
      <rect x="690" cy="120" width="80" height="25" rx="12" fill="#D4D9F5" opacity="0.6"/>
      
      {/* Main globe */}
      <circle cx="350" cy="380" r="180" fill="#3B5BDB"/>
      <circle cx="350" cy="380" r="150" fill="#4C6EF5"/>
      
      {/* Location pin */}
      <path d="M350 250 C320 250 295 275 295 305 C295 345 350 400 350 400 C350 400 405 345 405 305 C405 275 380 250 350 250Z" fill="#FFA94D"/>
      <circle cx="350" cy="305" r="25" fill="#FFD43B"/>
      
      {/* Laptop */}
      <rect x="520" y="420" width="140" height="100" rx="8" fill="#5C7CFA" stroke="#364FC7" strokeWidth="3"/>
      <rect x="530" y="430" width="120" height="70" fill="#E7F5FF"/>
      <path d="M490 520 L690 520 L680 540 L500 540 Z" fill="#364FC7"/>
      
      {/* Person with laptop (right) */}
      <ellipse cx="600" cy="360" rx="25" ry="30" fill="#FFB3BA"/>
      <circle cx="600" cy="345" r="18" fill="#FFB3BA"/>
      <path d="M600 355 L600 390" stroke="#2B3A67" strokeWidth="3"/>
      <path d="M600 370 L620 390" stroke="#2B3A67" strokeWidth="3"/>
      <path d="M600 370 L580 400" stroke="#2B3A67" strokeWidth="3"/>
      
      {/* Person standing (center-top) */}
      <circle cx="420" cy="220" r="20" fill="#4ECDC4"/>
      <rect x="410" y="240" width="20" height="35" rx="5" fill="#FFD93D"/>
      <path d="M420 255 L405 280" stroke="#2B3A67" strokeWidth="3"/>
      <path d="M420 255 L435 280" stroke="#2B3A67" strokeWidth="3"/>
      <rect x="415" y="275" width="10" height="25" fill="#2B3A67"/>
      
      {/* Person with laptop (left) */}
      <circle cx="220" cy="320" r="18" fill="#95E1D3"/>
      <rect x="210" y="338" width="20" height="30" rx="5" fill="#38B6A8"/>
      <rect x="200" y="355" width="40" height="25" rx="3" fill="#5C7CFA"/>
      
      {/* Person sitting (bottom) */}
      <circle cx="370" cy="520" r="18" fill="#F38181"/>
      <rect x="360" y="538" width="20" height="25" rx="5" fill="#AA4465"/>
      <rect x="350" y="555" width="40" height="8" rx="4" fill="#2B3A67"/>
      
      {/* Person with phone (left-bottom) */}
      <circle cx="180" cy="480" r="16" fill="#A8E6CF"/>
      <rect x="172" y="496" width="16" height="28" rx="4" fill="#6C5B7B"/>
      <rect x="175" y="505" width="10" height="15" rx="2" fill="#5C7CFA"/>
      
      {/* Chat bubbles */}
      <circle cx="260" cy="290" r="25" fill="#5C7CFA"/>
      <circle cx="275" cy="300" r="20" fill="#4C6EF5"/>
      <circle cx="265" cy="295" r="3" fill="white"/>
      <circle cx="275" cy="295" r="3" fill="white"/>
      <circle cx="285" cy="295" r="3" fill="white"/>
      
      {/* Decorative arrows */}
      <path d="M480 240 L500 245 L480 250" stroke="#C5CAE9" strokeWidth="3" fill="none"/>
      <path d="M490 245 L510 250 L490 255" stroke="#C5CAE9" strokeWidth="3" fill="none"/>
      <path d="M500 250 L520 255 L500 260" stroke="#C5CAE9" strokeWidth="3" fill="none"/>
      
      <path d="M640 270 L660 275 L640 280" stroke="#C5CAE9" strokeWidth="3" fill="none"/>
      <path d="M650 275 L670 280 L650 285" stroke="#C5CAE9" strokeWidth="3" fill="none"/>
      
      {/* Wavy lines */}
      <path d="M560 280 Q570 275 580 280 Q590 285 600 280" stroke="#C5CAE9" strokeWidth="2" fill="none"/>
      <path d="M250 240 Q260 235 270 240 Q280 245 290 240" stroke="#C5CAE9" strokeWidth="2" fill="none"/>
      
      {/* Bottom decorative elements */}
      <ellipse cx="180" cy="570" rx="60" ry="15" fill="#D4D9F5" opacity="0.6"/>
      <ellipse cx="420" cy="580" rx="80" ry="15" fill="#D4D9F5" opacity="0.6"/>
      <rect x="260" y="565" width="60" height="12" rx="6" fill="#D4D9F5" opacity="0.6"/>
    </svg>
  )
}
