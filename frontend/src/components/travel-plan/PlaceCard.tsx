import { memo, useState, useRef } from 'react';
import { Place } from '../../types/api';
import MarkerIcon from '../shared/MarkerIcon';
import axios from 'axios';
import { usePlanStore, StateAction } from '../../stores/planStore';

type Props = {
  place: Place;
  index: number;
  dayId?: string | number;
  planId?: string | number;
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

const PlaceCard = memo(({ place, index, planId, dayId }: Props) => {
  const [value, setValue] = useState(place.notes);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const updateDayPlaces = usePlanStore((state) => state.updateDayPlaces);
  const updatePlanPlaces = usePlanStore((state) => state.updatePlanPlaces);

  const updateNotes = async (input: string) => {
    if (!input) {
      return;
    }

    try {
      const response = await axios.patch(`/api/places/${place.id}`, {
        place: {
          notes: input,
        },
      });

      if (response.data.success) {
        if (planId) {
          updatePlanPlaces(response.data.place, StateAction.UPDATE);
        } else if (dayId) {
          updateDayPlaces(dayId, response.data.place, StateAction.UPDATE);
        }
      }
    } catch (error) {
      console.error('/api/placesエラー:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValue(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => updateNotes(value), 500);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/places/${place.id}`);
      if (response.data.success) {
        if (planId) {
          updatePlanPlaces(place, StateAction.REMOVE);
        } else if (dayId) {
          updateDayPlaces(dayId, place, StateAction.REMOVE);
        }
      }
      console.log('成功:', response.data.message);
    } catch (error) {
      console.error('Failed to delete the place:', error);
    }
  };

  return (
    <div className="flex w-full">
      <div className="card bg-base-200 w-full">
        <div className="card-body flex flex-col p-4">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <MarkerIcon number={index} />
              <h3 className="font-semibold">{place.name}</h3>
            </div>
            <button className="btn btn-ghost btn-square" onClick={handleDelete}>
              <span className="material-icons">delete</span>
            </button>
          </div>
          <textarea
            className="textarea textarea-ghost w-full"
            placeholder="ここに何でも書き込んでください。"
            value={value}
            onChange={handleInputChange}
          ></textarea>
        </div>
      </div>
    </div>
  );
}, areEqual);

export default PlaceCard;
