import { Preferences } from '@capacitor/preferences';

export interface Identifiable {
    id: string;
}

export class BasePracticeRepository<T extends Identifiable> {
    private storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = storageKey;
    }

    async getAll(): Promise<T[]> {
        const { value } = await Preferences.get({ key: this.storageKey });
        if (!value) return [];
        try {
            return JSON.parse(value);
        } catch (e) {
            console.error(`Error parsing ${this.storageKey}`, e);
            return [];
        }
    }

    async saveAll(items: T[]): Promise<void> {
        await Preferences.set({
            key: this.storageKey,
            value: JSON.stringify(items)
        });
    }

    async add(item: T): Promise<void> {
        const items = await this.getAll();
        items.unshift(item); // Add to top/front typically for logs
        await this.saveAll(items);
    }

    async update(item: T): Promise<void> {
        let items = await this.getAll();
        items = items.map(i => i.id === item.id ? item : i);
        await this.saveAll(items);
    }

    async delete(id: string): Promise<void> {
        let items = await this.getAll();
        items = items.filter(i => i.id !== id);
        await this.saveAll(items);
    }
}
