import { Outlet } from 'react-router-dom';
import SearchBoard from './SearchBoard';

export default function Layout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <header
        className='
  sticky top-0 z-10
  bg-gradient-to-b from-fuchsia-200 to-amber-50
  shadow
  pt-[80px] pb-4
'
      >
        <div className='max-w-3xl mx-auto p-4'>
          <SearchBoard />
        </div>
      </header>
      <main className='flex-1 min-w-11/12 mx-auto p-4 bg-gradient-to-b from-amber-50 to-cyan-100'>
        <Outlet />
      </main>
    </div>
  );
}
