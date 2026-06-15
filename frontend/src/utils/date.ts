export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

export function getWeekday(dateStr: string): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const date = new Date(dateStr);
  return weekdays[date.getDay()];
}

export function getSuitabilityColor(suitability: string): string {
  switch (suitability) {
    case 'excellent':
      return 'text-starlight-400';
    case 'good':
      return 'text-emerald-400';
    case 'fair':
      return 'text-cosmos-400';
    case 'poor':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}

export function getSuitabilityBg(suitability: string): string {
  switch (suitability) {
    case 'excellent':
      return 'bg-starlight-500/20 border-starlight-500/50';
    case 'good':
      return 'bg-emerald-500/20 border-emerald-500/50';
    case 'fair':
      return 'bg-cosmos-500/20 border-cosmos-500/50';
    case 'poor':
      return 'bg-red-500/20 border-red-500/50';
    default:
      return 'bg-gray-500/20 border-gray-500/50';
  }
}

export function getSuitabilityLabel(suitability: string): string {
  switch (suitability) {
    case 'excellent':
      return '极佳';
    case 'good':
      return '良好';
    case 'fair':
      return '一般';
    case 'poor':
      return '较差';
    default:
      return '未知';
  }
}

export function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const firstDayOfWeek = firstDay.getDay();
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(firstDay);
    d.setDate(d.getDate() - i - 1);
    days.push(d);
  }
  
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(lastDay);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  
  return days;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

export function formatPrice(price: number): string {
  return `¥${price}`;
}
