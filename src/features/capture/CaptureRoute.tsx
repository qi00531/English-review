import { format } from 'date-fns';
import { repository } from '../../db';
import type { LocalDate } from '../../domain/models';
import { requestEnrichment } from '../../api/enrichment';
import { CapturePage } from './CapturePage';
import { DailyListService } from '../../capture/daily-list-service';

const dailyListService = new DailyListService(
  repository,
  () => format(new Date(), 'yyyy-MM-dd') as LocalDate,
);

export function CaptureRoute() {
  return (
    <CapturePage
      enrich={requestEnrichment}
      save={(drafts, allowDuplicates) => dailyListService.saveEntries(drafts, allowDuplicates)}
    />
  );
}
