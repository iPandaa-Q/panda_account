// 交易记录类型
export type TransactionType = "expense" | "income";

export interface Transaction {
  id: number;
  amount: number;         // 金额（元）
  category_id: number;    // 关联二级分类
  type: TransactionType;  // 收入 or 支出
  note: string;           // 备注
  date: string;           // 日期 YYYY-MM-DD
  created_at: string;     // 创建时间
}

// 分类类型
export interface Category {
  id: number;
  name: string;
  icon: string;
  parent_id: number | null;
  sort_order: number;
  type: TransactionType;  // 属于支出还是收入
}

// 新增交易表单
export interface TransactionFormData {
  amount: string;
  categoryId: number | null;
  type: TransactionType;
  note: string;
  date: string;
}

// 筛选条件
export interface TransactionFilter {
  type: TransactionType | "all";
  categoryId: number | null;
  subCategoryId: number | null;
  dateFrom: string;
  dateTo: string;
  keyword: string;
}

// 统计
export interface StatItem {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  total: number;
  count: number;
  percentage: number;
}
