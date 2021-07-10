export type TFinding = {
  version: string;
  type: 'NEW_FINDINGS' | 'UPDATED_FINDINGS';
  findingDetails: {
    link: string;
    findingType: string;
    findingDescription: string;
  }[];
}

export type TMessage = {
  link: string,
  type: string,
  description: string;
}
