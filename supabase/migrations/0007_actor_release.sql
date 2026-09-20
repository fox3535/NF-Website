-- 0007_actor_release.sql
-- Resolve the lifecycle conflict between ON DELETE SET NULL and append-only
-- history, without making either table editable.
--
-- THE CONFLICT, verified against the live schema rather than assumed:
--
--   audit_log.actor_auth_user_id  -> auth.users ON DELETE SET NULL
--   vendor_status_history.changed_by -> auth.users ON DELETE SET NULL
--
-- Both tables also carry a BEFORE UPDATE trigger running reject_mutation(),
-- which refuses every update unconditionally. Deleting an auth user therefore
-- made Postgres perform the SET NULL, the trigger refused it, and the whole
-- delete failed with:
--
--   audit_log is append only: UPDATE is not permitted on this table
--
-- The practical result: any auth user who had ever written a history row
-- could never be deleted. Not a departing staff member, not a vendor
-- exercising a deletion request under PIPEDA, not a disposable test identity.
--
-- WHY THIS IS THE ONLY MUTATION BEING PERMITTED, checked not guessed:
--
--   - audit_log has exactly one foreign key, the actor one above, so the
--     actor nulling is the only FK-driven write that can reach this table.
--   - vendor_status_history has one other foreign key, vendor_profile_id ->
--     vendor_profiles ON DELETE CASCADE. That is a DELETE, not an UPDATE, so
--     it is untouched here and still refused. It is a separate question (may
--     a vendor profile ever be hard deleted at all?) and a product decision,
--     not part of the auth-user lifecycle this migration fixes.
--   - consent_events is append only too, but has no foreign key to
--     auth.users, so it is not affected and keeps reject_mutation() as is.
--
-- WHAT THIS MIGRATION DOES NOT DO: it does not drop a foreign key, does not
-- delete a row, does not touch RLS, does not touch any grant, does not touch
-- either DELETE trigger, and does not make either table generally updateable.
-- Neither table has an UPDATE policy for any signed-in role, so `anon` and
-- `authenticated` still cannot reach these rows at all; this trigger is the
-- layer behind that, and it stays shut for everything but the one transition.

-- ---------------------------------------------------------------------------
-- The narrow exception
-- ---------------------------------------------------------------------------
-- Permits exactly one shape of update: the actor reference going from a real
-- uuid to NULL, with every other column byte-identical. Anything else, on any
-- column, in either direction, still raises.
--
-- The actor column is passed as a trigger argument so one function serves
-- both tables and neither table name is hardcoded into the logic.
--
-- Note on the jsonb comparisons: to_jsonb(row) -> 'col' yields the jsonb
-- value 'null' for a SQL NULL, never a SQL NULL, so the checks compare
-- against 'null'::jsonb rather than using IS NULL. Subtracting the actor key
-- from both sides and comparing the remainder is what proves nothing else
-- moved; jsonb object equality ignores key order, so this is a true
-- whole-row comparison.

create or replace function public.allow_only_actor_release()
returns trigger
language plpgsql
as $$
declare
  actor_column text := tg_argv[0];
  old_row jsonb := to_jsonb(old);
  new_row jsonb := to_jsonb(new);
begin
  if tg_op = 'UPDATE'
     and old_row -> actor_column <> 'null'::jsonb   -- was a real auth user
     and new_row -> actor_column =  'null'::jsonb   -- is being released
     and (old_row - actor_column) = (new_row - actor_column)  -- nothing else
  then
    return new;
  end if;

  raise exception
    '% is append only: % is not permitted on this table',
    tg_table_name, tg_op;
end;
$$;

comment on function public.allow_only_actor_release() is
  'Append-only guard that tolerates ON DELETE SET NULL releasing the actor
   reference when an auth.users row is deleted, and nothing else. The history
   row survives, every other column is immutable, and DELETE is still handled
   by reject_mutation() on a separate trigger.';

-- ---------------------------------------------------------------------------
-- Repoint the two UPDATE triggers
-- ---------------------------------------------------------------------------
-- Same tables, same timing, same FOR EACH ROW. Only the function changes, and
-- only for UPDATE. The matching *_no_delete triggers keep running
-- reject_mutation() and are deliberately not mentioned below.

drop trigger audit_log_no_update on public.audit_log;
create trigger audit_log_no_update
  before update on public.audit_log
  for each row
  execute function public.allow_only_actor_release('actor_auth_user_id');

drop trigger vendor_status_history_no_update on public.vendor_status_history;
create trigger vendor_status_history_no_update
  before update on public.vendor_status_history
  for each row
  execute function public.allow_only_actor_release('changed_by');

comment on column public.audit_log.actor_auth_user_id is
  'The auth user who performed the action. Set to NULL by the foreign key if
   that account is later deleted; the row itself is never removed or edited.';

comment on column public.vendor_status_history.changed_by is
  'The staff member who made the change. Set to NULL by the foreign key if
   that account is later deleted; the row itself is never removed or edited.';
