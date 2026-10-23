-- Resolve the mutable search_path warning on the legacy timestamp trigger.
-- Only pg_catalog functions are used; an empty path prevents schema shadowing.
do $$ begin
  if to_regprocedure('public.handle_updated_at()') is not null then
    alter function public.handle_updated_at() set search_path = '';
  end if;
end $$;
