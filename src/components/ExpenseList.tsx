import { useState, useEffect, useCallback } from "react";
import { List, Tag, Input, Select, DatePicker, Space, Popconfirm, Empty, Card, Segmented } from "antd";
import { DeleteOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Transaction, Category, TransactionType } from "../types";
import {
  getTransactions, deleteTransaction, getPrimaryCategories,
} from "../db/database";
import { getCategoryById } from "../data/categories";
import { formatAmount, formatDate, getMonthStartStr, getTodayStr } from "../utils/format";

interface Props {
  refreshKey: number;
  onEdit: (tx: Transaction) => void;
}

export default function ExpenseList({ refreshKey, onEdit }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [primaryCategories, setPrimaryCategories] = useState<Category[]>([]);
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");
  const [filterCategory, setFilterCategory] = useState<number | null>(null);
  const [filterDateFrom, setFilterDateFrom] = useState<string>(getMonthStartStr());
  const [filterDateTo, setFilterDateTo] = useState<string>(getTodayStr());
  const [filterKeyword, setFilterKeyword] = useState("");

  useEffect(() => {
    getPrimaryCategories(filterType === "all" ? undefined : filterType).then((cats) => {
      setPrimaryCategories(cats);
      setFilterCategory(null); // 切换类型时重置分类筛选
    });
  }, [filterType]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTransactions({
        type: filterType,
        categoryId: filterCategory,
        subCategoryId: null,
        dateFrom: filterDateFrom,
        dateTo: filterDateTo,
        keyword: filterKeyword,
      });
      setTransactions(data);
    } finally {
      setLoading(false);
    }
  }, [filterType, filterCategory, filterDateFrom, filterDateTo, filterKeyword, refreshKey]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleDelete(id: number) {
    await deleteTransaction(id);
    loadData();
  }

  return (
    <div>
      {/* 筛选栏 */}
      <Card size="small" style={{ marginBottom: 12 }}>
        <Space wrap>
          <Segmented
            size="small"
            value={filterType}
            onChange={(v) => setFilterType(v as TransactionType | "all")}
            options={[
              { label: "全部", value: "all" },
              { label: "🔴 支出", value: "expense" },
              { label: "🟢 收入", value: "income" },
            ]}
          />
          <Select
            placeholder="全部分类"
            allowClear
            style={{ width: 140 }}
            value={filterCategory}
            onChange={setFilterCategory}
            options={primaryCategories.map((c) => ({
              label: `${c.icon} ${c.name}`,
              value: c.id,
            }))}
          />
          <DatePicker
            placeholder="开始日期"
            value={filterDateFrom ? dayjs(filterDateFrom) : null}
            onChange={(d) => setFilterDateFrom(d ? d.format("YYYY-MM-DD") : "")}
            allowClear
          />
          <DatePicker
            placeholder="结束日期"
            value={filterDateTo ? dayjs(filterDateTo) : null}
            onChange={(d) => setFilterDateTo(d ? d.format("YYYY-MM-DD") : "")}
            allowClear
          />
          <Input
            placeholder="搜索备注..."
            prefix={<SearchOutlined />}
            style={{ width: 140 }}
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            allowClear
          />
        </Space>
      </Card>

      {/* 列表 */}
      <List
        loading={loading}
        dataSource={transactions}
        locale={{ emptyText: <Empty description="暂无记录，记一笔吧！" /> }}
        renderItem={(item) => {
          const cat = getCategoryById(item.category_id);
          const parentCat = cat?.parent_id ? getCategoryById(cat.parent_id) : null;
          const isIncome = item.type === "income";
          return (
            <List.Item
              actions={[
                <EditOutlined key="edit" style={{ color: "#4f46e5", cursor: "pointer" }}
                  onClick={() => onEdit(item)} />,
                <Popconfirm key="del"
                  title="确定删除？"
                  onConfirm={() => handleDelete(item.id)}
                  okText="删除" cancelText="取消"
                >
                  <DeleteOutlined style={{ color: "#999", cursor: "pointer" }} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span>
                    <span style={{
                      fontSize: 18, fontWeight: 600,
                      color: isIncome ? "#10b981" : "#e74c3c",
                    }}>
                      {isIncome ? "+" : "-"}{formatAmount(item.amount)}
                    </span>
                    <span style={{ marginLeft: 10 }}>
                      {parentCat ? (
                        <Tag color="blue">{parentCat.icon} {parentCat.name}</Tag>
                      ) : null}
                      <Tag>{cat?.name}</Tag>
                    </span>
                  </span>
                }
                description={
                  <span>
                    <span style={{ marginRight: 12 }}>{formatDate(item.date)}</span>
                    {item.note && (
                      <span style={{ color: "#999" }}>{item.note}</span>
                    )}
                  </span>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
}
