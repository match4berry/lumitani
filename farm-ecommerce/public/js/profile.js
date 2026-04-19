// Profile page functionality
document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.querySelector('.btn-edit');
    const logoutBtn = document.querySelector('.btn-logout');

    if (editBtn) {
        editBtn.addEventListener('click', function() {
            alert('Fitur edit profil akan segera tersedia');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Anda yakin ingin logout?')) {
                alert('Logout berhasil');
                // Redirect to home
                window.location.href = '/';
            }
        });
    }
});
