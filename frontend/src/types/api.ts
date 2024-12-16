import { Flight, Hotel } from '../utils/plan';

export type Place = {
  id: string | number;
  name: string;
  google_place_id: string;
  link: string;
  start_time: Date | string;
  end_time: Date | string;
  notes: string;
};

export type Day = {
  id: string | number;
  date: Date | string;
  places: Array<Place>;
};

export type Itinerary = {
  days: Array<Day>;
  start_date: string | Date;
  end_date: string | Date;
};

export type Plan = {
  id: string;
  user_ids: Array<string | number>;
  title: string;
  is_public: boolean;
  places: Array<Place>;
  itinerary: Itinerary;
  flights: Array<Flight>;
  hotels: Array<Hotel>;
};
