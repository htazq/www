import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from '../components/layout/SiteLayout';

const HomePage = lazy(() => import('./HomePage'));
const AboutPage = lazy(() => import('./AboutPage'));
const NotFoundPage = lazy(() => import('./NotFoundPage'));
const StackCraftPage = lazy(() => import('../experiments/stack-craft/StackCraftPage'));
const QuorumPage = lazy(() => import('../experiments/quorum/QuorumPage'));
const InternetGardenPage = lazy(() => import('../experiments/internet-garden/InternetGardenPage'));
const OneMillionBlocksPage = lazy(
  () => import('../experiments/one-million-blocks/OneMillionBlocksPage'),
);
const LatencyPage = lazy(() => import('../experiments/latency/LatencyPage'));
const DataScalePage = lazy(() => import('../experiments/data-scale/DataScalePage'));
const InternetArchaeologyPage = lazy(
  () => import('../experiments/internet-archaeology/InternetArchaeologyPage'),
);

function RouteFallback() {
  return (
    <div className="route-fallback" role="status">
      LOADING EXHIBIT…
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="experiments" element={<HomePage />} />
          <Route path="experiments/stack-craft" element={<StackCraftPage />} />
          <Route path="experiments/quorum" element={<QuorumPage />} />
          <Route path="experiments/internet-garden" element={<InternetGardenPage />} />
          <Route path="experiments/one-million-blocks" element={<OneMillionBlocksPage />} />
          <Route path="experiments/latency" element={<LatencyPage />} />
          <Route path="experiments/data-scale" element={<DataScalePage />} />
          <Route path="experiments/internet-archaeology" element={<InternetArchaeologyPage />} />
          <Route path="experiments/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
