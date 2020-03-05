import React, { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import Portal from './Portal';

import { IModalProps } from './Types';

import { useRootData } from '../../hooks/useRootData';

import './Modal.scss';

const Modal: React.FC<IModalProps> = ({ background, cancelAction, children, classSpecifier, visible }): JSX.Element => {
  const {
    isModalOpen,
    setAccessModal,
    setError,
    setModal,
    setProvider,
    setWalletName,
    setZkWallet,
    walletName,
    zkWallet,
  } = useRootData(
    ({
      isModalOpen,
      setAccessModal,
      setError,
      setModal,
      setProvider,
      setWalletName,
      setZkWallet,
      walletName,
      zkWallet,
    }) => ({
      isModalOpen: isModalOpen.get(),
      setAccessModal,
      setError,
      setModal,
      setProvider,
      setWalletName,
      setZkWallet,
      walletName: walletName.get(),
      zkWallet: zkWallet.get(),
    }),
  );

  const myRef = useRef<HTMLDivElement>(null);
  const body = document.querySelector('body');
  const history = useHistory();

  useEffect(() => {
    if (body) {
      isModalOpen ? body.classList.add('fixed') : body.classList.remove('fixed');
    }
  });

  const handleClickOutside = useCallback(
    e => {
      if (e.target.getAttribute('data-name')) {
        e.stopPropagation();
        setModal('');
        setError('');
      }
    },
    [setError, setModal],
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [handleClickOutside]);

  return (
    <>
      {(classSpecifier === isModalOpen || visible) && (
        <Portal>
          <div ref={myRef} className={`modal ${classSpecifier} open`}>
            <button
              onClick={() => {
                if (cancelAction) {
                  cancelAction();
                } else {
                  setModal('');
                }
                if (!zkWallet && walletName === 'Metamask') {
                  setProvider(null);
                  setWalletName('');
                  setAccessModal(false);
                  setZkWallet(null);
                  history.push('/');
                  setModal('');
                }
              }}
              className="close-icon"
            ></button>
            {children}
          </div>
          <div
            data-name="modal-wrapper"
            className={`modal-wrapper ${
              (classSpecifier === isModalOpen && background) || (visible && background) ? 'open' : 'closed'
            }`}
          ></div>
        </Portal>
      )}
    </>
  );
};

export default Modal;
