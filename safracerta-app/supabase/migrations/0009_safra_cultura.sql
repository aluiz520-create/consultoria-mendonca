-- SafraCerta — reestrutura a hierarquia:
-- Empresa -> Safra (ciclo agricola) -> Fazenda -> Cultura -> Talhao -> Plantio
--
-- Ate aqui, "safras" era o registro de um talhao plantado com uma cultura num
-- ano (texto livre). Isso vira "plantios": a combinacao especifica de
-- Safra (ciclo) + Talhao + Cultura. Safra passa a ser so o periodo (ex.:
-- "2025/2026"), compartilhado pela empresa toda, e Cultura vira cadastro
-- proprio em vez de texto livre.

-- ---------------------------------------------------------------------------
-- 1) Culturas (cadastro por empresa)
-- ---------------------------------------------------------------------------

create table culturas (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  nome text not null,
  created_at timestamptz not null default now(),
  unique (account_id, nome)
);

alter table culturas enable row level security;

create policy "culturas: crud na propria conta" on culturas
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

-- popula a partir das culturas (texto livre) ja usadas
insert into culturas (account_id, nome)
select distinct f.account_id, s.cultura
from safras s
join talhoes t on t.id = s.talhao_id
join fazendas f on f.id = t.fazenda_id
on conflict (account_id, nome) do nothing;

-- ---------------------------------------------------------------------------
-- 2) Renomeia a antiga tabela "safras" (talhao + cultura + ano) para "plantios"
-- ---------------------------------------------------------------------------

alter table safras rename to plantios;

alter table plantios add column cultura_id uuid references culturas (id) on delete restrict;

update plantios p
set cultura_id = c.id
from culturas c
join talhoes t on t.id = p.talhao_id
join fazendas f on f.id = t.fazenda_id
where c.account_id = f.account_id and c.nome = p.cultura;

alter table plantios alter column cultura_id set not null;
alter table plantios drop column cultura;

-- ---------------------------------------------------------------------------
-- 3) Nova tabela "safras" = ciclo agricola (ano) por empresa
-- ---------------------------------------------------------------------------

create table safras (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  nome text not null, -- ex: "2025/2026"
  data_inicio date,
  data_fim date,
  created_at timestamptz not null default now(),
  unique (account_id, nome)
);

alter table safras enable row level security;

create policy "safras: crud na propria conta" on safras
  for all using (account_id = public.current_account_id())
  with check (account_id = public.current_account_id());

-- popula uma Safra (ciclo) por "ano" ja usado nos plantios
insert into safras (account_id, nome)
select distinct f.account_id, p.ano
from plantios p
join talhoes t on t.id = p.talhao_id
join fazendas f on f.id = t.fazenda_id
on conflict (account_id, nome) do nothing;

alter table plantios add column safra_id uuid references safras (id) on delete cascade;

update plantios p
set safra_id = s.id
from safras s
join fazendas f on f.account_id = s.account_id
join talhoes t on t.fazenda_id = f.id
where t.id = p.talhao_id and s.nome = p.ano;

alter table plantios alter column safra_id set not null;
alter table plantios drop column ano;

-- ---------------------------------------------------------------------------
-- 4) lancamentos_custo e contratos_venda passam a apontar para "plantio", nao "safra"
-- ---------------------------------------------------------------------------

alter table lancamentos_custo rename column safra_id to plantio_id;
alter table contratos_venda rename column safra_id to plantio_id;

-- ---------------------------------------------------------------------------
-- 5) Auditoria: culturas e safras (ciclo) tambem passam a ser rastreadas
-- ---------------------------------------------------------------------------

create trigger trg_auditoria_culturas
  after insert or update or delete on culturas
  for each row execute procedure public.registrar_auditoria();

create trigger trg_auditoria_safras_ciclo
  after insert or update or delete on safras
  for each row execute procedure public.registrar_auditoria();

-- reescreve a funcao: "safra_id" nao existe mais como referencia a fazenda;
-- agora resolve por fazenda_id (fazendas, talhoes, plantios) ou por
-- plantio_id (lancamentos_custo, contratos_venda)
create or replace function public.registrar_auditoria()
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

  v_account_id := (v_linha ->> 'account_id')::uuid;

  if v_account_id is null and v_linha ? 'fazenda_id' then
    select f.account_id into v_account_id
    from fazendas f
    where f.id = (v_linha ->> 'fazenda_id')::uuid;
  end if;

  if v_account_id is null and v_linha ? 'plantio_id' then
    select f.account_id into v_account_id
    from plantios p
    join fazendas f on f.id = p.fazenda_id
    where p.id = (v_linha ->> 'plantio_id')::uuid;
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
