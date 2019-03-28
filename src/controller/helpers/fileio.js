export async function getFile() {
    return new Promise((resolve, reject) => {
        const fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');
        fileSelector.setAttribute('multiple', 'multiple');
        fileSelector.click();

        fileSelector.addEventListener('change', function (e) {
            let file = fileSelector.files[0];
            resolve(file);
        })
    })
}

export async function readFile(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;
        reader.readAsText(file);
    })
}