type BanknoteProps = {
  x?: number
  y?: number
  width?: number
  height?: number
  opacity?: number
}

export default function Banknote({
  x = 0,
  y = 0,
  width = 108,
  height = 56,
  opacity = 0.92,
}: BanknoteProps) {
  const r = 4
  const id = 'bn'

  return (
    <g
      transform={`translate(${x}, ${y})`}
      opacity={opacity}
      style={{ pointerEvents: 'none' }}
    >
      <defs>
        <pattern
          id={`${id}-hatch`}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(35)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="#000"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect
        width={width}
        height={height}
        rx={r}
        ry={r}
        fill="#fff"
        stroke="#000"
        strokeWidth="1.5"
      />
      <rect
        x="3.5"
        y="3.5"
        width={width - 7}
        height={height - 7}
        rx={2.5}
        ry={2.5}
        fill={`url(#${id}-hatch)`}
        stroke="#000"
        strokeWidth="1"
        strokeOpacity="0.55"
      />

      <rect
        x="8"
        y="8"
        width="14"
        height="14"
        rx="1"
        fill="none"
        stroke="#000"
        strokeWidth="1"
      />
      <text
        x="15"
        y="18.5"
        textAnchor="middle"
        fontSize="10"
        fontFamily="KaTeX_Main, serif"
        fill="#000"
      >
        $
      </text>

      <rect
        x={width - 22}
        y={height - 22}
        width="14"
        height="14"
        rx="1"
        fill="none"
        stroke="#000"
        strokeWidth="1"
      />
      <text
        x={width - 15}
        y={height - 11.5}
        textAnchor="middle"
        fontSize="10"
        fontFamily="KaTeX_Main, serif"
        fill="#000"
      >
        $
      </text>

      <circle
        cx={width / 2}
        cy={height / 2}
        r="13"
        fill="#fff"
        stroke="#000"
        strokeWidth="1.25"
      />
      <circle
        cx={width / 2}
        cy={height / 2}
        r="10"
        fill="none"
        stroke="#000"
        strokeWidth="0.75"
        strokeDasharray="2 1.5"
      />
      <text
        x={width / 2}
        y={height / 2 + 5}
        textAnchor="middle"
        fontSize="16"
        fontFamily="KaTeX_Main, serif"
        fontWeight="700"
        fill="#000"
      >
        $
      </text>

      <text
        x="10"
        y={height - 10}
        fontSize="6"
        fontFamily="KaTeX_Typewriter, monospace"
        fill="#000"
        fillOpacity="0.45"
      >
        LVTHN 01
      </text>
      <text
        x={width - 10}
        y="14"
        textAnchor="end"
        fontSize="6"
        fontFamily="KaTeX_Typewriter, monospace"
        fill="#000"
        fillOpacity="0.45"
      >
        ONE UNIT
      </text>

      <line
        x1="28"
        y1="12"
        x2={width - 28}
        y2="12"
        stroke="#000"
        strokeOpacity="0.2"
        strokeWidth="0.75"
      />
      <line
        x1="28"
        y1={height - 12}
        x2={width - 28}
        y2={height - 12}
        stroke="#000"
        strokeOpacity="0.2"
        strokeWidth="0.75"
      />
    </g>
  )
}
