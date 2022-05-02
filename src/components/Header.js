function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={props.logo} alt="Логотип" />
    </header>
  );
}

export default Header;
