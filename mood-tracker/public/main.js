const apiUrl = '/api';

const loginForm = document.getElementById('loginForm');
const regForm = document.getElementById('registerForm');
const moodForm = document.getElementById('moodForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard.html';
    } else {
      alert(data.error || 'Login failed.');
    }
  });
}

if (regForm) {
  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const res = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) alert('Registered! Please login.');
    else alert('Registration failed.');
  });
}

if (moodForm) {
  const moodMap = {
    1: "Depressed 😢",
    2: "Very Sad 😞",
    3: "Sad 😟",
    4: "Low Energy 😕",
    5: "Neutral 😐",
    6: "Okay 🙂",
    7: "Good 😊",
    8: "Very Good 😃",
    9: "Great 😄",
    10: "Awesome 🤩"
  };

  const moodRange = document.getElementById('moodRange');
  const moodLabel = document.getElementById('moodLabel');

  moodRange.addEventListener('input', () => {
    const value = parseInt(moodRange.value);
    moodLabel.textContent = `${value} - ${moodMap[value] || ''}`;
  });

  moodForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mood = parseInt(moodRange.value);
    const note = document.getElementById('note').value;

    const res = await fetch(`${apiUrl}/moods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify({ mood, note })
    });

    if (res.ok) {
      alert('Mood saved!');
      window.location.reload();
    } else {
      alert('Error saving mood.');
    }
  });

  window.onload = async () => {
    const res = await fetch(`${apiUrl}/moods`, {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });

    const moods = await res.json();
    const labels = moods.map(m => new Date(m.date).toLocaleDateString()).reverse();
    const data = moods.map(m => parseInt(m.mood)).reverse();

    new Chart(document.getElementById('moodChart'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Mood Level',
          data: data,
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          tension: 0.3
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const moodNum = context.parsed.y;
                return `Mood: ${moodMap[moodNum] || moodNum}`;
              }
            }
          }
        },
        scales: {
          y: {
            min: 1,
            max: 10,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return `${value} - ${moodMap[value] || ''}`;
              }
            }
          }
        }
      }
    });
  };
}
