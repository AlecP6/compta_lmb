import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

interface DeletionLog {
  id: string;
  transactionId: string;
  transactionType: string;
  amount: number;
  description: string;
  deletedAt: string;
  deletedByUser: {
    id: string;
    username: string;
    name: string;
  };
}

interface WeeklyStat {
  week: string;
  users: {
    userName: string;
    total: number;
  }[];
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deletionLogs, setDeletionLogs] = useState<DeletionLog[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'logs' | 'stats'>('logs');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!user.isAdmin) {
      navigate('/dashboard');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [logsData, statsData] = await Promise.all([
        adminService.getDeletionLogs(),
        adminService.getWeeklyStats(),
      ]);
      setDeletionLogs(logsData.logs || []);
      setWeeklyStats(statsData.stats || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données admin:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatWeek = (weekString: string) => {
    const date = new Date(weekString);
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + 6);
    
    return `${date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} - ${endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>Panel Administrateur</h1>
          <p>Bienvenue, {user?.name}</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          Retour au Dashboard
        </button>
      </header>

      <div className="admin-tabs">
        <button
          className={activeTab === 'logs' ? 'active' : ''}
          onClick={() => setActiveTab('logs')}
        >
          Logs de Suppressions
        </button>
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Statistiques Hebdomadaires
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'logs' && (
          <div className="logs-section">
            <h2>Logs de Suppressions</h2>
            {deletionLogs.length === 0 ? (
              <div className="empty-state">Aucune suppression enregistrée</div>
            ) : (
              <div className="logs-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Supprimé par</th>
                      <th>Type</th>
                      <th>Montant</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletionLogs.map((log) => (
                      <tr key={log.id}>
                        <td>{formatDate(log.deletedAt)}</td>
                        <td>{log.deletedByUser.name}</td>
                        <td>
                          <span className={`type-badge type-${log.transactionType.toLowerCase()}`}>
                            {log.transactionType === 'INCOME' ? 'Entrée' : 'Sortie'}
                          </span>
                        </td>
                        <td>{formatCurrency(log.amount)}</td>
                        <td>{log.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-section">
            <h2>Total des Entrées par Semaine et par Utilisateur</h2>
            {weeklyStats.length === 0 ? (
              <div className="empty-state">Aucune statistique disponible</div>
            ) : (
              <div className="stats-table">
                <table>
                  <thead>
                    <tr>
                      <th>Semaine</th>
                      <th>Utilisateur</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyStats.map((stat) =>
                      stat.users.map((userStat, index) => (
                        <tr key={`${stat.week}-${index}`}>
                          {index === 0 && (
                            <td rowSpan={stat.users.length}>{formatWeek(stat.week)}</td>
                          )}
                          <td>{userStat.userName}</td>
                          <td className="amount-cell">{formatCurrency(userStat.total)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

