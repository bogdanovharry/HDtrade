/* Interactive cutaway house — "Коя система къде?"
   Click/tap a hotspot or tab (or use the arrow keys) to show that system. */
(function () {
  document.querySelectorAll('.house').forEach(function (house) {
    var stage = house.querySelector('.house-stage');
    var order = Array.prototype.map.call(house.querySelectorAll('.house-tab'), function (b) { return b.dataset.sys; });
    var pinned = order[0];

    function show(sys) {
      stage.dataset.active = sys;
      house.querySelectorAll('.house-info').forEach(function (el) { el.hidden = el.dataset.sys !== sys; });
      house.querySelectorAll('.house-spot, .house-tab').forEach(function (b) {
        var on = b.dataset.sys === sys;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      house.querySelectorAll('.hs-sys').forEach(function (g) { g.classList.toggle('is-active', g.dataset.sys === sys); });
    }

    house.addEventListener('click', function (e) {
      var b = e.target.closest('.house-spot, .house-tab'); if (!b) return;
      pinned = b.dataset.sys; show(pinned);
    });
    // arrow keys move between systems
    house.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var b = e.target.closest('.house-spot, .house-tab'); if (!b) return;
      var i = order.indexOf(b.dataset.sys) + (e.key === 'ArrowRight' ? 1 : -1);
      var next = order[(i + order.length) % order.length];
      var sel = b.classList.contains('house-tab') ? '.house-tab' : '.house-spot';
      house.querySelector(sel + '[data-sys="' + next + '"]').focus();
      pinned = next; show(next); e.preventDefault();
    });
    show(pinned);
  });
})();
