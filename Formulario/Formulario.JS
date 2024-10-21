class FormValidator {
    constructor(form) {
        this.form = form;
        this.form.addEventListener('submit', (event) => this.handleSubmit(event));

        this.ageInput = document.getElementById('edad');
        this.ageValueDisplay = document.getElementById('edad-valor');
        this.birthDateInput = document.getElementById('fecha_nacimiento');
        this.errors = [];

        this.otherFields = Array.from(this.form.querySelectorAll('input, select')).filter(input => input.id !== 'nombre' && input.id !== 'apellido' && input.id !== 'fecha_nacimiento'); // Excluye nombre y fecha

        // Bloquear campos inicialmente hasta que seleccione una fecha de nacimiento válida
        this.toggleFields(false);

        // Mostrar el valor del slider de edad
        this.ageInput.addEventListener('input', () => {
            this.ageValueDisplay.textContent = this.ageInput.value;
        });

        // Calcular edad automáticamente cuando se selecciona la fecha de nacimiento
        this.birthDateInput.addEventListener('change', () => {
            const birthDate = new Date(this.birthDateInput.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age >= 18 && age <= 100) {
                this.ageInput.value = age;
                this.ageValueDisplay.textContent = age;
                this.clearError('edad');
                this.toggleFields(true);  // Desbloquear los campos
            } else {
                this.showErrors([{ field: 'edad', message: 'La edad debe estar entre 18 y 100 años.' }]);
                this.ageInput.value = ''; // Limpiar el valor de la edad si es inválida
                this.ageValueDisplay.textContent = '';
                this.toggleFields(false);  // Bloquear los campos nuevamente
            }
        });

        // Receptor de eventos para capturar el evento de carga y mostrar un mensaje de bienvenida
        window.addEventListener('load', () => {
            alert("¡Bienvenido al formulario!");
        });

        // Listener de eventos para evento de cambio de selección (Tipo de Documento)
        const tipoDocumentoSelect = document.getElementById('tipo_documento');
        tipoDocumentoSelect.addEventListener('change', () => {
            console.log(`Tipo de Documento seleccionado: ${tipoDocumentoSelect.value}`);
        });

        // Event listener para evento mouseover en el campo Nombre y Apellido
        const nombreField = document.getElementById('nombre');
        nombreField.addEventListener('mouseover', () => {
            console.log(`El valor actual en Nombre y Apellido es: ${nombreField.value}`);
        });

        // Escucha de eventos para keydown y keyup en Número de Documento
        const numeroDocumentoField = document.getElementById('numero_documento');
        numeroDocumentoField.addEventListener('keydown', (event) => {
            console.log(`Tecla presionada: ${event.key}`);
        });
        numeroDocumentoField.addEventListener('keyup', (event) => {
            console.log(`Tecla liberada: ${event.key}`);
        });
    }

    toggleFields(enable) {
        this.otherFields.forEach(field => {
            field.disabled = !enable;
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const errors = this.validateForm();
        if (errors.length === 0) {
            this.sendData();
            this.form.reset();  // Reiniciar el formulario
            this.ageValueDisplay.textContent = "";  // Reiniciar el valor visual de la edad
            this.clearAllErrors();  // Limpiar los mensajes de error
            this.toggleFields(false);  // Volver a bloquear los campos después de enviar
        } else {
            this.showErrors(errors);
        }
    }

    validateForm() {
        let errors = [];

        // Validar Nombre y Apellido
        const nombre = document.getElementById('nombre').value;
        const nombreRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{3,100}$/;
        if (!nombreRegex.test(nombre)) {
            errors.push({ field: "nombre", message: "Nombre y Apellido debe contener entre 3 y 100 caracteres y solo letras." });
        }

        // Validar Edad (tomada directamente del slider)
        const edad = this.ageInput.value;
        if (!edad || edad < 18 || edad > 100) {
            errors.push({ field: "edad", message: "La edad debe estar entre 18 y 100 años." });
        }

        // Validar Tipo de Documento
        const tipoDocumento = document.getElementById('tipo_documento').value;
        if (tipoDocumento === "") {
            errors.push({ field: "tipo_documento", message: "Debes seleccionar un tipo de documento." });
        }

        // Validar Número de Documento (solo números)
        const numeroDocumento = document.getElementById('numero_documento').value;
        const numeroDocumentoRegex = /^\d+$/;
        if (!numeroDocumentoRegex.test(numeroDocumento)) {
            errors.push({ field: "numero_documento", message: "El número de documento debe contener solo números." });
        }

        // Validar Género
        const genero = document.getElementById('genero').value;
        if (genero === "") {
            errors.push({ field: "genero", message: "Debes seleccionar un género." });
        }

        // Validar Hobby (solo una opción seleccionada)
        const hobby = document.querySelector('input[name="hobby"]:checked');
        if (!hobby) {
            errors.push({ field: "hobby", message: "Debes seleccionar un hobby." });
        }

        // Validar Habilidades (al menos una opción seleccionada)
        const habilidades = document.querySelectorAll('input[name="habilidades"]:checked');
        if (habilidades.length === 0) {
            errors.push({ field: "habilidades", message: "Debes seleccionar al menos una habilidad." });
        }

        // Validar Correo Electrónico
        const correo = document.getElementById('correo').value;
        const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!correoRegex.test(correo)) {
            errors.push({ field: "correo", message: "Debes ingresar un correo válido." });
        }

        // Validar Contraseña
        const contrasena = document.getElementById('contrasena').value;
        const contrasenaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@.*+])[a-zA-Z0-9@.*+]{8,}$/;
        if (!contrasenaRegex.test(contrasena)) {
            errors.push({ field: "contrasena", message: "La contraseña debe tener al menos 8 caracteres y contener al menos una letra mayúscula, una minúscula y un carácter especial (@, . , * , +)." });
        }

        return errors;
    }

    showErrors(errors) {
        this.clearAllErrors();  // Limpiar errores anteriores
        errors.forEach(error => {
            const errorElement = document.getElementById(`error-${error.field}`);
            if (errorElement) {
                errorElement.textContent = error.message;
                errorElement.classList.add('error-message');
            }
        });
    }

    clearError(field) {
        const errorElement = document.getElementById(`error-${field}`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }

    sendData() {
        alert('{"mensaje": "Formulario enviado exitosamente"}');
    }
}

// Instanciar la clase validadora cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario');
    new FormValidator(form);
});
