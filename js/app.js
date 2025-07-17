import { setupDownloadButton } from "./downloadManager.js";

$(document).ready(function() {
    
    const fileManager = new FileManager();
    const uiManager = new UIManager(fileManager);

    setupDownloadButton('.btn-download-all', fileManager);
});