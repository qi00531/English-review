import { format } from 'date-fns';
import { repository } from '../../db';
import type { LocalDate } from '../../domain/models';
import { requestEnrichment } from '../../api/enrichment';
import { CapturePage } from './CapturePage';

export function CaptureRoute() {
  return (
    <CapturePage
      enrich={requestEnrichment}
      save={(today, drafts) => repository.saveEntries(today, drafts)}
      today={format(new Date(), 'yyyy-MM-dd') as LocalDate}
    />
  );
}
