import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { getMealsById, getIngredients, getMeasures } from '../../services/getMeals';
import { getRecomendedDrinks } from '../../services/getDrinks';
import './recipeDetails.css';
import shareIcon from '../../images/shareIcon.png';
import whiteHeartIcon from '../../images/whiteHeartIcon.png';
import blackHeartIcon from '../../images/blackHeartIcon.png';
import StartRecipeButton from '../../components/StartRecipeButton';

const copy = require('clipboard-copy');

function MealDetails() {
  const [mealsFromId, setMealsFromId] = useState([]);
  const [ingredientsId, setIngredientsId] = useState([]);
  const [measuresId, setMeasuresId] = useState([]);
  const [buttonFav, setButtonFav] = useState(true);
  const [drinksCarousel, setDrinksCarousel] = useState([]);
  const [copyButton, setCopyButton] = useState('');
  const match = useRouteMatch();
  const { params: { id } } = match;

  const setLocal = () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify([]));
  };

  const isFav = () => {
    const favRecipe = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const hasFav = favRecipe.filter((element) => element.id === id);
    const condition = hasFav.length > 0;
    if (condition) {
      setButtonFav(!buttonFav);
    } else {
      console.log('is not fav');
    }
  };

  const setHeartToFav = () => {
    const hasSetLocal = localStorage.getItem('favoriteRecipes');
    return hasSetLocal ? isFav() : setLocal();
  };

  useEffect(() => {
    getMealsById(id)
      .then((meals) => {
        setMealsFromId(meals);
        const ingredients = getIngredients(meals[0]);
        const measures = getMeasures(meals[0]);
        setIngredientsId(ingredients);
        setMeasuresId(measures);
      });
    getRecomendedDrinks()
      .then((drink) => {
        const SIX = 6;
        const drinks = Object.values(drink).slice(0, SIX);
        setDrinksCarousel(drinks);
      });
    setHeartToFav();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function copyBoard() {
    copy(window.location.href);
    setCopyButton(global.alert('Link copiado!'));
  }

  function renderCarousel() {
    return (
      <ul className="recommendation-container">
        { drinksCarousel.map((drink, index) => {
          const {
            strDrink,
            strDrinkThumb,
          } = drink;
          return (
            <li
              key={ drink }
              data-testid={ `${index}-recomendation-card` }
            >
              <img
                className="recommendation-img"
                src={ strDrinkThumb }
                alt={ `imagem-da-receita-${strDrink}` }
              />
              <h2 data-testid={ `${index}-recomendation-title` }>{ strDrink }</h2>
            </li>
          );
        }) }
      </ul>
    );
  }

  const heartButton = (infos) => {
    setButtonFav(!buttonFav);
    const {
      idMeal,
      strCategory,
      strMeal,
      strMealThumb,
      strArea,
    } = infos;
    const hasSetLocal = localStorage.getItem('favoriteRecipes');
    if (hasSetLocal) {
      console.log('hello world');
    } else {
      setLocal();
    }
    if (buttonFav === true) {
      const favRecipe = JSON.parse(localStorage.getItem('favoriteRecipes'));
      const mealInfos = [...favRecipe, {
        id: idMeal,
        type: 'comida',
        area: strArea,
        category: strCategory,
        alcoholicOrNot: '',
        name: strMeal,
        image: strMealThumb,
      }];
      localStorage.setItem('favoriteRecipes', JSON.stringify(mealInfos));
    } else {
      const favRecipe = JSON.parse(localStorage.getItem('favoriteRecipes'));
      const filteredRemoved = favRecipe.filter((element) => element.id !== idMeal);
      localStorage.removeItem('favoriteRecipes');
      localStorage.setItem('favoriteRecipes', JSON.stringify(filteredRemoved));
    }
  };

  const renderDetail = () => (
    mealsFromId.map((info, index) => {
      const {
        strMealThumb,
        strMeal,
        strCategory,
        strInstructions,
        strYoutube,
      } = info;
      return (
        <div className="detail-page" key={ index }>
          <img
            data-testid="recipe-photo"
            src={ strMealThumb }
            alt="recipe"
            width="100%"
          />
          <div className="header-content">
            <h2 data-testid="recipe-title">{ strMeal }</h2>
            <div className="share-and-favorite-container">
              { copyButton }
              <button
                type="button"
                data-testid="share-btn"
                className="detail-btn"
                onClick={ () => copyBoard() }
              >
                <img
                  src={ shareIcon }
                  alt="share button"
                  width="26px"
                />
              </button>
              <button
                type="button"
                className="detail-btn"
                onClick={ () => heartButton(info) }
              >
                <img
                  src={ !buttonFav ? blackHeartIcon : whiteHeartIcon }
                  alt="favorite button"
                  data-testid="favorite-btn"
                  width="26px"
                />
              </button>
            </div>
          </div>
          <p data-testid="recipe-category" className="category">{ strCategory }</p>
          <h2>Ingredientes</h2>
          <ul className="ingredient-list">
            { ingredientsId.map((ingredient, measurePos) => (
              <li
                data-testid={ `${measurePos}-ingredient-name-and-measure` }
                key={ ingredient }
              >
                { ingredient }
                {' '}
                { measuresId[measurePos] }
              </li>
            )) }
          </ul>
          <h2>Instruções</h2>
          <p data-testid="instructions" className="instructions">{ strInstructions }</p>
          <iframe
            title="recipe-video"
            data-testid="video"
            src={ strYoutube }
            width="100%"
          />
          <div className="card-container">{ renderCarousel() }</div>
          <StartRecipeButton path="comidas" />
        </div>
      );
    })
  );
  return (
    <div>
      { renderDetail() }
    </div>
  );
}

export default MealDetails;
