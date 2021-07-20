import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function RecipeButton({ path, ingredients }) {
  const [buttonName, setButtonName] = useState('Iniciar Receita');
  const [recipeStarted, setStarted] = useState(false);
  const sliceNumber = 9;

  console.log(ingredients);

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
      const id = path.slice(sliceNumber);
      const include = JSON.parse(localStorage.getItem('inProgressRecipes'));
      if (path.includes('/comida')) {
        if (include.meals[id] !== undefined) setButtonName('Continuar Receita');
      } else {
        return include.cocktails[id] !== undefined
          ? setButtonName('Continuar Receita')
          : setButtonName('Iniciar Receita');
      }
    }
    conditionalLocalStorage();
    button();
  }, [path]);

  if (recipeStarted) {
    return (<Redirect
      to={ {
        pathname: `${path}/in-progress`,
        state: { ingredients },
      } }
    />);
  }

  return (
    // <Link
    //   to={ {
    //     pathname: `${path}/in-progress`,
    //     // state: { ingredients },
    //   } }
    //   >
    <button
      className="start-recipe-btn"
      type="button"
      data-testid="start-recipe-btn"
      onClick={ recipesProgress }
    >
      { buttonName }
    </button>
    // </Link>
  );
}

RecipeButton.propTypes = {
  ingredients: PropTypes.shape({}).isRequired,
  path: PropTypes.string.isRequired,
}.isRequired;
