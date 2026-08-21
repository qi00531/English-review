export type LocalDate = `${number}-${number}-${number}`;

export type ReviewNode = {
  id: string;
  listId: string;
  dueDate: LocalDate;
  completedAt: string | null;
  sequence: number;
};

export const REVIEW_OFFSETS = [1, 2, 4, 7, 15, 30] as const;
