import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "400px",
    padding: "20px",
  },
};

const NoteDetail = ({ modalIsOpen, closeModal, currentNote }) => {
  return (
    <div className="modal_main">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={currentNote ? "Edit Note" : "Add Note"}
      >
        <button className="modal-close-button" onClick={closeModal}>
          <span>&times;</span>
        </button>
        <h2 className="modal-title">{currentNote?.title ?? ""}</h2>
        <div className="modal-body">
          <label>
            <b>Body : </b>
          </label>
          <p>{currentNote?.body ?? ""}</p>
        </div>
      </Modal>
    </div>
  );
};

export default NoteDetail;
