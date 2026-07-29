-- SafraCerta — talhoes (fazenda -> talhao -> safra)

create table talhoes (
  id uuid primary key default gen_random_uuid(),
  fazenda_id uuid not null references fazendas (id) on delete cascade,
  nome text not null,
  area_ha numeric,
  tipo_solo text,
  created_at timestamptz not null default now()
);

alter table safras add column talhao_id uuid references talhoes (id) on delete set null;

alter table talhoes enable row level security;

create policy "talhoes: crud via fazenda da propria conta" on talhoes
  for all using (
    fazenda_id in (select id from fazendas where account_id = public.current_account_id())
  )
  with check (
    fazenda_id in (select id from fazendas where account_id = public.current_account_id())
  );

-- estende a auditoria para resolver account_id tambem via fazenda_id (usado por talhoes)
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
  if v_account_id is null and v_linha ? 'fazenda_id' then
    select f.account_id into v_account_id
    from fazendas f
    where f.id = (v_linha ->> 'fazenda_id')::uuid;
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

create trigger trg_auditoria_talhoes
  after insert or update or delete on talhoes
  for each row execute procedure public.registrar_auditoria();
