import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
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
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    if (!destinations?.length) {
      setError('場所を入力してください。');
      return;
    }
    if (!dateRange?.startDate || !dateRange.endDate) {
      setError('日付を入力してください。');
      return;
    }
    try {
      if (dateRange) {
        setLoading(true);
        const userIds = isAuthenticated ? [user?.id, ...invites] : null;
        const response = await axios.post('/api/plans', {
          plan: {
            user_ids: userIds,
            start_date: dateRange.startDate,
            end_date: dateRange.endDate,
            places: destinations,
          },
        });
        setLoading(false);
        showToast('旅行作成に成功', 'success');
        navigate(`/travel-plan/${response.data.plan.id}`, {
          state: { plan: response.data.plan },
        });
      }
    } catch (error) {
      setLoading(false);
      showToast('旅行の提出に失敗', 'error');
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
          {error && (
            <div className="label">
              <span className="label-text-alt text-error">{error}</span>
            </div>
          )}
          <div className="flex justify-center">
            <button
              className="btn btn-neutral w-[160px]"
              onClick={handleSubmit}
              disabled={!!loading}
            >
              {loading && <span className="loading loading-spinner"></span>}
              計画を始める
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
