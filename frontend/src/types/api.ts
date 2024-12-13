export type Place = {
  name: string;
  googlePlaceId: string;
  link: string;
  startTime: Date;
  endTime: Date;
};

export type Day = {
  date: Date;
  places: Array<Place>;
};

export type Itinerary = {
  days: Array<Day>;
};

export type Plan = {
  id: string;
  userIds: Array<string>;
  title: string;
  isPublic: boolean;
  places: Array<Place>;
  itinerary: Itinerary;
};
