import { Routes, Route, Navigate } from 'react-router-dom';
import BoardPage from './pages/BoardPage';
import Layout from './components/Layout';

export default function App() {
  return (
    <Routes>
      <Route path='/*' element={<Layout />}>
        <Route
          index
          element={
            <p className='text-xl text-center mt-10'>
              To start enter board ID or Title up here
            </p>
          }
        />
        <Route path='boards/:id' element={<BoardPage />} />
      </Route>
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}
