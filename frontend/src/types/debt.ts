export enum DebtType {
  NOT_ANALYSED = "NOT_ANALYSED",
  NOT_DEBT = "NOT_DEBT",
  CODE_DESIGN = "CODE_DESIGN",
  DOCUMENTATION = "DOCUMENTATION",
  TEST = "TEST",
  REQUIREMENT = "REQUIREMENT",
  DEBT = "DEBT"
}

export interface RestDebtStatistics {
  amount: number;
  debt: number;
  perType: Partial<Record<DebtType, number>>;
}
