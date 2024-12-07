import { useState } from 'react';

const PasswordInput = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="form-control w-full">
      <div className="relative">
        <input
          type={passwordVisible ? 'text' : 'password'}
          placeholder="パスワード"
          className="input input-bordered w-full"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
        >
          {passwordVisible ? (
            <span className="material-icons">visibility_off</span>
          ) : (
            <span className="material-icons">visibility</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
