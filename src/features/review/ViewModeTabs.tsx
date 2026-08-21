import { TextTabs } from '../../ui/TextTabs';

export type VisibilityMode = 'complete' | 'english' | 'chinese';

export function ViewModeTabs({ value, onChange }: {
  value: VisibilityMode; onChange: (value: VisibilityMode) => void;
}) {
  return <TextTabs
    label="复习显示模式"
    value={value}
    onChange={onChange}
    items={[
      { value: 'complete', label: '完整' },
      { value: 'english', label: '英文' },
      { value: 'chinese', label: '中文' },
    ]}
  />;
}
