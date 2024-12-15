import { Itinerary } from '../../types/api';
import DayPanel from './DayPanel';
import CalendarButton from '../shared/CalendarButton';

type Props = {
  itinerary: Itinerary;
  itineraryRef: any;
};

const ItineraryLayout = ({ itinerary, itineraryRef }: Props) => {
  return (
    <div
      ref={itineraryRef}
      className="flex flex-col items-center px-14 gap-4 w-full"
    >
      <div className="flex justify-between w-full">
        <h1 className="font-bold text-3xl">旅程</h1>
        <CalendarButton
          startDate={itinerary.start_date}
          endDate={itinerary.end_date}
        />
      </div>
      {itinerary.days.map((day) => (
        <DayPanel key={`day-${day.id}`} day={day} />
      ))}
    </div>
  );
};

export default ItineraryLayout;
