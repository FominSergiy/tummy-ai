import { AnalysisListContainer } from '../../components/AnalysisList';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export default function AnalysesScreen() {
  return (
    <ProtectedRoute>
      <AnalysisListContainer />
    </ProtectedRoute>
  );
}
