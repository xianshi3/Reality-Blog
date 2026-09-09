export type UploadProgress = (bytesUploaded: number, totalBytes: number) => void;

// 经服务端鉴权接口上传（/api/storage，需登录），
// 服务端使用 service role 落存储，客户端不再持有匿名直传能力
function uploadViaXHR(
  file: File,
  onProgress?: UploadProgress
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/storage");

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(e.loaded, e.total);
        }
      };
    }

    xhr.onload = () => {
      let message = "";
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          if (data.url) {
            resolve(data.url);
            return;
          }
          message = data.error || "上传失败";
        } else {
          message = data.error || `上传失败（HTTP ${xhr.status}）`;
        }
      } catch {
        message = xhr.status >= 200 && xhr.status < 300
          ? "上传响应解析失败"
          : `上传失败（HTTP ${xhr.status}）`;
      }
      reject(new Error(message));
    };
    xhr.onerror = () => reject(new Error("网络错误，请检查连接"));
    xhr.ontimeout = () => reject(new Error("上传超时"));

    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  });
}

// 普通上传（无进度回调）
export async function uploadImage(file: File): Promise<string> {
  return uploadViaXHR(file);
}

// 带实时进度回调的上传（大文件上传时展示进度条）
export async function uploadImageWithProgress(
  file: File,
  onProgress: UploadProgress
): Promise<string> {
  return uploadViaXHR(file, onProgress);
}
