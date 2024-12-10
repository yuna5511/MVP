import { useState, useCallback, useEffect } from 'react';
import PageLayout from '../shared/PageLayout';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import ListInput from '../shared/ListInput';
import { emailValidator, locationValidator } from '../../utils/validator';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [dateRange, setDateRange] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  const [destinations, setDestinations] = useState<string[]>([]);

  // ListInputの再レンダリングを防ぐために関数をメモ化
  const handleDestinationsChange = useCallback((updatedItems: string[]) => {
    setDestinations(updatedItems);
  }, []);

  const [showInviteInput, setShowInviteInput] = useState(false);
  const toggle = useCallback(() => setShowInviteInput(true), []);
  const [invites, setInvites] = useState<string[]>([]);

  // ListInputの再レンダリングを防ぐために関数をメモ化
  const handleInvitesChange = useCallback((updatedItems: string[]) => {
    setInvites(updatedItems);
  }, []);

  const handleSubmit = async () => {
    try {
      if (dateRange) {
        const userIds = isAuthenticated ? [user?.id, ...invites] : null;
        const response = await axios.post('/api/plans', {
          plan: {
            user_ids: userIds,
            start_date: dateRange.startDate,
            end_date: dateRange.endDate,
            places: destinations,
          },
        });
        console.log('Plan created successfully', response.data);
        showToast('Successfully created plan', 'success');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  useEffect(() => {
    setInvites([]);
  }, [isAuthenticated]);

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center mx-auto">
        <h2 className="text-3xl font-semibold mb-8">新しい旅行を計画する</h2>
        <div className="flex flex-col w-[400px] gap-6">
          <ListInput
            label="どこへ行く?"
            items={destinations}
            onItemsChange={handleDestinationsChange}
            placeholder="例：東京、ソウル、ロサンゼルス"
            validator={locationValidator}
          />
          <div>
            <span className="text-[14px] font-semibold py-2 px-1">日付</span>
            <Datepicker
              i18n={'ja'}
              value={dateRange}
              onChange={(newDateRange) => setDateRange(newDateRange)}
            />
          </div>
          {isAuthenticated && (
            <div>
              {!showInviteInput ? (
                <button
                  className="btn btn-ghost font-medium p-0"
                  onClick={toggle}
                >
                  <span className="material-icons">add</span>旅行仲間を招待する
                </button>
              ) : (
                <ListInput
                  label="旅行仲間を招待する"
                  items={invites}
                  onItemsChange={handleInvitesChange}
                  placeholder="メールアドレスを入力する"
                  validator={emailValidator}
                />
              )}
            </div>
          )}
          <div className="flex justify-center">
            <button
              className="btn btn-neutral w-[120px]"
              onClick={handleSubmit}
            >
              計画を始める
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
