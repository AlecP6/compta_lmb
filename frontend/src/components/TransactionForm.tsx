import { useState, memo } from 'react';
import { transactionService } from '../services/transactionService';
import './TransactionForm.css';

interface TransactionFormProps {
  onTransactionCreated: () => void;
  onCancel: () => void;
}

const TransactionForm = memo(({
  onTransactionCreated,
  onCancel,
}: TransactionFormProps) => {
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await transactionService.createTransaction({
        type,
        amount: parseFloat(amount),
        description,
        category: category || undefined,
      });
      onTransactionCreated();
      // Reset form
      setAmount('');
      setDescription('');
      setCategory('');
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Erreur lors de la création de la transaction'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form-container">
      <form onSubmit={handleSubmit} className="transaction-form">
        <h3>Nouvelle Transaction</h3>

        {error && <div className="error-message">{error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <div className="type-buttons">
              <button
                type="button"
                className={type === 'INCOME' ? 'active income' : ''}
                onClick={() => setType('INCOME')}
              >
                📈 Entrée
              </button>
              <button
                type="button"
                className={type === 'EXPENSE' ? 'active expense' : ''}
                onClick={() => setType('EXPENSE')}
              >
                📉 Sortie
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Montant (€)</label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Description de la transaction"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Catégorie (optionnel)</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Nourriture, Transport, Salaire..."
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Annuler
          </button>
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
});

TransactionForm.displayName = 'TransactionForm';

export default TransactionForm;

