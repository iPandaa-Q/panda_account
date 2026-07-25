import { useState, useCallback } from "react";
import { Button, Tabs, message, Modal, List, Tag } from "antd";
import {
  PlusOutlined, UnorderedListOutlined, PieChartOutlined,
  DownloadOutlined, SaveOutlined, FolderOpenOutlined, AppstoreOutlined,
} from "@ant-design/icons";
import { save, open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, copyFile, exists } from "@tauri-apps/plugin-fs";
import AddExpense from "./components/AddExpense";
import ExpenseList from "./components/ExpenseList";
import StatsPage from "./pages/StatsPage";
import { exportToCsv } from "./db/database";
import { PRESET_CATEGORIES } from "./data/categories";
import type { Transaction } from "./types";
import "./App.css";

function App() {
  const [addOpen, setAddOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("list");
  const [exporting, setExporting] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  const handleAddSuccess = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setEditTx(null);
  }, []);

  function handleEdit(tx: Transaction) {
    setEditTx(tx);
    setAddOpen(true);
  }

  async function handleExport() {
    setExporting(true);
    try {
      const csv = await exportToCsv();
      const filePath = await save({
        defaultPath: "记账导出.csv",
        filters: [{ name: "CSV文件", extensions: ["csv"] }],
      });
      if (filePath) {
        await writeTextFile(filePath, csv);
        message.success("导出成功！");
      }
    } catch (e) {
      message.error("导出失败：" + String(e));
    } finally { setExporting(false); }
  }

  async function handleBackup() {
    try {
      // Find the database path
      const dbPath = "C:\\Users\\pandaa\\AppData\\Local\\com.jizhang.app\\jizhang.db";
      const savePath = await save({
        defaultPath: "记账备份.db",
        filters: [{ name: "数据库文件", extensions: ["db"] }],
      });
      if (savePath && await exists(dbPath)) {
        await copyFile(dbPath, savePath);
        message.success("备份成功！");
      } else if (savePath) {
        message.warning("数据库文件未找到，请先使用APP记录数据。");
      }
    } catch (e) {
      message.error("备份失败：" + String(e));
    }
  }

  async function handleRestore() {
    try {
      const filePath = await open({
        filters: [{ name: "数据库文件", extensions: ["db"] }],
        multiple: false,
      });
      if (filePath) {
        const dbPath = "C:\\Users\\pandaa\\AppData\\Local\\com.jizhang.app\\jizhang.db";
        await copyFile(filePath as string, dbPath);
        message.success("恢复成功！请重新打开APP。");
      }
    } catch (e) {
      message.error("恢复失败：" + String(e));
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 记账</h1>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
          <Button size="small" icon={<DownloadOutlined />} onClick={handleExport} loading={exporting}>
            导出CSV
          </Button>
          <Button size="small" icon={<SaveOutlined />} onClick={handleBackup}>
            备份
          </Button>
          <Button size="small" icon={<FolderOpenOutlined />} onClick={handleRestore}>
            恢复
          </Button>
          <Button size="small" icon={<AppstoreOutlined />} onClick={() => setCatOpen(true)}>
            分类
          </Button>
        </div>
      </header>

      <Tabs activeKey={activeTab} onChange={setActiveTab} centered
        items={[
          { key: "list", label: <span><UnorderedListOutlined /> 明细</span>,
            children: <ExpenseList refreshKey={refreshKey} onEdit={handleEdit} /> },
          { key: "stats", label: <span><PieChartOutlined /> 统计</span>,
            children: <StatsPage /> },
        ]}
      />

      <Button type="primary" shape="circle" size="large" icon={<PlusOutlined />}
        className="fab" onClick={() => { setEditTx(null); setAddOpen(true); }} />

      <AddExpense open={addOpen} onClose={() => { setAddOpen(false); setEditTx(null); }}
        onSuccess={handleAddSuccess} editTransaction={editTx} />

      {/* 分类管理弹窗 */}
      <Modal title="🗂️ 分类管理" open={catOpen} onCancel={() => setCatOpen(false)} footer={null} width={400}>
        <List size="small" dataSource={PRESET_CATEGORIES.filter(c => c.parent_id === null)}
          renderItem={(parent) => (
            <List.Item key={parent.id}>
              <div style={{ width: "100%" }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                  {parent.icon} {parent.name}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {PRESET_CATEGORIES.filter(c => c.parent_id === parent.id).map(sub => (
                    <Tag key={sub.id}>{sub.name}</Tag>
                  ))}
                </div>
              </div>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
}

export default App;
