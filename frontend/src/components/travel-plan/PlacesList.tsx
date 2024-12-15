import { Place } from '../../types/api';
import PlaceCard from './PlaceCard';

type Props = {
  list: Array<Place>;
};

const PlacesList = ({ list }: Props) => {
  return (
    <div className="flex flex-col w-full gap-3">
      {list.map((place, idx) => (
        <PlaceCard index={idx + 1} key={`place-${place.id}`} place={place} />
      ))}
    </div>
  );
};

export default PlacesList;
