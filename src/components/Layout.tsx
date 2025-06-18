import { Outlet } from 'react-router-dom';
import SearchBoard from './SearchBoard';

export default function Layout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <header className='sticky top-0 bg-white shadow z-10'>
        <div className='max-w-3xl mx-auto p-4'>
          <SearchBoard />
        </div>
      </header>
      <main className='flex-1 max-w-3xl mx-auto p-4'>
        <Outlet />
      </main>
    </div>
  );
}
