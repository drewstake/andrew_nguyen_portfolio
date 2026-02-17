import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";

type Theme = "night" | "day";
type ChartMode = "candles" | "line";
type TradeSide = "long" | "short";

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type TradeMarker = {
  side: TradeSide;
  entryPrice: number;
  entryIndex: number;
};

type HoverState = {
  index: number;
  x: number;
  y: number;
  candle: Candle;
};

type SectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

type Project = {
  name: string;
  subtitle: string;
  problem: string;
  solution: string;
  results: string;
  tech: string[];
  highlights: string[];
  github: string;
  demo: string;
  visual: "topsignal" | "nextstep";
  logoSrc?: string;
  logoAlt?: string;
};

type ChartMeta = {
  left: number;
  top: number;
  plotWidth: number;
  plotHeight: number;
  min: number;
  max: number;
  xStep: number;
  start: number;
  candles: Candle[];
};

type ContactFormState = {
  name: string;
  email: string;
  message: string;
};

type ClosedTrade = {
  symbol: string;
  side: TradeSide;
  contracts: number;
  entry: number;
  entryTime: string;
  exit: number;
  exitTime: string;
  pointValue: number;
};

type LeetCodeProfile = {
  username: string;
  name: string;
  avatar: string;
  ranking: number;
  country: string | null;
};

type LeetCodeSolved = {
  solvedProblem: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
};

type LeetCodeCalendar = {
  streak: number;
  totalActiveDays: number;
  submissionCalendar: string;
};

const RESUME_PATH = "/Andrew_Nguyen_Resume.pdf";
const EMAIL = "drewstake3@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/drewstake/";
const GITHUB = "https://github.com/drewstake";
const LEETCODE_USERNAME = "drewstake";
const LEETCODE = `https://leetcode.com/u/${LEETCODE_USERNAME}/`;
const LEETCODE_API_BASE = `https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}`;

const PROJECTS: Project[] = [
  {
    name: "TopSignal",
    subtitle: "Trading analytics platform for futures traders",
    problem:
      "Futures traders often work across prop-style accounts and exports with no single source of truth for risk and execution quality.",
    solution:
      "TopSignal pulls account, order, and trade data from Topstep-style and ProjectX-style APIs, then computes journal metrics, PnL calendar views, and weekly reports in one dashboard.",
    results:
      "Faster weekly review cycles, clearer drawdown visibility, and consistent rule adherence tracking with MAE/MFE, average R, and win rate snapshots.",
    tech: ["Python", "TypeScript", "SQL", "FastAPI", "PostgreSQL", "WebSockets", "Tailwind"],
    highlights: [
      "Ingestion: normalized API pulls for account, order, and trade events.",
      "Streaming: optional real-time market updates via WebSockets or SignalR.",
      "Compute: PnL, drawdown, MAE/MFE, win rate, average R, and rule checks.",
      "Dashboards: trade journal, calendar, and weekly trader performance report.",
    ],
    github: GITHUB,
    demo: "https://example.com",
    visual: "topsignal",
  },
  {
    name: "NextStepAI",
    subtitle: "Full-stack app for matching and messaging",
    problem:
      "Users needed a structured way to create profiles, match by intent, and communicate while keeping moderation and access controls simple.",
    solution:
      "Built a full-stack platform with JWT auth, role-based access, messaging, profile management, and admin tools under a clean API contract.",
    results:
      "Reduced auth friction, improved moderation workflows, and a stable API surface with rate limiting and strong role boundaries.",
    tech: ["TypeScript", "React", "Node.js", "Express", "PostgreSQL", "JWT", "Redis"],
    highlights: [
      "Auth: JWT sessions with refresh logic and secure route guards.",
      "Access: role-based authorization for user, moderator, and admin actions.",
      "Safety: rate limiting and validation for API endpoints.",
      "Messaging: reliable, paginated conversations with predictable API behavior.",
    ],
    github: "https://github.com/drewstake/NextStep",
    demo: "https://nextstep4.com",
    visual: "nextstep",
    logoSrc: "/NextStep_Logo.png",
    logoAlt: "NextStep logo",
  },
];

const SKILL_GROUPS: Array<{ group: string; items: string[] }> = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "SQL", "C++"] },
  { group: "Frontend", items: ["React", "Tailwind CSS", "HTML5", "Responsive UI", "Accessibility"] },
  { group: "Backend", items: ["Node.js", "Express", "FastAPI", "REST APIs", "WebSockets"] },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "SQLite", "Redis"] },
  { group: "Tools", items: ["Git", "GitHub", "Docker", "Postman", "Linux"] },
  { group: "Cloud", items: ["Vercel", "Render", "AWS basics", "CI/CD"] },
  { group: "Testing", items: ["Jest", "React Testing Library", "API testing", "Integration tests"] },
];

const EXPERIENCES: Array<{ title: string; org: string; bullets: string[] }> = [
  {
    title: "Incoming Software Development Intern",
    org: "Dark Alpha Capital LLC | May 20, 2026 - August 9, 2026",
    bullets: [
      "Develop and improve internal tools for deal sourcing, data analysis, and workflow automation.",
      "Build and maintain scripts, APIs, and integrations to improve data access and team productivity.",
      "Support databases, dashboards, and documentation systems while troubleshooting software issues.",
      "Collaborate with cross-functional teams, contribute in code reviews and testing, and provide weekly sprint updates in a remote setting.",
      "Apply strong programming fundamentals, data structures, API/database knowledge, and Git best practices.",
    ],
  },
  {
    title: "Independent Futures Trader",
    org: "Self-employed",
    bullets: [
      "Trade futures with strict risk rules and a repeatable process.",
      "Track weekly performance using win rate, average R, drawdown, and rule adherence.",
      "Build tooling to improve journaling and reporting through TopSignal.",
    ],
  },
  {
    title: "AI Data Specialist",
    org: "Outlier AI",
    bullets: [
      "Review model outputs against quality rubrics and task requirements.",
      "Label and correct responses, then track revisions across iterations.",
      "Write concise feedback, test edge cases, and document failure patterns.",
    ],
  },
];

const DAILY_TRADE_LOG: ClosedTrade[] = [
  {
    symbol: "NQ",
    side: "long",
    contracts: 2,
    entry: 21062.4,
    entryTime: "09:36",
    exit: 21067.0,
    exitTime: "09:52",
    pointValue: 20,
  },
  {
    symbol: "ES",
    side: "short",
    contracts: 1,
    entry: 6031.0,
    entryTime: "10:12",
    exit: 6032.52,
    exitTime: "10:21",
    pointValue: 50,
  },
  {
    symbol: "MNQ",
    side: "long",
    contracts: 4,
    entry: 21028.25,
    entryTime: "11:04",
    exit: 21039.75,
    exitTime: "11:31",
    pointValue: 2,
  },
  {
    symbol: "MES",
    side: "short",
    contracts: 3,
    entry: 6029.7,
    entryTime: "13:18",
    exit: 6026.96,
    exitTime: "13:41",
    pointValue: 5,
  },
];

const NAV_ITEMS = [
  { href: "#education", label: "Education" },
  { href: "#experience", label: "Experience" },
  { href: "#resume", label: "Resume" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

function seededRng(seed: number): () => number {
  let state = seed % 2_147_483_647;
  if (state <= 0) {
    state += 2_147_483_646;
  }

  return () => {
    state = (state * 16_807) % 2_147_483_647;
    return (state - 1) / 2_147_483_646;
  };
}

function generateCandles(volatility: number, length = 320): Candle[] {
  const random = seededRng(1103 + volatility * 97);
  const candles: Candle[] = [];
  let previousClose = 5025;
  const startTime = Date.now() - length * 60_000;
  const volScale = 0.7 + volatility / 45;

  for (let index = 0; index < length; index += 1) {
    const drift = Math.sin(index / 13) * 0.8 + Math.cos(index / 29) * 0.55;
    const shock = (random() - 0.5) * 4.4 * volScale;
    const open = previousClose;
    const close = Math.max(3000, open + drift + shock);
    const high = Math.max(open, close) + Math.abs((random() - 0.35) * 2.8 * volScale);
    const low = Math.min(open, close) - Math.abs((random() - 0.4) * 2.4 * volScale);
    const volume = Math.floor(220 + random() * 780 + volatility * 5);

    candles.push({
      time: startTime + index * 60_000,
      open,
      high,
      low,
      close,
      volume,
    });

    previousClose = close;
  }

  return candles;
}

function movingAverage(candles: Candle[], period: number): Array<number | null> {
  const output: Array<number | null> = new Array(candles.length).fill(null);
  let runningSum = 0;

  for (let index = 0; index < candles.length; index += 1) {
    runningSum += candles[index].close;
    if (index >= period) {
      runningSum -= candles[index - period].close;
    }
    if (index >= period - 1) {
      output[index] = runningSum / period;
    }
  }

  return output;
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const pnlFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

function formatClockTime(value: string): string {
  const [hoursRaw, minutesRaw] = value.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return value;
  }

  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function toMinutes(clockTime: string): number {
  const [hoursRaw, minutesRaw] = clockTime.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 0;
  }
  return hours * 60 + minutes;
}

function getTradeDurationLabel(entryTime: string, exitTime: string): string {
  const durationMinutes = Math.max(0, toMinutes(exitTime) - toMinutes(entryTime));
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function getClosedTradePnl(trade: ClosedTrade): number {
  const points = trade.side === "long" ? trade.exit - trade.entry : trade.entry - trade.exit;
  return points * trade.pointValue * trade.contracts;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

function getWeeklySubmissionCount(calendarRaw: string): number {
  try {
    const submissionMap = JSON.parse(calendarRaw) as Record<string, number>;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);

    return Object.entries(submissionMap).reduce((total, [epochSeconds, submissions]) => {
      const date = new Date(Number(epochSeconds) * 1000);
      date.setHours(0, 0, 0, 0);
      if (date >= weekStart && date <= today) {
        return total + submissions;
      }
      return total;
    }, 0);
  } catch {
    return 0;
  }
}

function CountUp({
  target,
  duration = 1000,
  decimals = 0,
  suffix = "",
}: {
  target: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}): JSX.Element {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    let start: number | null = null;

    const animate = (timestamp: number): void => {
      if (start === null) {
        start = timestamp;
      }
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(target * progress);
      if (progress < 1) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [duration, target]);

  const rounded = decimals > 0 ? Number(value.toFixed(decimals)) : Math.round(value);
  const output = rounded.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span>
      {output}
      {suffix}
    </span>
  );
}

function RevealSection({ id, title, subtitle, children }: SectionProps): JSX.Element {
  return (
    <section
      id={id}
      data-reveal
      className="reveal-section mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-6">
        <p className="label-tag">Section</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-main sm:text-3xl">{title}</h2>
        {subtitle ? (
          <p className="mt-2 max-w-3xl text-base leading-7 text-muted sm:text-lg">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function TickerStrip(): JSX.Element {
  const entries = [
    { symbol: "ES", change: "+0.42%" },
    { symbol: "NQ", change: "+0.31%" },
    { symbol: "MNQ", change: "-0.18%" },
    { symbol: "MES", change: "+0.09%" },
    { symbol: "RTY", change: "-0.06%" },
    { symbol: "GC", change: "+0.22%" },
    { symbol: "CL", change: "-0.14%" },
  ];
  const repeated = [...entries, ...entries];

  return (
    <section
      data-reveal
      className="reveal-section mx-auto mt-8 w-full max-w-6xl px-4 sm:px-6 lg:px-8"
      aria-label="Decorative ticker strip"
    >
      <div className="ticker-wrap terminal-card">
        <div className="flex items-center justify-between border-b border-soft px-4 py-2">
          <span className="label-tag">Decorative</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
            Ticker Feed
          </span>
        </div>
        <div className="ticker-window">
          <div className="ticker-track">
            {repeated.map((entry, index) => {
              const positive = entry.change.startsWith("+");
              return (
                <div
                  key={`${entry.symbol}-${index}`}
                  className="flex items-center gap-2 rounded-full border border-soft px-3 py-1"
                >
                  <span className="font-mono text-xs text-main">{entry.symbol}</span>
                  <span className={`font-mono text-xs ${positive ? "text-positive" : "text-negative"}`}>
                    {entry.change}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectVisual({
  variant,
  logoSrc,
  logoAlt,
}: {
  variant: Project["visual"];
  logoSrc?: string;
  logoAlt?: string;
}): JSX.Element {
  if (variant === "topsignal") {
    const bars = [24, 38, 27, 42, 30, 49, 34, 44, 37, 40];
    return (
      <div className="overflow-hidden rounded-xl border border-soft bg-[rgba(10,16,28,0.35)] p-3">
        <svg viewBox="0 0 320 120" className="h-28 w-full" role="img" aria-label="Decorative chart visual">
          <defs>
            <linearGradient id="spark-a" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 88 C30 76, 56 74, 84 72 C112 70, 140 66, 168 58 C198 50, 230 54, 260 48 C282 44, 300 40, 320 36"
            stroke="var(--accent-cyan)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 88 C30 76, 56 74, 84 72 C112 70, 140 66, 168 58 C198 50, 230 54, 260 48 C282 44, 300 40, 320 36 L320 120 L0 120 Z"
            fill="url(#spark-a)"
          />
          {bars.map((height, index) => {
            const x = 16 + index * 30;
            const y = 110 - height;
            return (
              <rect
                key={`${height}-${index}`}
                x={x}
                y={y}
                width="10"
                height={height}
                rx="2"
                fill={index % 2 === 0 ? "var(--positive)" : "var(--accent-violet)"}
                opacity="0.8"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  if (logoSrc) {
    return (
      <div className="mx-auto w-full max-w-[551px] overflow-hidden rounded-xl border border-soft bg-[rgba(10,16,28,0.35)]">
        <div className="aspect-[551/221] w-full">
          <img
            src={logoSrc}
            alt={logoAlt ?? "Project logo"}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-soft bg-[rgba(10,16,28,0.35)] p-3">
      <svg viewBox="0 0 320 120" className="h-28 w-full" role="img" aria-label="Decorative network visual">
        <defs>
          <linearGradient id="spark-b" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-violet)" />
            <stop offset="100%" stopColor="var(--accent-cyan)" />
          </linearGradient>
        </defs>
        <path
          d="M0 72 C32 58, 62 92, 92 82 C122 72, 150 40, 178 52 C206 64, 238 94, 268 74 C286 62, 304 56, 320 46"
          stroke="url(#spark-b)"
          strokeWidth="2.5"
          fill="none"
        />
        {[
          { x: 34, y: 64 },
          { x: 82, y: 86 },
          { x: 132, y: 56 },
          { x: 182, y: 48 },
          { x: 228, y: 76 },
          { x: 280, y: 62 },
        ].map((node, index) => (
          <circle
            key={`${node.x}-${node.y}-${index}`}
            cx={node.x}
            cy={node.y}
            r="4.5"
            fill={index % 2 === 0 ? "var(--accent-cyan)" : "var(--accent-violet)"}
          />
        ))}
        <rect x="12" y="94" width="52" height="14" rx="3" fill="var(--accent-cyan)" opacity="0.22" />
        <rect x="72" y="94" width="68" height="14" rx="3" fill="var(--positive)" opacity="0.22" />
        <rect x="148" y="94" width="44" height="14" rx="3" fill="var(--accent-violet)" opacity="0.24" />
        <rect x="196" y="94" width="56" height="14" rx="3" fill="var(--accent-cyan)" opacity="0.2" />
        <rect x="258" y="94" width="48" height="14" rx="3" fill="var(--positive)" opacity="0.2" />
      </svg>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }): JSX.Element {
  return (
    <article className="terminal-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="label-tag">{project.subtitle}</p>
          <h3 className="mt-2 text-xl font-semibold text-main sm:text-2xl">{project.name}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary px-3 py-2 text-xs"
            aria-label={`${project.name} GitHub repository`}
          >
            GitHub
          </a>
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary px-3 py-2 text-xs"
            aria-label={`${project.name} live demo`}
          >
            Live Demo
          </a>
        </div>
      </div>

      <div className="mt-5">
        <ProjectVisual variant={project.visual} logoSrc={project.logoSrc} logoAlt={project.logoAlt} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Problem</p>
          <p className="mt-2 text-sm leading-6 text-main">{project.problem}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Solution</p>
          <p className="mt-2 text-sm leading-6 text-main">{project.solution}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Results</p>
          <p className="mt-2 text-sm leading-6 text-main">{project.results}</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Tech stack</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {project.tech.map((tool) => (
            <span key={tool} className="chip">
              {tool}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">System highlights</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {project.highlights.map((highlight) => (
            <li
              key={highlight}
              className="rounded-lg border border-soft bg-[rgba(10,16,28,0.35)] px-3 py-2 text-sm text-main"
            >
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function TradingPlayground({ theme }: { theme: Theme }): JSX.Element {
  const [mode, setMode] = useState<ChartMode>("candles");
  const [timeframe, setTimeframe] = useState(96);
  const [volatility, setVolatility] = useState(35);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showMovingAverage, setShowMovingAverage] = useState(true);
  const [cursor, setCursor] = useState(140);
  const [trade, setTrade] = useState<TradeMarker | null>(null);
  const [hover, setHover] = useState<HoverState | null>(null);

  const chartWrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartMetaRef = useRef<ChartMeta | null>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isChartVisible, setIsChartVisible] = useState(true);

  const series = useMemo(() => generateCandles(volatility), [volatility]);

  useEffect(() => {
    const wrapper = chartWrapperRef.current;
    if (!wrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsChartVisible(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setCursor((previous) => clamp(previous, timeframe - 1, series.length - 1));
  }, [series.length, timeframe]);

  useEffect(() => {
    setTrade(null);
    setHover(null);
  }, [series]);

  useEffect(() => {
    if (!isPlaying || !isChartVisible) {
      return;
    }
    const timer = window.setInterval(() => {
      setCursor((previous) => (previous >= series.length - 1 ? timeframe - 1 : previous + 1));
    }, 160);
    return () => window.clearInterval(timer);
  }, [isChartVisible, isPlaying, series.length, timeframe]);

  useEffect(() => {
    const wrapper = chartWrapperRef.current;
    if (!wrapper) {
      return;
    }

    const updateSize = (): void => {
      const nextWidth = wrapper.clientWidth;
      const nextHeight = wrapper.clientHeight;
      setCanvasSize((previous) =>
        previous.width === nextWidth && previous.height === nextHeight
          ? previous
          : {
              width: nextWidth,
              height: nextHeight,
            },
      );
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(wrapper);

    return () => observer.disconnect();
  }, []);

  const start = Math.max(0, cursor - timeframe + 1);
  const view = series.slice(start, cursor + 1);
  const currentCandle = series[cursor] ?? series[series.length - 1];
  const currentPrice = currentCandle.close;

  const orderBook = useMemo(() => {
    const random = seededRng(Math.floor(currentPrice * 10) + volatility * 101);
    const asks = Array.from({ length: 6 }, (_, index) => {
      const level = index + 1;
      const size = Math.floor(90 + random() * 220 + volatility * 2.4);
      return {
        price: currentPrice + level * 0.25,
        size,
      };
    });
    const bids = Array.from({ length: 6 }, (_, index) => {
      const level = index + 1;
      const size = Math.floor(90 + random() * 220 + volatility * 2.4);
      return {
        price: currentPrice - level * 0.25,
        size,
      };
    });
    const maxSize = Math.max(...asks.map((ask) => ask.size), ...bids.map((bid) => bid.size));
    return { asks, bids, maxSize };
  }, [currentPrice, volatility]);

  const unrealizedPnl =
    trade !== null
      ? (currentPrice - trade.entryPrice) * (trade.side === "long" ? 1 : -1) * 50
      : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isChartVisible || canvasSize.width === 0 || canvasSize.height === 0 || view.length < 2) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(canvasSize.width * dpr);
    canvas.height = Math.floor(canvasSize.height * dpr);
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);

    const palette =
      theme === "night"
        ? {
            bgA: "rgba(8, 13, 24, 0.82)",
            bgB: "rgba(6, 11, 21, 0.45)",
            grid: "rgba(131, 156, 189, 0.2)",
            axis: "rgba(166, 188, 217, 0.78)",
            line: "#55d7ff",
            up: "#39f4a0",
            down: "#ff7396",
            ma: "#8f7bff",
            current: "rgba(76, 219, 255, 0.95)",
            priceLabel: "rgba(20, 33, 58, 0.95)",
            priceLabelText: "#dce9ff",
            crosshair: "rgba(139, 179, 224, 0.45)",
            crosshairPoint: "#9ee8ff",
          }
        : {
            bgA: "rgba(245, 249, 255, 0.9)",
            bgB: "rgba(235, 244, 255, 0.62)",
            grid: "rgba(87, 117, 154, 0.24)",
            axis: "rgba(43, 63, 92, 0.8)",
            line: "#0782c2",
            up: "#059a56",
            down: "#c53f5d",
            ma: "#7058ff",
            current: "rgba(10, 130, 196, 0.96)",
            priceLabel: "rgba(220, 235, 252, 0.96)",
            priceLabelText: "#0f1b2f",
            crosshair: "rgba(80, 111, 147, 0.5)",
            crosshairPoint: "#0474ad",
          };

    const left = 58;
    const right = 26;
    const top = 22;
    const bottom = 38;

    const plotWidth = Math.max(24, canvasSize.width - left - right);
    const plotHeight = Math.max(24, canvasSize.height - top - bottom);
    const visibleHigh = Math.max(...view.map((item) => item.high));
    const visibleLow = Math.min(...view.map((item) => item.low));
    const range = Math.max(1, visibleHigh - visibleLow);
    const min = visibleLow - range * 0.08;
    const max = visibleHigh + range * 0.08;
    const xStep = plotWidth / Math.max(1, view.length - 1);

    const xFor = (index: number): number => left + index * xStep;
    const yFor = (price: number): number => top + ((max - price) / (max - min)) * plotHeight;

    const bgGradient = context.createLinearGradient(0, top, 0, top + plotHeight);
    bgGradient.addColorStop(0, palette.bgA);
    bgGradient.addColorStop(1, palette.bgB);
    context.fillStyle = bgGradient;
    context.fillRect(left, top, plotWidth, plotHeight);

    context.strokeStyle = palette.grid;
    context.lineWidth = 1;
    for (let index = 0; index <= 6; index += 1) {
      const y = top + (plotHeight / 6) * index;
      context.beginPath();
      context.moveTo(left, y);
      context.lineTo(left + plotWidth, y);
      context.stroke();
    }
    for (let index = 0; index <= 8; index += 1) {
      const x = left + (plotWidth / 8) * index;
      context.beginPath();
      context.moveTo(x, top);
      context.lineTo(x, top + plotHeight);
      context.stroke();
    }

    context.font = "11px 'IBM Plex Mono', monospace";
    context.fillStyle = palette.axis;
    for (let index = 0; index <= 4; index += 1) {
      const price = max - ((max - min) / 4) * index;
      const y = top + (plotHeight / 4) * index;
      context.fillText(formatPrice(price), 6, y + 4);
    }

    if (mode === "line") {
      context.beginPath();
      view.forEach((candle, index) => {
        const x = xFor(index);
        const y = yFor(candle.close);
        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      });
      context.lineWidth = 2;
      context.strokeStyle = palette.line;
      context.stroke();

      const area = context.createLinearGradient(0, top, 0, top + plotHeight);
      area.addColorStop(0, "rgba(77, 219, 255, 0.25)");
      area.addColorStop(1, "rgba(77, 219, 255, 0)");
      context.lineTo(xFor(view.length - 1), top + plotHeight);
      context.lineTo(xFor(0), top + plotHeight);
      context.closePath();
      context.fillStyle = area;
      context.fill();
    } else {
      const candleWidth = Math.max(3, Math.min(14, xStep * 0.68));
      view.forEach((candle, index) => {
        const x = xFor(index);
        const openY = yFor(candle.open);
        const closeY = yFor(candle.close);
        const highY = yFor(candle.high);
        const lowY = yFor(candle.low);
        const isUp = candle.close >= candle.open;
        const color = isUp ? palette.up : palette.down;

        context.strokeStyle = color;
        context.lineWidth = 1.2;
        context.beginPath();
        context.moveTo(x, highY);
        context.lineTo(x, lowY);
        context.stroke();

        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(1, Math.abs(closeY - openY));
        context.fillStyle = color;
        context.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      });
    }

    if (showMovingAverage) {
      const maValues = movingAverage(view, 12);
      context.strokeStyle = palette.ma;
      context.lineWidth = 1.4;
      context.beginPath();
      let started = false;
      maValues.forEach((value, index) => {
        if (value === null) {
          return;
        }
        const x = xFor(index);
        const y = yFor(value);
        if (!started) {
          context.moveTo(x, y);
          started = true;
        } else {
          context.lineTo(x, y);
        }
      });
      context.stroke();
    }

    const latest = view[view.length - 1];
    const currentY = yFor(latest.close);
    context.setLineDash([4, 5]);
    context.strokeStyle = palette.current;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(left, currentY);
    context.lineTo(left + plotWidth, currentY);
    context.stroke();
    context.setLineDash([]);

    const labelText = formatPrice(latest.close);
    const labelWidth = context.measureText(labelText).width + 12;
    context.fillStyle = palette.priceLabel;
    context.fillRect(canvasSize.width - labelWidth - 8, currentY - 9, labelWidth, 18);
    context.fillStyle = palette.priceLabelText;
    context.fillText(labelText, canvasSize.width - labelWidth - 2, currentY + 4);

    if (trade && trade.entryIndex >= start && trade.entryIndex <= cursor) {
      const offset = trade.entryIndex - start;
      const markerX = xFor(offset);
      const markerY = yFor(trade.entryPrice);
      context.fillStyle = trade.side === "long" ? palette.up : palette.down;
      context.beginPath();
      if (trade.side === "long") {
        context.moveTo(markerX, markerY - 8);
        context.lineTo(markerX - 7, markerY + 6);
        context.lineTo(markerX + 7, markerY + 6);
      } else {
        context.moveTo(markerX, markerY + 8);
        context.lineTo(markerX - 7, markerY - 6);
        context.lineTo(markerX + 7, markerY - 6);
      }
      context.closePath();
      context.fill();

      context.font = "10px 'IBM Plex Mono', monospace";
      context.fillText(trade.side.toUpperCase(), markerX + 10, markerY - 10);
    }

    if (hover && hover.index >= start && hover.index <= cursor) {
      const offset = hover.index - start;
      const candle = view[offset];
      if (candle) {
        const x = xFor(offset);
        const y = yFor(candle.close);
        context.strokeStyle = palette.crosshair;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x, top);
        context.lineTo(x, top + plotHeight);
        context.stroke();
        context.beginPath();
        context.moveTo(left, y);
        context.lineTo(left + plotWidth, y);
        context.stroke();
        context.fillStyle = palette.crosshairPoint;
        context.beginPath();
        context.arc(x, y, 3.5, 0, Math.PI * 2);
        context.fill();
      }
    }

    chartMetaRef.current = {
      left,
      top,
      plotWidth,
      plotHeight,
      min,
      max,
      xStep,
      start,
      candles: view,
    };
  }, [
    canvasSize.height,
    canvasSize.width,
    cursor,
    hover,
    isChartVisible,
    mode,
    showMovingAverage,
    start,
    theme,
    trade,
    view,
  ]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    const chartMeta = chartMetaRef.current;
    if (!chartMeta) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;
    const relativeY = event.clientY - bounds.top;

    const isInside =
      relativeX >= chartMeta.left &&
      relativeX <= chartMeta.left + chartMeta.plotWidth &&
      relativeY >= chartMeta.top &&
      relativeY <= chartMeta.top + chartMeta.plotHeight;

    if (!isInside) {
      setHover(null);
      return;
    }

    const nearestIndex = clamp(
      Math.round((relativeX - chartMeta.left) / chartMeta.xStep),
      0,
      chartMeta.candles.length - 1,
    );

    const candle = chartMeta.candles[nearestIndex];
    setHover({
      index: chartMeta.start + nearestIndex,
      x: chartMeta.left + nearestIndex * chartMeta.xStep,
      y: relativeY,
      candle,
    });
  };

  const placeTrade = (side: TradeSide): void => {
    const entry = series[cursor];
    if (!entry) {
      return;
    }
    setTrade({
      side,
      entryPrice: entry.close,
      entryIndex: cursor,
    });
  };

  const tooltipLeft =
    hover !== null ? clamp(hover.x + 14, 8, Math.max(8, canvasSize.width - 180)) : 0;
  const tooltipTop =
    hover !== null ? clamp(hover.y - 68, 8, Math.max(8, canvasSize.height - 110)) : 0;

  return (
    <RevealSection
      id="playground"
      title="Trading Playground"
      subtitle="Simulated chart with timeline controls, volatility, and trade markers. Built with Canvas for speed."
    >
      <div className="grid gap-6 xl:grid-cols-[2.15fr,1fr]">
        <article className="terminal-card p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="label-tag">Simulated chart</p>
              <p className="mt-2 text-sm text-muted">Canvas render with terminal-style grid and glow.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`control-chip ${mode === "candles" ? "control-chip-active" : ""}`}
                onClick={() => setMode("candles")}
                aria-pressed={mode === "candles"}
              >
                Candles
              </button>
              <button
                type="button"
                className={`control-chip ${mode === "line" ? "control-chip-active" : ""}`}
                onClick={() => setMode("line")}
                aria-pressed={mode === "line"}
              >
                Line
              </button>
              <button
                type="button"
                className="control-chip"
                onClick={() => setIsPlaying((current) => !current)}
                aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Timeframe (zoom): {timeframe}
              </span>
              <input
                aria-label="Timeframe slider"
                type="range"
                min={30}
                max={180}
                step={6}
                value={timeframe}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setTimeframe(next);
                  setCursor((current) => Math.max(current, next - 1));
                }}
                className="w-full"
              />
            </label>

            <label className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Volatility: {volatility}
              </span>
              <input
                aria-label="Volatility slider"
                type="range"
                min={10}
                max={80}
                step={1}
                value={volatility}
                onChange={(event) => setVolatility(Number(event.target.value))}
                className="w-full"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Scrub timeline: {cursor + 1} / {series.length}
              </span>
              <input
                aria-label="Timeline scrubber"
                type="range"
                min={timeframe - 1}
                max={series.length - 1}
                step={1}
                value={cursor}
                onChange={(event) => {
                  setCursor(Number(event.target.value));
                  setIsPlaying(false);
                }}
                className="w-full"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn-secondary px-3 py-2 text-xs"
              onClick={() => setShowMovingAverage((current) => !current)}
              aria-pressed={showMovingAverage}
            >
              {showMovingAverage ? "Hide MA" : "Show MA"}
            </button>
            <button
              type="button"
              className="btn-secondary px-3 py-2 text-xs"
              onClick={() => placeTrade("long")}
              aria-label="Place long trade marker"
            >
              Place long
            </button>
            <button
              type="button"
              className="btn-secondary px-3 py-2 text-xs"
              onClick={() => placeTrade("short")}
              aria-label="Place short trade marker"
            >
              Place short
            </button>
            <p className="ml-auto font-mono text-xs text-muted">
              {trade
                ? `PnL: ${pnlFormatter.format(unrealizedPnl ?? 0)}`
                : "No active marker. Place long or short."}
            </p>
          </div>

          <div ref={chartWrapperRef} className="relative mt-4 h-[300px] sm:h-[360px] lg:h-[430px]">
            <canvas
              ref={canvasRef}
              className="h-full w-full rounded-lg border border-soft bg-transparent"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHover(null)}
              aria-label="Simulated futures chart"
            />

            {hover ? (
              <div
                className="pointer-events-none absolute z-20 w-44 rounded-lg border border-soft bg-[rgba(8,14,25,0.95)] p-2 text-xs text-main shadow-terminal"
                style={{ left: `${tooltipLeft}px`, top: `${tooltipTop}px` }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  Index {hover.index + 1}
                </p>
                <p className="mt-1 font-mono">O: {formatPrice(hover.candle.open)}</p>
                <p className="font-mono">H: {formatPrice(hover.candle.high)}</p>
                <p className="font-mono">L: {formatPrice(hover.candle.low)}</p>
                <p className="font-mono">C: {formatPrice(hover.candle.close)}</p>
              </div>
            ) : null}
          </div>
        </article>

        <aside className="space-y-4">
          <div className="terminal-card p-4">
            <p className="label-tag">Simulation stats</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="metric-tile">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Last price</p>
                <p className="mt-2 text-lg font-semibold text-main">{formatPrice(currentPrice)}</p>
              </div>
              <div className="metric-tile">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Mode</p>
                <p className="mt-2 text-lg font-semibold text-main">
                  {mode === "candles" ? "Candlesticks" : "Line"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted">
              Marker logic is illustrative. PnL is simulated and based on simple price delta.
            </p>
          </div>

          <div className="terminal-card p-4">
            <p className="label-tag">Mini order book (fake)</p>
            <p className="mt-2 text-xs text-muted">Decorative depth bars around current simulated price.</p>

            <div className="mt-3 space-y-2">
              {orderBook.asks
                .slice()
                .reverse()
                .map((ask, index) => (
                  <div key={`ask-${index}`} className="relative overflow-hidden rounded-md border border-soft px-2 py-1">
                    <div
                      className="absolute inset-y-0 right-0 bg-[rgba(255,111,143,0.2)]"
                      style={{ width: `${Math.max(8, (ask.size / orderBook.maxSize) * 100)}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between font-mono text-[11px]">
                      <span className="text-negative">ASK {formatPrice(ask.price)}</span>
                      <span className="text-main">{ask.size}</span>
                    </div>
                  </div>
                ))}

              <div className="border-t border-soft py-1 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Mid {formatPrice(currentPrice)}
              </div>

              {orderBook.bids.map((bid, index) => (
                <div key={`bid-${index}`} className="relative overflow-hidden rounded-md border border-soft px-2 py-1">
                  <div
                    className="absolute inset-y-0 left-0 bg-[rgba(65,241,153,0.2)]"
                    style={{ width: `${Math.max(8, (bid.size / orderBook.maxSize) * 100)}%` }}
                  />
                  <div className="relative z-10 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-positive">BID {formatPrice(bid.price)}</span>
                    <span className="text-main">{bid.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </RevealSection>
  );
}

function App(): JSX.Element {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "night";
    }
    const savedTheme = window.localStorage.getItem("theme");
    return savedTheme === "day" ? "day" : "night";
  });

  const [form, setForm] = useState<ContactFormState>({ name: "", email: "", message: "" });
  const [formErrors, setFormErrors] = useState<Partial<ContactFormState>>({});
  const [submitStatus, setSubmitStatus] = useState("");
  const [leetcodeProfile, setLeetcodeProfile] = useState<LeetCodeProfile | null>(null);
  const [leetcodeSolved, setLeetcodeSolved] = useState<LeetCodeSolved | null>(null);
  const [leetcodeCalendar, setLeetcodeCalendar] = useState<LeetCodeCalendar | null>(null);
  const [leetcodeError, setLeetcodeError] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadLeetCode = async (): Promise<void> => {
      try {
        setLeetcodeError("");
        const [profile, solved, calendar] = await Promise.all([
          fetchJson<LeetCodeProfile>(LEETCODE_API_BASE),
          fetchJson<LeetCodeSolved>(`${LEETCODE_API_BASE}/solved`),
          fetchJson<LeetCodeCalendar>(`${LEETCODE_API_BASE}/calendar`),
        ]);

        if (!mounted) {
          return;
        }

        setLeetcodeProfile(profile);
        setLeetcodeSolved(solved);
        setLeetcodeCalendar(calendar);
      } catch {
        if (mounted) {
          setLeetcodeError("Unable to load live LeetCode stats right now.");
        }
      }
    };

    loadLeetCode();
    return () => {
      mounted = false;
    };
  }, []);

  const lastUpdated = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [],
  );

  const closedTradeRows = useMemo(
    () =>
      DAILY_TRADE_LOG.map((trade) => ({
        ...trade,
        duration: getTradeDurationLabel(trade.entryTime, trade.exitTime),
        pnl: getClosedTradePnl(trade),
      })),
    [],
  );

  const dailyClosedPnl = useMemo(
    () => closedTradeRows.reduce((total, trade) => total + trade.pnl, 0),
    [closedTradeRows],
  );

  const leetcodeWeeklySubmissions = useMemo(
    () => (leetcodeCalendar ? getWeeklySubmissionCount(leetcodeCalendar.submissionCalendar) : null),
    [leetcodeCalendar],
  );

  const updateField = (field: keyof ContactFormState, value: string): void => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitStatus("");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const errors: Partial<ContactFormState> = {};
    if (!form.name.trim()) {
      errors.name = "Name is required.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email.";
    }
    if (form.message.trim().length < 20) {
      errors.message = "Message should be at least 20 characters.";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setSubmitStatus("Please fix the highlighted fields.");
      return;
    }

    setSubmitStatus("Message validated. Connect this form to your backend or email service.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="grid-overlay" aria-hidden="true" />
      <div className="glow-orb one" aria-hidden="true" />
      <div className="glow-orb two" aria-hidden="true" />

      <header className="sticky top-0 z-40 border-b border-soft bg-[rgba(7,12,22,0.9)]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="font-semibold tracking-tight text-main">
            Andrew Nguyen
          </a>

          <nav className="hidden items-center gap-4 md:flex" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-main"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="btn-secondary px-3 py-2 text-xs"
            onClick={() => setTheme((current) => (current === "night" ? "day" : "night"))}
            aria-label={theme === "night" ? "Switch to day theme" : "Switch to night theme"}
          >
            {theme === "night" ? "Night" : "Day"}
          </button>
        </div>
      </header>

      <main id="main-content" className="relative z-10 pb-16">
        <section
          id="top"
          data-reveal
          className="reveal-section mx-auto w-full max-w-6xl px-4 pb-6 pt-14 sm:px-6 sm:pt-20 lg:px-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr] lg:items-center">
            <div>
              <p className="label-tag">Portfolio</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-main sm:text-5xl">
                Aspiring quant developer and software engineer building reliable, data-driven systems.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-main sm:text-lg">
                Penn State computer science graduate pursuing quant/trading technology and software development roles.
                Incoming Software Development Intern at Dark Alpha Capital LLC (May 20, 2026 to August 9, 2026),
                focused on practical software for data analysis, automation, and team productivity.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#education" className="btn-primary px-4 py-2 text-sm">
                  View Education
                </a>
                <a href="#experience" className="btn-secondary px-4 py-2 text-sm">
                  View Experience
                </a>
                <a href="#projects" className="btn-primary px-4 py-2 text-sm">
                  View Projects
                </a>
                <a
                  href={RESUME_PATH}
                  download
                  className="btn-secondary px-4 py-2 text-sm"
                  aria-label="Download Andrew Nguyen resume"
                >
                  Download Resume
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="metric-tile">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Education</p>
                  <p className="mt-2 text-sm font-medium text-main">Penn State CS graduate</p>
                </div>
                <div className="metric-tile">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Incoming role</p>
                  <p className="mt-2 text-sm font-medium text-main">Dark Alpha Capital LLC</p>
                </div>
                <div className="metric-tile">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Projects</p>
                  <p className="mt-2 text-sm font-medium text-main">TopSignal + NextStepAI</p>
                </div>
                <div className="metric-tile">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Upcoming</p>
                  <p className="mt-2 text-sm font-medium text-main">HackPSU, March 28, 2026</p>
                </div>
              </div>
            </div>

            <aside className="terminal-card p-5">
              <div className="flex items-center gap-4">
                <img
                  src="/professional_headshot.jpg"
                  alt="Andrew Nguyen headshot"
                  className="h-16 w-16 rounded-full border border-soft object-cover"
                />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                    Recruiter snapshot
                  </p>
                  <p className="mt-1 text-base font-semibold text-main">Built for software roles with strong team fit.</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="metric-tile">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Experience</p>
                  <p className="mt-1 text-lg font-semibold text-main">
                    <CountUp target={3} />
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Projects</p>
                  <p className="mt-1 text-lg font-semibold text-main">
                    <CountUp target={2} />
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Hackathons</p>
                  <p className="mt-1 text-lg font-semibold text-main">
                    <CountUp target={1} />
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-soft bg-[rgba(9,15,25,0.32)] p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Upcoming dates</p>
                <ul className="mt-2 space-y-2 text-sm text-main">
                  <li className="rounded-lg border border-soft px-3 py-2">
                    Dark Alpha Capital internship: May 20, 2026 to August 9, 2026
                  </li>
                  <li className="rounded-lg border border-soft px-3 py-2">
                    HackPSU: March 28, 2026 at ECoRE Building, Penn State
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <RevealSection
          id="education"
          title="Education"
          subtitle="Academic foundation in computer science, with active participation in practical build events."
        >
          <div className="grid gap-6 lg:grid-cols-[1.35fr,1fr]">
            <article className="terminal-card p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-main">B.S. in Computer Science</h3>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  Penn State University
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-main sm:text-base">
                Recent graduate with emphasis on software engineering fundamentals, data structures, and full-stack
                system design for real operational use cases.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="metric-tile">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Core focus</p>
                  <p className="mt-2 text-sm font-medium text-main">Data structures and algorithms</p>
                </div>
              </div>
            </article>

            <aside className="terminal-card p-5 sm:p-6">
              <p className="label-tag">Upcoming event</p>
              <h3 className="mt-3 text-lg font-semibold text-main">HackPSU 2026</h3>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">March 28, 2026</p>
              <p className="mt-1 text-sm text-main">ECoRE Building, Penn State</p>
              <p className="mt-3 text-sm leading-6 text-main">
                Participating in a fast-paced build environment to ship a working solution with a collaborative team.
              </p>
            </aside>
          </div>
        </RevealSection>

        <RevealSection
          id="experience"
          title="Experience"
          subtitle="Roles focused on software delivery, automation, and measurable impact."
        >
          <div className="grid gap-4">
            {EXPERIENCES.map((experience) => (
              <article key={experience.title} className="terminal-card p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-main">{experience.title}</h3>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{experience.org}</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-main">
                  {experience.bullets.map((bullet) => (
                    <li key={bullet} className="rounded-lg border border-soft px-3 py-2">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </RevealSection>

        <RevealSection
          id="resume"
          title="Resume"
          subtitle="Quick access to an inline preview with download and new-tab options."
        >
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <a
              href={RESUME_PATH}
              download
              className="btn-primary inline-flex px-4 py-2 text-sm"
              aria-label="Download resume PDF"
            >
              Download Resume
            </a>
            <a
              href={RESUME_PATH}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary inline-flex px-4 py-2 text-sm"
              aria-label="Open resume PDF in a new tab"
            >
              Open in new tab
            </a>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.9fr,1fr]">
            <article className="terminal-card overflow-hidden p-2 sm:p-3">
              <object
                data={`${RESUME_PATH}#view=FitH`}
                type="application/pdf"
                title="Andrew Nguyen resume PDF viewer"
                aria-label="Embedded Andrew Nguyen resume"
                className="h-[56vh] min-h-[320px] w-full rounded-lg bg-[rgba(8,14,26,0.2)] sm:h-[62vh] sm:min-h-[430px] lg:h-[72vh]"
              >
                <div className="p-4 text-sm text-main">
                  <p>If the preview does not load, use Download or Open in new tab.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href={RESUME_PATH} download className="btn-primary inline-flex px-3 py-1.5 text-xs">
                      Download Resume
                    </a>
                    <a
                      href={RESUME_PATH}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary inline-flex px-3 py-1.5 text-xs"
                    >
                      Open in new tab
                    </a>
                  </div>
                </div>
              </object>
            </article>

            <aside className="terminal-card p-5 sm:p-6">
              <p className="label-tag">Quick highlights</p>
              <ul className="mt-3 space-y-2 text-sm text-main">
                <li className="rounded-lg border border-soft px-3 py-2">Penn State computer science graduate</li>
                <li className="rounded-lg border border-soft px-3 py-2">Independent futures trader</li>
                <li className="rounded-lg border border-soft px-3 py-2">Built TopSignal analytics platform</li>
                <li className="rounded-lg border border-soft px-3 py-2">Full-stack development across React + APIs</li>
                <li className="rounded-lg border border-soft px-3 py-2">Risk-first and testing-oriented workflow</li>
              </ul>
            </aside>
          </div>
        </RevealSection>

        <RevealSection
          id="projects"
          title="Featured Projects"
          subtitle="Two flagship builds with clear product and engineering outcomes."
        >
          <div className="space-y-6">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </RevealSection>

        <RevealSection id="skills" title="Skills" subtitle="Grouped by the stack areas I use most often.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKILL_GROUPS.map((group) => (
              <article key={group.group} className="terminal-card p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">{group.group}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </RevealSection>

        <RevealSection
          id="about"
          title="About"
          subtitle="Computer science graduate focused on building reliable software with strong engineering fundamentals."
        >
          <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
            <article className="terminal-card p-5 sm:p-6">
              <p className="text-sm leading-7 text-main sm:text-base">
                I focus on turning operational needs into practical software: scripts, APIs, dashboards, and clean
                workflows. My approach combines consistent DSA practice, disciplined coding standards, and clear
                communication so teams can ship quickly and reliably.
              </p>
            </article>
            <aside className="terminal-card p-5 sm:p-6">
              <p className="label-tag">What I bring</p>
              <ul className="mt-3 space-y-2 text-sm text-main">
                <li className="rounded-lg border border-soft px-3 py-2">Programming fundamentals and data structures</li>
                <li className="rounded-lg border border-soft px-3 py-2">API and integration development</li>
                <li className="rounded-lg border border-soft px-3 py-2">SQL and NoSQL database work</li>
                <li className="rounded-lg border border-soft px-3 py-2">Git workflow, testing, and code review habits</li>
                <li className="rounded-lg border border-soft px-3 py-2">Cross-functional communication and ownership</li>
              </ul>
            </aside>
          </div>
        </RevealSection>

        <RevealSection
          id="learning"
          title="LeetCode"
          subtitle="Live profile and activity from my LeetCode account."
        >
          <div className="grid gap-6 lg:grid-cols-[1.25fr,1fr]">
            <article className="terminal-card p-5 sm:p-6">
              <p className="label-tag">Live profile</p>
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={leetcodeProfile?.avatar ?? "https://assets.leetcode.com/users/default_avatar.jpg"}
                  alt="LeetCode avatar for drewstake"
                  className="h-16 w-16 rounded-full border border-soft object-cover"
                />
                <div>
                  <p className="text-lg font-semibold text-main">
                    {leetcodeProfile?.name || leetcodeProfile?.username || LEETCODE_USERNAME}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">@{LEETCODE_USERNAME}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="metric-tile">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Global rank</p>
                  <p className="mt-1 text-sm font-semibold text-main">
                    {leetcodeProfile ? leetcodeProfile.ranking.toLocaleString("en-US") : "--"}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Country</p>
                  <p className="mt-1 text-sm font-semibold text-main">{leetcodeProfile?.country || "United States"}</p>
                </div>
                <div className="metric-tile sm:col-span-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Total active days</p>
                  <p className="mt-1 text-sm font-semibold text-main">
                    {leetcodeCalendar ? leetcodeCalendar.totalActiveDays.toLocaleString("en-US") : "--"}
                  </p>
                </div>
              </div>

              {leetcodeError ? <p className="mt-4 text-sm text-negative">{leetcodeError}</p> : null}
              <a
                href={LEETCODE}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary mt-5 inline-flex px-4 py-2 text-sm"
                aria-label="Open LeetCode profile in a new tab"
              >
                Open LeetCode Profile
              </a>
            </article>

            <aside className="terminal-card p-5 sm:p-6">
              <p className="label-tag">Live stats</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="metric-tile">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Solved</p>
                  <p className="mt-1 text-lg font-semibold text-main">
                    {leetcodeSolved ? <CountUp target={leetcodeSolved.solvedProblem} /> : "--"}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">7d submissions</p>
                  <p className="mt-1 text-lg font-semibold text-main">
                    {leetcodeWeeklySubmissions !== null ? <CountUp target={leetcodeWeeklySubmissions} /> : "--"}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Streak</p>
                  <p className="mt-1 text-lg font-semibold text-main">
                    {leetcodeCalendar ? <CountUp target={leetcodeCalendar.streak} suffix="d" /> : "--"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="metric-tile">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Easy</p>
                  <p className="mt-1 text-sm font-semibold text-main">
                    {leetcodeSolved ? leetcodeSolved.easySolved.toLocaleString("en-US") : "--"}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Medium</p>
                  <p className="mt-1 text-sm font-semibold text-main">
                    {leetcodeSolved ? leetcodeSolved.mediumSolved.toLocaleString("en-US") : "--"}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Hard</p>
                  <p className="mt-1 text-sm font-semibold text-main">
                    {leetcodeSolved ? leetcodeSolved.hardSolved.toLocaleString("en-US") : "--"}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted">
                Data refreshes from public LeetCode profile endpoints for <span className="text-main">@drewstake</span>.
              </p>
            </aside>
          </div>
        </RevealSection>

        <RevealSection
          id="quant"
          title="Trading and research"
          subtitle="Risk-first workflow, process over outcomes, and growing interest in backtesting plus market microstructure."
        >
          <div className="grid gap-6 lg:grid-cols-[1.15fr,1fr]">
            <article className="terminal-card p-5 sm:p-6">
              <p className="text-sm leading-7 text-main">
                I treat trading as a systems problem: define risk, collect clean data, review execution quality, and
                refine rules. I am especially interested in backtesting frameworks, microstructure behavior, and
                improving decision quality under volatility.
              </p>

              <div className="mt-5 rounded-xl border border-soft p-4">
                <p className="label-tag">Risk panel (sample)</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="metric-tile">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Daily max loss</p>
                    <p className="mt-1 text-sm font-semibold text-main">$600</p>
                  </div>
                  <div className="metric-tile">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Max drawdown</p>
                    <p className="mt-1 text-sm font-semibold text-main">4.5% trailing</p>
                  </div>
                  <div className="metric-tile">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Sizing rule</p>
                    <p className="mt-1 text-sm font-semibold text-main">0.5R per setup</p>
                  </div>
                  <div className="metric-tile">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Products</p>
                    <p className="mt-1 text-sm font-semibold text-main">ES, NQ, MNQ, MES</p>
                  </div>
                </div>
              </div>
            </article>

            <aside className="terminal-card p-5 sm:p-6">
              <p className="label-tag">Today's trading log</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="metric-tile">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Daily PnL</p>
                  <p className={`mt-1 text-lg font-semibold ${dailyClosedPnl >= 0 ? "text-positive" : "text-negative"}`}>
                    {pnlFormatter.format(dailyClosedPnl)}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Closed trades</p>
                  <p className="mt-1 text-lg font-semibold text-main">{closedTradeRows.length}</p>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto rounded-lg border border-soft">
                <table className="min-w-full border-collapse text-left font-mono text-[11px]">
                  <thead>
                    <tr className="bg-[rgba(8,14,26,0.42)] text-muted">
                      <th className="px-2 py-2 font-medium">Symbol</th>
                      <th className="px-2 py-2 font-medium">Side</th>
                      <th className="px-2 py-2 font-medium">Entry</th>
                      <th className="px-2 py-2 font-medium">Time</th>
                      <th className="px-2 py-2 font-medium">Exit</th>
                      <th className="px-2 py-2 font-medium">Exit Time</th>
                      <th className="px-2 py-2 font-medium">Duration</th>
                      <th className="px-2 py-2 font-medium">PnL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closedTradeRows.map((trade) => (
                      <tr
                        key={`${trade.symbol}-${trade.entryTime}-${trade.exitTime}`}
                        className="border-t border-soft text-main"
                      >
                        <td className="px-2 py-2">{trade.symbol}</td>
                        <td className="px-2 py-2">{trade.side === "long" ? "Long" : "Short"}</td>
                        <td className="px-2 py-2">{formatPrice(trade.entry)}</td>
                        <td className="px-2 py-2">{formatClockTime(trade.entryTime)}</td>
                        <td className="px-2 py-2">{formatPrice(trade.exit)}</td>
                        <td className="px-2 py-2">{formatClockTime(trade.exitTime)}</td>
                        <td className="px-2 py-2">{trade.duration}</td>
                        <td className={`px-2 py-2 ${trade.pnl >= 0 ? "text-positive" : "text-negative"}`}>
                          {pnlFormatter.format(trade.pnl)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted">
                Tracking fields: entry, time, exit, exit time, trade duration, and PnL for each trade.
              </p>
            </aside>
          </div>
        </RevealSection>

        <TickerStrip />

        <TradingPlayground theme={theme} />

        <RevealSection id="contact" title="Contact" subtitle="Open to software and quant-adjacent opportunities.">
          <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
            <aside className="terminal-card p-5 sm:p-6">
              <p className="label-tag">Links</p>
              <div className="mt-4 flex flex-col gap-2">
                <a href={`mailto:${EMAIL}`} className="btn-secondary px-4 py-2 text-sm">
                  Email
                </a>
                <a href={LINKEDIN} target="_blank" rel="noreferrer" className="btn-secondary px-4 py-2 text-sm">
                  LinkedIn
                </a>
                <a href={GITHUB} target="_blank" rel="noreferrer" className="btn-secondary px-4 py-2 text-sm">
                  GitHub
                </a>
                <a href={LEETCODE} target="_blank" rel="noreferrer" className="btn-secondary px-4 py-2 text-sm">
                  LeetCode
                </a>
              </div>
            </aside>

            <form className="terminal-card p-5 sm:p-6" onSubmit={onSubmit} noValidate aria-label="Contact form">
              <p className="label-tag">Send a message</p>

              <div className="mt-4 grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-sm text-main">Name</span>
                  <input
                    className="field-input"
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    aria-label="Your name"
                    aria-invalid={Boolean(formErrors.name)}
                  />
                  {formErrors.name ? <span className="mt-1 block text-xs text-negative">{formErrors.name}</span> : null}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-main">Email</span>
                  <input
                    className="field-input"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    aria-label="Your email"
                    aria-invalid={Boolean(formErrors.email)}
                  />
                  {formErrors.email ? (
                    <span className="mt-1 block text-xs text-negative">{formErrors.email}</span>
                  ) : null}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-main">Message</span>
                  <textarea
                    className="field-input min-h-28"
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    aria-label="Your message"
                    aria-invalid={Boolean(formErrors.message)}
                  />
                  {formErrors.message ? (
                    <span className="mt-1 block text-xs text-negative">{formErrors.message}</span>
                  ) : null}
                </label>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button type="submit" className="btn-primary px-4 py-2 text-sm">
                  Validate Form
                </button>
                <p className="text-xs text-muted">{submitStatus}</p>
              </div>
            </form>
          </div>
        </RevealSection>

        <footer className="mx-auto mt-12 w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
          <p className="terminal-line">Last updated: {lastUpdated}</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
