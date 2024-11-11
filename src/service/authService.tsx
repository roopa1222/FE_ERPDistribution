const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (token !== null) {
    return false;
  }
  return true;
};

// let logoutUser = () => {
//     Cookies.remove('jwt',{ path: '/', domain: configData.DOMAIN  })
//     secureLocalStorage.clear();
// }

export { isAuthenticated };
