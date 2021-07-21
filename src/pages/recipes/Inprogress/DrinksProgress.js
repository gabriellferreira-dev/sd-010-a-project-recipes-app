import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { getDrinksById, getIngredients, getMeasures } from '../../../services/getDrinks';
import '../recipeDetails.css';
import shareIcon from '../../../images/shareIcon.svg';
import whiteHeartIcon from '../../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../../images/blackHeartIcon.svg';
import FinishButton from '../../../components/FinishButton';

const copy = require('clipboard-copy');

function DrinksProgress() {
  const [drinksFromId, setDrinksFromId] = useState([]);
  const [ingredientsId, setIngredientsId] = useState([]);
  const [measuresId, setMeasuresId] = useState([]);
  const [buttonFav, setButtonFav] = useState(true);
  const [copyButton, setCopyButton] = useState('');
  const [stepsDone, setStep] = useState([]);
  const [isFinish, setFinish] = useState(true);
  const [hasEvent, setEvent] = useState(false);
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
    getDrinksById(id)
      .then((drinks) => {
        setDrinksFromId(drinks);
        const ingredients = getIngredients(drinks[0]);
        const measures = getMeasures(drinks[0]);
        setIngredientsId(ingredients);
        setMeasuresId(measures);
      });
    setHeartToFav();
    const getLocalInPro = localStorage.getItem('inProgressRecipes');
    const inProgress = JSON.parse(getLocalInPro);
    if (inProgress === null) {
      localStorage.setItem('inProgressRecipes', JSON.stringify({
        meals: {},
        cocktails: {},
      }));
    }
  }, []);

  function copyBoard() {
    const endPoint = `http://localhost:3000/bebidas/${id}`;
    copy(endPoint);
    setCopyButton('Link copiado!');
  }

  const heartButton = (infos) => {
    setButtonFav(!buttonFav);
    const {
      idDrink,
      strCategory,
      strDrink,
      strDrinkThumb,
      strAlcoholic,
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
        id: idDrink,
        type: 'bebida',
        area: '',
        category: strCategory,
        alcoholicOrNot: strAlcoholic,
        name: strDrink,
        image: strDrinkThumb,
      }];
      localStorage.setItem('favoriteRecipes', JSON.stringify(mealInfos));
    } else {
      const favRecipe = JSON.parse(localStorage.getItem('favoriteRecipes'));
      const filteredRemoved = favRecipe.filter((element) => element.id !== idDrink);
      localStorage.removeItem('favoriteRecipes');
      localStorage.setItem('favoriteRecipes', JSON.stringify(filteredRemoved));
    }
  };

  const setInProgress2 = (path) => {
    const getLocalInPro = localStorage.getItem('inProgressRecipes');
    const inProgress = JSON.parse(getLocalInPro);
    if (path === 'comidas') {
      const { meals } = inProgress;
      const toSet = {
        ...inProgress,
        meals: { ...meals, [id]: [] },
      };
      localStorage.setItem('inProgressRecipes', JSON.stringify(toSet));
    }
    if (path === 'bebidas') {
      const { cocktails } = inProgress;
      const toSet = {
        ...inProgress,
        cocktails: { ...cocktails, [id]: [...stepsDone] },
      };
      localStorage.setItem('inProgressRecipes', JSON.stringify(toSet));
    }
  };

  const verifyBoxs = (path) => {
    const getLocalInPro = localStorage.getItem('inProgressRecipes');
    const inProgress = JSON.parse(getLocalInPro);
    if (path === 'bebidas') {
      /* Comparação de Array pega do seguinte link
      (https://stackoverflow.com/questions/6229197/how-to-know
      -if-two-arrays-have-the-same-values) */
      const { cocktails } = inProgress;
      const doneIngred = cocktails[id];
      const toSee = ingredientsId.filter((ele) => !doneIngred.includes(ele));
      const condition = toSee.length === 0 && hasEvent;
      const toReturn = condition ? setFinish(false) : setFinish(true);
      return toReturn;
    }
  };

  useEffect(() => {
    setInProgress2('bebidas');
    verifyBoxs('bebidas');
  }, [stepsDone]);

  const handleCheckbox = (target) => {
    const { checked, value } = target;
    const condition = checked && !stepsDone.includes(value);
    if (condition) {
      setStep([...stepsDone, target.value]);
    }
    if (!checked) {
      const toSet = stepsDone.filter((e) => e !== value);
      setStep(toSet);
    }
    setEvent(true);
  };

  const renderDetail = () => (
    drinksFromId.map((info, index) => {
      const {
        strDrinkThumb,
        strDrink,
        strCategory,
        strInstructions,
        strAlcoholic,
      } = info;
      return (
        <div key={ index }>
          <img
            data-testid="recipe-photo"
            src={ strDrinkThumb }
            alt="recipe"
            width="330px"
          />
          <h2 data-testid="recipe-title">{ strDrink }</h2>
          <div className="share-and-favorite-container">
            { copyButton }
            <button type="button" data-testid="share-btn" onClick={ () => copyBoard() }>
              <img
                src={ shareIcon }
                alt="share button"
              />
            </button>
            <button type="button" onClick={ () => heartButton(info) }>
              <img
                src={ !buttonFav ? blackHeartIcon : whiteHeartIcon }
                alt="favorite button"
                data-testid="favorite-btn"
              />
            </button>
          </div>
          <p data-testid="recipe-category">
            { strCategory }
            {' '}
            { strAlcoholic }
          </p>
          <ul>
            Ingredientes
            { ingredientsId.map((ingredient, measurePos) => (
              <li
                data-testid={ `${measurePos}-ingredient-step` }
                key={ ingredient }
              >
                <input
                  type="checkbox"
                  value={ ingredient }
                  onChange={ ({ target }) => handleCheckbox(target) }
                />
                { ingredient }
                {' '}
                { measuresId[measurePos] }
              </li>
            )) }
          </ul>
          <h2>Instruções</h2>
          <p data-testid="instructions">{ strInstructions }</p>
          <FinishButton isDisable={ isFinish } path="bebidas" />
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

export default DrinksProgress;
