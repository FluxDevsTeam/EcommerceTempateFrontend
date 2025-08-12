import {useEffect} from 'react'
import { useLocation } from 'react-router-dom'



const ScrollToTop = () => {
    const { pathname } = useLocation();
const scrollPositions: { [key: string]: number } = {};

useEffect(() => {
  if (scrollPositions[pathname]) {
    window.scrollTo(0, scrollPositions[pathname]);
  } else {
    window.scrollTo(0, 0);
  }

  return () => {
    scrollPositions[pathname] = window.scrollY;
  };
}, [pathname]);

return null;
};
export default ScrollToTop