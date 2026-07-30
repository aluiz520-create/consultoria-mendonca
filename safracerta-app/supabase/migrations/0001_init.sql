-- SafraCerta — schema inicial
-- Rodar no SQL editor do Supabase ou via `supabase db push`.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

create table accounts (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  plano text not null default 'starter', -- starter | pro | cerealista
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key references auth.users (id) on delete cascade,
  account_id uuid not null references accounts (id) on delete cascade,
  nome text,
  papel text not null default 'owner', -- owner | membro
  created_at timestamptz not null default now()
);

create table fazendas (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  nome text not null,
  municipio text,
  uf text,
  area_total_ha numeric,
  created_at timestamptz not null default now()
);

create table safras (
  id uuid primary key default gen_random_uuid(),
  fazenda_id uuid not null references fazendas (id) on delete cascade,
  cultura text not null, -- soja | milho | feijao
  ano text not null,     -- ex: 2025/2026
  area_plantada_ha numeric not null,
  produtividade_esperada_sc_ha numeric,
  preco_referencia_sc numeric,
  created_at timestamptz not null default now()
);

create table categorias_custo (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  nome text not null,
  grupo text not null default 'variavel' -- variavel | fixo
);

create table lancamentos_custo (
  id uuid primary key default gen_random_uuid(),
  safra_id uuid not null references safras (id) on delete cascade,
  categoria_id uuid not null references categorias_custo (id),
  descricao text,
  valor numeric not null check (valor >= 0),
  data date not null default current_date,
  created_by uuid references users (id),
  created_at timestamptz not null default now()
);

create table contratos (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  fazenda_id uuid references fazendas (id) on delete set null,
  tipo text not null, -- arrendamento | parceria
  contraparte_nome text not null,
  area_ha numeric,
  data_inicio date not null,
  data_fim date not null,
  forma_pagamento text, -- sacas_por_ha | valor_fixo | percentual_producao
  valor_referencia numeric,
  status text not null default 'ativo', -- ativo | vencido | encerrado
  pdf_url text,
  created_at timestamptz not null default now()
);

create table alertas (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  tipo text not null, -- vencimento_contrato | fechamento_mensal | fiscal
  referencia_id uuid,
  enviar_em date not null,
  enviado boolean not null default false,
  canal text not null default 'whatsapp',
  created_at timestamptz not null default now()
);

create table assinaturas (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  asaas_subscription_id text,
  plano text not null default 'starter',
  status text not null default 'trial', -- trial | ativa | atrasada | cancelada
  proxima_cobranca date,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Criacao automatica de account + users ao cadastrar (auth.users)
-- ---------------------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_account_id uuid;
begin
  insert into accounts (nome)
  values (coalesce(new.raw_user_meta_data ->> 'nome_conta', 'Minha Fazenda'))
  returning id into new_account_id;

  insert into users (id, account_id, nome, papel)
  values (new.id, new_account_id, new.raw_user_meta_data ->> 'nome', 'owner');

  insert into assinaturas (account_id, plano, status)
  values (new_account_id, 'starter', 'trial');

  insert into categorias_custo (account_id, nome, grupo) values
    (new_account_id, 'Insumos (sementes, fertilizante, defensivo)', 'variavel'),
    (new_account_id, 'Mão de obra', 'variavel'),
    (new_account_id, 'Maquinário', 'variavel'),
    (new_account_id, 'Combustível', 'variavel'),
    (new_account_id, 'Arrendamento', 'fixo'),
    (new_account_id, 'Administrativo', 'fixo');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table accounts enable row level security;
alter table users enable row level security;
alter table fazendas enable row level security;
alter table safras enable row level security;
alter table categorias_custo enable row level security;
alter table lancamentos_custo enable row level security;
alter table contratos enable row level security;
alter table alertas enable row level security;
alter table assinaturas enable row level security;

-- helper: account_id do usuario logado
create function public.current_account_id()
returns uuid
language sql stable
security definer set search_path = public
as $$
  select account_id from users where id = auth.uid();
$$;

create policy "accounts: somente a propria conta" on accounts
  for select using (id = public.current_account_id());

create policy "users: mesma conta" on users
  for select using (account_id = public.current_account_id());

create policy "fazendas: crud na propria conta" on fazendas
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create policy "safras: crud via fazenda da propria conta" on safras
  for all using (
    fazenda_id in (select id from fazendas where account_id = public.current_account_id())
  )
  with check (
    fazenda_id in (select id from fazendas where account_id = public.current_account_id())
  );

create policy "categorias_custo: crud na propria conta" on categorias_custo
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create policy "lancamentos_custo: crud via safra da propria conta" on lancamentos_custo
  for all using (
    safra_id in (
      select s.id from safras s
      join fazendas f on f.id = s.fazenda_id
      where f.account_id = public.current_account_id()
    )
  )
  with check (
    safra_id in (
      select s.id from safras s
      join fazendas f on f.id = s.fazenda_id
      where f.account_id = public.current_account_id()
    )
  );

create policy "contratos: crud na propria conta" on contratos
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create policy "alertas: crud na propria conta" on alertas
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create policy "assinaturas: leitura na propria conta" on assinaturas
  for select using (account_id = public.current_account_id());
