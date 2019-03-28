export async function getFile() {
  return new Promise((resolve) => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', 'multiple');
    fileSelector.click();

    fileSelector.addEventListener('change', (e) => {
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
