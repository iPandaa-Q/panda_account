// 格式化金额：分 → 元显示
export function formatAmount(amount: number): string {
  return `¥${amount.toFixed(2)}`;
}

// 格式化日期
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekday = weekdays[d.getDay()];
  return `${month}月${day}日 周${weekday}`;
}

// 获取今天的日期字符串 YYYY-MM-DD
export function getTodayStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 获取本月第一天的日期字符串
export function getMonthStartStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

// 验证金额输入
export function isValidAmount(val: string): boolean {
  if (!val) return false;
  const num = parseFloat(val);
  return !isNaN(num) && num > 0 && num <= 99999999.99;
}
