// Submits Web3Forms forms in the background and shows the result in place.
// Validation errors are shown inline under each field instead of the
// browser's own popups, which are grey and don't scroll with the page.
function fieldErrorMessage(field) {
    var label = document.querySelector('label[for="' + field.id + '"]');
    var name = label ? label.textContent.trim() : 'This field';
    if (field.validity.valueMissing) return name + ' is required.';
    if (field.validity.typeMismatch && field.type === 'email') return 'Please enter a valid email address.';
    return field.validationMessage;
}

function showFieldError(field) {
    var group = field.closest('.form-group');
    var error = group.querySelector('.field-error');
    if (field.validity.valid) {
        group.classList.remove('has-error');
        field.removeAttribute('aria-invalid');
        if (error) error.remove();
        return true;
    }
    if (!error) {
        error = document.createElement('span');
        error.className = 'field-error';
        error.id = field.id + '-error';
        field.insertAdjacentElement('afterend', error);
        field.setAttribute('aria-describedby', error.id);
    }
    error.textContent = fieldErrorMessage(field);
    group.classList.add('has-error');
    field.setAttribute('aria-invalid', 'true');
    return false;
}

document.querySelectorAll('form.web3form').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    var fields = form.querySelectorAll('.form-group .form-control');

    form.noValidate = true;

    // Once a field has been flagged, clear or update its error as the user types.
    fields.forEach(function (field) {
        field.addEventListener('input', function () {
            if (field.closest('.form-group').classList.contains('has-error')) showFieldError(field);
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var firstInvalid = null;
        fields.forEach(function (field) {
            if (!showFieldError(field) && !firstInvalid) firstInvalid = field;
        });
        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

        button.disabled = true;
        status.className = 'form-status';
        status.textContent = 'Sending…';

        fetch(form.action, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(form)
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (!data.success) throw new Error(data.message);
                form.reset();
                status.className = 'form-status alert alert-success';
                status.textContent = form.dataset.success;
            })
            .catch(function () {
                status.className = 'form-status alert alert-danger';
                status.textContent = 'Sorry, something went wrong. Please try again later.';
            })
            .then(function () { button.disabled = false; });
    });
});
