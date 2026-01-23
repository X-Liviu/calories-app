import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useDays from "../../hooks/useDays";

import DayItemList from "./DayItemList";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const DayList = ({ days, weekId }) => {
  const [dayToDelete, setDayToDelete] = useState(null);
  const navigate = useNavigate();
  const { del } = useDays();

  const confirmDeleteDay = () => {
    if (dayToDelete) {
      del({ weekId, dayId: dayToDelete });
      setDayToDelete(null);
    }
  };

  return (
    <>
      <table>
        <tbody>
          {days.map((day) => {
            return (
              <tr key={day.id}>
                <td>
                  <button
                    onClick={() => navigate(`/weeks/${weekId}/${day.id}`)}
                  >
                    <DayItemList day={day} />
                  </button>
                </td>
                <td>
                  <button
                    onClick={
                      () =>
                        setDayToDelete(
                          day.id,
                        ) /*Aquí sí que hago distinción de ids, no como en WeekList, ya que aquí hay 2 ids distintos. Además, se intenta siempre que los services no conozcan nada de la API, por eso que en el delete de weekService, lo defines como .id, así para hacer object.id en la URL de la request y que no sepa nada. Aquí pues no se puede, porque si no se volvería demasiado complejo y difícil de entender. Igual después hago cambios para poder manejar / esconder al service estos datos. */
                    }
                  >
                    ❌
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {dayToDelete && (
        <DeleteConfirmationModal
          onClose={() => setDayToDelete(null)}
          onConfirm={confirmDeleteDay}
          title="Delete Day"
          message="¿Are you sure you want to delete this day? All meals and aliments included will be erased. This might take a few seconds."
          confirmText="Yes, I confirm."
        />
      )}
    </>
  );
};

export default DayList;
