import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import for navigation
import axios from 'axios';
import Header from './header';

const API_BASE_URL = 'http://localhost:6005/api/invoices';

const Dashboard = () => {
  // State for invoices
  const [invoices, setInvoices] = useState([]);

  // Form state for adding a new invoice
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    dueDate: '',
  });

  // State for modal popups
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Fetch invoices from backend API
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  // Handle form submission (Add a new invoice)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_BASE_URL, formData);
      setInvoices([...invoices, response.data]); // Add new invoice to state
      setFormData({ recipient: '', amount: '', dueDate: '' }); // Reset form
    } catch (error) {
      console.error('Error adding invoice:', error);
    }
  };

  // Handle invoice deletion
  const handleDelete = async (invoiceId) => {
    try {
      await axios.delete(`${API_BASE_URL}/${invoiceId}`);
      setInvoices(invoices.filter((invoice) => invoice._id !== invoiceId)); // Remove from state
      setModalMessage('Invoice deleted successfully!');
      setShowDeleteModal(true);
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  // Trigger Invoice Reminder via Zapier (Modal Popup)
  const sendReminder = async (invoiceId) => {
    try {
      await axios.post(`${API_BASE_URL}/trigger-reminder`, { invoiceId });

      // Show custom modal popup instead of navigating to localhost
      setModalMessage('Invoice reminder sent successfully via Zapier!');
      setShowModal(true);
    } catch (error) {
      console.error('Error sending reminder:', error);
      setModalMessage('Failed to send reminder.');
      setShowModal(true);
    }
  };
  

  return (
    <div className="dashboard-container">
      <Header />

      <h2 className="dashboard-title">Invoice Dashboard</h2>

      <div className="form-container">
        <h3>Add New Invoice</h3>
        <form onSubmit={handleSubmit} className="invoice-form">
          <input
            type="text"
            name="recipient"
            placeholder="Recipient Email"
            value={formData.recipient}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount ($)"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-button">
            Add Invoice
          </button>
        </form>
      </div>

      <div className="table-container">
        <div>
          <h3>Invoices</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Recipient</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice._id}</td>
                  <td>{invoice.recipient}</td>
                  <td>${invoice.amount}</td>
                  <td>{invoice.dueDate}</td>
                  <td>
                    <button
                      className="action-button reminder"
                      onClick={() => sendReminder(invoice._id)}
                    >
                      Send Reminder
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => handleDelete(invoice._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-invoices">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Popup for Reminder */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}

      {/* Modal Popup for Deletion */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{modalMessage}</p>
            <button onClick={() => setShowDeleteModal(false)}>OK</button>
          </div>
        </div>
      )}


      
      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 2rem;
          font-family: Arial, sans-serif;
          color: #333;
        }

        .dashboard-title {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2rem;
          color: #2c3e50;
        }

        .form-container {
          background: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .invoice-form {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
        }

        .invoice-form input {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          flex: 1;
          min-width: 200px;
        }

        .submit-button {
          background: #3182ce;
          color: #fff;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .submit-button:hover {
          background: #2b6cb0;
        }

        .table-container {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 900px; /* Reduced min-width */
  }

  th,
  td {
    padding: 0.75rem; /* Reduced padding */
    border: 1px solid #ddd;
    text-align: left;
    font-size: 0.9rem; /* Slightly smaller font */
  }

  th {
    background: #3182ce;
    color: #fff;
  }

        .no-invoices {
          text-align: center;
          padding: 1rem;
          font-style: italic;
          color: #777;
        }

        .action-button {
          margin-right: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s ease;
          color: #fff;
        }

        .action-button.reminder {
          background: #ffa502;
        }

        .action-button.delete {
          background: #ff4757;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          text-align: center;
        }
          .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Adjust spacing as needed */
  }
  
   /* Logout Button - Positioned at Bottom Right */
  .logout-button {
    position: fixed; /* Fixes position on the screen */
    bottom: 20px; /* Distance from the bottom */
    right: 20px; /* Distance from the right */
    padding: 10px 20px;
    background-color: #3182ce;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Optional: Adds a shadow effect */
  }

  .logout-button:hover {
    background-color: #2b6cb0;
  }
      `}</style>
    </div>
  );
};

export default Dashboard;
