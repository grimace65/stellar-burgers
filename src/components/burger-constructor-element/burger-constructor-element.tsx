/* eslint-disable */
import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { moveIngredient, removeIngr } from '../../services/slices/ingredientsSlices';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const handleMoveDown = () => {
      if (index < totalItems - 1) {
          dispatch(moveIngredient({
            fromIndex: index,
            toIndex: index + 1
          }));
      }
    };

    const handleMoveUp = () => {
      if (index < totalItems - 1) {
          dispatch(moveIngredient({
            fromIndex: index,
            toIndex: index - 1
          }));
      }
    };

    const handleClose = () => {
      dispatch(removeIngr(ingredient.uniqueId));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
