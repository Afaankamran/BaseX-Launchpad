import application from './application/reducer';
import { combineReducers } from '@reduxjs/toolkit';
import multicall from './multicall/reducer';
import transactions from './transactions/reducer';
import user from './user/reducer';
import burn from './burn/reducer'
import create from './create/reducer'
import lists from './lists/reducer'
import mint from './mint/reducer'
import swap from './swap/reducer'

const reducer = combineReducers({
  application,
  transactions,
  multicall,
  user,
  swap,
  mint,
  burn,
  lists,
  create,
});

export default reducer;
