import React, {lazy, Suspense} from 'react';
import { Route, Routes } from "react-router-dom";
import Loader from './components/Loader';
import Header from './components/Header';
import { useAppSelector } from './redux/hooks';
import allSelectors from './redux/selectors';
import ErrorPage from './Pages/ErrorPage';

const Homepage = lazy(() => import("./Pages/Homepage"));


const App: React.FC = () => {
  const isModalOpen = useAppSelector(allSelectors.getModal)

  return (
    <>
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;