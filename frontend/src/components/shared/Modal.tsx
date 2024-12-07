import React from 'react';

const Modal = ({ children, id }: { children: React.ReactNode; id: string }) => {
  return (
    <dialog id={id} className="modal justify-center align-center">
      {children}
    </dialog>
  );
};

export default Modal;
