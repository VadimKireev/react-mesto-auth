import { useState, useEffect } from 'react';
import logo from '../images/header-logo.svg';
import okImage from '../images/popup-confirm-image.jpg';
import failImage from '../images/popup-fail-image.jpg'
import '../index';
import Register from './Register';
import Login from './Login';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Route, Switch, useHistory } from  'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState({ opened: false, success: false })
  const [selectedCard, setSelectedCard] = useState({name: '', link: ''});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const history = useHistory();

  useEffect(() => {
    api.getUserInfo()
    .then((response) => {
      setCurrentUser(response);
    })
    .catch((err) => {
      alert(err);
    });

    api.getCards()
    .then((response) => {
      setCards(response);
    })
    .catch((err) => {
      alert(err);
    });
  }, []);

  useEffect(() => {
    tokenCheck();
  }, [])

  useEffect(() => {
    if (loggedIn) {
        history.push("/");
        return;
    }
    history.push('/sign-in');
}, [loggedIn, history]);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }

  const handleCardClick = (card) => {
    setSelectedCard({name: '', link: ''});
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setInfoTooltipOpen({opened: false, success: isInfoTooltipOpen.success})
  }

  const handleUpdateUser = ({ name, about }) => {
    api.editUserInfo({ name, about })
    .then(({ name, about }) => {
      setCurrentUser({...currentUser, name, about })
    })
    .catch((err) => {
      alert(err);
    });
  }

  const handleUpdateAvatar = ({ avatar }) => {
    api.editUserAvatar({ avatar })
    .then(({ avatar }) => {
      setCurrentUser({...currentUser, avatar })
    })
    .catch((err) => {
      alert(err);
    });
  }

  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    }).catch((err) => {
      alert(err);
    });
  }

  const handleCardDelete = (card) => {
    api.deleteCard(card._id)
    .then(() => {
      setCards((state) => state.filter((c) => c._id === card._id ? !c : c));
    }).catch((err) => {
      alert(err);
    });
  }

  const handleAddPlaceSubmit = (newCard) => {
    api.postCard(newCard)
    .then((newCard) => {
      setCards([newCard, ...cards]);
    })
    .catch((err) => {
      alert(err);
    });
  }

  const handleRegister = ({password, email}) => {
    return api.register({password, email})
    .then(() => {
      setInfoTooltipOpen({ opened: true, success: true });
      history.push('/sign-in');
    })
    .catch(() => {
      setInfoTooltipOpen({ opened: true, success: false });
    });
  }

  const handleLogin = ({password, email}) => {
    return api.login({password, email})
    .then((res) => {
      localStorage.setItem('token', res.token);
      tokenCheck();
      setLoggedIn(true);
      history.push('/');
    })
    .catch(() => {
      setInfoTooltipOpen({ opened: true, success: false });
    });
  }

  const handleLogout = () => {
		localStorage.removeItem('token');
		setLoggedIn(false);
	}

  const tokenCheck = () => {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      api.getContent(token).then((res) => {
        if (res) {
          setUserEmail(res.data.email);
          setLoggedIn(true);
        }
      }).catch((err) => {
        alert(err);
      });
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header logo={logo} email={userEmail} loggedIn={loggedIn} handleLogout={handleLogout} />
        <Switch>
          <Route path="/sign-up">
            <Register handleRegister={handleRegister} />
          </Route>
          <Route path="/sign-in">
            <Login handleLogin={handleLogin} />
          </Route>
          <ProtectedRoute
          exact path="/"
          loggedIn={loggedIn}
          component={Main}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          onCardClick={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}>
          </ProtectedRoute>
        </Switch>
        <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser} />
        <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar} />
        <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit} />
        <PopupWithForm
        title='Вы уверены?'
        name='confirm'
        buttonText='Сохранить' />
        <ImagePopup
        isOpen={isImagePopupOpen ? 'popup_opened' : ''}
        onClose={closeAllPopups}
        card={selectedCard} />
        <InfoTooltip
        isOpen={isInfoTooltipOpen.opened}
        onClose={closeAllPopups}
        statusImage={isInfoTooltipOpen.success ? okImage : failImage}
        title={isInfoTooltipOpen.success ? 'Вы успешно зарегистрировались!':'Что-то пошло не так! Попробуйте ещё раз'} />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
