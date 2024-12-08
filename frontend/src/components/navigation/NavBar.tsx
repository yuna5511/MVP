import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';

const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const signupModalHandler = () =>
    (document.getElementById('signup_modal') as HTMLDialogElement).showModal();
  const loginModalHandler = () =>
    (document.getElementById('login_modal') as HTMLDialogElement).showModal();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="navbar bg-base-300">
      <div className="navbar-start flex-none">
        <button className="btn btn-ghost text-2xl">tabishare</button>
        <button className="btn btn-ghost font-medium">人気の旅行計画</button>
        <button className="btn btn-ghost font-medium">人気の旅行地</button>
      </div>
      <div className="navbar-end">
        <div className="flex-none">
          {isAuthenticated ? (
            <div className="flex items-center">
              <span className="mr-4">{`こんにちは、${user?.lastName}さん`}</span>{' '}
              <button
                className="btn btn-neutral font-medium"
                onClick={handleLogout}
              >
                ログアウト
              </button>
            </div>
          ) : (
            <>
              <button
                className="btn btn-ghost font-medium"
                onClick={loginModalHandler}
              >
                ログイン
              </button>
              <button className="btn btn-neutral" onClick={signupModalHandler}>
                サインアップ
              </button>
            </>
          )}
        </div>
      </div>
      <SignupModal />
      <LoginModal />
    </div>
  );
};

export default NavBar;
