import { RouterProvider } from 'react-router-dom';
import { router } from './Components/Routes/Router';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
function App() {
  return (
    <ReactLenis
  root
  options={{
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  }}
>
      <RouterProvider router={router} />
    </ReactLenis>
  );
}

export default App;