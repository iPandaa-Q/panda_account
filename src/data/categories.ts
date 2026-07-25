import type { Category } from "../types";

// 预设分类数据
// 一级分类的 parent_id 为 null，二级分类的 parent_id 指向一级分类的 id
export const PRESET_CATEGORIES: Category[] = [
  // ===== 一级大类（支出） =====
  { id: 1,  name: "餐饮",   icon: "🍜", parent_id: null, sort_order: 1,  type: "expense" },
  { id: 2,  name: "交通",   icon: "🚗", parent_id: null, sort_order: 2,  type: "expense" },
  { id: 3,  name: "购物",   icon: "🛒", parent_id: null, sort_order: 3,  type: "expense" },
  { id: 4,  name: "住房",   icon: "🏠", parent_id: null, sort_order: 4,  type: "expense" },
  { id: 5,  name: "娱乐",   icon: "🎮", parent_id: null, sort_order: 5,  type: "expense" },
  { id: 6,  name: "医疗",   icon: "💊", parent_id: null, sort_order: 6,  type: "expense" },
  { id: 7,  name: "教育",   icon: "📚", parent_id: null, sort_order: 7,  type: "expense" },
  { id: 8,  name: "通讯",   icon: "📱", parent_id: null, sort_order: 8,  type: "expense" },
  { id: 9,  name: "服饰",   icon: "👗", parent_id: null, sort_order: 9,  type: "expense" },
  { id: 10, name: "日用",   icon: "🧹", parent_id: null, sort_order: 10, type: "expense" },
  { id: 11, name: "人情",   icon: "🎁", parent_id: null, sort_order: 11, type: "expense" },
  { id: 12, name: "投资",   icon: "💰", parent_id: null, sort_order: 12, type: "expense" },
  { id: 13, name: "其他",   icon: "📦", parent_id: null, sort_order: 13, type: "expense" },

  // ===== 二级小类 =====
  // 1. 餐饮 (parent_id=1)
  { id: 101, name: "三餐正餐", icon: "🍚", parent_id: 1, sort_order: 1, type: "expense" },
  { id: 102, name: "零食小吃", icon: "🍿", parent_id: 1, sort_order: 2, type: "expense" },
  { id: 103, name: "水果",     icon: "🍎", parent_id: 1, sort_order: 3, type: "expense" },
  { id: 104, name: "外卖",     icon: "🛵", parent_id: 1, sort_order: 4, type: "expense" },
  { id: 105, name: "聚餐请客", icon: "🍻", parent_id: 1, sort_order: 5, type: "expense" },
  { id: 106, name: "咖啡饮品", icon: "☕", parent_id: 1, sort_order: 6, type: "expense" },

  // 2. 交通 (parent_id=2)
  { id: 201, name: "公交地铁", icon: "🚇", parent_id: 2, sort_order: 1, type: "expense" },
  { id: 202, name: "打车拼车", icon: "🚕", parent_id: 2, sort_order: 2, type: "expense" },
  { id: 203, name: "加油充电", icon: "⛽", parent_id: 2, sort_order: 3, type: "expense" },
  { id: 204, name: "停车费",   icon: "🅿️", parent_id: 2, sort_order: 4, type: "expense" },
  { id: 205, name: "火车高铁", icon: "🚄", parent_id: 2, sort_order: 5, type: "expense" },
  { id: 206, name: "飞机机票", icon: "✈️", parent_id: 2, sort_order: 6, type: "expense" },

  // 3. 购物 (parent_id=3)
  { id: 301, name: "日常百货", icon: "🧴", parent_id: 3, sort_order: 1, type: "expense" },
  { id: 302, name: "数码电子", icon: "📱", parent_id: 3, sort_order: 2, type: "expense" },
  { id: 303, name: "家居用品", icon: "🛋️", parent_id: 3, sort_order: 3, type: "expense" },
  { id: 304, name: "书籍文具", icon: "📖", parent_id: 3, sort_order: 4, type: "expense" },
  { id: 305, name: "办公用品", icon: "🖊️", parent_id: 3, sort_order: 5, type: "expense" },

  // 4. 住房 (parent_id=4)
  { id: 401, name: "房租",     icon: "🏘️", parent_id: 4, sort_order: 1, type: "expense" },
  { id: 402, name: "房贷月供", icon: "🏦", parent_id: 4, sort_order: 2, type: "expense" },
  { id: 403, name: "水费电费", icon: "💡", parent_id: 4, sort_order: 3, type: "expense" },
  { id: 404, name: "燃气费",   icon: "🔥", parent_id: 4, sort_order: 4, type: "expense" },
  { id: 405, name: "物业费",   icon: "🏢", parent_id: 4, sort_order: 5, type: "expense" },
  { id: 406, name: "维修保养", icon: "🔧", parent_id: 4, sort_order: 6, type: "expense" },

  // 5. 娱乐 (parent_id=5)
  { id: 501, name: "电影影院", icon: "🎬", parent_id: 5, sort_order: 1, type: "expense" },
  { id: 502, name: "游戏充值", icon: "🎮", parent_id: 5, sort_order: 2, type: "expense" },
  { id: 503, name: "旅游出行", icon: "🏖️", parent_id: 5, sort_order: 3, type: "expense" },
  { id: 504, name: "运动健身", icon: "🏋️", parent_id: 5, sort_order: 4, type: "expense" },
  { id: 505, name: "KTV酒吧",  icon: "🎤", parent_id: 5, sort_order: 5, type: "expense" },
  { id: 506, name: "演出展览", icon: "🎨", parent_id: 5, sort_order: 6, type: "expense" },
  { id: 507, name: "视频会员", icon: "📺", parent_id: 5, sort_order: 7, type: "expense" },

  // 6. 医疗 (parent_id=6)
  { id: 601, name: "门诊挂号", icon: "🏥", parent_id: 6, sort_order: 1, type: "expense" },
  { id: 602, name: "药品费",   icon: "💊", parent_id: 6, sort_order: 2, type: "expense" },
  { id: 603, name: "体检",     icon: "🩺", parent_id: 6, sort_order: 3, type: "expense" },
  { id: 604, name: "住院治疗", icon: "🛌", parent_id: 6, sort_order: 4, type: "expense" },
  { id: 605, name: "牙科眼科", icon: "🦷", parent_id: 6, sort_order: 5, type: "expense" },

  // 7. 教育 (parent_id=7)
  { id: 701, name: "培训课程", icon: "📝", parent_id: 7, sort_order: 1, type: "expense" },
  { id: 702, name: "书籍教材", icon: "📚", parent_id: 7, sort_order: 2, type: "expense" },
  { id: 703, name: "考试报名", icon: "📋", parent_id: 7, sort_order: 3, type: "expense" },
  { id: 704, name: "学费",     icon: "🎓", parent_id: 7, sort_order: 4, type: "expense" },

  // 8. 通讯 (parent_id=8)
  { id: 801, name: "手机话费", icon: "📞", parent_id: 8, sort_order: 1, type: "expense" },
  { id: 802, name: "宽带网络", icon: "🌐", parent_id: 8, sort_order: 2, type: "expense" },
  { id: 803, name: "快递寄送", icon: "📦", parent_id: 8, sort_order: 3, type: "expense" },

  // 9. 服饰 (parent_id=9)
  { id: 901, name: "衣服裤装", icon: "👔", parent_id: 9, sort_order: 1, type: "expense" },
  { id: 902, name: "鞋帽袜",   icon: "👟", parent_id: 9, sort_order: 2, type: "expense" },
  { id: 903, name: "包包配饰", icon: "👜", parent_id: 9, sort_order: 3, type: "expense" },
  { id: 904, name: "护肤化妆品", icon: "💄", parent_id: 9, sort_order: 4, type: "expense" },

  // 10. 日用 (parent_id=10)
  { id: 1001, name: "洗漱用品", icon: "🪥", parent_id: 10, sort_order: 1, type: "expense" },
  { id: 1002, name: "清洁用品", icon: "🧽", parent_id: 10, sort_order: 2, type: "expense" },
  { id: 1003, name: "厨房用具", icon: "🍳", parent_id: 10, sort_order: 3, type: "expense" },

  // 11. 人情 (parent_id=11)
  { id: 1101, name: "送礼随礼", icon: "🎀", parent_id: 11, sort_order: 1, type: "expense" },
  { id: 1102, name: "红包",     icon: "🧧", parent_id: 11, sort_order: 2, type: "expense" },
  { id: 1103, name: "请客招待", icon: "🍽️", parent_id: 11, sort_order: 3, type: "expense" },
  { id: 1104, name: "慈善捐赠", icon: "💝", parent_id: 11, sort_order: 4, type: "expense" },

  // 12. 投资 (parent_id=12)
  { id: 1201, name: "股票基金", icon: "📈", parent_id: 12, sort_order: 1, type: "expense" },
  { id: 1202, name: "保险保费", icon: "🛡️", parent_id: 12, sort_order: 2, type: "expense" },
  { id: 1203, name: "理财产品", icon: "🏦", parent_id: 12, sort_order: 3, type: "expense" },
  { id: 1204, name: "加密货币", icon: "🪙", parent_id: 12, sort_order: 4, type: "expense" },

  // 13. 其他 (parent_id=13)
  { id: 1301, name: "其他支出", icon: "📦", parent_id: 13, sort_order: 1, type: "expense" },

  // ===== 一级大类（收入） =====
  { id: 14, name: "职业收入", icon: "💼", parent_id: null, sort_order: 14, type: "income" },
  { id: 15, name: "投资理财", icon: "💰", parent_id: null, sort_order: 15, type: "income" },
  { id: 16, name: "副业兼职", icon: "🔧", parent_id: null, sort_order: 16, type: "income" },
  { id: 17, name: "人情往来", icon: "🎁", parent_id: null, sort_order: 17, type: "income" },
  { id: 18, name: "退款报销", icon: "↩️", parent_id: null, sort_order: 18, type: "income" },
  { id: 19, name: "其他收入", icon: "📦", parent_id: null, sort_order: 19, type: "income" },

  // 14. 职业收入 (parent_id=14)
  { id: 1401, name: "基本工资", icon: "💳", parent_id: 14, sort_order: 1, type: "income" },
  { id: 1402, name: "绩效奖金", icon: "🏆", parent_id: 14, sort_order: 2, type: "income" },
  { id: 1403, name: "年终奖金", icon: "🎉", parent_id: 14, sort_order: 3, type: "income" },
  { id: 1404, name: "加班补贴", icon: "⏰", parent_id: 14, sort_order: 4, type: "income" },
  { id: 1405, name: "出差补助", icon: "🚄", parent_id: 14, sort_order: 5, type: "income" },
  { id: 1406, name: "股权期权", icon: "📊", parent_id: 14, sort_order: 6, type: "income" },

  // 15. 投资理财 (parent_id=15)
  { id: 1501, name: "股票收益", icon: "📈", parent_id: 15, sort_order: 1, type: "income" },
  { id: 1502, name: "基金收益", icon: "💹", parent_id: 15, sort_order: 2, type: "income" },
  { id: 1503, name: "银行利息", icon: "🏦", parent_id: 15, sort_order: 3, type: "income" },
  { id: 1504, name: "房租收入", icon: "🏘️", parent_id: 15, sort_order: 4, type: "income" },
  { id: 1505, name: "理财分红", icon: "💎", parent_id: 15, sort_order: 5, type: "income" },
  { id: 1506, name: "加密货币", icon: "🪙", parent_id: 15, sort_order: 6, type: "income" },

  // 16. 副业兼职 (parent_id=16)
  { id: 1601, name: "自由职业", icon: "💻", parent_id: 16, sort_order: 1, type: "income" },
  { id: 1602, name: "兼职收入", icon: "⌚", parent_id: 16, sort_order: 2, type: "income" },
  { id: 1603, name: "咨询服务", icon: "🎯", parent_id: 16, sort_order: 3, type: "income" },
  { id: 1604, name: "自媒体创作", icon: "🎬", parent_id: 16, sort_order: 4, type: "income" },

  // 17. 人情往来 (parent_id=17)
  { id: 1701, name: "红包收入", icon: "🧧", parent_id: 17, sort_order: 1, type: "income" },
  { id: 1702, name: "礼金份子", icon: "💝", parent_id: 17, sort_order: 2, type: "income" },
  { id: 1703, name: "亲友赠与", icon: "🎀", parent_id: 17, sort_order: 3, type: "income" },
  { id: 1704, name: "中奖收入", icon: "🍀", parent_id: 17, sort_order: 4, type: "income" },

  // 18. 退款报销 (parent_id=18)
  { id: 1801, name: "公司报销", icon: "🧾", parent_id: 18, sort_order: 1, type: "income" },
  { id: 1802, name: "购物退款", icon: "↩️", parent_id: 18, sort_order: 2, type: "income" },
  { id: 1803, name: "保险理赔", icon: "🛡️", parent_id: 18, sort_order: 3, type: "income" },
  { id: 1804, name: "押金退还", icon: "🔑", parent_id: 18, sort_order: 4, type: "income" },

  // 19. 其他收入 (parent_id=19)
  { id: 1901, name: "二手转卖", icon: "🔄", parent_id: 19, sort_order: 1, type: "income" },
  { id: 1902, name: "其他杂项", icon: "📦", parent_id: 19, sort_order: 2, type: "income" },
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
