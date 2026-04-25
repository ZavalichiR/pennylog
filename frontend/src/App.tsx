import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Period, Transaction } from './types';
import { Header } from './shared/components/Header';
import { Dashboard } from './features/dashboard/Dashboard';
import { TransactionForm } from './features/transactions/TransactionForm';
import { Modal } from './shared/components/Modal';

export default function App() {
  const [period, setPeriod] = useState<Period>('month');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const openAdd = () => {
    setEditingTx(null);
    setIsFormOpen(true);
  };

  const openEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTx(null);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    closeForm();
  };

  return (
    <>
      <Header
        period={period}
        onPeriodChange={setPeriod}
        onAdd={openAdd}
        selectedTagIds={selectedTagIds}
        onTagFilterChange={setSelectedTagIds}
      />
      <main className="main">
        <Dashboard period={period} onEdit={openEdit} selectedTagIds={selectedTagIds} />
      </main>
      <Modal isOpen={isFormOpen} onClose={closeForm} title={editingTx ? 'Edit Transaction' : 'Add Transaction'}>
        <TransactionForm
          transaction={editingTx}
          onSuccess={handleSuccess}
          onCancel={closeForm}
        />
      </Modal>
    </>
  );
}
