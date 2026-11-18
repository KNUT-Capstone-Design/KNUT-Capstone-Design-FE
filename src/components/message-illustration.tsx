/** Original decorative SVG; contains no real message or analysis result. */
export function MessageIllustration() {
  return (
    <svg className="message-illustration" aria-hidden="true" viewBox="0 0 220 130" fill="none">
      <ellipse cx="113" cy="117" rx="75" ry="7" fill="#E4EAF0" />
      <g className="message-paper">
        <rect x="34" y="16" width="146" height="89" rx="20" fill="white" stroke="#CFD9E3" strokeWidth="1.5" />
        <path d="M61 104v12l19-12" fill="white" />
        <path d="M61 104v12l19-12" stroke="#CFD9E3" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="56" cy="38" r="5" fill="#D8E4F7" />
        <path d="M70 38h50M54 58h102M54 71h77" stroke="#DCE3EB" strokeWidth="5" strokeLinecap="round" />
        <path d="M54 85h54" stroke="#819CC5" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="message-lens">
        <path d="m175 88 20 20" stroke="#426185" strokeWidth="9" strokeLinecap="round" />
        <circle cx="158" cy="70" r="29" fill="#EDF4FF" fillOpacity=".94" stroke="#426185" strokeWidth="3" />
        <path d="M158 56v17" stroke="#426185" strokeWidth="3" strokeLinecap="round" />
        <circle cx="158" cy="82" r="1.8" fill="#426185" />
      </g>
    </svg>
  );
}
