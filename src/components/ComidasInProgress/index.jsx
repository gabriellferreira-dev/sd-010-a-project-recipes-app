import React, { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import ShareButton from '../ShareButton';
import FavoriteButton from '../FavoriteButton';
import getIngredients from '../../services/getIngredients';

const setDoneRecipes = (recipe) => {
  const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
  if (doneRecipes) {
    localStorage.setItem(
      'doneRecipes',
      JSON.stringify([...doneRecipes, recipe]),
    );
  } else {
    localStorage.setItem('doneRecipes', JSON.stringify([recipe]));
  }
};

function FoodsInProgress({ data: recipe }) {
  const { id } = useParams();
  const [checkedIngredients, setChecked] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const ingredients = getIngredients(recipe, 'strIngredient');

  useEffect(() => {
    const updateChecked = () => {
      const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
      if (inProgressRecipes) {
        const meal = inProgressRecipes.meals[id];
        if (meal) {
          setChecked(meal);
        }
      } else {
        localStorage.setItem('inProgressRecipes', JSON.stringify({
          cocktails: {},
          meals: {},
        }));
      }
    };
    updateChecked();
  }, [recipe, id]);

  useEffect(() => {
    const updateLocalStorage = () => {
      const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
      localStorage.setItem('inProgressRecipes', JSON.stringify({
        ...inProgressRecipes,
        meals: { ...inProgressRecipes.meals, [id]: checkedIngredients },
      }));
    };
    updateLocalStorage();
  }, [checkedIngredients, id, recipe]);

  const handleButton = () => {
    const {
      strMeal: name,
      strArea: area,
      strTags,
      strCategory: category,
      strMealThumb: image,
    } = recipe;
    const tags = strTags.split(',').slice(0, 2);
    const type = 'comida';
    const doneDate = new Date();
    setDoneRecipes({ id, name, area, tags, category, doneDate, type, image });
    setRedirect(true);
  };

  const handleCheked = ({ target }) => {
    if (checkedIngredients.includes(target.name)) {
      const filtered = checkedIngredients.filter(
        (element) => element !== target.name,
      );
      setChecked(filtered);
    } else {
      const newArr = [...checkedIngredients, target.name];
      setChecked(newArr);
    }
  };

  return (
    <div>
      <div className="top-recipe-details">
        <img
          src={ recipe.strMealThumb }
          alt="thumb"
          data-testid="recipe-photo"
          width="200px"
        />
        <div className="recipes-buttons-actions">
          <ShareButton urlCopied={ `http://localhost:3000/comidas/${id}` } />
          <FavoriteButton data={ recipe } path={ id } />
        </div>
      </div>
      <div className="recipe-title">
        <h3 data-testid="recipe-title">{recipe.strMeal}</h3>
        <p data-testid="recipe-category">{recipe.strCategory}</p>
      </div>
      <div className="recipe-ingredients-container">
        {Object.values(ingredients).map((element, index) => (
          <label
            data-testid={ `${index}-ingredient-step` }
            key={ index }
            htmlFor={ `${index}-${element}` }
          >
            <input
              type="checkbox"
              id={ `${index}-${element}` }
              name={ element }
              onChange={ handleCheked }
              checked={ checkedIngredients.includes(element) }
            />
            {element}
          </label>
        ))}
      </div>
      <p data-testid="instructions">{recipe.strInstructions}</p>
      <button
        type="button"
        data-testid="finish-recipe-btn"
        onClick={ handleButton }
        disabled={ checkedIngredients.length < Object.values(ingredients).length }
      >
        Finalizar Receita!
      </button>
      {redirect ? <Redirect to="/receitas-feitas" /> : null}
    </div>
  );
}

FoodsInProgress.propTypes = {
  data: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default FoodsInProgress;
