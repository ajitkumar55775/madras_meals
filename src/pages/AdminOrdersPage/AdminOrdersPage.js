import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Form, Modal } from 'react-bootstrap';
import { getAdminOrders, updateOrderStatus } from '../../services/orderService';
import DateTime from '../../components/DateTime/DateTime';
import classes from './adminOrdersPage.module.css';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const statusColors = {
    NEW: 'primary',
    PAYMENT_PENDING: 'warning',
    PAID: 'success',
    PREPARING: 'info',
    READY: 'secondary',
    DELIVERED: 'dark',
    CANCELLED: 'danger'
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  return (
    <div className={classes.container}>
      <h2 className="mb-4">Order Management</h2>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total Items</th>
            <th>Current Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>#{order.id.slice(-6)}</td>
              <td>{order.name}</td>
              <td><DateTime date={order.createdAt} /></td>
              <td>{order.items.length}</td>
              <td>
                <Badge bg={statusColors[order.status]}>{order.status}</Badge>
              </td>
              <td>
                <Form.Select 
                  aria-label="Status select"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="NEW">New</option>
                  <option value="PAYMENT_PENDING">Payment Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="PREPARING">Preparing</option>
                  <option value="READY">Ready</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </Form.Select>
                
                <Button 
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowHistory(true);
                  }}
                >
                  View History
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showHistory} onHide={() => setShowHistory(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Status History</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {selectedOrder?.statusHistory.map((entry, index) => (
            <div key={index} className="mb-2">
              <Badge bg={statusColors[entry.status]}>{entry.status}</Badge>
              <span className="ms-2">
                <DateTime date={entry.timestamp} />
              </span>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
}