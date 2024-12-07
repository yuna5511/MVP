import { useState } from 'react';
import PageLayout from '../shared/PageLayout';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import ListInput from '../shared/ListInput';

const Home = () => {
  const [dateRange, setDateRange] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center mx-auto">
        <h2 className="text-3xl font-semibold mb-8">新しい旅行を計画する</h2>
        <div className="flex flex-col w-[400px]">
          <ListInput className="mb-4" label="どこへ行く?" />
          <span className="text-[14px] font-semibold py-2 px-1">日付</span>
          <Datepicker
            i18n={'ja'}
            value={dateRange}
            onChange={(newDateRange) => setDateRange(newDateRange)}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
