import fs from 'fs';

export async function getFile() {
  return new Promise((resolve) => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', 'multiple');
    fileSelector.click();

    fileSelector.addEventListener('change', () => {
      const file = fileSelector.files[0];
      resolve(file);
    });
  });
}

export async function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function readURL(url) {
  return new Promise((res, rej) => {
    fs.readFile(url, 'utf-8', (err, data) => {
      if (err) rej(err);

      res(data);
    });
  });
}
