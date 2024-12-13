import { useParams, useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from '../shared/PageLayout';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Plan } from '../../types/api';
import PlanModal from '../navigation/PlanModal';

const TravelPlan = () => {
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { planId } = useParams<string>();
  const location = useLocation();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan | null>(location.state?.plan || null);
  const [loading, setLoading] = useState(false);

  const handleSetPlan = (plan: Plan) => setPlan(plan);

  const fetchPlan = async () => {
    if (!plan) {
      try {
        const response = await axios.get(`/api/plans/${planId}`);
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
      if (plan.userIds.length === 0) {
        if (isAuthenticated && user) {
          planDialog.showModal();
        }
      } else {
        if (
          !isAuthenticated ||
          (user && !plan.userIds.includes((user?.id).toString()))
        ) {
          navigate('/');
        }
      }
    }
  }, [plan, isAuthenticated, user, navigate]);

  return (
    <PageLayout>
      {loading && (
        <div>
          <span className="loading loading-spinner"></span> ロード中...
        </div>
      )}
      <h1>{plan?.title}</h1>
      <PlanModal handleSetPlan={handleSetPlan} plan={plan} />
    </PageLayout>
  );
};

export default TravelPlan;
