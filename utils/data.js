const categories = ['全部', '热菜', '凉菜', '主食', '汤类', '饮品']

const dishes = [
  { id: 1,  name: '宫保鸡丁',   emoji: '🍗', price: 38, desc: '经典川菜，鸡肉鲜嫩，花生酥脆，香辣可口', category: '热菜' },
  { id: 2,  name: '麻婆豆腐',   emoji: '🌶️', price: 28, desc: '麻辣鲜香，豆腐嫩滑入味，下饭神器', category: '热菜' },
  { id: 3,  name: '红烧肉',     emoji: '🥩', price: 48, desc: '肥而不腻，入口即化，色泽红亮', category: '热菜' },
  { id: 4,  name: '水煮鱼',     emoji: '🐟', price: 58, desc: '鲜嫩鱼片配麻辣红油，鲜香四溢', category: '热菜' },
  { id: 5,  name: '糖醋排骨',   emoji: '🍖', price: 45, desc: '外酥里嫩，酸甜适口，老少皆宜', category: '热菜' },
  { id: 6,  name: '回锅肉',     emoji: '🥘', price: 36, desc: '经典川味，肉片肥瘦相间，配蒜苗更香', category: '热菜' },

  { id: 7,  name: '凉拌黄瓜',   emoji: '🥒', price: 12, desc: '清脆爽口，蒜香开胃，夏日必备', category: '凉菜' },
  { id: 8,  name: '皮蛋豆腐',   emoji: '🥚', price: 18, desc: '嫩滑豆腐搭配松花蛋，清爽可口', category: '凉菜' },
  { id: 9,  name: '口水鸡',     emoji: '🐔', price: 32, desc: '麻辣鲜香，鸡肉嫩滑，红油诱人', category: '凉菜' },
  { id: 10, name: '夫妻肺片',   emoji: '🥩', price: 35, desc: '麻辣鲜香，薄片入味，经典川式凉菜', category: '凉菜' },

  { id: 11, name: '蛋炒饭',     emoji: '🍳', price: 15, desc: '粒粒分明，蛋香浓郁，简单美味', category: '主食' },
  { id: 12, name: '阳春面',     emoji: '🍜', price: 12, desc: '清汤寡水却鲜美无比，朴素经典', category: '主食' },
  { id: 13, name: '小笼包',     emoji: '🥟', price: 22, desc: '皮薄馅多汁水丰富，一口一个鲜', category: '主食' },
  { id: 14, name: '煎饺',       emoji: '🥟', price: 18, desc: '底部金黄酥脆，馅料鲜美多汁', category: '主食' },

  { id: 15, name: '紫菜蛋花汤', emoji: '🍲', price: 10, desc: '紫菜鲜香，蛋花飘逸，清淡暖胃', category: '汤类' },
  { id: 16, name: '番茄蛋汤',   emoji: '🍅', price: 12, desc: '酸甜可口，营养丰富，家常暖汤', category: '汤类' },
  { id: 17, name: '酸辣汤',     emoji: '🥣', price: 15, desc: '酸辣开胃，口感丰富，驱寒暖身', category: '汤类' },
  { id: 18, name: '冬瓜排骨汤', emoji: '🍖', price: 28, desc: '排骨炖至软烂，冬瓜清甜解腻', category: '汤类' },

  { id: 19, name: '柠檬水',     emoji: '🍋', price: 8,  desc: '新鲜柠檬切片，酸甜清凉解渴', category: '饮品' },
  { id: 20, name: '酸梅汤',     emoji: '🫐', price: 10, desc: '古法熬制，酸甜爽口，消暑开胃', category: '饮品' },
  { id: 21, name: '豆浆',       emoji: '🥛', price: 6,  desc: '现磨黄豆，浓郁香醇，营养早餐', category: '饮品' },
  { id: 22, name: '可乐',       emoji: '🥤', price: 5,  desc: '冰镇可口可乐，碳酸畅爽体验', category: '饮品' },
]

const categoryColors = {
  '热菜': '#FF6B6B',
  '凉菜': '#4ECDC4',
  '主食': '#FFD93D',
  '汤类': '#95E1D3',
  '饮品': '#A8D8EA',
}

module.exports = {
  categories,
  dishes,
  categoryColors,
}
