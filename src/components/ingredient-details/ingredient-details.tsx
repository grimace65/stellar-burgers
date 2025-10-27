/* eslint-disable */
import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { useParams } from 'react-router-dom';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/slice';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const ingredients = useSelector(state => state.ingredients.items);

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const ingredientData = ingredients.find(item => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
