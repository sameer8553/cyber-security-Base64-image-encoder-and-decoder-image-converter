document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Encoder functionality
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const previewImage = document.getElementById('previewImage');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const resetBtn = document.getElementById('resetBtn');
    const codeOutput = document.getElementById('codeOutput');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const successMessage = document.getElementById('successMessage');
    const fileInfo = document.getElementById('fileInfo');
    const codeLength = document.getElementById('codeLength');
    const fileSize = document.getElementById('fileSize');
    
    let base64Code = '';
    let originalFileSize = 0;
    
    // Upload area click event
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelection();
        }
    });
    
    // File input change event
    fileInput.addEventListener('change', handleFileSelection);
    
    function handleFileSelection() {
        const file = fileInput.files[0];
        
        if (file) {
            // Check if file is an image
            if (!file.type.match('image.*')) {
                alert('Please select an image file (JPG, PNG, GIF, WEBP)');
                return;
            }
            
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit. Please choose a smaller image.');
                return;
            }
            
            // Update file info
            originalFileSize = file.size;
            fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
            fileSize.textContent = `Size: ${formatFileSize(file.size)}`;
            
            // Display preview
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                generateBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Generate Base64 code
    generateBtn.addEventListener('click', function() {
        if (!fileInput.files.length) return;
        
        loadingIndicator.style.display = 'block';
        successMessage.style.display = 'none';
        
        // Simulate processing time for better UX
        setTimeout(() => {
            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                base64Code = e.target.result;
                codeOutput.textContent = base64Code;
                codeLength.textContent = `Length: ${base64Code.length} characters`;
                copyBtn.disabled = false;
                loadingIndicator.style.display = 'none';
            };
            
            reader.readAsDataURL(file);
        }, 800);
    });
    
    // Copy to clipboard
    copyBtn.addEventListener('click', function() {
        if (!base64Code) return;
        
        navigator.clipboard.writeText(base64Code).then(() => {
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        });
    });
    
    // Reset functionality
    resetBtn.addEventListener('click', function() {
        fileInput.value = '';
        previewImage.style.display = 'none';
        codeOutput.textContent = 'Your Base64 encoded image will appear here...';
        generateBtn.disabled = true;
        copyBtn.disabled = true;
        successMessage.style.display = 'none';
        fileInfo.textContent = 'No file selected';
        codeLength.textContent = 'Length: 0 characters';
        fileSize.textContent = 'Size: 0 KB';
        base64Code = '';
        originalFileSize = 0;
    });
    
    // Decoder functionality
    const base64Input = document.getElementById('base64Input');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const decodeLoading = document.getElementById('decodeLoading');
    const decodeError = document.getElementById('decodeError');
    const decodedImage = document.getElementById('decodedImage');
    const decodedInfo = document.getElementById('decodedInfo');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Decode Base64 to image
    decodeBtn.addEventListener('click', function() {
        const base64Data = base64Input.value.trim();
        
        if (!base64Data) {
            showDecodeError('Please enter Base64 data to decode.');
            return;
        }
        
        decodeLoading.style.display = 'block';
        decodeError.style.display = 'none';
        
        // Simulate processing time
        setTimeout(() => {
            try {
                // Check if it's a valid data URL or just base64
                let imageSrc = base64Data;
                if (!base64Data.startsWith('data:')) {
                    imageSrc = `data:image/jpeg;base64,${base64Data}`;
                }
                
                // Verify it's a valid image
                const img = new Image();
                img.onload = function() {
                    decodedImage.src = imageSrc;
                    decodedImage.style.display = 'block';
                    decodedInfo.textContent = `Decoded image (${img.width} × ${img.height})`;
                    downloadBtn.disabled = false;
                    decodeLoading.style.display = 'none';
                };
                
                img.onerror = function() {
                    showDecodeError('Invalid Base64 image data. Please check your input.');
                    decodeLoading.style.display = 'none';
                };
                
                img.src = imageSrc;
            } catch (error) {
                showDecodeError('Error decoding Base64 data. Please check your input.');
                decodeLoading.style.display = 'none';
            }
        }, 800);
    });
    
    // Clear decoder
    clearBtn.addEventListener('click', function() {
        base64Input.value = '';
        decodedImage.style.display = 'none';
        decodedInfo.textContent = 'No image decoded yet';
        downloadBtn.disabled = true;
        decodeError.style.display = 'none';
    });
    
    // Download decoded image
    downloadBtn.addEventListener('click', function() {
        if (!decodedImage.src) return;
        
        const link = document.createElement('a');
        link.href = decodedImage.src;
        link.download = 'decoded-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    // Helper function to format file size
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / 1048576).toFixed(2) + ' MB';
    }
    
    // Helper function to show decode error
    function showDecodeError(message) {
        decodeError.textContent = message;
        decodeError.style.display = 'block';
    }
});