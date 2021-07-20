import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function RecipeButton({ path, ingredients }) {
  const { id } = useParams();
  const [buttonName, setButtonName] = useState('Iniciar Receita');
  const [recipeStarted, setStarted] = useState(false);
  const [display, setDisplay] = useState('block');

  // function setLocalStorage() {
  //   const inProgressRecipes = 'inProgressRecipes';
  //   if (localStorage[inProgressRecipes] === undefined) {
  //     const obj = {
  //       cocktails: {
  //       },
  //       meals: {
  //       },
  //     };
  //     localStorage.setItem('inProgressRecipes', JSON.stringify(obj));
  //   }
  // }

  function recipesProgress() {
  //   // const ingredient = ingredients.map((index) => index[1]);
  //   if (path.includes('/comidas')) {
  //     const id = path.slice(sliceNumber);
  //     let include = JSON.parse(localStorage.getItem('inProgressRecipes'));
  //     include = {
  //       ...include,
  //       meals: {
  //         ...include.meals, [id]: [],
  //       },
  //     };
  //     localStorage.setItem('inProgressRecipes', JSON.stringify(include));
  //   } else {
  //     const id = path.slice(sliceNumber);
  //     let include = JSON.parse(localStorage.getItem('inProgressRecipes'));
  //     include = {
  //       ...include,
  //       cocktails: {
  //         ...include.cocktails, [id]: [],
  //       },
  //     };
  //     localStorage.setItem('inProgressRecipes', JSON.stringify(include));
  //   }
    setStarted(true);
  }

  const conditionalLocalStorage = () => {
    const storage = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (storage === null) {
      const obj = {
        cocktails: {},
        meals: {},
      };
      localStorage.setItem('inProgressRecipes', JSON.stringify(obj));
    }
  };

  useEffect(() => {
    function button() {
      const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
      if (doneRecipes && doneRecipes.find((recipe) => recipe.id === id)) {
        setDisplay('none');
      }
      const include = JSON.parse(localStorage.getItem('inProgressRecipes'));
      if (path.includes('/comida')) {
        if (include.meals[id] !== undefined) setButtonName('Continuar Receita');
      } else if (include.cocktails[id] !== undefined) setButtonName('Continuar Receita');
    }
    conditionalLocalStorage();
    button();
  }, [id, path]);

  if (recipeStarted) {
    return (<Redirect
      to={ {
        pathname: `${path}/in-progress`,
        state: { ingredients },
      } }
    />);
  }

  return (
    <button
      className="start-recipe-btn"
      type="button"
      data-testid="start-recipe-btn"
      onClick={ recipesProgress }
      style={ { display } }
    >
      { buttonName }
    </button>
  );
}

RecipeButton.propTypes = {
  ingredients: PropTypes.shape({}).isRequired,
  path: PropTypes.string.isRequired,
}.isRequired;
