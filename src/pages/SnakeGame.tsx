import { useEffect, useRef, useState, useCallback } from "react";
import "./SnakeGame.css";

// 游戏参数
const GRID = 20;          // 20×20 的网格
const CELL = 24;          // 每格 24px
const SIZE = GRID * CELL; // 画布总大小 480px
const SPEED = 130;        // 蛇移动速度（毫秒）

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";

// 随机生成食物位置（不能落在蛇身上）
function randomFood(snake: Point[]): Point {
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
  return food;
}

function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Point[]>([{ x: 8, y: 10 }]);
  const foodRef = useRef<Point>(randomFood([{ x: 8, y: 10 }]));
  const dirRef = useRef<Direction>("right");
  const timerRef = useRef<number | null>(null);
  const deadRef = useRef(false);

  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    const saved = localStorage.getItem("snake_best");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [phase, setPhase] = useState<"idle" | "playing" | "dead">("idle");

  // ── 绘图 ────────────────────────────────
  const draw = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    // 背景
    ctx.fillStyle = "#0f0f23";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // 网格线
    ctx.strokeStyle = "#1a1a3e";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(SIZE, i * CELL);
      ctx.stroke();
    }

    // 食物
    const f = foodRef.current;
    ctx.fillStyle = "#ff6b6b";
    ctx.shadowColor = "#ff6b6b";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 蛇
    snakeRef.current.forEach((s, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? "#4ecdc4" : "#3db8a8";
      ctx.shadowColor = isHead ? "#4ecdc4" : "transparent";
      ctx.shadowBlur = isHead ? 8 : 0;
      const r = 4;
      const x = s.x * CELL + 2;
      const y = s.y * CELL + 2;
      const w = CELL - 4;
      const h = CELL - 4;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, []);

  // ── 游戏主循环 ──────────────────────────
  const tick = useCallback(() => {
    if (deadRef.current) return;

    const snake = snakeRef.current;
    const dir = dirRef.current;
    const head = snake[0];

    let next: Point;
    switch (dir) {
      case "up":    next = { x: head.x, y: head.y - 1 }; break;
      case "down":  next = { x: head.x, y: head.y + 1 }; break;
      case "left":  next = { x: head.x - 1, y: head.y }; break;
      default:      next = { x: head.x + 1, y: head.y }; break;
    }

    // 撞墙
    if (next.x < 0 || next.x >= GRID || next.y < 0 || next.y >= GRID) {
      deadRef.current = true;
      setPhase("dead");
      return;
    }

    // 撞自己
    if (snake.some((s) => s.x === next.x && s.y === next.y)) {
      deadRef.current = true;
      setPhase("dead");
      return;
    }

    const longer = [next, ...snake];

    // 吃到了食物
    if (next.x === foodRef.current.x && next.y === foodRef.current.y) {
      foodRef.current = randomFood(longer);
      setScore((s) => s + 10);
    } else {
      longer.pop();
    }

    snakeRef.current = longer;
    draw();
  }, [draw]);

  // ── 开始 / 重开 ─────────────────────────
  const start = useCallback(() => {
    snakeRef.current = [{ x: 8, y: 10 }];
    foodRef.current = randomFood([{ x: 8, y: 10 }]);
    dirRef.current = "right";
    deadRef.current = false;
    setScore(0);
    setPhase("playing");
    draw();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(tick, SPEED);
  }, [tick, draw]);

  // 卸载时清理定时器
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // 死亡时停止定时器
  useEffect(() => {
    if (phase === "dead") {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      // 更新最高分
      setScore((current) => {
        if (current > best) {
          const newBest = current;
          localStorage.setItem("snake_best", String(newBest));
          setBest(newBest);
        }
        return current;
      });
    }
  }, [phase, best]);

  // ── 键盘控制 ────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", W: "up", s: "down", S: "down", a: "left", A: "left", d: "right", D: "right",
      };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();

      // 不能掉头
      const opp: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };
      if (opp[d] !== dirRef.current) {
        dirRef.current = d;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── 界面 ────────────────────────────────
  return (
    <div className="snake-wrap">
      <div className="snake-hud">
        <span>🍎 {score}</span>
        <span>🏆 {best}</span>
        <span>🐍 {snakeRef.current.length}</span>
      </div>

      <div className="snake-board">
        <canvas ref={canvasRef} width={SIZE} height={SIZE} />

        {phase === "idle" && (
          <div className="snake-overlay">
            <p className="snake-title">🐍 贪吃蛇</p>
            <button className="snake-btn" onClick={start}>开始游戏</button>
            <p className="snake-hint">方向键 / WASD 控制</p>
          </div>
        )}

        {phase === "dead" && (
          <div className="snake-overlay">
            <p className="snake-dead">游戏结束</p>
            <p className="snake-score">得分：{score}　最高：{best}</p>
            <button className="snake-btn" onClick={start}>再来一局</button>
          </div>
        )}
      </div>

      <p className="snake-hint">↑↓←→ 或 WASD 控制方向　·　撞墙或撞到自己则结束</p>
    </div>
  );
}

export default SnakeGame;
