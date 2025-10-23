// Contact form functionality for cyberpunk portfolio

class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.nameField = document.getElementById('name');
        this.emailField = document.getElementById('email');
        this.messageField = document.getElementById('message');
        this.submitButton = this.form?.querySelector('button[type="submit"]');
        
        this.init();
    }

    init() {
        if (!this.form) return;
        
        // Add event listeners
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Real-time validation
        this.nameField?.addEventListener('blur', () => this.validateField('name'));
        this.emailField?.addEventListener('blur', () => this.validateField('email'));
        this.messageField?.addEventListener('blur', () => this.validateField('message'));
        
        // Clear validation on input
        this.nameField?.addEventListener('input', () => this.clearValidation('name'));
        this.emailField?.addEventListener('input', () => this.clearValidation('email'));
        this.messageField?.addEventListener('input', () => this.clearValidation('message'));
    }

    validateField(fieldName) {
        const field = this[`${fieldName}Field`];
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'El nombre es requerido';
                } else if (field.value.trim().length < 2) {
                    isValid = false;
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'El correo electrónico es requerido';
                } else if (!emailRegex.test(field.value.trim())) {
                    isValid = false;
                    errorMessage = 'Por favor ingresa un correo electrónico válido';
                }
                break;
                
            case 'message':
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'El mensaje es requerido';
                } else if (field.value.trim().length < 10) {
                    isValid = false;
                    errorMessage = 'El mensaje debe tener al menos 10 caracteres';
                }
                break;
        }

        // Update UI based on validation
        if (isValid) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
            errorElement.textContent = '';
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            errorElement.textContent = errorMessage;
        }

        return isValid;
    }

    clearValidation(fieldName) {
        const field = this[`${fieldName}Field`];
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.remove('error', 'success');
    }

    validateForm() {
        const nameValid = this.validateField('name');
        const emailValid = this.validateField('email');
        const messageValid = this.validateField('message');
        
        return nameValid && emailValid && messageValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm()) {
            this.showMessage('Por favor corrige los errores antes de enviar', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateFormSubmission();
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showMessage('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    async simulateFormSubmission() {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 2000);
        });
    }

    setLoadingState(isLoading) {
        if (!this.submitButton) return;
        
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<span>Enviando...</span>';
            this.submitButton.classList.add('loading');
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = '<span>Enviar mensaje</span>';
            this.submitButton.classList.remove('loading');
        }
    }

    showSuccessMessage() {
        // Create or show success message
        let successMessage = this.form.querySelector('.success-message');
        
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            this.form.insertBefore(successMessage, this.form.firstChild);
        }
        
        successMessage.textContent = '¡Mensaje enviado exitosamente! Te contactaré pronto.';
        successMessage.classList.add('show');
        
        // Hide after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }

    showMessage(message, type = 'info') {
        // Create temporary message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Style the message
        Object.assign(messageElement.style, {
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: '500',
            backgroundColor: type === 'error' ? 'rgba(255, 0, 255, 0.1)' : 'rgba(0, 255, 65, 0.1)',
            border: type === 'error' ? '1px solid rgba(255, 0, 255, 0.3)' : '1px solid rgba(0, 255, 65, 0.3)',
            color: type === 'error' ? 'var(--neon-pink)' : 'var(--neon-green)',
            textShadow: type === 'error' ? '0 0 5px rgba(255, 0, 255, 0.3)' : '0 0 5px rgba(0, 255, 65, 0.3)'
        });
        
        this.form.insertBefore(messageElement, this.form.firstChild);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    resetForm() {
        this.form.reset();
        
        // Clear all validation states
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
        });
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactForm;
}