import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Context from '../context/Context';
import shareIcon from '../images/shareIcon.png';
import blackHeartIcon from '../images/blackHeartIcon.png';
import './FavoriteRecipe.css';

const copy = require('clipboard-copy');

function FavoritedRecipeCardList({ list }) {
  const { attFav, setAttFev } = useContext(Context);
  const [copyText, setText] = useState({});

  function copyBoard(type, id) {
    let correctSTR = '';
    if (type === 'comida') {
      correctSTR = 'comidas';
    }
    if (type === 'bebida') {
      correctSTR = 'bebidas';
    }
    const endPoint = `http://localhost:3000/${correctSTR}/${id}`;
    setText({ ...copyText, [id]: 'Link copiado!' });
    copy(endPoint);
  }

  const handleFav = (id) => {
    const favRecipe = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const filteredRemoved = favRecipe.filter((element) => element.id !== id);
    localStorage.removeItem('favoriteRecipes');
    localStorage.setItem('favoriteRecipes', JSON.stringify(filteredRemoved));
    setAttFev(attFav + 1);
  };

  const renderButtons = (data, index) => {
    const { id, type } = data;
    return (
      <div>
        { copyText[id] ? copyText[id] : '' }
        <button
          className="buttons-share-fav"
          type="button"
          data-testid={ `${index}-horizontal-share-btn` }
          onClick={ () => copyBoard(type, id) }
          src={ shareIcon }
        >
          <img
            src={ shareIcon }
            alt="share button"
            width="26px"
          />
        </button>
        <button
          className="buttons-share-fav"
          type="button"
          data-testid={ `${index}-horizontal-favorite-btn` }
          onClick={ () => handleFav(id) }
          src={ blackHeartIcon }
        >
          <img
            className
            src={ blackHeartIcon }
            alt="Fav button"
            width="26px"
          />
        </button>
      </div>
    );
  };

  const handleTextCat = (data) => {
    const { category, area, alcoholicOrNot } = data;
    const toReturn = area ? `${area} - ${category}`
      : `${alcoholicOrNot}`;
    return toReturn;
  };

  const renderCardDates = (data, index) => {
    const { name, type, id } = data;
    return (
      <div className="info-favRecipe">
        <p
          data-testid={ `${index}-horizontal-top-text` }
        >
          { handleTextCat(data) }
        </p>
        <p
          data-testid={ `${index}-horizontal-name` }
        >
          <Link to={ { pathname: `/${type}s/${id}` } }>
            { name }
          </Link>
        </p>
      </div>
    );
  };

  const renderLeftSideCard = (data, index) => (
    <div>
      { renderButtons(data, index) }
      { renderCardDates(data, index) }
    </div>
  );

  const renderImg = (data, index) => {
    const { image, type, id } = data;
    return (
      <div>
        <Link to={ { pathname: `/${type}s/${id}` } }>
          <img
            data-testid={ `${index}-horizontal-image` }
            src={ `${image}` }
            alt="recipe-img"
            className="favorite-img"
          />
        </Link>
      </div>
    );
  };

  const renderCard = () => {
    const toReturn = list.map((ele, index) => {
      const { name } = ele;
      return (
        <div className="render-card" key={ name }>
          { renderImg(ele, index) }
          { renderLeftSideCard(ele, index) }
        </div>
      );
    });
    return toReturn;
  };

  return (
    <div className="component">
      { renderCard() }
    </div>
  );
}

FavoritedRecipeCardList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};

export default FavoritedRecipeCardList;
