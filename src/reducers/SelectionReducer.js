export default (state = null, action) => {
  switch (action.type) {
    case 'select_train':
      return action.payload;
    default:
      return state;
  }
};
