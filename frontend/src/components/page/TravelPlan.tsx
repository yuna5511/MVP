import { useParams, useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from '../shared/PageLayout';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Plan } from '../../types/api';
import PlanModal from '../navigation/PlanModal';
import { getPlan } from '../../utils/plan';
import PlanLayout from '../travel-plan/PlanLayout';

const TravelPlan = () => {
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { planId } = useParams<string>();
  const location = useLocation();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan | null>(location.state?.plan || null);
  const [loading, setLoading] = useState(true);

  const handleSetPlan = (plan: Plan) => setPlan(plan);

  const fetchPlan = async () => {
    if (!plan) {
      try {
        const response = await getPlan(planId as string);
        setPlan(response.data.plan);
      } catch (error) {
        setLoading(false);
        showToast('プランの取得に失敗しました', 'error');
        if (axios.isAxiosError(error)) {
          console.error('API error:', error.response?.data || error.message);
        } else {
          console.error('Unexpected error:', error);
        }
      }
    }
  };

  useEffect(() => {
    if (!plan) {
      fetchPlan().catch(console.error);
    }
  }, [plan]);

  useEffect(() => {
    const planDialog = document.getElementById(
      'plan_modal'
    ) as HTMLDialogElement;
    if (plan) {
      if (plan.user_ids.length === 0) {
        setLoading(false);
        if (isAuthenticated && user) {
          planDialog.showModal();
        }
      } else {
        if (!isAuthenticated || (user && !plan.user_ids.includes(user?.id))) {
          navigate('/');
        } else {
          setLoading(false);
        }
      }
    }
  }, [plan, isAuthenticated, user, navigate]);

  return (
    <PageLayout>
      {loading && (
        <div className="flex w-full h-full justify-center items-center gap-2">
          <span className="loading loading-spinner"></span>
          <span>ロード中...</span>
        </div>
      )}
      {!loading && plan && <PlanLayout plan={plan} />}
      <PlanModal handleSetPlan={handleSetPlan} plan={plan} />
    </PageLayout>
  );
};

export default TravelPlan;
