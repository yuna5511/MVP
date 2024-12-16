import React, { useState, useRef } from 'react';
import axios from 'axios';
import { PlanState, usePlanStore, StateAction } from '../../stores/planStore';

type PlaceAutocompleteProps = {
  planId?: string | number;
  dayId?: string | number;
};

type GooglePlace = {
  description: string;
  place_id: string;
};

const PlaceAutocomplete = ({ planId, dayId }: PlaceAutocompleteProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GooglePlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const updateDayPlaces = usePlanStore(
    (state: PlanState) => state.updateDayPlaces
  );
  const updatePlanPlaces = usePlanStore(
    (state: PlanState) => state.updatePlanPlaces
  );

  const fetchPlaces = async (input: string) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`/api/places/autocomplete`, {
        input,
      });

      setSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error('Google Placesの検索エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchPlaces(value), 300);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      const placeToCreate = suggestions[0];
      await createPlace(placeToCreate);
    }
  };

  const handleOnClick = async (place: GooglePlace) => {
    await createPlace(place);
  };

  const createPlace = async (place: GooglePlace) => {
    try {
      const response = await axios.post('/api/places', {
        place: {
          google_place_id: place.place_id,
          name: place.description,
          plan_id: planId || null,
          day_id: dayId || null,
        },
      });
      if (response.data.place) {
        if (planId) {
          updatePlanPlaces(response.data.place, StateAction.ADD);
        } else if (dayId) {
          updateDayPlaces(dayId, response.data.place, StateAction.ADD);
        }
      }

      setQuery('');
      setSuggestions([]);
    } catch (error) {
      console.error('場所の作成エラー:', error);
    }
  };

  return (
    <div className="relative w-full">
      <label className="input input-bordered flex items-center gap-2 w-full">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="場所を追加する"
          className="grow border-none"
        />
        {!query.length ? (
          <span className="material-icons">search</span>
        ) : (
          <button
            className="btn btn-ghost btn-square"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
          >
            <span className="material-icons">close</span>
          </button>
        )}
      </label>

      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border rounded shadow-md mt-2 z-10">
          {suggestions.map((place, idx) => (
            <li
              key={`place-${place.place_id}-${idx}`}
              className="p-2 cursor-pointer hover:bg-teal-100"
              onClick={() => {
                handleOnClick(place);
              }}
            >
              {place.description}
            </li>
          ))}
        </ul>
      )}

      {isLoading && (
        <div className="absolute w-full mt-2 text-center text-gray-500">
          <span className="loading loading-spinner"></span> Loading...
        </div>
      )}
    </div>
  );
};

export default PlaceAutocomplete;
