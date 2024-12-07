import Modal from '../shared/Modal';
import PasswordInput from '../shared/PasswordInput';

const SignupModal = () => {
  const loginModalHandler = () => {
    const signupDialog = document.getElementById(
      'signup_modal'
    ) as HTMLDialogElement;
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
        <div className="flex flex-col gap-2 w-80 mb-4">
          <input
            type="text"
            placeholder="姓"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            placeholder="名"
            className="input input-bordered w-full"
          />
          <input
            type="email"
            placeholder="メール"
            className="input input-bordered w-full"
          />
          <PasswordInput />
        </div>
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
};

export default SignupModal;
