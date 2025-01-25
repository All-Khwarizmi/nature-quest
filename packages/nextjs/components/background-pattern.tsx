export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 z-0 w-full h-full">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,1000 C200,900 350,800 500,700 C650,600 800,500 1000,400 L1000,1000 L0,1000 Z"
          fill="currentColor"
          className="text-primary opacity-10"
        />
        <path
          d="M0,1000 C150,850 300,700 450,550 C600,400 750,250 1000,100 L1000,1000 L0,1000 Z"
          fill="currentColor"
          className="text-secondary opacity-5"
        />
      </svg>
    </div>
  );
}
