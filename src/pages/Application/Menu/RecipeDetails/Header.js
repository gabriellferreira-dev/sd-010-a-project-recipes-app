import React from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import cp from 'clipboard-copy';
import { useDispatch, useSelector } from 'react-redux';
import shareBtn from '../../../../images/shareIcon.svg';
import fillHeart from '../../../../images/blackHeartIcon.svg';
import outlineHeart from '../../../../images/whiteHeartIcon.svg';
import { toggleFavorite as toggleFavoriteAct } from '../../../../slices/favoriteRecipes';

const isFavoriteTest = (idComponent) => (
  ({ favoriteRecipes }) => favoriteRecipes.some(
    ({ id: idStore }) => idComponent === idStore,
  )
);
function Header({ imgSrc, category, title, favoriteData }) {
  const isFavorite = useSelector(isFavoriteTest(favoriteData.id));
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const copyToClipBoard = () => {
    const url = window.location.href;
    const regex = /[\s\S]+[comidas|bebidas]\/[\d]+/;
    cp(url.match(regex)[0]).then(() => { enqueueSnackbar('Link copiado!'); });
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      enqueueSnackbar(`${title} - Receita desfavoritada`, { variant: 'error' });
    } else {
      enqueueSnackbar(`${title} - Receita favoritada`, { variant: 'success' });
    }
    dispatch(toggleFavoriteAct(favoriteData));
  };

  return (
    <header>
      <div>
        <img data-testid="recipe-photo" src={ imgSrc } alt={ title } />
      </div>
      <div>
        <h1 data-testid="recipe-title">{title}</h1>
        <h3 data-testid="recipe-category">{category}</h3>

        <button
          type="button"
          data-testid="share-btn"
          onClick={ copyToClipBoard }
        >
          <img src={ shareBtn } alt="share button" />
        </button>

        <button type="button" onClick={ toggleFavorite }>
          { isFavorite
            ? <img data-testid="favorite-btn" src={ fillHeart } alt="favorite" />
            : <img data-testid="favorite-btn" src={ outlineHeart } alt="favorite" />}
        </button>
      </div>
    </header>
  );
}

Header.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  favoriteData: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    area: PropTypes.string,
    category: PropTypes.string,
    alcoholicOrNot: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};

export default Header;