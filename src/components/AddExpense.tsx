import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, InputNumber, message, Segmented } from "antd";
import dayjs from "dayjs";
import type { Category, TransactionType, Transaction } from "../types";
import { getPrimaryCategories, getSubCategories, addTransaction, updateTransaction } from "../db/database";
import { getCategoryById } from "../data/categories";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editTransaction?: Transaction | null;
}

export default function AddExpense({ open, onClose, onSuccess, editTransaction }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [txType, setTxType] = useState<TransactionType>("expense");
  const [primaryCategories, setPrimaryCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [selectedPrimary, setSelectedPrimary] = useState<number | null>(null);

  const isEdit = !!editTransaction;

  useEffect(() => {
    if (open) {
      initForm();
    }
  }, [open]);

  async function initForm() {
    const cats = await getPrimaryCategories();
    setPrimaryCategories(cats);

    if (editTransaction) {
      // 编辑模式：预填数据
      setTxType(editTransaction.type);
      const cat = getCategoryById(editTransaction.category_id);
      const parentId = cat?.parent_id || null;

      if (parentId) {
        setSelectedPrimary(parentId);
        const subs = await getSubCategories(parentId);
        setSubCategories(subs);
      }

      form.setFieldsValue({
        amount: editTransaction.amount,
        categoryId: editTransaction.category_id,
        date: dayjs(editTransaction.date),
        note: editTransaction.note,
      });
    } else {
      // 新增模式
      form.resetFields();
      form.setFieldsValue({ date: dayjs(), note: "" });
      setTxType("expense");
      setSelectedPrimary(null);
      setSubCategories([]);
    }
  }

  function handleTypeChange(val: string) {
    setTxType(val as TransactionType);
    setSelectedPrimary(null);
    setSubCategories([]);
    form.setFieldsValue({ categoryId: undefined });
  }

  async function handlePrimaryChange(primaryId: number) {
    setSelectedPrimary(primaryId);
    form.setFieldsValue({ categoryId: undefined });
    if (primaryId) {
      const subs = await getSubCategories(primaryId);
      setSubCategories(subs);
    } else {
      setSubCategories([]);
    }
  }

  async function handleSubmit(values: {
    amount: number;
    categoryId: number;
    note: string;
    date: dayjs.Dayjs;
  }) {
    setLoading(true);
    try {
      const data = {
        amount: values.amount,
        categoryId: values.categoryId,
        type: txType,
        note: values.note || "",
        date: values.date.format("YYYY-MM-DD"),
      };
      if (isEdit) {
        await updateTransaction(editTransaction!.id, data);
        message.success("修改成功！");
      } else {
        await addTransaction(data);
        message.success(txType === "income" ? "收入记录成功！" : "支出记录成功！");
      }
      onSuccess();
      onClose();
    } catch (e) {
      message.error("操作失败：" + String(e));
    } finally {
      setLoading(false);
    }
  }

  const isIncome = txType === "income";

  return (
    <Modal
      title={isEdit ? "✏️ 编辑记录" : (isIncome ? "💵 记收入" : "💰 记支出")}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={isEdit ? "保存修改" : "保存"}
      cancelText="取消"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="类型">
          <Segmented
            block size="large" value={txType} onChange={handleTypeChange}
            options={[
              { label: "🔴 支出", value: "expense" },
              { label: "🟢 收入", value: "income" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="amount" label="金额 (元)"
          rules={[{ required: true, message: "请输入金额" },
            { type: "number", min: 0.01, max: 99999999.99, message: "金额需在0.01-99999999.99之间" }]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="0.00" precision={2} prefix="¥" size="large" autoFocus />
        </Form.Item>

        <Form.Item label="分类" required>
          <Select
            placeholder="选择一级分类" onChange={handlePrimaryChange} value={selectedPrimary}
            allowClear size="large"
            options={primaryCategories.map((c) => ({ label: `${c.icon} ${c.name}`, value: c.id }))}
          />
        </Form.Item>

        {subCategories.length > 0 && (
          <Form.Item name="categoryId" rules={[{ required: true, message: "请选择二级分类" }]}>
            <Select placeholder="选择二级分类" size="large"
              options={subCategories.map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>
        )}

        <Form.Item name="date" label="日期">
          <DatePicker style={{ width: "100%" }} size="large" />
        </Form.Item>

        <Form.Item name="note" label="备注">
          <Input.TextArea placeholder="写点什么..." rows={2} maxLength={200} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
}
