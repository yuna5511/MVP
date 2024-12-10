import { useState, FormEvent, ChangeEvent, memo } from 'react';
import Modal from '../shared/Modal';
import PasswordInput from '../shared/PasswordInput';
import axios from 'axios';
import {
  existsValidator,
  emailValidator,
  joinErrors,
} from '../../utils/validator';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const SignupModal = memo(() => {
  const { setUserProfile } = useAuth();
  const { showToast } = useToast();
  const signupDialog = document.getElementById(
    'signup_modal'
  ) as HTMLDialogElement;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const firstNameError = existsValidator(formData.firstName, '姓', 2);
    const lastNameError = existsValidator(formData.lastName, '名', 2);
    const emailError = emailValidator(formData.email);
    const passwordError = existsValidator(formData.password, 'パスワード', 8);

    const joinedValidationError = joinErrors([
      firstNameError,
      lastNameError,
      emailError,
      passwordError,
    ]);
    if (joinedValidationError?.length) {
      setError(joinedValidationError);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        '/api/signup',
        {
          user: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setLoading(false);
      if (response.status === 201) {
        const { user, token } = response.data;
        sessionStorage.setItem('token', token);
        setUserProfile(user);
        signupDialog?.close();
        showToast('登録完了しました', 'success');
      }
    } catch (err: any) {
      setLoading(false);
      if (err.response && err.response.data) {
        setError(err.response.data.message || '登録失敗しました。');
      } else {
        setError('登録中にエラーが発生しました。');
      }
    }
  };

  const loginModalHandler = () => {
    const loginDialog = document.getElementById(
      'login_modal'
    ) as HTMLDialogElement;
    signupDialog?.close();
    loginDialog?.showModal();
  };
  return (
    <Modal id="signup_modal">
      <div className="modal-box pt-14 px-14 pb-6 w-full flex-col align-center">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex justify-center mb-9">
          <h3 className="font-bold text-lg">
            サインアップして旅行計画を
            <br />
            次のレベルに進めましょう
          </h3>
        </div>
        <form className="flex flex-col gap-2 w-80 mb-4">
          <input
            type="text"
            name="firstName"
            placeholder="姓"
            className="input input-bordered w-full"
            onChange={handleInputChange}
            disabled={!!loading}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="名"
            className="input input-bordered w-full"
            onChange={handleInputChange}
            disabled={!!loading}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="メールアドレス"
            className="input input-bordered w-full"
            onChange={handleInputChange}
            disabled={!!loading}
            required
          />
          <PasswordInput
            value={formData.password}
            onValueChange={handleInputChange}
            disabled={!!loading}
          />
          {!loading && error && <p className="text-error">{error}</p>}

          <div className="flex justify-center">
            <button
              className="btn btn-neutral w-[120px]"
              onClick={handleSubmit}
              disabled={!!loading}
            >
              {loading && <span className="loading loading-spinner"></span>}
              登録
            </button>
          </div>
        </form>
        <div className="font-medium">
          <span>既にアカウントをお持ちですか？</span>
          <button
            className="btn btn-ghost font-semibold"
            onClick={loginModalHandler}
          >
            ログイン
          </button>
        </div>
      </div>
    </Modal>
  );
});

export default SignupModal;
