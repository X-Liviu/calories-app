import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useWeeks from "../../hooks/useWeeks";
import {
  selectWeeks,
  selectWeekByNumber,
} from "../../redux/selectors/weekSelectors";
import SkeletonWeeks from "./SkeletonWeeks";
import WeekItemList from "./WeekItemList";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const WeekList = ({ filter }) => {
  const navigate = useNavigate();
  const { del } = useWeeks();

  const [weekToDelete, setWeekToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { loading } = useSelector((state) => state.weeks);
  const filteredWeeks = useSelector((state) =>
    filter !== "" ? selectWeekByNumber(state, filter) : selectWeeks(state),
  );

  const handleDeleteClick = (e, weekId) => {
    e.stopPropagation();
    setWeekToDelete(weekId);
  };

  const confirmDeleteWeek = async () => {
    const id = weekToDelete;
    setWeekToDelete(null);

    if (id) {
      setDeletingId(id);
      try {
        await del({ id });
      } catch (error) {
        console.error("Error deleting", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading && !deletingId) return <SkeletonWeeks />;

  if (!filteredWeeks || filteredWeeks.length === 0) {
    return (
      <div className="empty-result-container">
        <p>
          {filter !== ""
            ? `Week "${filter}" was not found.`
            : "No weeks created yet. Start by adding one above."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="weeks-grid">
        {filteredWeeks.map((w) => {
          const isThisWeekDeleting = deletingId === w.id;

          return (
            <article
              key={w.id}
              className={`week-card animate-enter ${
                isThisWeekDeleting ? "is-deleting" : ""
              }`}
              onClick={() => !isThisWeekDeleting && navigate(`/weeks/${w.id}`)}
            >
              <WeekItemList week={w} />

              {!isThisWeekDeleting && (
                <button
                  className="btn-delete-icon btn-delete-pos"
                  onClick={(e) => handleDeleteClick(e, w.id)}
                  title="Delete week"
                >
                  ✕
                </button>
              )}

              {isThisWeekDeleting && (
                <div className="card-loading-overlay">
                  <div className="loader-spinner-sm"></div>
                  <span className="card-loading-text">Deleting...</span>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {weekToDelete && (
        <DeleteConfirmationModal
          onClose={() => setWeekToDelete(null)}
          onConfirm={confirmDeleteWeek}
          title="Delete Week"
          message="Are you sure? All days and meals in this week will be lost permanently."
          confirmText="Yes, Delete"
        />
      )}
    </>
  );
};

export default WeekList;
