import { create } from 'zustand';
import { Plan, Day, Place } from '../types/api';

export enum StateAction {
  REMOVE,
  ADD,
  UPDATE,
}

export type PlanState = {
  plan: Plan | null;
  setPlan: (plan: Plan | null) => void;
  updateItineraryDays: (day: Day, action: StateAction) => void;
  updatePlanPlaces: (place: Place, action: StateAction) => void;
  updateDayPlaces: (
    dayId: string | number,
    place: Place,
    action: StateAction
  ) => void;
  clearPlan: () => void;
};

export const usePlanStore = create<PlanState>((set) => ({
  plan: null,
  setPlan: (plan: Plan | null) => set({ plan }),
  updateItineraryDays: (day: Day, action: StateAction) =>
    set((state: PlanState) => {
      if (!state.plan) return state;

      const currentDays = state.plan.itinerary.days;

      let updatedDays = currentDays;

      switch (action) {
        case StateAction.ADD:
          updatedDays = [...currentDays, day];
          break;
        case StateAction.REMOVE:
          updatedDays = currentDays.filter((current) => current.id === day.id);
          break;
        case StateAction.UPDATE:
          updatedDays = currentDays.map((current) =>
            current.id === day.id ? { ...current, ...day } : current
          );
          break;
        default:
          console.error(
            'planStore: updateItineraryDays -- StateActionがありません。'
          );
      }

      return {
        plan: {
          ...state.plan,
          itinerary: { ...state.plan.itinerary, days: updatedDays },
        },
      };
    }),
  updatePlanPlaces: (place: Place, action: StateAction) =>
    set((state) => {
      if (!state.plan) return state;

      const currentPlaces = state.plan.places;
      let updatedPlaces = currentPlaces;

      switch (action) {
        case StateAction.ADD:
          updatedPlaces = [...currentPlaces, place];
          break;
        case StateAction.REMOVE:
          updatedPlaces = currentPlaces.filter(
            (current) => current.id !== place.id
          );
          break;
        case StateAction.UPDATE:
          updatedPlaces = currentPlaces.map((current) =>
            current.id === place.id ? { ...current, ...place } : current
          );
          break;
        default:
          console.error(
            'planStore: updatePlanPlaces -- StateActionがありません。'
          );
      }

      return {
        plan: {
          ...state.plan,
          places: updatedPlaces,
        },
      };
    }),
  updateDayPlaces: (
    dayId: string | number,
    place: Place,
    action: StateAction
  ) =>
    set((state) => {
      if (!state.plan) return state;

      const currentDay = state.plan.itinerary.days.find(
        (day) => day.id === dayId
      );

      if (!currentDay) return state;

      const currentPlaces = currentDay.places;
      let updatedPlaces = currentPlaces;

      switch (action) {
        case StateAction.ADD:
          updatedPlaces = [...currentPlaces, place];
          break;
        case StateAction.REMOVE:
          updatedPlaces = currentPlaces.filter(
            (current) => current.id !== place.id
          );
          break;
        case StateAction.UPDATE:
          updatedPlaces = currentPlaces.map((current) =>
            current.id === place.id ? { ...current, ...place } : current
          );
          break;
        default:
          console.error(
            'planStore: updatePlanPlaces -- StateActionがありません。'
          );
      }

      let updatedDays = state.plan.itinerary.days.map((day) =>
        day.id === dayId ? { ...day, places: updatedPlaces } : day
      );

      return {
        plan: {
          ...state.plan,
          itinerary: { ...state.plan.itinerary, days: updatedDays },
        },
      };
    }),
  clearPlan: () => set({ plan: null }),
}));
