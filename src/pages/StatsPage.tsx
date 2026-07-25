import { useState, useEffect } from "react";
import {
  Card, Row, Col, DatePicker, Statistic, Tabs, Empty, Table, Spin, Segmented,
} from "antd";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from "recharts";
import dayjs from "dayjs";
import type { StatItem, TransactionType } from "../types";
import { getStatsByType, getTotalAmount } from "../db/database";
import { getCategoryById } from "../data/categories";
import { formatAmount, getMonthStartStr, getTodayStr } from "../utils/format";

const COLORS = [
  "#4f46e5", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6",
  "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#6366f1",
  "#14b8a6", "#e11d48", "#64748b",
];

export default function StatsPage() {
  const [dateFrom, setDateFrom] = useState<string>(getMonthStartStr());
  const [dateTo, setDateTo] = useState<string>(getTodayStr());
  const [statType, setStatType] = useState<TransactionType>("expense");
  const [stats, setStats] = useState<StatItem[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, [dateFrom, dateTo, statType]);

  async function loadStats() {
    setLoading(true);
    const [data, income, expense] = await Promise.all([
      getStatsByType(statType, dateFrom, dateTo),
      getTotalAmount("income", dateFrom, dateTo),
      getTotalAmount("expense", dateFrom, dateTo),
    ]);
    setStats(data.filter((s) => s.count > 0));
    setTotalIncome(income);
    setTotalExpense(expense);
    setLoading(false);
  }

  function renderPieLabel(props: PieLabelRenderProps): string {
    const { name, percent } = props;
    const pct = (percent ?? 0) * 100;
    if (pct < 3) return "";
    return `${name} ${pct.toFixed(1)}%`;
  }

  return (
    <Spin spinning={loading}>
      {/* 顶部汇总 */}
      <Card size="small" style={{ marginBottom: 12 }}>
        <Row gutter={[8, 8]} align="middle">
          <Col xs={24} sm={6}>
            <DatePicker
              value={dateFrom ? dayjs(dateFrom) : null}
              onChange={(d) => setDateFrom(d ? d.format("YYYY-MM-DD") : "")}
              placeholder="开始日期" size="small" style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={1} style={{ textAlign: "center" }}>
            <span style={{ color: "#999" }}>至</span>
          </Col>
          <Col xs={24} sm={6}>
            <DatePicker
              value={dateTo ? dayjs(dateTo) : null}
              onChange={(d) => setDateTo(d ? d.format("YYYY-MM-DD") : "")}
              placeholder="结束日期" size="small" style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={11} style={{ textAlign: "right" }}>
            <Row gutter={24} justify="end">
              <Col>
                <Statistic title="总收入" value={totalIncome} precision={2} prefix="¥"
                  valueStyle={{ color: "#10b981", fontWeight: 600, fontSize: 16 }} />
              </Col>
              <Col>
                <Statistic title="总支出" value={totalExpense} precision={2} prefix="¥"
                  valueStyle={{ color: "#e74c3c", fontWeight: 600, fontSize: 16 }} />
              </Col>
              <Col>
                <Statistic title="结余" value={totalIncome - totalExpense} precision={2} prefix="¥"
                  valueStyle={{
                    color: totalIncome - totalExpense >= 0 ? "#10b981" : "#e74c3c",
                    fontWeight: 700, fontSize: 16,
                  }} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <div style={{ marginBottom: 12, textAlign: "center" }}>
        <Segmented
          size="small"
          value={statType}
          onChange={(v) => setStatType(v as TransactionType)}
          options={[
            { label: "🔴 支出分布", value: "expense" },
            { label: "🟢 收入分布", value: "income" },
          ]}
        />
      </div>

      <Tabs
        defaultActiveKey="pie"
        items={[
          {
            key: "pie", label: "饼图",
            children: stats.length > 0 ? (
              <Card>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie data={stats} dataKey="total" nameKey="categoryName"
                      cx="50%" cy="50%" outerRadius={140} label={renderPieLabel}>
                      {stats.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => formatAmount(Number(val))} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            ) : (<Empty description="暂无数据" />),
          },
          {
            key: "bar", label: "柱状图",
            children: stats.length > 0 ? (
              <Card>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stats}>
                    <XAxis dataKey="categoryName" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(val) => formatAmount(Number(val))} />
                    <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            ) : (<Empty description="暂无数据" />),
          },
          {
            key: "detail", label: "明细表",
            children: stats.length > 0 ? (
              <Card>
                <Table
                  dataSource={stats} rowKey="categoryId" pagination={false} size="small"
                  columns={[
                    {
                      title: "分类", dataIndex: "categoryName", key: "name",
                      render: (_: string, r: StatItem) =>
                        `${getCategoryById(r.categoryId)?.icon || ""} ${r.categoryName}`,
                    },
                    {
                      title: "金额", dataIndex: "total", key: "total",
                      render: (v: number) => (
                        <span style={{ color: statType === "income" ? "#10b981" : "#e74c3c", fontWeight: 600 }}>
                          {formatAmount(v)}
                        </span>
                      ),
                      sorter: (a: StatItem, b: StatItem) => a.total - b.total,
                    },
                    { title: "笔数", dataIndex: "count", key: "count" },
                    {
                      title: "占比", dataIndex: "percentage", key: "pct",
                      render: (v: number) => `${v.toFixed(1)}%`,
                      sorter: (a: StatItem, b: StatItem) => a.percentage - b.percentage,
                    },
                  ]}
                />
              </Card>
            ) : (<Empty description="暂无数据" />),
          },
        ]}
      />
    </Spin>
  );
}
