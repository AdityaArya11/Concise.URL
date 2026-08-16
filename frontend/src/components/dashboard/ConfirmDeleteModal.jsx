import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function ConfirmDeleteModal({ open, onClose, onConfirm, itemLabel }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete link"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>Delete</Button>
        </>
      }
    >
      <p className="text-body text-gray-600 dark:text-gray-300">
        Are you sure you want to delete <span className="font-mono text-gray-900 dark:text-gray-100">{itemLabel}</span>? This can't be undone, and the short link will stop working immediately.
      </p>
    </Modal>
  );
}
