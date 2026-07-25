import Database from "@tauri-apps/plugin-sql";
import type { Transaction, TransactionType, Category, TransactionFilter, StatItem } from "../types";
import { PRESET_CATEGORIES } from "../data/categories";

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!db) {
    db = await Database.load("sqlite:jizhang.db");
    await initTables();
  }
  return db;
}

async function initTables(): Promise<void> {
  const database = db!;

  await database.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT '',
      parent_id INTEGER,
      sort_order INTEGER NOT NULL DEFAULT 0,
      type TEXT NOT NULL DEFAULT 'expense',
      FOREIGN KEY (parent_id) REFERENCES categories(id)
    )
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      category_id INTEGER NOT NULL,
      type TEXT NOT NULL DEFAULT 'expense',
      note TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // 迁移：为旧数据库的 categories 表添加 type 列
  try {
    await database.execute(
      "ALTER TABLE categories ADD COLUMN type TEXT NOT NULL DEFAULT 'expense'"
    );
  } catch {
    // 列已存在，忽略
  }

  // 确保所有收入分类的 type 正确（修复中间版本可能产生的错误）
  await database.execute(
    "UPDATE categories SET type = 'income' WHERE id >= 14"
  );

  // 始终同步预设分类：INSERT OR REPLACE 确保数据库与代码中的分类一致
  // 已有分类会更新（名称/图标/类型），新分类会插入
  for (const cat of PRESET_CATEGORIES) {
    await database.execute(
      "INSERT OR REPLACE INTO categories (id, name, icon, parent_id, sort_order, type) VALUES ($1, $2, $3, $4, $5, $6)",
      [cat.id, cat.name, cat.icon, cat.parent_id, cat.sort_order, cat.type]
    );
  }
}

// ===== 分类 =====
export async function getPrimaryCategories(type?: TransactionType): Promise<Category[]> {
  const database = await getDb();
  let sql = "SELECT * FROM categories WHERE parent_id IS NULL";
  const params: string[] = [];
  if (type) {
    sql += " AND type = ?";
    params.push(type);
  }
  sql += " ORDER BY sort_order";
  return await database.select<Category[]>(sql, params);
}

export async function getSubCategories(parentId: number, type?: TransactionType): Promise<Category[]> {
  const database = await getDb();
  let sql = "SELECT * FROM categories WHERE parent_id = ?";
  const params: (string | number)[] = [parentId];
  if (type) {
    sql += " AND type = ?";
    params.push(type);
  }
  sql += " ORDER BY sort_order";
  return await database.select<Category[]>(sql, params);
}

// ===== 交易 =====
export async function addTransaction(data: {
  amount: number;
  categoryId: number;
  type: TransactionType;
  note: string;
  date: string;
}): Promise<number> {
  const database = await getDb();
  const result = await database.execute(
    "INSERT INTO transactions (amount, category_id, type, note, date) VALUES ($1, $2, $3, $4, $5)",
    [data.amount, data.categoryId, data.type, data.note, data.date]
  );
  return result.lastInsertId as number;
}

export async function updateTransaction(id: number, data: {
  amount: number;
  categoryId: number;
  type: TransactionType;
  note: string;
  date: string;
}): Promise<void> {
  const database = await getDb();
  await database.execute(
    "UPDATE transactions SET amount=$1, category_id=$2, type=$3, note=$4, date=$5 WHERE id=$6",
    [data.amount, data.categoryId, data.type, data.note, data.date, id]
  );
}

export async function getTransactions(filter?: TransactionFilter): Promise<Transaction[]> {
  const database = await getDb();
  let sql = "SELECT * FROM transactions WHERE 1=1";
  const params: (string | number)[] = [];

  if (filter) {
    if (filter.type !== "all") {
      sql += " AND type = ?";
      params.push(filter.type);
    }
    if (filter.categoryId !== null) {
      const subs = await getSubCategories(filter.categoryId);
      if (subs.length > 0) {
        const ids = subs.map((s) => s.id);
        sql += ` AND category_id IN (${ids.map(() => "?").join(",")})`;
        params.push(...ids);
      }
    }
    if (filter.subCategoryId !== null) {
      sql += " AND category_id = ?";
      params.push(filter.subCategoryId);
    }
    if (filter.dateFrom) {
      sql += " AND date >= ?";
      params.push(filter.dateFrom);
    }
    if (filter.dateTo) {
      sql += " AND date <= ?";
      params.push(filter.dateTo);
    }
    if (filter.keyword) {
      sql += " AND note LIKE ?";
      params.push(`%${filter.keyword}%`);
    }
  }

  sql += " ORDER BY date DESC, id DESC LIMIT 500";
  return await database.select<Transaction[]>(sql, params);
}

export async function deleteTransaction(id: number): Promise<void> {
  const database = await getDb();
  await database.execute("DELETE FROM transactions WHERE id = $1", [id]);
}

// ===== 统计 =====
export async function getStatsByType(
  type: TransactionType,
  dateFrom?: string,
  dateTo?: string
): Promise<StatItem[]> {
  const database = await getDb();
  let sql = `
    SELECT
      c.id as categoryId, c.name as categoryName, c.icon as categoryIcon,
      COALESCE(SUM(t.amount), 0) as total, COUNT(t.id) as count
    FROM categories c
    LEFT JOIN transactions t ON c.id = t.category_id AND t.type = ?
    WHERE c.parent_id IS NOT NULL
  `;
  const params: (string | number)[] = [type];

  if (dateFrom) { sql += " AND (t.date >= ? OR t.date IS NULL)"; params.push(dateFrom); }
  if (dateTo)   { sql += " AND (t.date <= ? OR t.date IS NULL)"; params.push(dateTo); }

  sql += " GROUP BY c.id ORDER BY total DESC";

  const rows = await database.select<
    { categoryId: number; categoryName: string; categoryIcon: string; total: number; count: number }[]
  >(sql, params);

  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);
  return rows.map((r) => ({
    categoryId: r.categoryId, categoryName: r.categoryName,
    categoryIcon: r.categoryIcon, total: r.total, count: r.count,
    percentage: grandTotal > 0 ? (r.total / grandTotal) * 100 : 0,
  }));
}

// ===== 导出 =====
export async function exportToCsv(dateFrom?: string, dateTo?: string): Promise<string> {
  const database = await getDb();
  let sql = `
    SELECT t.date, t.type, c.name as category, t.amount, t.note
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id WHERE 1=1
  `;
  const params: string[] = [];
  if (dateFrom) { sql += " AND t.date >= ?"; params.push(dateFrom); }
  if (dateTo)   { sql += " AND t.date <= ?"; params.push(dateTo); }
  sql += " ORDER BY t.date DESC, t.id DESC";

  const rows = await database.select<
    { date: string; type: string; category: string; amount: number; note: string }[]
  >(sql, params);

  let csv = "﻿日期,类型,分类,金额,备注\n";
  for (const row of rows) {
    const typeLabel = row.type === "income" ? "收入" : "支出";
    csv += `${row.date},${typeLabel},${row.category},${row.amount},${row.note}\n`;
  }
  return csv;
}

export async function getTotalAmount(
  type: TransactionType,
  dateFrom?: string,
  dateTo?: string
): Promise<number> {
  const database = await getDb();
  let sql = "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = ?";
  const params: (string | number)[] = [type];
  if (dateFrom) { sql += " AND date >= ?"; params.push(dateFrom); }
  if (dateTo)   { sql += " AND date <= ?"; params.push(dateTo); }
  const rows = await database.select<{ total: number }[]>(sql, params);
  return rows[0].total;
}
