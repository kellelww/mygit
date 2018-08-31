import Immutable from 'seamless-immutable';
import moment from 'moment';
import { createReducer } from 'reduxsauce';
import { Types } from '../action';
import forEach from 'lodash/forEach';

const INITIAL_STATE = Immutable({ filter: {}, name: {} });

const setFilters = (state = INITIAL_STATE, data) => {
  // // console.log('setFilters');
  state = state.merge({ filter: data.filter }, { deep: true });
  return state;
};

const setName = (state = INITIAL_STATE, data) => {
  // // console.log('setName');
  state = state.merge({ name: data.name }, { deep: true });
  return state;
};

const setWorkshop = ( state = INITIAL_STATE, data) => {
  // // console.log('setWorkshop',data,"======");  
  state = state.merge({ workshop: data.workshop }, { deep: true });
  return state;
};

const setMenu = ( state = INITIAL_STATE, data) => {
  state = state.merge({ menu: data.menu }, { deep: true });
  return state;
}

const setDefaultkey = ( state = INITIAL_STATE, data) => {
  state = state.merge({ defaultkey: data.defaultkey }, { deep: true });
  return state;
}

export const HANDLERS = {
  [Types.SET_FILTERS]: setFilters,
  [Types.SET_NAME]: setName,
  [Types.SET_WORKSHOP]: setWorkshop,
  [Types.SET_MENU]: setMenu,
  [Types.SET_DEFAULTKEY]: setDefaultkey
};

export default createReducer(INITIAL_STATE, HANDLERS);
