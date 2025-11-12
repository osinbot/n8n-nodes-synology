import type { IPairedItemData } from 'n8n-workflow';

export function generatePairedItemData(length: number): IPairedItemData[] {
    return Array.from({ length }, (_, item) => ({
        item,
    }));
}

