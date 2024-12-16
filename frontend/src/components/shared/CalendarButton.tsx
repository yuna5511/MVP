import dayjs from 'dayjs';
import 'dayjs/locale/ja';

type Props = {
  startDate: string | Date;
  endDate: string | Date;
};

// TODO: モーダル・コンポーネント
const CalendarButton = ({ startDate, endDate }: Props) => {
  const formattedRange = () => {
    const formattedStart = dayjs(startDate).locale('ja').format('MM/DD');
    const formattedEnd = dayjs(endDate).locale('ja').format('MM/DD');

    return `${formattedStart} - ${formattedEnd}`;
  };
  return (
    <button className="btn bg-base-200 rounded-full">
      <span className="material-icons">calendar_month</span>
      {formattedRange()}
    </button>
  );
};

export default CalendarButton;
