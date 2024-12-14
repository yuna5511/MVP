import { useMemo } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

import { Day } from '../types/api';

type FormattedDay = Day & {
  dateFormatShort: string;
  dateFormatLong: string;
};

export function useFormattedDays(days: Day[] | undefined): FormattedDay[] {
  return useMemo(() => {
    if (!days || !Array.isArray(days)) return [];

    return days.map((day) => {
      const dateObj = dayjs(day.date).locale('ja');

      // 例: 11/18 (月)
      const dateFormatShort = dateObj.format('MM/DD (dd)');

      // 例: 11月18日月曜日
      const dateFormatLong = dateObj.format('MM月DD日dddd');

      return {
        ...day,
        dateFormatShort,
        dateFormatLong,
      } as FormattedDay;
    });
  }, [days]);
}
