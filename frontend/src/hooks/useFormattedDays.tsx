import { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';

import { Day } from '../types/api';

type FormattedDay = Day & {
  dateFormatShort: string;
  dateFormatLong: string;
};

const DATE_FORMAT_LONG = 'MM月DD日dddd';

export const formatDateLong = (date: Dayjs) => {
  return date.format(DATE_FORMAT_LONG);
};

export function useFormattedDays(days: Day[] | undefined): FormattedDay[] {
  return useMemo(() => {
    if (!days || !Array.isArray(days)) return [];

    return days.map((day) => {
      const dateObj = dayjs(day.date).locale('ja');

      // 例: 11/18 (月)
      const dateFormatShort = dateObj.format('MM/DD (dd)');

      // 例: 11月18日月曜日
      const dateFormatLong = formatDateLong(dateObj);

      return {
        ...day,
        dateFormatShort,
        dateFormatLong,
      } as FormattedDay;
    });
  }, [days]);
}
