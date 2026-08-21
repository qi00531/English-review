import { useRef } from 'react';

type TabItem<Value extends string> = { value: Value; label: string };

export function TextTabs<Value extends string>({ label, value, items, onChange }: {
  label: string; value: Value; items: TabItem<Value>[]; onChange: (value: Value) => void;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  return (
    <div className="text-tabs" role="tablist" aria-label={label}>
      {items.map((item, index) => (
        <button
          key={item.value}
          ref={(node) => { refs.current[index] = node; }}
          type="button"
          role="tab"
          aria-selected={item.value === value}
          tabIndex={item.value === value ? 0 : -1}
          onClick={() => onChange(item.value)}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
            event.preventDefault();
            const direction = event.key === 'ArrowRight' ? 1 : -1;
            const nextIndex = (index + direction + items.length) % items.length;
            refs.current[nextIndex]?.focus();
            onChange(items[nextIndex].value);
          }}
        >{item.label}</button>
      ))}
    </div>
  );
}
