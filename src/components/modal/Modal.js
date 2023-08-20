// CSS File
import "./Modal.css";

const Modal = ({ children, isOpen, closeModal, className = "" }) => {
  //events
  const handleModalClick = (e) => e.stopPropagation();

  return (
    <div
      className={`modalGeneneric ${className} ${isOpen && "isOpen"}`}
      onClick={closeModal}
    >
      <div className="modalGenenericContainer" onClick={handleModalClick}>
        <div className="modalGenenericContent">
          <div className="modalGenenericClose" onClick={closeModal}>
            X
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
