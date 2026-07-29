-- SafraCerta — regras de negocio: auditoria, rateio de despesas, aditivos de contrato

-- ---------------------------------------------------------------------------
-- Auditoria (quem criou/alterou/apagou, valor anterior x novo)
-- ---------------------------------------------------------------------------

create table auditoria_eventos (
  id uuid primary key default gen_random_uuid(),
  account_id uuid,
  tabela text not null,
  registro_id uuid not null,
  acao text not null, -- insert | update | delete
  usuario_id uuid references users (id) on delete set null,
  dados_antigos jsonb,
  dados_novos jsonb,
  created_at timestamptz not null default now()
);

create index idx_auditoria_account_created on auditoria_eventos (account_id, created_at desc);
create index idx_auditoria_registro on auditoria_eventos (tabela, registro_id);

alter table auditoria_eventos enable row level security;

create policy "auditoria: leitura na propria conta" on auditoria_eventos
  for select using (account_id = public.current_account_id());

create function public.registrar_auditoria()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_account_id uuid;
  v_registro_id uuid;
  v_linha jsonb;
begin
  v_linha := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  v_registro_id := (v_linha ->> 'id')::uuid;

  -- resolve account_id diretamente, ou via safra->fazenda quando a tabela nao tiver a coluna
  v_account_id := (v_linha ->> 'account_id')::uuid;
  if v_account_id is null and v_linha ? 'safra_id' then
    select f.account_id into v_account_id
    from safras s
    join fazendas f on f.id = s.fazenda_id
    where s.id = (v_linha ->> 'safra_id')::uuid;
  end if;
  if v_account_id is null and v_linha ? 'contrato_id' then
    select c.account_id into v_account_id
    from contratos c
    where c.id = (v_linha ->> 'contrato_id')::uuid;
  end if;

  insert into auditoria_eventos (account_id, tabela, registro_id, acao, usuario_id, dados_antigos, dados_novos)
  values (
    v_account_id,
    tg_table_name,
    v_registro_id,
    lower(tg_op),
    auth.uid(),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('UPDATE', 'INSERT') then to_jsonb(new) else null end
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger trg_auditoria_fazendas
  after insert or update or delete on fazendas
  for each row execute procedure public.registrar_auditoria();

create trigger trg_auditoria_safras
  after insert or update or delete on safras
  for each row execute procedure public.registrar_auditoria();

create trigger trg_auditoria_lancamentos_custo
  after insert or update or delete on lancamentos_custo
  for each row execute procedure public.registrar_auditoria();

create trigger trg_auditoria_contratos
  after insert or update or delete on contratos
  for each row execute procedure public.registrar_auditoria();

-- ---------------------------------------------------------------------------
-- Rateio de despesas entre safras (uma compra, custo dividido)
-- ---------------------------------------------------------------------------

create table despesas_rateadas (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  categoria_id uuid not null references categorias_custo (id),
  descricao text,
  valor_total numeric not null check (valor_total > 0),
  data date not null default current_date,
  created_by uuid references users (id),
  created_at timestamptz not null default now()
);

alter table lancamentos_custo add column despesa_rateada_id uuid references despesas_rateadas (id) on delete cascade;

alter table despesas_rateadas enable row level security;

create policy "despesas_rateadas: crud na propria conta" on despesas_rateadas
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

create trigger trg_auditoria_despesas_rateadas
  after insert or update or delete on despesas_rateadas
  for each row execute procedure public.registrar_auditoria();

-- ---------------------------------------------------------------------------
-- Aditivos de contrato (reajuste, prorrogacao, mudanca de valor/area) e encerramento antecipado
-- ---------------------------------------------------------------------------

alter table contratos add column data_encerramento date;
alter table contratos add column motivo_encerramento text;

create table contrato_aditivos (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references contratos (id) on delete cascade,
  tipo text not null, -- reajuste | prorrogacao | mudanca_valor | mudanca_area | outro
  descricao text,
  data_aditivo date not null default current_date,
  valor_anterior numeric,
  valor_novo numeric,
  data_fim_anterior date,
  data_fim_nova date,
  created_by uuid references users (id),
  created_at timestamptz not null default now()
);

alter table contrato_aditivos enable row level security;

create policy "contrato_aditivos: crud via contrato da propria conta" on contrato_aditivos
  for all using (
    contrato_id in (select id from contratos where account_id = public.current_account_id())
  )
  with check (
    contrato_id in (select id from contratos where account_id = public.current_account_id())
  );

create trigger trg_auditoria_contrato_aditivos
  after insert or update or delete on contrato_aditivos
  for each row execute procedure public.registrar_auditoria();
