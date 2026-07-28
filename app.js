(() => {
  "use strict";

  const STORAGE_KEY = "meu-negocio-data-v1";
  const ICONS = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
    vendas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    estoque: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8V21H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>',
    gastos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
    contatos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    dividas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 10c.7-.7 1.69-1 2.5-1a3.5 3.5 0 1 1 0 7c-.81 0-1.8-.3-2.5-1"/><path d="M12 15V9M6 12h.01M14 5.5h1.5a2 2 0 1 1 0 4H12"/><path d="M6.5 2h2A1.5 1.5 0 0 1 10 3.5v13A1.5 1.5 0 0 1 8.5 18h-6A1.5 1.5 0 0 1 1 16.5v-13A1.5 1.5 0 0 1 2.5 2h2"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>',
    loader: '<svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
  };

  const fmt = (n) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);
  const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("pt-BR");
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const uid = () => Math.random().toString(36).slice(2, 10);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function seedData() {
    const iso = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return d.toISOString().slice(0, 10); };
    const products = [
      { id: uid(), name: "Parafuso 6mm (cx)", category: "Ferragens", stock: 42, minStock: 10, price: 12.9, cost: 7.5 },
      { id: uid(), name: "Tinta Branca 18L", category: "Tintas", stock: 6, minStock: 5, price: 189.9, cost: 130 },
      { id: uid(), name: "Fita Isolante", category: "Elétrica", stock: 3, minStock: 8, price: 6.5, cost: 3.2 },
      { id: uid(), name: "Lâmpada LED 9W", category: "Elétrica", stock: 25, minStock: 10, price: 14.9, cost: 8 },
    ];
    const contacts = [
      { id: uid(), name: "Marcos Oliveira", phone: "(11) 98888-1234", type: "cliente" },
      { id: uid(), name: "Distribuidora Bela Vista", phone: "(11) 3222-5566", type: "fornecedor" },
    ];
    const sales = [
      { id: uid(), date: iso(0), customerId: null, customerName: "Balcão", items: [{ productId: products[0].id, name: products[0].name, qty: 2, price: 12.9 }], total: 25.8, payment: "dinheiro", status: "pago" },
      { id: uid(), date: iso(0), customerId: contacts[0].id, customerName: contacts[0].name, items: [{ productId: products[1].id, name: products[1].name, qty: 1, price: 189.9 }], total: 189.9, payment: "fiado", status: "pendente" },
      { id: uid(), date: iso(1), customerId: null, customerName: "Balcão", items: [{ productId: products[3].id, name: products[3].name, qty: 4, price: 14.9 }], total: 59.6, payment: "pix", status: "pago" },
      { id: uid(), date: iso(2), customerId: null, customerName: "Balcão", items: [{ productId: products[2].id, name: products[2].name, qty: 5, price: 6.5 }], total: 32.5, payment: "cartao", status: "pago" },
    ];
    const expenses = [
      { id: uid(), date: iso(1), desc: "Aluguel da loja", category: "Aluguel", amount: 1200 },
      { id: uid(), date: iso(3), desc: "Reposição de estoque", category: "Fornecedores", amount: 640 },
    ];
    return { products, contacts, sales, expenses };
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const seed = seedData();
    saveData(seed);
    return seed;
  }
  function saveData(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  const NAV = [
    { key: "dashboard", label: "Painel" },
    { key: "vendas", label: "Vendas" },
    { key: "estoque", label: "Estoque" },
    { key: "gastos", label: "Gastos" },
    { key: "contatos", label: "Contatos" },
    { key: "dividas", label: "Fiado" },
  ];
  const HEADER_SUB = {
    dashboard: "Visão geral do seu negócio, hoje.",
    vendas: "Registre e acompanhe cada venda.",
    estoque: "Controle o que entra e sai.",
    gastos: "Toda saída de caixa, anotada.",
    contatos: "Quem compra e quem fornece.",
    dividas: "O que ainda falta receber.",
  };
  const EXPENSE_CATEGORIES = ["Aluguel", "Fornecedores", "Salários", "Serviços", "Outros"];

  let state = { data: null, tab: "dashboard", modal: null };

  function update(patch) {
    state.data = { ...state.data, ...patch };
    saveData(state.data);
    render();
  }

  function setModal(modal) { state.modal = modal; render(); }
  function setTab(tab) { state.tab = tab; render(); }

  function root() { return document.getElementById("app"); }

  function render() {
    if (!state.data) {
      root().innerHTML = `<div class="loading">${ICONS.loader}<span>carregando livro-caixa…</span></div>`;
      return;
    }
    const d = state.data;
    root().innerHTML = `
      <div class="header">
        <h1>${NAV.find((n) => n.key === state.tab).label}</h1>
        <p>${HEADER_SUB[state.tab]}</p>
      </div>
      <main>${renderTab(d)}</main>
      <nav class="bottom-nav">
        ${NAV.map((n) => `
          <button data-nav="${n.key}" class="${state.tab === n.key ? "active" : ""}">
            ${ICONS[n.key]}<span>${n.label}</span>
          </button>`).join("")}
      </nav>
      ${state.modal ? renderModal(d) : ""}
    `;
    bindEvents(d);
  }

  function renderTab(d) {
    switch (state.tab) {
      case "dashboard": return renderDashboard(d);
      case "vendas": return renderVendas(d);
      case "estoque": return renderEstoque(d);
      case "gastos": return renderGastos(d);
      case "contatos": return renderContatos(d);
      case "dividas": return renderDividas(d);
      default: return "";
    }
  }

  // ---------- DASHBOARD ----------
  function renderDashboard(d) {
    const today = todayISO();
    const thisMonth = today.slice(0, 7);
    const vendasHoje = d.sales.filter((s) => s.date === today).reduce((a, s) => a + s.total, 0);
    const countHoje = d.sales.filter((s) => s.date === today).length;
    const vendasMes = d.sales.filter((s) => s.date.slice(0, 7) === thisMonth).reduce((a, s) => a + s.total, 0);
    const gastosMes = d.expenses.filter((e) => e.date.slice(0, 7) === thisMonth).reduce((a, e) => a + e.amount, 0);
    const lucroMes = vendasMes - gastosMes;
    const aReceber = d.sales.filter((s) => s.payment === "fiado" && s.status === "pendente").reduce((a, s) => a + s.total, 0);
    const estoqueBaixo = d.products.filter((p) => p.stock <= p.minStock);

    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(); day.setDate(day.getDate() - i);
      const iso = day.toISOString().slice(0, 10);
      const total = d.sales.filter((s) => s.date === iso).reduce((a, s) => a + s.total, 0);
      last7.push({ label: day.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""), total });
    }
    const maxDia = Math.max(1, ...last7.map((x) => x.total));

    const topMap = {};
    d.sales.forEach((s) => s.items.forEach((it) => { topMap[it.name] = (topMap[it.name] || 0) + it.qty; }));
    const top = Object.entries(topMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxTop = Math.max(1, ...top.map((x) => x[1]));

    return `
      <div class="receipt">
        <div class="receipt-edge-top"></div>
        <div class="receipt-body">
          <p class="receipt-label">— recibo de hoje —</p>
          <p class="receipt-date">${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
          <div class="receipt-total-box">
            <p class="receipt-count">${countHoje} venda${countHoje === 1 ? "" : "s"} hoje</p>
            <p class="receipt-value">${fmt(vendasHoje)}</p>
          </div>
          <p class="receipt-footer">obrigado pela preferência</p>
        </div>
        <div class="receipt-edge-bottom"></div>
      </div>

      <div class="stat-grid">
        <div class="card stat-card"><p class="stat-label">Vendas do mês</p><p class="stat-value" style="color:var(--green)">${fmt(vendasMes)}</p></div>
        <div class="card stat-card"><p class="stat-label">Lucro do mês</p><p class="stat-value" style="color:${lucroMes >= 0 ? "var(--green)" : "var(--red)"}">${fmt(lucroMes)}</p></div>
        <div class="card stat-card" style="grid-column:1 / -1"><p class="stat-label">A receber (fiado)</p><p class="stat-value" style="color:var(--red)">${fmt(aReceber)}</p></div>
      </div>

      ${estoqueBaixo.length ? `
        <div class="card alert-box">
          ${ICONS.alert.replace("<svg", '<svg style="width:18px;height:18px;color:var(--red);flex-shrink:0"')}
          <div><strong>Estoque baixo</strong><p>${esc(estoqueBaixo.map((p) => p.name).join(", "))} — reponha em breve.</p></div>
        </div>` : ""}

      <div class="card chart-card">
        <h3>Vendas nos últimos 7 dias</h3>
        ${last7.map((x) => `
          <div class="bar-row">
            <span class="bar-label">${esc(x.label)}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${(x.total / maxDia) * 100}%;background:var(--gold)"></div></div>
            <span class="bar-value">${fmt(x.total)}</span>
          </div>`).join("")}
      </div>

      <div class="card chart-card">
        <h3>Produtos mais vendidos</h3>
        ${top.length === 0 ? `<p class="empty">Ainda não há vendas registradas.</p>` : top.map(([name, qty]) => `
          <div class="bar-row">
            <span class="bar-label" style="width:auto;flex:0 0 40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(name)}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${(qty / maxTop) * 100}%;background:var(--green)"></div></div>
            <span class="bar-value" style="width:36px">${qty}un.</span>
          </div>`).join("")}
      </div>

      <button id="reset-data" style="background:none;border:none;color:var(--muted);font-size:12px;text-decoration:underline;padding:8px 0 20px;width:100%;text-align:center">Limpar todos os dados</button>
    `;
  }

  function limparDadosModalHTML() {
    return `
      <div class="modal-head"><h3>Limpar todos os dados</h3><button data-close-modal>${ICONS.x}</button></div>
      <div class="modal-body">
        <div class="card alert-box" style="margin-bottom:16px">
          ${ICONS.alert.replace("<svg", '<svg style="width:18px;height:18px;color:var(--red);flex-shrink:0"')}
          <div><strong>Isso não pode ser desfeito</strong><p>Todas as vendas, produtos, gastos e contatos salvos neste celular serão apagados para sempre.</p></div>
        </div>
        <label class="field">
          <span>Para confirmar, digite <strong>APAGAR</strong> abaixo:</span>
          <input id="confirm-wipe-input" autocomplete="off" autocapitalize="characters" />
        </label>
        <button id="confirm-wipe-btn" class="btn-primary" style="background:var(--red);width:100%;justify-content:center" disabled>Apagar tudo</button>
      </div>
    `;
  }

  // ---------- VENDAS ----------
  function renderVendas(d) {
    const q = (state.vendasQuery || "").toLowerCase();
    const list = d.sales.filter((s) => s.customerName.toLowerCase().includes(q)).sort((a, b) => b.date.localeCompare(a.date));
    return `
      <div class="toolbar">
        <div class="search-wrap">${ICONS.search}<input id="vendas-search" placeholder="Buscar por cliente…" value="${esc(state.vendasQuery || "")}" /></div>
        <button class="btn-primary" data-open-modal="nova-venda">${ICONS.plus}Nova venda</button>
      </div>
      <div class="card">
        ${list.length === 0 ? `<p class="empty">Nenhuma venda encontrada.</p>` : list.map((s) => `
          <div class="row">
            <div>
              <div class="row-title">${esc(s.customerName)}</div>
              <div class="row-sub">${esc(s.items.map((i) => `${i.qty}× ${i.name}`).join(", "))}</div>
            </div>
            <div class="row-meta">
              <span class="row-mono" style="color:var(--muted);font-size:11px">${fmtDate(s.date)}</span>
              <span class="tag ${s.status === "pendente" ? "tag-red" : "tag-green"}">${s.payment === "fiado" ? "fiado" : s.payment}</span>
              <span class="row-mono" style="font-weight:600">${fmt(s.total)}</span>
            </div>
          </div>`).join("")}
      </div>
    `;
  }

  function novaVendaModalHTML(d) {
    const draft = state.vendaDraft || { customerId: "", items: [{ productId: "", qty: 1 }], payment: "dinheiro" };
    const total = draft.items.reduce((sum, it) => {
      const p = d.products.find((pr) => pr.id === it.productId);
      return sum + (p ? p.price * (Number(it.qty) || 0) : 0);
    }, 0);
    return `
      <div class="modal-head"><h3>Registrar venda</h3><button data-close-modal>${ICONS.x}</button></div>
      <div class="modal-body">
        <label class="field"><span>Cliente (opcional)</span>
          <select id="venda-cliente">
            <option value="">Balcão (sem cliente)</option>
            ${d.contacts.filter((c) => c.type === "cliente").map((c) => `<option value="${c.id}" ${draft.customerId === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}
          </select>
        </label>
        <span style="display:block;font-size:12px;font-weight:500;margin-bottom:6px">Itens</span>
        ${draft.items.map((it, idx) => `
          <div class="item-row">
            <select data-item-product="${idx}">
              <option value="">Selecione um produto</option>
              ${d.products.map((p) => `<option value="${p.id}" ${it.productId === p.id ? "selected" : ""}>${esc(p.name)} — ${fmt(p.price)}</option>`).join("")}
            </select>
            <input type="number" min="1" value="${it.qty}" data-item-qty="${idx}" />
            ${draft.items.length > 1 ? `<button data-remove-item="${idx}">${ICONS.trash}</button>` : ""}
          </div>
        `).join("")}
        <button class="add-item-link" id="add-item">+ adicionar item</button>
        <label class="field"><span>Forma de pagamento</span>
          <select id="venda-pagamento">
            <option value="dinheiro" ${draft.payment === "dinheiro" ? "selected" : ""}>Dinheiro</option>
            <option value="pix" ${draft.payment === "pix" ? "selected" : ""}>Pix</option>
            <option value="cartao" ${draft.payment === "cartao" ? "selected" : ""}>Cartão</option>
            <option value="fiado" ${draft.payment === "fiado" ? "selected" : ""}>Fiado (a receber)</option>
          </select>
        </label>
        <div class="total-line"><span>Total</span><span>${fmt(total)}</span></div>
        <button class="btn-primary" id="salvar-venda">Salvar venda</button>
      </div>
    `;
  }

  // ---------- ESTOQUE ----------
  function renderEstoque(d) {
    return `
      <div class="toolbar"><span></span><button class="btn-primary" data-open-modal="novo-produto">${ICONS.plus}Novo produto</button></div>
      <div class="card">
        ${d.products.length === 0 ? `<p class="empty">Nenhum produto cadastrado.</p>` : d.products.map((p) => {
          const low = p.stock <= p.minStock;
          return `
          <div class="row">
            <div>
              <div class="row-title">${esc(p.name)}</div>
              <div class="row-sub">${esc(p.category)}</div>
            </div>
            <div class="row-meta">
              <span class="row-mono" style="color:${low ? "var(--red)" : "var(--ink)"}">${p.stock} un.</span>
              <span class="row-mono">${fmt(p.price)}</span>
              <button class="delete-btn" data-delete-product="${p.id}">${ICONS.trash}</button>
            </div>
          </div>`;
        }).join("")}
      </div>
    `;
  }

  function novoProdutoModalHTML() {
    return `
      <div class="modal-head"><h3>Novo produto</h3><button data-close-modal>${ICONS.x}</button></div>
      <div class="modal-body">
        <label class="field"><span>Nome do produto</span><input id="prod-name" /></label>
        <label class="field"><span>Categoria</span><input id="prod-category" /></label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label class="field"><span>Estoque inicial</span><input type="number" id="prod-stock" /></label>
          <label class="field"><span>Estoque mínimo</span><input type="number" id="prod-minstock" value="5" /></label>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label class="field"><span>Preço de venda</span><input type="number" id="prod-price" /></label>
          <label class="field"><span>Custo (opcional)</span><input type="number" id="prod-cost" /></label>
        </div>
        <button class="btn-primary" id="salvar-produto">Salvar produto</button>
      </div>
    `;
  }

  // ---------- GASTOS ----------
  function renderGastos(d) {
    const sorted = [...d.expenses].sort((a, b) => b.date.localeCompare(a.date));
    return `
      <div class="toolbar"><span></span><button class="btn-primary" data-open-modal="novo-gasto">${ICONS.plus}Novo gasto</button></div>
      <div class="card">
        ${sorted.length === 0 ? `<p class="empty">Nenhum gasto registrado.</p>` : sorted.map((e) => `
          <div class="row">
            <div><div class="row-title">${esc(e.desc)}</div><div class="row-sub">${esc(e.category)}</div></div>
            <div class="row-meta">
              <span class="row-mono" style="color:var(--muted);font-size:11px">${fmtDate(e.date)}</span>
              <span class="row-mono" style="color:var(--red);font-weight:600">-${fmt(e.amount)}</span>
            </div>
          </div>`).join("")}
      </div>
    `;
  }

  function novoGastoModalHTML() {
    return `
      <div class="modal-head"><h3>Novo gasto</h3><button data-close-modal>${ICONS.x}</button></div>
      <div class="modal-body">
        <label class="field"><span>Descrição</span><input id="gasto-desc" /></label>
        <label class="field"><span>Categoria</span>
          <select id="gasto-categoria">${EXPENSE_CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join("")}</select>
        </label>
        <label class="field"><span>Valor</span><input type="number" id="gasto-valor" /></label>
        <button class="btn-primary" id="salvar-gasto">Salvar gasto</button>
      </div>
    `;
  }

  // ---------- CONTATOS ----------
  function renderContatos(d) {
    const filter = state.contatosFilter || "todos";
    const list = d.contacts.filter((c) => filter === "todos" || c.type === filter);
    return `
      <div class="toolbar">
        <div class="pill-group">
          ${["todos", "cliente", "fornecedor"].map((f) => `<button class="pill ${filter === f ? "active" : ""}" data-filter-contact="${f}">${f === "todos" ? "Todos" : f + "s"}</button>`).join("")}
        </div>
        <button class="btn-primary" data-open-modal="novo-contato">${ICONS.plus}Novo contato</button>
      </div>
      ${list.length === 0 ? `<p class="empty">Nenhum contato aqui ainda.</p>` : list.map((c) => `
        <div class="card contact-card">
          <div>
            <div class="row-title">${esc(c.name)}</div>
            <div class="row-sub">${ICONS.phone}${esc(c.phone || "sem telefone")}</div>
          </div>
          <span class="tag ${c.type === "cliente" ? "tag-green" : "tag-gold"}">${c.type}</span>
        </div>`).join("")}
    `;
  }

  function novoContatoModalHTML() {
    return `
      <div class="modal-head"><h3>Novo contato</h3><button data-close-modal>${ICONS.x}</button></div>
      <div class="modal-body">
        <label class="field"><span>Nome</span><input id="contato-nome" /></label>
        <label class="field"><span>Telefone</span><input id="contato-telefone" /></label>
        <label class="field"><span>Tipo</span>
          <select id="contato-tipo"><option value="cliente">Cliente</option><option value="fornecedor">Fornecedor</option></select>
        </label>
        <button class="btn-primary" id="salvar-contato">Salvar contato</button>
      </div>
    `;
  }

  // ---------- DÍVIDAS ----------
  function renderDividas(d) {
    const pend = d.sales.filter((s) => s.payment === "fiado" && s.status === "pendente").sort((a, b) => a.date.localeCompare(b.date));
    const total = pend.reduce((a, s) => a + s.total, 0);
    return `
      <div class="card card-pad" style="display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:10px">${ICONS.dividas.replace("<svg", '<svg style="width:18px;height:18px;color:var(--red)"')}<span style="font-size:14px;font-weight:500">Total a receber</span></div>
        <span class="row-mono" style="color:var(--red);font-size:18px;font-weight:600">${fmt(total)}</span>
      </div>
      <div class="card">
        ${pend.length === 0 ? `<p class="empty">Nenhuma dívida em aberto. Tudo em dia!</p>` : pend.map((s) => `
          <div class="row">
            <div><div class="row-title">${esc(s.customerName)}</div><div class="row-sub">${esc(s.items.map((i) => `${i.qty}× ${i.name}`).join(", "))}</div></div>
            <div class="row-meta">
              <span class="row-mono" style="color:var(--muted);font-size:11px">desde ${fmtDate(s.date)}</span>
              <span class="row-mono" style="color:var(--red);font-weight:600">${fmt(s.total)}</span>
              <button class="mark-paid" data-pay="${s.id}">${ICONS.check}Marcar pago</button>
            </div>
          </div>`).join("")}
      </div>
    `;
  }

  // ---------- MODAL SHELL ----------
  function renderModal(d) {
    let inner = "";
    if (state.modal === "nova-venda") inner = novaVendaModalHTML(d);
    if (state.modal === "novo-produto") inner = novoProdutoModalHTML();
    if (state.modal === "novo-gasto") inner = novoGastoModalHTML();
    if (state.modal === "novo-contato") inner = novoContatoModalHTML();
    if (state.modal === "limpar-dados") inner = limparDadosModalHTML();
    return `<div class="overlay" id="overlay"><div class="modal">${inner}</div></div>`;
  }

  // ---------- EVENTS ----------
  function bindEvents(d) {
    document.querySelectorAll("[data-nav]").forEach((btn) => btn.addEventListener("click", () => setTab(btn.dataset.nav)));
    document.querySelectorAll("[data-open-modal]").forEach((btn) => btn.addEventListener("click", () => {
      if (btn.dataset.openModal === "nova-venda") state.vendaDraft = { customerId: "", items: [{ productId: "", qty: 1 }], payment: "dinheiro" };
      setModal(btn.dataset.openModal);
    }));
    const overlay = document.getElementById("overlay");
    if (overlay) {
      overlay.addEventListener("click", (e) => { if (e.target === overlay) setModal(null); });
      document.querySelector("[data-close-modal]")?.addEventListener("click", () => setModal(null));
    }

    // Vendas search
    document.getElementById("vendas-search")?.addEventListener("input", (e) => { state.vendasQuery = e.target.value; render(); });

    // Nova venda modal
    if (state.modal === "nova-venda") {
      document.getElementById("venda-cliente")?.addEventListener("change", (e) => { state.vendaDraft.customerId = e.target.value; });
      document.getElementById("venda-pagamento")?.addEventListener("change", (e) => { state.vendaDraft.payment = e.target.value; });
      document.querySelectorAll("[data-item-product]").forEach((sel) => sel.addEventListener("change", (e) => {
        state.vendaDraft.items[+sel.dataset.itemProduct].productId = e.target.value; render();
      }));
      document.querySelectorAll("[data-item-qty]").forEach((inp) => inp.addEventListener("input", (e) => {
        state.vendaDraft.items[+inp.dataset.itemQty].qty = e.target.value; render();
      }));
      document.querySelectorAll("[data-remove-item]").forEach((btn) => btn.addEventListener("click", () => {
        state.vendaDraft.items.splice(+btn.dataset.removeItem, 1); render();
      }));
      document.getElementById("add-item")?.addEventListener("click", () => { state.vendaDraft.items.push({ productId: "", qty: 1 }); render(); });
      document.getElementById("salvar-venda")?.addEventListener("click", () => {
        const draft = state.vendaDraft;
        const validItems = draft.items.filter((it) => it.productId && Number(it.qty) > 0);
        if (validItems.length === 0) return;
        const saleItems = validItems.map((it) => {
          const p = d.products.find((pr) => pr.id === it.productId);
          return { productId: p.id, name: p.name, qty: Number(it.qty), price: p.price };
        });
        const customer = d.contacts.find((c) => c.id === draft.customerId);
        const newSale = {
          id: uid(), date: todayISO(), customerId: draft.customerId || null,
          customerName: customer ? customer.name : "Balcão",
          items: saleItems, total: saleItems.reduce((s, i) => s + i.price * i.qty, 0),
          payment: draft.payment, status: draft.payment === "fiado" ? "pendente" : "pago",
        };
        const updatedProducts = d.products.map((p) => {
          const sold = saleItems.find((si) => si.productId === p.id);
          return sold ? { ...p, stock: Math.max(0, p.stock - sold.qty) } : p;
        });
        state.modal = null;
        update({ sales: [...d.sales, newSale], products: updatedProducts });
      });
    }

    // Novo produto
    document.getElementById("salvar-produto")?.addEventListener("click", () => {
      const name = document.getElementById("prod-name").value.trim();
      const price = document.getElementById("prod-price").value;
      if (!name || !price) return;
      const p = {
        id: uid(), name, category: document.getElementById("prod-category").value.trim() || "Geral",
        stock: Number(document.getElementById("prod-stock").value) || 0,
        minStock: Number(document.getElementById("prod-minstock").value) || 5,
        price: Number(price), cost: Number(document.getElementById("prod-cost").value) || 0,
      };
      state.modal = null;
      update({ products: [...d.products, p] });
    });
    document.querySelectorAll("[data-delete-product]").forEach((btn) => btn.addEventListener("click", () => {
      update({ products: d.products.filter((x) => x.id !== btn.dataset.deleteProduct) });
    }));

    // Novo gasto
    document.getElementById("salvar-gasto")?.addEventListener("click", () => {
      const desc = document.getElementById("gasto-desc").value.trim();
      const amount = document.getElementById("gasto-valor").value;
      if (!desc || !amount) return;
      const e = { id: uid(), date: todayISO(), desc, category: document.getElementById("gasto-categoria").value, amount: Number(amount) };
      state.modal = null;
      update({ expenses: [...d.expenses, e] });
    });

    // Contatos
    document.querySelectorAll("[data-filter-contact]").forEach((btn) => btn.addEventListener("click", () => {
      state.contatosFilter = btn.dataset.filterContact; render();
    }));
    document.getElementById("salvar-contato")?.addEventListener("click", () => {
      const name = document.getElementById("contato-nome").value.trim();
      if (!name) return;
      const c = { id: uid(), name, phone: document.getElementById("contato-telefone").value.trim(), type: document.getElementById("contato-tipo").value };
      state.modal = null;
      update({ contacts: [...d.contacts, c] });
    });

    // Dívidas
    document.querySelectorAll("[data-pay]").forEach((btn) => btn.addEventListener("click", () => {
      update({ sales: d.sales.map((s) => (s.id === btn.dataset.pay ? { ...s, status: "pago" } : s)) });
    }));

    // Limpar dados
    document.getElementById("reset-data")?.addEventListener("click", () => setModal("limpar-dados"));
    const wipeInput = document.getElementById("confirm-wipe-input");
    const wipeBtn = document.getElementById("confirm-wipe-btn");
    if (wipeInput && wipeBtn) {
      wipeInput.addEventListener("input", () => {
        wipeBtn.disabled = wipeInput.value.trim().toUpperCase() !== "APAGAR";
      });
      wipeBtn.addEventListener("click", () => {
        if (wipeInput.value.trim().toUpperCase() !== "APAGAR") return;
        const empty = { products: [], contacts: [], sales: [], expenses: [] };
        state.data = empty;
        state.modal = null;
        saveData(empty);
        render();
      });
    }
  }

  state.data = loadData();
  render();
})();
