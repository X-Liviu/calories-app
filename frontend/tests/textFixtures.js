// tests/textFixtures.js

export const mockUser = {
  username: "testuser",
  name: "Usuario de Prueba",
  email: "test@trackbites.com",
  token: "fake-jwt-token-123",
  since: 2020,
};

// 1. Alimentos
export const mockAliment1 = {
  id: "alim-1",
  name: "Arroz",
  nameSnapshot: "Arroz",
  customKcal: 200,
  userAliment: false,
};

export const mockAliment2 = {
  id: "alim-2",
  name: "Pollo",
  nameSnapshot: "Pollo",
  customKcal: 350,
  userAliment: false,
};

// 2. Comidas
export const mockMeal1 = {
  id: "meal-1",
  name: "Almuerzo",
  aliments: [mockAliment1],
};

export const mockMeal2 = {
  id: "meal-2",
  name: "Cena",
  aliments: [mockAliment2],
};

// 3. Días
export const mockDayEmpty = {
  id: "day-1",
  name: "Lunes",
  meals: [],
  weekId: "week-1",
};

// Día con comida (200 + 350 = 550 kcal)
export const mockDayWithFood = {
  id: "day-2",
  name: "Martes",
  meals: [mockMeal1, mockMeal2],
  weekId: "week-cal-1",
};

// 4. Semanas
export const mockWeek1 = {
  id: "week-1",
  numberWeek: 10,
  year: 2023,
  days: [mockDayEmpty],
};

export const mockWeek2 = {
  id: "week-2",
  numberWeek: 11,
  year: 2023,
  days: [],
};

export const mockWeekWithCalories = {
  id: "week-cal-1",
  numberWeek: 12,
  year: 2023,
  days: [mockDayWithFood],
};

export const mockCatalogAliment = {
  id: "cat-1",
  name: "Aguacate",
  nutritionFacts: {
    kcal100G: 160,
    proteinG: 2,
    carbsG: 9,
    fatG: 15,
  },
};

// Estado inicial actualizado
export const mockLoadedState = {
  user: mockUser,
  weeks: {
    data: [mockWeek1, mockWeek2, mockWeekWithCalories],
    loading: false,
    error: null,
  },
  year: {
    currentYear: 2023,
    lastSavedYear: 2023,
  },
  myAliments: [mockCatalogAliment],
};
