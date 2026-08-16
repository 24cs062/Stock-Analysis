import { useParams } from 'react-router-dom';

export default function StockDetailPage() {
  const { ticker } = useParams();

  return (
    <div className="page-placeholder">
      <h1>📈 Stock Detail — {ticker || 'N/A'}</h1>
      <span className="badge">Phase 4</span>
      <p>Price chart, fundamentals, EquiMind Score, technical indicators, and AI summary.</p>
    </div>
  );
}
