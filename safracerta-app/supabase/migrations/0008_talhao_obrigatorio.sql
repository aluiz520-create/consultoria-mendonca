-- SafraCerta — talhao passa a ser obrigatorio em toda safra
-- (fazenda -> talhao -> safra, sem excecao)

-- para fazendas que ja tem safra sem talhao, cria um talhao padrao
-- e migra essas safras para ele, antes de tornar a coluna obrigatoria
do $$
declare
  r record;
  v_talhao_id uuid;
begin
  for r in
    select distinct fazenda_id
    from safras
    where talhao_id is null
  loop
    insert into talhoes (fazenda_id, nome)
    values (r.fazenda_id, 'Área não dividida')
    returning id into v_talhao_id;

    update safras
    set talhao_id = v_talhao_id
    where fazenda_id = r.fazenda_id and talhao_id is null;
  end loop;
end $$;

alter table safras alter column talhao_id set not null;
