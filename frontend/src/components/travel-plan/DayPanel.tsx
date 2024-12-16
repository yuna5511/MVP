import ExpandPanel from '../shared/ExpandPanel';
import PlacesList from './PlacesList';
import { formatDateLong } from '../../hooks/useFormattedDays';
import { Day } from '../../types/api';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

type Props = {
  day: Day;
};

const DayPanel = ({ day }: Props) => {
  const title = formatDateLong(dayjs(day.date).locale('ja'));
  const getCollapsedDescription = () => {
    if (day?.places && day?.places.length > 0) {
      return day.places.map((place) => place.name).join('、');
    }
    return '場所なし';
  };

  return (
    <ExpandPanel title={title} collapsedDescription={getCollapsedDescription()}>
      <PlacesList list={day?.places} dayId={day.id} />
    </ExpandPanel>
  );
};

export default DayPanel;
