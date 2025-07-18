// utils/download.ts
import { message } from 'antd';

export type DownloadOptions = {
  defaultFileName?: string;
  suffix?: string;
  onSuccess?: () => void;
  onError?: (err: any) => void;
};

export async function downloadFile(
  api: () => Promise<{
    data: Blob;
    headers: Record<string, string>;
  }>,
  opts: DownloadOptions = {},
) {
  const hide = message.loading('正在导出...', 0);
  const {
    defaultFileName = '数据',
    suffix = '.xlsx',
    onSuccess,
    onError,
  } = opts;

  try {
    const { data: blob, headers } = await api();

    let filename = `${defaultFileName}_${Date.now()}${suffix}`;
    const disposition = headers['content-disposition'] || '';

    const utf8Match = /filename\*=utf-8''(.+)/i.exec(disposition);
    if (utf8Match?.[1]) {
      filename = decodeURIComponent(utf8Match[1]);
    } else {
      const legacyMatch = /filename=["']?([^"'\s]+)["']?/i.exec(disposition);
      if (legacyMatch?.[1]) filename = legacyMatch[1];
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    hide();
    message.success('导出成功');
    onSuccess?.();
  } catch (err) {
    hide();
    message.error('导出失败，请重试');
    onError?.(err);
  }
}
