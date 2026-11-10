// Anno Tracker — app state, rendering, and persistence. Loads after js/data/*.js.
(function () {
  'use strict';

  var STORAGE_KEY = 'annoTrackerState';

  function defaultIslandState(region) {
    var reg = window.ANNO_REGIONS[region];
    var fertilities = {}, resources = {}, population = {}, lifestyleOn = {};
    reg.fertilities.forEach(function (g) { fertilities[g] = false; });
    reg.resources.forEach(function (g) { resources[g] = 0; });
    reg.tiers.forEach(function (t) { population[t.key] = { pop: 0, occ: t.baseCapacity }; lifestyleOn[t.key] = false; });
    return { name: 'New Island', region: region, fertilities: fertilities, resources: resources, population: population, lifestyleOn: lifestyleOn, pausedNeeds: {}, buildCounts: {}, chainPaused: {}, checklist: [] };
  }

  function todayStr() { return new Date().toISOString().slice(0, 10); }

  function defaultState() {
    var fortuna = defaultIslandState('old-world');
    fortuna.name = "Fortuna's Rest";
    fortuna.checklist = [
      { text: 'Expand farmer housing district', done: false, cat: 'general' },
      { text: 'Connect to Old World trade route', done: false, cat: 'supply' }
    ];
    fortuna.fertilities = { Potatoes: true, Grain: true, Hops: true, 'Red Peppers': false, Furs: false, Saltpetre: false, Grapes: false };
    fortuna.resources = { Iron: 2, Clay: 0, Coal: 0, Cement: 0, Copper: 0, Zinc: 0, Oil: 0 };
    fortuna.population = {
      farmers: { pop: 420, occ: 10 }, workers: { pop: 280, occ: 20 }, artisans: { pop: 90, occ: 30 },
      engineers: { pop: 600, occ: 40 }, investors: { pop: 100, occ: 50 }
    };
    var oakhollow = defaultIslandState('old-world'); oakhollow.name = 'Oakhollow';
    var thornback = defaultIslandState('old-world'); thornback.name = 'Thornback Isle';

    return {
      currentGameId: 'game1',
      currentIslandId: 'island1',
      games: {
        game1: {
          name: 'Lindwurm',
          islandOrder: ['island1', 'island2', 'island3'],
          difficulty: '', beginDate: todayStr(), lastUpdate: null, checklist: [],
          tradeRoutes: [{
            id: 'route1', name: 'Old World Circuit',
            stops: [{ type: 'island', islandId: 'island1' }, { type: 'island', islandId: 'island2' }, { type: 'island', islandId: 'island3' }],
            cargo: [
              { good: 'Schnapps', quantity: 500, timeMinutes: 12, fromStop: 0, toStop: 1 },
              { good: 'Tools', quantity: 200, timeMinutes: 10, fromStop: 1, toStop: 2 },
              { good: 'Bricks', quantity: 300, timeMinutes: 12, fromStop: 2, toStop: 0 }
            ]
          }]
        }
      },
      gameOrder: ['game1'],
      islands: { island1: fortuna, island2: oakhollow, island3: thornback }
    };
  }

  // Routes saved under the old stopIds/goods shape (pre trade-leg model) get upgraded in place, not discarded.
  function migrateRoute(route) {
    if (route.stops && route.cargo) return route;
    var stops = (route.stopIds || []).map(function (id) { return { type: 'island', islandId: id }; });
    var cargo = (route.goods || []).map(function (good, i) {
      return { good: good, quantity: 0, timeMinutes: null, fromStop: i, toStop: (i + 1) % Math.max(stops.length, 1) };
    });
    route.stops = stops;
    route.cargo = cargo;
    delete route.stopIds;
    delete route.goods;
    return route;
  }

  function normalizeState(state) {
    Object.keys(state.games || {}).forEach(function (gid) {
      var g = state.games[gid];
      (g.tradeRoutes || []).forEach(migrateRoute);
      if (g.difficulty === undefined) g.difficulty = '';
      if (g.beginDate === undefined) g.beginDate = todayStr();
      if (g.lastUpdate === undefined) g.lastUpdate = null;
      if (g.checklist === undefined) g.checklist = [];
    });
    Object.keys(state.islands || {}).forEach(function (iid) {
      if (state.islands[iid].checklist === undefined) state.islands[iid].checklist = [];
    });
    return state;
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return normalizeState(JSON.parse(raw));
    } catch (e) { /* fall through to default */ }
    return defaultState();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
    } catch (e) { /* storage unavailable, silently skip */ }
    pushStateToCloud();
  }

  var STATE = loadState();

  // ---- Supabase sync: localStorage stays the instant local copy, Supabase is what carries
  // state between browsers/devices. Last write (by timestamp) wins — there's no per-user
  // auth here, just a single shared row per the project's "shared passphrase gate" model.
  var SUPABASE_URL = 'https://fljzhgfmgswqxhatezhn.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_mPSg2RcST_3rw3wYrfO-5A_Uta3Nj12';
  var STATE_ROW_ID = 'default';
  var sb = (window.supabase && window.supabase.createClient)
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
  var cloudPushTimer = null;

  function pushStateToCloud() {
    if (!sb) return;
    clearTimeout(cloudPushTimer);
    cloudPushTimer = setTimeout(function () {
      sb.from('anno_state')
        .upsert({ id: STATE_ROW_ID, data: STATE, updated_at: new Date().toISOString() })
        .then(function (res) { if (res.error) console.error('Anno Tracker: cloud save failed', res.error); });
    }, 800);
  }

  function pullStateFromCloud() {
    if (!sb) return;
    sb.from('anno_state').select('data').eq('id', STATE_ROW_ID).maybeSingle()
      .then(function (res) {
        if (res.error) { console.error('Anno Tracker: cloud load failed', res.error); return; }
        if (res.data && res.data.data) {
          STATE = normalizeState(res.data.data);
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE)); } catch (e) { /* ignore */ }
          renderAll();
        } else {
          pushStateToCloud();
        }
      });
  }

  function currentGame() { return STATE.games[STATE.currentGameId]; }
  function currentIsland() { return STATE.islands[STATE.currentIslandId]; }
  function currentRegion() { return window.ANNO_REGIONS[currentIsland().region]; }
  function escAttr(s) { return String(s).replace(/"/g, '&quot;'); }
  function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function needKey(tier, good) { return tier + '|' + good; }
  // Reduced input:output ratio as a single bare number (e.g. 1 for 1:1, 2 for 2:1) — used on narrow screens
  // where there's no room for the full good-name chip.
  function formatRatio(inputRate, outputRate) {
    var n = outputRate > 0 ? inputRate / outputRate : inputRate;
    return (Math.round(n * 100) / 100).toString();
  }
  function buildKey(chainName, buildName) { return chainName + '|' + buildName; }

  // ===== rendering =====
  function renderAll() {
    renderGameAndIslandPickers();
    renderIslandFields();
    renderResources();
    renderPopulation();
    renderNeeds();
    renderProduction();
    recalcTotals();
    renderTrade();
    renderIslandChecklist();
    renderHome();
    document.querySelectorAll('table.sortable').forEach(enableSort);
  }

  // ===== checklist (shared by Islands' per-island list and both Home checklists) =====
  function checklistArrayFor(ref) {
    if (ref === 'game') return currentGame().checklist;
    if (ref && ref.indexOf('island:') === 0) {
      var isl = STATE.islands[ref.slice('island:'.length)];
      return isl ? isl.checklist : null;
    }
    return null;
  }

  var CHECKLIST_CATS = { general: 'General', trade: 'Trade', supply: 'Supply chain', quest: 'Quest', other: 'Other' };

  function renderChecklistInto(containerId, ref) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.dataset.checklistRef = ref;
    var list = checklistArrayFor(ref) || [];
    container.innerHTML = list.map(function (item, idx) {
      var cat = item.cat || 'general';
      return '<label class="check-item' + (item.done ? ' done' : '') + '" data-idx="' + idx + '">'
        + '<span class="drag-handle">&#10240;</span>'
        + '<input type="checkbox"' + (item.done ? ' checked' : '') + '>'
        + '<input class="item-text" value="' + escAttr(item.text || '') + '" placeholder="New item&hellip;">'
        + '<span class="tags"><button type="button" class="cat-pill" data-cat="' + cat + '">' + (CHECKLIST_CATS[cat] || cat) + '</button></span>'
        + '<button class="check-remove" type="button">&times;</button></label>';
    }).join('') + '<div class="add-item-row"><button class="add-item-btn" type="button">+ Add item</button></div>';
  }

  function renderIslandChecklist() {
    renderChecklistInto('island-checklist', 'island:' + STATE.currentIslandId);
  }

  // ===== Home tab =====
  function renderHomeGameInfo() {
    var game = currentGame();
    var sel = document.getElementById('home-game-select');
    if (sel) {
      sel.innerHTML = STATE.gameOrder.map(function (id) {
        return '<option value="' + id + '"' + (id === STATE.currentGameId ? ' selected' : '') + '>' + escHtml(STATE.games[id].name) + '</option>';
      }).join('');
    }
    var beginEl = document.getElementById('home-begin-date');
    if (beginEl) beginEl.value = game.beginDate || '';
    var lastEl = document.getElementById('home-last-update');
    if (lastEl) lastEl.value = game.lastUpdate || '';
    var diffEl = document.getElementById('home-difficulty');
    if (diffEl) diffEl.value = game.difficulty || '';
  }

  function renderHomeGameChecklist() {
    renderChecklistInto('home-game-checklist', 'game');
  }

  function renderHomeIslandChecklists() {
    var game = currentGame();
    var container = document.getElementById('home-island-checklists');
    if (!container) return;
    container.innerHTML = game.islandOrder.map(function (islandId) {
      return '<p class="subsection-label" style="margin-top:12px;">' + escHtml(STATE.islands[islandId].name) + '</p>'
        + '<div class="checklist-sub" id="home-island-checklist-' + islandId + '"></div>';
    }).join('');
    game.islandOrder.forEach(function (islandId) {
      renderChecklistInto('home-island-checklist-' + islandId, 'island:' + islandId);
    });
  }

  function renderHomeTradeRoutes() {
    var game = currentGame();
    var container = document.getElementById('home-trade-routes');
    if (!container) return;
    container.innerHTML = game.tradeRoutes.map(function (route) {
      var stopsText = route.stops.map(stopLabel).join(' → ');
      return '<div class="route-card"><div class="route-head"><b>' + escHtml(route.name) + '</b></div>'
        + '<p class="subtext" style="margin:4px 0;">' + escHtml(stopsText) + ' &mdash; ' + route.cargo.length + ' cargo leg' + (route.cargo.length === 1 ? '' : 's') + '</p></div>';
    }).join('') || '<p class="subtext">No trade routes yet.</p>';
  }

  function ledgerRowHtml(good, entry) {
    var total = entry.production + (entry.trade || 0);
    var diff = total - entry.need;
    var diffClass = diff >= 0 ? 'surplus' : 'deficit';
    return '<tr data-good="' + good + '">'
      + '<td>' + good + '</td>'
      + '<td class="num" data-sort-value="' + entry.production + '">' + entry.production.toFixed(2) + '</td>'
      + '<td class="num" data-sort-value="' + (entry.trade || 0) + '">' + ((entry.trade || 0) >= 0 ? '+' : '') + (entry.trade || 0).toFixed(2) + '</td>'
      + '<td class="num" data-sort-value="' + total + '">' + total.toFixed(2) + '</td>'
      + '<td class="num" data-sort-value="' + entry.need + '">' + entry.need.toFixed(2) + '</td>'
      + '<td class="num sc-diff ' + diffClass + '" data-sort-value="' + diff + '">' + (diff >= 0 ? '+' : '') + diff.toFixed(2) + '</td>'
      + '</tr>';
  }

  var REGION_NAMES = { 'old-world': 'Old World', 'new-world': 'New World', arctic: 'Arctic', enbesa: 'Enbesa' };

  function renderHomeLedgers() {
    var game = currentGame();

    var gameLedger = computeGameLedger(game);
    var gameRows = document.getElementById('home-ledger-game-rows');
    if (gameRows) gameRows.innerHTML = Object.keys(gameLedger).sort().map(function (g) { return ledgerRowHtml(g, gameLedger[g]); }).join('');

    var regionLedgers = computeRegionLedgers(game);
    var regionContainer = document.getElementById('home-ledger-region-tables');
    if (regionContainer) {
      regionContainer.innerHTML = Object.keys(regionLedgers).sort().map(function (regionKey) {
        var ledger = regionLedgers[regionKey];
        return '<p class="subsection-label">' + (REGION_NAMES[regionKey] || regionKey) + '</p>'
          + '<table class="data-table sortable ledger-table"><thead><tr><th data-sort="text">Good</th><th data-sort="num" class="num">Production</th><th data-sort="num" class="num">Trade</th><th data-sort="num" class="num">Total</th><th data-sort="num" class="num">Need</th><th data-sort="num" class="num">Difference</th></tr></thead>'
          + '<tbody>' + Object.keys(ledger).sort().map(function (g) { return ledgerRowHtml(g, ledger[g]); }).join('') + '</tbody></table>';
      }).join('');
      document.querySelectorAll('#home-ledger-region-tables table.sortable').forEach(enableSort);
    }

    var islandLedgers = computeIslandLedgers(game);
    var islandHead = document.getElementById('home-ledger-island-head');
    var islandRows = document.getElementById('home-ledger-island-rows');
    if (islandHead && islandRows) {
      var islandIds = game.islandOrder;
      islandHead.innerHTML = '<th data-sort="text">Good</th>' + islandIds.map(function (id) {
        return '<th class="num" colspan="3">' + escHtml(STATE.islands[id].name) + '</th>';
      }).join('');
      var allGoods = {};
      islandIds.forEach(function (id) { Object.keys(islandLedgers[id]).forEach(function (g) { allGoods[g] = true; }); });
      islandRows.innerHTML = Object.keys(allGoods).sort().map(function (g) {
        var cells = islandIds.map(function (id) {
          var e = islandLedgers[id][g] || { production: 0, need: 0, trade: 0 };
          var total = e.production + (e.trade || 0);
          var diff = total - e.need;
          var diffClass = diff >= 0 ? 'surplus' : 'deficit';
          return '<td class="num">' + e.production.toFixed(2) + '</td><td class="num">' + e.need.toFixed(2) + '</td>'
            + '<td class="num sc-diff ' + diffClass + '">' + (diff >= 0 ? '+' : '') + diff.toFixed(2) + '</td>';
        }).join('');
        return '<tr><td>' + g + '</td>' + cells + '</tr>';
      }).join('');
    }
  }

  function renderHome() {
    renderHomeGameInfo();
    renderHomeGameChecklist();
    renderHomeIslandChecklists();
    renderHomeTradeRoutes();
    renderHomeLedgers();
  }

  // ===== Calculator (sandbox — same math as Islands, never persisted) =====
  // One in-memory island-shaped object per region; CALC_STATE is deliberately never touched by saveState()/loadState().
  var CALC_STATE = {};
  ['old-world', 'new-world', 'arctic', 'enbesa'].forEach(function (r) { CALC_STATE[r] = defaultIslandState(r); });
  var CALC_REGION = 'old-world';
  function calcIsland() { return CALC_STATE[CALC_REGION]; }
  function calcRegionData() { return window.ANNO_REGIONS[CALC_REGION]; }

  function renderCalc() {
    renderCalcResources();
    renderCalcPopulation();
    renderCalcNeeds();
    renderCalcProduction();
    document.querySelectorAll('#panel-calculator table.sortable').forEach(enableSort);
  }

  function renderCalcResources() {
    var island = calcIsland(), region = calcRegionData();
    document.getElementById('calc-fertilities-body').innerHTML = region.fertilities.map(function (good) {
      var on = !!island.fertilities[good];
      return '<tr class="' + (on ? 'present' : '') + '" data-good="' + escAttr(good) + '">'
        + '<td>' + escHtml(good) + '</td>'
        + '<td><button type="button" class="fert-pill" data-fertile="' + on + '">' + (on ? 'Fertile' : 'Missing') + '</button></td>'
        + '</tr>';
    }).join('');
    document.getElementById('calc-resources-body-rows').innerHTML = region.resources.map(function (good) {
      var count = island.resources[good] || 0;
      return '<tr class="' + (count > 1 ? 'present' : '') + '" data-good="' + escAttr(good) + '">'
        + '<td>' + escHtml(good) + '</td>'
        + '<td class="num"><input type="text" class="resource-count-input editable-num num-right" value="' + (count ? count : '') + '" placeholder="#"></td>'
        + '</tr>';
    }).join('');
  }

  function renderCalcPopulation() {
    var island = calcIsland(), region = calcRegionData();
    var list = document.getElementById('calc-pop-list');
    list.innerHTML = region.tiers.slice().sort(function (a, b) { return a.order - b.order; }).map(function (t) {
      var p = island.population[t.key] || { pop: 0, occ: t.baseCapacity };
      return '<div class="pop-row" data-tier="' + t.key + '" data-base-capacity="' + t.baseCapacity + '">'
        + '<span class="pop-card-tier">' + escHtml(t.label) + '</span>'
        + '<span class="pop-stat pop-stat-count"><input type="text" class="pop-count-input editable-num" value="' + (p.pop || '') + '" placeholder="#"> pop</span>'
        + '<span class="pop-stat pop-stat-houses"><input type="text" class="pop-houses-input editable-num" value="" placeholder="#"> houses</span>'
        + '<div class="pop-bar-track"><div class="pop-bar-fill" style="width:0%;"></div></div>'
        + '<div class="pop-card-stats">'
        + '<span class="pop-stat"><input type="text" class="pop-occupancy-input editable-num" value="' + (p.occ || t.baseCapacity) + '" placeholder="#"> occ/house</span>'
        + '</div></div>';
    }).join('');
    var root = calcPanelRoot();
    list.querySelectorAll('.pop-row').forEach(function (card) { updateTierPopulationScoped(card, root); });
  }

  function renderCalcNeeds() {
    var island = calcIsland(), region = calcRegionData();
    var tiersSorted = region.tiers.slice().sort(function (a, b) { return a.order - b.order; });

    document.getElementById('calc-needs-tier-heads').innerHTML = tiersSorted.map(function (t) {
      var on = !!island.lifestyleOn[t.key];
      return '<div class="needs-tier-mini"><span class="needs-tier-name">' + escHtml(t.label) + '</span>'
        + '<span class="needs-tier-occupancy" data-tier="' + t.key + '">0 houses</span>'
        + '<button type="button" class="lifestyle-toggle" data-on="' + on + '" data-tier="' + t.key + '">Lifestyle needs: ' + (on ? 'On' : 'Off') + '</button></div>';
    }).join('');

    var rowsHtml = tiersSorted.map(function (t) {
      var needsForTier = region.needs.filter(function (n) { return n.tier === t.key; });
      return needsForTier.map(function (n) {
        var isLifestyle = n.type === 'lifestyle';
        var pop = (island.population[t.key] || {}).pop || 0;
        var locked = n.unlockType === 'local' && pop < n.unlockCount;
        var paused = !!island.pausedNeeds[needKey(t.key, n.good)];
        var typeLabel = n.type.charAt(0).toUpperCase() + n.type.slice(1);
        var rowClasses = ['need-row'];
        if (isLifestyle) rowClasses.push('lifestyle-row');
        if (isLifestyle && island.lifestyleOn[t.key]) rowClasses.push('visible');
        if (locked) rowClasses.push('locked');
        if (paused) rowClasses.push('paused');
        var firstCell = locked
          ? '<span class="need-row-lock">&#8211;</span>'
          : '<button type="button" class="need-play-toggle" data-on="' + (!paused) + '">&#9654;</button>';
        var nameCell = escHtml(n.good) + (locked ? '<span class="need-unlock">Unlocks at ' + n.unlockCount + ' ' + escHtml(t.label) + '</span>' : '');
        var attrs = ' data-tier="' + t.key + '" data-good="' + escAttr(n.good) + '" data-rate="' + n.rate + '" data-type="' + n.type + '"'
          + (n.unlockType ? ' data-unlock-type="' + n.unlockType + '" data-unlock-count="' + n.unlockCount + '"' : '');
        return '<tr class="' + rowClasses.join(' ') + '"' + attrs + '>'
          + '<td>' + firstCell + '</td><td>' + escHtml(t.label) + '</td><td>' + nameCell + '</td><td>' + typeLabel + '</td>'
          + '<td class="num need-rate-cell">' + (locked ? 'Locked' : '0.00 t/min') + '</td></tr>';
      }).join('');
    }).join('');

    document.getElementById('calc-needs-table-body').innerHTML = rowsHtml;
    var root = calcPanelRoot();
    root.querySelectorAll('.pop-row').forEach(function (card) { updateTierPopulationScoped(card, root); });
  }

  function renderCalcProduction() {
    var island = calcIsland(), region = calcRegionData();
    var container = document.getElementById('calc-production-chains');
    container.innerHTML = region.chains.map(function (chain, chainIdx) {
      var bodyId = 'calc-chain-body-' + chainIdx;
      var paused = !!island.chainPaused[chain.name];
      var buildsHtml = chain.builds.map(function (b) {
        var count = island.buildCounts[buildKey(chain.name, b.name)];
        if (count === undefined) count = b.count;
        var inputsHtml = b.inputs.map(function (inp) {
          var ratio = inp.rate.toFixed(2) + ':' + b.outputRate.toFixed(2);
          return '<span class="consumes-pair">'
            + '<span class="ratio-tag" title="Input : Output, per single building">' + ratio + '</span>'
            + '<span class="input-chip" data-good="' + escAttr(inp.good) + '" data-category="' + inp.category + '" data-rate="' + inp.rate + '">' + escHtml(inp.good) + '</span>'
            + '<span class="ratio-num" title="' + escAttr(inp.good) + '">' + formatRatio(inp.rate, b.outputRate) + '</span>'
            + '</span>';
        }).join('');
        return '<tr class="chain-build" data-good="' + escAttr(b.good) + '" data-output-rate="' + b.outputRate + '" data-chain="' + chainIdx + '" data-build="' + escAttr(b.name) + '">'
          + '<td>' + escHtml(b.name) + '</td>'
          + '<td class="num"><input type="text" class="chain-count-input editable-num num-right" value="' + (count || '') + '" placeholder="#"></td>'
          + '<td class="num chain-build-output">0.00 t/min</td>'
          + '<td class="consumes-col"><div class="consumes-cell-inner">' + inputsHtml + '</div></td></tr>';
      }).join('');
      return '<div class="chain-group" data-final-good="' + escAttr(chain.finalGood) + '" data-chain-name="' + escAttr(chain.name) + '">'
        + '<button type="button" class="chain-group-head collapsed" data-toggle="' + bodyId + '">'
        + '<span class="play-toggle" data-on="' + (!paused) + '">&#9654;</span>'
        + '<span class="chain-group-name">' + escHtml(chain.name.replace(/\s+chain$/i, '')) + '</span>'
        + '<span class="chain-group-output">0.00 t/min</span>'
        + '<span class="chevron">&#9662;</span></button>'
        + '<div class="lv2-toggle-body chain-group-body collapsed" id="' + bodyId + '">'
        + '<table class="data-table sortable"><thead><tr><th data-sort="text">Building</th><th data-sort="num" class="num">Count</th><th data-sort="num" class="num">Output</th><th class="consumes-col">Consumes</th></tr></thead><tbody>' + buildsHtml + '</tbody></table>'
        + (chain.note ? '<p class="chain-note">' + escHtml(chain.note) + '</p>' : '')
        + '</div></div>';
    }).join('');
    recalcCalcProduction();
  }

  function recalcCalcProduction() {
    var root = calcPanelRoot();
    root.querySelectorAll('.chain-group').forEach(function (group) {
      var masterOn = group.querySelector('.play-toggle').dataset.on === 'true';
      group.classList.toggle('paused', !masterOn);
      var lastOutput = 0;
      group.querySelectorAll('tr.chain-build').forEach(function (build) {
        var input = build.querySelector('.chain-count-input');
        var count = masterOn ? Math.max(0, parseInt(input.value, 10) || 0) : 0;
        var rate = parseFloat(build.dataset.outputRate);
        var output = count * rate;
        build.dataset.activeOutput = output;
        build.querySelector('.chain-build-output').textContent = output.toFixed(2) + ' t/min';
        build.querySelectorAll('.input-chip').forEach(function (chip) {
          var activeRate = parseFloat(chip.dataset.rate) * count;
          chip.dataset.activeRate = activeRate;
          chip.textContent = chip.dataset.good + ' · ' + activeRate.toFixed(2) + ' t/min';
        });
        lastOutput = output;
      });
      var headline = group.querySelector('.chain-group-output');
      if (headline) headline.textContent = lastOutput.toFixed(2) + ' t/min';
    });
    recalcCalcSupplyChain();
  }

  function recalcCalcSupplyChain() {
    var root = calcPanelRoot();
    var goods = {};
    root.querySelectorAll('tr.chain-build[data-good]').forEach(function (b) { goods[b.dataset.good] = true; });
    root.querySelectorAll('.input-chip').forEach(function (c) { goods[c.dataset.good] = true; });
    root.querySelectorAll('tr.need-row[data-good]').forEach(function (n) { goods[n.dataset.good] = true; });

    var rowsHtml = Object.keys(goods).sort().map(function (good) {
      var production = 0;
      root.querySelectorAll('tr.chain-build[data-good="' + good + '"]').forEach(function (b) {
        production += parseFloat(b.dataset.activeOutput) || 0;
      });
      var need = 0;
      root.querySelectorAll('tr.need-row[data-good="' + good + '"]').forEach(function (row) {
        if (row.classList.contains('locked') || row.classList.contains('paused')) return;
        if (row.classList.contains('lifestyle-row') && !row.classList.contains('visible')) return;
        var val = parseFloat(row.querySelector('.need-rate-cell').textContent);
        if (!isNaN(val)) need += val;
      });
      root.querySelectorAll('.input-chip[data-good="' + good + '"]').forEach(function (chip) {
        need += parseFloat(chip.dataset.activeRate) || 0;
      });
      var diff = production - need;
      var diffClass = diff >= 0 ? 'surplus' : 'deficit';
      return '<tr data-good="' + good + '">'
        + '<td>' + good + '</td>'
        + '<td class="num" data-sort-value="' + production + '">' + production.toFixed(2) + '</td>'
        + '<td class="num" data-sort-value="' + need + '">' + need.toFixed(2) + '</td>'
        + '<td class="num sc-diff ' + diffClass + '" data-sort-value="' + diff + '">' + (diff >= 0 ? '+' : '') + diff.toFixed(2) + '</td>'
        + '</tr>';
    }).join('');

    var scBodyRows = document.getElementById('calc-sc-body-rows');
    if (scBodyRows) scBodyRows.innerHTML = rowsHtml;
  }

  function recalcCalcCategoryTotals() { /* no category-totals UI in the Calculator — kept out intentionally */ }

  function handleCalcClick(e) {
    var fertPill = e.target.closest('.fert-pill');
    if (fertPill) {
      var isFertile = fertPill.dataset.fertile === 'true';
      fertPill.dataset.fertile = (!isFertile).toString();
      fertPill.textContent = isFertile ? 'Missing' : 'Fertile';
      fertPill.closest('tr').classList.toggle('present', !isFertile);
      calcIsland().fertilities[fertPill.closest('tr').dataset.good] = !isFertile;
      return true;
    }
    var needPlay = e.target.closest('.need-play-toggle');
    if (needPlay) {
      var needRow = needPlay.closest('tr');
      var wasOn = needPlay.dataset.on === 'true';
      needPlay.dataset.on = (!wasOn).toString();
      needRow.classList.toggle('paused', wasOn);
      var key = needKey(needRow.dataset.tier, needRow.dataset.good);
      if (wasOn) calcIsland().pausedNeeds[key] = true; else delete calcIsland().pausedNeeds[key];
      var root = calcPanelRoot();
      var popRow = root.querySelector('.pop-row[data-tier="' + needRow.dataset.tier + '"]');
      if (popRow) updateTierPopulationScoped(popRow, root);
      recalcCalcSupplyChain();
      return true;
    }
    var chainPlay = e.target.closest('.chain-group .play-toggle');
    if (chainPlay) {
      var chainGroup = chainPlay.closest('.chain-group');
      var isOn = chainPlay.dataset.on === 'true';
      chainPlay.dataset.on = (!isOn).toString();
      calcIsland().chainPaused[chainGroup.dataset.chainName] = isOn;
      recalcCalcProduction();
      return true;
    }
    var lifestyleToggle = e.target.closest('.lifestyle-toggle');
    if (lifestyleToggle) {
      var isOnLs = lifestyleToggle.dataset.on === 'true';
      lifestyleToggle.dataset.on = (!isOnLs).toString();
      lifestyleToggle.textContent = 'Lifestyle needs: ' + (isOnLs ? 'Off' : 'On');
      var lsTier = lifestyleToggle.dataset.tier;
      calcIsland().lifestyleOn[lsTier] = !isOnLs;
      calcPanelRoot().querySelectorAll('tr.need-row.lifestyle-row[data-tier="' + lsTier + '"]').forEach(function (row) {
        row.classList.toggle('visible', !isOnLs);
      });
      recalcCalcSupplyChain();
      return true;
    }
    return false;
  }

  function handleCalcInput(e) {
    if (e.target.matches('.resource-count-input')) {
      var count = parseInt(e.target.value, 10) || 0;
      e.target.closest('tr').classList.toggle('present', count > 1);
      calcIsland().resources[e.target.closest('tr').dataset.good] = count;
      return true;
    }
    if (e.target.matches('.pop-count-input, .pop-occupancy-input')) {
      var row = e.target.closest('.pop-row');
      var root = calcPanelRoot();
      updateTierPopulationScoped(row, root);
      var tier = row.dataset.tier;
      calcIsland().population[tier] = {
        pop: parseInt(row.querySelector('.pop-count-input').value, 10) || 0,
        occ: parseInt(row.querySelector('.pop-occupancy-input').value, 10) || row.dataset.baseCapacity
      };
      recalcCalcSupplyChain();
      return true;
    }
    if (e.target.matches('.pop-houses-input')) {
      var hRow = e.target.closest('.pop-row');
      var hOcc = parseInt(hRow.querySelector('.pop-occupancy-input').value, 10) || parseFloat(hRow.dataset.baseCapacity) || 1;
      var hHouses = parseInt(e.target.value, 10) || 0;
      var hNewPop = hHouses * hOcc;
      hRow.querySelector('.pop-count-input').value = hNewPop || '';
      updateTierPopulationScoped(hRow, calcPanelRoot());
      calcIsland().population[hRow.dataset.tier] = { pop: hNewPop, occ: hOcc };
      recalcCalcSupplyChain();
      return true;
    }
    if (e.target.matches('.chain-count-input')) {
      var build = e.target.closest('.chain-build');
      var group = build.closest('.chain-group');
      calcIsland().buildCounts[buildKey(group.dataset.chainName, build.dataset.build)] = parseInt(e.target.value, 10) || 0;
      recalcCalcProduction();
      return true;
    }
    return false;
  }

  function renderGameAndIslandPickers() {
    var game = currentGame();
    var gameSelect = document.getElementById('game-select');
    gameSelect.innerHTML = STATE.gameOrder.map(function (id) {
      return '<option value="' + id + '"' + (id === STATE.currentGameId ? ' selected' : '') + '>' + escHtml(STATE.games[id].name) + '</option>';
    }).join('');

    var islandSelect = document.getElementById('island-select');
    islandSelect.innerHTML = game.islandOrder.map(function (id) {
      return '<option value="' + id + '"' + (id === STATE.currentIslandId ? ' selected' : '') + '>' + escHtml(STATE.islands[id].name) + '</option>';
    }).join('');

    document.getElementById('crumb-game-name').textContent = game.name;
    document.getElementById('delete-game-btn').disabled = STATE.gameOrder.length <= 1;
    document.getElementById('delete-island-btn').disabled = game.islandOrder.length <= 1;
  }

  function renderIslandFields() {
    var island = currentIsland();
    var regionNames = { 'old-world': 'Old World', 'new-world': 'New World', 'arctic': 'Arctic', 'enbesa': 'Enbesa' };
    var regionPill = document.getElementById('region-current');
    regionPill.dataset.region = island.region;
    regionPill.textContent = regionNames[island.region];
  }

  function renderResources() {
    var island = currentIsland(), region = currentRegion();
    var fertBody = document.getElementById('fertilities-body');
    fertBody.innerHTML = region.fertilities.map(function (good) {
      var on = !!island.fertilities[good];
      return '<tr class="' + (on ? 'present' : '') + '" data-good="' + escAttr(good) + '">'
        + '<td>' + escHtml(good) + '</td>'
        + '<td><button type="button" class="fert-pill" data-fertile="' + on + '">' + (on ? 'Fertile' : 'Missing') + '</button></td>'
        + '</tr>';
    }).join('');

    var resBody = document.getElementById('resources-body-rows');
    resBody.innerHTML = region.resources.map(function (good) {
      var count = island.resources[good] || 0;
      return '<tr class="' + (count > 1 ? 'present' : '') + '" data-good="' + escAttr(good) + '">'
        + '<td>' + escHtml(good) + '</td>'
        + '<td class="num"><input type="text" class="resource-count-input editable-num num-right" value="' + (count ? count : '') + '" placeholder="#"></td>'
        + '</tr>';
    }).join('');

    document.getElementById('abundance-row').innerHTML = region.abundances.map(function (g) {
      return '<span class="abundance-pill">' + escHtml(g) + '</span>';
    }).join('');
  }

  function renderPopulation() {
    var island = currentIsland(), region = currentRegion();
    var list = document.getElementById('pop-list');
    list.innerHTML = region.tiers.slice().sort(function (a, b) { return a.order - b.order; }).map(function (t) {
      var p = island.population[t.key] || { pop: 0, occ: t.baseCapacity };
      return '<div class="pop-row" data-tier="' + t.key + '" data-base-capacity="' + t.baseCapacity + '">'
        + '<span class="pop-card-tier">' + escHtml(t.label) + '</span>'
        + '<span class="pop-stat pop-stat-count"><input type="text" class="pop-count-input editable-num" value="' + (p.pop || '') + '" placeholder="#"> pop</span>'
        + '<span class="pop-stat pop-stat-houses"><input type="text" class="pop-houses-input editable-num" value="" placeholder="#"> houses</span>'
        + '<div class="pop-bar-track"><div class="pop-bar-fill" style="width:0%;"></div></div>'
        + '<div class="pop-card-stats">'
        + '<span class="pop-stat"><input type="text" class="pop-occupancy-input editable-num" value="' + (p.occ || t.baseCapacity) + '" placeholder="#"> occ/house</span>'
        + '</div></div>';
    }).join('');
    list.querySelectorAll('.pop-row').forEach(updateTierPopulation);
  }

  function renderNeeds() {
    var island = currentIsland(), region = currentRegion();
    var tiersSorted = region.tiers.slice().sort(function (a, b) { return a.order - b.order; });

    document.getElementById('needs-tier-heads').innerHTML = tiersSorted.map(function (t) {
      var on = !!island.lifestyleOn[t.key];
      return '<div class="needs-tier-mini"><span class="needs-tier-name">' + escHtml(t.label) + '</span>'
        + '<span class="needs-tier-occupancy" data-tier="' + t.key + '">0 houses</span>'
        + '<button type="button" class="lifestyle-toggle" data-on="' + on + '" data-tier="' + t.key + '">Lifestyle needs: ' + (on ? 'On' : 'Off') + '</button></div>';
    }).join('');

    var rowsHtml = tiersSorted.map(function (t) {
      var needsForTier = region.needs.filter(function (n) { return n.tier === t.key; });
      return needsForTier.map(function (n) {
        var isLifestyle = n.type === 'lifestyle';
        var pop = (island.population[t.key] || {}).pop || 0;
        var locked = n.unlockType === 'local' && pop < n.unlockCount;
        var paused = !!island.pausedNeeds[needKey(t.key, n.good)];
        var typeLabel = n.type.charAt(0).toUpperCase() + n.type.slice(1);
        var rowClasses = ['need-row'];
        if (isLifestyle) rowClasses.push('lifestyle-row');
        if (isLifestyle && island.lifestyleOn[t.key]) rowClasses.push('visible');
        if (locked) rowClasses.push('locked');
        if (paused) rowClasses.push('paused');
        var firstCell = locked
          ? '<span class="need-row-lock">&#8211;</span>'
          : '<button type="button" class="need-play-toggle" data-on="' + (!paused) + '">&#9654;</button>';
        var nameCell = escHtml(n.good) + (locked ? '<span class="need-unlock">Unlocks at ' + n.unlockCount + ' ' + escHtml(t.label) + '</span>' : '');
        var attrs = ' data-tier="' + t.key + '" data-good="' + escAttr(n.good) + '" data-rate="' + n.rate + '" data-type="' + n.type + '"'
          + (n.unlockType ? ' data-unlock-type="' + n.unlockType + '" data-unlock-count="' + n.unlockCount + '"' : '');
        return '<tr class="' + rowClasses.join(' ') + '"' + attrs + '>'
          + '<td>' + firstCell + '</td><td>' + escHtml(t.label) + '</td><td>' + nameCell + '</td><td>' + typeLabel + '</td>'
          + '<td class="num need-rate-cell">' + (locked ? 'Locked' : '0.00 t/min') + '</td></tr>';
      }).join('');
    }).join('');

    document.getElementById('needs-table-body').innerHTML = rowsHtml;
    islandsRoot().querySelectorAll('.pop-row').forEach(updateTierPopulation);
  }

  function renderProduction() {
    var island = currentIsland(), region = currentRegion();
    var container = document.getElementById('production-chains');
    container.innerHTML = region.chains.map(function (chain, chainIdx) {
      var bodyId = 'chain-body-' + chainIdx;
      var paused = !!island.chainPaused[chain.name];
      var buildsHtml = chain.builds.map(function (b) {
        var count = island.buildCounts[buildKey(chain.name, b.name)];
        if (count === undefined) count = b.count;
        var inputsHtml = b.inputs.map(function (inp) {
          // ratio is the recipe's fixed input:output rate per single building — a reference, not editable, doesn't move with count
          var ratio = inp.rate.toFixed(2) + ':' + b.outputRate.toFixed(2);
          return '<span class="consumes-pair">'
            + '<span class="ratio-tag" title="Input : Output, per single building">' + ratio + '</span>'
            + '<span class="input-chip" data-good="' + escAttr(inp.good) + '" data-category="' + inp.category + '" data-rate="' + inp.rate + '">' + escHtml(inp.good) + '</span>'
            + '<span class="ratio-num" title="' + escAttr(inp.good) + '">' + formatRatio(inp.rate, b.outputRate) + '</span>'
            + '</span>';
        }).join('');
        return '<tr class="chain-build" data-good="' + escAttr(b.good) + '" data-output-rate="' + b.outputRate + '" data-chain="' + chainIdx + '" data-build="' + escAttr(b.name) + '">'
          + '<td>' + escHtml(b.name) + '</td>'
          + '<td class="num"><input type="text" class="chain-count-input editable-num num-right" value="' + (count || '') + '" placeholder="#"></td>'
          + '<td class="num chain-build-output">0.00 t/min</td>'
          + '<td class="consumes-col"><div class="consumes-cell-inner">' + inputsHtml + '</div></td></tr>';
      }).join('');
      return '<div class="chain-group" data-final-good="' + escAttr(chain.finalGood) + '" data-chain-name="' + escAttr(chain.name) + '">'
        + '<button type="button" class="chain-group-head collapsed" data-toggle="' + bodyId + '">'
        + '<span class="play-toggle" data-on="' + (!paused) + '">&#9654;</span>'
        + '<span class="chain-group-name">' + escHtml(chain.name.replace(/\s+chain$/i, '')) + '</span>'
        + '<span class="chain-group-output">0.00 t/min</span>'
        + '<span class="chain-group-consumers">&mdash;</span>'
        + '<span class="chevron">&#9662;</span></button>'
        + '<div class="lv2-toggle-body chain-group-body collapsed" id="' + bodyId + '">'
        + '<table class="data-table sortable"><thead><tr><th data-sort="text">Building</th><th data-sort="num" class="num">Count</th><th data-sort="num" class="num">Output</th><th class="consumes-col">Consumes</th></tr></thead><tbody>' + buildsHtml + '</tbody></table>'
        + (chain.note ? '<p class="chain-note">' + escHtml(chain.note) + '</p>' : '')
        + '<div class="used-by"></div></div></div>';
    }).join('');
    recalcProduction();
  }

  // A stop is either a player island (type:'island') or an outside party (type:'npc', free-text label) —
  // trade isn't locked to only the islands this app tracks; an NPC stop is just a sink/source with no state of its own.
  function stopLabel(stop) {
    if (!stop) return '(unknown)';
    if (stop.type === 'npc') return stop.label || 'NPC / Trading Post';
    var isl = STATE.islands[stop.islandId];
    return isl ? isl.name : '(deleted island)';
  }
  function stopIsCurrentIsland(stop) { return stop && stop.type === 'island' && stop.islandId === STATE.currentIslandId; }
  function cargoRate(c) { return (c.quantity && c.timeMinutes) ? c.quantity / c.timeMinutes : null; }

  function renderTrade() {
    var game = currentGame();
    var container = document.getElementById('trade-routes');
    container.innerHTML = game.tradeRoutes.map(function (route, routeIdx) {
      var stopOptionsHtml = function (selectedIdx) {
        return route.stops.map(function (s, i) {
          return '<option value="' + i + '"' + (i === selectedIdx ? ' selected' : '') + '>' + escHtml(stopLabel(s)) + '</option>';
        }).join('');
      };
      var stopOptionValuesHtml = function (stop) {
        var opts = game.islandOrder.map(function (id) {
          var sel = (stop.type === 'island' && stop.islandId === id) ? ' selected' : '';
          return '<option value="island:' + id + '"' + sel + '>' + escHtml(STATE.islands[id].name) + '</option>';
        }).join('');
        opts += '<option value="npc"' + (stop.type === 'npc' ? ' selected' : '') + '>NPC / Trading Post&hellip;</option>';
        return opts;
      };
      var stopsHtml = route.stops.map(function (stop, i) {
        var removeStop = route.stops.length > 1
          ? '<button type="button" class="remove-stop-btn" data-stop="' + i + '" title="Remove stop">&times;</button>' : '';
        var selectHtml = '<select class="stop-select' + (stopIsCurrentIsland(stop) ? ' current-island' : '') + '" data-stop="' + i + '">' + stopOptionValuesHtml(stop) + '</select>';
        var npcInput = stop.type === 'npc'
          ? '<input type="text" class="stop-npc-input editable-num" data-stop="' + i + '" value="' + escAttr(stop.label || '') + '" placeholder="NPC name">' : '';
        return (i > 0 ? ' &rarr; ' : '') + '<span class="route-stop">' + selectHtml + npcInput + removeStop + '</span>';
      }).join('');

      var cargoRowsHtml = route.cargo.map(function (c, cargoIdx) {
        var rate = cargoRate(c);
        return '<tr data-route="' + routeIdx + '" data-cargo="' + cargoIdx + '">'
          + '<td data-label="Good"><input type="text" class="cargo-good-input editable-num" value="' + escAttr(c.good || '') + '" placeholder="#"></td>'
          + '<td class="num" data-label="Quantity"><input type="text" class="cargo-qty-input editable-num num-right" value="' + (c.quantity || '') + '" placeholder="#"></td>'
          + '<td class="num" data-label="Time"><input type="text" class="cargo-time-input editable-num num-right" value="' + (c.timeMinutes || '') + '" placeholder="#"></td>'
          + '<td class="num" data-label="Rate">' + (rate !== null ? rate.toFixed(2) + ' t/min' : '—') + '</td>'
          + '<td data-label="From"><select class="cargo-from-select">' + stopOptionsHtml(c.fromStop) + '</select></td>'
          + '<td data-label="To"><select class="cargo-to-select">' + stopOptionsHtml(c.toStop) + '</select></td>'
          + '<td><button type="button" class="remove-cargo-btn" data-cargo="' + cargoIdx + '" title="Remove cargo">&times;</button></td>'
          + '</tr>';
      }).join('');

      return '<div class="route-card" data-route="' + routeIdx + '">'
        + '<div class="route-head"><input type="text" class="route-name-input editable-num" value="' + escAttr(route.name) + '">'
        + '<button type="button" class="btn-ghost add-stop-btn" style="margin:0;">+ Stop</button></div>'
        + '<div class="route-stops">' + stopsHtml + '</div>'
        + '<table class="data-table sortable">'
        + '<thead><tr><th data-sort="text">Good</th><th data-sort="num" class="num">Quantity (t/trip)</th><th data-sort="num" class="num">Time (min, optional)</th><th class="num">Rate (t/min)</th><th>From</th><th>To</th><th></th></tr></thead>'
        + '<tbody>' + cargoRowsHtml + '</tbody></table>'
        + '<button type="button" class="btn-ghost add-cargo-btn">+ Add cargo</button>'
        + '</div>';
    }).join('');
    document.querySelectorAll('#trade-routes table.sortable').forEach(enableSort);
  }

  // ===== calculations (same math as before, now data-driven) =====
  // Islands and the Calculator sandbox share CSS classes for visual parity, so every query below is scoped to
  // one panel's root — otherwise a bare document.querySelectorAll would double-hit both panels' same-named elements.
  function islandsRoot() { return document.getElementById('panel-islands'); }
  function calcPanelRoot() { return document.getElementById('panel-calculator'); }

  function updateTierPopulation(card) { updateTierPopulationScoped(card, islandsRoot()); }
  function updateTierPopulationScoped(card, root) {
    var tier = card.dataset.tier;
    var baseCapacity = parseFloat(card.dataset.baseCapacity) || 1;
    var pop = parseInt(card.querySelector('.pop-count-input').value, 10) || 0;
    var occupancyInput = parseInt(card.querySelector('.pop-occupancy-input').value, 10) || 0;
    var occupancy = occupancyInput > 0 ? occupancyInput : baseCapacity;
    var houses = Math.ceil(pop / occupancy);
    var totalCapacity = houses * occupancy;
    var pct = totalCapacity > 0 ? Math.min(100, (pop / totalCapacity) * 100) : 0;
    card.querySelector('.pop-bar-fill').style.width = pct + '%';
    var housesInput = card.querySelector('.pop-houses-input');
    if (housesInput && document.activeElement !== housesInput) housesInput.value = houses || '';

    var occupancyLabel = root.querySelector('.needs-tier-occupancy[data-tier="' + tier + '"]');
    if (occupancyLabel) occupancyLabel.textContent = houses + ' houses';

    var housesEquivalent = houses * (occupancy / baseCapacity);
    root.querySelectorAll('tr.need-row[data-tier="' + tier + '"][data-rate]').forEach(function (row) {
      var rate = parseFloat(row.dataset.rate);
      var rateCell = row.querySelector('.need-rate-cell');
      if (row.dataset.unlockType === 'local') {
        var threshold = parseFloat(row.dataset.unlockCount);
        var locked = pop < threshold;
        row.classList.toggle('locked', locked);
        rateCell.textContent = locked ? 'Locked' : (rate * housesEquivalent).toFixed(2) + ' t/min';
        return;
      }
      if (row.classList.contains('paused')) { rateCell.textContent = 'Paused'; return; }
      rateCell.textContent = (rate * housesEquivalent).toFixed(2) + ' t/min';
    });
  }

  function recalcProduction() {
    islandsRoot().querySelectorAll('.chain-group').forEach(function (group) {
      var masterOn = group.querySelector('.play-toggle').dataset.on === 'true';
      group.classList.toggle('paused', !masterOn);
      var builds = group.querySelectorAll('tr.chain-build');
      var lastOutput = 0;
      builds.forEach(function (build) {
        var input = build.querySelector('.chain-count-input');
        var count = masterOn ? Math.max(0, parseInt(input.value, 10) || 0) : 0;
        var rate = parseFloat(build.dataset.outputRate);
        var output = count * rate;
        build.dataset.activeOutput = output;
        build.querySelector('.chain-build-output').textContent = output.toFixed(2) + ' t/min';
        build.querySelectorAll('.input-chip').forEach(function (chip) {
          var activeRate = parseFloat(chip.dataset.rate) * count;
          chip.dataset.activeRate = activeRate;
          chip.textContent = chip.dataset.good + ' · ' + activeRate.toFixed(2) + ' t/min';
        });
        lastOutput = output;
      });
      var headline = group.querySelector('.chain-group-output');
      if (headline) headline.textContent = lastOutput.toFixed(2) + ' t/min';
      var consumersEl = group.querySelector('.chain-group-consumers');
      if (consumersEl) {
        var usedBy = usedByFor(group.dataset.finalGood);
        var tiers = [];
        usedBy.needs.concat(usedBy.lifestyles).forEach(function (entry) {
          if (tiers.indexOf(entry.tier) === -1) tiers.push(entry.tier);
        });
        consumersEl.textContent = tiers.length ? tiers.join(', ') : '—';
      }
    });
    renderUsedByTables();
    recalcTotals();
  }

  function cssEscapeAttr(s) { return s.replace(/"/g, '\\"'); }

  function usedByFor(good) {
    var needs = [], lifestyles = [];
    islandsRoot().querySelectorAll('tr.need-row[data-good="' + cssEscapeAttr(good) + '"]').forEach(function (row) {
      var tier = row.dataset.tier;
      var label = tier.charAt(0).toUpperCase() + tier.slice(1);
      var active = !row.classList.contains('locked') && !row.classList.contains('paused');
      var rateText = active ? row.querySelector('.need-rate-cell').textContent : '—';
      var entry = { tier: label, rate: rateText };
      if (row.dataset.type === 'lifestyle') lifestyles.push(entry); else needs.push(entry);
    });
    return { needs: needs, lifestyles: lifestyles };
  }

  function renderUsedByTables() {
    islandsRoot().querySelectorAll('.chain-group').forEach(function (group) {
      var good = group.dataset.finalGood;
      var usedBy = usedByFor(good);
      var rowCount = Math.max(usedBy.needs.length, usedBy.lifestyles.length, 1);
      var rowsHtml = '';
      for (var i = 0; i < rowCount; i++) {
        var n = usedBy.needs[i], l = usedBy.lifestyles[i];
        rowsHtml += '<tr><td>' + (n ? n.tier : '—') + '</td><td class="num">' + (n ? n.rate : '—') + '</td>'
          + '<td class="divider-col">' + (l ? l.tier : '—') + '</td><td class="num">' + (l ? l.rate : '—') + '</td></tr>';
      }
      var container = group.querySelector('.used-by');
      if (container) {
        container.innerHTML = '<p class="used-by-label">Used by — ' + good + '</p>'
          + '<table class="used-by-table"><thead><tr><th>Population (type)</th><th>Needs (use)</th><th class="divider-col">Population (type)</th><th>Lifestyle (use)</th></tr></thead><tbody>' + rowsHtml + '</tbody></table>';
      }
    });
  }

  function recalcCategoryTotals() {
    var totals = { raw: 0, agricultural: 0, intermediate: 0, construction: 0, consumer: 0 };
    var detail = { raw: [], agricultural: [], intermediate: [], construction: [], consumer: [] };
    islandsRoot().querySelectorAll('.input-chip').forEach(function (chip) {
      var cat = chip.dataset.category;
      var val = parseFloat(chip.dataset.activeRate) || 0;
      if (!totals.hasOwnProperty(cat) || val <= 0) return;
      totals[cat] += val;
      detail[cat].push(chip.dataset.good + ': ' + val.toFixed(2) + ' t/min');
    });
    islandsRoot().querySelectorAll('tr.need-row[data-rate]').forEach(function (row) {
      if (row.classList.contains('locked') || row.classList.contains('paused')) return;
      if (row.classList.contains('lifestyle-row') && !row.classList.contains('visible')) return;
      var val = parseFloat(row.querySelector('.need-rate-cell').textContent);
      if (isNaN(val) || val <= 0) return;
      totals.consumer += val;
      detail.consumer.push(row.dataset.good + ': ' + val.toFixed(2) + ' t/min');
    });
    Object.keys(totals).forEach(function (cat) {
      var el = document.getElementById('cat-' + cat);
      if (el) el.textContent = totals[cat].toFixed(2) + ' t/min';
      var detailEl = document.getElementById('cat-detail-' + cat);
      if (detailEl) {
        detailEl.innerHTML = detail[cat].length
          ? detail[cat].map(function (line) { return '<span class="category-detail-chip">' + line + '</span>'; }).join('')
          : '<span class="category-detail-chip">Nothing active in this category</span>';
      }
    });
  }

  // Net trade for a good, from one island's point of view: legs arriving there add, legs leaving there subtract —
  // this covers NPC stops for free, since an NPC destination never matches, so it only ever subtracts (goods leaving
  // the tracked system), never adds. Legs with no time recorded don't contribute (no rate to sum).
  function tradeNetForGoodAndIsland(good, islandId) {
    var net = 0, any = false;
    currentGame().tradeRoutes.forEach(function (route) {
      route.cargo.forEach(function (c) {
        if (c.good !== good) return;
        var rate = cargoRate(c);
        if (rate === null) return;
        any = true;
        var from = route.stops[c.fromStop], to = route.stops[c.toStop];
        if (to && to.type === 'island' && to.islandId === islandId) net += rate;
        if (from && from.type === 'island' && from.islandId === islandId) net -= rate;
      });
    });
    return any ? net : null;
  }
  function tradeNetForGood(good) { return tradeNetForGoodAndIsland(good, STATE.currentIslandId); }

  // ===== pure, data-only ledger math (no DOM reads) — reused by the Home tab's game/region/island rollups =====
  function computeIslandProductionAndNeed(island) {
    var region = window.ANNO_REGIONS[island.region];
    var production = {}, need = {};
    region.chains.forEach(function (chain) {
      var paused = !!island.chainPaused[chain.name];
      chain.builds.forEach(function (b) {
        var count = island.buildCounts[buildKey(chain.name, b.name)];
        if (count === undefined) count = b.count;
        count = paused ? 0 : Math.max(0, count);
        var output = count * b.outputRate;
        production[b.good] = (production[b.good] || 0) + output;
        b.inputs.forEach(function (inp) {
          need[inp.good] = (need[inp.good] || 0) + inp.rate * count;
        });
      });
    });
    region.tiers.forEach(function (t) {
      var p = island.population[t.key] || { pop: 0, occ: t.baseCapacity };
      var pop = p.pop || 0;
      var occupancy = p.occ > 0 ? p.occ : t.baseCapacity;
      var houses = Math.ceil(pop / occupancy);
      var housesEquivalent = houses * (occupancy / t.baseCapacity);
      region.needs.filter(function (n) { return n.tier === t.key; }).forEach(function (n) {
        if (n.type === 'lifestyle' && !island.lifestyleOn[t.key]) return;
        if (n.unlockType === 'local' && pop < n.unlockCount) return;
        if (island.pausedNeeds[needKey(t.key, n.good)]) return;
        need[n.good] = (need[n.good] || 0) + n.rate * housesEquivalent;
      });
    });
    return { production: production, need: need };
  }

  function mergeLedgerEntry(target, good, key, val) {
    target[good] = target[good] || { production: 0, need: 0, trade: 0 };
    target[good][key] += val;
  }

  // Game/region rollups sum every matching cargo leg's rate regardless of direction (not netted) — simpler, at the
  // cost of double-counting transfers between two of the game's own islands. Island rollups below stay signed.
  function computeGameLedger(game) {
    var result = {};
    game.islandOrder.forEach(function (islandId) {
      var pn = computeIslandProductionAndNeed(STATE.islands[islandId]);
      Object.keys(pn.production).forEach(function (g) { mergeLedgerEntry(result, g, 'production', pn.production[g]); });
      Object.keys(pn.need).forEach(function (g) { mergeLedgerEntry(result, g, 'need', pn.need[g]); });
    });
    game.tradeRoutes.forEach(function (route) {
      route.cargo.forEach(function (c) {
        if (!c.good) return;
        var rate = cargoRate(c);
        if (rate === null) return;
        mergeLedgerEntry(result, c.good, 'trade', rate);
      });
    });
    return result;
  }

  function computeRegionLedgers(game) {
    var byRegion = {}, islandRegion = {};
    game.islandOrder.forEach(function (islandId) {
      var island = STATE.islands[islandId];
      islandRegion[islandId] = island.region;
      var bucket = byRegion[island.region] = byRegion[island.region] || {};
      var pn = computeIslandProductionAndNeed(island);
      Object.keys(pn.production).forEach(function (g) { mergeLedgerEntry(bucket, g, 'production', pn.production[g]); });
      Object.keys(pn.need).forEach(function (g) { mergeLedgerEntry(bucket, g, 'need', pn.need[g]); });
    });
    game.tradeRoutes.forEach(function (route) {
      route.cargo.forEach(function (c) {
        if (!c.good) return;
        var rate = cargoRate(c);
        if (rate === null) return;
        var from = route.stops[c.fromStop], to = route.stops[c.toStop];
        var touched = {};
        [from, to].forEach(function (stop) {
          if (stop && stop.type === 'island' && islandRegion[stop.islandId]) touched[islandRegion[stop.islandId]] = true;
        });
        Object.keys(touched).forEach(function (regionKey) {
          var bucket = byRegion[regionKey] = byRegion[regionKey] || {};
          mergeLedgerEntry(bucket, c.good, 'trade', rate);
        });
      });
    });
    return byRegion;
  }

  function computeIslandLedgers(game) {
    var byIsland = {};
    game.islandOrder.forEach(function (islandId) {
      var island = STATE.islands[islandId];
      var pn = computeIslandProductionAndNeed(island);
      var goods = {};
      Object.keys(pn.production).forEach(function (g) { goods[g] = true; });
      Object.keys(pn.need).forEach(function (g) { goods[g] = true; });
      game.tradeRoutes.forEach(function (route) {
        route.cargo.forEach(function (c) {
          if (!c.good) return;
          var from = route.stops[c.fromStop], to = route.stops[c.toStop];
          var touches = (from && from.type === 'island' && from.islandId === islandId) || (to && to.type === 'island' && to.islandId === islandId);
          if (touches) goods[c.good] = true;
        });
      });
      var bucket = {};
      Object.keys(goods).forEach(function (g) {
        bucket[g] = { production: pn.production[g] || 0, need: pn.need[g] || 0, trade: tradeNetForGoodAndIsland(g, islandId) || 0 };
      });
      byIsland[islandId] = bucket;
    });
    return byIsland;
  }

  function recalcSupplyChain() {
    var root = islandsRoot();
    var goods = {};
    root.querySelectorAll('tr.chain-build[data-good]').forEach(function (b) { goods[b.dataset.good] = true; });
    root.querySelectorAll('.input-chip').forEach(function (c) { goods[c.dataset.good] = true; });
    root.querySelectorAll('tr.need-row[data-good]').forEach(function (n) { goods[n.dataset.good] = true; });
    currentGame().tradeRoutes.forEach(function (route) {
      route.cargo.forEach(function (c) { if (c.good) goods[c.good] = true; });
    });

    var rowsHtml = Object.keys(goods).sort().map(function (good) {
      var production = 0;
      root.querySelectorAll('tr.chain-build[data-good="' + good + '"]').forEach(function (b) {
        production += parseFloat(b.dataset.activeOutput) || 0;
      });
      var need = 0;
      root.querySelectorAll('tr.need-row[data-good="' + good + '"]').forEach(function (row) {
        if (row.classList.contains('locked') || row.classList.contains('paused')) return;
        if (row.classList.contains('lifestyle-row') && !row.classList.contains('visible')) return;
        var val = parseFloat(row.querySelector('.need-rate-cell').textContent);
        if (!isNaN(val)) need += val;
      });
      root.querySelectorAll('.input-chip[data-good="' + good + '"]').forEach(function (chip) {
        need += parseFloat(chip.dataset.activeRate) || 0;
      });
      var trade = tradeNetForGood(good);
      var total = production + (trade || 0);
      var diff = total - need;
      var diffClass = diff >= 0 ? 'surplus' : 'deficit';
      return '<tr data-good="' + good + '">'
        + '<td>' + good + '</td>'
        + '<td class="num" data-sort-value="' + production + '">' + production.toFixed(2) + '</td>'
        + '<td class="num"' + (trade !== null ? ' data-sort-value="' + trade + '"' : '') + '>' + (trade !== null ? (trade >= 0 ? '+' : '') + trade.toFixed(2) : '—') + '</td>'
        + '<td class="num" data-sort-value="' + total + '">' + total.toFixed(2) + '</td>'
        + '<td class="num" data-sort-value="' + need + '">' + need.toFixed(2) + '</td>'
        + '<td class="num sc-diff ' + diffClass + '" data-sort-value="' + diff + '">' + (diff >= 0 ? '+' : '') + diff.toFixed(2) + '</td>'
        + '</tr>';
    }).join('');

    var scBodyRows = document.getElementById('sc-body-rows');
    if (scBodyRows) scBodyRows.innerHTML = rowsHtml;
  }

  function recalcTotals() {
    recalcCategoryTotals();
    recalcSupplyChain();
  }

  // ===== generic sortable table =====
  function cellSortValue(cell) {
    if (cell.dataset.sortValue !== undefined) return cell.dataset.sortValue;
    var input = cell.querySelector('input');
    if (input) return input.value;
    return cell.textContent.trim();
  }

  function enableSort(table) {
    if (table.dataset.sortBound) return;
    table.dataset.sortBound = 'true';
    var thead = table.querySelector('thead');
    if (!thead) return;
    thead.querySelectorAll('th[data-sort]').forEach(function (th) {
      th.addEventListener('click', function () {
        var tbody = table.querySelector('tbody');
        var headers = thead.querySelectorAll('th[data-sort]');
        var index = Array.prototype.indexOf.call(th.parentNode.children, th);
        var type = th.dataset.sort;
        var asc = th.dataset.sortDir !== 'asc';
        headers.forEach(function (h) { h.removeAttribute('data-sort-dir'); h.classList.remove('sorted-asc', 'sorted-desc'); });
        th.dataset.sortDir = asc ? 'asc' : 'desc';
        th.classList.add(asc ? 'sorted-asc' : 'sorted-desc');
        var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
        rows.sort(function (a, b) {
          var rawA = cellSortValue(a.children[index]), rawB = cellSortValue(b.children[index]);
          if (type === 'num') {
            var numA = parseFloat(rawA) || 0, numB = parseFloat(rawB) || 0;
            return asc ? numA - numB : numB - numA;
          }
          return asc ? String(rawA).localeCompare(String(rawB)) : String(rawB).localeCompare(String(rawA));
        });
        rows.forEach(function (r) { tbody.appendChild(r); });
      });
    });
  }

  // ===== event wiring =====
  document.addEventListener('click', function (e) {
    var tabBtn = e.target.closest('#main-tabs > .tab');
    if (tabBtn) {
      document.querySelectorAll('#main-tabs > .tab').forEach(function (t) { t.classList.remove('active'); });
      tabBtn.classList.add('active');
      document.querySelectorAll('.panel').forEach(function (p) { p.hidden = true; });
      var panel = document.getElementById(tabBtn.dataset.panel);
      if (panel) panel.hidden = false;
      var crumbTab = document.getElementById('crumb-tab-name');
      if (crumbTab) crumbTab.textContent = tabBtn.textContent.trim();
      if (tabBtn.dataset.panel === 'panel-summary') renderHome();
      if (tabBtn.dataset.panel === 'panel-islands') renderIslandChecklist();
      if (tabBtn.dataset.panel === 'panel-calculator') renderCalc();
      return;
    }
    var calcTab = e.target.closest('.calc-region-tabs .tab');
    if (calcTab) {
      document.querySelectorAll('.calc-region-tabs .tab').forEach(function (t) { t.classList.remove('active'); });
      calcTab.classList.add('active');
      CALC_REGION = calcTab.dataset.calcRegion;
      renderCalc();
      return;
    }
    if (e.target.closest('#panel-calculator')) { if (handleCalcClick(e)) return; }
    var addItem = e.target.closest('.add-item-btn');
    if (addItem) {
      var addContainer = addItem.closest('[data-checklist-ref]');
      if (addContainer) {
        var addArr = checklistArrayFor(addContainer.dataset.checklistRef);
        if (addArr) {
          addArr.push({ text: '', done: false, cat: 'general' });
          saveState();
          renderChecklistInto(addContainer.id, addContainer.dataset.checklistRef);
          var newInput = document.querySelector('#' + addContainer.id + ' .check-item:last-of-type .item-text');
          if (newInput) newInput.focus();
        }
      }
      return;
    }
    var removeRow = e.target.closest('.check-remove');
    if (removeRow) {
      var removeItem = removeRow.closest('.check-item');
      var removeContainer = removeRow.closest('[data-checklist-ref]');
      if (removeContainer) {
        var removeArr = checklistArrayFor(removeContainer.dataset.checklistRef);
        if (removeArr) {
          removeArr.splice(parseInt(removeItem.dataset.idx, 10), 1);
          saveState();
          renderChecklistInto(removeContainer.id, removeContainer.dataset.checklistRef);
        }
      }
      return;
    }

    var catPill = e.target.closest('.cat-pill');
    if (catPill) {
      var catContainer = catPill.closest('[data-checklist-ref]');
      if (catContainer) {
        var catArr = checklistArrayFor(catContainer.dataset.checklistRef);
        var catItem = catPill.closest('.check-item');
        if (catArr && catItem) {
          var catKeys = Object.keys(CHECKLIST_CATS);
          var curCat = catPill.dataset.cat || 'general';
          var nextCat = catKeys[(catKeys.indexOf(curCat) + 1) % catKeys.length];
          catArr[parseInt(catItem.dataset.idx, 10)].cat = nextCat;
          catPill.dataset.cat = nextCat;
          catPill.textContent = CHECKLIST_CATS[nextCat];
          saveState();
        }
      }
      return;
    }

    var toggleHead = e.target.closest('[data-toggle]');
    if (toggleHead && !e.target.closest('.play-toggle')) {
      var toggleTarget = document.getElementById(toggleHead.dataset.toggle);
      if (toggleTarget) {
        var nowCollapsed = toggleTarget.classList.toggle('collapsed');
        toggleHead.classList.toggle('collapsed', nowCollapsed);
      }
      return;
    }

    var needPlay = e.target.closest('.need-play-toggle');
    if (needPlay) {
      var needRow = needPlay.closest('tr');
      var wasOn = needPlay.dataset.on === 'true';
      needPlay.dataset.on = (!wasOn).toString();
      needRow.classList.toggle('paused', wasOn);
      var island = currentIsland();
      var key = needKey(needRow.dataset.tier, needRow.dataset.good);
      if (wasOn) island.pausedNeeds[key] = true; else delete island.pausedNeeds[key];
      var popRow = islandsRoot().querySelector('.pop-row[data-tier="' + needRow.dataset.tier + '"]');
      if (popRow) updateTierPopulation(popRow);
      recalcTotals(); saveState();
      return;
    }

    var chainPlay = e.target.closest('.chain-group .play-toggle');
    if (chainPlay) {
      var chainGroup = chainPlay.closest('.chain-group');
      var isOn = chainPlay.dataset.on === 'true';
      chainPlay.dataset.on = (!isOn).toString();
      currentIsland().chainPaused[chainGroup.dataset.chainName] = isOn;
      recalcProduction(); saveState();
      return;
    }

    var fertPill = e.target.closest('.fert-pill');
    if (fertPill) {
      var isFertile = fertPill.dataset.fertile === 'true';
      fertPill.dataset.fertile = (!isFertile).toString();
      fertPill.textContent = isFertile ? 'Missing' : 'Fertile';
      fertPill.closest('tr').classList.toggle('present', !isFertile);
      currentIsland().fertilities[fertPill.closest('tr').dataset.good] = !isFertile;
      saveState();
      return;
    }

    var regionNames = { 'old-world': 'Old World', 'new-world': 'New World', 'arctic': 'Arctic', 'enbesa': 'Enbesa' };
    var regionCurrent = document.getElementById('region-current');
    var regionPicker = document.getElementById('region-picker');
    var regionConfirm = document.getElementById('region-confirm');

    if (e.target.closest('#region-current')) {
      regionConfirm.hidden = true;
      regionPicker.hidden = !regionPicker.hidden;
      return;
    }
    var regionOption = e.target.closest('.region-option');
    if (regionOption) {
      regionPicker.hidden = true;
      var targetRegion = regionOption.dataset.region;
      if (targetRegion === currentIsland().region) return;
      regionConfirm.dataset.target = targetRegion;
      document.getElementById('region-confirm-target').textContent = regionNames[targetRegion];
      regionConfirm.hidden = false;
      return;
    }
    if (e.target.closest('#region-confirm-cancel')) { regionConfirm.hidden = true; return; }
    if (e.target.closest('#region-confirm-ok')) {
      var newRegion = regionConfirm.dataset.target;
      var island = currentIsland();
      var fresh = defaultIslandState(newRegion);
      island.region = newRegion;
      island.fertilities = fresh.fertilities;
      island.resources = fresh.resources;
      island.population = fresh.population;
      island.lifestyleOn = fresh.lifestyleOn;
      island.pausedNeeds = {};
      island.buildCounts = {};
      island.chainPaused = {};
      regionConfirm.hidden = true;
      saveState();
      renderAll();
      return;
    }
    if (!e.target.closest('.region-field')) { regionPicker.hidden = true; regionConfirm.hidden = true; }

    var lifestyleToggle = e.target.closest('.lifestyle-toggle');
    if (lifestyleToggle) {
      var isOnLs = lifestyleToggle.dataset.on === 'true';
      lifestyleToggle.dataset.on = (!isOnLs).toString();
      lifestyleToggle.textContent = 'Lifestyle needs: ' + (isOnLs ? 'Off' : 'On');
      var lsTier = lifestyleToggle.dataset.tier;
      currentIsland().lifestyleOn[lsTier] = !isOnLs;
      islandsRoot().querySelectorAll('tr.need-row.lifestyle-row[data-tier="' + lsTier + '"]').forEach(function (row) {
        row.classList.toggle('visible', !isOnLs);
      });
      recalcTotals(); saveState();
      return;
    }

    if (e.target.closest('#rename-game-btn')) {
      var renameGame = currentGame();
      var newGameName = prompt('Rename game', renameGame.name);
      if (newGameName !== null && newGameName.trim()) {
        renameGame.name = newGameName.trim();
        saveState(); renderAll();
      }
      return;
    }
    if (e.target.closest('#rename-island-btn')) {
      var renameIsland = currentIsland();
      var newIslandName = prompt('Rename island', renameIsland.name);
      if (newIslandName !== null && newIslandName.trim()) {
        renameIsland.name = newIslandName.trim();
        saveState(); renderAll();
      }
      return;
    }
    if (e.target.closest('#new-island-btn')) {
      var game = currentGame();
      var newId = 'island' + Date.now();
      STATE.islands[newId] = defaultIslandState(currentIsland().region);
      STATE.islands[newId].name = 'New Island';
      game.islandOrder.push(newId);
      STATE.currentIslandId = newId;
      saveState(); renderAll();
      return;
    }
    if (e.target.closest('#new-game-btn')) {
      var newGameId = 'game' + Date.now();
      var newIslandId = 'island' + Date.now();
      STATE.games[newGameId] = { name: 'New Game', islandOrder: [newIslandId], tradeRoutes: [], difficulty: '', beginDate: todayStr(), lastUpdate: null, checklist: [] };
      STATE.islands[newIslandId] = defaultIslandState('old-world');
      STATE.islands[newIslandId].name = "New Island";
      STATE.gameOrder.push(newGameId);
      STATE.currentGameId = newGameId;
      STATE.currentIslandId = newIslandId;
      saveState(); renderAll();
      return;
    }
    if (e.target.closest('#delete-island-btn')) {
      var delGame = currentGame();
      if (delGame.islandOrder.length <= 1) return; // every game keeps at least one island
      var delIdx = delGame.islandOrder.indexOf(STATE.currentIslandId);
      delete STATE.islands[STATE.currentIslandId];
      delGame.islandOrder.splice(delIdx, 1);
      STATE.currentIslandId = delGame.islandOrder[Math.max(0, delIdx - 1)];
      saveState(); renderAll();
      return;
    }
    if (e.target.closest('#delete-game-btn')) {
      if (STATE.gameOrder.length <= 1) return; // keep at least one game
      var delGameId = STATE.currentGameId;
      (STATE.games[delGameId].islandOrder || []).forEach(function (id) { delete STATE.islands[id]; });
      delete STATE.games[delGameId];
      var delGameIdx = STATE.gameOrder.indexOf(delGameId);
      STATE.gameOrder.splice(delGameIdx, 1);
      STATE.currentGameId = STATE.gameOrder[Math.max(0, delGameIdx - 1)];
      STATE.currentIslandId = currentGame().islandOrder[0];
      saveState(); renderAll();
      return;
    }
    var removeStopBtn = e.target.closest('.remove-stop-btn');
    if (removeStopBtn) {
      var stopRoute = currentGame().tradeRoutes[parseInt(removeStopBtn.closest('.route-card').dataset.route, 10)];
      var stopIdx = parseInt(removeStopBtn.dataset.stop, 10);
      if (stopRoute.stops.length <= 1) return; // keep at least one stop
      stopRoute.stops.splice(stopIdx, 1);
      // re-point cargo referencing the removed stop or shift indices after it
      stopRoute.cargo = stopRoute.cargo.filter(function (c) { return c.fromStop !== stopIdx && c.toStop !== stopIdx; }).map(function (c) {
        return { good: c.good, quantity: c.quantity, timeMinutes: c.timeMinutes,
          fromStop: c.fromStop > stopIdx ? c.fromStop - 1 : c.fromStop,
          toStop: c.toStop > stopIdx ? c.toStop - 1 : c.toStop };
      });
      saveState(); renderTrade(); recalcTotals();
      return;
    }
    var removeCargoBtn = e.target.closest('.remove-cargo-btn');
    if (removeCargoBtn) {
      var cargoRoute2 = currentGame().tradeRoutes[parseInt(removeCargoBtn.closest('.route-card').dataset.route, 10)];
      cargoRoute2.cargo.splice(parseInt(removeCargoBtn.dataset.cargo, 10), 1);
      saveState(); renderTrade(); recalcTotals();
      return;
    }

    var addCargoBtn = e.target.closest('.add-cargo-btn');
    if (addCargoBtn) {
      var cargoRouteIdx = parseInt(addCargoBtn.closest('.route-card').dataset.route, 10);
      var cargoRoute = currentGame().tradeRoutes[cargoRouteIdx];
      cargoRoute.cargo.push({ good: '', quantity: 0, timeMinutes: null, fromStop: 0, toStop: Math.min(1, cargoRoute.stops.length - 1) });
      saveState(); renderTrade(); recalcTotals();
      return;
    }
    var addStopBtn = e.target.closest('.add-stop-btn');
    if (addStopBtn) {
      var stopRouteIdx = parseInt(addStopBtn.closest('.route-card').dataset.route, 10);
      currentGame().tradeRoutes[stopRouteIdx].stops.push({ type: 'npc', label: '' });
      saveState(); renderTrade();
      return;
    }
    if (e.target.closest('#add-trade-route-btn')) {
      currentGame().tradeRoutes.push({
        id: 'route' + Date.now(), name: 'New Route',
        stops: [{ type: 'island', islandId: STATE.currentIslandId }, { type: 'npc', label: '' }],
        cargo: []
      });
      saveState(); renderTrade();
      return;
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target.matches('.check-item input[type=checkbox]')) {
      var cbItem = e.target.closest('.check-item');
      cbItem.classList.toggle('done', e.target.checked);
      var cbContainer = e.target.closest('[data-checklist-ref]');
      if (cbContainer) {
        var cbArr = checklistArrayFor(cbContainer.dataset.checklistRef);
        if (cbArr) { cbArr[parseInt(cbItem.dataset.idx, 10)].done = e.target.checked; saveState(); }
      }
    }
    if (e.target.id === 'home-game-select') {
      STATE.currentGameId = e.target.value;
      STATE.currentIslandId = currentGame().islandOrder[0];
      saveState(); renderAll();
    }
    if (e.target.id === 'game-select') {
      STATE.currentGameId = e.target.value;
      STATE.currentIslandId = currentGame().islandOrder[0];
      saveState(); renderAll();
    }
    if (e.target.id === 'island-select') {
      STATE.currentIslandId = e.target.value;
      saveState(); renderAll();
    }
    if (e.target.matches('.cargo-from-select, .cargo-to-select')) {
      var tr = e.target.closest('tr');
      var route = currentGame().tradeRoutes[parseInt(tr.dataset.route, 10)];
      var cargo = route.cargo[parseInt(tr.dataset.cargo, 10)];
      var newFrom = parseInt(tr.querySelector('.cargo-from-select').value, 10);
      var newTo = parseInt(tr.querySelector('.cargo-to-select').value, 10);
      if (newFrom === newTo && route.stops.length > 1) {
        // From and To can't be the same stop — nudge whichever select the user didn't just touch
        if (e.target.classList.contains('cargo-from-select')) newTo = (newFrom + 1) % route.stops.length;
        else newFrom = (newTo + 1) % route.stops.length;
      }
      cargo.fromStop = newFrom;
      cargo.toStop = newTo;
      saveState(); renderTrade(); recalcTotals();
    }
    if (e.target.matches('.stop-select')) {
      var stopCard = e.target.closest('.route-card');
      var stopRoute = currentGame().tradeRoutes[parseInt(stopCard.dataset.route, 10)];
      var stopIdx = parseInt(e.target.dataset.stop, 10);
      var val = e.target.value;
      stopRoute.stops[stopIdx] = val === 'npc' ? { type: 'npc', label: '' } : { type: 'island', islandId: val.slice('island:'.length) };
      saveState(); renderTrade(); recalcTotals();
    }
  });

  document.addEventListener('input', function (e) {
    if (e.target.closest('#panel-calculator')) { handleCalcInput(e); return; }
    var island = currentIsland();
    if (e.target.matches('.resource-count-input')) {
      var count = parseInt(e.target.value, 10) || 0;
      e.target.closest('tr').classList.toggle('present', count > 1);
      island.resources[e.target.closest('tr').dataset.good] = count;
      saveState();
      return;
    }
    if (e.target.matches('.pop-count-input, .pop-occupancy-input')) {
      var row = e.target.closest('.pop-row');
      updateTierPopulation(row);
      var tier = row.dataset.tier;
      island.population[tier] = {
        pop: parseInt(row.querySelector('.pop-count-input').value, 10) || 0,
        occ: parseInt(row.querySelector('.pop-occupancy-input').value, 10) || row.dataset.baseCapacity
      };
      recalcTotals(); saveState();
      return;
    }
    if (e.target.matches('.pop-houses-input')) {
      var hRow = e.target.closest('.pop-row');
      var hOcc = parseInt(hRow.querySelector('.pop-occupancy-input').value, 10) || parseFloat(hRow.dataset.baseCapacity) || 1;
      var hHouses = parseInt(e.target.value, 10) || 0;
      var hNewPop = hHouses * hOcc;
      hRow.querySelector('.pop-count-input').value = hNewPop || '';
      updateTierPopulation(hRow);
      island.population[hRow.dataset.tier] = { pop: hNewPop, occ: hOcc };
      recalcTotals(); saveState();
      return;
    }
    if (e.target.matches('.chain-count-input')) {
      var build = e.target.closest('.chain-build');
      var group = build.closest('.chain-group');
      island.buildCounts[buildKey(group.dataset.chainName, build.dataset.build)] = parseInt(e.target.value, 10) || 0;
      recalcProduction(); saveState();
      return;
    }
    if (e.target.matches('.cargo-good-input, .cargo-qty-input, .cargo-time-input')) {
      var tr = e.target.closest('tr');
      var route = currentGame().tradeRoutes[parseInt(tr.dataset.route, 10)];
      var cargo = route.cargo[parseInt(tr.dataset.cargo, 10)];
      cargo.good = tr.querySelector('.cargo-good-input').value;
      cargo.quantity = parseFloat(tr.querySelector('.cargo-qty-input').value) || 0;
      cargo.timeMinutes = parseFloat(tr.querySelector('.cargo-time-input').value) || null;
      var rate = cargoRate(cargo);
      tr.children[3].textContent = rate !== null ? rate.toFixed(2) + ' t/min' : '—';
      saveState(); recalcTotals();
    }
    if (e.target.matches('.route-name-input')) {
      var routeCard = e.target.closest('.route-card');
      currentGame().tradeRoutes[parseInt(routeCard.dataset.route, 10)].name = e.target.value;
      saveState();
    }
    if (e.target.matches('.stop-npc-input')) {
      var npcCard = e.target.closest('.route-card');
      var npcRoute = currentGame().tradeRoutes[parseInt(npcCard.dataset.route, 10)];
      npcRoute.stops[parseInt(e.target.dataset.stop, 10)].label = e.target.value;
      saveState();
    }
    if (e.target.matches('.item-text')) {
      var itItem = e.target.closest('.check-item');
      var itContainer = e.target.closest('[data-checklist-ref]');
      if (itContainer) {
        var itArr = checklistArrayFor(itContainer.dataset.checklistRef);
        if (itArr) { itArr[parseInt(itItem.dataset.idx, 10)].text = e.target.value; saveState(); }
      }
    }
    if (e.target.id === 'home-begin-date') { currentGame().beginDate = e.target.value; saveState(); }
    if (e.target.id === 'home-last-update') { currentGame().lastUpdate = e.target.value; saveState(); }
    if (e.target.id === 'home-difficulty') { currentGame().difficulty = e.target.value; saveState(); }
  });

  function init() { renderAll(); pullStateFromCloud(); }
  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();
})();
