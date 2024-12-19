import { NavigateFunction } from 'react-router-dom';

export const safeNavigate = async (
  navigate: NavigateFunction,
  path: string,
  options: { replace?: boolean } = {}
) => {
  console.log(`Attempting navigation to: ${path}`);
  try {
    await navigate(path, options);
    console.log('Navigation successful');
  } catch (navError) {
    console.error('Navigation failed, using fallback:', navError);
    window.location.href = path;
  }
};