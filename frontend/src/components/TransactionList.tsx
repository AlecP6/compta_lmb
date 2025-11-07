import { useState, useCallback, useMemo, memo } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { transactionService } from '../services/transactionService';
import './TransactionList.css';

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  category: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionDeleted: () => void;
}

const TransactionList = memo(({
  transactions,
  onTransactionDeleted,
}: TransactionListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      return;
    }

    try {
      setDeletingId(id);
      await transactionService.deleteTransaction(id);
      onTransactionDeleted();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la transaction');
    } finally {
      setDeletingId(null);
    }
  }, [onTransactionDeleted]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }, []);

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucune transaction pour le moment.</p>
        <p className="empty-hint">Ajoutez votre première transaction ci-dessus !</p>
      </div>
    );
  }

  const transactionItems = useMemo(() => {
    return transactions.map((transaction) => {
      const formattedAmount = formatCurrency(transaction.amount);
      const formattedDate = format(new Date(transaction.createdAt), 'dd MMM yyyy à HH:mm', {
        locale: fr,
      });

      return (
        <div
          key={transaction.id}
          className={`transaction-item transaction-${transaction.type.toLowerCase()}`}
        >
          <div className="transaction-main">
            <div className="transaction-icon">
              {transaction.type === 'INCOME' ? '📈' : '📉'}
            </div>
            <div className="transaction-details">
              <div className="transaction-header">
                <h4>{transaction.description}</h4>
                <span className={`transaction-amount amount-${transaction.type.toLowerCase()}`}>
                  {transaction.type === 'INCOME' ? '+' : '-'}
                  {formattedAmount}
                </span>
              </div>
              <div className="transaction-meta">
                {transaction.category && (
                  <span className="transaction-category">{transaction.category}</span>
                )}
                <span className="transaction-user">Par {transaction.user.name}</span>
                <span className="transaction-date">{formattedDate}</span>
              </div>
            </div>
          </div>
          <button
            className="btn-delete"
            onClick={() => handleDelete(transaction.id)}
            disabled={deletingId === transaction.id}
            title="Supprimer"
          >
            {deletingId === transaction.id ? '...' : '🗑️'}
          </button>
        </div>
      );
    });
  }, [transactions, formatCurrency, handleDelete, deletingId]);

  return (
    <div className="transaction-list">
      {transactionItems}
    </div>
  );
});

TransactionList.displayName = 'TransactionList';

export default TransactionList;

