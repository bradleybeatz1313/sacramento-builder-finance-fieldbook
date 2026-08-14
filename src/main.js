import './style.css';
import { builders, sources } from './data.js';

const builderGrid = document.querySelector('#builder-grid');
const sourceList = document.querySelector('#source-list');

function builderCard(builder) {
  const cities = builder.cities.map((city) => `<span>${city}</span>`).join('');
  return `
    <article class="builder-card" data-tier="${builder.tier}">
      <div class="builder-score"><b>${builder.score}</b>/100</div>
      <div>
        <h3>${builder.name}</h3>
        <p class="builder-segment">${builder.segment} · ${builder.tier}</p>
        <div class="builder-cities">${cities}</div>
        <dl>
          <dt>Verified activity</dt><dd>${builder.communities}</dd>
          <dt>Lending landscape</dt><dd>${builder.lender}</dd>
          <dt>Public route</dt><dd>${builder.route}</dd>
          <dt>Best angle</dt><dd>${builder.angle}</dd>
        </dl>
        <div class="builder-links">
          <a href="${builder.source}" target="_blank" rel="noreferrer">Official source ↗</a>
          <a href="${builder.contact}" target="_blank" rel="noreferrer">Contact route ↗</a>
        </div>
      </div>
    </article>`;
}

builderGrid.innerHTML = builders.map(builderCard).join('');
sourceList.innerHTML = sources.map(([name, url, detail]) => `
  <a href="${url}" target="_blank" rel="noreferrer"><span><strong>${name}</strong><br><small>${detail}</small></span><span aria-hidden="true">↗</span></a>
`).join('');

const filters = [...document.querySelectorAll('.filter')];
filters.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('.builder-card').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.tier !== filter;
    });
  });
});

const scripts = {
  email: {
    label: 'EMAIL · SALES LEADER',
    copy: 'Hi [Name]—I’m a Sacramento-area loan officer. I’m not contacting you to disrupt an existing preferred-lender relationship. I help builder teams with buyers who need a second financing path: decline rescues, complex income, FHA/VA/jumbo scenarios, sale-of-home complications or simply faster escalation before a contract is lost. Could I spend 15 minutes learning where financing fallout occurs in your current process?',
  },
  onsite: {
    label: 'MODEL HOME · FIRST CONVERSATION',
    copy: 'I know you probably have a preferred lender. I’m not here to ask you to replace them. I’m building a local rescue desk for buyers who fall outside the normal box or need a second opinion. Who handles financing escalations when a buyer is at risk of canceling?',
  },
  discovery: {
    label: 'DISCOVERY · FIVE QUESTIONS',
    copy: 'How many buyers fall out for financing each month? What causes most delays or declines? How long does it take to get a second decision? Which borrower profiles are hardest? What would a useful, buyer-authorized status update include?',
  },
};

const tabButtons = [...document.querySelectorAll('[role="tab"]')];
const scriptPanel = document.querySelector('#script-panel');
const scriptLabel = document.querySelector('#script-label');
const scriptCopy = document.querySelector('#script-copy');

function selectScript(button) {
  const selected = scripts[button.dataset.script];
  tabButtons.forEach((tab) => {
    const selectedTab = tab === button;
    tab.setAttribute('aria-selected', String(selectedTab));
    tab.tabIndex = selectedTab ? 0 : -1;
  });
  scriptPanel.setAttribute('aria-labelledby', button.id);
  scriptLabel.textContent = selected.label;
  scriptCopy.textContent = selected.copy;
}

tabButtons.forEach((tab, index) => { tab.tabIndex = index === 0 ? 0 : -1; });

tabButtons.forEach((button, index) => {
  button.addEventListener('click', () => selectScript(button));
  button.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = tabButtons[(index + direction + tabButtons.length) % tabButtons.length];
    next.focus();
    selectScript(next);
  });
});

document.querySelector('#copy-script').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(scriptCopy.textContent);
    button.textContent = 'Copied';
  } catch {
    button.textContent = 'Select text to copy';
  }
  window.setTimeout(() => { button.textContent = 'Copy script'; }, 1800);
});
