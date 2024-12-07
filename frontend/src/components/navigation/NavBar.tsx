import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const NavBar = () => {
  const signupModalHandler = () =>
    (document.getElementById('signup_modal') as HTMLDialogElement).showModal();
  const loginModalHandler = () =>
    (document.getElementById('login_modal') as HTMLDialogElement).showModal();

  return (
    <div className="navbar bg-base-300">
      <div className="navbar-start flex-none">
        <button className="btn btn-ghost text-2xl">tabishare</button>
        <button className="btn btn-ghost font-medium">人気の旅行計画</button>
        <button className="btn btn-ghost font-medium">人気の旅行地</button>
      </div>
      <div className="navbar-end">
        <div className="flex-none">
          <button
            className="btn btn-ghost font-medium"
            onClick={loginModalHandler}
          >
            ログイン
          </button>
          <button className="btn btn-neutral" onClick={signupModalHandler}>
            サインアップ
          </button>
        </div>
      </div>
      <SignupModal />
      <LoginModal />
    </div>
  );
};

export default NavBar;
