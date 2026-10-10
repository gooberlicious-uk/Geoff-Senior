// Submits Web3Forms forms in the background and shows the result in place.
document.querySelectorAll('form.web3form').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
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
