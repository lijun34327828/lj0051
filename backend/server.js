const express = require('express');
const cors = require('cors');
const {
  observationPoints,
  equipment,
  seasonPrices,
  bookings,
  weatherData,
  timeSlots
} = require('./data/mockData');

const app = express();
const PORT = 8811;

app.use(cors());
app.use(express.json());

let _bookings = [...bookings];
let _equipment = equipment.map(e => ({ ...e }));
let _seasonPrices = seasonPrices.map(s => ({ ...s }));
let _observationPoints = observationPoints.map(p => ({ ...p }));

function getEquipmentAvailability(date, timeSlot) {
  const bookedQuantities = {};
  
  _bookings
    .filter(b => b.date === date && b.timeSlot === timeSlot && b.status === 'confirmed')
    .forEach(booking => {
      booking.equipment.forEach(eq => {
        bookedQuantities[eq.id] = (bookedQuantities[eq.id] || 0) + eq.quantity;
      });
    });
  
  return _equipment
    .filter(e => e.status === 'active')
    .map(e => ({
      ...e,
      available: e.total - (bookedQuantities[e.id] || 0)
    }));
}

function getPointAvailability(date, timeSlot) {
  const bookedPoints = new Set(
    _bookings
      .filter(b => b.date === date && b.timeSlot === timeSlot && b.status === 'confirmed')
      .map(b => b.pointId)
  );
  
  return _observationPoints.map(p => ({
    ...p,
    isBooked: bookedPoints.has(p.id),
    isAvailable: p.status === 'available' && !bookedPoints.has(p.id)
  }));
}

function getCurrentSeasonPrice(dateStr) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const season = _seasonPrices.find(s => s.months.includes(month));
  return season || _seasonPrices[0];
}

function calculateTotalPrice(date, pointId, equipmentList) {
  const season = getCurrentSeasonPrice(date);
  const point = _observationPoints.find(p => p.id === pointId);
  
  let basePrice = season.basePrice;
  if (point && point.type === 'telescope') {
    basePrice = Math.floor(basePrice * season.pointMultiplier);
  }
  
  let equipmentPrice = 0;
  equipmentList.forEach(eq => {
    const item = _equipment.find(e => e.id === eq.id);
    if (item) {
      equipmentPrice += item.price * eq.quantity;
    }
  });
  
  return basePrice + equipmentPrice;
}

app.get('/api/ping', (req, res) => {
  res.json({ message: '天文台预约系统后端服务运行正常', port: PORT });
});

app.get('/api/observation-points', (req, res) => {
  const { date, timeSlot } = req.query;
  
  if (date && timeSlot) {
    res.json(getPointAvailability(date, timeSlot));
  } else {
    res.json(_observationPoints);
  }
});

app.get('/api/equipment', (req, res) => {
  const { date, timeSlot } = req.query;
  
  if (date && timeSlot) {
    res.json(getEquipmentAvailability(date, timeSlot));
  } else {
    res.json(_equipment.filter(e => e.status === 'active'));
  }
});

app.get('/api/weather', (req, res) => {
  const { date } = req.query;
  
  if (date) {
    const weather = weatherData[date];
    if (weather) {
      res.json(weather);
    } else {
      res.status(404).json({ error: '未找到该日期的天气数据' });
    }
  } else {
    res.json(weatherData);
  }
});

app.get('/api/weather/calendar', (req, res) => {
  const { month } = req.query;
  const result = {};
  
  Object.keys(weatherData).forEach(date => {
    if (!month || date.startsWith(month)) {
      result[date] = weatherData[date];
    }
  });
  
  res.json(result);
});

app.get('/api/time-slots', (req, res) => {
  res.json(timeSlots);
});

app.get('/api/season-prices', (req, res) => {
  res.json(_seasonPrices);
});

app.get('/api/bookings', (req, res) => {
  const { date, status } = req.query;
  
  let filtered = [..._bookings];
  
  if (date) {
    filtered = filtered.filter(b => b.date === date);
  }
  
  if (status) {
    filtered = filtered.filter(b => b.status === status);
  }
  
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(filtered);
});

app.get('/api/bookings/:id', (req, res) => {
  const booking = _bookings.find(b => b.id === req.params.id);
  
  if (booking) {
    res.json(booking);
  } else {
    res.status(404).json({ error: '预约不存在' });
  }
});

app.post('/api/bookings', (req, res) => {
  const { date, timeSlot, pointId, userName, phone, equipment: equipmentList } = req.body;
  
  if (!date || !timeSlot || !pointId || !userName || !phone) {
    return res.status(400).json({ error: '缺少必要参数' });
  }
  
  const pointAvail = getPointAvailability(date, timeSlot);
  const point = pointAvail.find(p => p.id === pointId);
  
  if (!point || !point.isAvailable) {
    return res.status(400).json({ error: '该观测点位在此时段已被预约' });
  }
  
  if (equipmentList && equipmentList.length > 0) {
    const eqAvail = getEquipmentAvailability(date, timeSlot);
    
    for (const eq of equipmentList) {
      const availEq = eqAvail.find(e => e.id === eq.id);
      if (!availEq || availEq.available < eq.quantity) {
        return res.status(400).json({
          error: `设备 ${availEq ? availEq.name : eq.id} 库存不足`,
          available: availEq ? availEq.available : 0
        });
      }
    }
  }
  
  const totalPrice = calculateTotalPrice(date, pointId, equipmentList || []);
  
  const newBooking = {
    id: 'b' + Date.now(),
    date,
    timeSlot,
    pointId,
    userName,
    phone,
    equipment: equipmentList || [],
    totalPrice,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  _bookings.push(newBooking);
  
  res.status(201).json({
    message: '预约成功',
    booking: newBooking
  });
});

app.delete('/api/bookings/:id', (req, res) => {
  const index = _bookings.findIndex(b => b.id === req.params.id);
  
  if (index !== -1) {
    _bookings[index].status = 'cancelled';
    res.json({ message: '预约已取消', booking: _bookings[index] });
  } else {
    res.status(404).json({ error: '预约不存在' });
  }
});

app.put('/api/equipment/:id', (req, res) => {
  const index = _equipment.findIndex(e => e.id === req.params.id);
  
  if (index !== -1) {
    const { name, total, price, status, category } = req.body;
    
    if (name !== undefined) _equipment[index].name = name;
    if (total !== undefined) _equipment[index].total = total;
    if (price !== undefined) _equipment[index].price = price;
    if (status !== undefined) _equipment[index].status = status;
    if (category !== undefined) _equipment[index].category = category;
    
    res.json({ message: '设备信息已更新', equipment: _equipment[index] });
  } else {
    res.status(404).json({ error: '设备不存在' });
  }
});

app.post('/api/equipment', (req, res) => {
  const { name, category, total, price } = req.body;
  
  if (!name || !category || total === undefined || price === undefined) {
    return res.status(400).json({ error: '缺少必要参数' });
  }
  
  const newEquip = {
    id: 'eq' + Date.now(),
    name,
    category,
    total,
    price,
    status: 'active'
  };
  
  _equipment.push(newEquip);
  
  res.status(201).json({ message: '设备已添加', equipment: newEquip });
});

app.put('/api/observation-points/:id', (req, res) => {
  const index = _observationPoints.findIndex(p => p.id === req.params.id);
  
  if (index !== -1) {
    const { name, status, x, y, type } = req.body;
    
    if (name !== undefined) _observationPoints[index].name = name;
    if (status !== undefined) _observationPoints[index].status = status;
    if (x !== undefined) _observationPoints[index].x = x;
    if (y !== undefined) _observationPoints[index].y = y;
    if (type !== undefined) _observationPoints[index].type = type;
    
    res.json({ message: '观测点信息已更新', point: _observationPoints[index] });
  } else {
    res.status(404).json({ error: '观测点不存在' });
  }
});

app.put('/api/season-prices/:id', (req, res) => {
  const index = _seasonPrices.findIndex(s => s.id === req.params.id);
  
  if (index !== -1) {
    const { name, basePrice, pointMultiplier, months } = req.body;
    
    if (name !== undefined) _seasonPrices[index].name = name;
    if (basePrice !== undefined) _seasonPrices[index].basePrice = basePrice;
    if (pointMultiplier !== undefined) _seasonPrices[index].pointMultiplier = pointMultiplier;
    if (months !== undefined) _seasonPrices[index].months = months;
    
    res.json({ message: '季节价格已更新', seasonPrice: _seasonPrices[index] });
  } else {
    res.status(404).json({ error: '季节价格不存在' });
  }
});

app.get('/api/stats/dashboard', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  const todayBookings = _bookings.filter(b => b.date === today && b.status === 'confirmed');
  
  const availablePoints = _observationPoints.filter(p => p.status === 'available').length;
  const bookedTodayPoints = new Set(todayBookings.map(b => b.pointId)).size;
  const vacantPoints = availablePoints - bookedTodayPoints;
  
  const totalRevenue = _bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  
  const totalBookings = _bookings.filter(b => b.status === 'confirmed').length;
  
  const recentBookings = _bookings
    .filter(b => b.status === 'confirmed')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  
  res.json({
    today: {
      date: today,
      bookingCount: todayBookings.length,
      vacantPoints,
      totalPoints: availablePoints
    },
    overall: {
      totalBookings,
      totalRevenue,
      totalEquipment: _equipment.filter(e => e.status === 'active').length,
      totalPoints: availablePoints
    },
    recentBookings
  });
});

app.get('/api/price/calculate', (req, res) => {
  const { date, pointId } = req.query;
  
  if (!date || !pointId) {
    return res.status(400).json({ error: '缺少必要参数' });
  }
  
  const price = calculateTotalPrice(date, pointId, []);
  const season = getCurrentSeasonPrice(date);
  
  res.json({
    date,
    pointId,
    season: season.name,
    basePrice: price,
    currency: 'CNY'
  });
});

app.listen(PORT, () => {
  console.log(`天文台预约系统后端服务已启动，运行在端口 ${PORT}`);
  console.log(`API 地址: http://localhost:${PORT}/api`);
});
