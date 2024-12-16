import { useState, ChangeEvent, FormEvent } from 'react';
import Modal from '../shared/Modal';
import PasswordInput from '../shared/PasswordInput';
import { useAuth } from '../../context/AuthContext';
import {
  emailValidator,
  existsValidator,
  joinErrors,
} from '../../utils/validator';
import { useToast } from '../../context/ToastContext';

const LoginModal = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const signupDialog = document.getElementById(
    'signup_modal'
  ) as HTMLDialogElement;
  const loginDialog = document.getElementById(
    'login_modal'
  ) as HTMLDialogElement;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const joinedValidationError = joinErrors([
      emailValidator(formData.email),
      existsValidator(formData.password, 'パスワード'),
    ]);
    if (joinedValidationError?.length) {
      setError(joinedValidationError);
      setLoading(false);
      return;
    }
    try {
      await login(formData.email, formData.password);
      loginDialog?.close();
      showToast('ログイン成功', 'success');
      setLoading(false);
    } catch (err: any) {
      setError(err.message || '無効なメールアドレスまたはパスワード');
      setLoading(false);
    }
  };

  const signupModalHandler = () => {
    loginDialog?.close();
    signupDialog?.showModal();
  };

  return (
    <Modal id="login_modal">
      <div className="modal-box pt-14 px-14 pb-6 w-full flex flex-col items-center">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg text-center mb-9">
          tabishareにログイン
        </h3>
        <div className="flex flex-col gap-2 w-full mb-9">
          <input
            type="email"
            name="email"
            placeholder="メール"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={handleInputChange}
          />
          <PasswordInput
            value={formData.password}
            onValueChange={handleInputChange}
          />
          {error && <p className="text-error">{error}</p>}
          <div className="flex justify-center">
            <button
              className="btn btn-neutral w-[140px]"
              onClick={handleSubmit}
              disabled={!!loading}
            >
              {loading && <span className="loading loading-spinner"></span>}
              ログイン
            </button>
          </div>
        </div>
        <div className="flex font-normal items-center">
          <span className="text-nowrap">
            アカウントをお持ちではありませんか？
          </span>
          <button
            className="btn btn-ghost font-semibold"
            onClick={signupModalHandler}
          >
            サインアップ
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
