import { db } from './client.js';
import { categories, transactions } from './schema.js';

const DEFAULT_CATEGORIES = [
  { name: 'Groceries', type: 'expense' as const, icon: '🛒' },
  { name: 'Transport', type: 'expense' as const, icon: '🚗' },
  { name: 'Dining', type: 'expense' as const, icon: '🍽️' },
  { name: 'Shopping', type: 'expense' as const, icon: '🛍️' },
  { name: 'Utilities', type: 'expense' as const, icon: '💡' },
  { name: 'Healthcare', type: 'expense' as const, icon: '🏥' },
  { name: 'Entertainment', type: 'expense' as const, icon: '🎬' },
  { name: 'Salary', type: 'income' as const, icon: '💰' },
  { name: 'Freelance', type: 'income' as const, icon: '💻' },
  { name: 'Other', type: 'both' as const, icon: '📦' },
];

export function seedCategories() {
  const existing = db.select().from(categories).all();
  if (existing.length === 0) {
    db.insert(categories).values(DEFAULT_CATEGORIES).run();
    console.log('Seeded default categories');
  }
}

function getCategoryId(cats: { id: number; name: string }[], name: string): number {
  const cat = cats.find((c) => c.name === name);
  if (!cat) throw new Error(`Category not found: ${name}`);
  return cat.id;
}

export function seedTransactions() {
  const existing = db.select().from(transactions).all();
  if (existing.length > 0) return;

  const cats = db.select({ id: categories.id, name: categories.name }).from(categories).all();
  if (cats.length === 0) {
    console.log('No categories found — skipping transaction seed');
    return;
  }

  const id = (name: string) => getCategoryId(cats, name);

  // Two months of realistic transactions: March + April 2026.
  // Amounts are integer cents ($49.99 → 4999).
  const rows: {
    type: 'income' | 'expense';
    amount: number;
    categoryId: number;
    date: string;
    description: string;
  }[] = [
    // ── March ──────────────────────────────────────────────────
    // Income
    { type: 'income',  amount: 450000, categoryId: id('Salary'),        date: '2026-03-01', description: 'March salary' },
    { type: 'income',  amount:  75000, categoryId: id('Freelance'),     date: '2026-03-14', description: 'Website project — client payment' },

    // Utilities
    { type: 'expense', amount:   4999, categoryId: id('Utilities'),     date: '2026-03-02', description: 'Internet bill' },
    { type: 'expense', amount:   4400, categoryId: id('Utilities'),     date: '2026-03-03', description: 'Phone plan' },
    { type: 'expense', amount:   7240, categoryId: id('Utilities'),     date: '2026-03-05', description: 'Electricity' },
    { type: 'expense', amount:   2800, categoryId: id('Utilities'),     date: '2026-03-07', description: 'Water bill' },

    // Groceries
    { type: 'expense', amount:   9430, categoryId: id('Groceries'),     date: '2026-03-02', description: 'Weekly grocery run' },
    { type: 'expense', amount:   7850, categoryId: id('Groceries'),     date: '2026-03-09', description: 'Weekly grocery run' },
    { type: 'expense', amount:  10215, categoryId: id('Groceries'),     date: '2026-03-16', description: 'Weekly grocery run + household supplies' },
    { type: 'expense', amount:   8560, categoryId: id('Groceries'),     date: '2026-03-23', description: 'Weekly grocery run' },
    { type: 'expense', amount:   6780, categoryId: id('Groceries'),     date: '2026-03-30', description: 'Weekend grocery run' },

    // Transport
    { type: 'expense', amount:   6200, categoryId: id('Transport'),     date: '2026-03-03', description: 'Gas fill-up' },
    { type: 'expense', amount:   1250, categoryId: id('Transport'),     date: '2026-03-06', description: 'Parking downtown' },
    { type: 'expense', amount:   1840, categoryId: id('Transport'),     date: '2026-03-11', description: 'Uber — night out' },
    { type: 'expense', amount:   5800, categoryId: id('Transport'),     date: '2026-03-17', description: 'Gas fill-up' },
    { type: 'expense', amount:    900, categoryId: id('Transport'),     date: '2026-03-20', description: 'Parking — dentist' },
    { type: 'expense', amount:   1420, categoryId: id('Transport'),     date: '2026-03-27', description: 'Uber — airport pickup' },

    // Dining
    { type: 'expense', amount:   1350, categoryId: id('Dining'),        date: '2026-03-04', description: 'Lunch — sandwich place' },
    { type: 'expense', amount:    680, categoryId: id('Dining'),        date: '2026-03-06', description: 'Coffee & pastry' },
    { type: 'expense', amount:   4720, categoryId: id('Dining'),        date: '2026-03-08', description: 'Dinner with friends — Italian' },
    { type: 'expense', amount:   1490, categoryId: id('Dining'),        date: '2026-03-12', description: 'Lunch — Thai takeout' },
    { type: 'expense', amount:    750, categoryId: id('Dining'),        date: '2026-03-13', description: 'Coffee' },
    { type: 'expense', amount:   5560, categoryId: id('Dining'),        date: '2026-03-15', description: 'Saturday dinner — sushi' },
    { type: 'expense', amount:   1600, categoryId: id('Dining'),        date: '2026-03-19', description: 'Lunch — burger' },
    { type: 'expense', amount:   3890, categoryId: id('Dining'),        date: '2026-03-22', description: 'Dinner — pizza & wine' },
    { type: 'expense', amount:    620, categoryId: id('Dining'),        date: '2026-03-25', description: 'Coffee' },
    { type: 'expense', amount:   2100, categoryId: id('Dining'),        date: '2026-03-29', description: 'Brunch — weekend' },

    // Shopping
    { type: 'expense', amount:   3499, categoryId: id('Shopping'),      date: '2026-03-08', description: 'Amazon — phone charger & cables' },
    { type: 'expense', amount:   8900, categoryId: id('Shopping'),      date: '2026-03-15', description: 'H&M — spring jacket' },
    { type: 'expense', amount:   5240, categoryId: id('Shopping'),      date: '2026-03-22', description: 'Amazon — kitchen items' },

    // Healthcare
    { type: 'expense', amount:   3500, categoryId: id('Healthcare'),    date: '2026-03-01', description: 'Gym membership' },
    { type: 'expense', amount:   9000, categoryId: id('Healthcare'),    date: '2026-03-20', description: 'Dentist checkup' },
    { type: 'expense', amount:   2250, categoryId: id('Healthcare'),    date: '2026-03-24', description: 'Pharmacy — vitamins & cold meds' },

    // Entertainment
    { type: 'expense', amount:   1549, categoryId: id('Entertainment'), date: '2026-03-01', description: 'Netflix subscription' },
    { type: 'expense', amount:   1099, categoryId: id('Entertainment'), date: '2026-03-01', description: 'Spotify subscription' },
    { type: 'expense', amount:   3200, categoryId: id('Entertainment'), date: '2026-03-08', description: 'Cinema — 2 tickets' },
    { type: 'expense', amount:   6500, categoryId: id('Entertainment'), date: '2026-03-21', description: 'Concert tickets' },

    // Other
    { type: 'expense', amount:   1800, categoryId: id('Other'),         date: '2026-03-10', description: 'Haircut' },
    { type: 'expense', amount:   1200, categoryId: id('Other'),         date: '2026-03-28', description: 'Dry cleaning' },

    // ── April ──────────────────────────────────────────────────
    // Income
    { type: 'income',  amount: 450000, categoryId: id('Salary'),        date: '2026-04-01', description: 'April salary' },
    { type: 'income',  amount:  32000, categoryId: id('Freelance'),     date: '2026-04-10', description: 'Logo design — quick gig' },

    // Utilities
    { type: 'expense', amount:   4999, categoryId: id('Utilities'),     date: '2026-04-02', description: 'Internet bill' },
    { type: 'expense', amount:   4400, categoryId: id('Utilities'),     date: '2026-04-03', description: 'Phone plan' },
    { type: 'expense', amount:   6810, categoryId: id('Utilities'),     date: '2026-04-04', description: 'Electricity' },
    { type: 'expense', amount:   2800, categoryId: id('Utilities'),     date: '2026-04-06', description: 'Water bill' },

    // Groceries
    { type: 'expense', amount:   9120, categoryId: id('Groceries'),     date: '2026-04-05', description: 'Weekly grocery run' },
    { type: 'expense', amount:   8370, categoryId: id('Groceries'),     date: '2026-04-12', description: 'Weekly grocery run' },
    { type: 'expense', amount:  11540, categoryId: id('Groceries'),     date: '2026-04-19', description: 'Weekly grocery run + Easter supplies' },

    // Transport
    { type: 'expense', amount:   6050, categoryId: id('Transport'),     date: '2026-04-04', description: 'Gas fill-up' },
    { type: 'expense', amount:   1000, categoryId: id('Transport'),     date: '2026-04-08', description: 'Parking — work meeting' },
    { type: 'expense', amount:   2280, categoryId: id('Transport'),     date: '2026-04-13', description: 'Uber — Easter family visit' },
    { type: 'expense', amount:   5700, categoryId: id('Transport'),     date: '2026-04-18', description: 'Gas fill-up' },

    // Dining
    { type: 'expense', amount:   1420, categoryId: id('Dining'),        date: '2026-04-02', description: 'Lunch — wrap & coffee' },
    { type: 'expense', amount:    710, categoryId: id('Dining'),        date: '2026-04-04', description: 'Coffee' },
    { type: 'expense', amount:   6250, categoryId: id('Dining'),        date: '2026-04-05', description: 'Easter dinner out — family' },
    { type: 'expense', amount:   1580, categoryId: id('Dining'),        date: '2026-04-09', description: 'Lunch — poke bowl' },
    { type: 'expense', amount:    690, categoryId: id('Dining'),        date: '2026-04-11', description: 'Coffee' },
    { type: 'expense', amount:   4300, categoryId: id('Dining'),        date: '2026-04-12', description: 'Dinner — steak house' },
    { type: 'expense', amount:   1750, categoryId: id('Dining'),        date: '2026-04-16', description: 'Lunch — tacos' },
    { type: 'expense', amount:   2990, categoryId: id('Dining'),        date: '2026-04-19', description: 'Dinner & drinks — friends' },
    { type: 'expense', amount:    740, categoryId: id('Dining'),        date: '2026-04-22', description: 'Coffee' },

    // Shopping
    { type: 'expense', amount:  12900, categoryId: id('Shopping'),      date: '2026-04-06', description: 'Running shoes' },
    { type: 'expense', amount:   4730, categoryId: id('Shopping'),      date: '2026-04-14', description: 'Amazon — home office stuff' },

    // Healthcare
    { type: 'expense', amount:   3500, categoryId: id('Healthcare'),    date: '2026-04-01', description: 'Gym membership' },
    { type: 'expense', amount:   1890, categoryId: id('Healthcare'),    date: '2026-04-17', description: 'Pharmacy — allergy meds' },

    // Entertainment
    { type: 'expense', amount:   1549, categoryId: id('Entertainment'), date: '2026-04-01', description: 'Netflix subscription' },
    { type: 'expense', amount:   1099, categoryId: id('Entertainment'), date: '2026-04-01', description: 'Spotify subscription' },
    { type: 'expense', amount:   2800, categoryId: id('Entertainment'), date: '2026-04-11', description: 'Cinema — 2 tickets' },

    // Other
    { type: 'expense', amount:   1800, categoryId: id('Other'),         date: '2026-04-07', description: 'Haircut' },
    { type: 'income',  amount:   5000, categoryId: id('Other'),         date: '2026-04-15', description: 'Sold old books online' },
    { type: 'expense', amount:   2400, categoryId: id('Other'),         date: '2026-04-20', description: 'Birthday card & gift wrap' },
  ];

  const now = new Date().toISOString();
  db.insert(transactions)
    .values(rows.map((r) => ({ ...r, createdAt: now, updatedAt: now })))
    .run();

  console.log(`Seeded ${rows.length} transactions`);
}
