const observationPoints = [
  { id: 't1', name: '1号望远镜位', type: 'telescope', x: 20, y: 30, status: 'available' },
  { id: 't2', name: '2号望远镜位', type: 'telescope', x: 45, y: 25, status: 'available' },
  { id: 't3', name: '3号望远镜位', type: 'telescope', x: 70, y: 30, status: 'maintenance' },
  { id: 't4', name: '4号望远镜位', type: 'telescope', x: 30, y: 55, status: 'available' },
  { id: 't5', name: '5号望远镜位', type: 'telescope', x: 60, y: 60, status: 'available' },
  { id: 'i1', name: '室内观景区A', type: 'indoor', x: 15, y: 75, status: 'available' },
  { id: 'i2', name: '室内观景区B', type: 'indoor', x: 40, y: 80, status: 'available' },
  { id: 'i3', name: '室内观景区C', type: 'indoor', x: 75, y: 75, status: 'available' }
];

const equipment = [
  { id: 'eq1', name: '天文望远镜-星特朗8SE', category: 'telescope', total: 5, price: 120, status: 'active' },
  { id: 'eq2', name: '天文望远镜-信达小黑', category: 'telescope', total: 3, price: 150, status: 'active' },
  { id: 'eq3', name: 'UHC滤镜', category: 'filter', total: 10, price: 30, status: 'active' },
  { id: 'eq4', name: 'OIII滤镜', category: 'filter', total: 8, price: 35, status: 'active' },
  { id: 'eq5', name: 'H-alpha滤镜', category: 'filter', total: 6, price: 40, status: 'active' },
  { id: 'eq6', name: '双筒望远镜', category: 'binocular', total: 4, price: 50, status: 'active' },
  { id: 'eq7', name: '星图手册', category: 'accessory', total: 20, price: 15, status: 'active' },
  { id: 'eq8', name: '红光手电', category: 'accessory', total: 15, price: 10, status: 'active' }
];

const seasonPrices = [
  { id: 's1', name: '春季(3-5月)', months: [3, 4, 5], basePrice: 100, pointMultiplier: 1.0 },
  { id: 's2', name: '夏季(6-8月)', months: [6, 7, 8], basePrice: 150, pointMultiplier: 1.2 },
  { id: 's3', name: '秋季(9-11月)', months: [9, 10, 11], basePrice: 120, pointMultiplier: 1.1 },
  { id: 's4', name: '冬季(12-2月)', months: [12, 1, 2], basePrice: 80, pointMultiplier: 0.9 }
];

const bookings = [
  {
    id: 'b001',
    date: '2026-06-20',
    timeSlot: '20:00-22:00',
    pointId: 't1',
    userName: '张小明',
    phone: '13800138001',
    equipment: [{ id: 'eq1', quantity: 1 }, { id: 'eq3', quantity: 1 }],
    totalPrice: 250,
    status: 'confirmed',
    createdAt: '2026-06-10T10:30:00Z'
  },
  {
    id: 'b002',
    date: '2026-06-20',
    timeSlot: '20:00-22:00',
    pointId: 't2',
    userName: '李华',
    phone: '13800138002',
    equipment: [{ id: 'eq2', quantity: 1 }],
    totalPrice: 270,
    status: 'confirmed',
    createdAt: '2026-06-12T14:20:00Z'
  },
  {
    id: 'b003',
    date: '2026-06-21',
    timeSlot: '21:00-23:00',
    pointId: 't4',
    userName: '王芳',
    phone: '13800138003',
    equipment: [{ id: 'eq1', quantity: 1 }, { id: 'eq4', quantity: 1 }],
    totalPrice: 240,
    status: 'confirmed',
    createdAt: '2026-06-13T09:15:00Z'
  }
];

function generateWeatherData() {
  const weatherData = {};
  const today = new Date();
  
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const random = Math.random();
    let condition, visibility, suitability;
    
    if (random > 0.7) {
      condition = '晴朗';
      visibility = '优秀';
      suitability = 'excellent';
    } else if (random > 0.4) {
      condition = '少云';
      visibility = '良好';
      suitability = 'good';
    } else if (random > 0.2) {
      condition = '多云';
      visibility = '一般';
      suitability = 'fair';
    } else {
      condition = '阴雨';
      visibility = '较差';
      suitability = 'poor';
    }
    
    weatherData[dateStr] = {
      date: dateStr,
      condition,
      visibility,
      suitability,
      temperature: Math.floor(Math.random() * 20) + 10,
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5
    };
  }
  
  return weatherData;
}

const weatherData = generateWeatherData();

const timeSlots = [
  '19:00-21:00',
  '20:00-22:00',
  '21:00-23:00',
  '22:00-00:00'
];

module.exports = {
  observationPoints,
  equipment,
  seasonPrices,
  bookings,
  weatherData,
  timeSlots
};
