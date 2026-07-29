-- SafraCerta — Compras: origem obrigatoria do custo de insumo
--
-- Registrar uma compra gera, automaticamente e na mesma acao:
-- 1) entrada no estoque do produto comprado
-- 2) conta a pagar (lancamento_custo) na safra/talhao (plantio) certo
-- O usuario nunca lanca as duas coisas separadamente.

create table compras (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  fornecedor_nome text not null,
  produto_id uuid not null references produtos_estoque (id) on delete restrict,
  plantio_id uuid not null references plantios (id) on delete restrict,
  categoria_id uuid not null references categorias_custo (id) on delete restrict,
  quantidade numeric not null check (quantidade > 0),
  preco_unitario numeric not null check (preco_unitario > 0),
  valor_total numeric generated always as (quantidade * preco_unitario) stored,
  data_compra date not null default current_date,
  data_vencimento date,
  observacoes text,
  created_by uuid references users (id),
  created_at timestamptz not null default now()
);

alter table compras enable row level security;

create policy "compras: crud na propria conta" on compras
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create trigger trg_auditoria_compras
  after insert or update or delete on compras
  for each row execute procedure public.registrar_auditoria();

-- ao apagar uma compra, desfaz a entrada no estoque e a conta a pagar gerada por ela
alter table estoque_movimentacoes add column compra_id uuid references compras (id) on delete cascade;
alter table lancamentos_custo add column compra_id uuid references compras (id) on delete cascade;
