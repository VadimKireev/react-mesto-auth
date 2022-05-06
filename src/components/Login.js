function Login() {

  return(
    <main>
      <section className="auth">
        <h2 className="auth__title">Вход</h2>
        <form className="auth__form">
          <fieldset className="auth__fieldset">
            <label className="auth__label">
              <input className="auth__input" type="email" name="email" id="email" placeholder="Email" required />
            </label>
            <label className="auth__label">
              <input className="auth__input" type="password" name="password" id="password" placeholder="Пароль" required />
            </label>
          </fieldset>
          <button className="auth__submit-button">Войти</button>
        </form>
      </section>
    </main>
  )
}

export default Login;
