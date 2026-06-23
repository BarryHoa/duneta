'use client';
import { useEffect, useMemo, useState } from 'react';
import { IbaseInput } from './IbaseInput';
import type { IbaseInputProps } from './IbaseInput';

// Numeric input with display formatting.

export type IbaseInputNumberValue = number | null;
export type IbaseInputNumberProps = Omit<
  IbaseInputProps,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'inputMode'
> & {
  value?: IbaseInputNumberValue;
  defaultValue?: IbaseInputNumberValue;
  onValueChange?: (value: IbaseInputNumberValue) => void;
  decimalPlaces?: number;
  thousandSeparator?: string;
  decimalSeparator?: string;
  allowNegative?: boolean;
  min?: number;
  max?: number;
  fixZero?: boolean;
};

function format(
  value: IbaseInputNumberValue,
  decimals: number,
  thousand: string,
  decimal: string,
  fixZero: boolean,
) {
  if (value == null || Number.isNaN(value)) return '';
  const output = fixZero ? value.toFixed(decimals) : String(value);
  const [whole, fraction] = output.split('.');
  return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, thousand)}${fraction ? `${decimal}${fraction}` : ''}`;
}
function parse(
  raw: string,
  thousand: string,
  decimal: string,
  allowNegative: boolean,
): IbaseInputNumberValue {
  const normalized = raw
    .replaceAll(thousand, '')
    .replace(decimal, '.')
    .replace(/[^\d.-]/g, '');
  if (
    normalized === '' ||
    normalized === '-' ||
    normalized === '.' ||
    normalized === '-.'
  )
    return null;
  const value = Number(
    allowNegative ? normalized : normalized.replaceAll('-', ''),
  );
  return Number.isFinite(value) ? value : null;
}
export function IbaseInputNumber({
  value,
  defaultValue = null,
  onValueChange,
  decimalPlaces = 0,
  thousandSeparator = '.',
  decimalSeparator = ',',
  allowNegative = true,
  min,
  max,
  fixZero = true,
  onFocus,
  onBlur,
  ...props
}: IbaseInputNumberProps) {
  const controlled = value !== undefined;
  const [current, setCurrent] = useState<IbaseInputNumberValue>(
    controlled ? (value ?? null) : defaultValue,
  );
  const [focused, setFocused] = useState(false);
  const active = controlled ? (value ?? null) : current;
  const [draft, setDraft] = useState(() =>
    format(active, decimalPlaces, thousandSeparator, decimalSeparator, fixZero),
  );
  useEffect(() => {
    if (!focused)
      setDraft(
        format(
          active,
          decimalPlaces,
          thousandSeparator,
          decimalSeparator,
          fixZero,
        ),
      );
  }, [
    active,
    decimalPlaces,
    thousandSeparator,
    decimalSeparator,
    fixZero,
    focused,
  ]);
  const commit = (raw: string) => {
    let parsed = parse(raw, thousandSeparator, decimalSeparator, allowNegative);
    if (parsed != null) {
      parsed = Number(parsed.toFixed(decimalPlaces));
      if (min != null) parsed = Math.max(min, parsed);
      if (max != null) parsed = Math.min(max, parsed);
    }
    if (!controlled) setCurrent(parsed);
    onValueChange?.(parsed);
    setDraft(
      format(
        parsed,
        decimalPlaces,
        thousandSeparator,
        decimalSeparator,
        fixZero,
      ),
    );
  };
  return (
    <IbaseInput
      {...props}
      type="text"
      inputMode="decimal"
      value={
        focused
          ? draft
          : format(
              active,
              decimalPlaces,
              thousandSeparator,
              decimalSeparator,
              fixZero,
            )
      }
      onChange={(event) => {
        const next = event.target.value;
        setDraft(next);
        const parsed = parse(
          next,
          thousandSeparator,
          decimalSeparator,
          allowNegative,
        );
        onValueChange?.(
          parsed == null ? null : Number(parsed.toFixed(decimalPlaces)),
        );
      }}
      onFocus={(event) => {
        setFocused(true);
        setDraft(active == null ? '' : String(active));
        window.setTimeout(() => event.target.select(), 0);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        commit(draft);
        onBlur?.(event);
      }}
    />
  );
}
