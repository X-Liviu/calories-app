import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDays from "../../hooks/useDays";
import DayItemList from "./DayItemList";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const DayList = ({ days, weekId }) => {
  const navigate = useNavigate();
  const { del } = useDays();

  const [dayToDelete, setDayToDelete] = useState(null); // ID para el modal
  const [deletingId, setDeletingId] = useState(null); // ID para el loader visual

  const handleDeleteClick = (e, dayId) => {
    e.stopPropagation();
    setDayToDelete(dayId);
  };

  const confirmDeleteDay = async () => {
    const id = dayToDelete;
    setDayToDelete(null); // Cerrar modal inmediatamente

    if (id) {
      setDeletingId(id); // Activar loader en la tarjeta
      try {
        await del({ weekId, dayId: id });
      } catch (error) {
        console.error("Error deleting day", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (!days || days.length === 0) {
    return (
      <div className="empty-result-container">
        <p>No days added yet. Start by adding one above.</p>
      </div>
    );
  }

  return (
    <>
      {/* GRID DE DÍAS (Reemplaza a la tabla) */}
      <div className="days-grid">
        {days.map((day) => {
          const isDeleting = deletingId === day.id;

          return (
            <article
              key={day.id}
              className={`day-card animate-enter ${isDeleting ? "is-deleting" : ""}`}
              onClick={() =>
                !isDeleting && navigate(`/weeks/${weekId}/${day.id}`)
              }
            >
              {/* Contenido */}
              <DayItemList day={day} />

              {/* Botón Borrar */}
              {!isDeleting && (
                <button
                  className="btn-delete-icon btn-delete-pos"
                  onClick={(e) => handleDeleteClick(e, day.id)}
                  title="Delete day"
                >
                  ✕
                </button>
              )}

              {/* Loader Local */}
              {isDeleting && (
                <div className="card-loading-overlay">
                  <div className="loader-spinner-sm"></div>
                  <span className="card-loading-text">Deleting...</span>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Modal fuera del bucle */}
      {dayToDelete && (
        <DeleteConfirmationModal
          onClose={() => setDayToDelete(null)}
          onConfirm={confirmDeleteDay}
          title="Delete Day"
          message="Are you sure? All meals and aliments in this day will be lost permanently."
          confirmText="Yes, Delete"
        />
      )}
    </>
  );
};

export default DayList;
