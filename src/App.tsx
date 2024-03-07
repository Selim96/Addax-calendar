import React, {lazy, Suspense} from 'react';
import { Route, Routes } from "react-router-dom";
import Loader from './components/Loader';
import Header from './components/Header';
import ErrorPage from './Pages/ErrorPage';
import { Analytics } from '@vercel/analytics/react';

const Homepage = lazy(() => import("./Pages/Homepage"));
const CalendarGrid = lazy(() => import("./components/CalendarGrid"));

const App: React.FC = () => {
  const canvasRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={canvasRef}>
      <Header canvasRef={canvasRef}/>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
      <Analytics />
    </div>
  );
};

export default App;
