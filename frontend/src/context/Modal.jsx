import { useRef, useState, useContext, createContext } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  // callback function that will be called when modal is closing
  const [onModalClose, setOnModalClose] = useState(null);
  // const [modalClosing, setModalClosing] = useState(false)

  const closeModal = () => {
    const modalDiv = document.getElementById('modal-content')
    const modalBg = document.getElementById('modal-background')
    if(modalDiv.classList.contains('modalClosing')) return
    modalDiv.classList.add('modalClosing')
    modalBg.classList.add('modalBgClosing')
    
    setTimeout(()=>{
      setModalContent(null); // clear the modal contents
      setTimeout(()=>{
        modalDiv.classList.remove('modalClosing')
        modalBg.classList.remove('modalBgClosing')
      }, 50)
      // If callback function is truthy, call the callback function and reset it
      // to null:
      if (typeof onModalClose === 'function') {
        setOnModalClose(null);
        onModalClose();
      }
    },150) // fade out animation takes 120ms
  };

  const contextValue = {
    modalRef, // reference to modal div
    modalContent, // React component to render inside modal
    setModalContent, // function to set the React component to render inside modal
    setOnModalClose, // function to set the callback function called when modal is closing
    closeModal // function to close the modal
  };

  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div style={{'zIndex': 1, position:'fixed'}} ref={modalRef} />
    </>
  );
}

export function Modal() {
  const { modalRef, modalContent, closeModal } = useContext(ModalContext);
  // If there is no div referenced by the modalRef or modalContent is not a
  // truthy value, render nothing:
  if (!modalRef || !modalRef.current || !modalContent) return null;

  // Render the following component to the div referenced by the modalRef
  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content">
        {modalContent}
      </div>
    </div>,
    modalRef.current
  );
}

export const useModal = () => useContext(ModalContext);