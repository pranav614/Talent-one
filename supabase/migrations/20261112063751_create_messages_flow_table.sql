create table public.messages (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('contact', 'hiring', 'jobs')),
  audience text not null check (audience in ('Candidate', 'Employer')),
  name text not null check (char_length(name) between 1 and 160),
  email text not null check (char_length(email) between 3 and 320),
  company text check (company is null or char_length(company) <= 160),
  role text check (role is null or char_length(role) <= 160),
  message text not null check (char_length(message) between 1 and 10000),
  status text not null default 'New' check (status in ('New', 'Read', 'Archived')),
  created_at timestamptz not null default now()
);

create index messages_created_at_idx on public.messages (created_at desc);
create index messages_category_status_idx on public.messages (category, status, created_at desc);

alter table public.messages enable row level security;
revoke all on table public.messages from anon, authenticated;
grant all on table public.messages to service_role;
