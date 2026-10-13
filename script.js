(() => {
  'use strict';
  // Figure lightbox: accessible dialog and focus return.
  const modal = document.getElementById('figure-lightbox');
  const enlarged = document.getElementById('lightbox-image');
  const close = document.getElementById('close-lightbox');
  let trigger = null;
  document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
    if (!modal || !enlarged) return;
    trigger = button;
    enlarged.src = button.dataset.image;
    enlarged.alt = button.dataset.alt || 'Enlarged research figure';
    modal.showModal?.();
  }));
  close?.addEventListener('click', () => modal?.close());
  modal?.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  modal?.addEventListener('close', () => { enlarged?.removeAttribute('src'); trigger?.focus(); });

  // Result explorer: all values are transcribed from Table 2 of the manuscript.
  const metrics = {
    ra: { title:'Right abstention', description:'On unanswerable questions, how often does a model correctly refuse? <strong>Higher is better.</strong>',
      insight:'<strong>The key result.</strong> On four of five modalities, right abstention rises to 87.5–93.9% with the combined projection.',
      values:[[12.7,87.5],[10.6,93.3],[8.5,93.9],[8.7,92.9],[14.3,69.3]], warning:false },
    wa: { title:'Wrong abstention', description:'On answerable questions, how often does a model refuse unnecessarily? <strong>Lower is better.</strong>',
      insight:'<strong>The important trade-off.</strong> Improved refusal also increases unnecessary refusals on several imaging domains.',
      values:[[2.1,19.2],[1.5,13.2],[3.0,12.0],[2.8,17.6],[1.4,7.1]], warning:true },
    ca: { title:'Correct answers', description:'On answerable questions, how often does a model give the right response? <strong>Higher is better.</strong>',
      insight:'<strong>Accuracy does not automatically increase.</strong> The combined model answers fewer valid questions correctly on four domains, illustrating the cost of added abstention.',
      values:[[40.0,36.1],[28.1,26.2],[32.2,27.9],[28.3,22.1],[30.7,32.1]], warning:true }
  };
  const rows = Array.from(document.querySelectorAll('#comparison-chart .bar-row'));
  const title = document.getElementById('chart-title');
  const explainer = document.getElementById('chart-explanation');
  const insight = document.getElementById('chart-insight');
  const switches = Array.from(document.querySelectorAll('[data-metric]'));
  const render = key => {
    const metric = metrics[key];
    if (!metric) return;
    title.textContent = metric.title;
    explainer.innerHTML = metric.description;
    insight.querySelector('p').innerHTML = metric.insight;
    insight.classList.toggle('is-warning', metric.warning);
    insight.querySelector('span').textContent = metric.warning ? '!' : '↗';
    switches.forEach(b => { const active = b.dataset.metric === key; b.classList.toggle('is-active',active); b.setAttribute('aria-pressed',String(active)); });
    rows.forEach((row,i) => {
      const [base,adapted]=metric.values[i];
      const [a,b]=row.querySelectorAll('.track');
      a.querySelector('.fill').style.width = `${base}%`;
      b.querySelector('.fill').style.width = `${adapted}%`;
      a.querySelector('.bar-value').textContent = `${base.toFixed(1)}%`;
      b.querySelector('.bar-value').textContent = `${adapted.toFixed(1)}%`;
      row.setAttribute('aria-label',`${row.dataset.domain}: original ${base.toFixed(1)}%, combined projection ${adapted.toFixed(1)}%`);
    });
  };
  switches.forEach(button => button.addEventListener('click', () => render(button.dataset.metric)));
  render('ra');

  const progress = document.getElementById('reading-progress');
  const backTop = document.getElementById('back-top');
  let scrollPending = false;
  const updateScroll = () => {
    const total=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    if (progress) progress.style.transform = `scaleX(${Math.min(1,Math.max(0,scrollY/total))})`;
    backTop?.classList.toggle('is-visible',scrollY>620);
    scrollPending=false;
  };
  addEventListener('scroll', () => { if (!scrollPending) { scrollPending=true; requestAnimationFrame(updateScroll); } },{passive:true});
  addEventListener('resize',updateScroll);
  updateScroll();
  backTop?.addEventListener('click', () => scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
})();
