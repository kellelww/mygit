import { Creators } from '../action';
import { connect } from 'react-redux';

export function dispatchMapper(list = []) {
  return dispatch => {
    const actions = list.reduce((map, method) => {
      map[method] = (...args) => {
        const m = Creators[method](...args);
        return dispatch(m);
      };
      return map;
    }, {});
    return {
      actions
    }; 
  };
}

export function mapAllStateToProps(state) {
  return state;
}

const allDispatcherList = Object.keys(Creators);

export const mapAllDispatchToProps = dispatchMapper(allDispatcherList);

export function connectAll(Component) {
  return connect(mapAllStateToProps, mapAllDispatchToProps)(Component);
}
