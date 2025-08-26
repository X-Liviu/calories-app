// import { createSlice, current } from "@reduxjs/toolkit";

// const loginSlice = createSlice({
//   name: "notes",
//   initialState: [],
//   reducers: {
//     toggleImportanceOf(state, action) {
//       const id = action.payload;
//       const noteToChange = state.find((n) => n.id === id);
//       const changedNote = {
//         ...noteToChange,
//         important: !noteToChange.important,
//       };
//       console.log(current(state));

//       return state.map((note) => (note.id !== id ? note : changedNote));
//     },
//     appendNote(state, action) {
//       state.push(action.payload);
//     },
//     setNotes(state, action) {
//       return action.payload;
//     },
//   },
// });

// export default loginSlice;
