import Modal from '../shared/Modal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { Plan } from '../../types/api';
import { updatePlan } from '../../utils/plan';

type Props = {
  plan: Plan | null;
  handleSetPlan: (plan: Plan) => void;
};

const PlanModal = ({ plan, handleSetPlan }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const planDialog = document.getElementById('plan_modal') as HTMLDialogElement;

  const handleAddUserToPlan = async () => {
    if (user && plan) {
      try {
        const response = await updatePlan({
          id: plan.id,
          body: {
            user_ids: [...plan.userIds, user.id],
          },
        });
        handleSetPlan(response.data.plan);
        planDialog.close();
        showToast('あなたがオーナーとしてプランに追加されました！', 'success');
      } catch (error) {
        console.error('Error adding user to plan:', error);
        showToast('ユーザーをプランに追加できませんでした。', 'error');
      }
    }
  };

  const handleRedirect = () => {
    planDialog.close();
    navigate('/');
  };
  return (
    <Modal id="plan_modal">
      <div className="modal-box pt-14 px-14 pb-6 w-full flex flex-col items-center">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleRedirect}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg text-center mb-9">
          このプランのオーナーとして追加しますか？
        </h3>
        <div className="flex gap-2 w-full mb-9 justify-center">
          <button
            className="btn btn-primary font-semibold"
            onClick={handleAddUserToPlan}
          >
            はい
          </button>
          <button
            className="btn btn-ghost font-semibold"
            onClick={handleRedirect}
          >
            いいえ
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PlanModal;
