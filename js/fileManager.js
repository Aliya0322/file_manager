function FileManager() {
    this.files = [];
    
    this.addFiles = function(newFiles) {
        for (let i = 0; i < newFiles.length; i++) {
            this.files.push({
                file: newFiles[i],
                id: Date.now() + Math.random().toString(36).slice(2, 11),
                name: newFiles[i].name
            });
        }
    };
    
    
    this.removeFile = function(id) {
        this.files = this.files.filter(file => file.id !== id);
    };
    
    
    this.renameFile = function(id, newName) {
        const fileObj = this.files.find(file => file.id === id);
        if (fileObj) {
            const ext = fileObj.name.split('.').pop();
            fileObj.name = newName + (newName.includes('.') ? '' : '.' + ext);
        }
    };
    
    
    this.getFiles = function(filterType = 'all', maxSize = Infinity) {
        return this.files.filter(file => {

            if (file.file.size > maxSize * 1024) return false;
            
            
            if (filterType === 'all') return true;
            
            const type = file.file.type;
            if (filterType === 'image') return type.startsWith('image/');
            if (filterType === 'text') return type.startsWith('text/');
            if (filterType === 'other') return !type.startsWith('image/') && !type.startsWith('text/');
            
            return true;
        });
    };
}

