import DayPanel from './DayPanel';
import CalendarButton from '../shared/CalendarButton';
import { usePlanStore } from '../../stores/planStore';

type Props = {
  itineraryRef: any;
};

const ItineraryLayout = ({ itineraryRef }: Props) => {
  const itinerary = usePlanStore((state) => state.plan?.itinerary);

  if (!itinerary) return null;

  return (
    <div
      ref={itineraryRef}
      className="flex flex-col items-center px-14 gap-4 w-full"
    >
      <div className="flex justify-between w-full max-w-[640px]">
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
