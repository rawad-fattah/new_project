import Header     from './components/Header';
import Footer     from './components/Footer';
import UsersTable from './components/UsersTable';

export default function App() {
  return (
    <div className="fullpage">
      <Header />
      <main className="table">
        <UsersTable />
      </main>
      <Footer />
    </div>
  );
}
