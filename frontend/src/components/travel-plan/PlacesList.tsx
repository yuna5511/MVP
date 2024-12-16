import { Place } from '../../types/api';
import PlaceCard from './PlaceCard';
import PlaceAutocomplete from '../shared/PlaceAutocomplete';

type Props = {
  list: Array<Place>;
  planId?: string | number;
  dayId?: string | number;
};

const PlacesList = ({ list, planId, dayId }: Props) => {
  return (
    <div className="flex flex-col w-full gap-3">
      {list?.map((place, idx) => (
        <PlaceCard index={idx + 1} key={`place-${place.id}`} place={place} />
      ))}
      <PlaceAutocomplete planId={planId} dayId={dayId} />
    </div>
  );
};

export default PlacesList;
