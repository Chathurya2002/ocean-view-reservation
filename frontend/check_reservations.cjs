const fs = require('fs');
const axios = require('axios');

axios.post('http://localhost:5000/api/auth/login', { email: 'admin_test@test.com', password: '123' })
    .then(res => {
        return axios.get('http://localhost:5000/api/reservations', {
            headers: { Authorization: 'Bearer ' + res.data.token }
        });
    })
    .then(res => {
        const all = res.data;
        const rentals = all.filter(r => r.rentals && r.rentals.length > 0);
        const rooms = all.filter(r => !r.rentals || r.rentals.length === 0);
        console.log(`Total: ${all.length}, Rentals: ${rentals.length}, Rooms: ${rooms.length}`);
        fs.writeFileSync('rooms_reservations.json', JSON.stringify(rooms, null, 2));
    })
    .catch(console.error);
