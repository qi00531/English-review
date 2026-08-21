import { format } from 'date-fns';
import { repository } from '../../db';
import type { LocalDate } from '../../domain/models';
import { requestEnrichment } from '../../api/enrichment';
import { CapturePage } from './CapturePage';
import { useTodayState } from '../today/useTodayState';
import { CaptureGate } from './CaptureGate';

export function CaptureRoute() {
  const todayState = useTodayState();
  return (
    <CaptureGate loading={todayState.loading} dueCount={todayState.due.length}>
      <CapturePage
        enrich={requestEnrichment}
        save={(today, drafts) => repository.saveEntries(today, drafts)}
        today={format(new Date(), 'yyyy-MM-dd') as LocalDate}
      />
    </CaptureGate>
  );
}
