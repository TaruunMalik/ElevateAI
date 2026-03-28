import { render, screen } from '@testing-library/react';
import Onboarding from '@/app/(main)/_components/onboarding_form';

describe('Onboarding', () => {
  it('renders industry select label', () => {
    // Provide mock industries as expected by the component
    const industries = [
      { id: 'tech', name: 'Tech' },
      { id: 'finance', name: 'Finance' },
    ];
    render(<Onboarding industries={industries} />);
    // Look for the label element specifically
    expect(screen.getByLabelText(/industry/i)).toBeInTheDocument();
  });
});
