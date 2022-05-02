import { useState, useEffect } from 'react';
import logo from '../images/header-logo.svg';
import '../index';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({name: '', link: ''});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

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
    });
  }

  const handleCardDelete = (card) => {
    api.deleteCard(card._id)
    .then(() => {
      setCards((state) => state.filter((c) => c._id === card._id ? !c : c));
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

  return (
  <CurrentUserContext.Provider value={currentUser}>
    <div className="page">
      <Header logo={logo} />
      <Main
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        onEditAvatar={handleEditAvatarClick}
        onCardClick={handleCardClick}
        cards={cards}
        onCardLike={handleCardLike}
        onCardDelete={handleCardDelete} />
      <Footer />
      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
      <PopupWithForm
        title='Вы уверены?'
        name='confirm'
        buttonText='Сохранить' />
      <ImagePopup
      isOpen={isImagePopupOpen ? 'popup_opened' : ''}
      onClose={closeAllPopups}
      card={selectedCard} />
    </div>
  </CurrentUserContext.Provider>
  );
}

export default App;
