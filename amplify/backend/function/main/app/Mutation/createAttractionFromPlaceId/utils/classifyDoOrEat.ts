import { ATTRACTION_TYPE, MealServicesInput } from 'shared-types/API'

interface IClassifyDoOrEat {
  mealServices: MealServicesInput | null | undefined
}

// quick heuristic with 97.5% accuracy on our generated cards
export function classifyDoOrEat({ mealServices }: IClassifyDoOrEat) {
  if (!mealServices) return ATTRACTION_TYPE.DO

  const sum = [
    mealServices.servesBreakfast ? 1 : 0,
    mealServices.servesBrunch ? 1 : 0,
    mealServices.servesLunch ? 1 : 0,
    mealServices.servesDinner ? 1 : 0,
    mealServices.dineIn ? 1 : 0,
    mealServices.takeout ? 1 : 0,
    mealServices.delivery ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return sum >= 2 ? ATTRACTION_TYPE.EAT : ATTRACTION_TYPE.DO
}
