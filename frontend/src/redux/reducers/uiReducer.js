import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    notifications: [], // Array de notificaciones
  },
  reducers: {
    pushNotification(state, action) {
      state.notifications.push(action.payload);
    },
    removeNotification(state, action) {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload,
      );
    },
  },
});

export const { pushNotification, removeNotification } = uiSlice.actions;

// THUNK HELPER MEJORADO
export const displayNotification = (errorOrMessage, type = "error") => {
  return (dispatch) => {
    let messages = [];

    // CASO 1: El backend envía array (Nuestro nuevo MultipleValidationError)
    // Axios pone la respuesta en error.response.data.error
    if (
      errorOrMessage?.response?.data?.error &&
      Array.isArray(errorOrMessage.response.data.error)
    ) {
      messages = errorOrMessage.response.data.error;
    }
    // CASO 2: Error simple del backend (String)
    else if (typeof errorOrMessage?.response?.data?.error === "string") {
      messages = [errorOrMessage.response.data.error];
    }
    // CASO 3: Error de conexión o JS
    else if (errorOrMessage?.message) {
      messages = [errorOrMessage.message];
    }
    // CASO 4: String directo pasado desde el componente
    else if (typeof errorOrMessage === "string") {
      messages = [errorOrMessage];
    }

    messages.forEach((msg) => {
      const id = Date.now() + Math.random();
      dispatch(pushNotification({ id, message: msg, type }));
    });
  };
};

export default uiSlice.reducer;
