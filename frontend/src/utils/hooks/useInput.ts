import React, { SetStateAction, useCallback, useMemo, useState } from 'react';

export interface UseInputActions {
  setValue: React.Dispatch<SetStateAction<string>>;
  onChange: (e: React.BaseSyntheticEvent) => void;
  clear: () => void;
}

export type UseInput = [string, UseInputActions, boolean];

export function useInput(
  initial: string = '',
  validator: (str: string) => boolean = (str) => str.trim() !== ''
): UseInput {
  const [value, setValue] = useState(initial);

  const onChange = useCallback((e) => setValue(e.target.value.toString()), []);
  const clear = useCallback(() => setValue(''), []);

  const valid = validator(value);
  const actions = useMemo(
    () => ({
      setValue,
      clear,
      onChange,
    }),
    [clear, onChange]
  );
  return [value, actions, valid];
}
