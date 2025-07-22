import { useEffect, useState } from 'react';
import Pagination from './Pagination';
const API_URL = import.meta.env.VITE_API_URL;

const PAGE_SIZE = 6;

const formatDate = iso =>
  new Date(iso).toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const ensureFirstAndLast = user => {
  if (!user.firstName && user.name) {
    const [first, ...rest] = user.name.trim().split(/\s+/);
    return { ...user, 
      firstName: first,
      lastName: rest.join(' ')
    };
  }
  return user;
};


export default function UsersTable() {
  const [page,  setPage]  = useState(1);
  const [rows,  setRows]  = useState([]);
  const [pages, setPages] = useState(1);
  const [busy,  setBusy]  = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;// i am not making rerfresh

    (async () => {
      setBusy(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}?page=${page}&limit=${PAGE_SIZE}`);
        if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        console.log(raw);
        if (cancelled) // if we refesh the page while fetching, we don't want to set state or change the page
            return;
        const data = raw.map(ensureFirstAndLast);
        setRows(data);
        const total = Number(res.headers.get('X-Total-Count'));
        if (total) {
          setPages(Math.ceil(total / PAGE_SIZE));
        } 
        else
        {
          const maybeMore = data.length === PAGE_SIZE;
          setPages(maybeMore ? page + 1 :page);
        }
      } catch (err) {
        if (!cancelled)
            setError(err.message || 'Fetch failed');
      } finally {
        if (!cancelled) 
            setBusy(false);
      }
    })();

    return () => { cancelled = true; };//If the page is closed or refreshed or changed, mark cancelled = true
  }, [page]);

  if (busy) {
    return (
      <p style={{ textAlign: 'center', padding: '2.5rem' }}>Loading…</p>
    );
  }

  if (error) {
    return (
      <p style={{ textAlign: 'center', padding: '2.5rem', color: '#e11d48' }}>
        {error}
      </p>
    );
  }

  return (
    <>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Avatar</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(user => (
              <tr key={user.id}>
                <td>
                  {user.id -1}
                </td>
                <td>
                  <span className="avatar-badge">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </span>
                </td>
                <td>
                  {user.firstName}
                </td>
                <td>
                  {user.lastName}
                </td>
                <td>
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        pages={pages}
        onChange={setPage}
      />
      
    </>
  );
}
