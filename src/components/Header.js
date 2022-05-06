import { Link, useLocation } from "react-router-dom";

function Header({logo, email, loggedIn, handleLogout}) {
  const location = useLocation();

  function getButtonValue() {
    switch (location.pathname) {
      case '/sign-in':
        return 'Регистрация';
      case '/sign-up':
        return 'Войти';
      default:
        return 'Выйти';
    }
  }

  function getButtonRoute() {
    switch (location.pathname) {
      case '/sign-in':
        return '/sign-up';
      case '/sign-up':
        return '/sign-in';
      default:
        return '/sign-in';
    }
  }

  function handleClick() {
    if (getButtonValue() === 'Выйти') {
      handleLogout();
    }
  }

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип" />
      <div className="header__right-container">
        {loggedIn && <p className="header__email">{email}</p>}
        <Link className="header__link" to={getButtonRoute()}>
          <button className="header__button" onClick={handleClick}>{getButtonValue()}</button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
