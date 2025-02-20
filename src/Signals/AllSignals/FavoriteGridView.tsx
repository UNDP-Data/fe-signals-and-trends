import { useContext } from 'react';
import { FavoriteCard } from '../../Components/FavoriteCard';
import Context from '../../Context/Context';

export function FavoriteCardList() {
  const { signalList } = useContext(Context);

  if (signalList) {
    const favoriteSignals = signalList.filter(
      signal => signal.favorite === true,
    );

    return (
      <>
        {favoriteSignals.map((d, i) => (
          <FavoriteCard data={d} key={i} />
        ))}
      </>
    );
  }

  return null;
}
