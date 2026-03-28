import { render, screen } from '@testing-library/react';
import { EntryForm } from '@/app/(main)/resume/_components/entry-form';

describe('EntryForm', () => {
  it('renders add button', () => {
    render(<EntryForm type="experience" entries={[]} onChange={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
