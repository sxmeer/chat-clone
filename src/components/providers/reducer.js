export const initialState = {
  // user: {
  //   displayName: "John Doe",
  //   email: "johndoe@gmail.com",
  //   photoURL: "https://www.socialketchup.in/wp-content/uploads/2020/05/fi-vill-JOHN-DOE.jpg"
  // },
  // user: {
  //   displayName: "Steven Smith",
  //   email: "stevensmith@gmail.com",
  //   photoURL: "https://m.cricbuzz.com/a/img/v1/192x192/i1/c170624/steven-smith.jpg"
  // },
  user: null,
  initMessageLoading: true
};



export const actionTypes = {
  SET_USER: "SET_USER",
  SET_INIT_MESSAGE_LOADING: "SET_INIT_MESSAGE_LOADING"
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_INIT_MESSAGE_LOADING:
      return {
        ...state,
        initMessageLoading: action.value
      }
    default:
      return state;
  }
};

export default reducer;