import { TodayPage } from './TodayPage';
import { useTodayState } from './useTodayState';

export function TodayRoute() {
  const state = useTodayState();
  return <TodayPage {...state} />;
}
