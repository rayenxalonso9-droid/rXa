export default function AdminSettingsPage() {
  return (
    <div>
      <p className="eyebrow mb-3">SETTINGS</p>
      <h1 className="text-3xl font-light tracking-[.16em] mb-8">SETTINGS</h1>
      <div className="bg-white border border-[#d0cec7] p-6 max-w-2xl space-y-4 text-sm text-[#64615c]">
        <p>Configure environment variables in <code>.env.local</code>:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>NEXT_PUBLIC_SUPABASE_URL</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
          <li>SUPABASE_SERVICE_ROLE_KEY</li>
          <li>ADMIN_EMAILS</li>
        </ul>
        <p>Run the SQL migration in <code>supabase/migrations/0001_init.sql</code> to create tables, RLS policies and storage buckets.</p>
      </div>
    </div>
  );
}
