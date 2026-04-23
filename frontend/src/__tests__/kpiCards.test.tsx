import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICards } from '../features/dashboard/KPICards';

describe('KPICards', () => {
  it('renders skeleton when loading', () => {
    const { container } = render(<KPICards loading summary={undefined} />);
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays income, expenses and net cash flow', () => {
    render(
      <KPICards
        loading={false}
        summary={{ totalIncome: 500000, totalExpenses: 200000, netCashFlow: 300000 }}
      />,
    );
    expect(screen.getByText('$5,000.00')).toBeTruthy();
    expect(screen.getByText('$2,000.00')).toBeTruthy();
    expect(screen.getByText('$3,000.00')).toBeTruthy();
  });

  it('shows $0.00 when summary is undefined', () => {
    render(<KPICards loading={false} summary={undefined} />);
    const zeros = screen.getAllByText('$0.00');
    expect(zeros).toHaveLength(3);
  });
});
