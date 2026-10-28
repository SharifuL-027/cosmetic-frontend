import { RouterProvider } from 'react-router-dom';
import { router } from './Components/Routes/Router';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
function App() {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
      <RouterProvider router={router} />
    </ReactLenis>
  );
}

export default App;