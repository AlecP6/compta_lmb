import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { transactionService } from '../services/transactionService';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import StatsCard from '../components/StatsCard';
import './Dashboard.css';

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

interface Stats {
  income: number;
  expenses: number;
  balance: number;
  totalTransactions: number;
  argentPropreBalance: number;
  argentSaleBalance: number;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [showForm, setShowForm] = useState(false);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (filter !== 'ALL') {
        filters.type = filter;
      }
      const data = await transactionService.getAllTransactions(filters);
      setTransactions(data.transactions);
      setBalance(data.balance);
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const loadStats = useCallback(async () => {
    try {
      const data = await transactionService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
    loadStats();
  }, [loadTransactions, loadStats]);

  // Actualisation automatique des stats toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      loadStats();
    }, 5000); // Actualise toutes les 5 secondes

    return () => clearInterval(interval);
  }, [loadStats]);

  const handleTransactionCreated = useCallback(() => {
    loadTransactions();
    loadStats();
    setShowForm(false);
  }, [loadTransactions, loadStats]);

  const handleTransactionDeleted = useCallback(() => {
    loadTransactions();
    loadStats();
  }, [loadTransactions, loadStats]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }, []);

  const formattedArgentPropre = useMemo(() => 
    stats ? formatCurrency(stats.argentPropreBalance) : '0,00 €', 
    [stats?.argentPropreBalance, formatCurrency]
  );
  const formattedArgentSale = useMemo(() => 
    stats ? formatCurrency(stats.argentSaleBalance) : '0,00 €', 
    [stats?.argentSaleBalance, formatCurrency]
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Comptabilité London Mandem Boys</h1>
          <p className="welcome-text">{user?.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user?.isAdmin && (
            <button onClick={() => navigate('/admin')} className="btn-admin">
              Panel Admin
            </button>
          )}
          <button onClick={logout} className="btn-logout">
            Déconnexion
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-section">
          {stats && (
            <>
              <StatsCard
                title="💰 Argent Propre"
                value={formattedArgentPropre}
                type="argent_propre"
                positive={stats.argentPropreBalance >= 0}
              />
              <StatsCard
                title="💵 Argent Sale"
                value={formattedArgentSale}
                type="argent_sale"
                positive={stats.argentSaleBalance >= 0}
              />
            </>
          )}
        </div>

        <div className="main-section">
          <div className="section-header">
            <h2>Transactions</h2>
            <div className="header-actions">
              <div className="filter-buttons">
                <button
                  className={filter === 'ALL' ? 'active' : ''}
                  onClick={() => setFilter('ALL')}
                >
                  Toutes
                </button>
                <button
                  className={filter === 'INCOME' ? 'active' : ''}
                  onClick={() => setFilter('INCOME')}
                >
                  Entrées
                </button>
                <button
                  className={filter === 'EXPENSE' ? 'active' : ''}
                  onClick={() => setFilter('EXPENSE')}
                >
                  Sorties
                </button>
              </div>
              <button
                className="btn-add"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Annuler' : 'Ajouter'}
              </button>
            </div>
          </div>

          {showForm && (
            <TransactionForm
              onTransactionCreated={handleTransactionCreated}
              onCancel={() => setShowForm(false)}
            />
          )}

          {loading ? (
            <div className="loading">Chargement...</div>
          ) : (
            <TransactionList
              transactions={transactions}
              onTransactionDeleted={handleTransactionDeleted}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

