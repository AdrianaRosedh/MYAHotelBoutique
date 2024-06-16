import unittest
from app import app

class FlaskTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_search_availability(self):
        result = self.app.get('/search_availability?start_date=2023-01-01&end_date=2023-01-10')
        self.assertEqual(result.status_code, 200)

    def test_make_booking(self):
        booking_data = {
            'customer_name': 'John Doe',
            'room_id': 123,
            'check_in': '2023-01-01',
            'check_out': '2023-01-10',
            # Other required fields...
        }
        result = self.app.post('/make_booking', json=booking_data)
        self.assertEqual(result.status_code, 200)

    def test_cancel_booking(self):
        cancel_data = {
            'booking_id': 'abc123'
        }
        result = self.app.post('/cancel_booking', json=cancel_data)
        self.assertEqual(result.status_code, 200)

if __name__ == '__main__':
    unittest.main()
