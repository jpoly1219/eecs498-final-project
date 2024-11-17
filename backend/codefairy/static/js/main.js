// Tab Switching Logic
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));

        // Add active class to clicked button
        button.classList.add('active');

        // Show the corresponding tab content
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.remove('hidden');
    });
});
