 import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';
import { Types, Creators } from '../action/index';

export default function* root() {
  yield [takeLatest(Types.SET_FILTERS, test)];
}

function* test() {
  yield put(Creators.setName('yhy'));
}
