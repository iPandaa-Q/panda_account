import { useEffect, useRef, useState, useCallback } from "react";
import "./SnakeGame.css";

// ═══════════════════════════════════════════
// 游戏常量（模块级，避免重复创建）
// ═══════════════════════════════════════════

const GRID = 20;
const CELL = 24;
const SIZE = GRID * CELL;
const SPEED = 130;
const INIT_SNAKE: Point[] = [{ x: 8, y: 10 }];

/** 键盘 → 方向（统一转小写后查找，无需重复大小写条目） */
const KEY_DIR: Record<string, Direction> = {
  arrowup: "up", arrowdown: "down", arrowleft: "left", arrowright: "right",
  w: "up", s: "down", a: "left", d: "right",
};

/** 反方向表（模块级常量，不用每次按键都 new 一个对象） */
const OPPOSITE: Record<Direction, Direction> = {
  up: "down", down: "up", left: "right", right: "left",
};

// ═══════════════════════════════════════════
// 类型
// ═══════════════════════════════════════════

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";
type Phase = "idle" | "playing" | "dead" | "victory";

// ═══════════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════════

/** 深拷贝初始蛇位置（避免意外修改模块级常量） */
function copySnake(): Point[] {
  return INIT_SNAKE.map((p) => ({ ...p }));
}

/** 随机生成食物，带安全阀防止死循环 */
function randomFood(snake: Point[]): Point {
  if (snake.length >= GRID * GRID) return { x: -1, y: -1 };

  let food: Point;
  let tries = 0;
  do {
    food = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
    tries++;
  } while (tries < 5000 && snake.some((s) => s.x === food.x && s.y === food.y));

  // 安全阀触发 → 返回 (-1,-1) 表示棋盘已满
  if (tries >= 5000) return { x: -1, y: -1 };
  return food;
}

// ═══════════════════════════════════════════
// 组件
// ═══════════════════════════════════════════

function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Point[]>(copySnake());
  const foodRef = useRef<Point>(randomFood(INIT_SNAKE));
  const dirRef = useRef<Direction>("right");
  const timerRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);

  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    try {
      const v = localStorage.getItem("jizhang_snake_best");
      return v ? parseInt(v, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [phase, setPhase] = useState<Phase>("idle");

  // 保持 bestRef 与 state 同步（供 tick 闭包读取最新值）
  useEffect(() => {
    bestRef.current = best;
  }, [best]);

  // ── 绘图（纯 Canvas 操作，无依赖） ──
  const draw = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    // 背景
    ctx.fillStyle = "#0f0f23";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // 网格
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
    if (f.x >= 0) {
      ctx.fillStyle = "#ff6b6b";
      ctx.shadowColor = "#ff6b6b";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 蛇
    snakeRef.current.forEach((s, i) => {
      const head = i === 0;
      ctx.fillStyle = head ? "#4ecdc4" : "#3db8a8";
      if (head) {
        ctx.shadowColor = "#4ecdc4";
        ctx.shadowBlur = 8;
      }
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
      ctx.shadowBlur = 0;
    });
  }, []);

  // ── 死亡 / 结束处理 ──
  const endGame = useCallback(
    (reason: "dead" | "victory") => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setPhase(reason);
      // 更新最高分（副作用在 tick 外执行）
      const cur = scoreRef.current;
      if (cur > bestRef.current) {
        bestRef.current = cur;
        setBest(cur);
        try {
          localStorage.setItem("jizhang_snake_best", String(cur));
        } catch {
          /* 忽略存储错误 */
        }
      }
    },
    [],
  );

  // ── 游戏主循环 ──
  const tick = useCallback(() => {
    const snake = snakeRef.current;
    const head = snake[0];
    const dir = dirRef.current;

    let next: Point;
    switch (dir) {
      case "up":
        next = { x: head.x, y: head.y - 1 };
        break;
      case "down":
        next = { x: head.x, y: head.y + 1 };
        break;
      case "left":
        next = { x: head.x - 1, y: head.y };
        break;
      default:
        next = { x: head.x + 1, y: head.y };
    }

    // 撞墙
    if (next.x < 0 || next.x >= GRID || next.y < 0 || next.y >= GRID) {
      endGame("dead");
      return;
    }

    // 是否吃到食物
    const eating = next.x === foodRef.current.x && next.y === foodRef.current.y;

    // 🔑 自碰判断：如果没吃到食物，尾部下一帧会空出来，排除它
    const body = eating ? snake : snake.slice(0, -1);
    if (body.some((s) => s.x === next.x && s.y === next.y)) {
      endGame("dead");
      return;
    }

    const longer = [next, ...snake];

    if (eating) {
      // 生成新食物
      const newFood = randomFood(longer);
      if (newFood.x < 0) {
        // 棋盘满了 → 胜利
        snakeRef.current = longer;
        foodRef.current = newFood;
        scoreRef.current += 10;
        setScore(scoreRef.current);
        draw();
        endGame("victory");
        return;
      }
      foodRef.current = newFood;
      scoreRef.current += 10;
      setScore(scoreRef.current);
    } else {
      longer.pop(); // 去掉尾部
    }

    snakeRef.current = longer;
    draw();
  }, [draw, endGame]);

  // ── 开始 ──
  const start = useCallback(() => {
    snakeRef.current = copySnake();
    foodRef.current = randomFood(INIT_SNAKE);
    dirRef.current = "right";
    scoreRef.current = 0;
    setScore(0);
    setPhase("playing");
    draw();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(tick, SPEED);
  }, [tick, draw]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── 键盘（仅 playing 状态启用，其他状态不拦截按键） ──
  useEffect(() => {
    if (phase !== "playing") return;

    const onKey = (e: KeyboardEvent) => {
      const d = KEY_DIR[e.key.toLowerCase()];
      if (!d) return;
      e.preventDefault();
      if (OPPOSITE[d] !== dirRef.current) {
        dirRef.current = d;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  // ── 渲染 ──
  const snakeLen = 1 + score / 10;

  return (
    <div className="snake-wrap">
      <div className="snake-hud">
        <span>🍎 {score}</span>
        <span>🏆 {best}</span>
        <span>🐍 {snakeLen}</span>
      </div>

      <div className="snake-board">
        <canvas ref={canvasRef} width={SIZE} height={SIZE} />

        {phase === "idle" && (
          <div className="snake-overlay">
            <p className="snake-title">🐍 贪吃蛇</p>
            <button className="snake-btn" onClick={start}>
              开始游戏
            </button>
            <p className="snake-hint">方向键 / WASD 控制</p>
          </div>
        )}

        {phase === "dead" && (
          <div className="snake-overlay">
            <p className="snake-dead">游戏结束</p>
            <p className="snake-score">
              得分：{score}　最高：{best}
            </p>
            <button className="snake-btn" onClick={start}>
              再来一局
            </button>
          </div>
        )}

        {phase === "victory" && (
          <div className="snake-overlay">
            <p className="snake-title">🎉 恭喜通关！</p>
            <p className="snake-score">
              得分：{score}　最高：{best}
            </p>
            <button className="snake-btn" onClick={start}>
              再来一局
            </button>
          </div>
        )}
      </div>

      <p className="snake-hint">
        ↑↓←→ 或 WASD 控制方向 · 撞墙或撞到自己则结束
      </p>
    </div>
  );
}

export default SnakeGame;
