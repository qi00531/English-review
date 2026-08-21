import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SettingsPage } from './SettingsPage';

describe('SettingsPage', () => {
  it('changes accent, exports data, reports health, and protects destructive clearing', async () => {
    const user = userEvent.setup();
    const onAccentChange = vi.fn();
    const onExport = vi.fn();
    const onClear = vi.fn();
    render(<SettingsPage accent="us" health="available" onAccentChange={onAccentChange} onExport={onExport} onImport={vi.fn()} onClear={onClear} />);
    expect(screen.getByText('词典与 AI 服务可用')).toBeInTheDocument();
    expect(screen.getByText(/清除浏览器站点数据也会删除/)).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: '英式发音' }));
    expect(onAccentChange).toHaveBeenCalledWith('uk');
    await user.click(screen.getByRole('button', { name: '导出 JSON 备份' }));
    expect(onExport).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: '清空全部本地数据' }));
    expect(onClear).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: '确认清空' }));
    expect(onClear).toHaveBeenCalled();
  });
});
