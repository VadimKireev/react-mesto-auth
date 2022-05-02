class Api {
  constructor(config) {
    this._cardsUrl = config.cardsUrl;
    this._userInfoUrl = config.userInfoUrl;
    this._userAvatarUrl = config.userAvatarUrl;
    this._headers = config.headers;
  }

  getUserInfo() {
    return fetch(this._userInfoUrl, {
      method: 'GET',
      headers: this._headers
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject('Что-то не так с запросом информации о пользователе');
    });
  }

  editUserInfo(data) {
    return fetch(this._userInfoUrl, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data)
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject('Не удалось изменить информацию о пользователе')
    });
  }

  editUserAvatar(newAvatarUrl) {
    return fetch(this._userAvatarUrl, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(newAvatarUrl)
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject('Что-то не так с загрузкой нового аватара')
    });
  }

  getCards() {
    return fetch(this._cardsUrl, {
      method: 'GET',
      headers: this._headers
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject('Не удалось отобразить карточки');
    });
  }

  postCard(data) {
    return fetch(this._cardsUrl, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data)
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject('Не удалось загрузить карточку')
    });
  }

  deleteCard(id) {
    return fetch(`${this._cardsUrl}${id}`, {
      method: 'DELETE',
      headers: this._headers
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject('Карточка удалилась криво')
    });
  }

  // putLike(id) {
  //   return fetch(`${this._cardsUrl}${id}/likes`, {
  //     method: 'PUT',
  //     headers: this._headers
  //   }).then((res) => {
  //     if (res.ok) {
  //       return res.json();
  //     }
  //     return Promise.reject('Не удалось поставить лайк')
  //   });
  // }

  // deleteLike(id) {
  //   return fetch(`${this._cardsUrl}${id}/likes`, {
  //     method: 'DELETE',
  //     headers: this._headers
  //   }).then((res) => {
  //     if (res.ok) {
  //       return res.json();
  //     }
  //     return Promise.reject('Не удалось убрать лайк')
  //   });
  // }

  changeLikeCardStatus(id, isLiked) {
    return fetch(`${this._cardsUrl}${id}/likes`, {
      method: isLiked ? 'DELETE' : 'PUT',
      headers: this._headers
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject('Не удалось поставить или удалить лайк')
    });
  }
}

const api = new Api({
  cardsUrl: 'https://mesto.nomoreparties.co/v1/cohort-37/cards/',
  userInfoUrl: 'https://nomoreparties.co/v1/cohort-37/users/me/',
  userAvatarUrl: 'https://mesto.nomoreparties.co/v1/cohort-37/users/me/avatar/',
  headers: {
    authorization: '0d42fc8d-987f-4cd6-8e38-433e5816658e',
    'Content-Type': 'application/json'
  }
});

export default api;
