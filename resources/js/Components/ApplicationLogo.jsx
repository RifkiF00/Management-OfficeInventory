export default function ApplicationLogo({ className = '', ...props }) {
    // Clean fill-current to prevent overlapping fill colors on the stroke lines
    const cleanClassName = className.replace('fill-current', '');
    return (
        <svg
            {...props}
            className={cleanClassName}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Clipboard Outline */}
            <path
                d="M8 3h8c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Clipboard Clip */}
            <path
                d="M9 3h6v2H9V3z"
                fill="currentColor"
            />
            {/* Isometric Package inside Clipboard */}
            <path
                d="M12 7.5L9 9v3l3 1.5 3-1.5V9l-3-1.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 7.5v6M9 9l3 1.5 3-1.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Checklist lines */}
            <path
                d="M9 16.5h6M9 19h4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}
