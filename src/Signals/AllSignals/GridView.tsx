import { useContext } from 'react';
import { SignalCard } from '../../Components/SignalCard';
import Context from '../../Context/Context';

export function CardList() {
  const { signalList } = useContext(Context);
  if (signalList)
    return (
      <>
        {signalList.map((d, i) => (
          <SignalCard data={d} key={i} isDraft={d.status === 'Draft'} />
        ))}
      </>
    );
  return null;
}
