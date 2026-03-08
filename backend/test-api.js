const axios = require('axios');
async function test() {
    try {
        const login = await axios.post('http://localhost:3001/api/auth/login', { login: 'admin@rentacar.co.mz', password: 'admin123' });
        const token = login.data.accessToken;
        const adminR = await axios.get('http://localhost:3001/api/bookings/admin?limit=1', { headers: { Authorization: `Bearer ${token}` } });
        console.log(JSON.stringify(adminR.data.data[0].totalPrice));
        const dashboard = await axios.get('http://localhost:3001/api/dashboard/kpis', { headers: { Authorization: `Bearer ${token}` } });
        console.log(JSON.stringify(dashboard.data.recentBookings[0].totalPrice));
    } catch (e) {
        console.error(e.message);
    }
}
test();
