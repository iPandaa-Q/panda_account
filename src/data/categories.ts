import type { Category } from "../types";

// 预设分类数据
// 一级分类的 parent_id 为 null，二级分类的 parent_id 指向一级分类的 id
export const PRESET_CATEGORIES: Category[] = [
  // ===== 一级大类 =====
  { id: 1,  name: "餐饮",   icon: "🍜", parent_id: null, sort_order: 1 },
  { id: 2,  name: "交通",   icon: "🚗", parent_id: null, sort_order: 2 },
  { id: 3,  name: "购物",   icon: "🛒", parent_id: null, sort_order: 3 },
  { id: 4,  name: "住房",   icon: "🏠", parent_id: null, sort_order: 4 },
  { id: 5,  name: "娱乐",   icon: "🎮", parent_id: null, sort_order: 5 },
  { id: 6,  name: "医疗",   icon: "💊", parent_id: null, sort_order: 6 },
  { id: 7,  name: "教育",   icon: "📚", parent_id: null, sort_order: 7 },
  { id: 8,  name: "通讯",   icon: "📱", parent_id: null, sort_order: 8 },
  { id: 9,  name: "服饰",   icon: "👗", parent_id: null, sort_order: 9 },
  { id: 10, name: "日用",   icon: "🧹", parent_id: null, sort_order: 10 },
  { id: 11, name: "人情",   icon: "🎁", parent_id: null, sort_order: 11 },
  { id: 12, name: "投资",   icon: "💰", parent_id: null, sort_order: 12 },
  { id: 13, name: "其他",   icon: "📦", parent_id: null, sort_order: 13 },

  // ===== 二级小类 =====
  // 1. 餐饮 (parent_id=1)
  { id: 101, name: "三餐正餐", icon: "🍚", parent_id: 1, sort_order: 1 },
  { id: 102, name: "零食小吃", icon: "🍿", parent_id: 1, sort_order: 2 },
  { id: 103, name: "水果",     icon: "🍎", parent_id: 1, sort_order: 3 },
  { id: 104, name: "外卖",     icon: "🛵", parent_id: 1, sort_order: 4 },
  { id: 105, name: "聚餐请客", icon: "🍻", parent_id: 1, sort_order: 5 },
  { id: 106, name: "咖啡饮品", icon: "☕", parent_id: 1, sort_order: 6 },

  // 2. 交通 (parent_id=2)
  { id: 201, name: "公交地铁", icon: "🚇", parent_id: 2, sort_order: 1 },
  { id: 202, name: "打车拼车", icon: "🚕", parent_id: 2, sort_order: 2 },
  { id: 203, name: "加油充电", icon: "⛽", parent_id: 2, sort_order: 3 },
  { id: 204, name: "停车费",   icon: "🅿️", parent_id: 2, sort_order: 4 },
  { id: 205, name: "火车高铁", icon: "🚄", parent_id: 2, sort_order: 5 },
  { id: 206, name: "飞机机票", icon: "✈️", parent_id: 2, sort_order: 6 },

  // 3. 购物 (parent_id=3)
  { id: 301, name: "日常百货", icon: "🧴", parent_id: 3, sort_order: 1 },
  { id: 302, name: "数码电子", icon: "📱", parent_id: 3, sort_order: 2 },
  { id: 303, name: "家居用品", icon: "🛋️", parent_id: 3, sort_order: 3 },
  { id: 304, name: "书籍文具", icon: "📖", parent_id: 3, sort_order: 4 },
  { id: 305, name: "办公用品", icon: "🖊️", parent_id: 3, sort_order: 5 },

  // 4. 住房 (parent_id=4)
  { id: 401, name: "房租",     icon: "🏘️", parent_id: 4, sort_order: 1 },
  { id: 402, name: "房贷月供", icon: "🏦", parent_id: 4, sort_order: 2 },
  { id: 403, name: "水费电费", icon: "💡", parent_id: 4, sort_order: 3 },
  { id: 404, name: "燃气费",   icon: "🔥", parent_id: 4, sort_order: 4 },
  { id: 405, name: "物业费",   icon: "🏢", parent_id: 4, sort_order: 5 },
  { id: 406, name: "维修保养", icon: "🔧", parent_id: 4, sort_order: 6 },

  // 5. 娱乐 (parent_id=5)
  { id: 501, name: "电影影院", icon: "🎬", parent_id: 5, sort_order: 1 },
  { id: 502, name: "游戏充值", icon: "🎮", parent_id: 5, sort_order: 2 },
  { id: 503, name: "旅游出行", icon: "🏖️", parent_id: 5, sort_order: 3 },
  { id: 504, name: "运动健身", icon: "🏋️", parent_id: 5, sort_order: 4 },
  { id: 505, name: "KTV酒吧",  icon: "🎤", parent_id: 5, sort_order: 5 },
  { id: 506, name: "演出展览", icon: "🎨", parent_id: 5, sort_order: 6 },
  { id: 507, name: "视频会员", icon: "📺", parent_id: 5, sort_order: 7 },

  // 6. 医疗 (parent_id=6)
  { id: 601, name: "门诊挂号", icon: "🏥", parent_id: 6, sort_order: 1 },
  { id: 602, name: "药品费",   icon: "💊", parent_id: 6, sort_order: 2 },
  { id: 603, name: "体检",     icon: "🩺", parent_id: 6, sort_order: 3 },
  { id: 604, name: "住院治疗", icon: "🛌", parent_id: 6, sort_order: 4 },
  { id: 605, name: "牙科眼科", icon: "🦷", parent_id: 6, sort_order: 5 },

  // 7. 教育 (parent_id=7)
  { id: 701, name: "培训课程", icon: "📝", parent_id: 7, sort_order: 1 },
  { id: 702, name: "书籍教材", icon: "📚", parent_id: 7, sort_order: 2 },
  { id: 703, name: "考试报名", icon: "📋", parent_id: 7, sort_order: 3 },
  { id: 704, name: "学费",     icon: "🎓", parent_id: 7, sort_order: 4 },

  // 8. 通讯 (parent_id=8)
  { id: 801, name: "手机话费", icon: "📞", parent_id: 8, sort_order: 1 },
  { id: 802, name: "宽带网络", icon: "🌐", parent_id: 8, sort_order: 2 },
  { id: 803, name: "快递寄送", icon: "📦", parent_id: 8, sort_order: 3 },

  // 9. 服饰 (parent_id=9)
  { id: 901, name: "衣服裤装", icon: "👔", parent_id: 9, sort_order: 1 },
  { id: 902, name: "鞋帽袜",   icon: "👟", parent_id: 9, sort_order: 2 },
  { id: 903, name: "包包配饰", icon: "👜", parent_id: 9, sort_order: 3 },
  { id: 904, name: "护肤化妆品", icon: "💄", parent_id: 9, sort_order: 4 },

  // 10. 日用 (parent_id=10)
  { id: 1001, name: "洗漱用品", icon: "🪥", parent_id: 10, sort_order: 1 },
  { id: 1002, name: "清洁用品", icon: "🧽", parent_id: 10, sort_order: 2 },
  { id: 1003, name: "厨房用具", icon: "🍳", parent_id: 10, sort_order: 3 },

  // 11. 人情 (parent_id=11)
  { id: 1101, name: "送礼随礼", icon: "🎀", parent_id: 11, sort_order: 1 },
  { id: 1102, name: "红包",     icon: "🧧", parent_id: 11, sort_order: 2 },
  { id: 1103, name: "请客招待", icon: "🍽️", parent_id: 11, sort_order: 3 },
  { id: 1104, name: "慈善捐赠", icon: "💝", parent_id: 11, sort_order: 4 },

  // 12. 投资 (parent_id=12)
  { id: 1201, name: "股票基金", icon: "📈", parent_id: 12, sort_order: 1 },
  { id: 1202, name: "保险保费", icon: "🛡️", parent_id: 12, sort_order: 2 },
  { id: 1203, name: "理财产品", icon: "🏦", parent_id: 12, sort_order: 3 },
  { id: 1204, name: "加密货币", icon: "🪙", parent_id: 12, sort_order: 4 },

  // 13. 其他 (parent_id=13)
  { id: 1301, name: "其他支出", icon: "📦", parent_id: 13, sort_order: 1 },

  // ===== 一级大类（收入） =====
  { id: 14, name: "收入", icon: "💵", parent_id: null, sort_order: 14 },

  // 14. 收入 (parent_id=14)
  { id: 1401, name: "工资薪水", icon: "💼", parent_id: 14, sort_order: 1 },
  { id: 1402, name: "奖金绩效", icon: "🏆", parent_id: 14, sort_order: 2 },
  { id: 1403, name: "投资收益", icon: "📈", parent_id: 14, sort_order: 3 },
  { id: 1404, name: "兼职副业", icon: "💻", parent_id: 14, sort_order: 4 },
  { id: 1405, name: "红包礼金", icon: "🧧", parent_id: 14, sort_order: 5 },
  { id: 1406, name: "报销退款", icon: "↩️", parent_id: 14, sort_order: 6 },
  { id: 1407, name: "其他收入", icon: "📦", parent_id: 14, sort_order: 7 },
];

// 获取所有一级分类
export function getPrimaryCategories(): Category[] {
  return PRESET_CATEGORIES.filter((c) => c.parent_id === null);
}

// 根据一级分类ID获取二级分类
export function getSubCategories(parentId: number): Category[] {
  return PRESET_CATEGORIES.filter((c) => c.parent_id === parentId);
}

// 根据分类ID查找分类
export function getCategoryById(id: number): Category | undefined {
  return PRESET_CATEGORIES.find((c) => c.id === id);
}

// 获取分类全名（一级 > 二级）
export function getCategoryFullName(categoryId: number): string {
  const sub = getCategoryById(categoryId);
  if (!sub) return "未知";
  if (sub.parent_id === null) return `${sub.icon} ${sub.name}`;
  const parent = getCategoryById(sub.parent_id);
  return parent ? `${parent.icon} ${parent.name} > ${sub.name}` : sub.name;
}
