import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import profileIcon from '../images/profileIcon.png';
import searchIcon from '../images/searchIcon.png';
import SearchBarFilters from './SearchBarFilters';

export default function Header({ title, show = true }) {
  const redirect = useHistory();
  const [click, setClick] = useState(false);

  const handleClick = () => {
    if (!click) setClick(true);
    if (click) setClick(false);
  };

  const location = useLocation();
  const url = location.pathname;
  console.log(url);

  function handleSearch() {
    if (show) {
      return (
        <button
          className="iconsHeader"
          type="button"
          onClick={ () => handleClick() }
        >
          <img
            data-testid="search-top-btn"
            src={ searchIcon }
            alt="search icon"
            width="30px"
          />
        </button>
      );
    }
  }

  return (
    <section>
      <div className="header">
        <button
          type="button"
          onClick={ () => redirect.push('/perfil') }
          className="iconsHeader"
        >
          <img
            data-testid="profile-top-btn"
            src={ profileIcon }
            alt="profile icon"
            width="30px"
          />
        </button>
        <h1
          data-testid="page-title"
          className="title-header"
        >
          { title }
        </h1>
        { handleSearch() }
      </div>
      <div>
        { (click) ? <SearchBarFilters /> : null}
      </div>
    </section>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
};
