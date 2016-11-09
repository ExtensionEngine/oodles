import oodletApi from './api/oodlet';

function initStore({ commit }, oodler) {
  commit('oodlerSave', oodler);
  commit('storeInitialized', oodler);
}

function clearStore({ commit }) {
  commit('oodlerClear');
  commit('oodletClear');
  commit('storeUninitialized');
}

function thingyTileAdd({ commit, state }, quantifiedThingy) {
  commit('thingyTileAdd', quantifiedThingy);

  oodletApi.update(state.oodlet).then(response => {
    commit('oodletSet', response.body);
  });
}

function quantifiedThingyChange({ commit, state }, payload) {
  if (payload.qty === 0) {
    commit('quantifiedThingyRemove', payload.id);
  }
  else {
    commit('quantifiedThingyUpdate', payload);
  }

  oodletApi.update(state.oodlet).then(response => {
    commit('oodletSet', response.body);
  });
}

function historyOodletLoad({ commit, state }, oodlet) {
  commit('oodletSetQuantifiedThingies', oodlet.quantifiedThingies);
  
  oodletApi.update(state.oodlet).then(response => {
    commit('oodletSet', response.body);
  });
}

function oodletLoad({ commit, state }) {
  console.log(state.oodler.oodler.id);
  oodletApi.load(state.oodler.oodler).then(response => {
    commit('oodletSet', response.body);
  });
}

function oodletReset({ commit, state }) {
  commit('oodletReset');

  oodletApi.update(state.oodlet).then(response => {
    commit('oodletSet', response.body);
  });
}

export {
  initStore,
  clearStore,
  thingyTileAdd,
  quantifiedThingyChange,
  historyOodletLoad,
  oodletLoad,
  oodletReset
};
