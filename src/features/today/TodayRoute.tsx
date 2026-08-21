import { TodayPage } from './TodayPage';
import { useTodayState } from './useTodayState';
import { useLocation, useNavigate } from 'react-router-dom';
import { repository } from '../../db';
import { CompletionUndo } from './CompletionUndo';

export function TodayRoute() {
  const state = useTodayState();
  const location = useLocation();
  const navigate = useNavigate();
  const completedNodeId = (location.state as { completedNodeId?: string } | null)?.completedNodeId;
  const dismiss = () => navigate('/', { replace: true, state: null });
  return <>
    <TodayPage {...state} />
    {completedNodeId && <CompletionUndo nodeId={completedNodeId} onUndo={(id) => repository.undoCompletion(id)} onDismiss={dismiss} />}
  </>;
}
