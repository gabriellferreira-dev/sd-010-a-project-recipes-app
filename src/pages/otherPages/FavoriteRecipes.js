import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/Header';
import Context from '../../context/Context';
import FavoritedButtonFilters from '../../components/FavoritedButtonFilters';
import FavoritedRecipeCardList from '../../components/FavoritedRecipeCardList';
import '../../components/FavoriteRecipe.css';

export default function FavoriteRecipes() {
  const { favoritedFil, attFav } = useContext(Context);
  const [list, setList] = useState([]);
  const setLocal = () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify([]));
  };

  const retrivieData = () => {
    const getLocalDone = localStorage.getItem('favoriteRecipes');
    let doneRecipes = JSON.parse(getLocalDone);
    if (doneRecipes === null) {
      setLocal();
      const getLocalDone2 = localStorage.getItem('favoriteRecipes');
      doneRecipes = JSON.parse(getLocalDone2);
    }
    return doneRecipes;
  };

  useEffect(() => {
    setList(retrivieData());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetFilter = () => {
    const data = retrivieData();
    let toReturn = data;
    if (favoritedFil === 'comida') {
      toReturn = data.filter((ele) => ele.type === 'comida');
      return toReturn;
    }

    if (favoritedFil === 'bebida') {
      toReturn = data.filter((ele) => ele.type === 'bebida');
      return toReturn;
    }

    if (favoritedFil === 'All') {
      return toReturn;
    }
  };

  useEffect(() => {
    setList(handleSetFilter());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoritedFil]);

  useEffect(() => {
    setList(handleSetFilter());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attFav]);

  return (
    <div className="test">
      <Header title="Receitas Feitas" show={ false } />
      <FavoritedButtonFilters />
      <FavoritedRecipeCardList list={ list } />
    </div>
  );
}
