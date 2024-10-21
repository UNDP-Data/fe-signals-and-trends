import { useContext } from 'react';
import { TrendCard } from '../../Components/TrendCard';
import Context from '../../Context/Context';

export function CardList() {
  const { trendList } = useContext(Context);
  if (trendList)
    return (
      <>
        {trendList.map((d, i) => (
          <TrendCard key={i} data={d} forAllTrends />
        ))}
      </>
    );
  return null;
}
