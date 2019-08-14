import { CREATE_NEW_ORDER } from '../modules/clients';
import { MOVE_ORDER_NEXT, MOVE_ORDER_BACK } from '../actions/moveOrder';
import { ADD_INGREDIENT } from '../actions/ingredients';

// Реализуйте редьюсер
// Типы экшенов, которые вам нужно обрабатывать уже импортированы
// Обратите внимание на `orders.test.js`.
// Он поможет понять, какие значения должен возвращать редьюсер.

const getPositionNext = position => {
  switch (position) {
    case 'clients':
      return 'conveyor_1';
    case 'conveyor_1':
      return 'conveyor_2';
    case 'conveyor_2':
      return 'conveyor_3';
    case 'conveyor_3':
      return 'conveyor_4';
    default:
      return position;
  }
};

const getPositionPrev = position => {
  switch (position) {
    case 'conveyor_4':
      return 'conveyor_3';
    case 'conveyor_3':
      return 'conveyor_2';
    case 'conveyor_2':
      return 'conveyor_1';
    default:
      return position;
  }
};

export default (state = [], action) => {
  switch (action.type) {
    case CREATE_NEW_ORDER:
      return [
        ...state,
        {
          id: action.payload.id,
          recipe: action.payload.recipe,
          ingredients: [],
          position: 'clients'
        }
      ];
    case MOVE_ORDER_NEXT:
      return [
        ...state.map(item => {
          if (item.id === action.payload) {
            const isFinish = item.position === 'conveyor_4' && item.ingredients.length === item.recipe.length;
            
            return {
              ...item,
              position: isFinish ? 'finish' : getPositionNext(item.position)
            }
          }
          return item;
        })
      ];

    case MOVE_ORDER_BACK:
      return [
        ...state.map(item => {
          if (item.id === action.payload) {
            return {
              ...item,
              position: getPositionPrev(item.position)
            }
          }
          return item;
        })
      ];
    case ADD_INGREDIENT: 
      return [
        ...state.map(item => {
          const { from, ingredient} = action.payload;

          if (item.position === from && item.recipe.includes(ingredient)) {
            return {
              ...item,
              ingredients: [...item.ingredients, ingredient]
            }
            // item.ingredients = [...item.ingredients, ingredient];
          }
          return item;
        })
      ];
    default:
      return state;
  }
};

export const getOrdersFor = (state, position) => {
  return state.orders.filter(order => order.position === position);
};
