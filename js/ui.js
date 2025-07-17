function UIManager(fileManager) {
    this.fileManager = fileManager;
    
    this.init = function() {
        this.setupDragAndDrop();
        this.setupFileInput();
        this.setupFilters();
    };
    
    //Загрузка через зону drag-drop
    this.setupDragAndDrop = function() {
        const dropZone = $('.drop-zone');
        
        dropZone.on('dragover', function(e) {
            e.preventDefault();
            
        });
        
        dropZone.on('dragleave mouseleave', function(e) {
            e.preventDefault();
        });
        
        dropZone.on('drop', function(e) {
            e.preventDefault();
            
            if (e.originalEvent.dataTransfer.files.length) {
                fileManager.addFiles(e.originalEvent.dataTransfer.files);
                this.renderFiles();
            }
        }.bind(this));
    };


    //Загрузка через кнопку
    this.setupFileInput = function() {
        const fileInput = $('#file-input');
        
        $('.btn-select').on('click', function() {
            fileInput.click();
        });
        
        fileInput.on('change', function(e) {
            const files = e.target.files;
            if (files.length) {
                this.fileManager.addFiles(files);
                this.renderFiles();
                fileInput.val('');
            }
        }.bind(this));
    };
    
    // Настройка фильтров
    this.setupFilters = function() {
        $('.filter-type, .filter-size').on('change', function() {
            this.renderFiles();
        }.bind(this));
        
        $('.filter-size').on('input', function() {
            const maxSize = $(this).val();
            $('.size-value').text(maxSize + ' KB');
        });
    };
    
    
    // Показ файлов
    this.renderFiles = function() {
        const filterType = $('.filter-type').val();
        const maxSize = $('.filter-size').val();
        const files = fileManager.getFiles(filterType, maxSize);
        const container = $('.files-container');
        
        container.empty();
        
        if (files.length === 0) {
            container.append('<div class="no-files">Нет файлов для отображения</div>');
            $('.btn-download-all').prop('disabled', true);
            return;
        }
        
        $('.btn-download-all').prop('disabled', false);
        
        files.forEach(fileObj => {
            const file = fileObj.file;
            const card = $(`<div class="file-card" data-id="${fileObj.id}"></div>`);
            

            const header = $(`<div class="file-header">
                <span class="file-name">${fileObj.name}</span>
                <span class="file-size">${(file.size / 1024).toFixed(2)} KB</span>
                <button class="btn-delete">×</button>
            </div>`);
            
            card.append(header);
            
            // Показывает в зависимости от типа файла
            if (file.type.startsWith('image/')) {
                const imgContainer = $('<div class="file-preview image-preview"></div>');
                const img = $('<img>');
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    img.attr('src', e.target.result);
                    
                    // Исходный размер изображения
                    img.on('load', function() {
                        $(this).after(`<div class="image-dimensions">${this.naturalWidth}×${this.naturalHeight}</div>`);
                    });
                };
                reader.readAsDataURL(file);
                
                imgContainer.append(img);
                card.append(imgContainer);
            } 
            else if (file.type.startsWith('text/')) {
                const textContainer = $('<div class="file-preview text-preview"></div>');
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const text = e.target.result;
                    const lines = text.split('\n').slice(0, 5).join('<br>');
                    textContainer.html(lines);
                };
                reader.readAsText(file);
                
                card.append(textContainer);
            } 
            else {
                card.append(`<div class="file-preview other-preview">
                    <div class="file-icon">${file.name.split('.').pop().toUpperCase()}</div>
                </div>`);
            }
            
            // Кнопки управления
            const controls = $(`<div class="file-controls">
                <button class="btn-rename">Переименовать</button>
                <button class="btn-download">Скачать</button>
            </div>`);
            
            card.append(controls);
            container.append(card);
        });
        
        this.setupFileCardEvents();
    };
    
    // Настройка обработчиков событий для карточек файлов
    this.setupFileCardEvents = function() {
        // Удаление файла
        $('.btn-delete').on('click', function() {
            const card = $(this).closest('.file-card');
            const id = card.data('id');
            
            fileManager.removeFile(id);
            card.fadeOut(300, function() {
                $(this).remove();
                if ($('.file-card').length === 0) {
                    $('.files-container').append('<div class="no-files">Нет файлов для отображения</div>');
                    $('.btn-download-all').prop('disabled', true);
                }
            });
        });
        
        // Переименование файла
        $('.btn-rename').on('click', function() {
            const card = $(this).closest('.file-card');
            const id = card.data('id');
            const fileNameElement = card.find('.file-name');
            const currentName = fileNameElement.text();
            const nameWithoutExt = currentName.replace(/\.[^/.]+$/, "");
            
            const newName = prompt('Введите новое имя файла:', nameWithoutExt);
            if (newName && newName !== nameWithoutExt) {
                fileManager.renameFile(id, newName);
                fileNameElement.text(fileManager.files.find(f => f.id === id).name);
            }
        });
        
        // Скачивание файла
        $('.btn-download').on('click', function() {
            const card = $(this).closest('.file-card');
            const id = card.data('id');
            const fileObj = fileManager.files.find(f => f.id === id);
            
            if (fileObj) {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(fileObj.file);
                a.download = fileObj.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href); //освобождает место в памяти после того, как фаил скачался
            }
        });
    };
    

    this.init();
}

