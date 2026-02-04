import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useMeals from "../../hooks/useMeals";
import MealItemList from "./MealItemList";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const MealList = ({ meals, weekId, dayId }) => {
  const navigate = useNavigate();
  const { del } = useMeals();

  const [mealToDelete, setMealToDelete] = useState(null); // ID para el modal
  const [deletingId, setDeletingId] = useState(null); // ID para el loader local

  const handleDeleteClick = (e, mealId) => {
    e.stopPropagation();
    setMealToDelete(mealId);
  };

  const confirmDeleteMeal = async () => {
    const id = mealToDelete;
    setMealToDelete(null); // Cerrar modal inmediatamente

    if (id) {
      setDeletingId(id); // Activar loader en la tarjeta
      try {
        await del({
          weekId,
          dayId,
          mealId: id,
        });
      } catch (error) {
        console.error("Error deleting meal", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (!meals || meals.length === 0) {
    return (
      <div className="empty-result-container">
        <p>No meals added yet. Start by adding one above.</p>
      </div>
    );
  }

  return (
    <>
      <div className="meals-grid">
        {meals.map((meal) => {
          const isDeleting = deletingId === meal.id;

          return (
            <article
              key={meal.id}
              className={`meal-card animate-enter ${isDeleting ? "is-deleting" : ""}`}
              onClick={() =>
                !isDeleting && navigate(`/weeks/${weekId}/${dayId}/${meal.id}`)
              }
            >
              {/* Contenido */}
              <MealItemList meal={meal} />

              {/* Botón Borrar */}
              {!isDeleting && (
                <button
                  className="btn-delete-icon btn-delete-pos"
                  onClick={(e) => handleDeleteClick(e, meal.id)}
                  title="Delete meal"
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

      {mealToDelete && (
        <DeleteConfirmationModal
          onClose={() => setMealToDelete(null)}
          onConfirm={confirmDeleteMeal}
          title="Delete Meal"
          message="Are you sure? All aliments inside this meal will be lost permanently."
          confirmText="Yes, Delete"
        />
      )}
    </>
  );
};

export default MealList;
