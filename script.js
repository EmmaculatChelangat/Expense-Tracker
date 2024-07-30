document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard-page').style.display = 'block';
    } else {
        alert('Login failed');
    }
});

document.getElementById('fetch-transactions').addEventListener('click', async () => {
    const response = await fetch('http://localhost:3000/transactions', {
        method: 'GET',
        credentials: 'include'
    });

    if (response.ok) {
        const transactions = await response.json();
        const transactionsDiv = document.getElementById('transactions');
        transactionsDiv.innerHTML = transactions.map(t => `<div>Amount: ${t.amount}, Description: ${t.description}</div>`).join('');
    } else {
        alert('Failed to fetch transactions');
    }
});
