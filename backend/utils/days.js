const { weeksPerYear, weekNumber } = require("weeknumber");

function pad(n) {
  return String(n).padStart(2, "0");
}

//standard ISO-8601
function formatLocalYYYYMMDDISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatLocalDDMMYYYY(d) {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/**
 * Devuelve la fecha (objet Date) del LUNES de la semana ISO `week` del `year`.
 * Valida que `week` esté en el rango válido (1..52/53) usando weeksPerYear().
 */
function isoWeekStart(week, year) {
  const maxWeeks = weeksPerYear(year); // de weeknumber
  if (week < 1 || week > maxWeeks) {
    throw new RangeError(
      `week debe estar entre 1 y ${maxWeeks} para el año ${year}` //eslint-disable-line
    );
  }

  // 4 de enero está siempre en la semana 1 (ISO). A partir de ahí calculamos el lunes de la semana 1
  const jan4 = new Date(year, 0, 4); // 4 de enero, local
  // convertir getDay(): 0=Dom..6=Sáb  -> queremos 0=Lun..6=Dom  => (getDay()+6)%7
  const dayIndex = (jan4.getDay() + 6) % 7; // 0 = Monday, 1 = Tuesday, ..., 6 = Sunday
  const mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setDate(jan4.getDate() - dayIndex);

  // sumar (week - 1) * 7 días
  const result = new Date(mondayOfWeek1);
  result.setDate(mondayOfWeek1.getDate() + (week - 1) * 7);
  return result;
}

/** Devuelve un array de 7 objetos Date con los días de la semana (Lun..Dom). */
function daysOfIsoWeek(week, year, outputForm) {
  const start = isoWeekStart(week, year);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (outputForm === "DDMMYYYY") days.push(formatLocalDDMMYYYY(d));
    else days.push(formatLocalYYYYMMDDISO(d));
  }
  return days;
}

function weekToday() {
  return weekNumber();
}

module.exports = {
  daysOfIsoWeek,
  weekToday,
};
