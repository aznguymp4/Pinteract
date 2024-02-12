const [SET_QUERY,SET_PLACEHOLDER,SET_ENABLE] = ['search/SET_QUERY','search/SET_PLACEHOLDER','search/SET_ENABLE']
export const setQuery = query => ({
	type: SET_QUERY,
	query
})
export const setPlaceholder = placeholder => ({
	type: SET_PLACEHOLDER,
	placeholder
})
export const setEnable = enabled => ({
	type: SET_ENABLE,
	enabled
})

const searchReducer = (state={query:'',placeholder:'',enabled:true}, action) => {
	switch (action.type) {
    case SET_QUERY:
      return { ...state, query: action.query};
    case SET_PLACEHOLDER:
      return { ...state, placeholder: action.placeholder};
    case SET_ENABLE:
      return { ...state, enabled: action.enabled};
		default:
			return state;
	}
};

export default searchReducer;