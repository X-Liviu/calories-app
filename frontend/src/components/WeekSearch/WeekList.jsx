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

  const { loading } = useSelector((state) => state.weeks);
  const filteredWeeks = useSelector((state) =>
    filter !== "" ? selectWeekByNumber(state, filter) : selectWeeks(state),
  );

  const handleDeleteClick = (weekId) => {
    setWeekToDelete(weekId);
  };

  const confirmDeleteWeek = () => {
    if (weekToDelete) {
      del({ id: weekToDelete });
      setWeekToDelete(null);
    }
  };

  if (loading) return <SkeletonWeeks />;

  return (
    <>
      <table>
        <tbody>
          {filteredWeeks.length > 0 ? (
            filteredWeeks.map((w) => (
              <tr key={w.id}>
                <td>
                  <button onClick={() => navigate(`/weeks/${w.id}`)}>
                    <WeekItemList week={w} />
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDeleteClick(w.id)}>❌</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>
                <h2>
                  {!filteredWeeks ? (
                    "Loading"
                  ) : filter !== "" ? (
                    <>
                      <strong>{`Week ${filter}`}</strong> was not found.
                    </>
                  ) : (
                    "There are no weeks available."
                  )}
                </h2>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {weekToDelete && (
        <DeleteConfirmationModal
          onClose={() => setWeekToDelete(null)}
          onConfirm={confirmDeleteWeek}
          title="Delete Week"
          message="¿Are you sure you want to delete this week? All days, meals and aliments included will be erased. This might take a few seconds."
          confirmText="Yes, I confirm."
        />
      )}
    </>
  );
};

export default WeekList;
