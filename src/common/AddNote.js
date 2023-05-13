import React, { useEffect, useState } from "react";
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

const AddNote = ({
  modalIsOpen,
  closeModal,
  handleNoteSubmit,
  currentNote,
}) => {
  const [noteDetail, setNoteDetail] = useState({
    title: currentNote ? currentNote.title : "",
    body: currentNote ? currentNote.body : "",
  });

  const [errors, setErrors] = useState();

  const formValidation = () => {
    let isValid = true;
    const fields = ["title", "body"];
    setErrors({
      title: "",
      body: "",
    });
    for (let x of fields) {
      if (noteDetail[x] === "") {
        isValid = false;
        setErrors((errors) => ({
          ...errors,
          [x]: "Above field is required",
        }));
      }
    }
    return isValid;
  };

  /**
   * Handle on change function of input fields
   * @param {*} e
   */
  const handleOnChange = (event) => {
    setNoteDetail({
      ...noteDetail,
      [event.target.name]: event.target.value,
    });
    if (!event.target.value) {
      setErrors({
        ...errors,
        [event.target.name]: "Above field is required",
      });
    }
  };

  /**
   * Handle from submit function
   * @param {*} e
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formValidation()) {
      return false;
    }
    handleNoteSubmit(noteDetail);
    setNoteDetail({
      title: "",
      body: "",
    });
  };

  useEffect(() => {
    if (currentNote) {
      setNoteDetail(currentNote);
    } else {
      setNoteDetail({
        title: "",
        body: "",
      });
    }
  }, [currentNote]);

  return (
    <div className="modal_main">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={currentNote ? "Edit Note" : "Add Note"}
      >
        <button
          className="modal-close-button"
          onClick={() => {
            closeModal();
            setErrors({});
          }}
        >
          <span>&times;</span>
        </button>
        <h2 className="modal-title">
          {currentNote ? "Edit Note" : "Add Note"}
        </h2>
        <form className="modal-form" onSubmit={handleFormSubmit}>
          <div className="form-field">
            <label htmlFor="title" className="modal-label">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={noteDetail.title ?? ""}
              onChange={handleOnChange}
              className="modal-input"
            />
            {errors?.title ? <div className="error">{errors.title}</div> : ""}
          </div>
          <div className="form-field">
            <label htmlFor="body" className="modal-label">
              Body:
            </label>
            <textarea
              id="body"
              name="body"
              value={noteDetail.body ?? ""}
              onChange={handleOnChange}
              className="modal-textarea"
            ></textarea>
            {errors?.body ? <div className="error">{errors.body}</div> : ""}
          </div>

          <div className="button_btn">
            <button type="submit" className="modal-submit-button">
              {currentNote ? "Update" : "Add"} Note
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddNote;
