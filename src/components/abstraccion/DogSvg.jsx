export default function DogSvg() {
    return (
        <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Cabeza */}

            <path
                d="
          M55 80
          C55 48 78 28 105 28
          C137 28 158 52 158 82
          C158 116 137 137 105 137
          C75 137 55 115 55 80Z
        "
                fill="#F5C16C"
                stroke="#27272A"
                strokeWidth="5"
            />

            {/* Oreja izquierda */}

            <path
                d="
          M62 60
          C38 42 25 50 30 82
          C33 101 46 108 62 99
        "
                fill="#D99B4D"
                stroke="#27272A"
                strokeWidth="5"
            />

            {/* Oreja derecha */}

            <path
                d="
          M148 60
          C171 42 183 50 178 82
          C175 101 162 108 148 99
        "
                fill="#D99B4D"
                stroke="#27272A"
                strokeWidth="5"
            />

            {/* Ojos */}

            <circle
                cx="80"
                cy="78"
                r="6"
                fill="#27272A"
            />

            <circle
                cx="130"
                cy="78"
                r="6"
                fill="#27272A"
            />

            {/* Hocico */}

            <ellipse
                cx="105"
                cy="101"
                rx="24"
                ry="18"
                fill="#FFF1D6"
            />

            {/* Nariz */}

            <ellipse
                cx="105"
                cy="96"
                rx="9"
                ry="7"
                fill="#27272A"
            />

            {/* Boca */}

            <path
                d="
          M105 103
          C105 112 96 116 91 112
          M105 103
          C105 112 114 116 119 112
        "
                stroke="#27272A"
                strokeWidth="4"
                strokeLinecap="round"
            />

            {/* Cuerpo */}

            <path
                d="
          M72 134
          C54 145 45 166 48 184
          L162 184
          C165 166 155 145 138 134
        "
                fill="#F5C16C"
                stroke="#27272A"
                strokeWidth="5"
            />

            {/* Patas */}

            <path
                d="M72 159V185"
                stroke="#27272A"
                strokeWidth="7"
                strokeLinecap="round"
            />

            <path
                d="M138 159V185"
                stroke="#27272A"
                strokeWidth="7"
                strokeLinecap="round"
            />
        </svg>
    );
}