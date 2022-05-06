import { Link } from "react-router-dom";

function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={props.logo} alt="Логотип" />
      <Link className="header__link" to="/main">
        <button className="header__button">Войти</button>
      </Link>
    </header>
  );
}

export default Header;
