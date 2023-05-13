import React, { useEffect, useState } from "react";
import AddNote from "../common/AddNote";
import Swal from "sweetalert2";
import { uid } from "../helper";
import NoteDetail from "../common/NoteDetail";
import moment from "moment";

const Notes = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortNote, setSortNote] = useState("asc");
  const [search, setSearch] = useState("");

  const toggleDetailModal = (note) => {
    setIsDetailOpen(!isDetailOpen);
    if (isDetailOpen) {
      setCurrentNote(null);
    } else {
      setCurrentNote(note);
    }
  };

  /**
   * Handle function for OPening my add Modal
   */
  const openModal = () => {
    setIsOpen(true);
    setCurrentNote(null);
  };

  /**
   * Handle function for Closing he modal
   */
  const closeModal = () => {
    setIsOpen(false);
  };

  /**
   * Handle submit function of this
   * @param {*} note
   */
  const handleNoteSubmit = (note) => {
    if (currentNote) {
      // Update existing note
      const updatedNotes = notes.map((n) =>
        n.id === currentNote.id ? note : n
      );
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    } else {
      // Create new note
      const newNote = { ...note, date: Date.now(), id: uid() };
      const notesCopy = [...notes, newNote];
      setNotes([...notesCopy]);
      localStorage.setItem("notes", JSON.stringify(notesCopy));
    }
    closeModal();
  };

  /**
   * Function for making Notes Editable
   * @param {*} note
   */
  const handleEditNoteClick = (note) => {
    setCurrentNote(note);
    setIsOpen(true);
  };

  /**
   * Function for delete the Note
   * @param {*} id
   */
  const handleDeleteNoteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
      }
    });
  };

  /**
   * Handle sorting by title and date
   * @param {*} columnName
   */
  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      setSortNote(sortNote === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortNote("asc");
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    const notesList = localStorage.getItem("notes");
    if (notesList) {
      const sortedData = [...JSON.parse(notesList)].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) {
          return sortNote === "asc" ? -1 : 1;
        } else if (a[sortColumn] > b[sortColumn]) {
          return sortNote === "asc" ? 1 : -1;
        } else {
          return 0;
        }
      });

      setNotes(sortedData);
    }
  }, [sortColumn, sortNote]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const notesList = localStorage.getItem("notes");
      if (notesList) {
        const updatedNotes = [...JSON.parse(notesList)].filter((note) =>
          note.title.toLowerCase().includes(search.toLowerCase())
        );
        setNotes(updatedNotes);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [notes, search]);

  return (
    <div className="container">
      <div className="NotesBtn">
        <h2>Notes</h2>
        <div>
          <input
            type="text"
            className="custom-input"
            placeholder="Search"
            onChange={handleSearch}
          />

          <button className="buttonModal" onClick={openModal}>
            Add Note
          </button>
        </div>
      </div>
      <div>
        <div>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("title")} className="pointer">
                  Title{" "}
                  {sortColumn === "title" ? (
                    sortNote === "desc" ? (
                      <span>&#8593;</span>
                    ) : (
                      <span>&#8595;</span>
                    )
                  ) : (
                    ""
                  )}
                </th>
                <th>Body </th>
                <th onClick={() => handleSort("date")}>
                  Date{" "}
                  {sortColumn === "date" ? (
                    sortNote === "desc" ? (
                      <span>&#8593;</span>
                    ) : (
                      <span>&#8595;</span>
                    )
                  ) : (
                    ""
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.length > 0 ? (
                notes.map((note, i) => (
                  <tr key={i}>
                    <td>
                      <span>{note.title}</span>
                    </td>
                    <td>
                      <p>{note.body}</p>
                    </td>
                    <td>
                      <p>{moment(note.date).format("DD-MM-YYYY h:m:s A")}</p>
                    </td>
                    <td className="last_td">
                      <div className="d-flex">
                        <button
                          className="viewBtn"
                          onClick={() => toggleDetailModal(note)}
                        >
                          View
                        </button>
                        <button
                          className="editBtn"
                          onClick={() => handleEditNoteClick(note)}
                        >
                          Edit
                        </button>
                        <button
                          className="deleteBtn"
                          onClick={() => handleDeleteNoteClick(note.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center p-2" colSpan={3}>
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddNote
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        handleNoteSubmit={handleNoteSubmit}
        currentNote={currentNote}
      />
      <NoteDetail
        modalIsOpen={isDetailOpen}
        closeModal={toggleDetailModal}
        currentNote={currentNote}
      />
    </div>
  );
};

export default Notes;
