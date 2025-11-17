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
  const [customCategory, setCustomCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const finalCategory = category === 'autre' ? customCategory : category;
      await transactionService.createTransaction({
        type,
        amount: parseFloat(amount),
        description,
        category: finalCategory || undefined,
      });
      onTransactionCreated();
      // Reset form
      setAmount('');
      setDescription('');
      setCategory('');
      setCustomCategory('');
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
          <select
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (e.target.value !== 'autre') {
                setCustomCategory('');
              }
            }}
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="argent propre">💰 Argent propre</option>
            <option value="argent sale">💵 Argent sale</option>
            <option value="autre">Autre (saisie libre)</option>
          </select>
          {category === 'autre' && (
            <input
              type="text"
              id="category-custom"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Saisir une catégorie personnalisée"
              style={{ marginTop: '8px', width: '100%' }}
            />
          )}
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

