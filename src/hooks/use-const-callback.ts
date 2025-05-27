import { useCallback, useRef } from 'react';

export const useConstCallback = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
): ((...args: Args) => Return) => {
  const ref = useRef<(...args: Args) => Return>(fn);
  return useCallback((...args: Args) => ref.current(...args), [ref]);
};
