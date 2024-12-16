import { memo } from 'react';
import { Place } from '../../types/api';
import MarkerIcon from '../shared/MarkerIcon';

type Props = {
  place: Place;
  index: number;
};

const areEqual = (prev: Props, next: Props) => {
  if (prev.index !== next.index) {
    return false;
  }

  const prevPlace = prev.place;
  const nextPlace = next.place;

  if (prevPlace !== nextPlace) {
    return false;
  }

  let placeKey: keyof Place;

  for (placeKey in prevPlace) {
    if (prevPlace[placeKey] !== nextPlace[placeKey]) {
      return false;
    }
  }

  return true;
};

const PlaceCard = memo(({ place, index }: Props) => {
  return (
    <div className="flex w-full">
      <div className="card bg-base-200 w-full">
        <div className="card-body flex flex-col p-4">
          <div className="flex gap-2 items-center">
            <MarkerIcon number={index} />
            <h3 className="font-semibold">{place.name}</h3>
          </div>
          <textarea
            className="textarea textarea-ghost w-full"
            placeholder="ここに何でも書き込んでください。"
          ></textarea>
        </div>
      </div>
    </div>
  );
}, areEqual);

export default PlaceCard;
