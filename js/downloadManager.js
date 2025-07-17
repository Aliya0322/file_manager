export function setupDownloadButton(btnSelector, fileManager) {
 const btn = $(btnSelector);

 $('.btn-download-all').on('click', function() {
        if (typeof JSZip === 'undefined') {
            console.error('JSZip не подключён!');
            return;
        }

        const zip = new JSZip();
        fileManager.files.forEach(file => {
            zip.file(file.name, file.data);
        });

        zip.generateAsync({ type: 'blob' })
            .then(content => {
                saveAs(content, 'files.zip');
            })
            .catch(err => {
                console.error('Ошибка создания ZIP:', err);
            });
    });
}