import { memo, useMemo } from 'react';
import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: string;
  type: 'balance' | 'income' | 'expense';
  positive?: boolean;
}

const StatsCard = memo(({ title, value, type, positive = true }: StatsCardProps) => {
  const icon = useMemo(() => {
    switch (type) {
      case 'balance':
        return '💰';
      case 'income':
        return '📈';
      case 'expense':
        return '📉';
      default:
        return '💵';
    }
  }, [type]);

  return (
    <div className={`stats-card stats-card-${type} ${!positive ? 'negative' : ''}`}>
      <div className="stats-card-icon">{icon}</div>
      <div className="stats-card-content">
        <h3>{title}</h3>
        <p className="stats-card-value">{value}</p>
      </div>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;

